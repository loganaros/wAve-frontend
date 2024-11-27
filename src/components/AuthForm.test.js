import React from 'react';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import AuthForm from './AuthForm';

// Mock axios to prevent actual HTTP requests
jest.mock('axios');
const mockedAxios = require('axios');

// Test suite for AuthForm component
describe('AuthForm Component', () => {
  const renderComponent = (type) => {
    render(
      <BrowserRouter>
        <AuthForm type={type} />
      </BrowserRouter>
    );
  };

  test('renders login form correctly', () => {
    renderComponent('login');

    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
  });

  test('renders register form correctly', () => {
    renderComponent('register');

    expect(screen.getByPlaceholderText('Username')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /register/i })).toBeInTheDocument();
  });

  test('handles input changes', () => {
    renderComponent('register');

    fireEvent.change(screen.getByPlaceholderText('Username'), { target: { value: 'testuser' } });
    fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'password123' } });

    expect(screen.getByPlaceholderText('Username')).toHaveValue('testuser');
    expect(screen.getByPlaceholderText('Email')).toHaveValue('test@example.com');
    expect(screen.getByPlaceholderText('Password')).toHaveValue('password123');
  });

  test('submits login form successfully', async () => {
    mockedAxios.post.mockResolvedValueOnce({
      data: {
        user: { username: 'testuser' },
        token: 'testtoken',
      },
    });

    renderComponent('login');

    fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    await waitFor(() => {
      expect(mockedAxios.post).toHaveBeenCalledWith(
        'https://wave-app-portfolio-project-bd63556f6378.herokuapp.com/api/login',
        {
          email: 'test@example.com',
          password: 'password123',
        }
      );
      expect(screen.getByText(/welcome back, testuser/i)).toBeInTheDocument();
    });
  });

  test('displays error message on failed login', async () => {
    mockedAxios.post.mockRejectedValueOnce({
      response: {
        data: {
          error: 'Invalid credentials',
        },
      },
    });

    renderComponent('login');

    fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'wrongpassword' } });
    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    await waitFor(() => {
      expect(mockedAxios.post).toHaveBeenCalledWith(
        'https://wave-app-portfolio-project-bd63556f6378.herokuapp.com/api/login',
        {
          email: 'test@example.com',
          password: 'wrongpassword',
        }
      );
      expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument();
    });
  });
});
