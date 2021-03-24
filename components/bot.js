import { createRequire } from 'module'
import { postTweet } from './apiV1/tweets.js'
import config from './config.js'

const require = createRequire(import.meta.url)
let generator = require('./generator.cjs')

const Promise = require('bluebird')
let fs = require('fs')

fs = Promise.promisifyAll(fs)

generator = Promise.promisifyAll(generator)
generator.stopWords = fs
  .readFileAsync('./data/stopwords.txt')
  .toString()
  .split('\n')

const currentTime = Math.floor(Date.now() / 1000)
const tweetFile = './data/tweets.txt'

const robotActions = {
  lastFollow: 0,
  lastReply: 0,
  lastRetweet: 0,
  lastTweet: 0,
}

const init = () => {
  fs.readFileAsync(tweetFile)
    .then((fileContents) => {
      console.log(
        "\nAnalyzing data and creating word corpus from file '" +
          tweetFile +
          "'"
      )
      const content = fileContents.toString().split('\n')
      return content
    })
    .then((content) => {
      return generator.cleanContent(content)
    })
    .then((content) => {
      return generator.buildCorpus(content)
    })
    .then(() => {
      onBoot()

      setInterval(() => {
        botTasks()
        console.log(`ran bot tasks`)
      }, 5000)
    })
    .catch((err) => {
      console.log(err)
    })
}

const onBoot = () => {
  if (config.settings.tweetOnStartup) {
    robotActions.lastTweet = currentTime
    config.settings.lastTweetReceivedTime = robotActions.lastTweet
    const newTweet = generator.makeTweet(140)
    postTweet(newTweet)
    console.log(`tweeted on startup: ${newTweet}`)
  }
}

const botTasks = () => {
  console.log(`ran bot tasks`)
  if (currentTime - robotActions.lastTweet >= config.settings.postInterval) {
    robotActions.lastTweet = currentTime
    config.settings.lastTweetReceivedTime = robotActions.lastTweet
    const tweet = 'this is a second test tweet'
    const newTweet = generator.makeTweet(140)
    postTweet(newTweet)
    console.log(`running tweets: ${tweet}`)
  }
}

export default init
