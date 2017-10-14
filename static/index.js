var text, tokenPositions;
var textElement;

var vowels = /[aeiou]/i;

document.addEventListener('DOMContentLoaded', function() {
  getText();
  getTokenPositions();
  textElement = document.getElementById('text');
  textElement.addEventListener('mouseup', updateSelection);
});

function updateText(newText) {
  if (text !== newText) {
    text = newText;
    refreshData();
  }
}

function updateTokenPositions(newTokenPositions) {
  tokenPositions = newTokenPositions;
  refreshData();
}

function refreshData() {
  if (text !== undefined && tokenPositions !== undefined) {
    while(textElement.firstChild) {
      textElement.removeChild(textElement.firstChild);
    }
    var splitText = tokenize(text);
    var count = 0;
    splitText.forEach((fragment) => {
      var child = document.createTextNode(fragment);
      var isBoundary = getBoundaryPattern().test(fragment);
      if (isBoundary || !~tokenPositions.indexOf(count)) {
        textElement.appendChild(child);
      }
      else {
        var isBaky = vowels.test(fragment[0]);
        var highlighted = document.createElement('span');
        highlighted.className = 'highlighted ' + (isBaky ? 'baky' : 'kola');
        highlighted.setAttribute('data-tokenPosition', count);
        if (isBaky) {
          highlighted.setAttribute('aria-label', 'Baky');
        }
        else {
          highlighted.setAttribute('aria-label', 'Kola');
        }
        highlighted.onclick = removeClickedToken;
        highlighted.appendChild(child);
        textElement.appendChild(highlighted);
      }
      if (!isBoundary) {
        count++;
      }
    });
  }
}

function removeClickedToken(e) {
  var tokenPosition = Number(e.currentTarget.getAttribute('data-tokenPosition'));
  removeTokenPosition(tokenPosition);
}

function updateSelection() {
  var selection = window.getSelection();

  if (
    selection.anchorNode.parentNode === textElement &&
    (
      selection.anchorOffset !== selection.focusOffset ||
      selection.anchorNode !== selection.focusNode
    )
  ) {
    var childReached = false;
    var desiredTokenPosition = Array
      .from(selection.anchorNode.parentNode.childNodes)
      .filter((child) => !getBoundaryPattern().test(child.textContent))
      .indexOf(selection.anchorNode)
    ;
    addTokenPosition(desiredTokenPosition);
  }
}

function getText() {
  return fetch('/api/getText')
    .then((res) => res.json())
    .then((res) => res.text)
    .then(updateText)
  ;
}

function getTokenPositions() {
  return fetch('/api/getTokenPositions')
    .then((res) => res.json())
    .then((res) => res.tokenPositions)
    .then(updateTokenPositions)
  ;
}

function addTokenPosition(desiredTokenPosition) {
  return fetch('/api/addTokenPosition', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      tokenPosition: desiredTokenPosition
    })
  })
  .then((res) => res.json())
  .then((res) => res.tokenPositions)
  .then(updateTokenPositions);
}

function removeTokenPosition(desiredTokenPosition) {
  return fetch('/api/removeTokenPosition', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      tokenPosition: desiredTokenPosition
    })
  })
  .then((res) => res.json())
  .then((res) => res.tokenPositions)
  .then(updateTokenPositions);
}