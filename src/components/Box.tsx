import React from "react";
import useDragger from "../hooks/useDragger";
import useInstanceMenu, {DropMenuLimitations,DropMenuOptions,} from "../hooks/useInstanceMenu";
import useItemTransform, {ResizeCorner,} from "../hooks/useItemTransform";
import InstanceMenu from "../coreUI/instanceMenu";

const MENU_OPTIONS: DropMenuOptions = {
    isRecolorable: true,
    isResizable: true,
    isRotateable: true,
};

const MENU_LIMITATIONS: DropMenuLimitations = {
    valuePerCanvas: 100,
};

const RESIZE_CORNERS: ResizeCorner[] = ["nw", "ne", "sw", "se"];

const Box: React.FC = () => {
    const id = React.useMemo(() => crypto.randomUUID(), []); //unique id 
    const boxRef = React.useRef<HTMLDivElement | null>(null); 
    const [isSelected, setIsSelected] = React.useState(false);
    const [activeControl, setActiveControl] = React.useState<
        "resize" | "rotate" | null
    >(null);

    const {
        size,
        rotation,
        interactionHint,
        interactionHintRef,
        setInteractionHint,
        clearInteractionHint,
        startResize,
        startRotate,
    } = useItemTransform(boxRef) // Transform hook;

    const { wasClicked, mousePosition } = useDragger(id, setInteractionHint);
    const menu = useInstanceMenu({
        id,
        wasClicked,
        mousePosition,
        options: MENU_OPTIONS,
        limitations: MENU_LIMITATIONS,
    }); // InstanceMenu hook

    React.useEffect(() => {
        if (!wasClicked) return;

        setIsSelected(true);
        setActiveControl(null);
    }, [wasClicked]);

    React.useEffect(() => {
        const clearSelectionOutsideBox = (event: PointerEvent) => {
            if (
                event.target instanceof Node &&
                !boxRef.current?.contains(event.target)
            ) {
                setIsSelected(false);
                setActiveControl(null);
                clearInteractionHint();
            }
        };

        document.addEventListener("pointerdown", clearSelectionOutsideBox);
        return () => {
            document.removeEventListener("pointerdown", clearSelectionOutsideBox);
        };
    }, [clearInteractionHint]);

    const isInteractive = isSelected || activeControl !== null;

    return (
        <>
            <div
                id={id}
                ref={boxRef}
                className={`box ${isInteractive ? "selected" : ""}`}
                style={{
                    width: size.width,
                    height: size.height,
                    transform: `rotate(${rotation}deg)`,
                }}
            >
                {isInteractive && (
                    <>
                        <div
                            className="rotation-handle"
                            data-no-drag 
                            onPointerDown={(event) => {
                                setIsSelected(true);
                                setActiveControl("rotate");
                                startRotate(event);
                            }}
                            title="Rotate"
                        />
                        {RESIZE_CORNERS.map((corner) => (
                            <div
                                key={corner}
                                className={`resize-handle ${corner}`}
                                data-no-drag
                                onPointerDown={(event) => {
                                    setIsSelected(true);
                                    setActiveControl("resize");
                                    startResize(corner)(event);
                                }}
                                title={`Resize ${corner}`}
                            />
                        ))}
                    </>
                )}
            </div>

            {interactionHint && (
                <div
                    ref={interactionHintRef}
                    className="interaction-hint"
                    style={{
                        left: interactionHint.x,
                        top: interactionHint.y,
                    }}
                >
                    {interactionHint.text}
                </div>
            )}

            {menu && (
                <InstanceMenu
                    x={menu.position.x}
                    y={menu.position.y}
                    isRecolorable={menu.options.isRecolorable}
                    isResizable={menu.options.isResizable}
                    isRotateable={menu.options.isRotateable}
                    onResize={() => {
                        setIsSelected(true);
                        setActiveControl("resize");
                    }}
                    onRotate={() => {
                        setIsSelected(true);
                        setActiveControl("rotate");
                    }}
                />
            )}
        </>
    );
};

export default Box;
