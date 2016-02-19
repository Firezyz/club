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

exports.showAdmin = function(req, res, next) {
    var proxy = new EventProxy();
    proxy.fail(next);

    var user_limit = config.admin_list_user_count;
    User.getUsersByQuery({}, {limit:user_limit}, proxy.done('users', function(users){ return users; })); 

    var topic_limit = config.admin_list_topic_count;
    Topic.getTopicsByQuery({} ,{limit:topic_limit}, proxy.done('topics', function(topics){ return topics; }));

    proxy.all('topics', 'users', function(topics, users) {
        res.render('admin/index',{
            topics: topics,
            users: users,
            user_current_page: 1,
            user_pages:1
        });
    });
    proxy.fail(next);
}
