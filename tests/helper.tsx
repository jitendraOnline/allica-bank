import { QueryClientProvider } from '@tanstack/react-query';
import { render } from '@testing-library/react';
import { queryClient } from '../src/queryClient';

export const renderWithClientProdider = (ui: React.ReactElement) => {
  return render(<QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>);
};
