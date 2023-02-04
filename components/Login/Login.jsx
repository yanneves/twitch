import React from 'react'

const generateAuthEndpoint = () => {
  const url = 'https://id.twitch.tv/oauth2/authorize'
  const params = [
    ['client_id', process.env.NEXT_PUBLIC_TWITCH_CLIENT_ID],
    ['redirect_uri', process.env.NEXT_PUBLIC_TWITCH_REDIRECT_URI],
    ['response_type', 'code'],
    ['scope', 'openid channel:read:redemptions'],
    [
      'claims',
      JSON.stringify({ userinfo: { picture: null, preferred_username: null } }),
    ],
  ]

  return `${url}?${params.map(([key, val]) => `${key}=${val}`).join('&')}`
}

function Login() {
  return (
    <p>
      <a href={generateAuthEndpoint()}>Log in with Twitch</a>
    </p>
  )
}

export default Login
