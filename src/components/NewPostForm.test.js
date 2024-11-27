// src/components/NewPostForm.test.js

import React from 'react';
import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import axios from 'axios';
import { BrowserRouter } from 'react-router-dom';
import NewPostForm from './NewPostForm';

// Mock axios to control behavior during tests
jest.mock('axios');

describe('NewPostForm Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders the NewPostForm component with initial values', () => {
    render(
      <BrowserRouter>
        <NewPostForm />
      </BrowserRouter>
    );

    expect(screen.getByText('Create a New Post')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Search for a song...')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Write a caption...')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Post' })).toBeInTheDocument();
  });

  test('handles song search input change', async () => {
    axios.get.mockResolvedValueOnce({
      data: {
        tracks: {
          items: [
            {
              id: '1',
              name: 'Song A',
              artists: [{ name: 'Artist A' }],
              album: {
                images: [{}, {}, { url: 'https://example.com/album-art.jpg' }],
              },
            },
          ],
        },
      },
    });

    render(
      <BrowserRouter>
        <NewPostForm />
      </BrowserRouter>
    );

    // Simulate typing into the search field
    fireEvent.change(screen.getByPlaceholderText('Search for a song...'), {
      target: { value: 'Song' },
    });

    // Wait for the autocomplete list to appear
    await waitFor(() => {
      expect(screen.getByText('Song A - Artist A')).toBeInTheDocument();
    });

    // Simulate selecting a song from the dropdown
    fireEvent.mouseDown(screen.getByText('Song A - Artist A'));

    // Check if the selected song is displayed in the input field
    expect(screen.getByPlaceholderText('Search for a song...').value).toBe('Song A - Artist A');
  });

  test('displays an error message when trying to submit without being logged in', () => {
    render(
      <BrowserRouter>
        <NewPostForm />
      </BrowserRouter>
    );

    fireEvent.change(screen.getByPlaceholderText('Write a caption...'), {
      target: { value: 'Test caption' },
    });

    fireEvent.submit(screen.getByRole('button', { name: 'Post' }));

    expect(screen.getByText('You must be logged in to create a post')).toBeInTheDocument();
  });

  test('handles successful form submission', async () => {
    // Mocking localStorage to simulate the user being logged in
    Storage.prototype.getItem = jest.fn(() => 'mockedToken');

    axios.post.mockResolvedValueOnce({
      data: {
        id: 1,
      },
    });

    render(
      <BrowserRouter>
        <NewPostForm />
      </BrowserRouter>
    );

    // Fill out the form and submit
    fireEvent.change(screen.getByPlaceholderText('Search for a song...'), {
      target: { value: 'Song' },
    });
    fireEvent.change(screen.getByPlaceholderText('Write a caption...'), {
      target: { value: 'Test caption' },
    });

    // Simulate submitting the form
    fireEvent.submit(screen.getByRole('button', { name: 'Post' }));

    await waitFor(() => {
      expect(screen.getByText('Post created successfully!')).toBeInTheDocument();
    });

    // Ensure axios post request was called
    expect(axios.post).toHaveBeenCalledWith(
      'https://wave-app-portfolio-project-bd63556f6378.herokuapp.com/api/posts',
      { songId: '', caption: 'Test caption' },
      {
        headers: {
          Authorization: 'Bearer mockedToken',
        },
      }
    );
  });
});
