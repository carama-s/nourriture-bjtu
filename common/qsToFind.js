function qsToFind(model, qs) {
  var ret = model;
  var per_page = 10;
  if (qs.per_page !== undefined) per_page = qs.per_page;
  if (qs.where !== undefined) {
    try {
      ret = ret.find(JSON.parse(qs.where))
    } catch(err) {}
  }
  if (qs.sort !== undefined) {
    var v = qs.sort;
    ret = ret.sort((v.join !== undefined) ? v.join(" ") : v);
  }
  if (qs.populate !== undefined) {
    var v = qs.populate;
    ret = ret.populate((v.join !== undefined) ? v.join(" ") : v);
  }
  if (qs.select !== undefined) {
    var v = qs.select;
    ret = ret.select((v.join !== undefined) ? v.join(" ") : v);
  }
  if (qs.page !== undefined) ret = ret.skip(per_page * qs.page).limit(per_page);
  if (qs.limit !== undefined) ret = ret.limit(qs.limit);
  if (qs.skip !== undefined) ret = ret.skip(qs.skip);
  return ret;
}

module.exports = qsToFind
