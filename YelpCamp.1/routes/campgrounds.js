var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var middleware = require("../middleware");

//INDEX -- Show all the campgrounds
router.get("/", function(req, res){
   // Get all the campgrounds from the database
   Campground.find({}, function(err, allCampgrounds){
      if(err){
          console.log(err);
      }  else {
          res.render("campgrounds/index", {campgrounds:allCampgrounds});
      }
   });
});

//CREATE -- Add new campgrounds to the database
router.post("/", middleware.isLoggedIn, function(req, res) {
   // Retrieve data from add new campground form
   var name = req.body.name;
   var price = req.body.price;
   var image = req.body.image;
   var desc = req.body.description;
   var region = req.body.region;
   var website = req.body.website;
   var activities = req.body.activities;
   var contact = req.body.contact;
   var open = req.body.open;
   var danger = req.body.danger;
   var author = {
       id: req.user._id,
       username: req.user.username
   };
   var newCampground = {name: name, price: price, image: image, description: desc, region: region, author: author, website: website, activities: activities, contact: contact, open: open, danger: danger};
   //Create new campground and save to the database
  Campground.create(newCampground, function(err, newlyCreated){
      if(err) {
          console.log(err);
      } else { 
          // Redirect if error occurs so user can correct their error
          res.redirect("/campgrounds");
          console.log(req.body);
      }
  });
});

//NEW -Show the form for adding a new campgrounf
router.get("/new", middleware.isLoggedIn, function(req, res){
    res.render("campgrounds/new");
});


//SHOW - Shows more infomation about a campground
router.get("/:id", function(req, res){
    //Find the campgrounds with provided ID
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if(err){
            console.log(err);
        } else {
            console.log(foundCampground);
             //Render show template with that campground
            res.render("campgrounds/show", {campground: foundCampground}); 
        }
    });
    
});

//EDIT Campground route
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res){
        Campground.findById(req.params.id, function(err, foundCampground){
            res.render("campgrounds/edit", {campground: foundCampground});
        });    
});

//UPDATE Campground route
router.put("/:id", middleware.checkCampgroundOwnership, function(req, res){
   //Find and update the correct campground
   Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
       if(err){
           res.redirect("/campgrounds");
       } else {
           res.redirect("/campgrounds/" + req.params.id);
       }
   });
});

// DESTROY Delete a campground
router.delete("/:id", middleware.checkCampgroundOwnership ,function(req, res){
   Campground.findByIdAndRemove(req.params.id, function(err){
      if(err){
          res.redirect("/campgrounds");
      } else {
          res.redirect("/campgrounds");
      }
   }); 
});




module.exports = router;