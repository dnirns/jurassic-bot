//* FUNCTIONS FOR TWITTER API V2

import dotenv from 'dotenv'
import Twitter from 'twitter-v2'

dotenv.config()
export const client = new Twitter({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token_key: process.env.TWITTER_ACCESS_TOKEN,
  access_token_secret: process.env.TWITTER_ACCESS_SECRET,
})

//* MAKE ASYNC REQUEST FOR TWEETS WITH TWITTER-V2 NODE PACKAGE
export const getTweets = async () => {
  const { data } = await client.get('tweets', {
    ids: '1374646827149111296',
    expansions: 'author_id',
  })
  console.log(data)
}

//* GET TIMELINE OF USERS TWEETS BY USER ID
// API ref: https://bit.ly/3vYdSPp

export const getUserTweets = async (user_id) => {
  const { data } = await client.get(`users/${user_id}/tweets`)
  console.log(`user ${user_id}'s timeline:`)
  console.log(data)
}

//* GET USER BY USER ID (STRING)
// API ref: https://bit.ly/31aJ144
export const getUser = async (author_id) => {
  const { data } = await client.get(`users/${author_id}`)
  console.log(data)
}

//* GET USER BY USERNAME
// API ref: https://bit.ly/39bSNar
export const getUserByUsername = async (username) => {
  const { data } = await client.get(`users/by/username/${username}`)
  console.log(data)
}
