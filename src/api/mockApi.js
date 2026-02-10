import { mockProducts, mockUser } from './mockData';

export const fetchProducts = () => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(mockProducts);
    }, 1000);
  });
};

export const fetchUser = () => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(mockUser);
    }, 500);
  });
};