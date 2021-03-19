import React, { useState, useEffect } from 'react'
import Link from 'next/link'

const Dashboard = () => {
  const [overlays, setOverlays] = useState([])
  const [errors, setErrors] = useState([])

  useEffect(() => {
    let cancelled = false

    const request = async () => {
      let json

      // Parses ?code= from url
      const { code } = Object.fromEntries(
        window.location.search
          .substr(1)
          .split('&')
          .map((pair) => pair.split('='))
      )

      if (!code) return null

      try {
        const res = await window.fetch(`/api/auth?token=${code}`)
        json = await res.json()
      } catch {
        if (!cancelled) {
          return setErrors((state) => [
            ...state,
            'Failed to authenticate with our server',
          ])
        }
      }

      if (!cancelled) {
        const { error, data } = json

        if (error) {
          return setErrors((state) => [...state, `${error}`])
        }

        setOverlays([data])
      }

      return null
    }

    request()

    return () => {
      cancelled = true
    }
  }, [setOverlays, setErrors])

  return (
    <>
      {errors.length ? errors.map((error) => <p key={error}>{error}</p>) : null}
      <ul>
        {overlays.map(({ key, user }) => (
          <li key={key}>
            <Link href={`/overlay/soundboard/${user}/${key}`}>
              {`${window.location.origin}/overlay/soundboard/${user}/${key}`}
            </Link>
          </li>
        ))}
      </ul>
    </>
  )
}

export default Dashboard
