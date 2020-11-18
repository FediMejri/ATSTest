const express = require('express')
const exphbs  = require('express-handlebars');
const Handlebars = require('handlebars')
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const axios = require('axios')
require('./models/Product')

const port = 5002

const app=express()

const {productAverage} = require('./helpers/helper')

mongoose.Promise=global.Promise
mongoose.connect('mongodb+srv://mohamedfedi:abcdefg1234!@cluster0-5q2tv.mongodb.net/TestTest?retryWrites=true&w=majority',
    {useUnifiedTopology:true})
    .then(console.log('database connected'))
    .catch(err=>{
        console.log(err)
    })

const Product = mongoose.model('products')

//Handlebars middleware
app.engine('handlebars', exphbs({
    helpers:{
        productAverage:productAverage
    },
    handlebars: allowInsecurePrototypeAccess(Handlebars)
}));
app.set('view engine', 'handlebars');

//BodyParser middleware
app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())

app.get('/',(req,res)=>{
    res.render('home')
})

app.get('/save',(req,res)=>{
    axios.get('http://test.ats-digital.com:3000/products?size=100')
    .then(function(response){
        let inc=0
        let products={}
        products = response.data
        let tab = products.products
        for (let i=0; i<tab.length;i++){
            const newProduct = {
                color : tab[i].color,
                category : tab[i].category,
                productName : tab[i].productName,
                price : tab[i].price,
                description : tab[i].description,
                tag : tab[i].tag,
                productMaterial: tab[i].productMaterial,
                imageUrl : tab[i].imageUrl,
                createdAt: tab[i].createdAt,
                reviews : tab[i].reviews
            }
            new Product(newProduct)
            .save()
            .then(product=>{
                inc+=1
            })
        }
        res.redirect('/products/1')
    })
    .catch(function(error){
        console.log(error)
    })
    .then(function(){

    })
})

app.get('/products/:numb',(req,res)=>{
    const numb=req.params.numb
    Product.find()
    .select('productName category imageUrl reviews')
    .limit(20*1)
    .skip((numb-1)*20)
    .exec()
    .then(products=>{
        let sum=0
        let avg=0
        let reviews=[]
        products.map(product=>{
            
            
            reviews = product.reviews
            for(let j=0;j<reviews.length;j++){
                sum+=reviews[j].rating
            }
            
        })
        avg=sum/reviews.length
        res.render('products',{
            products : products,
            number : numb
        })
    })
    .catch(err=>{
        res.json({error : errr})
    })
})

app.get('/product/:id',(req,res)=>{
    Product.findOne({_id:req.params.id})
    .select('productName category imageUrl reviews')
    .then(product=>{
        res.render('showproduct',{
            product : product
        })
    })
    .catch(err=>{
        res.json({error : err})
    })
})

app.listen(port,()=>{
    console.log('server listening on port'+port)
})