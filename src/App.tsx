import type { CSSProperties } from 'react';
import './design_sheets/index';
import * as component from './components/index';
import canvasConfs from './CanvasConfs.json';

function App() {
  const canvasStyle: CSSProperties & { '--canvas-accent-color': string } = {
    '--canvas-accent-color': canvasConfs.AccentColor,
  };

//const containerRef = useRef<HTMLDivElement>(null)
//const boxRef = useRef<HTMLDivElement>(null)

  //useDragger("pink-box")
  return (
    <main style={canvasStyle}>
      <div className='container'>
       <component.Box />
       <component.Box />
       <component.Box />
       <component.Box />
       <component.Triangle />
       <component.Triangle />
       <component.Triangle />
       <component.Triangle />
       <component.Circle />
       <component.Circle />
       <component.Circle />
       <component.Circle />
      </div>
    </main>
  );
}

export default App;
