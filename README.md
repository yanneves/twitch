# Yann Eves' Twitch Integrations

## Featuring

[Twitch Channel Points Soundboard](#twitch-channel-points-soundboard)

## Twitch Channel Points Soundboard

### How to use

Head over to <https://twitch.yannev.es/> and log in with your Twitch user. Note, channel points are only available to [Twitch Affiliates][twitch-affiliates].

When you log in, if successful, you'll see an overlay link. Load that overlay url where you want to use it - for example, in an OBS Browser Source. Rest assured, as you can see from this code, your email address or other personal details are not captured and used. Unfortunately, Twitch scopes access to these by default.

To enable channel points redemptions, add any of the following to your [custom channel points rewards][twitch-channel-points], ensuring the title matches exactly. Then, when chat redeems them, they'll play in your overlay.

| Title    | Soundboard behaviour                                             |
| -------- | ---------------------------------------------------------------- |
| 🐺       | Plays a random "Wolf" sound from The Long Dark                   |
| 🐻       | Plays a random "Bear" sound from The Long Dark                   |
| !wannabe | Plays Wannabe by Spice Girls audio from the official music video |

## Installation

If you want to run your own instance, this project is built on [Next.js][next-js]. It's easy to deploy with [Vercel][vercel]. You'll need to register your own Twitch application at [dev.twitch.tv][twitch-dev]. And a [FaunaDB][fauna-db] database.

Then tokens are configured through environment variables, see [.env.example](./.env.example).

MIT License © 2020 Yann アウネ Eves

<!-- - The Long Dark Wolf (aka Floof) 2,500 points
- The Long Dark Bear (aka Teddy) 25,000 points
- Wannabe (by Spice Girls) 50,000 points -->

[twitch-affiliates]: https://affiliate.twitch.tv/
[twitch-channel-points]: https://help.twitch.tv/s/article/channel-points-guide
[next-js]: https://nextjs.org/
[twitch-dev]: https://dev.twitch.tv/
[vercel]: https://vercel.com/
[fauna-db]: https://fauna.com/
