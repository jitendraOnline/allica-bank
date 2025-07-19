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

  it('favourites:show only favourites when toggle is on', async () => {
    const character = {
      '12': {
        created: '2025-07-18T19:29:06.136Z',
        edited: '2025-07-18T19:29:06.136Z',
        name: 'Favourite Character',
        gender: 'n/a',
        skin_color: 'white, red',
        hair_color: 'n/a',
        height: '97',
        eye_color: 'red',
        mass: '32',
        homeworld: 'https://www.swapi.tech/api/planets/1',
        birth_year: 'unknown',
        url: 'https://www.swapi.tech/api/people/8',
        uid: '12',
      },
    };

    localStorage.setItem('favouriteCharacters', JSON.stringify(character));

    const screen = renderWithClientProdider(<CharacterList />);
    const favouriteToggle = await screen.findByRole('checkbox', { name: /Show Favourites Only/i });
    expect(favouriteToggle).toBeInTheDocument();
    expect(favouriteToggle).not.toBeChecked();

    await userEvent.click(favouriteToggle);
    expect(favouriteToggle).toBeChecked();

    const tbody = screen.container.querySelector('tbody');
    const characterName = await within(tbody!).findByText(/Favourite Character/i);
    expect(characterName).toBeInTheDocument();

    localStorage.removeItem('favouriteCharacters');
    await userEvent.click(favouriteToggle);
    expect(favouriteToggle).not.toBeChecked();

    const tbody1 = screen.container.querySelector('tbody');
    const characterName1 = await within(tbody1!).findByText(/Jitendra Patel/i);
    expect(characterName1).toBeInTheDocument();

    await userEvent.click(favouriteToggle);
    expect(favouriteToggle).toBeChecked();
  });

  it('favourites: should not dispaly favourites character when local stoage is cleared', async () => {
    localStorage.clear();
    const screen = renderWithClientProdider(<CharacterList />);
    const favouriteToggle = await screen.findByRole('checkbox', {
      name: /Show Favourites Only/i,
    });
    expect(favouriteToggle).toBeInTheDocument();
    expect(favouriteToggle).not.toBeChecked();

    await userEvent.click(favouriteToggle);
    expect(favouriteToggle).toBeChecked();

    const tbody = screen.container.querySelector('tbody');
    const characterName = await within(tbody!).queryByText(/Favourite Character/i);
    expect(characterName).not.toBeInTheDocument();

    const characterName2 = await within(tbody!).findByText(/No favourites added/i);
    expect(characterName2).toBeInTheDocument();
  });
});
