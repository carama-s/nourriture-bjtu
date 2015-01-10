function recipeCommentCreate(req, res, next) {
	var data = _.omit(req.body, "user");
	data.user = req.user;

	RecipeComment.findOne({recipe: data.recipe, user: data.user}).then(function(com) {
		if (rate) {
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

module.exports = function(pol) {
	var router = require("express").Router();

	var rest = Rest(RecipeComment);

	router.route("/count")
	.get(rest.count);

	router.route("/")
	.get(rest.find)
	.post(pol.isAuthenticated, recipeCommentCreate);

	router.route("/:id")
	.get(rest.findOne)
	.delete(pol.isAuthenticated, recipeCommentDestroy);

	return router;
};
