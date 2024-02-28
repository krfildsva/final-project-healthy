const express = require("express");
const app = express();
const jwt = require('jsonwebtoken');
require('dotenv').config();

const bcrypt = require("bcrypt")
const session = require("express-session")
const mongoose = require('mongoose');
const Image = require('./models/image');


const cookieParser = require('cookie-parser');

const loginRoute = require('./routes/login.js');
const signupRoute = require('./routes/signup.js');
const protectedRoute = require('./routes/dashboard.js');
const logoutRoute = require('./routes/logout.js');
const uploadRoute = require('./routes/upload.js');
const editRoute = require('./routes/update.js');
const nutritionRoute = require('./routes/nutrition.js');
const recipesRoute = require('./routes/recipes.js');


app.use(express.json())


app.use(express.urlencoded({extended: true}))
app.set('view engine', 'ejs');
app.use(cookieParser());


app.use(express.static('public'));
app.use(session({
  secret: '12345', 
  resave: false,
  saveUninitialized: true,
  cookie: {
      secure: false, 
      maxAge: 1 * 60 * 60 * 1000 
  }
}));


const uri = "mongodb+srv://admin:12345@final.8unombi.mongodb.net/?retryWrites=true&w=majority";

//routes
app.get('/', (req, res) => {
  res.render('index.ejs'); 
});

app.use('/login', loginRoute);

app.use('/signup', signupRoute);

app.use('/logout', logoutRoute);

app.use('/dashboard', protectedRoute);

app.use('/upload', uploadRoute);

app.use('/update', editRoute);

app.use('/nutrition', nutritionRoute);

app.use('/recipes', recipesRoute);

const isAuthenticated = (req, res, next) => {
  if (req.session.userId === "65d79696b6a2d2cdb21bd60b") {
      next();
  } else {
      res.status(500).send('Only admin can access');
      //res.redirect('/login'); 
  }
};

app.get('/delete/:id', isAuthenticated, async (req, res) => {
  try {
    const imageToDelete = await Image.findById(req.params.id);
    if (imageToDelete) {
      
      await Image.findByIdAndDelete(req.params.id);
      res.redirect('/dashboard');
    } else {
      res.status(404).send('Image not found');
    }
  } catch (error) {
    console.error('Error deleting image:', error);
    res.status(500).send('Server error');
  }
});







const clientOptions = { serverApi: { version: '1', strict: true, deprecationErrors: true } };
async function run() {
  try {
    await mongoose.connect(uri, clientOptions);
    const client = mongoose.connection.getClient();

    await client.db().admin().command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
    app.listen(3000, () => console.log('Server connected to port 3000!'))
  } finally {
    //await mongoose.disconnect();
  }
}

run().catch(console.dir);
