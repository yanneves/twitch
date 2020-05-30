import createErrorHandler from "../../lib/createErrorHandler"
import { readOverlay } from "../../lib/database"

export default async (req, res) => {
  const { badRequest, notFound } = createErrorHandler(res)
  const { key, user } = req.query

  if (!key) {
    return badRequest("Missing 'key' in request")
  }

  if (!user) {
    return badRequest("Missing 'user' in request")
  }

  const overlay = await readOverlay(key, user)

  if (!overlay) {
    return notFound("Overlay does not exist")
  }

  res.statusCode = 200
  return res.end(
    JSON.stringify({
      status: res.statusCode,
      data: overlay,
    })
  )
}
