//* FUNCTIONS FOR TWITTER API V2

import Twitter from 'twitter-v2'
import config from '../config.js'

let mentions = []

export const client = new Twitter({
  consumer_key: config.credentials.consumer_key,
  consumer_secret: config.credentials.consumer_secret,
  bearer_token: config.credentials.bearer_token,
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

//* GET MENTIONS
// API ref: https://bit.ly/3rh66wI
export const getMentions = async (author_id) => {
  const { data } = await client.get(`users/${author_id}/mentions`, {
    expansions: 'author_id',
  })
  //* RETURN LATEST DATA FOR THE LATEST MENTION

  if (!mentions.includes(data[0].id)) {
    mentions.push(data[0].id)
  }

  console.log(`current mention id's: ${mentions.map((mention) => mention)}`)
}
