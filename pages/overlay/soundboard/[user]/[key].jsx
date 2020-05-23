import React, { useState, useEffect } from "react"
import { useRouter } from "next/router"

import Player from "../../../../components/Player"
import Files from "../../../../components/Files"

export default () => {
  const [sound, setSound] = useState(null)
  const [volume, setVolume] = useState(null)

  const router = useRouter()
  const { user, key } = router.query

  useEffect(() => {
    // Parses ?volume= from url
    const { volume: userVolume } = Object.fromEntries(
      location.search
        .substr(1)
        .split("&")
        .map((pair) => pair.split("="))
    )

    if (userVolume) {
      setVolume(parseFloat(userVolume, 10))
    }
  }, [])

  return (
    <>
      <dl>
        <dt>User</dt>
        <dd>{user}</dd>
        <dt>Key</dt>
        <dd>{key}</dd>
      </dl>
      <hr />
      <Player sound={sound} volume={volume} onEnded={() => setSound(null)} />
      {/* TODO: replace with channel points integration */}
      <Files onChange={setSound} />
    </>
  )
}
