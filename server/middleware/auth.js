const models = require('../models');
const Promise = require('bluebird');

module.exports.createSession = (req, res, next) => {
  //Access Parsed Cookies
  //Compare User Data to Parsed Cookies?
  //Assign Object to Session Property on the Request that contains user info
  //What user info do we store
  //no cookies request should generate session with unique hash

  if (Object.keys(req.cookies).length === 0) {
    return models.Sessions.create()
      .then(data => {
        return models.Sessions.get({id: data.insertId});
      })
      .then(user => {
        req.session = user;
        var shortlyid = {value: user.hash};
        res.cookies['shortlyid'] = shortlyid;
        next();
      })
      .error(error => {
        res.status(500).send(error);
      });
  }
};

/************************************************************/
// Add additional authentication middleware functions below
/************************************************************/

