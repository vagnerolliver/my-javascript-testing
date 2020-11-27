const http = require('http')
const PORT = 3000
const DEFAULT_HEADER = { 'Content-Type': 'application/json' }
const CarFactory = require('./factories/carFactory')
const carService = CarFactory.generateInstance()

const routes = { 
    '/cars:get': async (request, response) => {
        const { searchParams } = new URL(request.url, `http://${request.headers.host}`);
        const  id = searchParams.get('id') 
        const body = await carService.carRepository.find(id)
        response.write(JSON.stringify(body))

        return response.end()
    },
 
    default: (request, response) => {
        response.write(JSON.stringify({ text: 'Hello World!' }))
        response.end()
    }
}

const handler = function(request, response) {
    const { url, method } = request
    const routeKey = `${url}:${method.toLowerCase()}`
 
    const chosen = routes[routeKey] || routes.default

    response.writeHead(200, DEFAULT_HEADER)

    return chosen(request, response)
}

const app = http.createServer(handler)
    .listen(PORT, () => console.log('app running at ', PORT))
        
module.exports = app