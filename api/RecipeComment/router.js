function recipeCommentCreate(req, res, next) {
	var data = _.omit(req.body, "user");
	data.user = req.user;

	RecipeComment.findOne({recipe: data.recipe, user: data.user}).then(function(com) {
		if (com) {
			com.rate = data.rate;
			com.comment = data.comment;
			return com.save().then(function(com) {
				APP.dbEvent(RecipeComment, "update", com, req.user);
				res.json(com);
			});
		}
		return RecipeComment.create(data).then(function(com) {
			APP.dbEvent(RecipeComment, "create", com, req.user);
			res.json(com);
		});
	})
	.then(null, ValCb(res, next));
}

function recipeCommentDestroy(req, res, next) {
	RecipeComment.destroy({id: req.params.id, user: req.user.id}).then(function(entries) {
		if (entries.length == 0) return res.json({});
		APP.dbEvent(RecipeComment, "destroy", entries[0], req.user);
		res.json(entries[0]);
	}, next);
}

module.exports = function(pol, prefix) {
	APP.swag.addDefinition({
		"recipeCommentModel": {
			"required": ["rate", "user", "recipe", "comment"],
			"properties": {
				"rate": {"type": "integer"},
				"user": {"type": "string"},
				"recipe": {"type": "string"},
				"comment": {"type": "string"}
			}
		}
	});

	var swag = APP.swag.handlerPaths(prefix, ["RecipeComment"]);
	var router = require("express").Router();

	var rest = Rest(RecipeComment);

	router.route("/count")
	.get(rest.count);
	rest.swagCount(swag, "countRecipeComment");

	router.route("/")
	.get(rest.find)
	.post(pol.isAuthenticated, recipeCommentCreate);
	rest.swagFind(swag, "findRecipeComment", "#/definitions/recipeCommentModel");
	rest.swagCreate(swag, "createRecipeComment", "#/definitions/recipeCommentModel", [{
		"name": "rate", "in": "form", "required": true, "type": "integer"
	}, {
		"name": "comment", "in": "form", "required": true, "type": "string"
	}, {
		"name": "recipe", "in": "form", "required": true, "type": "string"
	}]);

	router.route("/:id")
	.get(rest.findOne)
	.delete(pol.isAuthenticated, recipeCommentDestroy);
	rest.swagFindOne(swag, "findOneRecipeComment", "#/definitions/recipeCommentModel");

	return router;
};
