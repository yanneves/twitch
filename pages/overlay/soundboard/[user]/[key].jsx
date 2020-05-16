import React from "react"
import { useRouter } from "next/router"

export default () => {
  const router = useRouter()
  const { user, key } = router.query

  return (
    <dl>
      <dt>User</dt>
      <dd>{user}</dd>
      <dt>Key</dt>
      <dd>{key}</dd>
    </dl>
  )
}
