// Image data for the gallery
// Add or modify images here to update the gallery

export interface Image {
  id: number;
  path: string;
  title: string;
  alt: string;
}

export const images: Image[] = [
  {
    id: 1,
    path: 'images/DSCF6180.webp',
    title: 'Lake Kawaguchiko',
    alt: 'First photography work'
  },
  {
    id: 2,
    path: 'images/DSCF6217.webp',
    title: 'Tenku-no Torii',
    alt: 'Second photography work'
  },
  {
    id: 3,
    path: 'images/DSCF6900.webp',
    title: 'Lake Saiko',
    alt: 'Third photography work'
  },
  {
    id: 4,
    path: 'images/DSCF6934.webp',
    title: 'Kawaguchiko Music Forest',
    alt: 'Fourth photography work'
  }
];
