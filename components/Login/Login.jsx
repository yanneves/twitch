import React from "react"

const generateAuthEndpoint = () => {
  const url = "https://api.twitch.tv/kraken/oauth2/authorize"
  const params = [
    ["client_id", process.env.NEXT_PUBLIC_TWITCH_CLIENT_ID],
    ["redirect_uri", process.env.NEXT_PUBLIC_TWITCH_REDIRECT_URI],
    ["response_type", "code"],
    ["scope", "openid channel_read channel:read:redemptions"],
    [
      "claims",
      JSON.stringify({ userinfo: { picture: null, preferred_username: null } }),
    ],
  ]

  return `${url}?${params.map(([key, val]) => `${key}=${val}`).join("&")}`
}

export default () => {
  return (
    <p>
      <a href={generateAuthEndpoint()}>Log in with Twitch</a>
    </p>
  )
}
