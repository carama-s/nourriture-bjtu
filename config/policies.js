/**
 * Policy Mappings
 * (sails.config.policies)
 *
 * Policies are simple functions which run **before** your controllers.
 * You can apply one or more policies to a given controller, or protect
 * its actions individually.
 *
 * Any policy file (e.g. `api/policies/authenticated.js`) can be accessed
 * below by its filename, minus the extension, (e.g. "authenticated")
 *
 * For more information on how policies work, see:
 * http://sailsjs.org/#/documentation/concepts/Policies
 *
 * For more information on configuring policies, check out:
 * http://sailsjs.org/#/documentation/reference/sails.config/sails.config.policies.html
 */


module.exports.policies = {

  UserController: {
    "*": false,

    signup: true,
    get_token: true,
    me: "isAuthenticated",
    change_passwd: "isAuthenticated",
    update_self: "isAuthenticated",

    find: true,
    findOne: true,
    create: "isSuperAdmin",
    update: "isSuperAdmin",
    delete: "isSuperAdmin",
  },

  IngredientController: {
    "*": false,

    find: true,
    findOne: true,
    create: "isAuthenticated",
    update: "isAuthenticated",
    delete: "isAuthenticated"
  },

  TokenController: {"*": false},
  UploadController: {"*": false},

};
