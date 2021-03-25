import { createRequire } from 'module'
import { postTweet } from './apiV1/tweets.js'
import { getMentions } from './apiV2/tweets.js'
import { getCurrentTime } from './utils.js'
import config from './config.js'
import { settings } from 'cluster'

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

const updateTweetTimes = () => {
  botActions.lastTweet = Math.floor(Date.now() / 1000)
  config.settings.lastTweetReceivedTime = botActions.lastTweet
}

const newTweet = () => {
  const tweet = generator.makeTweet(140)
  postTweet(tweet)
  console.log(`posted tweet @ ${getCurrentTime()}: "${tweet}"`)
}

const tweetFile = './data/tweets.txt'

const botActions = {
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

      //* RUN BOT TASKS EVERY 5 SECONDS
      setInterval(() => {
        botTasks()
      }, 60000)

      //* CHECK MENTIONS EVERY 15 MINUTES
      setInterval(() => {
        if (config.settings.checkMentions) {
          console.log(`** checking new mentions @ ${getCurrentTime()} **`)
          getMentions(config.settings.robot_id)
        }
      }, 900000)
    })
    .catch((err) => {
      console.log(err)
    })
}

const onBoot = () => {
  console.log(
    `bot @${config.settings.robotName} initialized @ ${getCurrentTime()}.`
  )
  console.log(`- tweet on startup: ${config.settings.tweetOnStartup}.`)
  console.log(`- tweet interval: ${config.settings.postInterval} seconds.`)

  updateTweetTimes()

  //* GET LATEST MENTIONS ON BOOT
  console.log(`** checking mentions @ ${getCurrentTime()} **`)
  getMentions(config.settings.robot_id)

  if (config.settings.tweetOnStartup) {
    updateTweetTimes()
    console.log(`! posted startup tweet @ ${getCurrentTime()}`)
    newTweet()
  }
}

const botTasks = () => {
  console.log(`- ran bot tasks @ ${getCurrentTime()}`)

  if (
    Math.floor(Date.now() / 1000) - botActions.lastTweet >=
    config.settings.postInterval
  ) {
    updateTweetTimes()
    newTweet()
  }
}

export default init
