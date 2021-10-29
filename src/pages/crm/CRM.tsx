import { getColumnsSel, getLeadsSel, insColumns, insLead, updateColumnsLeads, updateColumnsOrder, uuidv4 } from "common/helpers";
import React, { FC, useEffect, useState } from "react";
import { useDispatch } from 'react-redux';
import { useSelector } from 'hooks';
import { DragDropContext, Droppable, Draggable, DropResult } from "react-beautiful-dnd";
import { AddColumnTemplate, DraggableLeadCardContent, DraggableLeadColumn, DroppableLeadColumnList } from "./components";
import { getMultiCollection, resetMain, execute } from "store/main/actions";
import NaturalDragAnimation from "./prueba";
import paths from "common/constants/paths";
import { useHistory } from "react-router";
import { manageConfirmation } from "store/popus/actions";
import { langKeys } from "lang/keys";
import { useTranslation } from "react-i18next";
import { DialogZyx3Opt } from "components";

interface dataBackend {
  columnid: number,
  column_uuid: string,
  description: string,
  status: string,
  type: string,
  globalid: string,
  index: number,
  total_revenue?: number | null,
  items?: leadBackend[] | null
}

interface leadBackend {
  leadid: number,
  description: string,
  status: string,
  type: string,
  expected_revenue: string,
  date_deadline: string,
  tags: string,
  personcommunicationchannel: number,
  priority: string,
  conversationid: number,
  columnid: number,
  column_uuid: string,
  displayname: string,
  globalid: number,
  edit: string,
  index: number,
  phone: string,
  email: string
}

const CRM: FC = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const [dataColumn, setDataColumn] = useState<dataBackend[]>([])
  const [openDialog, setOpenDialog] = useState(false);
  const [deleteColumn, setDeleteColumn] = useState('')
  const mainMulti = useSelector(state => state.main.multiData);
  const { t } = useTranslation();
  useEffect(() => {
      dispatch(getMultiCollection([
          getColumnsSel(1),
          getLeadsSel(1),
      ]));
      return () => {
          dispatch(resetMain());
      };
  }, [dispatch]);

  useEffect(() => {
    console.log('openDialogEffect',openDialog)
  },[openDialog])

  useEffect(() => {
    if (!mainMulti.error && !mainMulti.loading) {
      if (mainMulti.data.length && mainMulti.data[0].key && mainMulti.data[0].key === "UFN_COLUMN_SEL") {
        const colum0 = {columnid: 0, column_uuid: '00000000-0000-0000-0000-000000000000', description: 'Backlog', status: 'ACTIVO', type: 'type', globalid: 'globalid', index: 0, items:[] }
        const columns = [colum0,...(mainMulti.data[0] && mainMulti.data[0].success ? mainMulti.data[0].data : []) as dataBackend[]]
        const leads = (mainMulti.data[1] && mainMulti.data[1].success ? mainMulti.data[1].data : []) as leadBackend[]
        setDataColumn(
          columns.map((column) => {
            column.items = leads.filter( x => x.column_uuid === column.column_uuid);
            return {...column, total_revenue: (column.items.reduce((a,b) => a + parseFloat(b.expected_revenue), 0))}
          })
        )
      }
    }
  },[mainMulti])

  const onDragEnd = (result:DropResult, columns:dataBackend[], setDataColumn:any) => {
    if (!result.destination) return;
    const { source, destination, type } = result;
  
    if (type === 'column') {
      const newColumnOrder = [...columns]
      const [removed] = newColumnOrder.splice((source.index-1),1)
      newColumnOrder.splice(destination.index-1, 0, removed)
      setDataColumn(newColumnOrder)
      const columns_uuid = newColumnOrder.slice(1).map(x => x.column_uuid).join(',')
      dispatch(execute(updateColumnsOrder({columns_uuid})));
      return;
    }
  
    if (source.droppableId === destination.droppableId) {
      const index = columns.findIndex(c => c.column_uuid === source.droppableId)
      if (index >= 0) {
        const column = columns[index];
        const copiedItems = [...column.items!!]
        const [removed] = copiedItems!.splice(source.index, 1);
        copiedItems!.splice(destination.index, 0, removed);
        setDataColumn(Object.values({...columns, [index]: {...column, items: copiedItems}}));
        
        const cards_startingcolumn = copiedItems!.map(x => x.leadid).join(',')
        const startingcolumn_uuid = column.column_uuid
        dispatch(execute(updateColumnsLeads({cards_startingcolumn, cards_finalcolumn:'', startingcolumn_uuid, finalcolumn_uuid: startingcolumn_uuid})));
      }
    } else {
      const sourceIndex = columns.findIndex(c => c.column_uuid === source.droppableId)
      const destIndex = columns.findIndex(c => c.column_uuid === destination.droppableId)
      if (sourceIndex >= 0 && destIndex >= 0) {
        const sourceColumn = columns[sourceIndex];
        const destColumn = columns[destIndex];
        const sourceItems = (sourceColumn.items) ? [...sourceColumn.items] : null
        const destItems = (destColumn.items) ? [...destColumn.items] : null
        const [removed] = sourceItems!.splice(source.index, 1);
        removed.column_uuid = destination.droppableId
        destItems!.splice(destination.index, 0, removed);
        const sourceTotalRevenue = sourceItems!.reduce((a,b) => a + parseFloat(b.expected_revenue), 0)
        const destTotalRevenue = destItems!.reduce((a,b) => a+ parseFloat(b.expected_revenue), 0)
      
        setDataColumn(Object.values({...columns, [sourceIndex]: {...sourceColumn, total_revenue: sourceTotalRevenue,items: sourceItems}, [destIndex]: {...destColumn, total_revenue: destTotalRevenue,items: destItems}}));

        const cards_startingcolumn = sourceItems!.map(x => x.leadid).join(',')
        const cards_finalcolumn = destItems!.map(x => x.leadid).join(',')
        const startingcolumn_uuid = sourceColumn.column_uuid
        const finalcolumn_uuid = destColumn.column_uuid
        dispatch(execute(updateColumnsLeads({cards_startingcolumn, cards_finalcolumn, startingcolumn_uuid, finalcolumn_uuid})));
      }
    }
  };

  const handleEdit = (column_uuid:string, title:string, columns:dataBackend[], setDataColumn:any) => {
    const index = columns.findIndex(c => c.column_uuid === column_uuid)
    const column = columns[index];
    if (column.description === title) {
      return;
    }
    setDataColumn(Object.values({...columns, [index]: {...column, description: title}}));

    if (column.columnid !== 0) {
      const data = {
        id: column.column_uuid,
        description: title,
        type: 'NINGUNO',
        status: 'ACTIVO',
        edit: true,
        index: column.index,
        operation: 'EDIT'
      }
      dispatch(execute(insColumns(data)));
    }
  }

  const handleDelete = (lead:any) => {
    const callback = () => {
      const index = dataColumn.findIndex(c => c.column_uuid === lead.column_uuid)
      const column = dataColumn[index];
      const copiedItems = [...column.items!!]
      const leadIndex = copiedItems.findIndex(l => l.leadid === lead.leadid)
      const [removed] = copiedItems!.splice(leadIndex, 1);
      const newData = Object.values({...dataColumn, [index]: {...column, items: copiedItems}}) as dataBackend[]
      setDataColumn(newData);
      const data = { ...lead, status:'ELIMINADO',operation:'EDIT' }
      dispatch(execute(insLead(data)))
    }
    dispatch(manageConfirmation({
      visible: true,
      question: t(langKeys.confirmation_delete),
      callback
    }))
  }

  const handleInsert = (title:string, columns:dataBackend[], setDataColumn:any) => {
    const newIndex = columns.length
    const uuid = uuidv4()

    const data = {
      id: uuid,
      description: title,
      type: 'NINGUNO',
      status: 'ACTIVO',
      edit: true,
      index: newIndex,
      operation: 'INSERT',
    }
    
    const newColumn = {
      columnid: null,
      column_uuid: uuid,
      description: title,
      status: 'ACTIVO',
      type: 'NINGUNO',
      globalid: '',
      index: newIndex,
      items: []
    }

    dispatch(execute(insColumns(data)))
    setDataColumn(Object.values({...columns, newColumn}));
  }

  const hanldeDeleteColumn = (column_uuid : string, delete_all:boolean = true) => {
    if (column_uuid === '00000000-0000-0000-0000-000000000000') return;

    if (openDialog) {
      const columns = [...dataColumn]
      const sourceIndex = columns.findIndex(c => c.column_uuid === column_uuid)
      const sourceColumn = columns[sourceIndex];
      let newColumn:dataBackend[] = [];
      if (delete_all) {
        newColumn = columns
      } else {
        const destColumn = columns[0];
        const sourceItems = [...sourceColumn.items!]
        const removed = sourceItems!.splice(0)
        console.log('removed', removed)
        const newDestItems = [...destColumn.items!].concat(removed)
        newDestItems.map((item) => item.column_uuid = destColumn.column_uuid)
        console.log('newDestItems', newDestItems)
        const destTotalRevenue = newDestItems!.reduce((a,b) => a+ parseFloat(b.expected_revenue), 0)
        newColumn = Object.values({...columns, [sourceIndex]: {...sourceColumn, items: sourceItems}, [0]: {...destColumn, total_revenue: destTotalRevenue, items: newDestItems}}) as dataBackend[]
      }
      setDataColumn(newColumn.filter(c => c.column_uuid !== column_uuid))
      dispatch(execute(insColumns({...sourceColumn, status: 'ELIMINADO', delete_all, id: sourceColumn.column_uuid, operation: 'DELETE'})));
      setOpenDialog(false)

      return;
    } else {
      setDeleteColumn(column_uuid)
      setOpenDialog(true)
    }
  }

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
                  <Draggable draggableId={dataColumn[0].column_uuid} index={0} key={dataColumn[0].column_uuid} isDragDisabled={dataColumn[0].columnid === 0}>
                    {(provided) => (
                      <div
                        {...provided.draggableProps}
                        ref={provided.innerRef}
                      >
                        <DraggableLeadColumn 
                          title={dataColumn[0].description}
                          key={0}
                          snapshot={null}
                          provided={provided}
                          columnid={dataColumn[0].column_uuid} 
                          onDelete={hanldeDeleteColumn}
                          total_revenue={dataColumn[0].total_revenue!}
                        >
                          <Droppable droppableId={dataColumn[0].column_uuid} type="task">
                            {(provided, snapshot) => (
                              <div
                                {...provided.droppableProps}
                                ref={provided.innerRef}
                                style={{ overflow: 'hidden', width: '100%' }}
                              >
                                <DroppableLeadColumnList snapshot={snapshot} itemCount={dataColumn[0].items?.length || 0}>
                                {dataColumn[0].items?.map((item, index) => {
                                  return (
                                    <Draggable
                                      key={item.leadid}
                                      draggableId={item.leadid.toString()}
                                      index={index}
                                    >
                                      {(provided, snapshot) => {
                                        return (
                                          <NaturalDragAnimation
                                            style={provided.draggableProps.style}
                                            snapshot={snapshot}
                                          >
                                            {(style:any) => (
                                              <div
                                                ref={provided.innerRef}
                                                {...provided.draggableProps}
                                                {...provided.dragHandleProps}
                                                style={{width: '100%', ...style}}
                                              >
                                                <DraggableLeadCardContent
                                                  lead={item}
                                                  snapshot={snapshot}
                                                  onDelete={handleDelete}
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
                            )}
                          </Droppable>
                        </DraggableLeadColumn>
                      </div>
                    )}
                  </Draggable>
                  {provided.placeholder}
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
                    <Draggable draggableId={column.column_uuid} index={index+1} key={column.column_uuid}>
                      { (provided) => (
                        <div
                          {...provided.draggableProps}
                          ref={provided.innerRef}
                        >
                            <DraggableLeadColumn 
                              title={column.description} 
                              key={index+1} 
                              snapshot={null} 
                              provided={provided} 
                              titleOnChange={(val) =>{handleEdit(column.column_uuid,val,dataColumn, setDataColumn)}}
                              columnid={column.column_uuid} 
                              onDelete={hanldeDeleteColumn}
                              total_revenue={column.total_revenue!}
                            >
                                <Droppable droppableId={column.column_uuid} type="task">
                                  {(provided, snapshot) => {
                                    return (
                                      <div
                                        {...provided.droppableProps}
                                        ref={provided.innerRef}
                                        style={{ overflow: 'hidden', width: '100%' }}
                                      >
                                        <DroppableLeadColumnList snapshot={snapshot} itemCount={column.items?.length || 0}>
                                        {column.items?.map((item, index) => {
                                          return (
                                            <Draggable
                                              key={item.leadid}
                                              draggableId={item.leadid.toString()}
                                              index={index}
                                            >
                                              {(provided, snapshot) => {
                                                return(
                                                  <NaturalDragAnimation
                                                    style={provided.draggableProps.style}
                                                    snapshot={snapshot}
                                                  >
                                                    {(style:any) => (
                                                      <div
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        {...provided.dragHandleProps}
                                                        style={{width: '100%', ...style}}
                                                      >
                                                        <DraggableLeadCardContent
                                                          lead={item}
                                                          snapshot={snapshot}
                                                          onDelete={handleDelete}
                                                        />
                                                      </div>
                                                    )}
                                                  </NaturalDragAnimation>
                                                )
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
        <AddColumnTemplate onSubmit={(columnTitle) =>{ handleInsert(columnTitle,dataColumn, setDataColumn)}} />
        <DialogZyx3Opt
          open={openDialog}
          title={t(langKeys.confirmation)}
          buttonText1={t(langKeys.cancel)}
          buttonText2={t(langKeys.negative)}
          buttonText3={t(langKeys.affirmative)}
          handleClickButton1={() => setOpenDialog(false)}
          handleClickButton2={() => hanldeDeleteColumn(deleteColumn, false)}
          handleClickButton3={() => hanldeDeleteColumn(deleteColumn, true)}
          maxWidth={'xs'}
          >
          <div>{t(langKeys.question_delete_all_items)}</div>
          <div className="row-zyx">
          </div>
        </DialogZyx3Opt>
      </div>
    );
};
export default CRM;
