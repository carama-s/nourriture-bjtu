function searchView(req, res, next) {
	var mapping = {"recipe": recipeSearch, "ingredient": ingredientSearch};
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
		return Ingredient.find(where).populate("photo").then(function(ings) {
			var results = _.map(ings, function(ing) {
				var nb = _.filter(search, function(word) {
					return (ing.name.toLowerCase().indexOf(word) >= 0);
				}).length;
				return {data: ing, what: "ingredient", weight: nb};
			});
			return {total: {total: results.length, name: "ingredient"}, data: results};
		});
	}

	function recipeSearch() {
		var where = {or: _.map(search, function(e) {
			return {name: {contains: e}};
		})};
		return Recipe.find(where).populate("photo").then(function(recipes) {
			var results = _.map(recipes, function(rec) {
				var nb = _.filter(search, function(word) {
					return (rec.name.toLowerCase().indexOf(word) >= 0);
				}).length;
				return {data: rec, what: "recipe", weight: nb};
			});
			return {total: {value: results.length, name: "recipe"}, data: results};
		});
	}

	var actions = _.map(what, function(w) {return mapping[w]();});
	Q.all(actions).then(function(results) {
		var parser = ReqParser(req);
		var limit = parser.limit();
		var skip = parser.skip();
		var data = _(results).pluck("data").flatten().sortBy("weight").value();
		var total = _(results).pluck("total").reduce(function(acc, curr) {
			acc[curr.name] = curr.value;
			acc.all += curr.value;
			return acc;
		}, {all: 0});
		if (skip) data = data.slice(skip);
		if (limit) data = data.slice(0, limit);
		res.json({results: data, total: total});
	}, next);
}

module.exports = function(pol) {
	var router = require("express").Router();

	router.route("/search").get(searchView);

	return router;
};
