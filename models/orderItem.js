const mongoose = require('mongoose');

const orderItemSchema = mongoose.Schema({
   
          date:{
               type: String,
               require:true,
          },
          hours:{
               type: String,
               require: true,
          },
          product:{
               type: mongoose.Schema.Types.ObjectId,
               ref:'Product',
               require:true,
          }
    
     
 })


exports.OrderItem = mongoose.model('OrderItem', orderItemSchema);



