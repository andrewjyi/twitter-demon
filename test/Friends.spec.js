const chai = require('chai')
const request = require('supertest')

const util = require('../server/utilities/friendsUtil')
const redisUtil = require('../server/database/redis/redisUtil')
const redis = require('../server/database/redis')
const tokenizer = require('./utilities/tokenizer')

const expect = chai.expect

describe('---------Friends Utilities and Routes---------', function() {
  let token
  
  before(async function() { 
    token = tokenizer()
    redisValidUser = await redis.get('twitter|852718642722611200')
  })

  describe('Route /friends/chron/haters/:idtoken', function() {
    let correctToken, incorrectToken

    describe('Utility: checkIdToken', function() {
      before(function() {
        correctToken = util.checkIdToken(token, process.env.TEST_AUTH0_SECRET)
        incorrectToken = util.checkIdToken('1235i', process.env.TEST_AUTH0_SECRET)
      })

      it('should return null if an unsigned or invaled token is passed as a parameter', async function() {
        expect(incorrectToken).to.be.null
      })

      it('should return an object from the JWT if signed and valid', function() {
        expect(correctToken).to.be.an('object')
        expect(correctToken).to.have.Property('screen_name', 'EJTester1')
        expect(correctToken).to.have.Property('user_id', 'twitter|852718642722611200')
      })
    })

    describe('Utility: findNewHatersAndFriends', function() {
      let srtdTwitterTwoHater, srtdTwitterNoneHater, srtdTwitterOneFriends, srtdTwitterNoneFriends
      let twoNewHater, noneNewHater, noneNewFriends, oneNewFriends

      before(function(done) {
        require('./utilities/testData')() // adds valid user to redis
        srtdTwitterNoneHater = [57929458,231617496,239601600,697707365,995268086,1555162470,1698708957,1932028465,2632552626,2688892325,2804003565,3000965945,3337457192,3394363179,3467816149,3892750045,3965296254,4073454229,4604050084,4648654477,4938418363,5589151631,5650649614,5694271732,5747930101,5750060468,5792339707,5906579667,6985146101,7055720865,7788680008,7962722444,8237281085,8633061590,8673243842,9441329172,9648836724,9853671194,9889002061,9996353995]
        srtdTwitterTwoHater = [57929458,231617496,239601600,697707365,995268086,1555162470,1698708957,1932028465,2632552626,2688892325,2804003565,3000965945,3337457192,3394363179,3467816149,3892750045,3965296254,4073454229,4604050084,4648654477,4938418363,5589151631,5650649614,5694271732,5747930101,5750060468,5792339707,5906579667,6985146101,7055720865,7788680008,7962722444,8237281085,8633061590,9441329172,9648836724,9853671194,9996353995]
        srtdTwitterNoneFriends = [57929458,231617496,239601600,697707365,995268086,1555162470,1698708957,1932028465,2632552626,2688892325,2804003565,3000965945,3337457192,3394363179,3467816149,3892750045,3965296254,4073454229,4604050084,4648654477,4938418363,5589151631,5650649614,5694271732,5747930101,5750060468,5792339707,5906579667,6985146101,7055720865,7788680008,7962722444,8237281085,8633061590,8673243842,9441329172,9648836724,9853671194,9889002061,9996353995]
        srtdTwitterOneFriends = [123, 57929458,231617496, 239601600,697707365,995268086,1555162470,1698708957,1932028465,2632552626,2688892325,2804003565,3000965945,3337457192,3394363179,3467816149,3892750045,3965296254,4073454229,4604050084,4648654477,4938418363,5589151631,5650649614,5694271732,5747930101,5750060468,5792339707,5906579667,6985146101,7055720865,7788680008,7962722444,8237281085,8633061590,8673243842,9441329172,9648836724,9853671194,9889002061,9996353995]

        cachedUserInfo = redis.get('twitter|852718642722611200').then(cachedUserInfo => {
          cachedUserInfo = JSON.parse(cachedUserInfo)
          twoNewHater = util.findNewHatersAndFriends(cachedUserInfo, srtdTwitterTwoHater)
          noneNewHater = util.findNewHatersAndFriends(cachedUserInfo, srtdTwitterNoneHater)
          noneNewFriends = util.findNewHatersAndFriends(cachedUserInfo, srtdTwitterNoneFriends)
          oneNewFriends = util.findNewHatersAndFriends(cachedUserInfo, srtdTwitterOneFriends)
          done()
        })
       })

      it('should return an object with property "changed" with correct boolean', function() {
        expect(twoNewHater).to.haveOwnProperty('changed')
        expect(twoNewHater.changed).to.be.true
        expect(noneNewHater).to.haveOwnProperty('changed')
        expect(noneNewHater.changed).to.be.false
        expect(noneNewFriends).to.haveOwnProperty('changed')
        expect(noneNewFriends.changed).to.be.false
        expect(oneNewFriends).to.haveOwnProperty('changed')
        expect(oneNewFriends.changed).to.be.false
      })

      it('should return an object with [haters and newHaters] properly populated', function() {
        expect(twoNewHater).to.be.an('object')
        expect(twoNewHater).to.not.be.null
        expect(twoNewHater).to.have.property('newHaters')
          .that.is.an('array')
          .to.have.lengthOf(2)
          .with.deep.property('[0]')
            .that.deep.equals(8673243842)
        expect(noneNewHater).to.have.property('newHaters')
          .that.is.an('array')
          .to.have.lengthOf(0)

        expect(twoNewHater).to.have.property('haters')
        .that.is.an('array')
        .to.have.lengthOf(cachedUserInfo.haters.length + 2)
      })

      it('should return an object with newFriends properly populated', function() {
        expect(oneNewFriends).to.be.an('object')
        expect(oneNewFriends).to.not.be.null

        expect(oneNewFriends).to.have.property('newFriends')
          .that.is.an('array')
          .to.have.lengthOf(1)
          .with.deep.property('[0]')
            .that.deep.equals(123)

        expect(noneNewFriends).to.have.property('newFriends')
          .that.is.an('array')
          .to.have.lengthOf(0)
        
        expect(twoNewHater).to.have.property('friends')
          .that.is.an('array')
          .to.have.lengthOf(cachedUserInfo.friends.length + 1)
      })
    })

    xdescribe('Utility: updateDatabaseWithNewInfo', function() {

      it('should update the database with updated friends and haters', function() {

      })
    })

    xdescribe('ALL TOGETHER NOW! -> Controller: chronHaters', function() {
      it('chronHaters controller should be invoked', function() {

      })

      it('should respond 400 if user is not logged in', function() {

      })
    })
    
  })

})