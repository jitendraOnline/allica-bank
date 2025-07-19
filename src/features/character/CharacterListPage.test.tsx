import { waitForElementToBeRemoved, within } from '@testing-library/react';
import { CharacterList } from './CharacterListPage';
import userEvent from '@testing-library/user-event';
import { renderWithClientProdider } from '../../../tests/helper';

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
    const loading = await screen.findByText(/Loading.../i);
    await waitForElementToBeRemoved(loading, { timeout: 2000 });

    const tbody = screen.container.querySelector('tbody');
    const characterName = await within(tbody!).findByText(/Search Patel/i);
    expect(characterName).toBeInTheDocument();
    await userEvent.clear(searchInput);
    await userEvent.type(searchInput, 'I am not there sorry');
    expect(searchInput).toHaveValue('I am not there sorry');

    const loading1 = await screen.findByText(/Loading.../i);
    expect(loading1).toBeInTheDocument();
    const characterName2 = await within(tbody!).queryByText(/Search Patel/i);
    expect(characterName2).not.toBeInTheDocument();

    const previousButton = await screen.queryByRole('button', { name: /Previous/i });
    expect(previousButton).not.toBeInTheDocument();

    const nextButton = await screen.queryByRole('button', { name: /Next/i });
    expect(nextButton).not.toBeInTheDocument();
  });
});
