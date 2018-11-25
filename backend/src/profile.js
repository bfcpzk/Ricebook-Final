var Profile = require('./model/profile');

function getHeadlines(req, res, next){
    let headlines = [];
    let users = req.params.users;
    if(users){
        users = users.split(",");
        Profile.find({username: {$in: users}})
            .then((profiles) => {
                for(let i = 0 ; i < profiles.length ; i++){
                    headlines.push({username: profiles[i].username, headline: profiles[i].headline});
                }
                res.json({headlines: headlines});
                next();
            }, (err) => next(err));
    }else{
        res.json({headlines: headlines});
        next();
    }
}

function updateHeadline(req, res, next){
    Profile.findOneAndUpdate({username: req.body.userObj.username}, {
        $set: {headline: req.body.headline}
    }, {new: true})//return the updated object
        .then((profile) => {
            res.statusCode = 200;
            //res.setHeader('Content-Type', 'application/json');
            res.send({username: profile.username, headline: profile.headline});
            next();
        }, (err) => next(err))
        .catch((err) => next(err));
}

function getEmail(req, res, next){
    const username = req.params.user;
    if(username){
        Profile.findOne({username: username})
            .then((profile) => {
                if(profile){
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json({username: profile.username, email: profile.email});
                    next();
                }else{
                    var err = new Error('user does not exist');
                    err.status = 403;
                    next(err);
                }
            }, (err) => next(err)).catch((err) => next(err));
    }else{
        res.setHeader('Content-Type', 'application/json');
        res.json({username: '', email: ''});
        next();
    }
}

function updateEmail(req, res, next){
    Profile.findOneAndUpdate({username: req.body.userObj.username}, {
        $set: {email: req.body.email}
    }, {new: true})
        .then((profile) => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json({username: profile.username, email: profile.email});
            next();
        }, (err) => next(err))
        .catch((err) => next(err));
}

function getZipcode(req, res, next){
    const username = req.params.user;
    if(username){
        Profile.findOne({username: username})
            .then((profile) => {
                if(profile){
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json({username: profile.username, zipcode: profile.zipcode});
                    next();
                }else{
                    res.setHeader('Content-Type', 'application/json');
                    res.json({username: '', zipcode: ''});
                    next();
                }
            }, (err) => next(err)).catch((err) => next(err));
    }else{
        res.setHeader('Content-Type', 'application/json');
        res.json({username: '', zipcode: ''});
        next();
    }
}

function updateZipcode(req, res, next){
    Profile.findOneAndUpdate({username: req.body.userObj.username}, {
        $set: {zipcode: req.body.zipcode}
    }, {new: true})
        .then((profile) => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json({username: profile.username, zipcode: profile.zipcode});
            next();
        }, (err) => next(err))
        .catch((err) => next(err));
}

function getDob(req, res, next){
    const username = req.params.user;
    if(username){
        Profile.findOne({username: username})
            .then((profile) => {
                if(profile){
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json({username: profile.username, dob: profile.dob});
                    next();
                }else{
                    res.setHeader('Content-Type', 'application/json');
                    res.json({username: '', dob: ''});
                    next();
                }
            }, (err) => next(err)).catch((err) => next(err));
    }else{
        res.setHeader('Content-Type', 'application/json');
        res.json({username: '', dob: ''});
        next();
    }
}

function getAvatars(req, res, next){
    let avatars = [];
    let users = req.params.user;
    if(users){
        users = users.split(",");
        Profile.find({username: {$in: users}})
            .then((profiles) => {
                for(let i = 0 ; i < profiles.length ; i++){
                    avatars.push({username: profiles[i].username, avatar: profiles[i].avatar});
                }
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json({avatars : avatars});
                next();
            }, (err) => next(err));
    }else{
        res.setHeader('Content-Type', 'application/json');
        res.json({avatars : avatars});
    }
}

function updateAvatar(req, res, next){
    Profile.findOneAndUpdate({username: req.body.userObj.username}, {
        $set: {avatar: req.body.avatar}
    }, {new: true})
        .then((profile) => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json({username: profile.username, avatar: profile.avatar});
            next();
        }, (err) => next(err))
        .catch((err) => next(err));
}

function updatePhone(req, res, next){
    Profile.findOneAndUpdate({username: req.body.userObj.username}, {
        $set: {phone: req.body.phone}
    }, {new: true})
        .then((profile) => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json({username: profile.username, phone: profile.phone});
            next();
        }, (err) => next(err))
        .catch((err) => next(err));
}

function getPhone(req, res, next){
    const username = req.params.user;
    if(username){
        Profile.findOne({username: username})
            .then((profile) => {
                if(profile){
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json({username: profile.username, phone: profile.phone});
                    next();
                }else{
                    res.setHeader('Content-Type', 'application/json');
                    res.json({username: '', phone: ''});
                    next();
                }
            }, (err) => next(err)).catch((err) => next(err));
    }else{
        res.setHeader('Content-Type', 'application/json');
        res.json({username: '', phone: ''});
        next();
    }
}

function updateDisplay_name(req, res, next){
    Profile.findOneAndUpdate({username: req.body.userObj.username}, {
        $set: {display_name: req.body.display_name}
    }, {new: true})
        .then((profile) => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json({username: profile.username, display_name: profile.display_name});
            next();
        }, (err) => next(err))
        .catch((err) => next(err));
}

function getDisplay_name(req, res, next){
    const username = req.params.user;
    if(username){
        Profile.findOne({username: username})
            .then((profile) => {
                if(profile){
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json({username: profile.username, display_name: profile.display_name});
                    next();
                }else{
                    res.setHeader('Content-Type', 'application/json');
                    res.json({username: '', display_name: ''});
                    next();
                }
            }, (err) => next(err)).catch((err) => next(err));
    }else{
        res.setHeader('Content-Type', 'application/json');
        res.json({username: '', display_name: ''});
        next();
    }
}

function getProfile(req, res, next){
    const username = req.params.user ? req.params.user : req.body.userObj.username;
    if(username){
        Profile.findOne({username: username})
            .then((profile) => {
                if(profile){
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(profile);
                    next();
                }else{
                    res.setHeader('Content-Type', 'application/json');
                    res.json(null);
                    next();
                }
            }, (err) => next(err)).catch((err) => next(err));
    }else{
        res.setHeader('Content-Type', 'application/json');
        res.json(null);
        next();
    }
}

function getProfiles(req, res, next){
    const users = req.params.users ? req.params.users.split(',') : '';
    Profile.find({username: {$in: users}})
        .then((profiles) => {
            if(profiles){
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json({users: profiles});
                next();
            }else{
                res.setHeader('Content-Type', 'application/json');
                res.json({users: profiles});
                next();
            }
        }, (err) => next(err)).catch((err) => next(err));
}

/*
module.exports = app => {


    app.get('/headlines/:users?', getHeadlines);
    app.put('/headline', updateHeadline);

    app.get('/email/:user?', getEmail);
    app.put('/email', updateEmail);

    app.get('/zipcode/:user?', getZipcode);
    app.put('/zipcode', updateZipcode);

    app.get('/phone/:user?', getPhone);
    app.put('/phone', updatePhone);

    app.get('/display_name/:user?', getDisplay_name);
    app.put('/display_name', updateDisplay_name);

    app.get('/dob/:user?', getDob);

    app.get('/avatars/:user?', getAvatars);
    app.put('/avatar', updateAvatar);


    app.get('/profile/:user?', getProfile);
};*/

exports.getHeadlines = getHeadlines;
exports.updateHeadline = updateHeadline;
exports.getEmail = getEmail;
exports.updateEmail = updateEmail;
exports.getZipcode = getZipcode;
exports.updateZipcode = updateZipcode;
exports.getPhone = getPhone;
exports.updatePhone = updatePhone;
exports.getDisplay_name = getDisplay_name;
exports.updateDisplay_name = updateDisplay_name;
exports.getDob = getDob;
exports.getAvatars = getAvatars;
exports.updateAvatar = updateAvatar;
exports.getProfile = getProfile;
exports.getProfiles = getProfiles;