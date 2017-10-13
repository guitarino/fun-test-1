var text, tokenPosition;
var textElement;

document.addEventListener('DOMContentLoaded', function() {
  getText().then(updateText);
  getTokenPosition().then(updateTokenPosition);
  textElement = document.getElementById('text');
  textElement.addEventListener('mouseup', updateSelection);
});

function updateText(newText) {
  if (text !== newText) {
    text = newText;
    refreshData();
  }
}

function updateTokenPosition(newTokenPosition) {
  if (tokenPosition !== newTokenPosition) {
    tokenPosition = newTokenPosition;
    refreshData();
  }
}

var tokenBoundary = /([\s,.])/;

function refreshData() {
  if (text !== undefined && tokenPosition !== undefined) {
    while(textElement.firstChild) {
      textElement.removeChild(textElement.firstChild);
    }
    if (tokenPosition !== null) {
      var strBefore = text.substring(0, tokenPosition);
      var strAfter = text.substring(tokenPosition);
      var arrBefore = strBefore.split(tokenBoundary);
      var arrAfter = strAfter.split(tokenBoundary);
      textElement.appendChild(document.createTextNode(arrBefore.reduce((val, curVal, i) => {
        if (arrBefore.length-1 !== i) {
          val += curVal;
        }
        return val;
      }, '')));
      var highlighted = document.createElement('span');
      highlighted.className = 'highlighted';
      highlighted.appendChild(document.createTextNode(arrBefore[arrBefore.length-1] + arrAfter[0]));
      textElement.appendChild(highlighted);
      textElement.appendChild(document.createTextNode(arrAfter.reduce((val, curVal, i) => {
        if (0 !== i) {
          val += curVal;
        }
        return val;
      }, '')));
    }
    else {
      textElement.appendChild(document.createTextNode(text));
    }
  }
}

function updateSelection() {
  var selection = window.getSelection();

  if (
    selection.anchorNode.parentNode === textElement &&
    (
      selection.anchorOffset !== selection.focusOffset ||
      selection.anchorNode !== selection.anchorNode
    )
  ) {
    var childReached = false;
    var desiredTokenPosition = Array
      .from(selection.anchorNode.parentNode.childNodes)
      .reduce((len, child) => {
        if (!childReached && child !== selection.anchorNode) {
          len += child.textContent.length;
        }
        else {
          childReached = true;
        }
        return len;
      }, 0)
    ;
    desiredTokenPosition += selection.anchorOffset;
    setTokenPosition(desiredTokenPosition);
  }
}

function getText() {
  return fetch('/api/getText')
    .then((res) => res.json())
    .then((res) => res.text)
  ;
}

function getTokenPosition() {
  return fetch('/api/getTokenPosition')
    .then((res) => res.json())
    .then((res) => res.tokenPosition)
  ;
}

function setTokenPosition(desiredTokenPosition) {
  return fetch('/api/setTokenPosition', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      tokenPosition: desiredTokenPosition
    })
  })
  .then((res) => res.json())
  .then((res) => res.tokenPosition)
  .then(updateTokenPosition);
}