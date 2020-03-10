const functions = require('firebase-functions')
const admin = require('firebase-admin')
const express = require('express')
const bodyparser = require('body-parser')
const cors = require('cors')
const app = express()

admin.initializeApp()

const db = admin.firestore()
const products = db.collection('products')
const transactions = db.collection('transactions')

app.use(cors({ origin: true }))
app.use(bodyparser.json())
app.use(bodyparser.urlencoded({ extended: false }))

exports.api = functions.https.onRequest(app)

app.get('/products', (req, res) => {
  products.get()
    .then((snapshot) => {
      let prod_list = []
      snapshot.forEach((doc) => {
        prod_list.push(doc.data())
      })
      res.send({ data: prod_list })
      return
    })
    .catch((error) => {
      res.send(error)
    })
})

app.get('/products/:product_id', (req, res) => {
  let { product_id } = req.params
  products.doc(product_id).get()
    .then((doc) => {
      res.send({ data: doc.data() })
      return
    })
    .catch((error) =>
      res.send(error)
    )
})

app.get('/transactions', (req, res) => {
  transactions.get()
    .then((snapshot) => {
      let t_list = []
      snapshot.forEach((doc) => {
        let today = doc.get('transactions_today')
        let data = doc.data()
        t_list.push({ today, data })
      })
      res.send({ data: t_list })
      return
    })
    .catch((error) => {
      res.send(error)
    })
})
