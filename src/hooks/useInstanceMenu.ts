import { useEffect, useState } from "react";

//types for functions that can be used in other code to add oprions into menu

export type DropMenuOptions = {
    isRecolorable?: boolean;
    isResizable?: boolean;
    isRotateable?: boolean;
};

export type DropMenuLimitations = {
    valuePerCanvas: number;
};

type MousePosition = {
    x: number;
    y: number;
};

type MenuPosition = {
    x: number;
    y: number;
};

type UseInstanceMenuProps = {
    id: string;
    wasClicked: boolean;
    mousePosition: MousePosition | null;
    options: DropMenuOptions;
    limitations: DropMenuLimitations;
};

function useInstanceMenu({
    id,
    wasClicked,
    mousePosition,
    options,
    limitations,
}: UseInstanceMenuProps) {
    const [position, setPosition] = useState<MenuPosition | null>(null);

    useEffect(() => {
        if (!wasClicked || !mousePosition) {
            setPosition(null);
            return;
        }

        const menuWidth = 180;
        const menuHeight = 50;
        const offset = 10;

        let x = mousePosition.x + offset;
        let y = mousePosition.y + offset;

        if (x + menuWidth > window.innerWidth) {
            x = mousePosition.x - menuWidth - offset;
        }

        if (y + menuHeight > window.innerHeight) {
            y = mousePosition.y - menuHeight - offset;
        }

        setPosition({ x: Math.max(0, x), y: Math.max(0, y), });
    }, [wasClicked, mousePosition, id]);

    if (!wasClicked || !position) {
        return null;
    }

    return {
        position,
        options,
        limitations,
    };
}

export default useInstanceMenu;
