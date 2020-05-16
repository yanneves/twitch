import React from "react"
import ReactAudioPlayer from "react-audio-player"

export default ({ sound, volume = 1, onEnded }) =>
  sound ? (
    <ReactAudioPlayer src={sound} volume={volume} onEnded={onEnded} autoPlay />
  ) : null
