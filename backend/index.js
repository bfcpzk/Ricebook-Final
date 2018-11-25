const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const auth = require('./src/auth');
const profile = require('./src/profile');
const following = require('./src/following');
const articles = require('./src/articles');
const session = require('express-session');
const FacebookStrategy = require('passport-facebook');
const passport = require('passport');

//db connect
let dburl = 'mongodb://zhaokangpan:bfcpzk940121@ds161183.mlab.com:61183/heroku_vlmlrwcn';
    //'mongodb://localhost:27017/ricebook_final';
if (process.env.MONGOLAB_URI) {
    dburl = process.env.MONGOLAB_URI;
}
const connect = mongoose.connect(dburl);
connect.then((db) => {
    console.log("Connected correctly to server");
}, (err) => { console.log(err); });

//init app
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(session({secret: 'thisIsMySecretMessageHowWillYouGuessIt'}));
app.use(cookieParser());

//cors
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", req.headers.origin || "http://localhost:4200");
    res.header('Access-Control-Allow-Credentials',true);
    res.header('Access-Control-Allow-Methods','GET, PUT, POST, DELETE');
    res.header('Access-Control-Allow-Headers','Authorization, Content-Type, Origin, X-Request-With, X-Session-Id');
    res.header('Access-Control-Expose-Headers', 'Location, X-Session-Id');
    next();
});

const uploadImage = require('./src/uploadCloudinary');

//end points
app.post('/register', auth.register);
app.post('/login', auth.login);
app.put('/logout', auth.isLoggedIn, auth.logout);

app.get('/user', auth.isLoggedIn, auth.getUser);
app.get('/profile/:user?', auth.isLoggedIn, profile.getProfile);
app.get('/profiles/:users?', auth.isLoggedIn, profile.getProfiles);

app.get('/headlines/:users?', auth.isLoggedIn, profile.getHeadlines);
app.put('/headline', auth.isLoggedIn, profile.updateHeadline);

app.get('/email/:user?', auth.isLoggedIn, profile.getEmail);
app.put('/email', auth.isLoggedIn, profile.updateEmail);
app.get('/zipcode/:user?', auth.isLoggedIn, profile.getZipcode);
app.put('/zipcode', auth.isLoggedIn, profile.updateZipcode);
app.get('/phone/:user?', auth.isLoggedIn, profile.getPhone);
app.put('/phone', auth.isLoggedIn, profile.updatePhone);
app.get('/display_name/:user?', auth.isLoggedIn, profile.getDisplay_name);
app.put('/display_name', auth.isLoggedIn, profile.updateDisplay_name);
app.get('/dob/:user?', auth.isLoggedIn, profile.getDob);

app.get('/avatars/:user?', auth.isLoggedIn, profile.getAvatars);
app.put('/avatar', auth.isLoggedIn, profile.updateAvatar);

app.get('/following/:user?', auth.isLoggedIn, following.getFollowings);
app.put('/following/:user', auth.isLoggedIn, following.addFollowing);
app.delete('/following/:user', auth.isLoggedIn, following.removeFollowing);

app.put('/uploadArticle', auth.isLoggedIn, uploadImage('article'), uploadRes);
app.post('/article', auth.isLoggedIn, articles.addArticle);
app.get('/articles/:id?', auth.isLoggedIn, articles.getArticles);
app.put('/articles/:id', auth.isLoggedIn, articles.updateArticle);

app.put('/password', auth.isLoggedIn, auth.updatePassword);

app.put('/uploadAvatar', auth.isLoggedIn, uploadImage('avatar'), uploadRes);


app.use(passport.initialize());
app.use(passport.session());

const users = {};
const facebookConfig = {
    clientID: '297042154354487',
    clientSecret: '686c9c49133a549be23403126cdc0f0c',
    callbackURL: 'https://finalricebook.herokuapp.com/facebook/callback',
    profileFields: ['emails']
};

passport.serializeUser(function (user, done) {
    users[user.id] = user;
    done(null, user.id)
});

passport.deserializeUser(function (id, done) {
    var user = users[id];
    done(null, user)
});

passport.use(new FacebookStrategy(facebookConfig,
    (token, refreshToken, profile, done) => {
        process.nextTick(() => {
            return done(null, profile);
        })
    }
));

app.use('/facebook', passport.authenticate('facebook', {scope: ['email']}));
app.use('/facebook/callback', passport.authenticate('facebook', {successRedirect: '/fbLogin', failureRedirect: '/fail'}));
app.use('/fbLogin', auth.fbLogin);
app.use('/fail', auth.fail);
app.put('/linkAccount', auth.isLoggedIn, auth.linkAccount);
app.get('/unlinkAccount', auth.isLoggedIn, auth.unlinkAccount);

/*require('./src/auth')(app);
require('./src/profile')(app);
require('./src/articles')(app);
require('./src/following')(app);*/


function uploadRes(req, res){
    if(req.fileurl){
        res.statusCode = 200;
        res.json({img: req.fileurl});
    }else{
        res.json({img: ''});
    }
}

// Get the port from the environment, i.e., Heroku sets it
const port = process.env.PORT || 3000
const server = app.listen(port, () => {
    const addr = server.address();
    console.log(`Server listening at http://${addr.address}:${addr.port}`)
});