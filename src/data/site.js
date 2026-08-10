import { page } from '../utils/paths.js';

export const navigation = [
  { href: page('/'), label: 'Domů' },
  { href: page('/o-nas'), label: 'O nás' },
  { href: page('/akce'), label: 'Akce' },
  { href: page('/galerie'), label: 'Galerie' },
  { href: page('/kontakt'), label: 'Kontakt' },
];

export const siteLocation = 'Mohelnice · Česká republika';

// Kontaktní e-mail — jediný zdroj pravdy (patička, kontakt, JSON-LD).
export const contactEmail = 'heretikmohelnice@gmail.com';

export const socialLinks = [
  {
    id: 'facebook',
    name: 'Facebook',
    href: 'https://www.facebook.com/Heretik2020/',
    handle: 'facebook.com/Heretik2020',
    ariaLabel: 'Facebook — SHŠ Heretik',
  },
  {
    id: 'instagram',
    name: 'Instagram',
    href: 'https://www.instagram.com/heretik_z.s._/',
    handle: '@heretik_z.s._',
    ariaLabel: 'Instagram — SHŠ Heretik',
  },
];
