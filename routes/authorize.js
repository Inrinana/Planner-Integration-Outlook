var express = require('express');
var router = express.Router();
var authHelper = require('../helpers/auth');

/* GET /authorize. */
router.get('/', async function(req, res, next) {
    // Get auth code
    const code = req.query.code;
    // If code is present, use it
    
    if (code) {
      let token;
      try {
        token = await authHelper.getTokenFromCode(code, res);
        req.session.userId = response.account.homeAccountId;

      const user = await graph.getUserDetails(response.accessToken);

      // Add the user to user storage
      req.app.locals.users[req.session.userId] = {
        displayName: user.displayName,
        email: user.mail || user.userPrincipalName,
        timeZone: user.mailboxSettings.timeZone}
        res.render('index', { title: 'Home', debug: `Access token: ${token}` });
        res.redirect('/')

      } catch (error) { 
        res.render('error', { title: 'Error', message: 'Error exchanging code for token', error: error });
        res.redirect('/authorize')
      }
    } else {
      try {
        token = await authHelper.getAccessToken(code, res);
        res.render('index', { title: 'Home', debug: `Access token: ${token}` });
      // Otherwise complain
    } catch (error) { 
      res.render('error', { title: 'Error', message: 'Authorization error', error: { status: 'Missing code parameter' } });
      res.redirect('/')
    }
  }});

module.exports = router;

