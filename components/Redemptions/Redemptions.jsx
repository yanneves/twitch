import { useEffect } from 'react'
import ReconnectingWebSocket from 'reconnecting-websocket'

import sounds from '../../public/sounds/index.json'

const mapping = {
  '🐻': 'bear',
  '🐺': 'floof',
  'THIS IS BEANS': 'thisisbeans',
  'Hydrate!': 'hydrate',
  '!yay': 'yay',
  '!AAAAAaaaaAAAAhhhh': 'aah',
  monké: 'monké',
}

const getRandomSoundFromBoard = (board) => {
  const keys = Object.keys(board)
  const randomKey = keys[Math.floor(Math.random() * keys.length)]
  return board[randomKey]
}

export default ({ auth, onChange }) => {
  useEffect(() => {
    let ping
    let pong
    const clearPingPong = () => {
      clearTimeout(ping)
      clearTimeout(pong)
    }

    const topic = `channel-points-channel-v1.${auth.channel}`
    const rws = new ReconnectingWebSocket('wss://pubsub-edge.twitch.tv')

    rws.addEventListener('open', () => {
      rws.send(JSON.stringify({ type: 'PING' }))
      rws.send(
        JSON.stringify({
          type: 'LISTEN',
          data: {
            topics: [topic],
            auth_token: auth.access_token,
          },
        })
      )
    })

    rws.addEventListener('close', () => {
      clearPingPong()
    })

    rws.addEventListener('message', (message) => {
      try {
        const data = JSON.parse(message.data)

        if (data.type === 'PONG') {
          clearPingPong()
          ping = setTimeout(() => {
            rws.send(JSON.stringify({ type: 'PING' }))
            pong = setTimeout(() => {
              rws.reconnect()
            }, 10000)
          }, 300 * 1000)
        } else if (data.type === 'RECONNECT') {
          rws.reconnect()
        } else if (data.type === 'MESSAGE') {
          if (data.data.topic === topic) {
            const event = JSON.parse(data.data.message)
            const redemption = event?.data.redemption.reward.title

            if (redemption) {
              const board = sounds[mapping[redemption]]
              onChange(getRandomSoundFromBoard(board))
            }
          }
        }
      } catch (err) {
        console.error(err)
      }
    })

    rws.addEventListener('error', (...args) => console.error(args))

    return () => {
      rws?.close()
      clearPingPong()
    }
  }, [auth.access_token, auth.channel, onChange])

  return null
}
