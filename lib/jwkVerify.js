import jwt from "jsonwebtoken"
import jwkToPem from "jwk-to-pem"

// https://id.twitch.tv/oauth2/keys
import JWK_TWITCH from "./jwkTwitch.json"

// Implementation following AWS Cognito docs
// https://docs.aws.amazon.com/cognito/latest/developerguide/amazon-cognito-user-pools-using-tokens-verifying-a-jwt.html
export default (token) =>
  new Promise((resolve, reject) => {
    const { alg } = JWK_TWITCH
    const pem = jwkToPem(JWK_TWITCH)

    jwt.verify(token, pem, { algorithms: [alg] }, (err, decoded) => {
      if (err) return reject(err)

      // TODO: verify details of token, e.g. expiry time
      return resolve(decoded)
    })
  })
