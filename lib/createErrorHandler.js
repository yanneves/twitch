const jsonError = (status, error) => JSON.stringify({ status, error })

export default (res) => ({
  badRequest: (err) => {
    res.statusCode = 400
    res.end(jsonError(res.statusCode, err))
    return { handled: true }
  },
  notFound: (err) => {
    res.statusCode = 404
    res.end(jsonError(res.statusCode, err))
    return { handled: true }
  },
  serverError: (err) => {
    res.statusCode = 500
    res.end(jsonError(res.statusCode, err))
    return { handled: true }
  },
})
