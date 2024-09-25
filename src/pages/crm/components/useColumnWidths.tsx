import { Dictionary } from "@types";
import { useEffect, useState } from "react";

const useColumnWidths = (dataColumn: Dictionary) => {
    const [columnWidths, setColumnWidths] = useState({
        newWidth: 0,
        qualifiedWidth: 0,
        propositionWidth: 0,
        wonWidth: 0
    });

    useEffect(() => {
        const newColumns = dataColumn.filter((column: Dictionary) => column.type === "NEW").length;
        const qualifiedColumns = dataColumn.filter((column: Dictionary) => column.type === "QUALIFIED").length;
        const propositionColumns = dataColumn.filter((column: Dictionary) => column.type === "PROPOSITION").length;
        const wonColumns = dataColumn.filter((column: Dictionary) => column.type === "WON").length;

        const baseWidth = 310;  
        const gap = 21; 

        setColumnWidths({
            newWidth: newColumns * baseWidth + (newColumns - 1) * gap,
            qualifiedWidth: qualifiedColumns * baseWidth + (qualifiedColumns - 1) * gap,
            propositionWidth: propositionColumns * baseWidth + (propositionColumns - 1) * gap,
            wonWidth: wonColumns * baseWidth + (wonColumns - 1) * gap
        });
    }, [dataColumn]);

    return columnWidths;
};

export default useColumnWidths;