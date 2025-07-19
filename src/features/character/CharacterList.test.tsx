import { render, waitForElementToBeRemoved } from '@testing-library/react';
import { CharacterList } from './CharacterList';
import { queryClient } from '../../queryClient';
import { QueryClientProvider } from '@tanstack/react-query';
import userEvent from '@testing-library/user-event';

const renderWithClientProdider = (ui: React.ReactElement) => {
  return render(<QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>);
};

describe('CharacterList Component', () => {
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
    const pageinationDetails = await screen.findByText(/showing 1-3 of 3/i);
    expect(pageinationDetails).toBeInTheDocument();

    const nextButton = await screen.findByRole('button', { name: /Next/i });
    expect(nextButton).toBeInTheDocument();
    expect(nextButton).toBeEnabled();
    nextButton.click();
    const pageinationDetails1 = await screen.findByText(/showing 11-3 of 3/i);
    expect(pageinationDetails1).toBeInTheDocument();

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

  it('user should be able to search for character by name', async () => {
    const screen = renderWithClientProdider(<CharacterList />);
    const searchInput = await screen.findByPlaceholderText(/Search by character name/i);
    expect(searchInput).toBeInTheDocument();
    await userEvent.type(searchInput, 'Search Patel');
    expect(searchInput).toHaveValue('Search Patel');
    const Loading = await screen.findByText(/Loading.../i);
    // Wait for loading to disappear
    await waitForElementToBeRemoved(Loading, { timeout: 2000 });
    const characterName = await screen.findByText(/Search Patel/i);
    expect(characterName).toBeInTheDocument();
    await userEvent.clear(searchInput);
    await userEvent.type(searchInput, 'I am not there sorry');
    expect(searchInput).toHaveValue('I am not there sorry');
    const Loading1 = await screen.findByText(/Loading.../i);
    expect(Loading1).toBeInTheDocument();

    const characterName2 = await screen.queryByText(/Search Patel/i);
    expect(characterName2).not.toBeInTheDocument();
  });
});
