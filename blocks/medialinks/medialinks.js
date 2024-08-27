export default function decorate(block) {
  // Select the div with the class 'medialinks'
  const mediaLinksDiv = block.querySelector('p');

  // If the div exists, proceed with adding class names and other operations
  if (mediaLinksDiv) {
    // Select all <a> tags inside the mediaLinksDiv
    const aTags = mediaLinksDiv.querySelectorAll('a');

    // Iterate over each <a> tag
    aTags.forEach((aTag) => {
      // Get the title attribute from the <a> tag
      const title = aTag.getAttribute('title');
      // If the title exists, add a class to the <a> tag using the title
      if (title) {
        // Replace spaces or any special characters in the title for valid class names
        const className = `${title.toLowerCase().replace(/\s+/g, '-')}-link`;
        aTag.classList.add(className);
      }
    });

    // Finally, append the modified mediaLinksDiv back to the block
    block.append(mediaLinksDiv);
  }
}
