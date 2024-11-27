import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import axios from 'axios';
import Comment from './Comment';
import jwtDecode from 'jwt-decode';

jest.mock('axios');
jest.mock('jwt-decode');

const mockComment = {
  id: 1,
  username: 'testuser',
  comment: 'This is a test comment',
  created_at: '2024-11-18T12:34:56Z',
  user_id: 123,
};

describe('Comment Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  test('renders the comment with username, comment text, and created at date', () => {
    render(<Comment comment={mockComment} />);

    expect(screen.getByText('testuser')).toBeInTheDocument();
    expect(screen.getByText('This is a test comment')).toBeInTheDocument();
    expect(screen.getByText(new Date(mockComment.created_at).toLocaleString())).toBeInTheDocument();
  });

  test('shows the delete button if the user is the author of the comment', () => {
    // Mock the decoded token to return the same user_id as the comment author
    jwtDecode.mockReturnValue({ userId: 123 });
    localStorage.setItem('token', 'mockedToken');

    render(<Comment comment={mockComment} />);

    expect(screen.getByText('Delete')).toBeInTheDocument();
  });

  test('does not show the delete button if the user is not the author of the comment', () => {
    // Mock the decoded token to return a different user_id
    jwtDecode.mockReturnValue({ userId: 456 });
    localStorage.setItem('token', 'mockedToken');

    render(<Comment comment={mockComment} />);

    expect(screen.queryByText('Delete')).not.toBeInTheDocument();
  });

  test('calls the delete comment API and onDelete callback when delete button is clicked', async () => {
    // Mock the decoded token to return the same user_id as the comment author
    jwtDecode.mockReturnValue({ userId: 123 });
    localStorage.setItem('token', 'mockedToken');

    const mockOnDelete = jest.fn();
    axios.delete.mockResolvedValue({});

    render(<Comment comment={mockComment} onDelete={mockOnDelete} />);

    const deleteButton = screen.getByText('Delete');
    fireEvent.click(deleteButton);

    expect(axios.delete).toHaveBeenCalledWith(
      `https://wave-app-portfolio-project-bd63556f6378.herokuapp.com/api/comments/${mockComment.id}`,
      expect.objectContaining({
        headers: { Authorization: 'Bearer mockedToken' },
      })
    );

    expect(await screen.findByText('Comment deleted successfully.')).toBeInTheDocument();
    expect(mockOnDelete).toHaveBeenCalledWith(mockComment.id);
  });

  test('shows an alert if the user is not logged in and tries to delete a comment', () => {
    window.alert = jest.fn(); // Mock the alert function

    render(<Comment comment={mockComment} />);

    const deleteButton = screen.queryByText('Delete');
    expect(deleteButton).not.toBeInTheDocument();
  });
});
