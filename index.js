var express = require('express');
var path = require('path');
var port = 3000;
var tokenPosition = null;
var text = require('./text');
var bodyParser = require('body-parser');
var validateTokenSelection = require('./validateTokenSelection');

var app = express();

app.use('/', express.static(path.join(__dirname, 'static')));

app.get('/api/getTokenPosition', function(req, res) {
  res.json({ tokenPosition: tokenPosition });
});

app.use('/api/setTokenPosition', bodyParser.json());

app.post('/api/setTokenPosition', function(req, res) {
  if (req && 'body' in req && 'tokenPosition' in req.body) {
    tokenPosition = validateTokenSelection(text, req.body.tokenPosition);
    res.json({ tokenPosition: tokenPosition });
  }
  else {
    res.json({ error: 'Error: token not provided' });
  }
});

app.get('/api/getText', function(req, res) {
  res.json({ text: text });
});

app.listen(3000, function () {
  console.log(`App listening on port ${port}`)
});