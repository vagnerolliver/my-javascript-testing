const { describe, it } = require("mocha")
const app = require('../../src/api')
const request = require('supertest')
const assert = require('assert')
const sinon = require('sinon') 
const CarFactory = require('../../src/factories/carFactory')


describe('API Suite test', () => {
    let sandbox = {}

    beforeEach(() => {
        sandbox = sinon.createSandbox()
    })

    afterEach(() => {
        sandbox.restore()
    })

    describe('/cars',() => { 
        it('should request the \'cars\' page and return HTPP status 200', async () => {
            sandbox.stub(
                CarFactory, 
                CarFactory.generateInstance.name 
            )
            .withArgs('fake args') 
            .returns('fake return')

            const response = await request(app)
                        .get('/cars')
                        .expect(200)

            console.log(response.body)
        })
    })

    describe('/hello',() => { 
        it('should request an inexistent route /hi and redirect to /hello', async () => {
            const response = await request(app)
                        .get('/hi')
                        .expect(200)
 
            assert.deepStrictEqual(response.body.text, 'Hello World!')
        })
    })
})