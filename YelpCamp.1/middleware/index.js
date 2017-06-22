var Campground = require("../models/campground");
var Comment = require("../models/comment");
// MIDDLEWARE

var middlewareObj = {};

//Does the current user have ownership of the campground page to edit/delete
middlewareObj.checkCampgroundOwnership = function(req, res, next){
    if(req.isAuthenticated()){
        Campground.findById(req.params.id, function(err, foundCampground){
         if(err){
             req.flash("error", "Campground not found");
             res.redirect("back");
         } else {
             if(foundCampground.author.id.equals(req.user._id)){
                 next();
             } else {
                 req.flash("error", "You don't have permission to do that");
                 res.redirect("back");
             }
          }
        });    
    } else { 
        res.redirect("back");
    }
};

//Does the current user have ownership of the comment to edit/delete
middlewareObj.checkCommentOwnership = function(req, res, next){
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, function(err, foundComment){
         if(err){
             res.redirect("back");
         } else {
             if(foundComment.author.id.equals(req.user._id)){
                 next();
             } else {
                 req.flash("error", "You don't have permission to do that");
                 res.redirect("back");
             }
          }
        });    
    } else { 
        req.flash("error", "You need to be logged in to do that");
        res.redirect("back");
    }
};

//The person needs to be logged in to make changes or add new page
middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "You need to be logged in to do that");
    res.redirect("/login");
};

module.exports = middlewareObj;