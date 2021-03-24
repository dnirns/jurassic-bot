const config = import('./config.js')

module.exports = {
  dictionary: {},
  startwords: [],
  stopwords: [],
  hashtags: [],
  wordpairs: [],
  popularKeywords: [],

  buildCorpus: function (content) {
    var countWords = 0

    for (var currentLine = 0; currentLine < content.length; currentLine++) {
      var words = content[currentLine].split(' ')

      this.startwords.push(words[0])

      for (var j = 0; j < words.length - 1; j++) {
        var checkValid = true

        if (words[j].substring(0, 1) === '#') {
          var tempHashtag = words[j]
          tempHashtag = tempHashtag
            .replace(/[\W]*$/g, '')
            .this.hashtags.push(tempHashtag)
        }

        if (words[j] !== '' && checkValid === true) {
          if (!this.dictionary[words[j]]) {
            countWords++
            this.dictionary[words[j]] = {
              count: 1,
              next_words: [],
              prev_words: [],
            }
          } else {
            this.dictionary[words[j]].count++
            this.dictionary[words[j]].next_words.push(
              this.checkExists(words[j + 1])
            )
            this.dictionary[words[j]].prev_words.push(
              this.checkExists(words[j - 1])
            )
          }

          var curWord = {
            first_word: words[j],
            word_pair: words[j] + ' ' + this.checkExists(words[j + 1]),
            word_pair_array: [words[j], this.checkExists(words[j + 1])],
            next_word: this.checkExists(words[j + 2]),
            prev_word: this.checkExists(words[j - 1]),
          }

          this.wordpairs.push(curWord)
        }
      }
    }

    delete this.startwords['"']
    delete this.startwords['']
    delete this.startwords[' ']

    return this.wordpairs
  },

  checkExists: function (value) {
    if (!value) {
    } else {
      return value
    }
  },

  checkSentenceEnd: function (word) {
    if (word === undefined) {
      return false
    }

    var endMarks = ['.', '!', '?']
    var endMark = word.slice(-1)
    if (endMarks.indexOf(endMark) != -1) {
      return true
    } else {
      return false
    }
  },

  choice: function (array) {
    var randomWord = array[Math.floor(Math.random() * array.length)]

    return randomWord
  },

  choosePairs: function (firstWord, secondWord) {
    var allResults = []
    var resultWordPair
    var getResult
    if (secondWord === undefined || secondWord === null) {
      getResult = this.searchObject(this.wordpairs, 'first_word', firstWord)
      resultWordPair = getResult[Math.floor(Math.random() * getResult.length)]

      if (typeof resultWordPair == 'undefined') {
        allResults[0] = ''
        allResults[1] = ''
        allResults[2] = ''
        allResults[3] = 'end'
        return allResults
      }

      allResults[0] = this.checkExists(resultWordPair.word_pair_array[0])
      allResults[1] = this.checkExists(resultWordPair.word_pair_array[1])
      allResults[2] = this.checkExists(resultWordPair.next_word)

      return allResults
    } else if (secondWord === '') {
      allResults[0] = ''
      allResults[1] = ''
      allResults[2] = ''
      allResults[3] = 'end'
      return allResults
    } else {
      getResult = this.searchObject(
        this.wordpairs,
        'word_pair',
        firstWord + ' ' + secondWord
      )
      resultWordPair = getResult[Math.floor(Math.random() * getResult.length)]

      if (typeof resultWordPair == 'undefined') {
        allResults[0] = ''
        allResults[1] = ''
        allResults[2] = ''
        allResults[3] = 'end'
        return allResults
      }

      allResults[0] = this.checkExists(resultWordPair.word_pair_array[0])
      allResults[1] = this.checkExists(resultWordPair.word_pair_array[1])
      allResults[2] = this.checkExists(resultWordPair.next_word)

      return allResults
    }
  },

  cleanContent: function (content) {
    var cleaned = content

    cleaned.forEach(function (element, index) {
      cleaned[index] = cleaned[index].replace(/(@\S+)/gi, '')
      cleaned[index] = cleaned[index].replace(/(http\S+)/gi, '')
      cleaned[index] = cleaned[index].replace(/^RT\W/gi, '')
      cleaned[index] = cleaned[index].replace(/( RT )/gi, ' ')
      cleaned[index] = cleaned[index].replace(/( MT )/g, ' ')
      cleaned[index] = cleaned[index].replace(/^ +/gm, '')
      cleaned[index] = cleaned[index].replace(/[ \t]+$/, '')
      cleaned[index] = cleaned[index].replace(/(&#8217;)/, "'")
      cleaned[index] = cleaned[index].replace(/(&#8216;)/, "'")
      cleaned[index] = cleaned[index].replace(/\W-$/g, '')
      cleaned[index] = cleaned[index].replace(/&gt;/g, '>')
      cleaned[index] = cleaned[index].replace(/&lt;/g, '<')
      cleaned[index] = cleaned[index].replace(/&amp;/g, '&')
      cleaned[index] = cleaned[index].replace(/(\/cc)/gi, '')
      cleaned[index] = cleaned[index].replace(/(\/via)/gi, '')
      cleaned[index] = cleaned[index].replace(/"/g, '')
      cleaned[index] = cleaned[index].replace(/“/g, '')
      cleaned[index] = cleaned[index].replace(/”/g, '')
      cleaned[index] = cleaned[index].replace(/(\))/g, '')
      cleaned[index] = cleaned[index].replace(/(\()/g, '')
      cleaned[index] = cleaned[index].replace(/(\\n)/gm, '')
    })

    return cleaned
  },

  makeTweet: function (min_length) {
    if (this.startwords === undefined || this.startwords.length === 0) {
      return
    }

    var keepGoing = true
    var startWord = this.choice(this.startwords)

    var initialWords = this.choosePairs(startWord)

    var tweet = [startWord]
    tweet.push(initialWords[1])
    tweet.push(initialWords[2])

    while (keepGoing === true) {
      var getNewWords = this.choosePairs(
        tweet[tweet.length - 2],
        tweet[tweet.length - 1]
      )
      if (getNewWords[3] === 'end') break

      tweet.push(getNewWords[2])
      if (this.checkSentenceEnd(getNewWords[2]) === true) break
    }

    var removeElements = function (array, value) {
      if (array.indexOf(value) !== -1) {
        for (var i = array.length - 1; i--; ) {
          if (array[i] === value) array.splice(i, 1)
        }
      }
      return array
    }

    tweet = removeElements(tweet, '.')
    tweet = removeElements(tweet, '-')
    tweet = removeElements(tweet, 'RT')
    tweet = removeElements(tweet, '/')
    tweet = removeElements(tweet, ':')
    tweet = removeElements(tweet, '[pic]:')
    tweet = removeElements(tweet, '[pic]')

    tweet = tweet.filter(function (e) {
      return e
    })

    var wholeTweet = tweet.join(' ')

    wholeTweet = wholeTweet.replace(/[ ]*$/g, '')

    wholeTweet = wholeTweet.replace(/:$/g, '.')
    wholeTweet = wholeTweet.replace(/\,[ ]*$/g, '.')
    wholeTweet = wholeTweet.replace(/[ ](w\/)$/g, '')

    if (wholeTweet.length === 0) {
      wholeTweet = this.makeTweet(min_length)
    }

    return wholeTweet
  },

  searchObject: function (array, prop, value) {
    var result = array.filter(function (obj) {
      return obj[prop] === value
    })

    return result
  },

  getKeywords: function (word) {
    var checkStopword = word.toLowerCase().replace(/[\W]*$/g, '')
    if (this.stopwords.indexOf(checkStopword) == -1 && word !== '') {
      var result = this.wordpairs.filter(function (obj) {
        return obj.first_word == word
      })

      return [result.length, word, result]
    } else {
      return ''
    }
  },

  makeSentenceFromKeyword: function (replystring) {
    var allWords = []
    var mySentence = []
    allWords = replystring.split(' ')

    var self = this

    function calculateHighest(allWords) {
      var count = 0
      var highestWord
      var resultArray = []

      for (var i = 0; i < allWords.length; i++) {
        var result = self.getKeywords(allWords[i])
        if (result[0] > count) {
          count = result[0]
          highestWord = result[1]
          resultArray = result[2]
        }
      }

      return resultArray
    }

    var keywordObject = calculateHighest(allWords)

    var keepGoing = true
    var result = keywordObject[Math.floor(Math.random() * keywordObject.length)]

    if (typeof result == 'undefined') {
      return
    }

    var prev_word = result.prev_word
    var cur_word = result.first_word

    mySentence.push(prev_word, cur_word)

    while (keepGoing === true) {
      var cur_wordpair = mySentence[0] + ' ' + mySentence[1]
      var tempArray = this.chooseRandomPair(this.findWordPair(cur_wordpair))

      if (tempArray[3] == 'notfound') {
        console.log('\nError: No keyword pairs found')
        return
      }

      if (tempArray[0] === '') {
        keepGoing = false
      } else {
        mySentence.unshift(tempArray[0])
      }
    }

    keepGoing = true
    while (keepGoing === true) {
      var arrayLength = mySentence.length - 1
      var cur_wordpair =
        mySentence[arrayLength - 1] + ' ' + mySentence[arrayLength]
      var tempArray = this.chooseRandomPair(this.findWordPair(cur_wordpair))

      if (tempArray[3] == 'notfound') {
        console.log('\nError: No keyword pairs found')
        return
      }

      if (tempArray[2] === '') {
        keepGoing = false
      } else {
        mySentence.push(tempArray[2])
      }
    }

    if (mySentence.join(' ').length > 124) {
      makeSentenceFromKeyword(replystring)
    } else {
      var returnSentence = mySentence.join(' ')

      if (typeof returnSentence == 'undefined') {
        console.log('\nError: No valid replies found')
        return
      } else {
        return mySentence.join(' ')
      }
    }
  },

  twitterFriendly: function (reply, username) {
    var new_tweet
    if (reply) {
      username = '@' + username + ' '
    } else {
      username = ''
    }

    do {
      var randomLength = Math.floor(Math.random() * 20 + 10)
      new_tweet = this.makeTweet(randomLength)
      new_tweet = username + new_tweet + this.attachHashtag(new_tweet.length)
      new_tweet = new_tweet + this.attachEmoji(new_tweet.length)
    } while (new_tweet.length > 140)

    if (new_tweet == 'RT') {
      twitterFriendly(reply, username)
    }
    return new_tweet
  },

  chooseRandomPair: function (obj) {
    if (typeof obj === 'undefined') {
      return ['']
    }

    var result = obj[Math.floor(Math.random() * obj.length)]

    if (typeof result === 'undefined') {
      var prev_word = ''
      var cur_word = ''
      var next_word = ''
      var error = 'notfound'
    } else if (typeof result.prev_word !== 'undefined') {
      var prev_word = result.prev_word
      var cur_word = result.first_word
      var next_word = result.next_word
    } else {
      var prev_word = ''
    }

    if (
      prev_word.slice(-1) == '.' ||
      prev_word.slice(-1) == '!' ||
      prev_word.slice(-1) == '?'
    ) {
      prev_word = ''
    }

    return [prev_word, cur_word, next_word, error]
  },

  findWordPair: function (string) {
    var getResult = this.searchObject(this.wordpairs, 'word_pair', string)

    return getResult
  },

  attachHashtag: function (tweetlength) {
    var gethashtag
    var x = Math.random()
    if (x <= config.personality.addHashtags) {
      gethashtag = this.hashtags[
        Math.floor(Math.random() * this.hashtags.length)
      ]

      if (typeof gethashtag == 'undefined') {
        gethashtag = ''
      }

      if (
        config.personality.ignoredHashtags.indexOf(gethashtag.toLowerCase()) !==
        -1
      ) {
        gethashtag = ''
      } else if (typeof gethashtag == 'undefined') {
        console.log('\nUndefined hashtag detected')
        gethashtag = ''
      } else {
        gethashtag = ' ' + gethashtag
      }
    } else {
      gethashtag = ''
    }

    if (tweetlength < 120) {
      return gethashtag
    }
  },
}
