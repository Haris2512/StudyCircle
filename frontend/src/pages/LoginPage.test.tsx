import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { LoginPage } from './LoginPage';
import { BrowserRouter } from 'react-router-dom';
import { authApi } from '../api/auth.api';
import { useAuth } from '../hooks/useAuth';

// Mock react-router-dom
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<any>('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Mock api
vi.mock('../api/auth.api', () => ({
  authApi: {
    login: vi.fn(),
  },
}));

// Mock useAuth
vi.mock('../hooks/useAuth', () => ({
  useAuth: vi.fn(),
}));

describe('LoginPage', () => {
  const mockLogin = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useAuth as any).mockReturnValue({ login: mockLogin });
  });

  const renderComponent = () =>
    render(
      <BrowserRouter>
        <LoginPage />
      </BrowserRouter>
    );

  it('renders login form correctly', () => {
    renderComponent();
    expect(screen.getByText('Selamat Datang Kembali')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('contoh@kampus.ac.id')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Masukkan kata sandi')).toBeInTheDocument();
  });

  it('shows validation errors for empty fields on submit', async () => {
    renderComponent();
    fireEvent.click(screen.getByRole('button', { name: 'Masuk' }));

    await waitFor(() => {
      expect(screen.getByText('Format email tidak valid')).toBeInTheDocument();
      expect(screen.getByText('Kata sandi tidak boleh kosong')).toBeInTheDocument();
    });
  });

  it('submits form successfully and navigates to dashboard', async () => {
    const mockResponse = {
      success: true,
      data: { id: '1', name: 'User', email: 'test@example.com' },
    };
    (authApi.login as any).mockResolvedValueOnce(mockResponse);

    renderComponent();

    fireEvent.change(screen.getByPlaceholderText('contoh@kampus.ac.id'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByPlaceholderText('Masukkan kata sandi'), { target: { value: 'password123' } });

    fireEvent.click(screen.getByRole('button', { name: 'Masuk' }));

    await waitFor(() => {
      expect(authApi.login).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      });
      expect(mockLogin).toHaveBeenCalledWith(mockResponse.data);
      expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
    });
  });

  it('displays API error on login failure', async () => {
    const mockResponse = {
      success: false,
      message: 'Invalid credentials',
    };
    (authApi.login as any).mockResolvedValueOnce(mockResponse);

    renderComponent();

    fireEvent.change(screen.getByPlaceholderText('contoh@kampus.ac.id'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByPlaceholderText('Masukkan kata sandi'), { target: { value: 'password123' } });

    fireEvent.click(screen.getByRole('button', { name: 'Masuk' }));

    await waitFor(() => {
      expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
      expect(mockNavigate).not.toHaveBeenCalled();
    });
  });
});
