//import React from 'react';
import './App.css';
//import useDragger from './hooks/useDragger';
import Box from './components/Box';
import Circle from './components/Circle';

function App() {

//const containerRef = useRef<HTMLDivElement>(null)
//const boxRef = useRef<HTMLDivElement>(null)

  //useDragger("pink-box")


  return (
    <main>
      <div className='container'>
       <Box />
       <Circle />
      </div>
    </main>
  );
}

export default App;
