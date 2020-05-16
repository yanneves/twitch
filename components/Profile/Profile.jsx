import React, { useState, useEffect } from "react"

export default () => {
  const [token, setToken] = useState(null)
  const [profile, setProfile] = useState(null)
  const [errors, setErrors] = useState([])

  useEffect(() => {
    let cancelled = false

    const query = window.location.search.substr(1).split("&")

    if (!query.length) return

    const params = query.reduce((memo, param) => {
      const [key, val] = param.split("=")
      return { ...memo, [key]: val }
    }, {})

    const { state: session } = params

    if (session !== window.sessionStorage.getItem("uuid")) {
      return setErrors([...errors, "Login failed, session mismatch"])
    }

    const request = async () => {
      let json
      const { code } = params

      if (!code) return

      try {
        const res = await window.fetch(`/api/auth?token=${code}`)
        json = await res.json()
      } catch {
        return setErrors([...errors, "Failed to authenticate with our server"])
      }

      if (!cancelled) {
        const { access_token: token } = json
        setToken(token)
      }
    }

    request()

    return () => (cancelled = true)
  }, [])

  useEffect(() => {
    if (!token) return

    let cancelled = false

    const request = async () => {
      const res = await window.fetch("https://id.twitch.tv/oauth2/userinfo", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      const json = await res.json()

      if (!cancelled) {
        setProfile(json)
      }
    }

    request()

    return () => (cancelled = true)
  }, [token])

  return (
    <>
      {errors.length ? (
        <div>
          {errors.map(error => (
            <p key={error}>{error}</p>
          ))}
        </div>
      ) : null}
      {profile ? (
        <div>
          <figure>
            <img src={profile.picture} />
            <figcaption>{profile.preferred_username}</figcaption>
          </figure>
        </div>
      ) : null}
    </>
  )
}
