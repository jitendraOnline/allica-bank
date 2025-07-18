import { render, screen } from '@testing-library/react';
import App from './App';

test('should render app', async () => {
  render(<App />);
  expect(screen.getByText('Allica Bank')).toBeInTheDocument();
});
