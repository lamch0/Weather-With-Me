if(process.env.NODE_ENV !== 'production'){
	require('dotenv').config()
  }
const express = require('express')
const app = express()
const bcrypt = require('bcrypt')
const passport = require('passport')
const flash = require('express-flash')
const session = require('express-session')
const methodOverride = require('method-override')
const { default: mongoose } = require('mongoose');
mongoose.connect('mongodb+srv://stu142:p215347-@csci2720.m2qbq.mongodb.net/stu142');
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Connection error:'));
//Upon opening the database successuflly
db.once('open', function () {
    console.log("Connection is open...")});

// aquire database schema models
const Location = require("./models/location_model");
const User = require('./models/user_model')
const Comment = require('./models/comment_model')

const dotenv = require('dotenv')
dotenv.config({path: './.env'})
const bodyParser = require('body-parser');
const res = require('express/lib/response');
app.use(bodyParser.urlencoded({extended: true}));

// creating passport for login 
const initializePassport = require('./utils/passport-config')
initializePassport(
  passport,
//   email => users.find(user => user.email === email),
  // username => users.find(user => user.username === username),
  // id => users.find(user => user.id === id),

  async (username) => {
    const userFound = await User.findOne({username: username});
    return userFound;
  },
  async (id) => {
    const userFound = await User.findOne({user_id: id});
    return userFound;
  } 
)

app.get('/user/:username', async (req, res) => {
  const user = await User.findOne({username: req.params.username})
  res.send(user)
})
// const users = []

app.set('view-engine', 'ejs')
app.use(express.urlencoded({ extended: false }))
app.use(flash())
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  name: "userInSession"
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(methodOverride('_method'))

app.get('/', checkAuthenticated, (req, res) => {
  console.log('logged in to ' + req.session.passport.user)
  res.render('profile.ejs', { username: req.session.passport.user })
})

app.get('/login', checkNotAuthenticated, (req, res) => {
  res.render('login.ejs')
})

app.post('/login', checkNotAuthenticated, passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login',
  failureFlash: true
}))

app.get('/register', checkNotAuthenticated, (req, res) => {
  res.render('register.ejs')
})



app.post('/register', checkNotAuthenticated, async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10)
    const newUser = new User({
      user_id: Date.now().toString(),
      username: req.body.username,
      password: hashedPassword,
      fav_loc: []
    })
    await newUser.save()
    
    // users.push({
    //   id: Date.now().toString(),
    //   username: req.body.username,
    // //   email: req.body.email,
    //   password: hashedPassword
    // })
    res.redirect('/login')
  } catch {
    console.log(error)
    res.redirect('/register')
  }
})

// Logging out from the session
app.delete('/logout', (req, res) => {
  req.session.destroy(() => {
    console.log('session destroyed')
  })
  req.logOut()
  res.redirect('/login')
})

function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next()
  }

  res.redirect('/login')
}

function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect('/')
  }
  next()
}
// End of account management (login logout register) section ===========================================

// add new location to the database
app.post('/addlocation', (req, res) => {
	var newLocation = req.query
	console.log(newLocation)
	Location.find(
		(err, locations) => {
			var maxId = Math.max(...locations.map(e => e.loc_id), 0)+1
			// console.log(maxId)
			Location.create({
				loc_id: maxId,
				name: newLocation.name,
				lat: newLocation.lat,
				lon: newLocation.lon,
				comments: []
			}, (err, location) => {
				if (err)
					return handleError(err);
				else 
					console.log(location)
					res.send(location)
				
			})
		}
	)
})

//Update Location (admin only)
app.put("/location/:loc_id/update",(req,res)=>{
  User.findOne(
    {user_id: req.params['user_id']},
    'user_id username user_type')
    .exec(
      (err,e)=>{
        if(err)
          {res.send(err);}
        else{
          if(e.user_type != "admin"){
            res,set('Content-Type','text/plain');
            res.status(404).send("Only admin can update the lcoation.");
          }
          else{
            Location.findOne({loc_id: req.body['update_loc_id']},(err, l)=>{
              if(err)
                {res.send(err);}
              else{
                l.name = req.body['updatedname'];
                l.lat = req.body['updatelat'];
                l.lon = req.body['updatelon'];
                l.save();
                res.send("{<br>"+ 
                '"loc_id": '+l.loc_Id+",<br>" + 
                '"name": "' + l.name + '",<br>' +
                '"lat":'+ l.lat +'",<br>' +
                '"loc":'+ l.lon +'"<br>' +
                ',<br>');
              }
            })
          }
        }
      }
    )
})
// End of the update section =======================================================================
// Delete Location (admin only)
app.delete("/location/:loc_id/delete",(req,res)=>{
  User.findOne(
    {user_id: req.params['user_id']},
    'user_id username user_type')
    .exec(
      (err,e)=>{
        if(err)
          {res.send(err);}
        else {
          if(e.user_type != "admin"){
            res.set('Content-Type','text/plain');
            res.status(404).send("Only admin can delete the location.");
          }
          else{
            Location.findOne({loc_id:req.body['loc_id']},(err,loc)=>{
              if(err)
               {res.send(err);}
              else{
                if(loc == null){
                  res.set('Content-Type','text/plain');
                  res.status(404).send("Could not FIND the location id delete.");
                }
                else{
                  Location.remove({loc_id: req.params['loc_id']},(err,loc1)=>{
                    if (err)
                    {res.send(err);}
                    else{
                      res.status(204).send(loc1)
                    }
                  })
                }
              }
            })
          }
        }
      }
    )
})
//===========================End Delete location part=====================================

// Get all locations
app.get('/locations', (req, res) => {
  Location.find({})
  .exec(function (err, loc) {
    if (err)
      res.send(err)
    else 
      res.send(loc)  
    // console.log(loc)
    // let locationList = ""
    // if (err)
    //     res.send(err);
    // else
    //     for (let i = 0; i < loc.length; i++) {
    //         locationList += "{<br>\n" +
    //                         "\"loc_id\": " + loc[i].loc_id + ",<br>\n" +
    //                         "\"name\": \"" + loc[i].name + "\",<br>\n" +
    //                         "\"lat\": " + loc[i].lat + "<br>\n" +
    //                         "\"lon\": " + loc[i].lon + "<br>\n" +
    //                         "}"
    //         if (i < loc.length - 1) {
    //             locationList += ",<br>\n"
    //         }
    //     }
    //     if (locationList.length > 0) {
    //         res.send(
    //             "[<br>\n" +
    //             locationList +
    //             "<br>\n]"
    //         );
    //     } else {
    //         res.send(
    //             "[ ]"
    //         );
    //     }
  });
});
//===========================End Get all locations part=====================================

// Get one location by name eg'/location/name?name=Tokyo'
app.get('/location/name?', (req, res) => {
  Location.findOne(
    { name: req.query["name"] }, (err, loc) => {
        if (err)
            res.send(err);
        if (!loc) {
            res.status(404)
            res.send("Can't find this location")
        }
        else
            res.send(loc)
            // res.send(
            //   "{<br>\n" +
            //   "\"loc_id\": " + loc.loc_id + ",<br>\n" +
            //   "\"name\": \"" + loc.name + "\",<br>\n" +
            //   "\"lat\": " + loc.lat + "<br>\n" +
            //   "\"lon\": " + loc.lon + "<br>\n" +
            //   "}"
            // );
    }
  )
});

// Get one location by loc_id  eg'/location/id?id=1'
app.get('/location/id?', (req, res) => {
  // console.log(req.query["id"])
  Location.findOne(
    { loc_id: req.query["id"] }, (err, loc) => {
      if (err)
        res.send(err);
      if (!loc) {
        res.status(404)
        res.send("Can't find this location")
      }
      else  
        res.send(loc)
    }
  )
});
//===========================End Get one location part=====================================

app.listen(8000)

