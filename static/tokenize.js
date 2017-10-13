function tokenize(text) {
  return text.split(getBoundaryPattern());
}

function getBoundaryPattern() {
  return /([\s,.])/;
}

try {
  module.exports = {
    tokenize: tokenize,
    getBoundaryPattern: getBoundaryPattern
  };
}
catch(oops) { }