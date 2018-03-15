function insertAfter(elem, refElem) {
  var parent = refElem.parentNode;
  var next = refElem.nextSibling;
  if (next) return parent.insertBefore(elem, next);
  return parent.appendChild(elem);
}

function createDownArrowRight() {
  var parent = document.querySelector('.arrow-wrap-right');
  var arrow = document.querySelector('.arrow-down-right');
  if (arrow) arrow.parentElement.removeChild(arrow);

  var element = document.createElement('div');
  element.classList.add('arrow-down-right');

  var borderWidth = parseInt(document.documentElement.clientWidth);
  element.style.borderLeftWidth = borderWidth + 'px';
  insertAfter(element, parent);
}

document.getElementById('hire-btn').addEventListener('click', () => {
  document.getElementById('scroll-to').scrollIntoView({ behavior: 'smooth' });
});

createDownArrowRight();
window.addEventListener('resize', createDownArrowRight);
