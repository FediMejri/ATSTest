const mongoose = require('mongoose')
const Schema=mongoose.Schema

const ProductSchema = new Schema({
    color : {type: String},
    category : {type: String},
    productName : {type: String},
    price : {type: String},
    description : {type: String},
    tag : {type: String},
    productMaterial : {type: String},
    imageUrl : {type: String},
    createdAt : {type : Date},
    reviews : [{
        rating : {type: Number},
        content : {type : String}
    }]
})

mongoose.model('products',ProductSchema)