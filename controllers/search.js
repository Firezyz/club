var es = require('../proxy/search');
exports.index = function (req, res, next) {
    var q = req.query.q;
    q = encodeURIComponent(q);
    res.redirect('https://www.google.com.hk/#hl=zh-CN&q=site:cnodejs.org+' + q);
};

exports.search = function (req, res, next) {
    var q = req.body.q;
    es.search(q, function (err, results) {
        if (err) {
            res.render('search', {
                error: '查询失败了',
                topics: {}
            });
        }
        results = results['hits']['hits'];
        var new_results = [];
        results.forEach(function (result) {
            var new_result = result['_source'];
            new_result['id'] = result['_id'];
            if (!!result['highlight']['content']) {
                new_result['content'] = '';
                result['highlight']['content'].forEach(function (content) {
                    new_result['content'] += content;
                })
            }
            if (!!result['highlight']['title']) {
                new_result['title'] = '';
                result['highlight']['title'].forEach(function (title) {
                    new_result['title'] += title;
                })
            }
            new_results.push(new_result);
        })
        res.render('search', {
            topics: new_results,
        });
    })
}
