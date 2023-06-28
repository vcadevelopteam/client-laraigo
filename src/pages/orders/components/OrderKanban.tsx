/* eslint-disable react-hooks/exhaustive-deps */
import { FC, useEffect,useState } from 'react'; // we need this to make JSX compile
import { useDispatch } from 'react-redux';
import { getOrderSel } from 'common/helpers';
import { Dictionary } from "@types";
import { Trans, useTranslation } from 'react-i18next';
import { langKeys } from 'lang/keys';
import { getCollection } from 'store/main/actions';
import { makeStyles } from '@material-ui/core/styles';
import { FieldSelect } from "components";
import { Button } from "@material-ui/core";
import { Search as SearchIcon } from '@material-ui/icons';
import { DragDropContext, Droppable, Draggable, DropResult } from "react-beautiful-dnd";
import { DraggableOrderCardContent, DraggableOrderColumn, DroppableOrderColumnList } from './auxComponents';
import NaturalDragAnimation from 'pages/crm/prueba';

const useStyles = makeStyles((theme) => ({
    canvasFiltersHeader: {
      margin: theme.spacing(1),
      display: 'flex',
      flexDirection: 'row',
      gap: '1em',
      alignItems: 'center',
      flexWrap: 'wrap',
    },
    filterComponent: {
        width: '220px'
    },
    columnStyle: {
        minWidth: 280,
        maxWidth: 280,
        backgroundColor:"#aa53e0",
        padding:"10px 0",
        margin: "0 5px",
        display: "flex",
        overflow: "hidden",
        maxHeight: "100%",
        textAlign: "center",
        flexDirection: "column",
    },
}));

const DraggablesCategories : FC<{column:any, index:number, onClick: (row:Dictionary)=>void}> = ({column, 
  index,onClick }) => {

  return (
    <Draggable draggableId={column.column_uuid} index={index+1} key={column.column_uuid}>
      { (provided) => (
        <div
          {...provided.draggableProps}
          ref={provided.innerRef}
        >
          <DraggableOrderColumn 
            key={index+1} 
            snapshot={null} 
            provided={provided} 
            // titleOnChange={(val) =>{handleEdit(column.column_uuid,val,dataColumn, setDataColumn)}}
            columnid={column.name} 
            // onAddCard={() => history.push(paths.CRM_ADD_LEAD.resolve(column.columnid, column.column_uuid))}
          >
              <Droppable droppableId={column.name} type="task">
                {(provided, snapshot) => {
                  return (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      style={{ overflow: 'hidden', width: '100%' }}
                    >
                      <DroppableOrderColumnList snapshot={snapshot} itemCount={column.items?.length || 0}>
                      {column.cards?.map((item:any, index:any) => {
                        return (
                          <Draggable
                            key={item.orderid}
                            draggableId={item.orderid.toString()}
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
                                      <DraggableOrderCardContent
                                        order={item}
                                        onClick={onClick}
                                        snapshot={snapshot}
                                      />
                                    </div>
                                  )}
                                </NaturalDragAnimation>
                              )
                            }}
                          </Draggable>
                        );
                      })}
                      </DroppableOrderColumnList>
                      {provided.placeholder}
                    </div>
                  );
                }}
              </Droppable>
          </DraggableOrderColumn>
        </div>
      )}
  </Draggable>
  )
}

const OrderKanban: FC<{mainResult: any, mainAux: any,handleEdit:(row: Dictionary)=>void}> = ({mainResult,mainAux, handleEdit}) => {
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const classes = useStyles();
    const [productFilter, setProductFilter] = useState("");
    const [dataColumns, setDataColumns] = useState<any>([
      {name: "new", cards: []},
      {name: "prepared", cards: []},
      {name: "dispatched", cards: []},
      {name: "delivered", cards: []},
    ]);
    const fetchData = () => dispatch(getCollection(getOrderSel(productFilter)));

    useEffect(() => {
        fetchData();
    }, []);
    
    useEffect(() => {
        if(!mainResult.mainData.loading){
            if(!mainResult.mainData.error){
              setDataColumns([
                {name: "new", cards: mainResult.mainData.data.filter((x:any)=>!x.orderstatus)},
                {name: "prepared", cards: mainResult.mainData.data.filter((x:any)=>x.orderstatus === "prepared")},
                {name: "dispatched", cards: mainResult.mainData.data.filter((x:any)=> x.orderstatus === "dispatched")},
                {name: "delivered", cards: mainResult.mainData.data.filter((x:any)=>x.orderstatus === "delivered")},
              ])
            }else{
              setDataColumns([
                {name: "new", cards: []},
                {name: "prepared", cards: []},
                {name: "dispatched", cards: []},
                {name: "delivered", cards: []},
              ])
            }
        }
    }, [mainResult]);

    const onDragEnd = (result:DropResult, columns:any, setDataColumn:any) => {
      if (!result.destination) return;
      const { source, destination, type } = result;
    /*
      if (type === 'column') {
        const newColumnOrder = [...columns]
        if(newColumnOrder[destination.index-1].type !== newColumnOrder[source.index-1].type) return;
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
          dispatch(execute(updateColumnsLeads({cards_startingcolumn, cards_finalcolumn, startingcolumn_uuid, finalcolumn_uuid, leadid: removed.leadid})));
        }
      }*/
    };

    return (
        <div style={{ width: "100%" }}>
            
            <div style={{ display: "flex", flexDirection: 'column', height: "100%" }}>
                <div className={classes.canvasFiltersHeader}>
                    <FieldSelect
                    variant="outlined"
                    label={t(langKeys.product)}
                    className={classes.filterComponent}
                    valueDefault={productFilter}
                    onChange={(v) => setProductFilter(v?.product||"")}
                    data={mainAux.data}
                    loading={mainAux.loading}
                    optionDesc="product"
                    optionValue="product"
                    />
                    <div style={{ flexGrow: 1 }} />
                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<SearchIcon style={{ color: 'white' }} />}
                        style={{ backgroundColor: '#55BD84', width: 120 }}
                        onClick={fetchData}
                        disabled={mainResult.mainData.loading}
                    >
                        <Trans i18nKey={langKeys.search} />
                    </Button>
                </div>
                <div style={{display:"flex", color: "white", paddingTop: 10, fontSize: "1.6em", fontWeight: "bold"}}>
                    <div className={classes.columnStyle}>{t(langKeys.new)}</div>
                    <div className={classes.columnStyle}>{t(langKeys.prepared)}</div>
                    <div className={classes.columnStyle}>{t(langKeys.dispatched)}</div>
                    <div className={classes.columnStyle}>{t(langKeys.delivered)}</div>
                </div>
                <DragDropContext onDragEnd={result => onDragEnd(result, dataColumns, setDataColumns)}>
                  <Droppable droppableId="all-columns" direction="horizontal" type="column" >
                    {(provided) => (
                      <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        style={{display:'flex'}}
                      >
                        {dataColumns.map((column:any, index:any) => 
                            <DraggablesCategories column={column} index={index} onClick={handleEdit}/>
                        )}
                      </div>
                    )}
                  </Droppable>
                </DragDropContext>
                {/*
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
                </DialogZyx3Opt>*/}
            </div>
        </div>)

}

export default OrderKanban;