import { FC, useState } from "react";
import { DragDropContext, Draggable, Droppable, DropResult } from "react-beautiful-dnd";
import { Button, Grid, IconButton, Paper } from "@material-ui/core";
import CloseIcon from '@material-ui/icons/Close';
import { FieldSelect } from "components";
import AddIcon from '@material-ui/icons/Add';
import { SideDataProps } from "../model";
import { useTranslation } from "react-i18next";

const EditInfoOverview: FC<SideDataProps> = ({ items, setItems, availableFields }) => {
    const [selectedField, setSelectedField] = useState<string>("");
    const { t } = useTranslation();

    const handleOnDragEnd = (result: DropResult) => {
        const { source, destination } = result;
        if (!destination) return;
        const reorderedItems = Array.from(items);
        const [movedItem] = reorderedItems.splice(source.index, 1);
        reorderedItems.splice(destination.index, 0, movedItem);
        setItems && setItems(reorderedItems);
    };
    const filteredFields = availableFields.filter(
        (field: any) => !items.some((item: any) => item.field === field.field)
    );

    const handleDelete = (field: string) => {
        setItems && setItems(items.filter((item: any) => item.field !== field));
    };

    const handleAddItem = () => {
        if (selectedField) {
            const newItem = availableFields.find((item: any) => item.field === selectedField);
            if (newItem && !items.find((item: any) => item.field === selectedField)) {
                setItems && setItems([...items, newItem]);
                setSelectedField("");
            }
        }
    };

    return (
        <div>
            <FieldSelect
                data={filteredFields}
                optionValue={"field"}
                optionDesc={"field"}
                uset={true}
                valueDefault={selectedField}
                onChange={(e) => setSelectedField(e.field)}
            />
            <div style={{ justifyContent: "end", display: "flex" }}>

                <Button
                    onClick={handleAddItem}
                    style={{ marginBottom: "20px" }}
                    disabled={!selectedField}
                    endIcon={<AddIcon />}
                >
                    Añadir información
                </Button>
            </div>
            <DragDropContext onDragEnd={handleOnDragEnd}>
                <Droppable droppableId="items">
                    {(provided) => (
                        <Grid
                            container
                            spacing={2}
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                            style={{ padding: "20px", backgroundColor: "#f0f0f0", borderRadius: "8px" }}
                        >
                            {items.map((item: any, index: number) => (
                                <Draggable key={item.field} draggableId={item.field} index={index}>
                                    {(provided) => (
                                        <Grid
                                            item
                                            xs={item.size === 2 ? 12 : 6} // 100% si size es "2", 50% si es "1"
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            {...provided.dragHandleProps}
                                        >
                                            <Paper
                                                style={{
                                                    display: "flex",
                                                    justifyContent: "space-between",
                                                    alignItems: "center",
                                                    padding: "10px",
                                                    backgroundColor: "#d0b3ff",
                                                    width: "100%",
                                                    height: "100%",
                                                    paddingRight: 5,
                                                    fontSize: 12
                                                }}
                                            >
                                                <div style={{ display: "flex", alignItems: "center", flex: 1, }}>
                                                    <span style={{
                                                        marginLeft: "8px",
                                                        wordWrap: "break-word",
                                                    }}>{t(item.field)}</span>
                                                </div>
                                                <IconButton onClick={() => handleDelete(item.field)} style={{margin: 0, padding: 0}}>
                                                    <CloseIcon />
                                                </IconButton>
                                            </Paper>
                                        </Grid>
                                    )}
                                </Draggable>
                            ))}
                            {provided.placeholder}
                        </Grid>
                    )}
                </Droppable>
            </DragDropContext>
        </div>
    );
}

export default EditInfoOverview;
