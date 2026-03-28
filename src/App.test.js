import { render, screen } from '@testing-library/react';
import App from './App';

test('renders game title', () => {
  render(<App />);
  const title = screen.getByText(/catch the bug/i);
  expect(title).toBeInTheDocument();
});

test('renders score and time', () => {
  render(<App />);
  
  const score = screen.getByText(/score:/i);
  const time = screen.getByText(/time:/i);

  expect(score).toBeInTheDocument();
  expect(time).toBeInTheDocument();
});

test('renders bug emoji', () => {
  render(<App />);
  
  const bug = screen.getByText('🐛');
  expect(bug).toBeInTheDocument();
});