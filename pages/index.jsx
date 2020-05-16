import React, { useState, useEffect } from "react"

import Player from "../components/Player"
import Files from "../components/Files"

export default () => {
  const [sound, setSound] = useState(null)
  const [volume, setVolume] = useState(null)

  useEffect(() => {
    // Parses ?volume= from url
    const { volume: userVolume } = Object.fromEntries(
      location.search
        .substr(1)
        .split("&")
        .map(pair => pair.split("="))
    )

    if (userVolume) {
      setVolume(parseFloat(userVolume, 10))
    }
  }, [])

  return (
    <>
      <Player sound={sound} volume={volume} onEnded={() => setSound(null)} />
      <Files onChange={setSound} />
    </>
  )
}
