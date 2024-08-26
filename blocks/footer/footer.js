import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

/**
 * loads and decorates the footer
 * @param {Element} block The footer block element
 */
export default async function decorate(block) {
  // load footer as fragment
  const footerMeta = getMetadata('footer');
  const footerPath = footerMeta
    ? new URL(footerMeta, window.location).pathname
    : '/footer';
  const fragment = await loadFragment(footerPath);

  // decorate footer DOM
  block.textContent = '';
  const footer = document.createElement('div');
  while (fragment.firstElementChild) footer.append(fragment.firstElementChild);

  const classes = ['sections'];
  classes.forEach((c, i) => {
    const section = footer.children[i];
    if (section) section.classList.add(`footer-nav-${c}`);
  });

  const footerNav = footer.querySelector('.footer-nav-sections');
  if (footerNav) {
    const brandImage = document.createElement('img');
    const brandLogoLink = document.createElement('a');
    brandImage.src = '../../img/wknd-logo-light.svg';
    brandImage.alt = 'Brand Logo';
    brandLogoLink.href = '/us/en';
    footerNav.prepend(brandImage);
    brandLogoLink.appendChild(brandImage);
    brandImage.classList.add('footer-logo-img');
    brandLogoLink.classList.add('footer-logo-link');
    footerNav.prepend(brandLogoLink);
    footer.prepend(footerNav);
  }

  block.append(footer);
}
