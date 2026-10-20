import { render, screen } from '@testing-library/react';
import { ProtectedRoutes } from './App';

jest.mock('react-router-dom', () => {
  const React = jest.requireActual('react');
  return {
    Navigate: ({ to }) => React.createElement('div', { 'data-testid': 'redirect' }, to),
  };
});

test('redirects to login when no authenticated user is stored', () => {
  localStorage.clear();
  render(<ProtectedRoutes><div>Dashboard</div></ProtectedRoutes>);
  expect(screen.getByTestId('redirect')).toHaveTextContent('/login');
  expect(screen.queryByText('Dashboard')).not.toBeInTheDocument();
});

test('allows access when a user and token are stored', () => {
  localStorage.setItem('user', JSON.stringify({ _id: 'test-user' }));
  localStorage.setItem('token', 'test-token');
  render(<ProtectedRoutes><div>Dashboard</div></ProtectedRoutes>);
  expect(screen.getByText('Dashboard')).toBeInTheDocument();
});
