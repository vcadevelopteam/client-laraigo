// DraggableItem.tsx
import React from "react";
import { useDrag } from "react-dnd";
import { Paper, IconButton } from "@mui/material";

interface DraggableItemProps {
    id: string;
    type: string;
    text: string;
    icon: React.ReactNode;
    onDelete: (id: string) => void;
}

const DraggableItem: React.FC<DraggableItemProps> = ({ id, type, text, icon, onDelete }) => {
    const [{ isDragging }, drag] = useDrag(() => ({
        type: "item",
        item: { id, type },
        collect: (monitor) => ({
            isDragging: !!monitor.isDragging(),
        }),
    }));

    return (
        <Paper
            ref={drag}
            style={{
                opacity: isDragging ? 0.5 : 1,
                padding: "10px",
                margin: "10px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                backgroundColor: "#d0b3ff",
            }}
        >
            <div style={{ display: "flex", alignItems: "center" }}>
                {icon}
                <span style={{ marginLeft: "8px" }}>{text}</span>
            </div>
            <IconButton onClick={() => onDelete(id)}>
                <DeleteIcon />
            </IconButton>
        </Paper>
    );
};

export default DraggableItem;
