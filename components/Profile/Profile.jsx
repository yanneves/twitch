import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'

const Profile = ({ data }) => {
  const [picture, setPicture] = useState(null)
  const [errors, setErrors] = useState([])

  useEffect(() => {
    let cancelled = false

    const request = async () => {
      let json

      const {
        twitch: { access_token: accessToken },
      } = data

      try {
        const res = await window.fetch(`https://id.twitch.tv/oauth2/userinfo`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })
        json = await res.json()
      } catch {
        if (!cancelled) {
          return setErrors((state) => [...state, 'Failed to fetch user info'])
        }
      }

      if (!cancelled) {
        setPicture(json.picture)
      }

      return null
    }

    request()

    return () => {
      cancelled = true
    }
  }, [data, setPicture, setErrors])

  return (
    <>
      {errors.length ? errors.map((error) => <p key={error}>{error}</p>) : null}
      <figure>
        {picture ? <img alt="Profile" src={picture} /> : null}
        <figcaption>{data.user}</figcaption>
      </figure>
    </>
  )
}

Profile.propTypes = {
  data: PropTypes.shape({
    user: PropTypes.string,
    twitch: PropTypes.shape({
      access_token: PropTypes.string,
    }),
  }).isRequired,
}

export default Profile
