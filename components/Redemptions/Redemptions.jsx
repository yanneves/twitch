import React, { useState, useEffect } from "react"
import ReconnectingWebSocket from "reconnecting-websocket"

import sounds from "../../public/sounds/index.json"

const mapping = {
  "!uwu": "bear",
  "!hawoo": "floof",
  "!wannabe": "wannabe",
}

const message = {
  type: "reward-redeemed",
  data: {
    timestamp: "2019-11-12T01:29:34.98329743Z",
    redemption: {
      id: "9203c6f0-51b6-4d1d-a9ae-8eafdb0d6d47",
      user: {
        id: "30515034",
        login: "davethecust",
        display_name: "davethecust",
      },
      channel_id: "30515034",
      redeemed_at: "2019-12-11T18:52:53.128421623Z",
      reward: {
        id: "6ef17bb2-e5ae-432e-8b3f-5ac4dd774668",
        channel_id: "30515034",
        title: "!hawoo",
        prompt: "cleanside's finest \n",
        cost: 10,
        is_user_input_required: true,
        is_sub_only: false,
        image: {
          url_1x:
            "https://static-cdn.jtvnw.net/custom-reward-images/30515034/6ef17bb2-e5ae-432e-8b3f-5ac4dd774668/7bcd9ca8-da17-42c9-800a-2f08832e5d4b/custom-1.png",
          url_2x:
            "https://static-cdn.jtvnw.net/custom-reward-images/30515034/6ef17bb2-e5ae-432e-8b3f-5ac4dd774668/7bcd9ca8-da17-42c9-800a-2f08832e5d4b/custom-2.png",
          url_4x:
            "https://static-cdn.jtvnw.net/custom-reward-images/30515034/6ef17bb2-e5ae-432e-8b3f-5ac4dd774668/7bcd9ca8-da17-42c9-800a-2f08832e5d4b/custom-4.png",
        },
        default_image: {
          url_1x:
            "https://static-cdn.jtvnw.net/custom-reward-images/default-1.png",
          url_2x:
            "https://static-cdn.jtvnw.net/custom-reward-images/default-2.png",
          url_4x:
            "https://static-cdn.jtvnw.net/custom-reward-images/default-4.png",
        },
        background_color: "#00C7AC",
        is_enabled: true,
        is_paused: false,
        is_in_stock: true,
        max_per_stream: { is_enabled: false, max_per_stream: 0 },
        should_redemptions_skip_request_queue: true,
      },
      user_input: "yeooo",
      status: "FULFILLED",
    },
  },
}

const getRandomSoundFromBoard = (board) => {
  const keys = Object.keys(board)
  const randomKey = keys[Math.floor(Math.random() * keys.length)]
  return board[randomKey]
}

export default ({ auth, onChange }) => {
  const onClick = () => {
    const redemption = message?.data?.redemption.reward.title

    if (redemption) {
      const board = sounds[mapping[redemption]]
      onChange(getRandomSoundFromBoard(board))
    }
  }

  useEffect(() => {
    let ping, pong
    const clearPingPong = () => {
      window.clearTimeout(ping)
      window.clearTimeout(pong)
    }

    const rws = new ReconnectingWebSocket("wss://pubsub-edge.twitch.tv")

    rws.addEventListener("open", () => {
      rws.send(JSON.stringify({ type: "PING" }))
      rws.send(
        JSON.stringify({
          type: "LISTEN",
          data: {
            topics: [`channel-points-channel-v1.${auth.channel}`],
            auth_token: auth.access_token,
          },
        })
      )
    })

    rws.addEventListener("close", () => {
      clearPingPong()
    })

    rws.addEventListener("message", (message) => {
      try {
        const data = JSON.parse(message.data)

        if (data.type === "PONG") {
          clearPingPong()
          ping = setTimeout(() => {
            rws.send(JSON.stringify({ type: "PING" }))
            pong = setTimeout(() => {
              rws.reconnect()
            }, 10000)
          }, 300 * 1000)
        } else if (data.type === "RECONNECT") {
          rws.reconnect()
        }
      } catch (err) {
        console.error(err)
      }
    })
    rws.addEventListener("error", (...args) => console.dir(args))

    return () => {
      rws?.close()
      clearPingPong()
    }
  }, [])

  return null
}
