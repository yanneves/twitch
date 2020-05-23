import shortid from "shortid"

const overlays = []

const createOverlay = ({
  username,
  access_token,
  expires_in,
  refresh_token,
  token_type,
}) => {
  const key = shortid.generate()
  const overlay = {
    key,
    user: username,
    twitch_access_token: access_token,
    twitch_expires_in: expires_in,
    twitch_refresh_token: refresh_token,
    twitch_token_type: token_type,
  }

  overlays.push(overlay)

  return overlay
}

export const createOrUpdateOverlay = (data) => {
  const { username, access_token, expires_in, refresh_token, token_type } = data
  const index = overlays.findIndex((overlay) => (overlay.user = username))

  if (index === -1) {
    return createOverlay(data)
  }

  const overlay = {
    ...overlays[index],
    twitch_access_token: access_token,
    twitch_expires_in: expires_in,
    twitch_refresh_token: refresh_token,
    twitch_token_type: token_type,
  }

  overlays.splice(index, 1, overlay)

  return overlay
}

export const readOverlay = (key, user) =>
  overlays.find((overlay) => overlay.key === key && overlay.user === user)
