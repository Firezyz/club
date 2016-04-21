//function UserModel() {
//    this.name = '';
//    this.loginname = '';
//    this.pass = '';
//    this.email = '';
//    this.url = '';
//    this.profile_image_url = '';
//    this.location = '';
//    this.signature = '';
//    this.profile = '';
//    this.weibo = '';
//    this.avatar = '';
//    this.githubId = '';
//    this.githubUsername = '';
//    this.githubAccessToken = '';
//    this.is_block = false;
//    this.score = 0;
//    this.topic_count = 0;
//    this.reply_count = 0;
//    this.follower_count = 0;
//    this.following_count = 0;
//    this.collect_tag_count = 0;
//    this.collect_topic_count = 0;
//    this.create_at = new Date();
//    this.update_at = new Date();
//    this.is_star = '';
//    this.level = '';
//    this.active = false;
//    this.is_admin = false;
//    this.receive_reply_mail = false;
//    this.receive_at_mail = false;
//    this.from_wp = '';
//
//    this.retrieve_time = '';
//    this.retrieve_key = '';
//
//    this.accessToken = '';
//
//    //if (User.prototype.say == undefined) {
//    //    User.prototype.say = function () {
//    //        alert("I am " + this.name);
//    //
//    //    }
//    //
//    //}
//}

var User = {
    createUser: function () {
        var user = {}
        user.name = '';
        user.loginname = '';
        user.pass = '';
        user.email = '';
        user.url = '';
        user.profile_image_url = '';
        user.location = '';
        user.signature = '';
        user.profile = '';
        user.weibo = '';
        user.avatar = '';
        user.githubId = '';
        user.githubUsername = '';
        user.githubAccessToken = '';
        user.is_block = false;
        user.score = 0;
        user.topic_count = 0;
        user.reply_count = 0;
        user.follower_count = 0;
        user.following_count = 0;
        user.collect_tag_count = 0;
        user.collect_topic_count = 0;
        user.create_at = new Date();
        user.update_at = new Date();
        user.is_star = '';
        user.level = '';
        user.active = false;
        user.is_admin = false;
        user.receive_reply_mail = false;
        user.receive_at_mail = false;
        user.from_wp = '';

        user.retrieve_time = '';
        user.retrieve_key = '';

        user.accessToken = '';
        return user;
    }
};


module.exports = User;
//UserSchema.virtual('avatar_url').get(function () {
//    var url = this.avatar || ('https://gravatar.com/avatar/' + utility.md5(this.email.toLowerCase()) + '?size=48');
//
//    // www.gravatar.com 被墙
//    url = url.replace('www.gravatar.com', 'gravatar.com');
//
//    // 让协议自适应 protocol，使用 `//` 开头
//    if (url.indexOf('http:') === 0) {
//        url = url.slice(5);
//    }
//
//    // 如果是 github 的头像，则限制大小
//    if (url.indexOf('githubusercontent') !== -1) {
//        url += '&s=120';
//    }
//
//    return url;
//});
//
//UserSchema.virtual('isAdvanced').get(function () {
//    // 积分高于 700 则认为是高级用户
//    return this.score > 700 || this.is_star;
//});
//
//UserSchema.index({loginname: 1}, {unique: true});
//UserSchema.index({email: 1}, {unique: true});
//UserSchema.index({score: -1});
//UserSchema.index({githubId: 1});
//UserSchema.index({accessToken: 1});
//
//mongoose.model('User', UserSchema);
