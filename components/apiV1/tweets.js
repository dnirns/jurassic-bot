//* FUNCTIONS  FOR TWITTER API V1
import Twitter from 'twitter'
import config from '../config.js'

export const client = new Twitter({
  consumer_key: config.credentials.consumer_key,
  consumer_secret: config.credentials.consumer_secret,
  access_token_key: config.credentials.access_token,
  access_token_secret: config.credentials.access_token_secret,
})

//* POST TWEET TO TIMELINE
//* WILL ERROR AND NOT POST IF DUPLICATE TWEET
export const postTweet = async (tweet) => {
  if (config.settings.postTweets) {
    await client.post('statuses/update', { status: tweet }, (err) => {
      err ? console.log(err) : null
    })
  }
}
