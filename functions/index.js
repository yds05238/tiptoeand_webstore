const functions = require('firebase-functions')
const admin = require('firebase-admin')
const express = require('express')
const bodyparser = require('body-parser')
const app = express()

admin.initializeApp()

const db = admin.firestore()
const products = db.collection('products')
const users = db.collection('users')

app.use(bodyparser.json())
app.use(bodyparser.urlencoded({ extended: false }))

exports.api = functions.https.onRequest(app)

app.get('/getProducts', async (req, res) => {
  let prod_snapshot = await products.get()
  let prod_list = []
  prod_snapshot.forEach((doc) => {
    prod_list.push(doc.data())
  })
  res.send({ data: prod_list })
})

app.get('/:product_id', (req, res) => {
  let { product_id } = req.params
  products.doc(product_id).get()
    .then(doc => {
      res.send({ data: doc.data() })
      return
    })
    .catch(error =>
      res.send(error)
    )
})

app.post('/:product_id/addPurchase', (req, res) => {
  try {
    let { product_id } = req.params
    let { name, netid, venmo_id, color, size } = req.body
    let user = { name, netid, venmo_id, product_id, color, size }
    users.doc(netid).set(user)
    res.send({ data: user })
  } catch (error) {
    res.send({ error })
  }
})