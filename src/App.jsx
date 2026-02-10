import React from 'react';

import { Header } from './components/Header';
import { ProductList } from './components/ProductList';
import { Cart } from './components/Cart';

export const App = () => {
  return (
    <div className="app">
      <Header />
      <div className="main-content">
        <ProductList />
        <Cart />
      </div>
    </div>
  );
};