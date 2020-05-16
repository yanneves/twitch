import React from "react"

import sounds from "../../public/sounds/index.json"

const getRandomSoundFromBoard = board => {
  const keys = Object.keys(board)
  const randomKey = keys[Math.floor(Math.random() * keys.length)]
  return board[randomKey]
}

export default ({ onChange }) => (
  <ul>
    {Object.entries(sounds).map(([name, board]) => (
      <li key={name}>
        <button onClick={() => onChange(getRandomSoundFromBoard(board))}>
          {name}
        </button>
      </li>
    ))}
  </ul>
)
