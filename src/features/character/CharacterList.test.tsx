import { render } from '@testing-library/react';
import CharacterList from './CharacterList';
import { queryClient } from '../../queryClient';
import { QueryClientProvider } from '@tanstack/react-query';

const renderWithClientProdider = (ui: React.ReactElement) => {
  return render(<QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>);
};

describe('CharacterList Component', () => {
  it('renders without crashing', async () => {
    const screen = renderWithClientProdider(<CharacterList />);
    const heading = await screen.findByText('Character List');
    expect(heading).toBeInTheDocument();
  });
  it('it should render character list and names after getting from api', async () => {
    const screen = renderWithClientProdider(<CharacterList />);
    const characterName = await screen.findByText(/Jitendra Patel/i);
    expect(characterName).toBeInTheDocument();
    const characterPlanet = await screen.findByText(/Earth/i);
    expect(characterPlanet).toBeInTheDocument();
    const characterGender = await screen.findByText(/Male/i);
    expect(characterGender).toBeInTheDocument();
  });
});
