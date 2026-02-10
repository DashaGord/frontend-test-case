import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectUser, setUser } from '../store/slices/userSlice';
import { fetchUser } from '../api/mockApi';
import t from '../locales/ru.json';

export const Header = () => {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);

  useEffect(() => {
    fetchUser().then(userData => {
      dispatch(setUser(userData));
    });
  }, [dispatch]);

  return (
    <header className="header">
      <h1>{t.header.title}</h1>
      <div className="user-info">
        {user ? (
          <span>{t.header.greeting.replace('%USER_NAME%', user.name)}</span>
        ) : (
          <span>{t.header.loading}</span>
        )}
      </div>
    </header>
  );
};