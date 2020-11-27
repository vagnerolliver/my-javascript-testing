const CarService = require('../services/carService')

const { join } = require('path')
const carsDatabase = join(__dirname, '../../database', 'cars.json')

const generateInstance = () => {
 
    const carService = new CarService({
        cars: carsDatabase
    })

    return carService
}

module.exports = { generateInstance }