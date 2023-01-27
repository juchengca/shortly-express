const parseCookies = (req, res, next) => {

  if (!req.headers.hasOwnProperty('cookie')) {
    req.headers.cookie = {};
  } else {
    var sessionCookies = req.headers.cookie;
    var splitCookies = sessionCookies.split(';');

    for (var i = 0; i < splitCookies.length; i++) {
      for (var j = 0; j < splitCookies[i].length; j++) {
        if (splitCookies[i][j] === '=') {
          if (i === 0) {
            req.cookies[splitCookies[i].slice(0, j)] = splitCookies[i].slice(j + 1, splitCookies[i].length);
          } else {
            req.cookies[splitCookies[i].slice(1, j)] = splitCookies[i].slice(j + 1, splitCookies[i].length);
          }
        }
      }
    }
  }
  next();
};

module.exports = parseCookies;