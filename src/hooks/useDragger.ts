import {useEffect, useRef} from "react";

function useDragger(id: string, gridSize: number = 10): void{

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
    //if (!boxRef.current || !containerRef.current) return
    const target = document.getElementById(id)
    if (!target) throw new Error("Element with given id doesn't exist");

    const container = target.parentElement;
    if (!container) throw new Error("Target should have a parent");


    const onPointerDown = (e: PointerEvent) => {
        isClicked.current = true;
        coords.current.startX = e.clientX;
        coords.current.startY = e.clientY;
    }

    const onPointerUp = (e: PointerEvent) => {
        isClicked.current = false;
        coords.current.lastX = target.offsetLeft;
        coords.current.lastY = target.offsetTop;
    }

    const onPointerMove = (e: PointerEvent) => {
        if (!isClicked.current) return;

        const nextX = e.clientX - coords.current.startX + coords.current.lastX;
        const nextY = e.clientY - coords.current.startY + coords.current.lastY;

        const snappedX = Math.round(nextX / gridSize) * gridSize;
        const snappedY = Math.round(nextY / gridSize) * gridSize;

        target.style.top = `${snappedY}px`;
        target.style.left = `${snappedX}px`;

    }

    target.addEventListener("pointerup", onPointerUp);
    target.addEventListener("pointerdown", onPointerDown); // listens for mousedown
    container.addEventListener("pointermove", onPointerMove);
    container.addEventListener("pointerleave", onPointerUp)

    const cleanup = () => {
        target.removeEventListener("pointerup", onPointerUp);
        target.removeEventListener("pointerdown", onPointerDown);
        container.removeEventListener("pointermove", onPointerMove)
        container.removeEventListener("pointerleave", onPointerUp)
    }// cleaning up the left mousedown eventtt
    return cleanup;
    }, [id, gridSize])

};

export default useDragger;