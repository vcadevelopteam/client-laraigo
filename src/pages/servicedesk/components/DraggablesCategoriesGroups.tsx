import { FC } from "react";
import { IServiceDeskLead } from "@types";
import { useTranslation } from "react-i18next";
import { Droppable, Draggable } from "react-beautiful-dnd";
import {
  DraggableLeadColumn,
  DraggableServiceDeskCardContent,
  DroppableLeadColumnList,
} from "../components";
import NaturalDragAnimation from "../prueba";
const isIncremental = window.location.href.includes("incremental")

export const DraggablesCategoriesGroup: FC<{
  column: any;
  index: number;
  handleDelete: (lead: IServiceDeskLead) => void;
  handleCloseLead: (lead: IServiceDeskLead) => void;
  role: string;
}> = ({ column, index, handleDelete, handleCloseLead, role }) => {
  const { t } = useTranslation();
  return (
    <Draggable
      draggableId={column.domainvalue}
      index={index + 1}
      key={column.domainvalue}
    >
      {(provided) => (
        <div {...provided.draggableProps} ref={provided.innerRef}>
          <DraggableLeadColumn
            title={t(column.domaindesc.toLowerCase())}
            key={index + 1}
            snapshot={null}
            provided={provided}
            columnid={column.domainvalue}
            total_cards={column.items.length}
          >
            <Droppable droppableId={column.domainvalue} type="task">
              {(provided, snapshot) => {
                return (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    style={{ overflow: "hidden", width: "100%" }}
                  >
                    <DroppableLeadColumnList
                      snapshot={snapshot}
                      itemCount={column.items?.length || 0}
                    >
                      {column.items?.map((item: any, index: any) => {
                        return (
                          <Draggable
                            key={item.leadid}
                            draggableId={item.leadid.toString()}
                            index={index}
                            isDragDisabled={true}
                          >
                            {(provided, snapshot) => {
                              return (
                                <NaturalDragAnimation
                                  style={provided.draggableProps.style}
                                  snapshot={snapshot}
                                >
                                  {(style: any) => (
                                    <div
                                      ref={provided.innerRef}
                                      {...provided.draggableProps}
                                      {...provided.dragHandleProps}
                                      style={{ width: "100%", ...style }}
                                    >
                                      <DraggableServiceDeskCardContent
                                        lead={item}
                                        snapshot={snapshot}
                                        onDelete={handleDelete}
                                        onCloseLead={handleCloseLead}
                                        edit={!isIncremental && !role.includes("VISOR")}
                                      />
                                    </div>
                                  )}
                                </NaturalDragAnimation>
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
        </div>
      )}
    </Draggable>
  );
};
