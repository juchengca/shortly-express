const models = require('../models');
const Promise = require('bluebird');

module.exports.createSession = (req, res, next) => {
  if (!req.hasOwnProperty('cookies')) {
    req.cookies = {};
    res.cookies = {};
  }

  if (Object.keys(req.cookies).length === 0) {
    return models.Sessions.create()
      .then(data => {
        return models.Sessions.get({id: data.insertId});
      })
      .then(user => {
        req.session = user;
        res.cookie('shortlyid', user.hash);
        return models.Sessions.update({id: user.id}, {userId: req.session.id});
      })
      .then(update => {
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
              // var shortlyid = {value: user.hash};
              // res.cookies['shortlyid'] = shortlyid;
              models.Sessions.update({userId: req.session.id});
              res.cookie('shortlyid', user.hash);
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
