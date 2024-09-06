import { createOptimizedPicture } from '../../scripts/aem.js';
import { createUlElement, createLiElement, createDivElement, createElement } from '../../utils/helper.js'; // Assuming createElement is defined in the helper.js

async function createRowDiv(container, row) {
  // Create the li element using the utility function
  const li = createLiElement();

  // Create the image container div using the createElement utility
  const imageDiv = createElement('div', { classList: ['article-card-image'] });

  // Create the link that wraps the image
  const imageLink = createElement('a', { attributes: { href: row.path, title: row.title } });

  // Create the optimized picture element
  const optimizedPicture = createOptimizedPicture(row.image, row.title, false, [{ width: '750' }]);

  // Append the optimized picture to the link
  imageLink.appendChild(optimizedPicture);
  imageDiv.appendChild(imageLink);

  // Create the body container div using the createElement utility
  const bodyDiv = createElement('div', { classList: ['article-card-body'] });

  // Create the link for the title
  const titleLink = createElement('a', { attributes: { href: row.path, title: row.title }, text: row.title });

  // Create the paragraph for the description using the createElement utility
  const description = createElement('p', { classList: ['article-paragraph'], text: row.description });

  // Append title link and description to body div
  bodyDiv.appendChild(titleLink);
  bodyDiv.appendChild(description);

  // Append image and body divs to the li
  li.appendChild(imageDiv);
  li.appendChild(bodyDiv);

  // Append the li to the container (ul)
  container.appendChild(li);
}

async function createDivStructure(jsonURL) {
  const url = new URL(jsonURL);
  const resp = await fetch(url);
  const json = await resp.json();

  // Create ul element using the utility function
  const ul = createUlElement();

  const filteredData = json.data.filter((row) => row.template === 'Magazine');

  filteredData.forEach((row) => {
    createRowDiv(ul, row);
  });

  return ul;
}

export default async function decorate(block) {
  const countriesLink = block.querySelector('a[href$=".json"]');
  const parentDiv = createElement('div', { classList: ['article-list-container'] });

  if (countriesLink) {
    const initialContent = await createDivStructure(countriesLink.href);

    parentDiv.append(initialContent);
    countriesLink.replaceWith(parentDiv);
  }
}

/**
 * Creates a new element with specified options
 * @param {string} tag The type of element to create
 * @param {Object} options Options for creating the element
 * @returns {Element} The newly created element
 */
export function createElement(tag, options = {}) {
  const element = document.createElement(tag);

  if (options.attributes) {
    Object.keys(options.attributes).forEach((attr) => {
      element.setAttribute(attr, options.attributes[attr]);
    });
  }

  if (options.classList) {
    element.classList.add(...options.classList);
  }

  if (options.styles) {
    Object.assign(element.style, options.styles);
  }

  if (options.text) {
    element.textContent = options.text;
  } else if (options.html) {
    element.innerHTML = options.html;
  }

  if (options.children) {
    options.children.forEach((child) => {
      element.appendChild(child);
    });
  }

  return element;
}
