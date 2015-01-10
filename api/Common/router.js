function searchView(req, res, next) {
	var all_what = ["recipe", "ingredient"];
	var what = req.query.what;
	if (what === undefined || what === "all") {
		what = all_what;
	} else if (_.contains(all_what, what)) {
		what = [what];
	} else {
		return res.status(400).json({error: "Wrong what."});
	}
	var search = req.query.search;
	if (search === undefined || search.trim().length <= 0) {
		return res.status(400).json({error: "Missing search."});
	}
	search = search.split(" ");

	function mySearch(Model, name) {
		var where = {or: _.map(search, function(e) {
			return {name: {contains: e}};
		})};
		return Model.find(where).populate("photo").then(function(entries) {
			var results = _.map(entries, function(ent) {
				var nb = _.filter(search, function(word) {
					return (ent.name.toLowerCase().indexOf(word) >= 0);
				}).length;
				return {data: ent, what: name, weight: nb};
			});
			return {total: {value: results.length, name: name}, data: results};
		});
	}

	Q.all([mySearch(Recipe, "recipe"), mySearch(Ingredient, "ingredient")]).then(function(results) {
		var parser = ReqParser(req);
		var limit = parser.limit();
		var skip = parser.skip();
		var data = _(results).pluck("data").flatten().filter(function(e) {
			return _.contains(what, e.what);
		}).sortBy("weight").value();
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
