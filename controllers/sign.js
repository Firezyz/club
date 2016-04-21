var validator = require('validator');
var eventproxy = require('eventproxy');
var config = require('../config');
var UserModel = require('../models/user');
var User = require('../proxy').User;
var mail = require('../common/mail');
var tools = require('../common/tools');
var utility = require('utility');
var authMiddleWare = require('../middlewares/auth');
var uuid = require('node-uuid');

//sign up
exports.showSignup = function (req, res) {
    res.render('sign/signup');
};

exports.signup = function (req, res, next) {
    var loginname = validator.trim(req.body.loginname).toLowerCase();
    var email = validator.trim(req.body.email).toLowerCase();
    var pass = validator.trim(req.body.pass);
    var rePass = validator.trim(req.body.re_pass);

    var ep = new eventproxy();
    ep.fail(next);
    ep.on('prop_err', function (msg) {
        res.status(422);
        res.render('sign/signup', {error: msg, loginname: loginname, email: email});
    });

    // 验证信息的正确性
    if ([loginname, pass, rePass, email].some(function (item) {
            return item === '';
        })) {
        ep.emit('prop_err', '信息不完整。');
        return;
    }
    if (loginname.length < 5) {
        ep.emit('prop_err', '用户名至少需要5个字符。');
        return;
    }
    if (!tools.validateId(loginname)) {
        return ep.emit('prop_err', '用户名不合法。');
    }
    if (!validator.isEmail(email)) {
        return ep.emit('prop_err', '邮箱不合法。');
    }
    if (pass !== rePass) {
        return ep.emit('prop_err', '两次密码输入不一致。');
    }
    // END 验证信息的正确性


    User.getUsersByNameOrEmail(loginname, email, function (err, result) {
        console.error("++++++++++++++++++++++");
        console.log(result);
        console.error("++++++++++++++++++++++");
        if (result['hits']['hits'].length > 0) {
            ep.emit('prop_err', '用户名或邮箱已被使用。');
            return;
        }
        //if (err) {
        //    return next(err);
        //}

        tools.bcrypt_hash(pass, ep.done(function (passhash) {
            // create gravatar
            var avatarUrl = User.makeGravatar(email);
            User.newAndSave(loginname, loginname, passhash, email, avatarUrl, false, function (err, result) {
                console.error("++++++++++++++++++++++");
                console.log(result);
                console.log(err)
                console.error("++++++++++++++++++++++");

                if (err) {
                    return next(err);
                }
                // 发送激活邮件
                mail.sendActiveMail(email, utility.md5(email + passhash + config.session_secret), loginname);
                res.render('sign/signup', {
                    success: '欢迎加入 ' + config.name + '！我们已给您的注册邮箱发送了一封邮件，请点击里面的链接来激活您的帐号。'
                });
            });

        }));
    });
};

/**
 * Show user login page.
 *
 * @param  {HttpRequest} req
 * @param  {HttpResponse} res
 */
exports.showLogin = function (req, res) {
    req.session._loginReferer = req.headers.referer;
    res.render('sign/signin');
};

/**
 * define some page when login just jump to the home page
 * @type {Array}
 */
var notJump = [
    '/active_account', //active page
    '/reset_pass',     //reset password page, avoid to reset twice
    '/signup',         //regist page
    '/search_pass'    //serch pass page
];

/**
 * Handle user login.
 *
 * @param {HttpRequest} req
 * @param {HttpResponse} res
 * @param {Function} next
 */
exports.login = function (req, res, next) {
    var loginname = validator.trim(req.body.name).toLowerCase();
    var pass = validator.trim(req.body.pass);
    var ep = new eventproxy();

    ep.fail(next);

    if ([loginname, pass].some(function (item) {
            return item === '';
        })) {
        res.status(422);
        return res.render('sign/signin', {error: '信息不完整。'});
    }

    var getUser;
    if (loginname.indexOf('@') !== -1) {
        getUser = User.getUserByMail;
    } else {
        getUser = User.getUserByLoginName;
    }

    ep.on('login_failed', function (login_failed) {
        res.status(403);
        res.render('sign/signin', {error: '用户名或密码错误'});
    });

    getUser(loginname, function (err, result) {
        if (err) {
            return next(err);
        }
        users = result['hits']['hits']
        if (users.length !== 1) {
            return ep.emit('login_failed');
        }
        user = users[0]['_source'];
        console.error("==================");
        console.info(user);
        console.error("==================");
        var passhash = user.pass;
        tools.bcrypt_compare(pass, passhash, ep.done(function (flag) {
            if (!flag) {
                return ep.emit('login_failed');
            }
            if (!user.active) {
                // 重新发送激活邮件
                mail.sendActiveMail(user.email, utility.md5(user.email + passhash + config.session_secret), user.loginname);
                res.status(403);
                return res.render('sign/signin', {error: '此帐号还没有被激活，激活链接已发送到 ' + user.email + ' 邮箱，请查收。'});
            }
            // store session cookie
            authMiddleWare.gen_session(user, res);

            //check at some page just jump to home page
            var refer = req.session._loginReferer || '/';

            //过滤调回的页面
            for (var i = 0, len = notJump.length; i !== len; ++i) {
                if (refer.indexOf(notJump[i]) >= 0) {
                    refer = '/';
                    break;
                }
            }
            res.redirect(refer);
        }));
    });
};

// sign out
exports.signout = function (req, res, next) {
    req.session.destroy();
    res.clearCookie(config.auth_cookie_name, {path: '/'});
    res.redirect('/');
};

exports.activeAccount = function (req, res, next) {
    var key = validator.trim(req.query.key);
    var name = validator.trim(req.query.name);

    User.getUserByLoginName(name, function (err, result) {
        users = result['hits']['hits'];
        if (users.length > 1) {
            return next(new Error('[ACTIVE_ACCOUNT] multi users'));
        }
        if (err) {
            return next(err);
        }
        if (users.length == 0) {
            return next(new Error('[ACTIVE_ACCOUNT] no such user: ' + name));
        }
        user = users[0]['_source'];
        document_id = users[0]['_id'];
        var passhash = user.pass;
        console.info('[active user] ' + user);
        console.info('[active user] ' + key);
        console.info('[active user] ' + utility.md5(user.email + passhash + config.session_secret));

        if (!user || utility.md5(user.email + passhash + config.session_secret) !== key) {
            return res.render('notify/notify', {error: '信息有误，帐号无法被激活。'});
        }
        if (user.active) {
            return res.render('notify/notify', {error: '帐号已经是激活状态。'});
        }

        User.updateUserById(document_id, {doc: {active: true}}, function (err) {
            if (err) {
                return next(err);
            }
            res.render('notify/notify', {success: '帐号已被激活，请登录'});
        });
    });
};

exports.showSearchPass = function (req, res) {
    res.render('sign/search_pass');
};

exports.updateSearchPass = function (req, res, next) {
    var email = validator.trim(req.body.email).toLowerCase();
    if (!validator.isEmail(email)) {
        return res.render('sign/search_pass', {error: '邮箱不合法', email: email});
    }

    // 动态生成retrive_key和timestamp到users collection,之后重置密码进行验证
    var retrieveKey = uuid.v4();
    var retrieveTime = new Date().getTime();

    User.getUserByMail(email, function (err, result) {
        users = result['hits']['hits'];
        if (users.length == 0) {
            res.render('sign/search_pass', {error: '没有这个电子邮箱。', email: email});
            return;
        }
        user = users[0]['_source'];
        document_id = users[0]['_id'];

        User.updateUserById(document_id, {
            doc: {
                retrieve_key: retrieveKey,
                retrieve_time: retrieveTime
            }
        }, function (err) {
            if (err) {
                return next(err);
            }
            mail.sendResetPassMail(email, retrieveKey, user.loginname);
            res.render('notify/notify', {success: '我们已给您填写的电子邮箱发送了一封邮件，请在24小时内点击里面的链接来重置密码。'});
        });
    });
};

/**
 * reset password
 * 'get' to show the page, 'post' to reset password
 * after reset password, retrieve_key&time will be destroy
 * @param  {http.req}   req
 * @param  {http.res}   res
 * @param  {Function} next
 */
exports.resetPass = function (req, res, next) {
    var key = validator.trim(req.query.key);
    var name = validator.trim(req.query.name);

    User.getUserByNameAndKey(name, key, function (err, result) {
        users = result['hits']['hits'];
        if (users.length == 0) {
            res.status(403);
            return res.render('notify/notify', {error: '信息有误，密码无法重置。'});
        }
        user = users[0]['_source'];
        var now = new Date().getTime();
        var oneDay = 1000 * 60 * 60 * 24;
        if (!user.retrieve_time || now - user.retrieve_time > oneDay) {
            res.status(403);
            return res.render('notify/notify', {error: '该链接已过期，请重新申请。'});
        }
        return res.render('sign/reset', {name: name, key: key});
    });
};

exports.updatePass = function (req, res, next) {
    var psw = validator.trim(req.body.psw) || '';
    var repsw = validator.trim(req.body.repsw) || '';
    var key = validator.trim(req.body.key) || '';
    var name = validator.trim(req.body.name) || '';

    var ep = new eventproxy();
    ep.fail(next);

    if (psw !== repsw) {
        return res.render('sign/reset', {name: name, key: key, error: '两次密码输入不一致。'});
    }
    User.getUserByNameAndKey(name, key, ep.done(function (result) {
        users = result['hits']['hits'];
        if (users.length == 0) {
            return res.render('notify/notify', {error: '错误的激活链接'});
        }
        document_id = users[0]['_id'];
        user = users[0]['_source'];

        tools.bcrypt_hash(psw, ep.done(function (passhash) {
            user.pass = passhash;
            user.retrieve_key = null;
            user.retrieve_time = null;
            user.active = true; // 用户激活

            User.updateUserById(document_id,
                {
                    doc: {
                        pass: passhash,
                        retrieve_key: null,
                        retrieve_time: null,
                        active: true
                    }
                }, function (err) {
                    if (err) {
                        return next(err);
                    }
                    return res.render('notify/notify', {success: '你的密码已重置。'});
                }
            )
            ;
        }));
    }));
};

