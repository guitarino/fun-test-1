var tokenize = require('./static/tokenize').tokenize;
var getBoundaryPattern = require('./static/tokenize').getBoundaryPattern;

function validateTokenSelection(text, tokenPosition) {
  var splitText = tokenize(text)
    .filter((fragment) => !getBoundaryPattern().test(fragment))
  ;
  if (splitText[tokenPosition]) {
    return tokenPosition;
  }
  else {
    return null;
  }
}

module.exports = validateTokenSelection;