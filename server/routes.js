(function() {

  module.exports = function(app) {
    var loadItem, redis;
    redis = require('redis');
    loadItem = function(req, res, next) {
      req.item = {
        id: req.params.id,
        text: 'loaded item',
        date: '12/31/1999'
      };
      return next();
    };
    app.get('/', function(req, res) {
      req.session.views++;
      return res.render('index', {
        title: req.session.views + ' Views'
      });
    });
    return app.get('/item/:id', loadItem, function(req, res) {
      return res.send(req.item);
    });
  };

}).call(this);
