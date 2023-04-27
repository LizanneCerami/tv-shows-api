import { FieldValue } from 'firebase-admin/firestore'
import { db } from './dbConnect.js'

const collection = db.collection('users')

export async function signup(req, res) {
  const { email, password } = req.body // gets email and password from the request body
  if( !email || !password ) {
    res.status(400).send({ message: "Email and password are both required." })
    return
  }
  // TODO: check if email is already in use
  const  newUser = {
    email: email.toLowerCase(),
    password,
    createdAt: FieldValue.serverTimestamp(), // used to store time
  }
  await collection.add(newUser)
  // once the user is added... log them in...
  login(req, res)
}


export async function login(req, res) {
  const { email, password } = req.body
  if( !email || !password ) {
    res.status(400).send({ message: "Email and password are both required." })
    return
  }
  const users = await collection // collection refers to firestore users collection
    .where("email", "==", email.toLowerCase()) // go to collection and find any email that match
    .where("password", "==", password) // only show us the documents if the password is exactly equal to what was logged in
    .get()
  let user = users.docs.map(doc => ({...doc.data(), id: doc.id})) [0] // necessary to go through doc and return needed data in a structured form.
  if(!user){
    res.status(400).send({message: "Invalid email and/or password."})
  }
  delete user.password
  res.send(user) // tells user they've successfully logged in, sends back object with { email, createdAt, id}
}