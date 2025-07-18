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
  it('pagination : show see buttons for pagination and able to navigate to next and previous page', async () => {
    const screen = renderWithClientProdider(<CharacterList />);

    const previousButton = await screen.findByRole('button', { name: /Previous/i });
    expect(previousButton).toBeInTheDocument();
    expect(previousButton).toBeDisabled();

    const nextButton = await screen.findByRole('button', { name: /Next/i });
    expect(nextButton).toBeInTheDocument();
    expect(nextButton).toBeEnabled();
    nextButton.click();

    const characterName = await screen.findByText(/Jitendra Patel Page 2/i);
    expect(characterName).toBeInTheDocument();

    const previousButton2 = await screen.findByRole('button', { name: /Previous/i });
    expect(previousButton2).toBeEnabled();
    const nextButton2 = await screen.findByRole('button', { name: /Next/i });
    expect(nextButton2).toBeEnabled();
    nextButton2.click();
    const characterName2 = await screen.findByText(/Jitendra Patel Page 3/i);
    expect(characterName2).toBeInTheDocument();
    const previousButton3 = await screen.findByRole('button', { name: /Previous/i });
    expect(previousButton3).toBeEnabled();
    const nextButton3 = await screen.findByRole('button', { name: /Next/i });
    expect(nextButton3).toBeDisabled();
  });
});
