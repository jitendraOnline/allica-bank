import { renderWithClientProdider } from '../../../tests/helper';
import CharacterDetailPage from './CharacterDetailPage';
import { screen } from '@testing-library/react';
import { waitForElementToBeRemoved } from '@testing-library/react';
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

    // Films that should not appear
    expect(screen.queryByText(/Return of the Jedi/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/The Phantom Menace/i)).not.toBeInTheDocument();
  });
});
