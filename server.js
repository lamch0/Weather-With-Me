// 1155143373 Lam Lok Hin 
// 1155143281 Choi Chung Yu 
// 1155142376 Cheung King Wa 
// 1155110159 Cheung Hing Wing 
// 1155142672 Kwok Chun Yin
// 1155143825 Lam Cheuk Hin

if(process.env.NODE_ENV !== 'production'){
	require('dotenv').config()
  }
const express = require('express')

const app = express()
app.use(express.static('./views'))
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
const cors = require('cors');
app.use(cors({origin:"http://localhost:3000", credentials:true}));

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

app.get('api/user/:username', async (req, res) => {
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


// // when logged in, check user type
// app.get('/', checkAuthenticated, (req, res) => {
//   // if (req.session.passport.user){
//   //   console.log('logged in to ' + req.session.passport.user)
//   // }
//   // if (user == 'admin'){
//   //   res.send("admin")//.render('profile.ejs', { username: "Admin account" })
//   // }
//   // else {
//   //   res.send("user")//.render('profile.ejs', { username: req.session.passport.user })
//   // }
//   res.render('profile.ejs', { username: req.session.passport.user })
// })

// app.get('/login', checkNotAuthenticated, (req, res) => {
//   res.render('login.ejs')
// })

// app.post('/login', checkNotAuthenticated, passport.authenticate('local', {
//   successRedirect: '/',
//   failureRedirect: '/login',
//   failureFlash: true
// }))

// app.get('/register', checkNotAuthenticated, (req, res) => {
//   res.render('register.ejs')
// })

app.post('/login', checkNotAuthenticated, function(req, res, next) {passport.authenticate('local', function(err, user, info){
  if(err){
    return next(err);
  }
  if(!user){
    return res.send("false");
  }
  req.logIn(user, function(err){
    if(err){
      return next(err);
    }
    return res.send("true");
  });
}) (req, res, next);
});

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
app.delete('/api/logout', (req, res) => {
  req.session.destroy(() => {
    console.log('session destroyed')
  })
  req.logOut()
  res.send("{'result':true}");
})
// Create Comment (user side)
app.post("/api/comments/:name",(req,res)=> {
  var new_comment_id;
  Comment.find().
  sort({comment_id: -1})
  .exec((err,e)=>{
    if(err)
      {res.send(err)}
    else
      if(req.body['content'] == null || req.body['content'] == ""){
        res.set('Content-Type', 'text/plain');
        res.status(404).send('The content field does not provide. ');
      }
      else{
        if(e.length == 0 ){
          new_comment_id = 1;
        }
        else{
          new_comment_id = e[0].comment_id+1;
        }
        User.findOne({user_id: req.body['user_id']},(err, user) =>{
          if(err)
          {res.send(err)}
          else{
            
            if(user.user_id == null){
              res.set('Content-Type','text/plain');
              res.send("Can not create a new comment because the user_id is invalid.");
            }
            else{
              Comment.create({
                comment_id: new_comment_id,
                user_id: user.user_id,
                content: req.body['content']
              },(err,e)=>{
                if(err)
                  {res.send(err)}
                else{
                  
                  Comment.findOne({comment_id: new_comment_id})
                  .exec((err,fcom)=>{
                    if(err)
                    {res.send(err)}
                    else{
                      Location.findOne({name: req.params['name']}).exec(async(err,loc)=>{
                          if(err)
                            {res.send(err)}
                          else{
                            loc.comments.push(fcom._id);
                            await loc.save();
                            res.status(201).send(fcom);
                          }
                      })
                    }
                  })
                }
              })
            }
          }
        })
      }
  })
})
// ============================== End of Create comment section ========================================
//Delete Comment (user side)
app.delete("/api/comments/delete/:name/:comment_id/:user_id",(req,res)=>{
  Comment.findOne({comment_id: req.params['comment_id']},(err,e) =>{
    if(err)
    {res.send(err)}
    else{
      console.log(e)
      if(e == null){
        res.set('Content-Type','text/plain');
        res.status(404).send("Could not delete it because the comment ID is not exist.");
      }
      else{
        if(e.user_id != req.params['user_id']){
          res.set('Content-Type','text/plain');
          res.status(404).send("Could not delete it because you are not the owner of the comment.");
        }
        else{
        Location.findOne({name: req.params['name']}).exec(async(err,loc)=>{
          if(err)
            {res.send(err)}
          else{
            const index = loc.comments.indexOf(e._id)
            if (index > -1){
              loc.comments.splice(index, 1)
            }
            await loc.save()
            Comment.deleteOne({comment_id: req.params['comment_id']},(err,e)=>{
              if(err)
              {res.send(err)}
              else{
                res.send('{"result": true}')
              }
            })
          }
        })
      }
      }
    }
  })
})
// ============================== End of Delete comment section ========================================
// Get location comment list
app.get('/api/location/getcomment/?name', (req, res) => {
    Location.findOne({ name: req.query["name"] })
    .populate("comments")
    .exec(function (err, loc) {
        if (err)
            res.send(err);
        else 
            res.send(loc.comments);
    });
  });
// ============================== End of Get comment section ========================================
//Create Location (admin side)
app.post("/api/location",(req,res)=>{
  var new_location_id;
  Location.find().
  sort({loc_id: -1})
  .exec((err,e)=>{
    if (err)
      {res.send(err)}
    else{
      if(req.body['name'] == null || req.body['name'] == "")
      {
        res.set('Content-Type','text/plain');
        res.status(404).send('The name field does not provide.');
      }
      else{
      if(e.length == 0){
        new_location_id = 1;
      }
      else{
        new_location_id = e[0].loc_id+1;
      }
        Location.create({
          loc_id: new_location_id,
          name: req.body['name'],
          lat: req.body['lat'],
          lon: req.body['lon'],
          comments: []
        },(err,e)=>{
          if(err)
            return handleError(err)
          else{
            Location.findOne({loc_id: new_location_id}).populate('comments').exec((err,loc)=>{
              if(err)
                {res.send(err)}
              else{
                //res.set("Location","http://localhost:8000/location/"+ new_location_id);
                res.send(
                  "{<br>loc_id: " + loc.loc_id +",<br>"+
                  'name: "' + loc.name + '",<br>'+
                  "lat: " + loc.lat + ",<br>"+
                  "lon: " + loc.lon+"<br>"+
                  // "comments: " + loc.comments + 
                  "}<br>"
                )
              }
            })
          }
        })
      }  
    }
  })
})
//==========================End of the Create Location section =======================================================================
//Read Location by loc_id (admin side)
app.get('/api/location/:loc_id',(req,res)=>{
  Location.findOne(
    {loc_id: req.params['loc_id']},
  'loc_id name lat lon comments')
  .populate('comments','comment_id content')
  //.populate('user', 'user_id username')
  .exec(
    (err,e)=>{
      if(err)
        {res.send(err);}
      else{
        if(e == null){
          res.set('Content-Type','text/plain');
          res.status(404).send('The given location ID is not found.');
        }
        else{
          res.send("{<br>"+
          '"loc_id": '+e.loc_id+",<br>" +
          '"name": "' + e.name + '",<br>' +
          '"lat": ' + e.lat + ',<br>'+
          '"lon": ' + e.lon + '<br>'+
          // '"comments":<br>{<br>"comment_id": ' + e.comments.comment_id + 
          // ',<br>' + '"user_id": ' + e.comments.user.user_id + ",<br>" +
          // '"username": ' + e.comments.user.username + ",<br>" +
          // '<br>"content": ' + e.comments.content + "<br>}<br>}<br>"
          "}<br>" 
          )
        }
      }
    }
  )
})
//==========================End of the Read Location section =======================================================================

//Update Location (admin side)
app.put("/api/location/update/:loc_id",(req,res)=>{
  Location.findOne({loc_id: req.params['loc_id']}).populate('comments').exec((err, l)=>{
    if(err)
      {res.send(err);}
    else{
      if(l == null){
          res.set('Content-Type','text/plain');
          res.status(404).send('The given location ID is not found.');
      }
      else{
        if (req.body['updatedname'] == "" || req.body['updatedname'] == null){
          res.set('Content-Type','text/plain');
          res.status(404).send('The name field does not provide.');
        }
        else{
        l.name = req.body['updatedname'];
        l.lat = req.body['updatelat'];
        l.lon = req.body['updatelon'];
        l.save();
          res.send("{<br>"+ 
            '"loc_id": '+l.loc_id+",<br>" + 
            '"name": "' + l.name + '",<br>' +
            '"lat": '+ l.lat +',<br>' +
            '"loc": '+ l.lon +'<br>' +
            '}<br>');
        }
      }
    }
  })     
})
// ==========================End of the Update Location section =======================================================================
// Delete Location (admin side)
app.delete("/api/location/delete/:loc_id",(req,res)=>{

  Location.findOne({loc_id:req.params['loc_id']}).populate('comments').exec((err,loc)=>{
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
              res.send('{"result": true}')
          }
        })
      }
    }
  })
})
//===========================End of the Delete location section=====================================

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

function checkAdmin(req, res, next ) {
  User.findOne({username: req.session.passport.user}, (err, e)=> {
    if (err)
      return err
    else if (e.user_type == "admin")
      next()
  })
}
// End of account management (login logout register) section ===========================================

// // add new location to the database (for initial hardcoding)
// app.post('/addlocation', (req, res) => {
// 	var newLocation = req.query
// 	console.log(newLocation)
// 	Location.find(
// 		(err, locations) => {
// 			var maxId = Math.max(...locations.map(e => e.loc_id), 0)+1
// 			// console.log(maxId)
// 			Location.create({
// 				loc_id: maxId,
// 				name: newLocation.name,
// 				lat: newLocation.lat,
// 				lon: newLocation.lon,
// 				comments: []
// 			}, (err, location) => {
// 				if (err)
// 					return handleError(err);
// 				else 
// 					console.log(location)
// 					res.send(location)
				
// 			})
// 		}
// 	)
// })

// Get all locations in JSON
app.get('/api/locations', (req, res) => {
  Location.find({})
  .exec(function (err, loc) {
    if (err)
      res.send(err)
    else 
      res.send(loc)  
  });
});
//===========================End Get all locations part=====================================

//===========================Start user part=====================================

// Create user (admin side)
app.post("/api/user", async(req,res) => {
    const hashedPassword = await bcrypt.hash(req.body.password, 10)
    const newUser = new User({
      user_id: Date.now().toString(),
      username: req.body.username,
      password: hashedPassword,
      fav_loc: []
    })
    await newUser.save()
    res.send(newUser)
})

// Read user (admin side)
app.get("/api/user/:user_id", (req, res) => {
  User.findOne(
    {user_id: req.params['user_id']},
    'username password'
  ).exec(
    (err, e)=>{
      if (err)
        res.send(err)
      else {
        if (e == null) {
          res.set('Content-Type', 'text/plain')
          res.status(404).send('The given user ID is not found.')
        } else {
          res.json(e)
        }
      }
    }
  )
})

// Update user (admin side)
app.put("/api/user/update/:user_id", async(req, res) => {
  const hashedPassword = await bcrypt.hash(req.body['updatedpassword'], 10)
  User.findOne({user_id: req.params['user_id']})
  .exec(
    (err, e) => {
      if (err)
        res.send(err)
      else {
        if (e == null ) {
          res.set('Content-Type', 'text/plain')
          res.status(404).send('The given user ID is not found')
        } else {
          if (req.body['updatedname'] == "" || req.body['updatedname'] == null){
            res.set('Content-Type','text/plain');
            res.status(404).send('The username field does not provide.');
          } else if (req.body['updatedpassword'] == "" || req.body['updatedpassword'] == null){
            res.set('Content-Type','text/plain');
            res.status(404).send('The password field does not provide.');
          }
          else {
            e.username = req.body['updatedname']
            e.password = hashedPassword
            e.save()
            res.json(e)
          }
        }
      }
    }
  )
})

// Delete user (admin side)
app.delete("/api/user/delete/:user_id", (req, res) => {
  User.findOne({user_id: req.params['user_id']})
  .exec((err, e)=> {
    if (err)
      res,send(err)
    else {
      if (e == null) {
        res.set('Content-Type','text/plain');
        res.status(404).send("Could not FIND the user id delete.");
      } else {
        User.remove({user_id: req.params['user_id']}, (err, del)=> {
          if (err)
            res.send(err)
          else 
            res.send('{"result": true}')
        })
      }
    }
  })
})
//===========================End user part=====================================




// Get one location by name in JSON eg'/location/name?name=Tokyo'
app.get('/api/location/get/name?', (req, res) => {
  console.log("getting location by name")
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
    }
  )
});

// Get one location by loc_id in JSON eg'/location/id?id=1'
app.get('/api/location/get/id?', (req, res) => {
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

// Add location to fav_loc list of user, eg '/api/favourite/ryan/10'
app.put('/api/favourite/:username/:loc_id', (req, res) => {
  // User.find({ username: req.session.passport.user }, (err, user) => {
  // console.log(req.params)
  User.findOne({ username: req.params.username }, (err, user) => {
    if (err)
      res.send(err)
    else if (!user)
      res.send('No such user')
    else {
      console.log(user)
      Location.findOne({loc_id: req.params.loc_id}, async (err, loc) => {
        if (err)
          res.send(err)
        else {
          if (!user.fav_loc.includes(loc._id)){
            user.fav_loc.push(loc._id)
            await user.save()
          }
          console.log(user)
          res.send(user)
        }
      })
    }
  })
})

// Get list of fav_loc of one user  eg '/api/favourite/ryan'
app.get('/api/favourite/:username', (req, res)=> {
  // User.findOne({username: req.session.passport.user}, (err, e)=> {
  //   if (err)
  //     res.send(err)
  //   else {
  //    res.send(e.fav_loc)
  //   }
  // })
  User.findOne({username: req.params.username})
  .populate("fav_loc")
  .exec(function (err, user) {
    if (err)
      res.send(err)
    else
      res.send(user.fav_loc)
  })
})

// Delete loc from fav_loc  eg '/api/favourite/delete/ryan/1'
app.put('/api/favourite/delete/:username/:loc_id', (req, res) => {
  User.findOne({ username: req.params.username }, async (err, user) => {
    if (err)
      res.send('Error: cannot find user')
    else if (!user)
      res.send('No such user')
    else {
      // console.log(user)
      Location.findOne({ loc_id: req.params.loc_id }, async (err, loc) => {
        if (err)
          res.send(err)
        else {
          const index = user.fav_loc.indexOf(loc._id)
          if (index > -1){
            user.fav_loc.splice(index, 1)
          }
          // console.log(user)
          await user.save()
          res.send(user)
        }
      })
    }
  })
})

// get user object if logged in
app.get('/api/userloggedin', (req, res) => {
  if (req.session.passport){
    console.log("user is auth.")
    User.findOne({username: req.session.passport.user}, (err, user) => {
    if (err)
      res.send(err)
    else {
      res.send(user)
    }
    })
  }
  else res.send(undefined)
  
})
// app.get('/userloggedin/:usename',  (req, res) => {
//   console.log(req.params.username)
//   User.findOne({usename: req.params.username},  (err, user) => {
//     if (err)
//       res.send(err)
//     else {
//       // console.log(user)
//       res.send(user)
//     }
//   })
// })

app.listen(8000)