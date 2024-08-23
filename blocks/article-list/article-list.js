import { createOptimizedPicture } from '../../scripts/aem.js';

async function createRowDiv(container, row) {
  // Create the li element
  const li = document.createElement('li');

  // Create the image container div
  const imageDiv = document.createElement('div');
  imageDiv.classList.add('cards-card-image');

  // Create the link that wraps the image
  const imageLink = document.createElement('a');
  imageLink.href = row.url;
  imageLink.title = row.title;
//   imageLink.classList.add('button');

  // Create the optimized picture element
  const optimizedPicture = createOptimizedPicture(row.image, row.title, false, [{ width: '750' }]);

  // Append the optimized picture to the link
  imageLink.appendChild(optimizedPicture);
  imageDiv.appendChild(imageLink);

  // Create the body container div
  const bodyDiv = document.createElement('div');
  bodyDiv.classList.add('cards-card-body');

  // Create the link for the title
  const titleLink = document.createElement('a');
  titleLink.href = row.url;
  titleLink.title = row.title;
  titleLink.classList.add('button');
  titleLink.textContent = row.title;

  // Create the paragraph for the description
  const description = document.createElement('p');
  description.classList.add('card-paragraph');
  description.textContent = row.description;

  bodyDiv.appendChild(titleLink);
  bodyDiv.appendChild(description);

  // Append the image and body divs to the li
  li.appendChild(imageDiv);
  li.appendChild(bodyDiv);

  // Append the li to the container (ul)
  container.appendChild(li);
}

async function createDivStructure(jsonURL) {
  const url = new URL(jsonURL);
  const resp = await fetch(url);
  const json = await resp.json();

  const ul = document.createElement('ul');
  json.data.forEach((row) => {
    createRowDiv(ul, row);
  });

  return ul;
}

export default async function decorate(block) {
  const dataLink = block.querySelector('a[href$=".json"]');
  const parentDiv = document.createElement('div');
  parentDiv.classList.add('articlelist-block');

  if (dataLink) {
    const initialContent = await createDivStructure(dataLink.href);

    parentDiv.append(initialContent);
    dataLink.replaceWith(parentDiv);
  }
}
