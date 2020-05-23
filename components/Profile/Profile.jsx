import React, { useState, useEffect } from "react"

export default () => {
  const [token, setToken] = useState(null)
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
        if (!cancelled) {
          return setErrors([
            ...errors,
            "Failed to authenticate with our server",
          ])
        }
      }

      if (!cancelled) {
        const { error, ...token } = json

        if (error) {
          return setErrors([...errors, `${error}`])
        }

        setToken(token)
      }
    }

    request()

    return () => (cancelled = true)
  }, [])

  return (
    <>
      {errors.length ? errors.map((error) => <p key={error}>{error}</p>) : null}
      {token ? <pre>{JSON.stringify(token, null, 2)}</pre> : null}
    </>
  )
}
