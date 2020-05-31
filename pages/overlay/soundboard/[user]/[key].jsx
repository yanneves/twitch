import React, { useState, useEffect } from "react"
import { useRouter } from "next/router"

import Redemptions from "../../../../components/Redemptions"
import Player from "../../../../components/Player"

export default () => {
  const [errors, setErrors] = useState([])
  const [auth, setAuth] = useState(null)
  const [sound, setSound] = useState(null)

  const router = useRouter()
  const { user, key } = router.query

  useEffect(() => {
    let cancelled = false

    if (!user || !key) return

    const request = async () => {
      let overlay, channel

      try {
        const fetchOverlay = await window.fetch(
          `/api/getOverlay?user=${user}&key=${key}`
        )
        overlay = await fetchOverlay.json()

        const fetchChannel = await window.fetch(
          "https://api.twitch.tv/kraken/channel",
          {
            headers: {
              "Client-ID": process.env.NEXT_PUBLIC_TWITCH_CLIENT_ID,
              Accept: "application/vnd.twitchtv.v5+json",
              Authorization: `OAuth ${overlay?.data.twitch.access_token}`,
            },
          }
        )
        const channelData = await fetchChannel.json()
        channel = channelData?._id
      } catch {
        return setErrors([...errors, "Failed to fetch overlay data"])
      }

      if (!cancelled) {
        const { error, data } = overlay

        if (error) {
          return setErrors([...errors, error])
        }

        setAuth({
          ...data?.twitch,
          channel,
        })
      }
    }

    request()

    return () => (cancelled = true)
  }, [user, key])

  return (
    <>
      {errors.length ? errors.map((error) => <p key={error}>{error}</p>) : null}
      <Player sound={sound} onEnded={() => setSound(null)} />
      {auth ? <Redemptions auth={auth} onChange={setSound} /> : null}
    </>
  )
}
