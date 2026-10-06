import './design_sheets/index';
import * as component from './components/index';

function App() {

//const containerRef = useRef<HTMLDivElement>(null)
//const boxRef = useRef<HTMLDivElement>(null)

  //useDragger("pink-box")
  return (
    <main>
      <div className='container'>
       <component.Box />
       <component.Box />
       <component.Box />
       <component.Box />
       <component.Box />
       <component.Circle />
      </div>
    </main>
  );
}

export default App;
