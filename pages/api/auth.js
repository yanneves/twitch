import fetch from 'node-fetch'

import createErrorHandler from '../../lib/createErrorHandler'
import verify from '../../lib/jwkVerify'
import { createOrUpdateOverlay } from '../../lib/database'

// Twitch API OIDC Authorization Code Flow
// https://dev.twitch.tv/docs/authentication/getting-tokens-oidc#oidc-authorization-code-flow
const generateServerAuthEndpoint = (token) => {
  const {
    NEXT_PUBLIC_TWITCH_REDIRECT_URI: TWITCH_REDIRECT_URI,
    NEXT_PUBLIC_TWITCH_CLIENT_ID: TWITCH_CLIENT_ID,
    TWITCH_CLIENT_SECRET,
  } = process.env

  const url = 'https://id.twitch.tv/oauth2/token'
  const params = [
    ['client_id', TWITCH_CLIENT_ID],
    ['client_secret', TWITCH_CLIENT_SECRET],
    ['redirect_uri', TWITCH_REDIRECT_URI],
    ['code', token],
    ['grant_type', 'authorization_code'],
  ]

  return `${url}?${params.map(([key, val]) => `${key}=${val}`).join('&')}`
}

const getLogin = async (req, { badRequest, serverError }) => {
  let data
  let decoded

  const { token } = req.query

  if (!token) {
    throw badRequest('Missing token in request')
  }

  try {
    const twitch = await fetch(generateServerAuthEndpoint(token), {
      method: 'POST',
    })
    data = await twitch.json()
  } catch {
    throw serverError('Failed to connect to Twitch')
  }

  if (data.status >= 400) {
    throw serverError('Failed to authenticate with Twitch')
  }

  try {
    decoded = await verify(data.id_token)
  } catch (e) {
    throw serverError('Failed to verify integrity of Twitch JSONWebKey')
  }

  const { preferred_username: preferredUsername } = decoded

  return { username: preferredUsername.toLowerCase(), ...data }
}

export default async (req, res) => {
  const errorHandler = createErrorHandler(res)
  const { serverError } = errorHandler

  res.setHeader('Content-Type', 'application/json')

  try {
    const login = await getLogin(req, errorHandler)
    const data = await createOrUpdateOverlay(login)

    res.statusCode = 200
    return res.end(
      JSON.stringify({
        status: res.statusCode,
        data,
      })
    )
  } catch (e) {
    if (e?.handled) return null
    return serverError('Failed to authenticate and create overlay')
  }
}
