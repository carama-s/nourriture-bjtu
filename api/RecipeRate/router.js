function recipeRateCreate(req, res, next) {
	var data = _.omit(req.body, "user");
	data.user = req.user;

	function finish(rate) {
		APP.dbEvent(RecipeRate, "create", rate, req.user);
		res.json(rate);
	}

	RecipeRate.findOne({recipe: data.recipe. user: data.user}).then(function(rate) {
		if (rate) {
			rate.rate = data.rate;
			return rate.save().then(finish);
		}
		return RecipeRate.create(data).then(finish);
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
