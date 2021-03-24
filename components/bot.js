// import { Promise } from 'bluebird'
import { config } from './config.js'
import {
  postTweet,
  getTweets,
  getUser,
  getUserTweets,
  getUserByUsername,
} from './tweets.js'
// import { generator } from './generator'
// import * as fs from 'fs'

// fs = Promise.promisifyAll(fs)
// generator = Promise.promisifyAll(generator)

// generator.stopwords = fs
//   .readFileAsync('./data/stopwords.txt')
//   .toString()
//   .split('\n')

// tweetfile = './tweets.txt'

const currentTime = Math.floor(Date.now() / 1000)

const robotActions = {
  lastFollow: 0,
  lastReply: 0,
  lastRetweet: 0,
  lastTweet: 0,
}

const onBoot = () => {
  // if (
  //   !config.twitter.consumer_key &&
  //   !config.twitter.consumer_secret &&
  //   !config.twitter.access_token_key &&
  //   !config.twitter.access_token_secret
  // ) {
  //   console.log('Error: No credentials provided.')
  //   return
  // }

  if (config.settings.tweetOnStartup) {
    robotActions.lastTweet = currentTime
    config.settings.lastTweetReceivedTime = robotActions.lastTweet
    const newTweet = 'this is a test tweet'
    // postTweet(newTweet)
    console.log(`tweeted: ${newTweet}`)
  }
}

const botTasks = () => {
  // console.log(`ran bot tasks`)
  // if (currentTime - robotActions.lastTweet >= config.settings.postInterval) {
  //   robotActions.lastTweet = currentTime
  //   const tweet = 'this is a second test tweet'
  //   postTweet(tweet)
  //   console.log(`running tweets: ${tweet}`)
  // }
  // getTweets()
}

export const botInit = () => {
  // console.log('-== CONFIG SETTINGS ==-')
  // console.log(' -Post to Twitter? ' + config.settings.postTweets)
  // console.log(' -Repond to DMs? ' + config.settings.respondDMs)
  // console.log(' -Repond to replies? ' + config.settings.respondReplies)
  // console.log(' -Random replies? ' + config.settings.randomReplies)
  // console.log(' -Follow new users? ' + config.settings.followUsers)
  // console.log(
  //   ' -Mark tweets as favorites? ' + config.settings.canFavoriteTweets
  // )
  // console.log(' -Tweet interval: ' + config.settings.postInterval + ' seconds')

  // onBoot()
  // getTweets()
  // getUser('2149622708')
  // getUserTweets('2149622708')
  getUserByUsername('jurassic_ebooks')
  // postTweet('test tweet')
  // setInterval(() => {
  //   botTasks()
  //   console.log(`ran bot tasks`)
  // }, 5000)
}
