var User = require('../proxy').User;
var Topic = require('../proxy').Topic;
var Reply = require('../proxy').Reply;
var TopicCollect = require('../proxy').TopicCollect;
var utility = require('utility');
var util = require('util');
var TopicModel = require('../models').Topic;
var ReplyModel = require('../models').Reply;
var tools = require('../common/tools');
var config = require('../config');
var EventProxy = require('eventproxy');
var validator = require('validator');
var utility = require('utility');
var _ = require('lodash');

exports.index = function (req, res, next) {
    var user_name = req.params.name;

    User.getUserByLoginName(user_name, function (err, user) {
        if (err) {
            return next(err);
        }
        if (!user) {
            res.render404('这个用户不存在。');
            return;
        }
        if (!user.is_webmaster && !user.is_admin){
            res.render404('页面不存在');
            return;
        }

        var render = function () {
            if (user.is_webmaster){
                identity = 'webmaster';
            }else if(user.is_admin){
                identity = 'admin';
            }
            res.render('manage/index', {
                current_user: user,
                user_identity: identity,
                pageTitle: '管理页面'
            });
        };

    });
};

