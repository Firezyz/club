var config = require('../config');
var elasticsearch = require('elasticsearch');

var client = new elasticsearch.Client({
    host: config.es_host + ':' + config.es_port,
    log: config.es_log
});


client.indices.create({index: 'test'});

client.indices.putMapping({
    index: 'test',
    type: 'article',
    body: {
        article: {
            properties: {
                title: {
                    type: 'string',
                    term_vector: 'with_positions_offsets',
                    analyzer: 'ik_syno',
                    search_analyzer: 'ik_syno',
                },
                content: {
                    type: 'string',
                    term_vector: 'with_positions_offsets',
                    analyzer: 'ik_syno',
                    search_analyzer: 'ik_syno',
                },
                tags: {type: 'string', term_vector: 'no', analyzer: 'ik_syno', search_analyzer: 'ik_syno',},
                slug: {type: 'string', term_vector: 'no',},
                update_date: {type: 'date', term_vector: 'no', index: 'no',}
            }
        }
    }
});


client.index({
    index: 'test',
    type: 'article',
    id: '100',
    body: {
        title: '什么是 JS？',
        slug: 'what-is-js',
        tags: ['JS', 'JavaScript', 'TEST'],
        content: 'JS 是 JavaScript 的缩写！',
        update_date: '2015-12-15T13:05:55Z'
    }
});


client.search({index: 'test', type: 'article', q: 'JS',}).then(function (data) {
    console.log('result:');
    console.log(JSON.stringify(data));
}, function (err) {
    console.log('error:');
    console.log(err);
});


//client.search({
//    index: config.es_index,
//    q: 'email:zhangsan@qq.com'
//}, function (error, response) {
//    console.log("==================");
//    console.error(response);
//    console.log("==================");
//});
//
//email = 'zhangsan@qq.com';
//emails = email.split('@');
//
//
//client.search({
//    index: config.es_index,
//    type: 'user',
//    body: {
//        //loginname: ['zhangyuzhu', 'xuwenqi']
//        // query: { match_all: {loginname:'zhangyuzhu',login} }
//        "query": {
//            bool: {should: [{term: {_id: 'AVPG3nA6pLVGK5FESIO2'}}, {term: {_id: 'AVPGwYaRpLVGK5FESHfw'}}]}
//        }
//    }
//}, function (res) {
//    console.log(res);
//});

//client.search({
//    index: config.es_index,
//    type:"reply",
//    "q": "author_id:AVPGwYaRpLVGK5FESHfw",
//    "size": 20,
//    "sort": [{creat_at:{
//        order: 'desc'
//    }}]
//
//},function(result){
//    console.log(result);
//});

//client.search({
//    index: config.es_index,
//    body: {
//        query: {
//            bool: {
//                must: [
//                    {
//                        term: {
//                            email: emails[emails.length - 1]
//                        }
//                    },
//                    {
//                        term: {
//                            email: emails[0]
//                        }
//                    }
//                ]
//
//            }
//        }
//    }
//}, function (error, response) {
//    console.log("==================");
//    console.error(response);
//    console.log("==================");
//});


//client.search({
//        index: config.es_index,
//        body: {
//            "query": {
//                "bool": {
//                    "should": [
//                        {
//                            "match": {
//                                "loginname": "zhangyuzhu"
//                            }
//                        },
//                        {
//                            "match": {
//                                "email": "zhangyuzhu@qq.com"
//                            }
//                        }
//                    ]
//                }
//            }
//        }
//    },
//    function (error, response) {
//        console.log("==================");
//        console.error(response);
//        console.log("==================");
//    }
//)
//;


//client.indices.create({index: config.es_index});
//
//client.indices.putMapping({
//    index: config.es_index,
//    type: 'user',
//    body: {
//        topic: {
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
//                retrieve_time: {type: 'integer'},
//                retrieve_key: {type: 'string'},
//
//                accessToken: {type: 'string'}
//            }
//        }
//    }
//});
//
//client.indices.putMapping({
//    index: config.es_index,
//    type: 'reply',
//    body: {
//        reply: {
//            properties: {
//                topic_id: {
//                    type: 'integer',
//                    term_vector: 'with_positions_offsets'
//                },
//                content: {
//                    type: 'string',
//                    term_vector: 'with_positions_offsets',
//                    analyzer: 'ik_syno',
//                    search_analyzer: 'ik_syno'
//                },
//                content_is_html: {
//                    type: 'boolean',
//                    term_vector: 'with_positions_offsets'
//                },
//                ups: {
//                    type: 'integer',
//                    term_vector: 'with_positions_offsets'
//                },
//                deleted: {
//                    type: 'boolean',
//                    term_vector: 'with_positions_offsets'
//                },
//                author_id: {
//                    type: 'integer',
//                    term_vector: 'no'
//                },
//                reply_id: {
//                    type: 'integer',
//                    term_vector: 'no'
//                },
//                create_at: {
//                    type: 'date',
//                    term_vector: 'no',
//                    index: 'no'
//                },
//                update_at: {
//                    type: 'date',
//                    term_vector: 'no',
//                    index: 'no'
//                }
//            }
//        }
//    }
//});
//
//client.indices.putMapping({
//    index: config.es_index,
//    type: 'message',
//    body: {
//        message: {
//            properties: {
//                type: {
//                    type: 'string',
//                    term_vector: 'with_positions_offsets',
//                    analyzer: 'ik_syno',
//                    search_analyzer: 'ik_syno'
//                },
//                master_id: {
//                    type: 'integer',
//                    term_vector: 'with_positions_offsets',
//                    analyzer: 'ik_syno',
//                    search_analyzer: 'ik_syno'
//                },
//                author_id: {
//                    type: 'integer',
//                    term_vector: 'no',
//                    analyzer: 'ik_syno',
//                    search_analyzer: 'ik_syno'
//                },
//                topic_id: {
//                    type: 'integer',
//                    term_vector: 'no'
//                },
//                reply_id: {
//                    type: 'integer',
//                    term_vector: 'no',
//                    analyzer: 'ik_syno',
//                    search_analyzer: 'ik_syno'
//                },
//                has_read: {
//                    type: 'boolean',
//                    term_vector: 'no',
//                    analyzer: 'ik_syno',
//                    search_analyzer: 'ik_syno'
//                },
//                create_at: {
//                    type: 'date',
//                    term_vector: 'no',
//                    index: 'no'
//                }
//            }
//        }
//    }
//});
//
//client.indices.putMapping({
//    index: config.es_index,
//    type: 'topic',
//    body: {
//        topic: {
//            properties: {
//                title: {
//                    type: 'string',
//                    term_vector: 'with_positions_offsets',
//                    analyzer: 'ik_syno',
//                    search_analyzer: 'ik_syno'
//                },
//                content: {
//                    type: 'string',
//                    term_vector: 'with_positions_offsets',
//                    analyzer: 'ik_syno',
//                    search_analyzer: 'ik_syno'
//                },
//                author_id: {
//                    type: 'integer',
//                    term_vector: 'with_positions_offsets'
//                },
//                top: {
//                    type: 'boolean',
//                    term_vector: 'with_positions_offsets'
//                },
//                good: {
//                    type: 'boolean',
//                    term_vector: 'with_positions_offsets'
//                },
//                lock: {
//                    type: 'boolean',
//                    term_vector: 'with_positions_offsets'
//                },
//                block: {
//                    type: 'boolean',
//                    term_vector: 'with_positions_offsets'
//                },
//                reply_count: {
//                    type: 'integer',
//                    term_vector: 'with_positions_offsets'
//                },
//                visit_count: {
//                    type: 'integer',
//                    term_vector: 'with_positions_offsets'
//                },
//                collect_count: {
//                    type: 'integer',
//                    term_vector: 'with_positions_offsets'
//                },
//                last_reply: {
//                    type: 'integer',
//                    term_vector: 'no'
//                },
//                last_reply_at: {
//                    type: 'integer',
//                    term_vector: 'no'
//                },
//                content_is_html: {
//                    type: 'boolean'
//                },
//                tab: {
//                    type: 'String'
//                },
//                deleted: {
//                    type: 'boolean'
//                },
//                create_at: {
//                    type: 'date',
//                    term_vector: 'no',
//                    index: 'no'
//                },
//                update_at: {
//                    type: 'date',
//                    term_vector: 'no',
//                    index: 'no'
//                }
//            }
//        }
//    }
//});
//
//client.indices.putMapping({
//    index: config.es_index,
//    type: 'topic_collect',
//    body: {
//        topic: {
//            properties: {
//                user_id: {
//                    type: 'integer'
//                },
//                topic_id: {
//                    type: 'integer'
//                },
//                create_at: {
//                    type: 'date'
//                }
//            }
//        }
//    }
//});
//
//
//

