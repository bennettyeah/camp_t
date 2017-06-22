var mongoose = require("mongoose");



// Schema set-up
var campgroundSchema = new mongoose.Schema({
   name: String,
   price: String,
   image: String,
   description: String,
   region: String,
   website: String,
   activities: String,
   contact: String,
   open: String,
   danger: String,
   author: { 
      id: {
         type: mongoose.Schema.Types.ObjectId,
         ref: "User"
      },
      username: String
   },
   comments: [
       {
           type: mongoose.Schema.Types.ObjectId,
           ref: "Comment"
       }
       ]
});

module.exports = mongoose.model("Campground", campgroundSchema);