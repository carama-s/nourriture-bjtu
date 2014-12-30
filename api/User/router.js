function me(req, res, next) {
	res.json(req.user);
}

function get_token(req, res, next) {
	function resToken(user) {
		if (user.tokens.length > 0) return res.json({user: user, token: user.tokens[0]});
		return Token.create({user: user}).then(function(token) {
			res.json({token: token, user: user});
		});
	}

	if (req.body.email && req.body.passwd) {
		User.findOneByEmail(req.body.email).populate("tokens").then(function(user) {
			if (!user) return res.status(400).json({error: "Invalid credentials."});
			return user.checkPasswd(req.body.passwd)
				.then(function(ok) {
					if (!ok) return res.status(400).json({error: "Invalid credentials."});
					return resToken(user);
				});
		})
		.then(null, next);
	} else if (req.body.facebook_id && req.body.facebook_token) {
		var fb_id = req.body.facebook_id;
		var fb_token = req.body.facebook_token;
		FB.getDebugToken(fb_token).then(function(fbres) {
			if (fbres == null) return res.status(400).json({error: "Invalid credentials."});
			if (fbres.user_id != fb_id) return res.status(400).json({error: "Invalid credentials."});
			return User.findOne({facebook_id: fb_id}).populate("tokens").then(function(user) {
				if (user) return resToken(user);
				return FB.apiGet("/" + fb_id).then(function(fbres) {
					var user = _.pick(fbres.body, "email", "gender");
					user.firstname = fbres.body.first_name;
					user.lastname = fbres.body.last_name;
					user.facebook_id = fbres.body.id;
					user.facebook_token = fb_token;
					return res.json({need_signup: true, user: user});
				});
			});
		})
		.then(null, next);
	} else {
		res.status(400).json({error: "Missing data"});
	}
}

function signup(req, res, next) {
	function create_user(data) {
		return User.create(data).then(function(user) {
			res.json(user);
		}, ValCb(res, next));
	}

	var fb_id = req.body.facebook_id;
	var fb_token = req.body.facebook_token;
	var data = _.omit(req.body, "tokens", "admin", "facebook_id");

	if (fb_token === undefined && fb_id === undefined) return create_user(data);

	FB.getDebugToken(fb_token).then(function(fbres) {
		if (fbres == null) return res.status(400).json({error: "Can't valid facebook_token"});
		if (fbres.user_id != fb_id) return res.status(400).json({error: "Can't valid facebook_id"});
		data.facebook_id = fb_id;
		create_user(data);
	}, next);
}

function change_passwd(req, res, next) {
	if (req.body.old_passwd && req.body.new_passwd) {
		req.user.checkPasswd(req.body.old_passwd).then(function(ok) {
			if (!ok) return res.status(400).json({error: "Invalid credentials."});
			req.user.passwd = req.body.new_passwd;
			return req.user.save().then(function(user) {
				res.json(user);
			}, ValCb(res, next));
		})
		.then(null, next);
	} else {
		res.status(400).json({error: "Missing data"});
	}
}

function update_self(req, res, next) {
	var data = _.pick(req.body, "firstname", "lastname", "gender", "email");
	_.extend(req.user, data);
	req.user.save().then(function(user) {
		res.json(user);
	}, ValCb(res, next));
}

module.exports = function(pol, prefix) {
	APP.swag.addDefinition({
		"resGetTokenOK": {
			"properties": {
				"token": {"schema": {"$ref": "#/definitions/tokenModel"}},
				"user": {"schema": {"$ref": "#/definitions/userModel"}}
			}
		},
		"tokenModel": {
			"properties": {
				"token": {"type": "string"}
			}
		},
		"userModel": {
			"required": ["firstname", "lastname", "username", "email", "passwd", "gender", "admin"],
			"properties": {
				"username": {"type": "string"},
				"email": {"type": "string"},
				"passwd": {"type": "string"},
				"firstname": {"type": "string"},
				"lastname": {"type": "string"},
				"gender": {"type": "string", "enum": ["na", "male", "female"], "default": "na"},
				"admin": {"type": "integer", "default": 10}
			}
		}
	});

	var swag = APP.swag.handlerPaths(prefix, ["User"]);
	var router = require("express").Router();

	router.route("/me").get(pol.isAuthenticated, me);
	swag("/me", {
		"get": {
			"operationId": "meUser",
			"parameters": [],
			"responses": {
				"403": {"schema": {"$ref": "#/definitions/error"}},
				"200": {"schema": {"$ref": "#/definitions/userModel"}}
			}
		}
	});

	router.route("/get_token").post(get_token);
	swag("/get_token", {
		"post": {
			"operationId": "getTokenUser",
			"parameters": [{
				"name": "email",
				"in": "formData",
				"type": "string"
			}, {
				"name": "passwd",
				"in": "formData",
				"type": "string"
			}, {
				"name": "facebook_id",
				"in": "formData",
				"type": "string"
			}, {
				"name": "facebook_token",
				"in": "formData",
				"type": "string"
			}],
			"responses": {
				"400": {"schema": {"$ref": "#/definitions/error"}},
				"200": {"schema": {"$ref": "#/definitions/resGetTokenOK"}}
			}
		}
	});

	router.route("/signup").post(signup);
	swag("/signup", {
		"post": {
			"operationId": "signupUser",
			"parameters": [{
				"name": "email",
				"in": "formData",
				"type": "string",
				"required": true
			}, {
				"name": "passwd",
				"in": "formData",
				"type": "string",
				"required": true
			}, {
				"name": "facebook_id",
				"in": "formData",
				"type": "string"
			}, {
				"name": "facebook_token",
				"in": "formData",
				"type": "string"
			}, {
				"name": "username",
				"in": "formData",
				"type": "string",
				"required": true
			}, {
				"name": "firstname",
				"in": "formData",
				"type": "string",
				"required": true
			}, {
				"name": "lastname",
				"in": "formData",
				"type": "string",
				"required": true
			}, {
				"name": "gender",
				"in": "formData",
				"type": "string",
				"enum": ["na", "male", "female"],
				"default": "na"
			}],
			"responses": {
				"400": {"schema": {"$ref": "#/definitions/error"}},
				"200": {"schema": {"$ref": "#/definitions/resGetTokenOK"}}
			}
		}
	});

	router.route("/change_passwd").post(pol.isAuthenticated, change_passwd);
	swag("/change_passwd", {
		"post": {
			"operationId": "changePasswdUser",
			"parameters": [{
				"name": "old_passwd",
				"in": "formData",
				"type": "string",
				"required": true
			}, {
				"name": "new_passwd",
				"in": "formData",
				"type": "string",
				"required": true
			}],
			"responses": {
				"403": {"schema": {"$ref": "#/definitions/error"}},
				"200": {"schema": {"$ref": "#/definitions/userModel"}}
			}
		}
	});

	router.route("/update").post(pol.isAuthenticated, update_self);
	swag("/update", {
		"post": {
			"operationId": "updateUser",
			"parameters": [{
				"name": "email",
				"in": "formData",
				"type": "string"
			}, {
				"name": "firstname",
				"in": "formData",
				"type": "string"
			}, {
				"name": "lastname",
				"in": "formData",
				"type": "string"
			}, {
				"name": "gender",
				"in": "formData",
				"type": "string",
				"enum": ["na", "male", "female"]
			}],
			"responses": {
				"400": {"schema": {"$ref": "#/definitions/error"}},
				"200": {"schema": {"$ref": "#/definitions/userModel"}}
			}
		}
	});

	var rest = Rest(User);

	router.route("/count")
	.get(rest.count);
	rest.swagCount(swag, "countUser");

	router.route("/")
	.get(rest.find)
	.post(pol.isSuperAdmin, rest.create);
	rest.swagFind(swag, "findUser", "#/definitions/userModel");

	router.route("/:id")
	.get(rest.findOne)
	.put(pol.isSuperAdmin, rest.update)
	.delete(pol.isSuperAdmin, rest.destroy);
	rest.swagFindOne(swag, "findOneUser", "#/definitions/userModel");

	return router;
};
