import React, { useState, useEffect } from "react"

export default ({ data }) => {
  const [picture, setPicture] = useState(null)
  const [errors, setErrors] = useState([])

  useEffect(() => {
    let cancelled = false

    const request = async () => {
      let json

      const { twitch_access_token } = data

      try {
        const res = await window.fetch(`https://id.twitch.tv/oauth2/userinfo`, {
          headers: {
            Authorization: `Bearer ${twitch_access_token}`,
          },
        })
        json = await res.json()
      } catch {
        if (!cancelled) {
          return setErrors([...errors, "Failed to fetch user info"])
        }
      }

      if (!cancelled) {
        const { picture } = json
        setPicture(picture)
      }
    }

    request()

    return () => (cancelled = true)
  }, [])

  return (
    <>
      {errors.length ? errors.map((error) => <p key={error}>{error}</p>) : null}
      <figure>
        {picture ? <img src={picture} /> : null}
        <figcaption>{data.user}</figcaption>
      </figure>
    </>
  )
}
