import { getChannelsByOrg, getColumnsSel, getIntelligentModels, getIntelligentModelsConfigurations, getLeadsSel, getValuesFromDomain, uuidv4 } from "common/helpers";
import React, { FC, useEffect, useState } from "react";
import { useDispatch } from 'react-redux';
import { useSelector } from 'hooks';
import { DragDropContext, Droppable, Draggable, DropResult } from "react-beautiful-dnd";
import { DraggableLeadCardContent, DraggableLeadColumn, DroppableLeadColumnList } from "./components";
import { getCollection, getMultiCollection, resetMain } from "store/main/actions";

interface dataBackend {
  columnid: number,
  description: string,
  status: string,
  type: string,
  globalid: string,
  index: number,
  items?: leadBackend[] | null
}

interface leadBackend {
  leadid: number,
  description: string,
  status: string,
  type: string,
  expected_revenue: number,
  date_deadline: string,
  tags: string,
  personcommunicationchannel: number,
  priority: string,
  conversationid: number,
  columnid: number,
  globalid: number,
  edit: string,
  index: number
}

const onDragEnd = (result:DropResult, columns:dataBackend[], setDataColumn:any) => {
  if (!result.destination) return;
  const { source, destination, type } = result;

  if (type === 'column') {
    const newColumnOrder = [...columns]
    const [removed] = newColumnOrder.splice((source.index-1),1)
    newColumnOrder.splice(destination.index-1, 0, removed)
    setDataColumn(newColumnOrder)
    return;
  }

  if (source.droppableId === destination.droppableId) {
    const index = columns.findIndex(c => c.columnid.toString() === source.droppableId)
    if (index >= 0) {
      const column = columns[index];
      const copiedItems = [...column.items!!]
      const [removed] = copiedItems!.splice(source.index, 1);
      copiedItems!.splice(destination.index, 0, removed);
      setDataColumn(Object.values({...columns, [index]: {...column, items: copiedItems}}));
    }
  } else {
    const sourceIndex = columns.findIndex(c => c.columnid.toString() === source.droppableId)
    const destIndex = columns.findIndex(c => c.columnid.toString() === destination.droppableId)
    if (sourceIndex >= 0 && destIndex >= 0) {
      const sourceColumn = columns[sourceIndex];
      const destColumn = columns[destIndex];
      const sourceItems = (sourceColumn.items) ? [...sourceColumn.items] : null
      const destItems = (destColumn.items) ? [...destColumn.items] : null
      const [removed] = sourceItems!.splice(source.index, 1);
      destItems!.splice(destination.index, 0, removed);
      setDataColumn(Object.values({...columns, [sourceIndex]: {...sourceColumn, items: sourceItems}, [destIndex]: {...destColumn, items: destItems}}));
    }
  }
};

const CRM: FC = () => {
  const [dataColumn, setDataColumn] = useState<dataBackend[]>([])
  const dispatch = useDispatch();
  const mainMulti = useSelector(state => state.main.multiData);
  useEffect(() => {
      dispatch(getMultiCollection([
          getColumnsSel(1),
          getLeadsSel(1),
      ]));
      return () => {
          dispatch(resetMain());
      };
  }, []);

  useEffect(() => {
    if (!mainMulti.error && !mainMulti.loading) {
      if (mainMulti.data.length && mainMulti.data[0].key && mainMulti.data[0].key === "UFN_COLUMN_SEL") {
        const colum0 = {columnid: 0, description: 'BACKLOG', status: 'ACTIVO', type: 'type', globalid: 'globalid', index: 0, items:[] }
        const columns = [colum0,...(mainMulti.data[0] && mainMulti.data[0].success ? mainMulti.data[0].data : []) as dataBackend[]]
        const leads = (mainMulti.data[1] && mainMulti.data[1].success ? mainMulti.data[1].data : []) as leadBackend[]
        setDataColumn(
          columns.map((column) => {
            column.items = leads.filter( x => x.columnid === column.columnid)
            return column
          })
        )
      }
    }
  },[mainMulti])

  
  return (
      <div style={{ display: "flex", justifyContent: "center", height: "100%"}}>
        <DragDropContext onDragEnd={result => onDragEnd(result, dataColumn, setDataColumn)}>
          {(dataColumn.length > 0) && 
            <Droppable droppableId="first-column" direction="horizontal" type="column" isDropDisabled>
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  style={{display:'flex'}}
                >
                  <Draggable draggableId={dataColumn[0].columnid.toString()} index={0} key={dataColumn[0].columnid} isDragDisabled={dataColumn[0].columnid === 0}>
                    {(provided) => (
                      <div
                        {...provided.draggableProps}
                        ref={provided.innerRef}
                      >
                        <DraggableLeadColumn title={dataColumn[0].description} key={0} snapshot={null} provided={provided}>
                          <Droppable droppableId={dataColumn[0].columnid.toString()} type="task">
                            {(provided, snapshot) => (
                              <div
                                {...provided.droppableProps}
                                ref={provided.innerRef}
                                style={{ overflowY: 'auto' }}
                              >
                                <DroppableLeadColumnList snapshot={snapshot}>
                                {dataColumn[0].items?.map((item, index) => {
                                  return (
                                    <Draggable
                                      key={item.leadid}
                                      draggableId={item.leadid.toString()}
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
                                              lead={item}
                                              snapshot={snapshot}
                                            />
                                          </div>
                                        );
                                      }}
                                    </Draggable>
                                  );
                                })}
                                </DroppableLeadColumnList>
                              </div>
                            )}
                          </Droppable>
                        </DraggableLeadColumn>
                      </div>
                    )}
                  </Draggable>
                </div>
              )}
            </Droppable>
          }

          <Droppable droppableId="all-columns" direction="horizontal" type="column" >
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                style={{display:'flex'}}
              >
                {dataColumn.map((column, index) => {
                  if (column.columnid === 0) {
                    return null
                  }
                  return (
                    <Draggable draggableId={column.columnid.toString()} index={index+1} key={column.columnid}>
                      { (provided) => (
                        <div
                          {...provided.draggableProps}
                          ref={provided.innerRef}
                        >
                            <DraggableLeadColumn title={column.description} key={index+1} snapshot={null} provided={provided}>
                                <Droppable droppableId={column.columnid.toString()} type="task">
                                  {(provided, snapshot) => {
                                    return (
                                      <div
                                        {...provided.droppableProps}
                                        ref={provided.innerRef}
                                        style={{ overflowY: 'auto' }}
                                      >
                                        <DroppableLeadColumnList snapshot={snapshot}>
                                        {column.items?.map((item, index) => {
                                          return (
                                            <Draggable
                                              key={item.leadid}
                                              draggableId={item.leadid.toString()}
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
                                                      lead={item}
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
                        </div>
                      )}
                    </Draggable>
                  );
                })}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>
    );
};

export default CRM;
