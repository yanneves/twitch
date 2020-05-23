import shortid from "shortid"

const overlays = []

export const createOverlay = ({
  username,
  access_token,
  expires_in,
  refresh_token,
  token_type,
}) => {
  const key = shortid.generate()

  overlays.push({
    key,
    user: username,
    twitch: {
      access_token,
      expires_in,
      refresh_token,
      token_type,
    },
  })

  return overlays
}

export const readOverlay = (key, user) =>
  overlays.find((overlay) => overlay.key === key && overlay.user === user)

// export const updateOverlay = (key, login) => {

// }

// export const deleteOverlay = (key) => {

// }
