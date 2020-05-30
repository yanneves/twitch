import { GraphQLClient } from "graphql-request"
import createOverlayKey from "./createOverlayKey"

const { FAUNA_ENDPOINT, FAUNA_SECRET } = process.env

const db = new GraphQLClient(FAUNA_ENDPOINT, {
  headers: {
    authorization: `Bearer ${FAUNA_SECRET}`,
  },
})

const createOverlay = async ({
  username,
  access_token,
  expires_in,
  refresh_token,
  token_type,
}) => {
  const key = await createOverlayKey()

  const overlay = {
    key,
    user: username,
    twitch: {
      access_token,
      expires_in,
      refresh_token,
      token_type,
    },
  }

  const data = await db.request(
    `
      mutation CreateOverlay($overlay: OverlayInput!) {
        createOverlay(data: $overlay) {
          key
          user
        }
      }
    `,
    { overlay }
  )

  return data?.createOverlay ?? null
}

const updateOverlay = async (existing, data) => {
  const { access_token, expires_in, refresh_token, token_type } = data

  const overlay = {
    user: existing.user,
    key: existing.key,
    twitch: {
      access_token,
      expires_in,
      refresh_token,
      token_type,
    },
  }

  const updated = await db.request(
    `
      mutation UpdateOverlay($id: ID!, $overlay: OverlayInput!) {
        updateOverlay(id: $id, data: $overlay) {
          key
          user
        }
      }
    `,
    { id: existing._id, overlay }
  )

  return updated?.updateOverlay ?? null
}

export const createOrUpdateOverlay = async (data) => {
  const { username: user } = data

  try {
    const existing = await db.request(
      `
        query FindExisting($user: String!) {
          findOverlayByUser(user: $user) {
            _id
            key
            user
          }
        }
      `,
      { user }
    )

    return updateOverlay(existing?.findOverlayByUser, data)
  } catch (e) {
    return createOverlay(data)
  }
}

export const readOverlay = async (key, user) => {
  const data = await db.request(
    `
      query ReadOverlay($user: String!, $key: String!) {
        findOverlayByUserKey(user: $user, key: $key) {
          twitch {
            access_token
            expires_in
            refresh_token
            token_type
          }
        }
      }
    `,
    { user, key }
  )

  return data?.findOverlayByUserKey ?? null
}
