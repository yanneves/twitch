import React, { useState, useEffect } from "react"
import { useRouter } from "next/router"
import Link from "next/link"

import Profile from "../../../../components/Profile"
import Player from "../../../../components/Player"
import Files from "../../../../components/Files"

export default () => {
  const [errors, setErrors] = useState([])
  const [overlay, setOverlay] = useState(null)
  const [sound, setSound] = useState(null)

  const router = useRouter()
  const { user, key } = router.query

  useEffect(() => {
    let cancelled = false

    if (!user || !key) return

    const request = async () => {
      let json

      try {
        const res = await window.fetch(
          `/api/getOverlay?user=${user}&key=${key}`
        )
        json = await res.json()
      } catch {
        return setErrors([...errors, "Failed to fetch overlay data"])
      }

      if (!cancelled) {
        const { error, data } = json

        if (error) {
          return setErrors([...errors, error])
        }

        setOverlay(data)
      }
    }

    request()

    return () => (cancelled = true)
  }, [user, key])

  return (
    <>
      {overlay ? <Profile data={overlay} /> : null}
      <Link href="/">
        <a>Back home</a>
      </Link>
      <hr />
      <Player sound={sound} onEnded={() => setSound(null)} />
      {/* TODO: replace with channel points integration */}
      <Files onChange={setSound} />
    </>
  )
}
