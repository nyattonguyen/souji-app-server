const mongoose = require('mongoose');



const productSchema = mongoose.Schema({
    name: {
        type:String,
        require:true
    },
    price:{
        type:Number,
        default:0
    },
    quanlityH:{
        type:String,
        require:true
    },
    desc:{
        type:String,
        default:''
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        require: true
    },
    
    
})
productSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

productSchema.set('toJSON', {
    virtuals: true,
});



exports.Product = mongoose.model('Product', productSchema);



// "_id": "633799ead2da8b3f1e447908",
// "name": "Tối đa 50M vuông",
// "price": 230000,
// "quanlity": "2 giờ 30ph",
// "desc": "Quét bụi, quét mạng nhện, trần nhà. Vệ sinh phần tường nhà (quét bụi hoặc lau). Phủi bụi rèm cửa, vệ sinh cửa ra vào, cửa sổ. Phủi bụi lau chùi bề mặt ghế, tủ kệ,..thu gom và đổ rác.",
// "category": {
//     "_id": "63371e60ec067be5ec687f1c",
//     "name": "Vệ sinh phòng",
//     "__v": 0
// },
// "__v": 0