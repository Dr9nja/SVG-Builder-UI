import React from "react";
import useDragger from "../hooks/useDragger";

const Circle: React.FC = () => {
    const id = React.useMemo(() => crypto.randomUUID(), []);

    useDragger(id);

    return <div id={id} className="circle" />;
};

export default Circle;