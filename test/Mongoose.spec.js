require('dotenv').config()
const chai = require('chai')
const mongoose = require('mongoose')
const Users = require('../server/database/').Users
const usersUtil = require('../server/database/dbUtil/UsersUtil')
mongoose.Promise = require('bluebird')

const expect = chai.expect

describe('---------Mongoose DB Methods---------', function() {

  beforeEach(function(done) {
    if(mongoose.connection.readyState) {
      done()
    } else {
      mongoose.connect(process.env.DB_MONGO_TEST, done)
    }
  })

  after(function(done) {
    Users.remove({ user_id: 'Twitter|123' }).then(()=> {
      // mongoose.connection.close(function() { done() })
      done()
    })
  })

  it('database should add documents, if user does not already exist', async function() {
    await usersUtil.findOrCreate({ user_id: 'Twitter|123', simple_id: '123', screen_name: 'bungles' })
    let docs = await Users.find({ user_id: 'Twitter|123' })

    expect(docs).to.have.lengthOf(1)
    expect(docs[0].to)
  })

  it('should not create a new document if user is already in database', async function() {
    await usersUtil.findOrCreate({ user_id: 'Twitter|123', simple_id: '123', screen_name: 'bungles' })
    let docs = await Users.find({ user_id: 'Twitter|123' })
    
    expect(docs).to.have.lengthOf(1)
    
  })
})