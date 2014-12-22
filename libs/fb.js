var request = require("request");
var Q = require("q");
var _ = require("underscore");

var FB_HOST = "https://graph.facebook.com";

function FB() {
  this._token = undefined;
  this._appId = undefined;
}

FB.prototype.getAccessToken = function(app_id, app_secret) {
  this._token = undefined;
  this._appId = undefined;
  return this.apiGet("/oauth/access_token", {client_id: app_id, client_secret: app_secret, grant_type: "client_credentials"}, true)
    .then(function(res) {
      if (res.statusCode != 200) return false;
      this._token = res.body.split("=")[1];
      this._appId = app_id;
      return true;
    }.bind(this));
};

FB.prototype.getDebugToken = function(input_token) {
  return this.apiGet("/debug_token", {input_token: input_token})
    .then(function(res) {
      if (res.statusCode !== 200 || res.body.data.error !== undefined || res.body.data.app_id != this._appId) {
        return null;
      }
      return res.body.data;
    }.bind(this));
};

FB.prototype.apiGet = function(path, qs, noJSON) {
  qs = qs || {};
  if (this._token !== undefined) qs = _.extend(qs, {access_token: this._token});
  var d = Q.defer();
  var params = {uri: FB_HOST + path, qs: qs};
  if (!noJSON) params.json = true;
  request.get(params, function(err, res) {
    if (err) return d.reject(err);
    d.resolve(res);
  });
  return d.promise;
};

module.exports = new FB();
module.exports.FB = FB;
