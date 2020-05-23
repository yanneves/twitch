import fetch from "node-fetch"

import createErrorHandler from "../../lib/createErrorHandler"
import verify from "../../lib/jwkVerify"
import { createOverlay } from "../../lib/db"

// Twitch API OIDC Authorization Code Flow
// https://dev.twitch.tv/docs/authentication/getting-tokens-oidc#oidc-authorization-code-flow
const generateServerAuthEndpoint = (token) => {
  const {
    NEXT_PUBLIC_TWITCH_REDIRECT_URI: TWITCH_REDIRECT_URI,
    NEXT_PUBLIC_TWITCH_CLIENT_ID: TWITCH_CLIENT_ID,
    TWITCH_CLIENT_SECRET,
  } = process.env

  const url = "https://id.twitch.tv/oauth2/token"
  const params = [
    ["client_id", TWITCH_CLIENT_ID],
    ["client_secret", TWITCH_CLIENT_SECRET],
    ["redirect_uri", TWITCH_REDIRECT_URI],
    ["code", token],
    ["grant_type", "authorization_code"],
  ]

  return `${url}?${params.map(([key, val]) => `${key}=${val}`).join("&")}`
}

const getLogin = async (req, { badRequest, serverError }) => {
  let data, decoded

  const { token } = req.query

  if (!token) {
    return badRequest("Missing token in request")
  }

  try {
    const twitch = await fetch(generateServerAuthEndpoint(token), {
      method: "POST",
    })
    data = await twitch.json()
  } catch {
    return serverError("Failed to connect to Twitch")
  }

  if (data.status >= 400) {
    return serverError("Failed to authenticate with Twitch")
  }

  try {
    decoded = await verify(data.id_token)
  } catch (e) {
    console.error(e)
    return serverError("Failed to verify integrity of Twitch JSONWebKey")
  }

  const { preferred_username } = decoded

  return { username: preferred_username.toLowerCase(), ...data }
}

export default async (req, res) => {
  const errorHandler = createErrorHandler(res)

  res.setHeader("Content-Type", "application/json")

  const login = await getLogin(req, errorHandler)

  res.statusCode = 200
  res.end(
    JSON.stringify({
      status: res.statusCode,
      data: createOverlay(login),
    })
  )
}
