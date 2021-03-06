const http = require('http')
const DEFAULT_PORT = 3000
const DEFAULT_HEADERS = {
    'Content-Type': 'application/json'
} 
const CarFactory = require('./factories/carFactory')
 
class Api {
    constructor(carService = CarFactory.generateInstance()) {
        this.carService = carService
    }

    generateRoutes() { 
        return { 
            '/cars:get': async (request, response) => {
                const { searchParams } = new URL(request.url, `http://${request.headers.host}`);
                const  id = searchParams.get('id') 
                const body = await this.carService.carRepository.find(id)
                response.write(JSON.stringify(body))
    
                return response.end()
            },

            '/getAvailableCar:post': async (request, response) => {

                try {
                    for await (const data of request) {
                        const carCategory = JSON.parse(data)
                         // alguma validacao top aqui
    
                        const result = await this.carService.getAvailableCar(carCategory)
    
                        response.writeHead(200, DEFAULT_HEADERS)
    
                        response.write(JSON.stringify({ result }))
                        response.end()
                    } 
                } catch (error) {
                    console.log('error', error)
                    response.writeHead(500, DEFAULT_HEADERS)
                    response.write(JSON.stringify({ error: 'Deu Ruim!' }))
                    response.end()
                }
                
                return response.end()
            },

            '/calculateFinalPrice:post': async (request, response) => {

                try {
                    for await (const data of request) {
                        const { customer, carCategory, numberOfDays} = JSON.parse(data)
                         // alguma validacao top aqui
 
                        const result = await this.carService.calculateFinalPrice(customer, carCategory, numberOfDays)
                    
                        response.writeHead(200, DEFAULT_HEADERS)
    
                        response.write(JSON.stringify({ result }))
                        response.end()
                    } 
                } catch (error) {
                    console.log('error', error)
                    response.writeHead(500, DEFAULT_HEADERS)
                    response.write(JSON.stringify({ error: 'Deu Ruim!' }))
                    response.end()
                }
                
                return response.end()
            },

            '/rent:post': async (request, response) => {

                try {
                    for await (const data of request) {
                        const { customer, carCategory, numberOfDays} = JSON.parse(data)
                         // alguma validacao top aqui
 
                        const result = await this.carService.rent(customer, carCategory, numberOfDays)
                    
                        response.writeHead(200, DEFAULT_HEADERS)
    
                        response.write(JSON.stringify({ result }))
                        response.end()
                    } 
                } catch (error) {
                    console.log('error', error)
                    response.writeHead(500, DEFAULT_HEADERS)
                    response.write(JSON.stringify({ error: 'Deu Ruim!' }))
                    response.end()
                }
                
                return response.end()
            },
        
            default: (request, response) => {
                response.write(JSON.stringify({ text: 'Hello World!' }))
                response.end()
            }
        }
    }

    handler(request, response) {
        const { url, method } = request
        const routeKey = `${url}:${method.toLowerCase()}`
        const routes = this.generateRoutes()
        const chosen = routes[routeKey] || routes.default

        response.writeHead(200, DEFAULT_HEADERS)

        return chosen(request, response)
    }

    initialize(port = DEFAULT_PORT) {

        const app = http.createServer(this.handler.bind(this))
            .listen(port, _ => console.log('app running at', port))

        return app
    }
}


if (process.env.NODE_ENV !== 'test') {
    const api = new Api()
    api.initialize()
}
    
        
module.exports = (dependencies) => new Api(dependencies)