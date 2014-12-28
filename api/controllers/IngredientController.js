/**
 * IngredientController
 *
 * @description :: Server-side logic for managing ingredients
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

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
			if (ing.photo != undefined) {
				ing.photo.change_path(app_path);
				ing.photo.save().then(function(up) {
					fs.move(photo.path, up.real_path(), function(err) {
						if (err) return next(err);
						res.json(ing);
					});
				}, ValCb(res, next));
			} else {
				Upload.create({path: app_path}).then(function(up) {
					fs.move(photo.path, up.real_path(), function(err) {
						if (err) return next(err);
						ing.photo = up;
						ing.save().then(function(ing) {
							res.json(ing);
						}, next)
					});
				}, next);
			}
		}, ValCb(res, next));
	}, next);
}

function categories(req, res, next) {
	res.json(Ingredient.CATEGORIES);
}

function count(req, res, next) {
	CountView(Ingredient)(req, res, next);
}

module.exports = {
	create: ingredientCreate,
	update: ingredientUpdate,
	categories: categories,
	count: count
};
