import React from "react"

import uwuu from "../../../sounds/floof/uwuu.ogg"
import bear from "../../../sounds/bear/bear.ogg"

export default ({ onChange }) => (
  <ul>
    <li>
      <p>Floof:</p>
      <ul>
        <li>
          <button onClick={() => onChange(uwuu)}>uwuu</button>
        </li>
      </ul>
    </li>
    <li>
      <p>Bear:</p>
      <ul>
        <li>
          <button onClick={() => onChange(bear)}>bear</button>
        </li>
      </ul>
    </li>
  </ul>
)
