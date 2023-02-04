import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'

import Redemptions from '../../../../components/Redemptions'
import Player from '../../../../components/Player'

function Overlay() {
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

        const fetchUser = await fetch('https://api.twitch.tv/helix/users', {
          headers: {
            'Client-ID': process.env.NEXT_PUBLIC_TWITCH_CLIENT_ID,
            Authorization: `Bearer ${overlay?.data.twitch.access_token}`,
          },
        })

        const { data } = await fetchUser.json()
        channel = data[0]?.id
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
