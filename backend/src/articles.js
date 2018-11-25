const Article = require('./model/article');
const Profile = require('./model/profile');
const mongoose = require('mongoose');
//const uploadImage = require('./uploadCloudinary');

function addArticle(req, res, next){
    const image = req.body.image ? req.body.image: '';
    new Article({
        author: req.body.userObj.username,
        content: req.body.text,
        update_time: (new Date()).getTime(),
        pic: image,
        comments: []
    }).save((doc) => {
        if(doc) {
            res.statusCode = 200;
            res.json({articles: [doc]});
        }else{
            res.json({result: 'add Article failed.'});
        }
    });
}

function getArticles(req, res, next){
        const id = req.params.id;
        if(id){
            Profile.findOne({username: id}).then((profile) => {
                if(!profile){//article id
                    getArticleById(req, res, next, id);
                }else{//user id
                    getArticlesByAuthor(req, res, next, id);
                }

            });
        }else{//none : logged in user's feeds
            Profile.findOne({username: req.body.userObj.username}).then((profile) => {
                if(profile){
                    let users = profile.following;
                    users.push(req.body.userObj.username);
                    getArticlesByAuthors(req, res, next, users);
                }else{
                    res.status(404).send({result: "No such user!"});
                }
            })
        }
}

function getArticleById(req, res, next, id){
    const iid = mongoose.Types.ObjectId(id);
    Article.findById(id).then((article) => {
        if(article){
            res.status(200).send({articles: [article]});
        }else{
            res.json({articles: []});
        }
    }, (err) => {next(err)});
}

function getArticlesByAuthor(req, res, next, username){
    Article.find({author: username}).sort({update_time: -1}).limit(10).then((articles) => {
        if(articles){
            res.statusCode = 200;
            res.json({articles: articles});
        }else{
            res.json({articles: []});
        }
    }, (err) => {next(err)});
}

function getArticlesByAuthors(req, res, next, users){
    Article.find({author: {$in : users}}).sort({update_time: -1}).limit(10).then((articles) => {
        if(articles){
            res.statusCode = 200;
            res.json({articles: articles});
        }else{
            res.json({articles: []});
        }
    }, (err) => {next(err)});
}

function updateArticle(req, res, next){
    const postId = req.params.id;
    const text = req.body.text;
    const commentId = req.body.commentId;
    if(!commentId){//update article
        Article.findByIdAndUpdate(postId, {$set : {content: text}}, {new: true})
            .then((article) => {
                if(article){
                    res.status(200).send({articles: [article]});
                }else{
                    res.status(404).send({result: "the logged in user doesn't have this article"});
                }
            }, (err) => next(err));
    }else{//update comment
        if(commentId == -1){//add new comment
            Article.findByIdAndUpdate(postId,
                {$push: {
                        comments: {
                            author: req.body.userObj.username,
                            update_time: (new Date()).getTime(),
                            content: text
                        }
                    }
                }, {new: true}).then((article) => {
                if(article){
                    res.status(200).send({articles: [article]});
                }else{
                    res.status(404).send({result: "create comment error"});
                }
            }, (err) => {next(err)});
        }else{//update comment by comment id
            Article.findOneAndUpdate({_id: mongoose.Types.ObjectId(postId), 'comments._id' : commentId},
                {$set: {'comments.$.content': text, 'comments.$.update_time': (new Date()).getTime()}},
                {new: true})
                .then((article) => {
                    if(article){
                        res.status(200).send({articles: [article]});
                    }else{
                        res.status(404).send({result: "update comment error"});
                    }
            }, (err) => {next(err)});

        }
    }
}

exports.addArticle = addArticle;
exports.getArticles = getArticles;
exports.updateArticle = updateArticle;
/*
module.exports = app => {
    app.post('/article', addArticle)
    app.get('/articles/:id?', getArticles)
    app.put('/articles/:id', updateArticle)
};*/
