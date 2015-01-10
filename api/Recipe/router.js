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
	var data = _.omit(req.body, "photo", "rate", "nb_rates", "comments", "user");
	data = parseBodyData(data);
	var ingredients = data.ingredients || [];
	data = _.omit(data, "ingredients");
	data.user = req.user;

	function finish(rec) {
		return Recipe.findOne(rec.id).then(function(rec) {
			APP.dbEvent(Recipe, "create", rec, req.user);
			res.json(rec);
		}, next);
	}

	function addPhoto(rec) {
		var photo = req.files.photo;
		if (photo === undefined || !isImage(photo)) return finish(rec);
		var app_path = path.join(Recipe.PHOTO_URI, path.basename(photo.path));
		return Upload.create({path: app_path}).then(function(up) {
			fs.move(photo.path, up.real_path(), function(err) {
				if (err) return next(err);
				return Recipe.update(rec.id, {photo: up.id}).then(function(recs) {
					return finish(recs[0].id);
				}, ValCb(res, next))
			});
		}, ValCb(res, next));
	}

	function addIngredients(rec) {
		if (ingredients.length <= 0) return addPhoto(rec);
		ingredients = _.map(ingredients, function(ing) {
			ing.recipe = rec.id;
			return ing;
		});
		return RecipeIngredient.create(ingredients).then(function() {
			return addPhoto(rec);
		}, ValCb(res, next));
	}

	return Recipe.create(data).then(function(rec) {
		return addIngredients(rec);
	}, ValCb(res, next))
	.then(null, next);
}

function recipeUpdate(req, res, next) {
	var data = _.omit(req.body, "photo", "rate", "nb_rates", "comments", "user");
	data = parseBodyData(data);
	var ingredients = data.ingredients || [];
	data = _.omit(data, "ingredients");
	data.user = req.user;

	function finish(rec) {
		return Recipe.findOne(rec.id).then(function(rec) {
			APP.dbEvent(Recipe, "update", rec, req.user);
			res.json(rec);
		}, next);
	}

	function updatePhoto(rec) {
		var photo = req.files.photo;
		if (photo === undefined || !isImage(photo)) return finish(rec);
		var app_path = path.join(Recipe.PHOTO_URI, path.basename(photo.path));

		function setPhoto() {
			return Upload.create({path: app_path}).then(function(up) {
				fs.move(photo.path, up.real_path(), function(err) {
					if (err) return next(err);
					return Recipe.update(rec.id, {photo: up.id}).then(function(rec) {
						return finish(rec);
					}, ValCb(res, next))
				});
			}, ValCb(res, next));
		}

		if (rec.photo === undefined) return setPhoto();
		return Upload.destroy(rec.photo).then(setPhoto);
	}

	function updateIngredients(rec) {
		if (ingredients.length <= 0) return updatePhoto(rec);
		ingredients = _.map(ingredients, function(ing) {
			ing.recipe = rec.id;
			return ing;
		});
		return RecipeIngredient.destroy({recipe: rec.id}).then(function() {
			return RecipeIngredient.create(ingredients).then(function() {
				return updatePhoto(rec);
			}, ValCb(res, next));
		});
	}

	Recipe.update(req.params.id, data).then(function(recs) {
		if (recs.length <= 0) return next("route");
		return updateIngredients(recs[0].id);
	}, ValCb(res, next))
	.then(null, next);
}

function recipeMyComment(req, res, next) {
	RecipeComment.findOne({user: req.user.id, recipe: req.params.id}).then(function(com) {
		if (!com) return res.json({});
		return res.json(com);
	}, next);
}

function categories(req, res, next) {
	res.json(Recipe.CATEGORIES);
}

module.exports = function(pol, prefix) {
	APP.swag.addDefinition({
		"recipeIngredientModel": {
			"properties": {
				"ingredient": {"type": "string"},
				"recipe": {"type": "string"},
				"quantity": {"type": "string"}
			}
		},
		"recipeModel": {
			"required": ["name", "category", "servings", "preparation_time", "cooking_time"],
			"properties": {
				"name": {"type": "string"},
				"tags": {"type": "array", "items": {"type": "string"}},
				"description": {"type": "string"},
				"category": {"type": "string", "enum": _.pluck(Recipe.CATEGORIES, "value"), "default": "other"},
				"servings": {"type": "integer"},
				"preparation_time": {"type": "integer"},
				"cooking_time": {"type": "integer"},
				"ingredients": {"type": "array", "items": {"$ref": "#/definitions/recipeIngredientModel"}},
				"comments": {"type": "array", "items": {"type": "string"}},
				"rates": {"type": "array", "items": {"type": "string"}},
				"rate": {"type": "float", "default": 0},
				"nb_rates": {"type": "integer", "default": 0},
				"directions": {"type": "array", "items": {"type": "string"}}
			}
		}
	});

	var swag = APP.swag.handlerPaths(prefix, ["Recipe"]);
	var router = require("express").Router();

	router.route("/categories")
	.get(categories);

	var rest = Rest(Recipe);

	router.route("/count")
	.get(rest.count);
	rest.swagCount(swag, "countRecipe");

	router.route("/")
	.get(rest.find)
	.post(pol.isAuthenticated, recipeCreate);
	rest.swagFind(swag, "findRecipe", "#/definitions/recipeModel");

	router.route("/:id/my_comment")
	.get(pol.isAuthenticated, recipeMyComment);

	router.route("/:id")
	.get(rest.findOne)
	.put(pol.isAuthenticated, recipeUpdate)
	.delete(pol.isAuthenticated, rest.destroy);
	rest.swagFindOne(swag, "findOneRecipe", "#/definitions/recipeModel");

	return router;
};
