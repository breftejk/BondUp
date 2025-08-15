import Fastify, { FastifyInstance } from 'fastify'
import { env } from './config'

export class App {
    private fastify: FastifyInstance

    constructor() {
        this.fastify = Fastify({
            logger: env.DOPPLER_ENVIRONMENT !== 'prd',
        })
    }
    
    async start() {
        try {
            await this.fastify.listen({ port: env.PORT })
            console.log(`Server is running port ${env.PORT}`)
        } catch (err) {
            process.exit(1)
        }
    }
}
