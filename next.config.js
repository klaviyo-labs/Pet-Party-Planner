/** @type {import('next').NextConfig} */
const mongoose = require('mongoose')

module.exports = (phase) => {
    const nextConfig = {}

    // Verify environmental variables are setup
    if (!process.env.JWT_SECRET || !process.env.DB_ENCRYPTION_KEY) {
                throw new Error(
    'Please define the JWT_SECRET and DB_ENCRYPTION_KEY environment variables inside .env.local'
        )
    }

    if (!process.env.CLIENT_SECRET || !process.env.NEXT_PUBLIC_CLIENT_ID) {
        throw new Error('Please define the klaviyo integration variables in .env.local')
    }


    const MONGODB_URI = process.env.MONGODB_URI

    if (!MONGODB_URI) {
        throw new Error(
    'Please define the MONGODB_URI environment variable inside .env.local'
        )
    }

    const opts = {
      bufferCommands: false,
    }
    // establish mongodb connection on startup
    mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      return mongoose
    })

    return nextConfig
}
