import fetch from "node-fetch"

const generateServerAuthEndpoint = token => {
  const {
    NEXT_PUBLIC_TWITCH_REDIRECT_URI: TWITCH_REDIRECT_URI,
    NEXT_PUBLIC_TWITCH_CLIENT_ID: TWITCH_CLIENT_ID,
    TWITCH_CLIENT_SECRET
  } = process.env

  const url = "https://id.twitch.tv/oauth2/token"
  const params = [
    ["client_id", TWITCH_CLIENT_ID],
    ["client_secret", TWITCH_CLIENT_SECRET],
    ["redirect_uri", TWITCH_REDIRECT_URI],
    ["code", token],
    ["grant_type", "authorization_code"]
  ]

  return `${url}?${params.map(([key, val]) => `${key}=${val}`).join("&")}`
}

export default async (req, res) => {
  let json
  const { token } = req.query

  res.setHeader("Content-Type", "application/json")

  if (!token) {
    res.statusCode = 400
    return res.end(
      JSON.stringify({
        status: res.statusCode,
        error: "Missing token in request"
      })
    )
  }

  try {
    const twitch = await fetch(generateServerAuthEndpoint(token), {
      method: "POST"
    })
    json = await twitch.json()
  } catch {
    res.statusCode = 500
    return res.end(
      JSON.stringify({
        status: res.statusCode,
        error: "Failed to connect to Twitch"
      })
    )
  }

  if (json.status >= 400) {
    res.statusCode = 500
    return res.end(
      JSON.stringify({
        status: res.statusCode,
        error: "Failed to authenticate with Twitch"
      })
    )
  }

  // TODO: 5) Validate the ID token. This is an important security measure to ensure the authenticity of the token and guard against any tampering.

  res.statusCode = 200
  res.end(
    JSON.stringify({
      status: res.statusCode,
      ...json
    })
  )
}
