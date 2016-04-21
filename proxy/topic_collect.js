var TopicCollect = require('../models').TopicCollect;
var elasticsearch = require('elasticsearch');
var config = require('../config');

var client = new elasticsearch.Client({
    host: config.es_host + ':' + config.es_port,
    log: config.es_log
});

exports.getTopicCollect = function (userId, topicId, callback) {
    TopicCollect.findOne({user_id: userId, topic_id: topicId}, callback);
};

exports.getTopicCollectsByUserId = function (userId, callback) {
    client.search({
        index: config.es_index,
        type: 'topic_collect',
        q: 'user_id:' + userId
    }, callback);
    //TopicCollect.find({user_id: userId}, callback);
};

exports.newAndSave = function (userId, topicId, callback) {
    var topic_collect = new TopicCollect();
    topic_collect.user_id = userId;
    topic_collect.topic_id = topicId;
    topic_collect.save(callback);
};

exports.remove = function (userId, topicId, callback) {
    TopicCollect.remove({user_id: userId, topic_id: topicId}, callback);
};

