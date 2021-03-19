import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'

import Redemptions from '../../../../components/Redemptions'
import Player from '../../../../components/Player'

const Overlay = () => {
  const [errors, setErrors] = useState([])
  const [auth, setAuth] = useState(null)
  const [sound, setSound] = useState(null)

  const router = useRouter()
  const { user, key } = router.query

  useEffect(() => {
    let cancelled = false

    if (!user || !key) return undefined

    const request = async () => {
      let overlay
      let channel

      try {
        const fetchOverlay = await fetch(
          `/api/getOverlay?user=${user}&key=${key}`
        )
        overlay = await fetchOverlay.json()

        const fetchChannel = await fetch(
          'https://api.twitch.tv/kraken/channel',
          {
            headers: {
              'Client-ID': process.env.NEXT_PUBLIC_TWITCH_CLIENT_ID,
              Accept: 'application/vnd.twitchtv.v5+json',
              Authorization: `OAuth ${overlay?.data.twitch.access_token}`,
            },
          }
        )
        const channelData = await fetchChannel.json()
        // eslint-disable-next-line no-underscore-dangle
        channel = channelData?._id
      } catch {
        return setErrors((state) => [...state, 'Failed to fetch overlay data'])
      }

      if (!cancelled) {
        const { error, data } = overlay

        if (error) {
          return setErrors((state) => [...state, error])
        }

        setAuth({
          ...data?.twitch,
          channel,
        })
      }

      return null
    }

    request()

    return () => {
      cancelled = true
    }
  }, [user, key, setAuth, setErrors])

  return (
    <>
      {errors.length ? errors.map((error) => <p key={error}>{error}</p>) : null}
      <Player sound={sound} onEnded={() => setSound(null)} />
      {/* TODO: since <Redemptions /> doesn't render anything, this should instead live in application state middleware or a custom React hook */}
      {auth ? <Redemptions auth={auth} onChange={setSound} /> : null}
    </>
  )
}

export default Overlay
