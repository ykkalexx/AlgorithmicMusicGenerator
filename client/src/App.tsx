import { useState } from "react";
import CompositionsList from "./components/CompositionsList";
import MusicGenerator from "./components/MusicGenerator";
import Title from "./components/Title";
import { Composition } from "./types/types";

function App() {
  const [loadedComposition, setLoadedComposition] =
    useState<Composition | null>(null);

  const handleLoadComposition = (composition: Composition) => {
    setLoadedComposition(composition);
  };

  return (
    <div className="flex flex-col items-center justify-center w-full h-full gap-5 p-6">
      <Title />
      <MusicGenerator loadedComposition={loadedComposition} />
      <CompositionsList onLoad={handleLoadComposition} />
    </div>
  );
}

export default App;
