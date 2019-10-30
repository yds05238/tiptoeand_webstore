const functions = require('firebase-functions')
const admin = require('firebase-admin')
const express = require('express')
const app = express()

admin.initializeApp()

const db = admin.firestore()
const products = db.collection('products')
const users = db.collection('users')

exports.api = functions.https.onRequest(app)

app.get('/getProducts', async (req, res) => {
  let prod_snapshot = await products.get()
  let prod_list = []
  prod_snapshot.forEach((doc) => {
    prod_list.push(Object.assign({}, { id: doc.id }, doc.data()))
  })
  res.send({ data: prod_list })
})