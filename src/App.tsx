import React, { useRef, useEffect } from 'react';
//import logo from './logo.svg';
import './App.css';
//import { cpSync } from 'fs';

function App() {

const containerRef = useRef<HTMLDivElement>(null)
const boxRef = useRef<HTMLDivElement>(null)

const isClicked = useRef<boolean>(false);
//const isMoved = useRef<boolean>(false);

const coords = useRef<{
  startX: number,
  startY: number
  lastX: number,
  lastY: number
}>({
  startX: 0,
  startY: 0,
  lastX: 0,
  lastY: 0
})

useEffect(() => {
  if (!boxRef.current || !containerRef.current) return

  const box = boxRef.current;
  const container = containerRef.current;

  const onPointerDown = (e: PointerEvent) => {
    isClicked.current = true;
    coords.current.startX = e.clientX;
    coords.current.startY = e.clientY;
  }

  const onPointerUp = (e: PointerEvent) => {
    isClicked.current = false;
    coords.current.lastX = box.offsetLeft;
    coords.current.lastY = box.offsetTop;
  }

  const onPointerMove = (e: PointerEvent) => {
    if (!isClicked.current) return;

    const nextX = e.clientX - coords.current.startX + coords.current.lastX;
    const nextY = e.clientY - coords.current.startY + coords.current.lastY;

    box.style.top = `${nextY}px`;
    box.style.left = `${nextX}px`;

  }

  box.addEventListener("pointerup", onPointerUp);
  box.addEventListener("pointerdown", onPointerDown); // listens for mousedown
  container.addEventListener("pointermove", onPointerMove);
  container.addEventListener("pointerleave", onPointerUp)

  const cleanup = () => {
    box.removeEventListener("pointerup", onPointerUp);
    box.removeEventListener("pointerdown", onPointerDown);
    container.removeEventListener("pointermove", onPointerMove)
    container.removeEventListener("pointerleave", onPointerUp)
  }// cleaning up the left mousedown eventtt
  return cleanup;
}, [])



  return (
    <main>
      <div ref={containerRef} className='container'>
        <div ref={boxRef} className='box'></div>
      </div>
    </main>
  );
}

export default App;
