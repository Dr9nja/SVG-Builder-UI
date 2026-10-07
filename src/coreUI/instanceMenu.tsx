import "../design_sheets/index";

type InstanceMenuProps = {
    x: number;
    y: number;
    isRecolorable?: boolean;
    isResizable?: boolean;
    isRotateable?: boolean;
    onResize?: () => void;
    onRotate?: () => void;
};

const InstanceMenu = ({
    x,
    y,
    isRecolorable = false,
    isResizable = false,
    isRotateable = false,
    onResize,
    onRotate,
}: InstanceMenuProps) => {
    return (
        <div
            className="instance-menu"
            style={{
                left: x,
                top: y,
            }}>
            {isRecolorable && (
                <button type="button">
                    Recolor
                </button>
            )}
        </div>
    );
};

export default InstanceMenu;