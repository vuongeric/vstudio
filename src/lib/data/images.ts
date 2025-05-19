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
    path: '/DSCF6180.jpg',
    title: 'Lake Kawaguchiko',
    alt: 'First photography work'
  },
  {
    id: 2,
    path: '/DSCF6217.jpg',
    title: 'Tenku-no Torii',
    alt: 'Second photography work'
  },
  {
    id: 3,
    path: '/DSCF6900.jpg',
    title: 'Lake Saiko',
    alt: 'Third photography work'
  },
  {
    id: 4,
    path: '/DSCF6934.jpg',
    title: 'Kawaguchiko Music Forest',
    alt: 'Fourth photography work'
  }
];
