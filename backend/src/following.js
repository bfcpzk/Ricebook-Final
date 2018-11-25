const Profile =  require('./model/profile');

function getFollowings(req, res, next) {
    let username = req.params.user ? req.params.user: req.body.userObj.username;
    Profile.findOne({username: username})
        .then((profile) => {
            if(profile){
                res.status(200).send({username: username, following:profile.following});
            }else{
                res.json({result: 'No results!'});
            }

        }, (err) => {next(err)});
}

function addFollowing(req, res){
    const addedUser = req.params.user;
    const curUser = req.body.userObj.username;
    if(!curUser){
        res.status(400).send({result: "current logged-in user missing!"});
    }
    if(!addedUser){
        res.status(400).send({result: "Invalid input username"});
    }
    Profile.findOne({username: addedUser}).then((profile) => {
        if(profile && profile.username != curUser){//the added user in db and not the same as the loggedin user
            Profile.findOneAndUpdate({username: curUser},
                {$addToSet: {following: addedUser}},
                {new: true})
                .then((curUserProfile) => {
                    if(curUserProfile){
                        res.status(200).send({username: curUser, following: curUserProfile.following});
                    }else{
                        res.json({result: "No results!"});
                    }
            }, (err) => {next(err)});
        }else{//the added user not in db or is the same as the logged in user
            if(!profile){
                res.json({result: 'The user does not exist!'})
            }else{
                res.json({result: 'cannot follow yourself!'});
            }
        }
    }, (err) => {next(err)});
}

function removeFollowing(req, res, next){
    const curUser = req.body.userObj.username;
    const delFollowing = req.params.user ? req.params.user : '';
    Profile.findOneAndUpdate({username: curUser}, {$pull: {following: delFollowing}}, {new: true}).then((profile) => {
        if(profile){
            res.status(200).send({username: curUser, following: profile.following})
        }else{
            res.json({result: "no results!"});
        }

    }, (err) => {next(err)});
}

/*
module.exports = app => {
    app.get('/following/:user?', getFollowings);
    app.put('/following/:user', addFollowing);
    app.delete('/following/:user', removeFollowing);
};*/

exports.getFollowings = getFollowings;
exports.addFollowing = addFollowing;
exports.removeFollowing = removeFollowing;