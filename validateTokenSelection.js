function validateTokenSelection(text, tokenPosition) {
  if (tokenPosition >= 0 || tokenPosition < text.length) {
    return tokenPosition;
  }
  else {
    return null;
  }
}

module.exports = validateTokenSelection;