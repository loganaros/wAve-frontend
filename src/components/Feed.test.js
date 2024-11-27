// src/components/Feed.test.js

import React from 'react';
import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/react';
import axios from 'axios';
import Feed from './Feed';

// Mock axios to control its behavior during tests
jest.mock('axios');

describe('Feed Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders loading message initially', () => {
    render(<Feed />);
    expect(screen.getByText(/Loading posts.../i)).toBeInTheDocument();
  });

  test('renders posts after successful fetch', async () => {
    const posts = [
      {
        id: 1,
        username: 'testuser1',
        song_id: '123',
        caption: 'This is a test caption 1',
      },
      {
        id: 2,
        username: 'testuser2',
        song_id: '456',
        caption: 'This is a test caption 2',
      },
    ];
    
    axios.get.mockResolvedValueOnce({ data: posts });

    render(<Feed />);

    await waitFor(() => {
      expect(screen.getByText('@testuser1')).toBeInTheDocument();
      expect(screen.getByText('This is a test caption 1')).toBeInTheDocument();
      expect(screen.getByText('@testuser2')).toBeInTheDocument();
      expect(screen.getByText('This is a test caption 2')).toBeInTheDocument();
    });
  });

  test('displays an error message if fetching posts fails', async () => {
    axios.get.mockRejectedValueOnce({
      response: {
        data: {
          error: 'Error fetching posts',
        },
      },
    });

    render(<Feed />);

    await waitFor(() => {
      expect(screen.getByText('Error fetching posts')).toBeInTheDocument();
    });
  });

  test('renders the NewPostForm component when user is logged in', () => {
    // Set up the localStorage mock
    Storage.prototype.getItem = jest.fn(() => 'mockedToken');

    render(<Feed />);

    expect(screen.getByText('Create a New Post')).toBeInTheDocument();
  });

  test('does not render the NewPostForm component when user is not logged in', () => {
    // Clear localStorage mock
    Storage.prototype.getItem = jest.fn(() => null);

    render(<Feed />);

    expect(screen.queryByText('Create a New Post')).not.toBeInTheDocument();
  });
});
