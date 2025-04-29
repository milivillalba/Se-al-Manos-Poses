import React from 'react';
import HandPoseDetector from './components/HandPoseDetector';

function App() {
  return (
    <div className="App">
      <h1 className="text-center text-2xl font-bold my-4">Detección de Mano 3D</h1>
      <HandPoseDetector />
    </div>
  );
}

export default App;
