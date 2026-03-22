import { render, screen } from '@testing-library/react';
import App from './App';

test('renders emergency input header', () => {
  render(<App />);
  const headerElement = screen.getByText(/Emergency Input/i);
  expect(headerElement).toBeInTheDocument();
});