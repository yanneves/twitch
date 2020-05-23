import React, { useState, useEffect } from "react"
import Link from "next/link"

export default () => {
  const [overlays, setOverlays] = useState([])
  const [errors, setErrors] = useState([])

  useEffect(() => {
    let cancelled = false

    const query = window.location.search.substr(1).split("&")

    if (!query.length) return

    const params = query.reduce((memo, param) => {
      const [key, val] = param.split("=")
      return { ...memo, [key]: val }
    }, {})

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
        const { error, data } = json

        if (error) {
          return setErrors([...errors, `${error}`])
        }

        setOverlays(data)
      }
    }

    request()

    return () => (cancelled = true)
  }, [])

  return (
    <>
      {errors.length ? errors.map((error) => <p key={error}>{error}</p>) : null}
      <ul>
        {overlays.map(({ key, user }) => (
          <li key={key}>
            <Link href={`/overlay/soundboard/${user}/${key}`}>
              <a>{`/overlay/soundboard/${user}/${key}`}</a>
            </Link>
          </li>
        ))}
      </ul>
    </>
  )
}
