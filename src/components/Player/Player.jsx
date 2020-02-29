import React from "react"
import ReactAudioPlayer from "react-audio-player"

export default ({ sound, onEnded }) =>
  sound ? (
    <ReactAudioPlayer src={sound} onEnded={onEnded} controls autoPlay />
  ) : null
