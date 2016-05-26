var path = require('path');

var config = {
    name: 'JLUclub',
    description: 'JLU技术交流社区',
    keywords: '技术,JLU,吉大',

    db: 'mongodb://127.0.0.1/jlu_club_dev',
    es_host: 'localhost',
    es_port: '9200',
    es_log: 'trace',
    es_index: 'jlu_dev_test',

    redis_host: '127.0.0.1',
    redis_port: 6379,
    redis_db: 0,

    admins: {firezyz: true, admin: true},
    tabs: [
        ['front', '前端'],
        ['backend', '后端'],
        ['app', '客户端'],
        ['ask', '问答'],
        ['job', '招聘'],
        ['exam', '考试'],
    ],

    upload: {
        path: path.join(__dirname, 'static/upload/'),
        url: '/static/upload/'
    },


    debug: true,
    site_headers: [
        '<meta name="author" content="Firezyz@JLU" />'
    ],
    site_logo: '',
    site_icon: '',

    site_navs: [
        ['/about', '关于']
    ],
    host: 'localhost',


    session_secret: 'firezyz',
    auth_cookie_name: 'jlu_club',

    port: 3000,

    list_topic_count: 20,

    list_reply_count: 50,

    admin_list_topic_count: 50,

    admin_list_user_count: 50,

    mail_opts: {
        host: 'smtp.qq.com',
        secureConnection: true,
        port: 465,
        auth: {
            user: '1063784603@qq.com',
            pass: 'KLKLsys24678!'
        }
    },

    weibo_key: 'firezyz',
    weibo_id: 'firezyz',


    webmasters: {firezyz: true, admin: true},

    allow_sign_up: true,

    upload: {
        path: path.join(__dirname, 'static/upload/'),
        url: '/static/upload/'
    },

    default_avatar_path: '/static/images/default_avatar.jpg',

    file_limit: '5MB',


    create_post_per_day: 100, // 每个用户一天可以发的主题数
    create_reply_per_day: 100, // 每个用户一天可以发的评论数
    visit_per_day: 10000, // 每个 ip 每天能访问的次数
    user_is_advance: 1,
};

if (process.env.NODE_ENV === 'test') {
    config.db = 'mongodb://127.0.0.1/jlu_club_test';
}

module.exports = config;
