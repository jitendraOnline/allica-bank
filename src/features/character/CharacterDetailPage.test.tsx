import { renderWithClientProdider } from '../../../tests/helper';
import CharacterDetailsPage from './CharacterDetailPage';

describe('Character deatil page', () => {
  it('should render character details page', () => {
    const screen = renderWithClientProdider(<CharacterDetailsPage />);
    const characterDetails = screen.getByText(/character details page/i);
    expect(characterDetails).toBeInTheDocument();
  });
});
