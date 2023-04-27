import functions from 'firebase-functions'
import express from 'express'
import cors from 'cors'
import { login, signup } from './src/users.js'
import { getShows, addShow } from './src/shows.js'

const app = express() // creates our express app
app.use(cors())
app.use(express.json())

// USER ROUTES GO HERE...
app.post ("/signup", signup)
app.post ("/login", login)

// SHOW ROUTES GO HERE
app.get ("/shows", getShows)
app.post ("/shows", addShow)


// lets us run locallly without emulators:
app.listen(3000, () => console.log(`Listening on http://localhost:3000...`))

export const api = functions.https.onRequest(app) // exports our cloud function
