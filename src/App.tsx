import './App.css';
import { CharacterListPage } from './features/character/CharacterList';

function App() {
  return (
    <div className="flex h-[100vh] w-[100vw] flex-col">
      <p>Allica Bank</p>
      <CharacterListPage />
    </div>
  );
}

export default App;
