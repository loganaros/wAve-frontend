import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import axios from 'axios';
import Comments from './Comments';

// Mock the Comment component and axios
jest.mock('./Comment', () => ({ comment }) => <div>{comment.comment}</div>);
jest.mock('axios');

const mockComments = [
  { id: 1, user_id: 1, username: 'user1', comment: 'This is a test comment 1', created_at: '2024-11-01T12:00:00Z' },
  { id: 2, user_id: 2, username: 'user2', comment: 'This is a test comment 2', created_at: '2024-11-02T13:00:00Z' },
];

describe('Comments Component', () => {
  beforeEach(() => {
    axios.get.mockResolvedValue({ data: mockComments });
    axios.post.mockResolvedValue({ data: { id: 3, user_id: 3, username: 'user3', comment: 'New Comment', created_at: '2024-11-03T14:00:00Z' } });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders comments section with comments', async () => {
    render(<Comments postId={1} />);

    await waitFor(() => {
      expect(screen.getByText('This is a test comment 1')).toBeInTheDocument();
      expect(screen.getByText('This is a test comment 2')).toBeInTheDocument();
    });
  });

  test('allows logged-in user to post a new comment', async () => {
    localStorage.setItem('token', 'mock-token');
    render(<Comments postId={1} />);

    fireEvent.change(screen.getByPlaceholderText('Add a comment...'), {
      target: { value: 'New Comment' },
    });
    fireEvent.click(screen.getByText('Post Comment'));

    await waitFor(() => {
      expect(screen.getByText('New Comment')).toBeInTheDocument();
    });

    localStorage.removeItem('token');
  });

  test('displays message if user is not logged in and tries to comment', async () => {
    render(<Comments postId={1} />);

    fireEvent.change(screen.getByPlaceholderText('Add a comment...'), {
      target: { value: 'New Comment' },
    });
    fireEvent.click(screen.getByText('Post Comment'));

    await waitFor(() => {
      expect(screen.getByText('You must be logged in to comment')).toBeInTheDocument();
    });
  });

  test('displays error message when adding comment fails', async () => {
    axios.post.mockRejectedValueOnce({ response: { data: { error: 'Error adding comment' } } });
    localStorage.setItem('token', 'mock-token');

    render(<Comments postId={1} />);

    fireEvent.change(screen.getByPlaceholderText('Add a comment...'), {
      target: { value: 'New Comment' },
    });
    fireEvent.click(screen.getByText('Post Comment'));

    await waitFor(() => {
      expect(screen.getByText('Error adding comment')).toBeInTheDocument();
    });

    localStorage.removeItem('token');
  });
});
