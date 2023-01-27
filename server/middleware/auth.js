const models = require('../models');
const Promise = require('bluebird');

module.exports.createSession = (req, res, next) => {
  console.log(req.headers);

  //CHECKING COOKIES IN 2 PLACES?

  if (!req.hasOwnProperty('cookies')) {
    return models.Sessions.create()
      .then(data => {
        return models.Sessions.get({id: data.insertId});
      })
      .then(user => {
        console.log('tu', user);
        req.session = user;
        var shortlyid = {value: user.hash};
        res.cookies['shortlyid'] = shortlyid;
        next();
      })
      .error(error => {
        res.status(500).send(error);
      });
  } else {
    return models.Sessions.get({hash: req.cookies['shortlyid']})
      .then(data => {
        if (data) {
          req.session = data;
          next();
        } else {
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
      })
      .error(error => {
        res.status(500).send(error);
      });
  }
};

/************************************************************/
// Add additional authentication middleware functions below
/************************************************************/

