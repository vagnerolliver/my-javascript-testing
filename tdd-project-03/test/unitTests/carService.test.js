const { describe, it, before, beforeEach, afterEach } = require('mocha')
const CarService = require('../../src/services/carService')
const { join } = require('path') 
const { expect } = require('chai')
const sinon = require('sinon')
 
const carsDatabase = join(__dirname, './../../database', 'cars.json')

const mocks = {
    validCarCategory: require('./../mocks/valid-carCategory.json'),
    validCar: require('./../mocks/valida-car.json'),
    validCustomer: require('./../mocks/valid-customer.json')
}

describe('CarService Suite Tests', () => {
    let carService = {}
    let sandbox = {}
    before(()=> {
        carService = new CarService({
            cars: carsDatabase
        })
    })

    beforeEach(() => {
        sandbox = sinon.createSandbox()
    })

    afterEach(() => {
        sandbox.restore()
    })
    
    it('should retrieve a random position from an array', () => {
        const data = [0,1,2,3,4]
        const result = carService.getRandomPositionFromArray(data)

        expect(result).to.be.lte(data.length).and.be.gte(0)
    })

    it('should choose the first id from cardIs in carCategory',  () => {
        const carCategory = mocks.validCarCategory
        const carIdIndex = 0

        sandbox.stub(
            carService, 
            carService.getRandomPositionFromArray.name 
        )
        .withArgs(carCategory.carIds) 
        .returns(carIdIndex)
  
 
        const result = carService.chooseRandomCar(carCategory)
        const expected = carCategory.carIds[carIdIndex]

        expect(carService.getRandomPositionFromArray.calledOnce).to.be.ok
        expect(result).to.be.equal(expected)
    })


    it('given a carCategory it should return an available car', async () => {
        const car = mocks.validCar
        const carCategory = Object.create(mocks.validCarCategory)
        carCategory.carIds = [car.id]

        sandbox.stub( 
            carService.carRepository,
            carService.carRepository.find.name 
        )
        .resolves(car)

        sandbox.spy(
            carService,
            carService.chooseRandomCar.name
        )

        const result = await carService.getAvailableCar(carCategory)
        const expected = car 


        expect(carService.chooseRandomCar.calledOnce).to.be.ok
        expect(carService.carRepository.find.calledWithExactly(car.id)).to.be.ok
        expect(result).to.be.deep.equal(expected) 
    })

    it('given a carCategory, custumer and numberOfDay is should calculate final amount in real', async () =>{
        const custumer = Object.create(mocks.validCustomer)
        custumer.age = 50

        const carCategory = Object.create(mocks.validCarCategory)
        carCategory.price = 37.6

        const numberOfDays = 5

        // nao dependenr de dados externos
        sandbox.stub(
            carService,
            'taxesBasedOnAge'
        ).get(() => [{ from: 40, to: 50, then: 1.3}])

        const expected = carService.currencyFormat.format(244.40)
        const result = carService.calculateFinalPrice(
            custumer,
            carCategory, 
            numberOfDays
        )

        expect(result).to.be.deep.equal(expected)
     })
})