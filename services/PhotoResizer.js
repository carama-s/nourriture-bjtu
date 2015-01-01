module.exports = function(cb) {
  cb(null, function(photo, width, height) {
    if (photo) {
      var img_path = photo.real_path();
      gm(img_path).size(function(err, size) {
        if (err) return;
        var new_size = undefined;
        if (size.height >= size.width && size.width > width) new_size = {width: width};
        else if (size.height < size.width && size.height > height) new_size = {height: height};
        if (new_size !== undefined) {
          gm(img_path).resize(new_size.width, new_size.height).write(img_path, function(err) {
            if (err) console.error("Error resize photo of ingredient", err);
          });
        }
      });
    }
  });
};
