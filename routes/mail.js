var express = require('express');
var router = express.Router();
var authHelper = require('../helpers/auth');
require("isomorphic-fetch");
const graph = require('@microsoft/microsoft-graph-client');
var db = require('../db/db_connect');

/* GET /mail */
router.get('/', async function(req, res, next) {
  let parms = { title: 'Inbox', active: { inbox: true } };
    const accessToken = await authHelper.getAccessToken(req.cookies, res);
    const userID = await req.cookies.userID;
    const userName= await req.cookies.graph_user_name;
    var log = req.query.pass

if (log=='no') {
  res.clearCookie('userID', {httpOnly: true});
  res.status(200).json({message: "OK"});
} else {
    if (accessToken && userID) {
      // Initialize Graph client
      let client;
      try {
        client = graph.Client.init({
        authProvider: (done) => {
          done(null, accessToken);
        }
      });
    } catch(e) {
      console.log(e);
    }
      try {
        // Get the unseen messages from inbox
        const result = await client
        .api('/me/mailfolders/inbox')
        .select('unreadItemCount')
        .get()
        var sql = `SELECT pln_title, ins_id, pln_type, date_end FROM public."tblPlan" where  date_end IS NULL AND plan_fkusr = ${userID} OR pln_type = 'Встреча' AND plan_fkusr = ${userID}`;
        parms.unreadItemCount=result.unreadItemCount,
        parms.userName=userName;
        var base = await db.query(sql);
        const finalrows = base.rows;
  // Создаем объект parms и добавляем в него rows и count
        parms.finalrows=finalrows;
        res.render('новый', parms)
      } catch (err) {
        parms.message = 'Error retrieving messages';
        parms.error = { status: `${err.code}: ${err.message}` };
        res.render('error', parms)
      }
    } else if (userID) {
      res.redirect('/')
    } else {
      parms.mess = 'Необходимо авторизироваться'
      res.render('index',parms)
  }}});

  
module.exports = router;