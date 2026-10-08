import { useEffect, useRef, useState } from "react";
import canvasConfs from "../CanvasConfs.json";
import type { InteractionHint } from "./useItemTransform";

//Rebuilded version 0.2.1 hotfix
//-------------Made by Dr9nja 06-10-26 - 08-10-26-----------------

//checking for the mouse position as a type
type MousePosition = {
    x: number;
    y: number;
};
//result to have smth to return
type UseDraggerResult = {
    wasClicked: boolean;
    mousePosition: MousePosition | null;
};

function useDragger(
    id: string,
    setInteractionHint: (hint: InteractionHint | null) => void,
    gridSize: number = canvasConfs.gridSize,
): UseDraggerResult {
    const isClicked = useRef(false);
    const isDragged = useRef(false); // checking if item dragged

    const [wasClicked, setWasClicked] = useState(false);
    const [mousePosition, setMousePosition] =
        useState<MousePosition | null>(null);

    const coords = useRef({
        startX: 0,
        startY: 0,
        lastX: 0,
        lastY: 0,
    });

    useEffect(() => {
        //if (!boxRef.current || !containerRef.current) return
        const target = document.getElementById(id)
        if (!target) throw new Error("Element with given id doesn't exist");

        const container = target.parentElement;
        if (!container) throw new Error("Target should have a parent");


        const onPointerDown = (e: PointerEvent) => {
            if (
                e.target instanceof Element &&
                e.target.closest("[data-no-drag]")
            ) {return;}

            isClicked.current = true;
            isDragged.current = false;

            coords.current.startX = e.clientX;
            coords.current.startY = e.clientY;

            coords.current.lastX = target.offsetLeft;
            coords.current.lastY = target.offsetTop;
        };

        const onPointerMove = (e: PointerEvent) => {
            if (!isClicked.current) return;
            
            //clicked
            const dx = e.clientX - coords.current.startX;
            const dy = e.clientY - coords.current.startY;

            // not count tiny movements, don't know if needed..
            if (Math.abs(dx) > 3 || Math.abs(dy) > 3) {
                isDragged.current = true;
            }

            if (!isDragged.current) return;

            const nextX = dx + coords.current.lastX;
            const nextY = dy + coords.current.lastY;

            const snappedX = Math.round(nextX / gridSize) * gridSize;

            const snappedY = Math.round(nextY / gridSize) * gridSize;

            target.style.top = `${snappedY}px`;
            target.style.left = `${snappedX}px`;

            setInteractionHint({
                x: e.clientX + 14,
                y: e.clientY + 14,
                text: `Position: ${snappedX} × ${snappedY}`,
            });

        };

        const onPointerUp = (e: PointerEvent) => {
            if (!isClicked.current) return;

            // click
            if (!isDragged.current) {
                setWasClicked(true);

                setMousePosition({
                    x: e.clientX,
                    y: e.clientY,
                });
                //timeout if stucked
                window.setTimeout(() => {setWasClicked(false); }, 150);
            }

            setInteractionHint(null);
            isClicked.current = false;
            isDragged.current = false;
        };

        target.addEventListener("pointerdown", onPointerDown);
        target.addEventListener("pointerup", onPointerUp);

        container.addEventListener("pointermove", onPointerMove);
        container.addEventListener("pointerleave", onPointerUp);

        return () => {
            target.removeEventListener("pointerdown", onPointerDown);
            target.removeEventListener("pointerup", onPointerUp);

            container.removeEventListener("pointermove", onPointerMove);
            container.removeEventListener("pointerleave", onPointerUp);
        };
    }, [id, gridSize, setInteractionHint]);

    return {
        wasClicked,
        mousePosition,
    };
}

export default useDragger;
