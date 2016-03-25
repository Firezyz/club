var models = require('../models');
var User = models.User;
var utility = require('utility');
var uuid = require('node-uuid');

var elasticsearch = require('elasticsearch');
var config = require('../config');

var client = new elasticsearch.Client({
    host: config.es_host + ':' + config.es_port,
    log: config.es_log
});
client.indices.create({index: config.es_index});


/**
 * 根据用户名列表查找用户列表
 * Callback:
 * - err, 数据库异常
 * - users, 用户列表
 * @param {Array} names 用户名列表
 * @param {Function} callback 回调函数
 */
exports.getUsersByNames = function (names, callback) {
    if (names.length === 0) {
        return callback(null, []);
    }
    client.mget({
        index: config.es_index,
        type: 'user',
        body: {
            loginname: names
        }
    }, callback);
    //User.find({loginname: {$in: names}}, callback);
};

/**
 * 根据登录名查找用户
 * Callback:
 * - err, 数据库异常
 * - user, 用户
 * @param {String} loginName 登录名
 * @param {Function} callback 回调函数
 */
exports.getUserByLoginName = function (loginName, callback) {
    client.search({
        index: config.es_index,
        q: 'loginname:' + loginName
    }, callback);
    //User.findOne({'loginname': loginName}, callback);
};

/**
 * 根据用户ID，查找用户
 * Callback:
 * - err, 数据库异常
 * - user, 用户
 * @param {String} id 用户ID
 * @param {Function} callback 回调函数
 */
exports.getUserById = function (id, callback) {
    if (!id) {
        return callback();
    }
    client.search({
        index: config.es_index,
        q: 'id:' + id
    }, callback);
    //User.findOne({_id: id}, callback);
};

/**
 * 根据邮箱，查找用户
 * Callback:
 * - err, 数据库异常
 * - user, 用户
 * @param {String} email 邮箱地址
 * @param {Function} callback 回调函数
 */
exports.getUserByMail = function (email, callback) {
    client.search({
        index: config.es_index,
        q: 'email:' + email
    }, callback);
    //User.findOne({email: email}, callback);
};

/**
 * 根据用户ID列表，获取一组用户
 * Callback:
 * - err, 数据库异常
 * - users, 用户列表
 * @param {Array} ids 用户ID列表
 * @param {Function} callback 回调函数
 */
exports.getUsersByIds = function (ids, callback) {
    client.mget({
        index: config.es_index,
        type: 'user',
        body: {
            id: ids
        }
    }, callback);
    //User.find({'_id': {'$in': ids}}, callback);
};

/**
 * 根据关键字，获取一组用户
 * Callback:
 * - err, 数据库异常
 * - users, 用户列表
 * @param {String} query 关键字
 * @param {Object} opt 选项
 * @param {Function} callback 回调函数
 */
exports.getUsersByQuery = function (query, opt, callback) {
    client.mget({
        index: config.es_index,
        type: 'user',
        body: query
    }, callback);
    //query_opt = {
    //    index: config.es_indexs,
    //    body: {
    //        query: {}
    //    }
    //}
    //for (var key in opt) {
    //    query_opt[key] = opt[key];
    //}
    //query_opt['body']['query'] = query;
    //client.search(query_opt, callback);
}
;

exports.getUsersMutiQuery = function (query, callback) {
    client.search({
        index: config.es_index,
        body: query
    },callback);
}

/**
 * 根据查询条件，获取一个用户
 * Callback:
 * - err, 数据库异常
 * - user, 用户
 * @param {String} name 用户名
 * @param {String} key 激活码
 * @param {Function} callback 回调函数
 */
exports.getUserByNameAndKey = function (loginname, key, callback) {
    client.search({
        index: config.es_indexs,
        body: {
            query: {
                match: {
                    loginname: loginname,
                    retrieve_key: key
                }
            }
        }
    }, callback);
};

exports.newAndSave = function (name, loginname, pass, email, avatar_url, active, callback) {
    client.index({
        index: config.es_index,
        type: 'user',
        //id: '1',
        body: {
            name: loginname,
            loginname: loginname,
            pass: pass,
            email: email,
            avatar: avatar_url,
            active: active || false,
            accessToken: uuid.v4()
        }
    }, callback);
};

var makeGravatar = function (email) {
    return 'http://www.gravatar.com/avatar/' + utility.md5(email.toLowerCase()) + '?size=48';
};
exports.makeGravatar = makeGravatar;

exports.getGravatar = function (user) {
    return user.avatar || makeGravatar(user);
};
