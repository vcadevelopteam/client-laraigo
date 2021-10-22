import { uuidv4 } from "common/helpers";
import React, { FC, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { DraggableLeadCardContent, DraggableLeadColumn, DroppableLeadColumnList } from "./components";

const itemsFromBackend = [
    { id: uuidv4(), content: "First task" },
    { id: uuidv4(), content: "Second task" },
    { id: uuidv4(), content: "Third task" },
    { id: uuidv4(), content: "Fourth task" },
    { id: uuidv4(), content: "Fifth task" },
    { id: uuidv4(), content: "Fifth task" },
    { id: uuidv4(), content: "Fifth task" },
    { id: uuidv4(), content: "Fifth task" },
  ];

  const columnsFromBackend = {
    [uuidv4()]: {
      name: "Requested",
      items: itemsFromBackend
    },
    [uuidv4()]: {
      name: "To do",
      items: []
    },
    [uuidv4()]: {
      name: "In Progress",
      items: []
    },
    [uuidv4()]: {
      name: "Done",
      items: []
    }
  };

  const onDragEnd = (result:any, columns:any, setColumns:any) => {
    if (!result.destination) return;
    const { source, destination } = result;
  
    if (source.droppableId !== destination.droppableId) {
      const sourceColumn = columns[source.droppableId];
      const destColumn = columns[destination.droppableId];
      const sourceItems = [...sourceColumn.items];
      const destItems = [...destColumn.items];
      const [removed] = sourceItems.splice(source.index, 1);
      destItems.splice(destination.index, 0, removed);
      setColumns({
        ...columns,
        [source.droppableId]: {
          ...sourceColumn,
          items: sourceItems
        },
        [destination.droppableId]: {
          ...destColumn,
          items: destItems
        }
      });
    } else {
      const column = columns[source.droppableId];
      const copiedItems = [...column.items];
      const [removed] = copiedItems.splice(source.index, 1);
      copiedItems.splice(destination.index, 0, removed);
      setColumns({
        ...columns,
        [source.droppableId]: {
          ...column,
          items: copiedItems
        }
      });
    }
  };

const CRM: FC = () => {
    const [columns, setColumns] = useState(columnsFromBackend);
    return (
        <div style={{ display: "flex", justifyContent: "center", height: "100%" }}>
          <DragDropContext
            onDragEnd={result => onDragEnd(result, columns, setColumns)}
          >
            {Object.entries(columns).map(([columnId, column], index) => {
              return (
                <DraggableLeadColumn title={column.name} key={index} snapshot={null}>
                    <Droppable droppableId={columnId}>
                      {(provided, snapshot) => {
                        return (
                          <div
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                            style={{ overflowY: 'auto' }}
                          >
                            <DroppableLeadColumnList snapshot={snapshot} itemCount={column.items.length}>
                            {column.items.map((item, index) => {
                              return (
                                <Draggable
                                  key={item.id}
                                  draggableId={item.id}
                                  index={index}
                                >
                                  {(provided, snapshot) => {
                                    return (
                                      <div
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        {...provided.dragHandleProps}
                                      >
                                        <DraggableLeadCardContent
                                          lead={item.content}
                                          snapshot={snapshot}
                                        />
                                      </div>
                                    );
                                  }}
                                </Draggable>
                              );
                            })}
                            </DroppableLeadColumnList>
                            {provided.placeholder}
                          </div>
                        );
                      }}
                    </Droppable>
                </DraggableLeadColumn>
              );
            })}
          </DragDropContext>
        </div>
      );
};

export default CRM;
