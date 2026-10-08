import {
    Dispatch,
    PointerEvent as ReactPointerEvent,
    RefObject,
    SetStateAction,
    useCallback,
    useRef,
    useState,
} from "react";
import canvasConfs from "../CanvasConfs.json";

const MIN_SIZE = 20;
const DEFAULT_SIZE = { width: 60, height: 60 };

export type ResizeCorner = "nw" | "ne" | "sw" | "se"; //sides

export type InteractionHint = { //now exported to show hints everywhere, not only modify
    x: number;
    y: number;
    text: string;
};

type UseItemTransformResult = {
    size: typeof DEFAULT_SIZE;
    rotation: number;
    interactionHint: InteractionHint | null;
    interactionHintRef: RefObject<HTMLDivElement | null>;
    setInteractionHint: Dispatch<SetStateAction<InteractionHint | null>>;
    clearInteractionHint: () => void;
    startResize: (corner: ResizeCorner) => (event: ReactPointerEvent<HTMLDivElement>) => void;
    startRotate: (event: ReactPointerEvent<HTMLDivElement>) => void;
};

function useItemTransform(
    itemRef: RefObject<HTMLDivElement | null>,
): UseItemTransformResult {
    const [size, setSize] = useState(DEFAULT_SIZE);
    const [rotation, setRotation] = useState(0);
    const [interactionHint, setInteractionHint] = useState<InteractionHint | null>(null);
    const interactionHintRef = useRef<HTMLDivElement>(null);
    const currentRotation = useRef(0);
    const clearInteractionHint = useCallback(() => setInteractionHint(null), [],);

    const updateHint = (x: number, y: number, text: string) => {
        const hint = interactionHintRef.current;
        if (hint) {
            hint.style.left = `${x}px`;
            hint.style.top = `${y}px`;
            hint.textContent = text;
            return;
        }
        setInteractionHint({ x, y, text });
    };

    const startResize =
        (corner: ResizeCorner) =>
        (event: ReactPointerEvent<HTMLDivElement>) => {
            const item = itemRef.current;
            if (!item) return;

            event.preventDefault();
            event.stopPropagation();

            const start = {
                x: event.clientX,
                y: event.clientY,
                width: item.offsetWidth,
                height: item.offsetHeight,
                left: item.offsetLeft,
                top: item.offsetTop,
                rotation: (currentRotation.current * Math.PI) / 180,
            };
            
            const cos = Math.cos(start.rotation);
            const sin = Math.sin(start.rotation);
            const fixedLocalX = corner.includes("w") ? start.width : 0;
            const fixedLocalY = corner.includes("n") ? start.height : 0;
            const fixedAnchor = {
                x:
                    start.left +
                    start.width / 2 +
                    cos * (fixedLocalX - start.width / 2) -
                    sin * (fixedLocalY - start.height / 2),
                y:
                    start.top +
                    start.height / 2 +
                    sin * (fixedLocalX - start.width / 2) +
                    cos * (fixedLocalY - start.height / 2),
            };

            updateHint(
                event.clientX + 14,
                event.clientY + 14,
                `Size: ${start.width} × ${start.height}`,
            );

            const onPointerMove = (moveEvent: PointerEvent) => {
                const screenX = moveEvent.clientX - start.x;
                const screenY = moveEvent.clientY - start.y;
                const localX = cos * screenX + sin * screenY;
                const localY = -sin * screenX + cos * screenY;
                const gridSize = canvasConfs.gridSize;
                const minimumSize = gridSize > 0
                    ? Math.ceil(MIN_SIZE / gridSize) * gridSize
                    : MIN_SIZE;
                const snapSize = (value: number) =>
                    gridSize > 0
                        ? Math.max(minimumSize, Math.round(value / gridSize) * gridSize)
                        : Math.max(MIN_SIZE, value);

                const width = snapSize(start.width + (corner.includes("e") ? localX: corner.includes("w")? -localX: 0),
                );

                const height = snapSize(
                    start.height + (corner.includes("s") ? localY : corner.includes("n") ? -localY : 0),
                );

                const nextFixedLocalX = corner.includes("w") ? width : 0;
                const nextFixedLocalY = corner.includes("n") ? height : 0;
                const left = fixedAnchor.x - width / 2 - cos * (nextFixedLocalX - width / 2) + sin * (nextFixedLocalY - height / 2);
                const top = fixedAnchor.y - height / 2 - sin * (nextFixedLocalX - width / 2) - cos * (nextFixedLocalY - height / 2);

                item.style.width = `${width}px`;
                item.style.height = `${height}px`;
                item.style.left = `${left}px`;
                item.style.top = `${top}px`;

                updateHint(
                    moveEvent.clientX + 14,
                    moveEvent.clientY + 14,
                    `Size: ${Math.round(width)} × ${Math.round(height)}`,
                );
            };

            const finishResize = () => {
                window.removeEventListener("pointermove", onPointerMove);
                window.removeEventListener("pointerup", finishResize);
                window.removeEventListener("pointercancel", finishResize);

                setSize({
                    width: item.offsetWidth,
                    height: item.offsetHeight,
                });
                setInteractionHint(null);
            };

            window.addEventListener("pointermove", onPointerMove);
            window.addEventListener("pointerup", finishResize);
            window.addEventListener("pointercancel", finishResize);
        };

    const startRotate = (event: ReactPointerEvent<HTMLDivElement>) => {
        const item = itemRef.current;
        if (!item) return;

        event.preventDefault();
        event.stopPropagation();

        const bounds = item.getBoundingClientRect();
        const centerX = bounds.left + bounds.width / 2;
        const centerY = bounds.top + bounds.height / 2;
        const startAngle = Math.atan2(
            event.clientY - centerY,
            event.clientX - centerX,
        );
        const startRotation = currentRotation.current;

        updateHint(
            event.clientX + 14,
            event.clientY + 14,
            `Rotate: ${Math.round(startRotation)}°`,
        );

        const onPointerMove = (moveEvent: PointerEvent) => {
            const angle = Math.atan2(
                moveEvent.clientY - centerY,
                moveEvent.clientX - centerX,
            );
            let delta = angle - startAngle;
            if (delta > Math.PI) delta -= 2 * Math.PI;
            if (delta < -Math.PI) delta += 2 * Math.PI;

            const rawRotation = startRotation + (delta * 180) / Math.PI;
            const step = canvasConfs.rotationStepDegrees;
            const nextRotation = step > 0
                ? Math.round(rawRotation / step) * step
                : rawRotation;

            currentRotation.current = nextRotation;
            item.style.transform = `rotate(${nextRotation}deg)`;
            updateHint(
                moveEvent.clientX + 14,
                moveEvent.clientY + 14,
                `Rotate: ${Math.round(nextRotation)}°`,
            );
        };

        const finishRotate = () => {
            window.removeEventListener("pointermove", onPointerMove);
            window.removeEventListener("pointerup", finishRotate);
            window.removeEventListener("pointercancel", finishRotate);

            setRotation(currentRotation.current);
            setInteractionHint(null);
        };

        window.addEventListener("pointermove", onPointerMove);
        window.addEventListener("pointerup", finishRotate);
        window.addEventListener("pointercancel", finishRotate);
    };

    return {
        size,
        rotation,
        interactionHint,
        interactionHintRef,
        setInteractionHint,
        clearInteractionHint,
        startResize,
        startRotate,
    };
}

export default useItemTransform;
