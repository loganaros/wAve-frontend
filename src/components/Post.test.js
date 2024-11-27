// src/components/Post.test.js

import React from 'react';
import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Post from './Post';

// Mock the Comments component to avoid deep rendering
jest.mock('./Comments', () => () => <div data-testid="comments-component">Comments Section</div>);

// Mock the global fetch function
global.fetch = jest.fn();

describe('Post Component', () => {
  const mockProps = {
    username: 'testuser',
    postId: 1,
    songId: 'song123',
    caption: 'This is a test caption',
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders the Post component with initial loading state', () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ id: 'song123' }),
    });

    render(<Post {...mockProps} />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  test('displays an error if the API call fails', async () => {
    fetch.mockResolvedValueOnce({
      ok: false,
      status: 404,
      statusText: 'Not Found',
    });

    render(<Post {...mockProps} />);

    await waitFor(() => {
      expect(screen.getByText(/Error: 404 Not Found/)).toBeInTheDocument();
    });
  });

  test('renders the song iframe and post details when data is loaded', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ id: 'song123' }),
    });

    render(<Post {...mockProps} />);

    await waitFor(() => {
      expect(screen.getByText('@testuser')).toBeInTheDocument();
      expect(screen.getByText('This is a test caption')).toBeInTheDocument();
      expect(screen.getByTitle('Spotify track')).toBeInTheDocument();
    });
  });

  test('toggles comments section when the button is clicked', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ id: 'song123' }),
    });

    render(<Post {...mockProps} />);

    // Wait for song data to load
    await waitFor(() => {
      expect(screen.getByText('@testuser')).toBeInTheDocument();
    });

    // Find the comment button and click it to show comments
    const commentButton = screen.getByRole('button', { name: /Comment/i });
    fireEvent.click(commentButton);

    // Verify that the comments section is visible
    expect(screen.getByTestId('comments-component')).toBeInTheDocument();

    // Click the button again to hide comments
    fireEvent.click(commentButton);

    // Verify that the comments section is no longer visible
    expect(screen.queryByTestId('comments-component')).not.toBeInTheDocument();
  });
});
