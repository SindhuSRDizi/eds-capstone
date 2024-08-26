import { createOptimizedPicture } from '../../scripts/aem.js';

export default function decorate(block) {
  /* change to ul, li */
  const ul = document.createElement('ul');
  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    while (row.firstElementChild) li.append(row.firstElementChild);
    [...li.children].forEach((div) => {
      if (div.children.length === 1 && div.querySelector('picture')) {
        div.className = 'cards-card-image';
      } else {
        div.className = 'cards-card-body';
      }
    });
    ul.append(li);
  });
  ul.querySelectorAll('picture > img').forEach((img) => img.closest('picture').replaceWith(createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }])));
  ul.querySelectorAll('.cards-card-body .button-container a').forEach(
    (a, index) => {
      const picture = ul.querySelectorAll('picture')[index];
      if (picture) {
        const link = a.cloneNode(true);
        link.textContent = '';
        picture.parentNode.insertBefore(link, picture);
        link.appendChild(picture);
      }
    },
  );
  ul.querySelectorAll('.cards-card-body').forEach((container) => {
    const paragraphs = container.querySelectorAll('p');
    if (paragraphs.length >= 2) {
      paragraphs[1].classList.add('card-paragraph'); // Adds 'new-class' to the second <p>
    }
  });
  block.textContent = '';
  block.append(ul);
}
