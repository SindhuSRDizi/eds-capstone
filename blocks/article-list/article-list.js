import { createOptimizedPicture } from '../../scripts/aem.js';
import { createUlElement, createLiElement, createDivElement } from '../../utils/helpers.js';

async function createRowDiv(container, row) {
  // Create the li element using the utility function
  const li = createLiElement();

  // Create the image container div
  const imageDiv = createDivElement(['article-card-image']);

  // Create the link that wraps the image
  const imageLink = document.createElement('a');
  imageLink.href = row.path;
  imageLink.title = row.title;

  // Create the optimized picture element
  const optimizedPicture = createOptimizedPicture(row.image, row.title, false, [{ width: '750' }]);

  // Append the optimized picture to the link
  imageLink.appendChild(optimizedPicture);
  imageDiv.appendChild(imageLink);

  // Create the body container div
  const bodyDiv = createDivElement(['article-card-body']);

  // Create the link for the title
  const titleLink = document.createElement('a');
  titleLink.href = row.path;
  titleLink.title = row.title;
  titleLink.textContent = row.title;

  // Create the paragraph for the description
  const description = document.createElement('p');
  description.classList.add('article-paragraph');
  description.textContent = row.description;

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
  const parentDiv = createDivElement(['article-list-container']);

  if (countriesLink) {
    const initialContent = await createDivStructure(countriesLink.href);

    parentDiv.append(initialContent);
    countriesLink.replaceWith(parentDiv);
  }
}
