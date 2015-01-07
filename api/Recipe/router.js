var fs = require("fs-extra");
var path = require("path");

function parseBodyData(data) {
	_.each(["tags", "directions", "ingredients"], function(k) {
		if (data[k] !== undefined) {
			switch (typeof(data[k])) {
			case "array":
				break;
			case "string":
				try {
					data[k] = JSON.parse(data[k]);
				} catch(err) {
					data[k] = undefined;
				}
				break;
			default:
				data[k] = undefined;
			}
		}
	});
	return data;
}

function isImage(file) {
	var mime_regex = /^image\//i;
	return mime_regex.test(file.type);
}

function recipeCreate(req, res, next) {
	var data = _.omit(req.body, "photo");
	data = parseBodyData(data);
	var ingredients = data.ingredients;
	data = _.omit(data, "ingredients");

	function finish(rec) {
		APP.dbEvent(Recipe, "create", rec, req.user);
		return res.json(rec);
	}

	Recipe.create(data).then(function(rec) {
		_.forEach(ingredients, function(ing) {
			ing.recipe = rec.id;
			rec.ingredients.add(ing);
		});
		return rec.save().then(function(rec) {
			var photo = req.files.photo;
			if (photo === undefined || !isImage(photo)) return finish(rec);
			var app_path = path.join(Recipe.PHOTO_URI, path.basename(photo.path));
			return Upload.create({path: app_path}).then(function(up) {
				fs.move(photo.path, up.real_path(), function(err) {
					if (err) return next(err);
					rec.photo = up;
					rec.save().then(function(rec) {
						finish(rec);
					}, next)
				});
			});
		})
		.then(null, next);
	}, ValCb(res, next));
}

function recipeUpdate(req, res, next) {

	function finish(rec) {
		APP.dbEvent(Recipe, "update", rec, req.user);
		return res.json(rec);
	}

	Recipe.findOneById(req.params.id).populate("photo").then(function(ing) {
		if (rec === undefined) return next("route");
		var data = _.omit(req.body, "photo");
		data = parseBodyData(data);
		_.extend(rec, data);
		rec.save().then(function(rec) {
			var photo = req.files.photo;
			if (photo === undefined || !isImage(photo)) return finish(rec);
			var app_path = path.join(Recipe.PHOTO_URI, path.basename(photo.path));

			function setPhoto() {
				return Upload.create({path: app_path}).then(function(up) {
					fs.move(photo.path, up.real_path(), function(err) {
						if (err) return next(err);
						rec.photo = up;
						rec.save().then(function(rec) {
							finish(rec);
						}, next)
					});
				}, next);
			}

			if (rec.photo === undefined) return setPhoto();
			return rec.photo.destroy().then(function() {
				return setPhoto();
			});
		}, ValCb(res, next));
	}, next);
}

function recipeMeanRate(req, res, next) {
	RecipeRate.find({recipe: req.params.id}).then(function(rates) {
		var nb = rates.length;
		if (nb == 0) return res.json({rate: 0});
		var sum = _.reduce(rates, function(acc, val) {
			return acc + val.rate;
		}, 0);
		return res.json({rate: (sum / nb)});
	}, next);
}

function categories(req, res, next) {
	res.json(Recipe.CATEGORIES);
}

module.exports = function(pol) {
	var router = require("express").Router();

	router.route("/categories")
	.get(categories);

	var rest = Rest(Recipe);

	router.route("/count")
	.get(rest.count);

	router.route("/")
	.get(rest.find)
	.post(pol.isAuthenticated, recipeCreate);

	router.route("/:id/rate")
	.get(recipeMeanRate);

	router.route("/:id")
	.get(rest.findOne)
	.put(pol.isAuthenticated, recipeUpdate)
	.delete(pol.isAuthenticated, rest.destroy);

	return router;
};
