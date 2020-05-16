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

export default () => {
  const [uniqueId, setUniqueId] = useState(null)
  const [response, setResponse] = useState(null)

  useEffect(() => {
    setUniqueId(getOrSetSession())
  }, [])

  useEffect(() => {
    let cancelled = false

    const request = async () => {
      const res = await window.fetch("/api/hello")
      const text = await res.text()

      if (!cancelled) {
        setResponse(text)
      }
    }

    request()

    return () => (cancelled = true)
  }, [])

  return (
    <>
      <p>{uniqueId}</p>
      <p>{response ? response : null}</p>
    </>
  )
}

// GET https://id.twitch.tv/oauth2/authorize ?client_id=<your client ID> &redirect_uri=<your registered redirect URI> &response_type=code &scope=<space-separated list of scopes> &claims=<JSON object specifying requested claims>

// sessionStorage.twitchOAuthState = nonce(15)
// var url =
//   "https://api.twitch.tv/kraken/oauth2/authorize" +
//   "?response_type=token" +
//   "&client_id=" +
//   clientId +
//   "&redirect_uri=" +
//   redirectURI +
//   "&state=" +
//   sessionStorage.twitchOAuthState +
//   "&scope=" +
//   scope
// return url
