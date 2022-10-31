const mongoose = require('mongoose');

const orderItemSchema = mongoose.Schema({
   
          quanlity:{
               type: Number,
               require:"true"
          },
          
          product:{
               type: mongoose.Schema.Types.ObjectId,
               ref:'Product',
               require:true,
          }
    
     
 })


exports.OrderItem = mongoose.model('OrderItem', orderItemSchema);



