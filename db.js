let mongoose = require('mongoose');
mongoose.connect(process.env.DB, {useNewUrlParser: true, useUnifiedTopology: true}, console.log("success in connecting to mongodb"));
mongoose.set('strict', true);

let bookSchema = new mongoose.Schema({
    comments:{type:Array, required:false},
    title: {type: String, required:true},
    commentcount:  {type: Number, required:false, default:0},
})

exports.bookSchema = bookSchema;