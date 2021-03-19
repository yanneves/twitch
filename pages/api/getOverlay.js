import fetch from 'node-fetch'

import createErrorHandler from '../../lib/createErrorHandler'
import { readOverlay, updateOverlay } from '../../lib/database'

// Twitch API OIDC Authorization Code Flow
// https://dev.twitch.tv/docs/authentication#refreshing-access-tokens
const generateServerRefreshEndpoint = (refreshToken) => {
  const {
    NEXT_PUBLIC_TWITCH_CLIENT_ID: TWITCH_CLIENT_ID,
    TWITCH_CLIENT_SECRET,
  } = process.env

  const url = 'https://id.twitch.tv/oauth2/token'
  const params = [
    ['client_id', TWITCH_CLIENT_ID],
    ['client_secret', TWITCH_CLIENT_SECRET],
    ['refresh_token', refreshToken],
    ['grant_type', 'refresh_token'],
  ]

  return `${url}?${params.map(([key, val]) => `${key}=${val}`).join('&')}`
}

const refreshSessionIfNeeded = async (overlay, { serverError }) => {
  const delta = overlay.twitch.expires - Date.now()

  if (delta < 10000) {
    // Session expires within the next 10 seconds
    let data

    const { refresh_token: refreshToken } = overlay.twitch

    try {
      const twitch = await fetch(generateServerRefreshEndpoint(refreshToken), {
        method: 'POST',
      })
      data = await twitch.json()
    } catch {
      throw serverError('Failed to connect to Twitch')
    }

    if (data.status >= 400) {
      throw serverError('Failed to authenticate with Twitch')
    }

    return updateOverlay(overlay, data)
  }

  return overlay
}

export default async (req, res) => {
  const errorHandler = createErrorHandler(res)
  const { badRequest, notFound, serverError } = errorHandler
  const { key, user } = req.query

  if (!key) {
    return badRequest("Missing 'key' in request")
  }

  if (!user) {
    return badRequest("Missing 'user' in request")
  }

  try {
    let overlay = await readOverlay(key, user)

    if (!overlay) {
      return notFound('Overlay does not exist')
    }

    overlay = await refreshSessionIfNeeded(overlay, errorHandler)

    res.statusCode = 200
    return res.end(
      JSON.stringify({
        status: res.statusCode,
        data: overlay,
      })
    )
  } catch (e) {
    if (e?.handled) return null
    return serverError('Failed to get overlay')
  }
}
