const User = require('./model/user');
const Profile = require('./model/profile');
const Article = require('./model/article');
const md5 = require('md5');
const redis = require('redis').createClient(process.env.REDIS_URL);

function genSalt(){
    let salt = '';
    let len = 20 + Math.ceil(Math.random() * 10);
    let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for(let i = 0 ; i < len ; i++){
        var character = possible.charAt(Math.floor(Math.random() * possible.length));
        salt += character;
    }
    return salt;
}

function register(req, res, next) {
    User.findOne({username: req.body.netId})
        .then((user) => {
            if(user != null){
                res.json({result: 'the user already exist', username: user.username});
            }else{
                var salt = genSalt();
                var hash = md5(salt + req.body.password);
                Profile.create({
                    username: req.body.netId,
                    display_name: req.body.display_name,
                    email: req.body.email,
                    phone: req.body.phone,
                    dob: req.body.dob,
                    zipcode: req.body.zipcode,
                    headline: 'Rice Student',
                    avatar: 'http://www.imeitou.com/uploads/allimg/2018041608/0h12idivcc4.jpg',
                    following: []
                }).then(() => {
                    User.create({
                        username: req.body.netId,
                        salt: salt,
                        hash: hash,
                        auth: []
                    }).then((user) => {
                        res.statusCode = 200;
                        res.json({result: 'success', username: user.username});
                    }, (err) => next(err));
                });
            }
        }).catch((err) => {
            next(err);
        });
}

const sessionUser = {};
const cookieKey = 'sid';

function login(req, res, next) {
    var username = req.body.username;
    var password = req.body.password;
    User.findOne({username: username})
        .then((user) => {
            if (user === null) {
                res.json({username: username, result: 'the user does not exist'});
            } else {
                var hash = md5(user.salt + password);
                if (user.hash !== hash) {
                    res.json({username: username, result: 'the password is incorrect'});
                } else {//authenticated
                    const sessionKey = md5(hash + new Date().getTime() + user.username);
                    //redis
                    //redis.hmset('sessions', sessionKey, JSON.stringify(user));
                    //inmem
                    sessionUser[sessionKey] = user;
                    res.statusCode = 200;
                    res.cookie(cookieKey, sessionKey, {maxAge: 3600*1000, httpOnly: true});
                    res.json({ username: username, result: "success"});
                    //res.json({ username: username, result: "success", sid: sessionKey});
                }
            }
        });
}

function logout(req, res, next){
    delete sessionUser[req.cookies[cookieKey]];
    res.clearCookie(cookieKey);
    res.json({result: 'OK'});
}

function updatePassword(req, res, next){
    const newPass = req.body.password;
    User.findOne({username: req.body.userObj.username})
        .then((user) => {
            const salt = user.salt;
            const newHash = md5(salt + newPass);
            User.findOneAndUpdate({username: req.body.userObj.username},
                {$set : {hash: newHash}}, {new: true})
                .then((user) => {
                    res.statusCode = 200;
                    res.json({username: user.username, result: 'success'});
                }, (err) => next(err));
        }, (err) => next(err));
}

function isLoggedIn(req, res, next){
    const sid = req.cookies.sid;
    if(sid){
        /*redis.hgetall('sessions', (err, userObj) => {
            if(!userObj[sid]){
                next(err);
            }else{//server has the user
                req.body.userObj = JSON.parse(userObj[sid]);
                next();
            }
        })*/
        //in-mem
        userObj = sessionUser[sid];
        if(!userObj){
            next(err);
        }else{//server has the user
            req.body.userObj = userObj;
            next();
        }
    } else{
        var err = new Error('authentication is failed');
        res.statusCode = 401;
        next(err);
    }
}

function getUser(req, res, next){
    Profile.findOne({username: req.body.userObj.username})
        .then((profile) => {
            res.statusCode = 200;
            res.json(profile);
        },(err) => next(err));
}

//facebook login part
function fbLogin(req, res) {
    if(!req.isAuthenticated()){
        res.sendStatus(401);
        return;
    }
    //get user information provided by facebook
    const fbProfile = req.user;

    const fbId = fbProfile.id;
    //create facebook account on ricebook by appending some unique infomation
    const fbUsername = fbId + '@fb';
    const fbUserEmail = fbProfile.emails ? fbProfile.emails[0].value : "empty";

    User.find({authId: fbId}).then((userObjs) => {
        const userObj = userObjs.length > 0 ? userObjs[0] : null;
        if(!userObj){
            new User({username: fbUsername, salt: 'facebook', hash:'facebook', authId: 'facebook', auth: {}}).save((result) => {
                new Profile({
                    username: fbUsername,
                    display_name: "fbUser",
                    avatar: 'http://www.imeitou.com/uploads/allimg/2018041608/0h12idivcc4.jpg',
                    following: [],
                    headline: 'Rice Student',
                    email: fbUserEmail,
                    phone: '393-393-3332',
                    dob: '1999-01-11',
                    zipcode: '12345'
                }).save((result) => {
                    fbRelogin(fbId, fbUsername, res);
                });
            })
        }else{
            fbRelogin(fbId, userObj.username, res);
        }
    })
}

function fbRelogin(fbId, fbUsername, res){
    if(!fbUsername || !fbId){
        res.status(400);
    }

    User.find({username: fbUsername, authId: 'facebook'}).then((userObjs) => {
        const userObj = userObjs.length > 0 ? userObjs[0] : null;
        if(!userObj){
            res.status(401);//unauthorized
        }
        //success login
        const sessionKey = md5(new Date().getTime() + fbId);
        sessionUser[sessionKey] = userObj;
        res.statusCode = 200;

        //set Cookie
        res.cookie(cookieKey, sessionKey, {maxAge: 3600*1000, httpOnly: true});
        res.redirect('https://ricebook-final-zhaokangpan.surge.sh/#/main');
    });
}

function fail(req, res){
    res.redirect('https://ricebook-final-zhaokangpan.surge.sh');
}

function linkAccount(req, res) {
    //link happens when the user is logged in with third party and relogin with normal account
    const fbUsername = req.body.userObj.username;
    const username = req.body.username;
    const password = req.body.password;
    User.findOne({username: username}).then((user) => {
        if(user){
            if(user['hash'] == md5(user['salt'] + password)){
                if(!user.auth || !user.auth.facebook){//not merged
                    const fbId = fbUsername.split('@')[0];
                    User.findOne({username: fbUsername, authId: 'facebook'}).then((fbuser) => {
                        if(fbuser){//already login with fb before, can merge
                            updateInfo(username, fbId, res);
                        }else{//not have a fb login before, no need to merge
                            res.json({result: 'no facebook login before'});
                        }
                    })
                }else{
                    res.json({result: 'already merged!'});
                }
            }else{
                res.json({result: 'Password is not correct'});
            }
        }else{
            res.json({result: 'No such normal user'});
        }
    })
}

function updateInfo(username, fbId, res){
    const fbUsername = fbId + '@fb';
    Article.update({ author: fbUsername},
        { $set: { 'author': username } },
        { new: true, multi: true }).then(() => {});
    Article.update({ 'comments.author': fbUsername },
        { $set: { 'comments.$.author': username } },
        { new: true, multi: true }).then(() => {});
    Profile.findOne({username: fbUsername}).then((fbProfile) => {
        if(fbProfile){
            const fbFollowings = fbProfile['following'];
            Profile.findOne({username: username}).then((normalProfile) => {
                if(normalProfile){
                    const normalFollowings = normalProfile['following'];
                    let mergeFollowings = mergeArray(normalFollowings, fbFollowings, username);
                    Profile.findOneAndUpdate({username: username},
                        {$set: {following: mergeFollowings}}, {new: true}).then((updateNormalProfile) => {
                        User.findOneAndUpdate({username: username}, {$addToSet: {auth: {'facebook': username}}}, {new: true})
                            .then((normalUser) => {
                                User.deleteOne({username: fbUsername}).then(() => {
                                    Profile.deleteOne({username: fbUsername}).then(() => {
                                        res.json({result: 'success'});
                                    });
                                });
                            });
                    })
                }else{
                    res.status(400).send({result: "normal user profile does not exist!"});
                }
            })
        }else{
            res.status(400).send({result: "fb user profile does not exist!"});
        }
    });
}

function mergeArray(arr1, arr2, username) {
    let arr = [];
    for (let i = 0; i < arr1.length; i++) {
        arr.push(arr1[i]);
    }
    for (let i = 0; i < arr2.length; i++) {
        let flag = true;
        for (let j = 0; j < arr1.length; j++) {
            if (arr2[i] == arr1[j] || arr2[i] == username) {
                flag = false;
                break;
            }
        }
        if (flag) {
            arr.push(arr2[i]);
        }
    }
    return arr;
}

function unlinkAccount(req, res) {
    const normalUsername = req.body.userObj.username;
    User.findOne({username: normalUsername}).then((normalUser) => {
        if(normalUser){
            if(normalUser.auth && normalUser['auth'].length > 0){
                User.findOneAndUpdate({username: normalUsername}, {$set : {auth : []}}, {new : true})
                    .then((user) => {
                        res.statusCode = 200;
                        res.json({result: 'Unlink success'});
                    });
            }else{
                res.json({result: "No linkage"});
            }
        }else{
            res.json({result: 'No such user!'});
        }
    });
}

exports.register = register;
exports.login = login;
exports.logout = logout;
exports.updatePassword = updatePassword;
exports.isLoggedIn = isLoggedIn;
exports.getUser = getUser;
exports.fbLogin = fbLogin;
exports.fail = fail;
exports.linkAccount = linkAccount;
exports.unlinkAccount = unlinkAccount;
/*
module.exports = app => {
    app.use(bodyParser.json());
    app.use(cookieParser());
    app.post('/register', register);
    app.post('/login', login);
    app.use(isLoggedIn);
    app.put('/logout', logout);
    app.get('/user', getUser);
    app.put('/password', updatePassword);
};*/
