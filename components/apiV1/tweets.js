import Twitter from 'twitter'
import dotenv from 'dotenv'
import { config } from '../config.js'

dotenv.config()
export const client = new Twitter({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token_key: process.env.TWITTER_ACCESS_TOKEN,
  access_token_secret: process.env.TWITTER_ACCESS_SECRET,
})

export const postTweet = async (send_msg) => {
  if (config.settings.postTweets) {
    await client.post('statuses/update', { status: send_msg }, (err) => {
      err ? console.log(err) : null
    })
  }
}
