(function() {

  module.exports = function(redis) {
    return {
      authenticate: function(name, pass, callback) {
        return typeof callback === "function" ? callback({
          name: name,
          id: 10
        }) : void 0;
      }
    };
  };

}).call(this);
