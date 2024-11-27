// src/App.test.js

import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import App from './App';
import Feed from './components/Feed';
import AuthForm from './components/AuthForm';
import NotFound from './components/NotFound';
import Post from './components/Post';

jest.mock('./components/Feed', () => () => <div>Feed Page</div>);
jest.mock('./components/AuthForm', () => ({ type }) => <div>{type === 'login' ? 'Login Page' : 'Register Page'}</div>);
jest.mock('./components/NotFound', () => () => <div>404 Not Found</div>);
jest.mock('./components/Post', () => ({ postId, username, songId, caption }) => (
  <div>
    <h1>Post Page</h1>
    <p>Post ID: {postId}</p>
    <p>Username: {username}</p>
    <p>Song ID: {songId}</p>
    <p>Caption: {caption}</p>
  </div>
));

global.fetch = jest.fn();

describe('App Component', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders the Feed component for the root path', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>
    );

    expect(screen.getByText('Feed Page')).toBeInTheDocument();
  });

  test('renders the Login component for the /login path', () => {
    render(
      <MemoryRouter initialEntries={['/login']}>
        <App />
      </MemoryRouter>
    );

    expect(screen.getByText('Login Page')).toBeInTheDocument();
  });

  test('renders the Register component for the /register path', () => {
    render(
      <MemoryRouter initialEntries={['/register']}>
        <App />
      </MemoryRouter>
    );

    expect(screen.getByText('Register Page')).toBeInTheDocument();
  });

  test('renders the SinglePostPage component for /posts/:id path', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        id: 1,
        username: 'testuser',
        song_id: 'song123',
        caption: 'This is a test caption',
      }),
    });

    render(
      <MemoryRouter initialEntries={['/posts/1']}>
        <App />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Post Page')).toBeInTheDocument();
    });

    expect(screen.getByText('Post ID: 1')).toBeInTheDocument();
    expect(screen.getByText('Username: testuser')).toBeInTheDocument();
    expect(screen.getByText('Song ID: song123')).toBeInTheDocument();
    expect(screen.getByText('Caption: This is a test caption')).toBeInTheDocument();
  });

  test('renders the NotFound component for an unknown path', () => {
    render(
      <MemoryRouter initialEntries={['/unknown-path']}>
        <App />
      </MemoryRouter>
    );

    expect(screen.getByText('404 Not Found')).toBeInTheDocument();
  });
});
