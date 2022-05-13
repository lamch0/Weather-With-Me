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
const cors = require('cors');
app.use(cors());

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
// Create Comment (user side)
app.post("/comments/:name",(req,res)=> {
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
                            loc.comments.push(fcom._id)
                            await loc.save()
                            res.status(201).send("{<br>"+
                            '"comment_id": ' + fcom.comment_id + ",<br>"+
                            '"user_id": <br>{<br>"user_id": '+ fcom.user_id +',<br>}<br>'
                            +'"content": '+fcom.content + "<br>}<br>")
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
//Create Location (admin side)
app.post("/location",(req,res)=>{
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
//Read Location (admin side)
app.get('/location/:loc_id',(req,res)=>{
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
app.put("/location/update/:loc_id",(req,res)=>{
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
app.delete("/location/delete/:loc_id",(req,res)=>{

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

app.listen(3000)
