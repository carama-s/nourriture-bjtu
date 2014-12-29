module.exports = {

  User: {
    signup: true,
    get_token: true,
    me: "isAuthenticated",
    change_passwd: "isAuthenticated",
    update_self: "isAuthenticated",

    find: true,
    findOne: true,
    count: true,
    create: "isSuperAdmin",
    update: "isSuperAdmin",
    destroy: "isSuperAdmin",
  },

  // Ingredient: {
  //   find: true,
  //   findOne: true,
  //   create: "isAuthenticated",
  //   update: "isAuthenticated",
  //   destroy: "isAuthenticated"
  // }

};
