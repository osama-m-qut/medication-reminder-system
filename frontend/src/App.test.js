import { render, screen } from '@testing-library/react';
import { AuthProvider } from './context/AuthContext';
import App from './App';

// When no user is logged in, the navbar should offer Login/Register.
test('renders authentication links when logged out', () => {
  localStorage.clear();
  render(
    <AuthProvider>
      <App />
    </AuthProvider>
  );
  // "Login"/"Register" appear at least in the navbar (and possibly the login page),
  // so assert on presence rather than uniqueness.
  expect(screen.getAllByText(/login/i).length).toBeGreaterThan(0);
  expect(screen.getAllByText(/register/i).length).toBeGreaterThan(0);
});
