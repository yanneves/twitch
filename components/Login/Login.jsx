import React, { useState, useEffect } from "react"
import { v4 as uuidv4 } from "uuid"

const getOrSetSession = () => {
  let uuid = window.sessionStorage.getItem("uuid")

  if (!uuid) {
    window.sessionStorage.setItem("uuid", uuidv4())
    uuid = window.sessionStorage.getItem("uuid")
  }

  return uuid
}

const generateAuthEndpoint = state => {
  const url = "https://api.twitch.tv/kraken/oauth2/authorize"
  const params = [
    ["client_id", process.env.NEXT_PUBLIC_TWITCH_CLIENT_ID],
    ["redirect_uri", process.env.NEXT_PUBLIC_TWITCH_REDIRECT_URI],
    ["response_type", "code"],
    ["scope", "openid"],
    [
      "claims",
      JSON.stringify({ userinfo: { picture: null, preferred_username: null } })
    ],
    ["state", state]
  ]

  return `${url}?${params.map(([key, val]) => `${key}=${val}`).join("&")}`
}

export default () => {
  const [session, setSession] = useState(null)

  useEffect(() => {
    setSession(getOrSetSession())
  }, [])

  return (
    <p>
      {session ? (
        <a href={generateAuthEndpoint(session)}>Login</a>
      ) : (
        <span>Loading…</span>
      )}
    </p>
  )
}
