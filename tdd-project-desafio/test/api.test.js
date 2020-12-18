const { describe, it } = require("mocha")
const { expect } = require('chai')
const sinon = require('sinon') 
const request = require('supertest')
const Api = require('../src/api')
const CarService = require('../src/services/carService')
const SERVER_TEST_PORT = 4000

const mocks = {
    validCar: require('./mocks/valid-car.json'),
    validCarCategory: require('./mocks/valid-carCategory.json'), 
    validCustomer: require('./mocks/valid-customer.json'),
}
describe('API Suite test', () => {
    let sandbox = {}
    let app = {}

    beforeEach(() => {
        sandbox = sinon.createSandbox()
    })

    afterEach(() => {
        sandbox.restore()
    })

    before(() => {
        const carService = new CarService({ 
            cars: './../../database/cars.json'
        })        
        const instance = Api(carService)

        app = { 
            instance,
            server: instance.initialize(SERVER_TEST_PORT)
        }
    })

    describe('/getAvailableCar:get', () => {
        it('given a carCategory it should return an available car', async () => { 
            const car = mocks.validCar
            // const carCategory = Object.create(mocks.validCarCategory)
            const carCategory = {
                ...mocks.validCarCategory,
                carIds: [car.id]
            }
    
            sandbox.stub( 
                app.instance.carService.carRepository,
                app.instance.carService.carRepository.find.name, 
            )
            .resolves(car)
            
            const expected = {
                result: car
            }

            const response = await request(app.server)
                .post('/getAvailableCar')
                .send(carCategory)
                .expect(200)

            expect(response.body).to.be.deep.equal(expected)
        })
    })

    describe('/rent:post', () => {
        it('given a carCategory, custumer and numberOfDay it should calculate final amount in real', async () =>{
        
        })
    })

    describe('/calculateFinalPrice:post', () => {
        it('given a customer and a carCategory it should return a transaction receipt', async () => {
        
        })
    })

    describe('/cars',() => { 
        it('should request the \'cars\' and return HTPP status 200', async () => {
            const car = mocks.validCar
            
            sandbox.stub(
                app.instance.carService.carRepository,
                app.instance.carService.carRepository.find.name, 
            ).resolves(car)

            const response = await request(app.server)
                        .get('/cars')
                        .expect(200)
                      
            const expected = car
            expect(JSON.stringify(response.body)).to.be.deep.equal(JSON.stringify(expected))
        })
    })

    describe('/hello',() => { 
        it('should request an inexistent route /hi and redirect to /hello', async () => {
            const response = await request(app.server)
                        .get('/hi')
                        .expect(200)
                        
            const expected = '{"text":"Hello World!"}' 
            expect(JSON.stringify(response.body)).to.be.deep.equal(expected)
         })
    })
})