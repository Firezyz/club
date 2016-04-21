//var models = require('../models');
//var User = models.User;
var utility = require('utility');
var uuid = require('node-uuid');

var elasticsearch = require('elasticsearch');
var config = require('../config');

var client = new elasticsearch.Client({
    host: config.es_host + ':' + config.es_port,
    log: config.es_log
});
client.indices.create({index: config.es_index});


//client.indices.putMapping({
//    index: config.es_index,
//    type: 'user',
//    body: {
//        user: {
//            properties: {
//                name: {
//                    type: 'string',
//                    term_vector: 'with_positions_offsets',
//                    analyzer: 'ik_syno',
//                    search_analyzer: 'ik_syno'
//                },
//                loginname: {
//                    type: 'string',
//                    term_vector: 'with_positions_offsets',
//                    analyzer: 'ik_syno',
//                    search_analyzer: 'ik_syno'
//                },
//                pass: {type: 'string'},
//                email: {type: 'string'},
//                url: {type: 'string'},
//                profile_image_url: {type: 'string'},
//                location: {type: 'string'},
//                signature: {type: 'string'},
//                profile: {type: 'string'},
//                weibo: {type: 'string'},
//                avatar: {type: 'string'},
//                githubId: {type: 'string'},
//                githubUsername: {type: 'string'},
//                githubAccessToken: {type: 'string'},
//                is_block: {type: 'boolean'},
//                score: {type: 'integer'},
//                topic_count: {type: 'integer'},
//                reply_count: {type: 'integer'},
//                follower_count: {type: 'integer'},
//                following_count: {type: 'integer'},
//                collect_tag_count: {type: 'integer'},
//                collect_topic_count: {type: 'integer'},
//                create_at: {type: 'date'},
//                update_at: {type: 'date'},
//                is_star: {type: 'boolean'},
//                level: {type: 'string'},
//                active: {type: 'boolean'},
//                is_admin: {type: 'boolean'},
//                receive_reply_mail: {type: 'boolean'},
//                receive_at_mail: {type: 'boolean'},
//                from_wp: {type: 'boolean'},
//
//                retrieve_time: {type: 'long'},
//                retrieve_key: {type: 'string'},
//
//                accessToken: {type: 'string'}
//            }
//        }
//    }
//});

exports.deleteModelByQ = function (q, type, callback) {
    client.search({
        index: config.es_index,
        type: type,
        q: q
    }, function (err, result) {
        models = result['hits']['hits'];
        if (models.length === 0) {
            return callback('no model hits', {});
        }
        opt = [];
        for (var i = 0; i < models.length; i++) {
            opt.push({delete: {_index: config.es_index, _type: type, _id: models[i]['_id']}})
        }
        client.bulk({
            body: opt
        }, callback);

    })
}

exports.updateModelByQ = function (q, type, update, callback) {
    client.search({
        index: config.es_index,
        type: type,
        q: q
    }, function (err, result) {
        models = result['hits']['hits'];
        if (models.length === 0) {
            return callback('no model hits', {});
        }
        opt = [];
        for (var i = 0; i < models.length; i++) {
            opt.push({
                update: {_index: config.es_index, _type: type, _id: models[i]['_id'], body: {doc: update}}
            })
        }
        client.bulk({
            body: opt
        }, callback);

    })
}

exports.searchModelByList = function (field, fieldList, opt, type, callback) {
    query_dict = {
        index: config.es_index,
        type: type,
        body: {
            query: {
                bool: {should: []}
            }
        }
    }
    for (var i = 0; i < fieldList.length; i++) {
        var condition = {};
        condition[field] = fieldList[i];
        query_dict['body']['query']['bool']['should'].push(condition);
    }
    console.info('[ searchModelByList ] ' + query_dict);
    client.search(query_dict, callback);
}

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


exports.updateUserById = function (id, update, callback) {
    client.update({
        index: config.es_index,
        type: 'user',
        id: id,
        body: update
    }, callback)
}

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
    emails = email.split('@');
    query = {
        "query": {
            bool: {must: [{term: {email: emails[0]}}, {term: {email: emails[emails.length - 1]}}]}
        }
    }
    getUsersMutiQuery(query, callback);
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
    client.search({
        index: config.es_index,
        q: query
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

exports.getUsersByNameOrEmail = function (loginname, email, callback) {
    query = {
        "query": {
            "bool": {"should": [{"term": {"loginname": loginname}}, {"term": {"email": email}}]}
        }
    }
    getUsersMutiQuery(query, callback);
}


getUsersMutiQuery = function (query, callback) {
    client.search({
        index: config.es_index,
        body: query
    }, callback);
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
    console.error("是是是" + key);
    tocken_keys = key.split('-');
    console.error("切割之后" + tocken_keys)
    must_list = []
    must_list.push({"term": {loginname: loginname}});
    for (var i = 0; i < tocken_keys.length; i++) {
        must_list.push({"term": {retrieve_key: tocken_keys[i]}});
    }
    query = {
        "query": {
            "bool": {"must": must_list}
        }
    }
    getUsersMutiQuery(query, callback)
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
