import React, { useState } from "react"

import Player from "./components/Player"
import Files from "./components/Files"

export default () => {
  const [sound, setSound] = useState(null)

  const onChangeHandler = newSound => {
    setSound(newSound)
  }

  const onEndedHandler = () => {
    setSound(null)
  }

  return (
    <>
      <Player sound={sound} onEnded={onEndedHandler} />
      <Files onChange={onChangeHandler} />
    </>
  )
}
