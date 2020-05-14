if(process.env.NODE_ENV !== 'production') {
    require('dotenv').load()
}



const stripeSecretKey = process.env.STRIPE_SECRET_KEY
const stripePublicKey = process.env.STRIPE_PUBLIC_KEY
import express, { static } from 'express'
const app = express()

console.log(stripeSecretKey, stripePublicKey)


const stripe = require('stripe')(stripeSecretKey)
const express= require('express')
const app= express()
const fs=require('fs')

app.listen(3000)

app.use(express.json())
app.set('view engine' , 'ejs' )
app.use(express.static('public'))

app.get('/store', function(req,res) {
    fs.readFile('items.json', function(error,data){
        if (error) {
            res.status(500).end()
        
        }else {
            res.render('store.ejs', {
               stripePublicKey: stripePublicKey,
                items: JSON.parse(data)
            })
        }
    })
})

app.post('/purchase', function(req,res) {
    fs.readFile('items.json', function(error,data){
        if (error) {
            res.status(500).end()  
        }else {
            const itemJson = JSON.parse(data)
            const itemsArray= ItemJson.music.concat(itemsJson.merch)
            let total = 0
            req.body.items.forEach(function(item) {
        const itemJson = itemsArray.find(function(i) {
            return i.id == item.id
        })
        total = total + itemJson.price * item.quantity
    })
    stripe.charge.charge({
        amount: total,
        source: req.body.stripeTokenId,
        currency: 'euro'
    }).then(function() {
        console.log('Charge SUccessful')
        res.json({message: 'Sucessfully purchased Items'})
    }).catch(function() {
        console.log('Charge Fail')
        res.status(500).end()
    })
    }
 })
})
