import { render } from '@testing-library/react';
import CharacterList from './CharacterList';

describe('CharacterList Component', () => {
  it('renders without crashing', () => {
    const screen = render(<CharacterList />);
    expect(screen.getByText('Character List')).toBeInTheDocument();
  });
  it('it should render character list and names after getting from api', async () => {
    const screen = render(<CharacterList />);
    const characterName = await screen.findByText('Jitendra Patel');
    expect(characterName).toBeInTheDocument();
    const characterPlanet = await screen.findByText('Earth');
    expect(characterPlanet).toBeInTheDocument();
    const characterGender = await screen.findByText('Male');
    expect(characterGender).toBeInTheDocument();
  });
});
