const { describe, it } = require("mocha")
const { expect } = require('chai')
const sinon = require('sinon') 
const request = require('supertest')
const Api = require('../src/api')
const CarService = require('../src/services/carService')
const SERVER_TEST_PORT = 4000
const { join } = require('path')

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
        const carsDatabase = join(__dirname, './../database', 'cars.json')
        // const carsDatabase = './../database/cars.json'

        const carService = new CarService({ 
            cars: carsDatabase
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

    describe('/calculateFinalPrice:post', () => {
        it('given a carCategory, customer and numberOfDay it should calculate final amount in real', async () =>{
            const customer = {
                ...mocks.validCustomer,
                age: 50
            } 

            const carCategory = {
                ...mocks.validCarCategory,
                price: 37.6,
            } 

            const numberOfDays = 5

            const body = {
                customer,
                carCategory,
                numberOfDays
            }

            const expected =  {
                result: app.instance.carService.currencyFormat.format(244.4)
            }

            const response = await request(app.server)
                .post('/calculateFinalPrice')
                .send(body)
                .expect(200)
            
            expect(response.body).to.be.deep.equal(expected)
        })
    })

    describe('/rent:post', () => {
        it('given a customer and a carCategory it should return a transaction receipt', async () => {
            const customer = {
                ...mocks.validCustomer,
                age: 50
            } 

            const car = mocks.validCar
            const carCategory = {
                ...mocks.validCarCategory,
                price: 37.6,
                carIds: [car.id]
            } 
   
            const numberOfDays = 5

            const body = {
                customer,
                carCategory,
                numberOfDays
            }

            const dueDate = "10 de novembro de 2020"
            
            const now = new Date(2020, 10, 5)
            sandbox.useFakeTimers(now.getTime())

            sandbox.stub(
                app.instance.carService.carRepository,
                app.instance.carService.carRepository.find.name, 
            ).resolves(car)

            const expected =  {
                result: { 
                    customer,
                    car,
                    // Then the final formula will be `((price per day * Tax) * number of days)`  
                    // And the final result will be `((37.6 * 1.3) * 5)= 244.4`  
                    amount: app.instance.carService.currencyFormat.format(244.4),
                    dueDate
                }
            }

            const response = await request(app.server)
                .post('/rent')
                .send(body)
                .expect(200)

            expect(response.body).to.be.deep.equal(expected)
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