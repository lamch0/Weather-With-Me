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
const Location = require("./models/location_model");
const User = require('./models/user_model')
const Comment = require('./models/comment_model')

const bodyParser = require('body-parser');
const res = require('express/lib/response');
app.use(bodyParser.urlencoded({extended: true}));
const initializePassport = require('./utils/passport-config')
initializePassport(
  passport,
//   email => users.find(user => user.email === email),
  username => users.find(user => user.username === username),
  id => users.find(user => user.id === id)
)

const users = []

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
  res.render('profile.ejs', { username: req.user.username })
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
    users.push({
      id: Date.now().toString(),
      username: req.body.username,
    //   email: req.body.email,
      password: hashedPassword
    })
    res.redirect('/login')
  } catch {
    res.redirect('/register')
  }
})

app.delete('/logout', (req, res) => {
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

app.listen(3000)
