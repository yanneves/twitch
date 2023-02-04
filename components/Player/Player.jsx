import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import ReactAudioPlayer from 'react-audio-player'

function Player({ sound, onEnded }) {
  const [volume, setVolume] = useState(1)

  useEffect(() => {
    // Parses ?volume= from url
    const { volume: userVolume } = Object.fromEntries(
      window.location.search
        .substr(1)
        .split('&')
        .map((pair) => pair.split('='))
    )

    if (userVolume) {
      setVolume(parseFloat(userVolume, 10))
    }
  }, [])

  return sound ? (
    <ReactAudioPlayer src={sound} volume={volume} onEnded={onEnded} autoPlay />
  ) : null
}

Player.propTypes = {
  sound: PropTypes.string,
  onEnded: PropTypes.func,
}

Player.defaultProps = {
  sound: null,
  onEnded: null,
}

export default Player
