const router = require('express').Router();
const sequelize = require('../db/init.js');
const User = sequelize.import('../models/user.js');
const uuidv4 = require('uuid/v4');
const connect = require('connect-ensure-login');

module.exports = function (passport) {

  router.get('/login',
    function(req, res){
      res.render('login');
    }
  );

  router.post(
    '/login', 
    passport.authenticate('local',
    { failureRedirect: '/auth/invalid-login' }
  ), function(req, res) {
      res.redirect('/profile');
    }
  );

  router.get('/invalid-login', function(req, res){
    console.log("Invaid Login");
    res.send('Invalid Login<br><a href="/login">Login</a>');
  });

  router.get('/logout',
    function(req, res){
      req.logout();
      res.redirect('/login');
    }
  );

  router.get('/profile',
    connect.ensureLoggedIn(),
    function(req, res){
      res.render('profile', { user: req.user });
    }
  );

 return router;
}