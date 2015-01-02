function recipeRateCreate(req, res, next) {
	var data = _.omit(req.body, "user");
	data.user = req.user;

	RecipeRate.create(data).then(function(com) {
		APP.dbEvent(RecipeRate, "create", com, req.user);
		res.json(com);
	}, ValCb(res, next));
}

function recipeRateDestroy(req, res, next) {
	RecipeRate.destroy({id: req.params.id, user: req.user.id}).then(function(entries) {
		if (entries.length == 0) return res.json({});
		APP.dbEvent(RecipeRate, "destroy", entries[0], req.user);
		res.json(entries[0]);
	}, next);
}

module.exports = function(pol) {
	var router = require("express").Router();

	var rest = Rest(RecipeRate);

	router.route("/count")
	.get(rest.count);

	router.route("/")
	.get(rest.find)
	.post(pol.isAuthenticated, recipeRateCreate);

	router.route("/:id")
	.get(rest.findOne)
	.delete(pol.isAuthenticated, recipeRateDestroy);

	return router;
};
