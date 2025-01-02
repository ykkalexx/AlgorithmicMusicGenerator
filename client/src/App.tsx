import CompositionsList from "./components/CompositionsList";
import MusicGenerator from "./components/MusicGenerator";
import Title from "./components/Title";

function App() {
  return (
    <div className="flex flex-col items-center justify-center w-full h-full gap-5 p-6">
      <Title />
      <MusicGenerator />
      <CompositionsList />
    </div>
  );
}

export default App;
