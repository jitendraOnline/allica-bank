import { render, screen } from '@testing-library/react';
import App from './App';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './queryClient';

const renderWithClientProdider = (ui: React.ReactElement) => {
  return render(<QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>);
};

test('should render app', async () => {
  renderWithClientProdider(<App />);
  expect(screen.getByText('Allica Bank')).toBeInTheDocument();
});
