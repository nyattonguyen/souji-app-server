const mongoose = require('mongoose');



const categorySchema = mongoose.Schema({
    name:{
        type: String,
        require:true
    }
    
})


exports.Category = mongoose.model('Category', categorySchema);
