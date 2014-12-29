var fs = require("fs-extra");
var path = require("path");

function parseBodyData(data) {
	_.each(["tags", "allergy", "period"], function(k) {
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

function ingredientCreate(req, res, next) {
	var data = _.omit(req.body, "photo");
	data = parseBodyData(data);

	Ingredient.create(data).then(function(ing) {
		var photo = req.files.photo;
		if (photo === undefined || !isImage(photo)) return res.json(ing);
		var app_path = path.join(Ingredient.PHOTO_URI, path.basename(photo.path));
		Upload.create({path: app_path}).then(function(up) {
			fs.move(photo.path, up.real_path(), function(err) {
				if (err) return next(err);
				ing.photo = up;
				ing.save().then(function(ing) {
					res.json(ing);
				}, next)
			});
		}, next);
	}, ValCb(res, next));
}

function ingredientUpdate(req, res, next) {
	Ingredient.findOneById(req.params.id).populate("photo").then(function(ing) {
		if (ing === undefined) return next("route");
		var data = _.omit(req.body, "photo");
		data = parseBodyData(data);
		_.extend(ing, data);
		ing.save().then(function(ing) {
			var photo = req.files.photo;
			if (photo === undefined || !isImage(photo)) return res.json(ing);
			var app_path = path.join(Ingredient.PHOTO_URI, path.basename(photo.path));

			function setPhoto() {
				return Upload.create({path: app_path}).then(function(up) {
					fs.move(photo.path, up.real_path(), function(err) {
						if (err) return next(err);
						ing.photo = up;
						ing.save().then(function(ing) {
							res.json(ing);
						}, next)
					});
				}, next);
			}

			if (ing.photo === undefined) return setPhoto();
			return ing.photo.destroy().then(function() {
				return setPhoto();
			});
		}, ValCb(res, next));
	}, next);
}

function categories(req, res, next) {
	res.json(Ingredient.CATEGORIES);
}

function ingredientAutocomplete(req, res, next) {
	Ingredient.find({name: {"contains": req.query.name}})
	.limit(10)
	.populate("photo").then(function(ings) {
		ings = _.mapValues(ings, function(ing) {
			if (ing.photo && ing.photo.uri) {
				ing.photo_url = "http://nourriture.dennajort.fr" + ing.photo.uri();
			}
			return ing;
		})
		res.json(ings);
	}, next);
}

module.exports = function(pol) {
	var router = require("express").Router();

	router.route("/categories")
	.get(categories);

	var rest = Rest(Ingredient);

	router.route("/count")
	.get(rest.count);

	router.route("/autocomplete")
	.get(ingredientAutocomplete);

	router.route("/")
	.get(rest.find)
	.post(pol.isAuthenticated, ingredientCreate);

	router.route("/:id")
	.get(rest.findOne)
	.put(pol.isAuthenticated, ingredientUpdate)
	.delete(pol.isAuthenticated, rest.destroy);

	return router;
};
