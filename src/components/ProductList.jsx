import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setProducts, selectProducts } from '../store/slices/productSlice';
import { setLoading, selectLoading, setError, selectError } from '../store/slices/statusSlice';
import { addToCart } from '../store/slices/cartSlice';
import { fetchProducts } from '../api/mockApi';
import t from '../locales/ru.json';

export const ProductList = () => {
  const dispatch = useDispatch();
  const products = useSelector(selectProducts);
  const loading = useSelector(selectLoading);
  const error = useSelector(selectError);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('name');

  useEffect(() => {
    dispatch(setLoading(true));
    dispatch(setError(null)); // Сбрасываем предыдущую ошибку перед новым запросом
    fetchProducts()
      .then(mockProducts => {
        dispatch(setProducts(mockProducts));
      })
      .catch(err => {
        dispatch(setError(t.productList.error));
      })
      .finally(() => {
        dispatch(setLoading(false));
      });
  }, [dispatch]);

  const handleAddToCart = useCallback((product) => {
    dispatch(addToCart(product));
  }, [dispatch]);

  const handleSearchChange = useCallback((e) => {
    setSearchTerm(e.target.value);
  }, []);

  const handleCategoryChange = useCallback((e) => {
    setSelectedCategory(e.target.value);
  }, []);

  const handleSortChange = useCallback((e) => {
    setSortBy(e.target.value);
  }, []);

  const filteredAndSortedProducts = useMemo(() => {
    return products
      .filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
        return matchesSearch && matchesCategory;
      })
      .sort((a, b) => {
        if (sortBy === 'name') return a.name.localeCompare(b.name);
        if (sortBy === 'price') return a.price - b.price;
        return 0;
      });
  }, [products, searchTerm, selectedCategory, sortBy]);

  if (loading) {
    return <div className="loading">{t.productList.loading}</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="product-list">
      <div className="filters">
        <div className="search">
          <input
            type="text"
            placeholder={t.productList.searchPlaceholder}
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>

        <div className="filter-controls">
          <select value={selectedCategory} onChange={handleCategoryChange}>
            <option value="all">{t.productList.categories.all}</option>
            <option value="phones">{t.productList.categories.phones}</option>
            <option value="laptops">{t.productList.categories.laptops}</option>
            <option value="tablets">{t.productList.categories.tablets}</option>
          </select>

          <select value={sortBy} onChange={handleSortChange}>
            <option value="name">{t.productList.sortBy.name}</option>
            <option value="price">{t.productList.sortBy.price}</option>
          </select>
        </div>
      </div>

      <div className="products">
        {filteredAndSortedProducts.map(product => (
          <div key={product.id} className="product-card">
            <img src={product.image} alt={product.name} />
            <h3>{product.name}</h3>
            <p>{product.description}</p>
            <div className="price">${product.price}</div>
            <button
              onClick={() => handleAddToCart(product)}
            >
              {t.productList.addToCart}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};