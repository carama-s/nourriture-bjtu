function searchView(req, res, next) {
	var mapping = {"ingredient": ingredientSearch, "recipe": recipeSearch};
	var what = req.query.what;
	if (what === undefined) {
		what = _.keys(mapping);
	} else if (_(mapping).keys().contains(what)) {
		what = [what];
	} else {
		return res.status(400).json({error: "Wrong what."});
	}
	var search = req.query.search;
	if (search === undefined || search.trim().length <= 0) {
		return res.status(400).json({error: "Missing search."});
	}
	search = search.split(" ");

	function ingredientSearch() {
		var where = {or: _.map(search, function(e) {
			return {name: {contains: e}};
		})};
		return Ingredient.find(where).then(function(ings) {
			return _.map(ings, function(ing) {
				var nb = _.filter(search, function(word) {
					return (ing.name.toLowerCase().indexOf(word) >= 0);
				}).length;
				return {data: ing, what: "ingredient", weight: nb};
			});
		});
	}

	function recipeSearch() {
		var where = {or: _.map(search, function(e) {
			return {name: {contains: e}};
		})};
		return Recipe.find(where).then(function(recipes) {
			return _.map(recipes, function(rec) {
				var nb = _.filter(search, function(word) {
					return (rec.name.toLowerCase().indexOf(word) >= 0);
				}).length;
				return {data: rec, what: "recipe", weight: nb};
			});
		});
	}

	var actions = _.map(what, function(w) {return mapping[w]();});
	Q.all(actions).then(function(results) {
		var parser = ReqParser(req);
		var limit = parser.limit();
		var skip = parser.skip();
		results = _(results).flatten().sortBy("weight").value();
		var length = results.length;
		if (skip) results = results.slice(skip);
		if (limit) results = results.slice(0, limit);
		res.json({results: results, total: length});
	}, next);
}

module.exports = function(pol) {
	var router = require("express").Router();

	router.route("/search").get(searchView);

	return router;
};
