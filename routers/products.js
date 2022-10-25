const {Product} = require('../models/product');
const {Category} = require('../models/category');
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');


router.get(`/`, async (req, res) => {
    let filter = {};
    if(req.query.categories)
    {
         filter = {category: req.query.categories.split(',')}
    }

    const productList =  await Product.find(filter).populate('category');
    if(!productList) {
        res.status(500).json({success: false})
    }
    res.send(productList);  
})

router.get('/:id', async(req, res)=> {
    const product = await Product.findById(req.params.id).populate('category');
    if(!product) {
        res.status(500).json({message: 'the product with the given ID was not found!'})
    }
    res.status(200).send(product);
})


router.post(`/`, async (req, res) =>{
    const category = await Category.findById(req.body.category);
    if(!category) return res.status(400).send('Invalid Category')

    let product = new Product({
        name: req.body.name,
        price: req.body.price,
        quanlity:req.body.quanlity,
        desc: req.body.desc,
        category: req.body.category
    })

    product = await product.save();

    if(!product) 
    return res.status(500).send('The product cannot be created')

    res.send(product);
})

router.put('/:id', async (req, res)=> {
    if(!mongoose.isValidObjectId(req.params.id)){
        return res.status(500).send(' Invalid product id !');
    }
    const product = await Product.findByIdAndUpdate(
        req.params.id,{
            name: req.body.name,
            price: req.body.price,
            quanlity:req.body.quanlity,
            desc: req.body.desc,
            category: req.body.category,
        },{
            new:true
        }
    )
    if(!product) 
    return  res.status(500).send(' The product cannot be update !');

    res.send(product);
})

router.delete('/:id',(req, res)=>{
    Product.findByIdAndRemove(req.params.id).then(product => {
        if(product) {
            return res.status(200).json({success:true, message: 'the product is deleted!'})
        } else {
            return res.status(404).json({success: false, message: 'product note found!'})
        }
    }).catch(err=>{
        return res.status(400).json({success: false, error: err})
    })
})

router.get('/get/count', async(req, res)=> {
    const productCount = await Product.countDocuments((count) => count);

    if(!productCount) {
        res.status(500).json({success: false})
    }
    res.status(200).send({
        productCount: productCount
    });
})

// router.get('/get/featured/:count', async(req, res)=> {
    // const count = req.params.count ? req.params.count : 0
//     const products = await Product.find({isFeatured: true}).limit(+count);

//     if(!products) {
//         res.status(500).json({success: false})
//     }
//     res.status(200).send(products);
// })

module.exports = router;
