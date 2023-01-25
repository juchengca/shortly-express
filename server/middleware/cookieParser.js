const parseCookies = (req, res, next) => {
  console.log('cooks', req.headers.cookie);
  var sessionCookies = req.headers.cookie;

  if (!sessionCookies) {
    return {};
  }

//fix object storage / extra spaces

  var splitCookies = sessionCookies.split(';');
  console.log(splitCookies);
  for (var i = 0; i < splitCookies.length; i++) {
    for (var j = 0; j < splitCookies[i].length; j++) {
      if (splitCookies[i][j] === '=') {
        req.cookies[splitCookies[i].slice(0, j)] = splitCookies[i].slice(j, splitCookies[i].length - 1);
      }
    }
  }
  console.log('rc', req.cookies)
};

module.exports = parseCookies;