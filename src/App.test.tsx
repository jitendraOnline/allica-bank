import { screen } from '@testing-library/react';
import App from './App';
import { renderWithClientProdider } from '../tests/helper';

test('should render app', async () => {
  renderWithClientProdider(<App />);
  expect(screen.getByText('Allica Bank')).toBeInTheDocument();
});
