import MusicGenerator from "./components/MusicGenerator";
import Title from "./components/Title";

function App() {
  return (
    <div className="flex flex-col items-center justify-center w-full h-full p-6">
      <Title />
      <MusicGenerator />
    </div>
  );
}

export default App;
