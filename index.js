var express = require('express');
var path = require('path');
var port = 3000;
var tokenPositions = [];
var text = require('./text');
var bodyParser = require('body-parser');
var validateTokenSelection = require('./validateTokenSelection');

var app = express();

app.use('/', express.static(path.join(__dirname, 'static')));

app.get('/api/getTokenPositions', function(req, res) {
  res.json({ tokenPositions: tokenPositions });
});

app.use('/api/addTokenPosition', bodyParser.json());

app.post('/api/addTokenPosition', function(req, res) {
  if (req && 'body' in req && 'tokenPosition' in req.body) {
    var tokenPosition = validateTokenSelection(text, req.body.tokenPosition);
    if (tokenPosition !== null && !~tokenPositions.indexOf(tokenPosition)) {
      tokenPositions.push(tokenPosition);
    }
    res.json({ tokenPositions: tokenPositions });
  }
  else {
    res.json({ error: 'Error: token not provided' });
  }
});

app.use('/api/removeTokenPosition', bodyParser.json());

app.post('/api/removeTokenPosition', function(req, res) {
  if (req && 'body' in req && 'tokenPosition' in req.body) {
    var tokenPosition = validateTokenSelection(text, req.body.tokenPosition);
    if (tokenPosition !== null) {
      var index = tokenPositions.indexOf(tokenPosition);
      if (~index) {
        tokenPositions.splice(index, 1);
      }
    }
    res.json({ tokenPositions: tokenPositions });
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