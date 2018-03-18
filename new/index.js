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

$('#hire-btn').on('click', function (event) {
    event.preventDefault();
    var block = $('#scroll-to').offset().top;
    $('body,html').animate({ scrollTop: block }, 1000);
 });

createDownArrowRight();
window.addEventListener('resize', createDownArrowRight);
