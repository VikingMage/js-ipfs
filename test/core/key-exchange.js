/* eslint max-nested-callbacks: ["error", 8] */
/* eslint-env mocha */
'use strict'

const { expect } = require('interface-ipfs-core/src/utils/mocha')
const hat = require('hat')
const IPFS = require('../../src/core')

// This gets replaced by `create-repo-browser.js` in the browser
const createTempRepo = require('../utils/create-repo-nodejs.js')

describe('key exchange', () => {
  let ipfs
  let repo
  let selfPem
  const passwordPem = hat()

  before(function (done) {
    this.timeout(20 * 1000)
    repo = createTempRepo()
    ipfs = new IPFS({
      repo: repo,
      pass: hat(),
      preload: { enabled: false }
    })
    ipfs.on('ready', () => done())
  })

  after((done) => ipfs.stop(done))

  after((done) => repo.teardown(done))

  it('exports', (done) => {
    ipfs.key.export('self', passwordPem, (err, pem) => {
      expect(err).to.not.exist()
      expect(pem).to.exist()
      selfPem = pem
      done()
    })
  })

  it('imports', function (done) {
    this.timeout(20 * 1000)

    ipfs.key.import('clone', selfPem, passwordPem, (err, key) => {
      expect(err).to.not.exist()
      expect(key).to.exist()
      expect(key).to.have.property('name', 'clone')
      expect(key).to.have.property('id')
      done()
    })
  })
})
