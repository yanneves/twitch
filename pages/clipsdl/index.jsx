import React, { useState, useEffect, useCallback } from 'react'
import PropTypes from 'prop-types'

import 'tachyons'

const generateAuthEndpoint = () => {
  const url = 'https://api.twitch.tv/kraken/oauth2/authorize'
  const params = [
    ['client_id', process.env.NEXT_PUBLIC_CLIPS_TWITCH_CLIENT_ID],
    ['redirect_uri', process.env.NEXT_PUBLIC_CLIPS_TWITCH_REDIRECT_URI],
    ['response_type', 'token'],
    ['scope', ''],
  ]

  return `${url}?${params.map(([key, val]) => `${key}=${val}`).join('&')}`
}

const generateDownloadLink = (thumbnail_url = '') => {
  const match = thumbnail_url.match(/(?:\.tv\/)(.+)(?:-preview)/)
  return match ? `https://clips-media-assets2.twitch.tv/${match[1]}.mp4` : null
}

const Login = () => <a href={generateAuthEndpoint()}>Log in with Twitch</a>

const Select = ({ onSubmit }) => (
  <form
    className="bg-light-red mw7 center pa4 br2-ns ba b--black-10"
    onSubmit={onSubmit}
  >
    <fieldset className="cf bn ma0 pa0">
      <legend className="pa0 f5 f4-ns mb3 black-80">
        Enter a Twitch username to load clips
      </legend>
      <div className="cf">
        {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
        <label className="clip" htmlFor="username">
          Username
        </label>
        <input
          className="f6 f5-l input-reset bn fl black-80 bg-white pa3 lh-solid w-100 w-75-m w-80-l br2-ns br--left-ns"
          placeholder="Twitch Username"
          type="text"
          name="username"
          id="username"
        />
        <button
          className="f6 f5-l button-reset fl pv3 tc bn bg-animate bg-black-70 hover-bg-black white pointer w-100 w-25-m w-20-l br2-ns br--right-ns"
          type="submit"
        >
          Subscribe
        </button>
      </div>
    </fieldset>
  </form>
)

Select.propTypes = {
  onSubmit: PropTypes.func.isRequired,
}

const Clips = ({ data }) =>
  data.length ? (
    <section className="cf w-100 flex flex-wrap">
      {data.map(
        ({
          url,
          title,
          thumbnail_url: thumbnailUrl,
          creator_name: creatorName,
          view_count: viewCount,
        }) => (
          <article key={url} className="w-100 w-50-m  w-25-ns">
            <a
              href={generateDownloadLink(thumbnailUrl)}
              className="link db ma2-ns"
              target="_blank"
              rel="noreferrer"
            >
              <div className="aspect-ratio aspect-ratio--16x9">
                <img
                  alt=""
                  style={{
                    backgroundImage: `url(${thumbnailUrl})`,
                  }}
                  className="db bg-center cover aspect-ratio--object"
                />
              </div>
              <h3 className="f5 f4-ns mb0 black-90">{title}</h3>
              <h3 className="f6 f5 fw4 mt2 black-60">
                by {creatorName} ({viewCount} views)
              </h3>
            </a>
          </article>
        )
      )}
    </section>
  ) : (
    <p>No clips found for this user</p>
  )

Clips.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      url: PropTypes.string,
      title: PropTypes.string,
      thumbnail_url: PropTypes.string,
      creator_name: PropTypes.string,
      view_count: PropTypes.string,
    })
  ),
}

Clips.defaultProps = {
  data: [],
}

const NextButton = ({ onClick }) => (
  <nav className="tc w-100">
    <button
      type="button"
      className="f5 black bg-white bg-animate hover-bg-black hover-white pa3 ba bw1 b--black border-box pointer"
      onClick={onClick}
    >
      Load next
    </button>
  </nav>
)

NextButton.propTypes = {
  onClick: PropTypes.func.isRequired,
}

const Index = () => {
  const [token, setToken] = useState('')
  const [username, setUsername] = useState('')
  const [page, setPage] = useState(null)
  const [cursor, setCursor] = useState(null)
  const [data, setData] = useState(null)

  useEffect(() => {
    // Parses #access_token= from url
    const { access_token: accessToken } = Object.fromEntries(
      window.location.hash
        .substr(1)
        .split('&')
        .map((pair) => pair.split('='))
    )

    // Remove hash after reading value
    window.history.pushState('', document.title, window.location.pathname)

    setToken(accessToken)
  }, [setToken])

  useEffect(() => {
    let cancelled = false

    const request = async () => {
      let res = await fetch(
        `https://api.twitch.tv/helix/users?login=${username}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Client-ID': process.env.NEXT_PUBLIC_CLIPS_TWITCH_CLIENT_ID,
          },
        }
      )
      const users = await res.json()
      const [user] = users?.data ?? []

      if (!user) return

      let endpoint = `https://api.twitch.tv/helix/clips?broadcaster_id=${user?.id}`

      if (page) {
        endpoint += `&after=${page}`
      }

      res = await fetch(endpoint, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Client-ID': process.env.NEXT_PUBLIC_CLIPS_TWITCH_CLIENT_ID,
        },
      })
      const clips = await res.json()

      if (!cancelled) {
        setData(clips?.data)
        setCursor(clips?.pagination?.cursor)
      }
    }

    if (token && username) {
      request()
    }

    return () => {
      cancelled = true
    }
  }, [token, username, page])

  const handleSubmit = useCallback(
    (event) => {
      event.preventDefault()
      setPage(null)
      setUsername(new FormData(event.target).get('username'))
    },
    [setUsername]
  )

  return (
    <main className="sans-serif">
      {token ? <Select onSubmit={handleSubmit} /> : <Login />}
      {data ? <Clips data={data} /> : null}
      {data ? <NextButton onClick={() => setPage(cursor)} /> : null}
    </main>
  )
}

export default Index
