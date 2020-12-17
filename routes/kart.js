var express = require('express');
var router = express.Router();
var fs = require('fs');

// let cmd = "./bin/start.sh";

// var child_process = require('child_process');
// var child = child_process.spawn(cmd);

// child.stdin.setEncoding('utf8');

// child.stdout.on('data', function (data) {
//   console.log('data' + data);
// });

// child.stderr.on('data', function (data) {
//   console.log('test: ' + data);
// });

// child.on('close', function (code) {
//   console.log("IM HERE");
//   console.log("close");
// });

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/start', (req, res, next) => 
{

})

module.exports = router;
