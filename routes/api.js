/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';

const mongoose = require('mongoose');
const {bookSchema} = require("../db.js")
const Books = mongoose.model("Books", bookSchema)

const readOne = (search, options) => {
  let found = Books.findOne(search, options)
  return found;
}

const readMany = (search, options) => {
  let found = Books.find(search, options)
  return found;
}

module.exports = (app) => {

  app.route('/api/books/')
    .get(async (req, res) => {
      //response will be array of book objects
      try{
        let result = await readMany({})
              
        if (result.length <= 0) return res.json("no book exists")

        return res.json(result)
      }catch(error){
        console.log(error);
        return res.json("no book exists");
      }
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
    })
    
    .post(async(req, res) => {
      let title = req.body.title;

      if(!title) return res.send("missing required field title");

      try{
        let created = (await Books.create({title: title}))._id;
        let result = await readOne({_id: created._id}).lean();

        delete result.comments;
        delete result.commentcount;
        delete result.__v;

        return res.json(result)
      }catch(error){
        console.log(error)
        return res.json("missing required field title")
      }
      //response will contain new book object including atleast _id and title
    })
    
    .delete(async (req, res) => {
      try{
        await Books.deleteMany({});
        return res.json("complete delete successful")
      }catch(error){
        return res.json(error);
      }
      //if successful response will be 'complete delete successful'
    });



  app.route('/api/books/:id')
    .get(async (req, res) => {
      let bookId = req.params.id;

      try{
        let result = await readOne({_id: bookId})

        if (!result) return res.json("no book exists")

        return res.json(result)
      }catch(error){
        //console.log(error);
        return res.json("no book exists");
      }
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
    })
    
    .post(async (req, res) => {
      let bookId = req.params.id;
      let comment = req.body.comment;

      if(!bookId) return res.json("missing required field title");
      if(!comment) return res.json("missing required field comment");
      
      try{
        let result = await Books.findByIdAndUpdate(bookId, {
          $push: {comments: comment},
          $inc: {commentcount : 1}
        }, {new: true}).lean();

        if (!result) return res.json("no book exists")

        return res.json(result)
      }catch(error){
        //console.log(error)
        return res.json("no book exists")
      }    
    })
    
    .delete(async (req, res) => {
      let bookId = req.params.id;

      try{
        if(!bookId) return res.json("no book exists");
        
        if(!(await Books.findByIdAndDelete(bookId))) return res.json("no book exists");
        
        return res.json("delete successful")
      }catch(error){
        //console.log(error)
        return res.json("no book exists")
      }
      //if successful response will be 'delete successful'
    });
  
};
