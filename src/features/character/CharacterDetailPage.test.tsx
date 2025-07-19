import { renderWithClientProdider } from '../../../tests/helper';
import CharacterDetailPage from './CharacterDetailPage';
import { screen } from '@testing-library/react';
import { waitForElementToBeRemoved } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';

describe('CharacterDetailPage', () => {
  it('should display character details and related films', async () => {
    renderWithClientProdider(
      <MemoryRouter initialEntries={['/characters/1']}>
        <Routes>
          <Route path="/characters/:id" element={<CharacterDetailPage />} />
        </Routes>
      </MemoryRouter>,
      false
    );

    const loadingText = await screen.findByText(/Loading/i);
    expect(loadingText).toBeInTheDocument();

    await waitForElementToBeRemoved(() => screen.queryByText(/Loading/i), {
      timeout: 2000,
    });

    expect(await screen.findByText(/Jitendra Patel/i)).toBeInTheDocument();
    expect(await screen.findByText(/Male/i)).toBeInTheDocument();
    expect(await screen.findByText(/black/i)).toBeInTheDocument();
    expect(await screen.findByText(/Earth/i)).toBeInTheDocument();

    expect(await screen.findByText(/A New Hope/i)).toBeInTheDocument();
    expect(screen.getByText(/The Empire Strikes Back/i)).toBeInTheDocument();
    expect(screen.queryByText(/Return of the Jedi/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/The Phantom Menace/i)).not.toBeInTheDocument();
  });

  it('back button should be present on navigating to character details page', async () => {
    const screen = renderWithClientProdider(
      <MemoryRouter initialEntries={['/characters/1']}>
        <Routes>
          <Route path="/characters/:id" element={<CharacterDetailPage />} />
        </Routes>
      </MemoryRouter>,
      false
    );
    const backbutton = screen.getByRole('button', { name: / Back to Character List/i });
    expect(backbutton).toBeInTheDocument();
    expect(backbutton).toBeEnabled();
  });

  it('should disaply favouite button and toggle favourite', async () => {
    const screen = renderWithClientProdider(
      <MemoryRouter initialEntries={['/characters/1']}>
        <Routes>
          <Route path="/characters/:id" element={<CharacterDetailPage />} />
        </Routes>
      </MemoryRouter>,
      false
    );
    const favouriteButton = screen.getByRole('button', { name: /Toggle Favourite Button/i });
    expect(favouriteButton).toBeInTheDocument();
    expect(favouriteButton).toBeDisabled();

    const loadingText = await screen.findByText(/Loading character details.../i);
    expect(loadingText).toBeInTheDocument();
    await waitForElementToBeRemoved(() => screen.queryByText(/Loading character details.../i));
    expect(favouriteButton).toBeEnabled();

    expect(favouriteButton).toHaveTextContent('☆ Favourite');

    await userEvent.click(favouriteButton);
    expect(favouriteButton).toBeInTheDocument();
    expect(favouriteButton).toHaveTextContent('★ Favourite');

    await userEvent.click(favouriteButton);
    expect(favouriteButton).toHaveTextContent('☆ Favourite');
  });
});
