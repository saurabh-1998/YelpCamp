var express         = require("express"),
    app             = express(),
    bodyParser      = require("body-parser"),
    mongoose        = require("mongoose"),
    flash           = require("connect-flash"), 
    passport        = require("passport"),
    LocalStrategy   = require("passport-local"),
    methodOverride  = require("method-override"),
    Campground      =  require("./models/campground"),
    Comment         =  require("./models/comment"),
    User            = require("./models/user"),
    seedDB          =  require("./seeds")

//requiring routes
var commentRoutes    = require("./routes/comments"),
    campgroundRoutes = require("./routes/campgrounds"),
    indexRoutes       = require("./routes/index");
const { Passport } = require("passport");

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);    
mongoose.connect("mongodb://localhost/yelp_camp",{useUnifiedTopology: true});

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
//seedDB();

//PASSSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "Once again Rusty wins cutest dog!",
    resave: false,
    saveUninitialized: false 
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error= req.flash("error");
    res.locals.success= req.flash("success");
    next();
});


// Campground.create(
//     {
//         name: "Daisy" , 
//         image: "https://c1.hiqcdn.com/customcdn/500x500/blog/sites/default/files/camping-te.jpg",
//         description: "This is the description."

//     }, function(err, campground){
//         if(err){
//             console.log(err);
//         } else {
//             console.log("New Campground added: ");
//             console.log(campground);
//         } 
//     });

app.use("/", indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);


app.listen(3000,function(){
    console.log("The YelpCamp Server started!!"); 
});