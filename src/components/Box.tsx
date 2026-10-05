import React from "react";
import useDragger from "../hooks/useDragger";

const Box: React.FC = () => {
    const id = React.useMemo(() => crypto.randomUUID(), []);

    useDragger(id);

    return <div id={id} className="box" />;
};

export default Box;