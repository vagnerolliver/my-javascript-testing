const { deepStrictEqual } = require('assert')
const { describe, it } = require('mocha')
const request = require('supertest')
const app = require('./api')
describe('API Suite test', () => {

    describe('/contact', () => {

        it('should request the contact page and return HTTP status 200', async () => {
            const response = await request(app)
                                    .get('/contact')
                                    .expect(200)
                                    
            deepStrictEqual(response.text, 'contact us page')
        })
    })

    describe('/hello', () => {

        it('should request an inexistent rount /hi and redirect to /hello', async () => {
            const response = await request(app)
                                    .get('/hi')
                                    .expect(200)
                                    
            deepStrictEqual(response.text, 'Hello World!')
        })
    })
})