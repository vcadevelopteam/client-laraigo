import { adviserSel, convertLocalDate, getColumnsSel, getCommChannelLst, getLeadExport, getLeadsSel, getPaginatedLead, insColumns, insLead, updateColumnsLeads, updateColumnsOrder } from "common/helpers";
import React, { FC, useEffect, useState } from "react";
import { useDispatch } from 'react-redux';
import { useSelector } from 'hooks';
import { DragDropContext, Droppable, Draggable, DropResult } from "react-beautiful-dnd";
import { DraggableLeadCardContent, DraggableLeadColumn, DroppableLeadColumnList } from "./components";
import { getMultiCollection, resetAllMain, execute, getCollectionPaginated, exportData } from "store/main/actions";
import NaturalDragAnimation from "./prueba";
import paths from "common/constants/paths";
import { useHistory } from "react-router";
import { manageConfirmation, showBackdrop, showSnackbar } from "store/popus/actions";
import { langKeys } from "lang/keys";
import { Trans, useTranslation } from "react-i18next";
import { DialogZyx3Opt, FieldEdit, FieldMultiSelect, FieldSelect } from "components";
import ViewColumnIcon from '@material-ui/icons/ViewColumn';
import ViewListIcon from '@material-ui/icons/ViewList';
import { Button, IconButton } from "@material-ui/core";
import { Dictionary, IFetchData } from "@types";
import TablePaginated from 'components/fields/table-paginated';
import { makeStyles } from '@material-ui/core/styles';
import { setDisplay } from "store/lead/actions";
import { Rating } from '@material-ui/lab';
import { AccessTime as AccessTimeIcon } from '@material-ui/icons';
import NoteIcon from '@material-ui/icons/Note';
import SmsIcon from '@material-ui/icons/Sms';
import MailIcon from '@material-ui/icons/Mail';
import { DialogSendTemplate, NewActivityModal, NewNoteModal } from "./Modals";
import { HSMIcon } from "icons";

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

const useStyles = makeStyles((theme) => ({
  containerDetail: {
      marginTop: theme.spacing(3),
      background: '#fff',
  },
  tag: {
    backgroundColor: '#7721AD',
    color: '#fff',
    borderRadius: '20px',
    padding: '2px 5px',
    margin: '2px'
  },
  containerFilter: {
    width: '100%',
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(2),
    display: 'flex',
    gap: 16,
    flexWrap: 'wrap',
    justifyContent: 'space-between'
  },
  filterComponent: {
      width: '220px'
  },
}));

const selectionKey = 'leadid';

interface IModalProps {
  name: string;
  open: boolean;
  payload: Dictionary | null;
}

const CRM: FC = () => {
  const user = useSelector(state => state.login.validateToken.user);
  const history = useHistory();
  const dispatch = useDispatch();
  const [dataColumn, setDataColumn] = useState<dataBackend[]>([])
  const [openDialog, setOpenDialog] = useState(false);
  const [deleteColumn, setDeleteColumn] = useState('')
  const display = useSelector(state => state.lead.display);
  const mainMulti = useSelector(state => state.main.multiData);
  const { t } = useTranslation();
  const classes = useStyles();

  useEffect(() => {
      dispatch(getMultiCollection([
          getColumnsSel(1),
          getLeadsSel(1),
          adviserSel(),
          getCommChannelLst(),
      ]));
      return () => {
          dispatch(resetAllMain());
      };
  }, [dispatch]);

  useEffect(() => {
    console.log('openDialogEffect',openDialog)
  },[openDialog])

  useEffect(() => {
    if (!mainMulti.error && !mainMulti.loading) {
      if (mainMulti.data.length && mainMulti.data[0].key && mainMulti.data[0].key === "UFN_COLUMN_SEL") {
        // const colum0 = {columnid: 0, column_uuid: '00000000-0000-0000-0000-000000000000', description: 'New', status: 'ACTIVO', type: 'type', globalid: 'globalid', index: 0, items:[] }
        // const columns = [colum0,...(mainMulti.data[0] && mainMulti.data[0].success ? mainMulti.data[0].data : []) as dataBackend[]]
        const columns = (mainMulti.data[0] && mainMulti.data[0].success ? mainMulti.data[0].data : []) as dataBackend[]
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
        dispatch(execute(updateColumnsLeads({cards_startingcolumn, cards_finalcolumn, startingcolumn_uuid, finalcolumn_uuid, leadid: removed.leadid})));
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

  const handleCloseLead = (lead:any) => {
    const callback = () => {
      const index = dataColumn.findIndex(c => c.column_uuid === lead.column_uuid)
      const column = dataColumn[index];
      const copiedItems = [...column.items!!]
      const leadIndex = copiedItems.findIndex(l => l.leadid === lead.leadid)//v
      copiedItems!.splice(leadIndex, 1); //v
      const totalRevenue = copiedItems!.reduce((a,b) => a + parseFloat(b.expected_revenue), 0)
      const newData = Object.values({...dataColumn, [index]: {...column, total_revenue: totalRevenue, items: copiedItems}}) as dataBackend[]
      setDataColumn(newData);
      const data = { ...lead, status:'CERRADO', operation:'UPDATE' }
      dispatch(execute(insLead(data)))
    }
    dispatch(manageConfirmation({
      visible: true,
      question: t(langKeys.confirmation_close),
      callback
    }))
  }

  const handleDelete = (lead:any) => {
    const callback = () => {
      const index = dataColumn.findIndex(c => c.column_uuid === lead.column_uuid)
      const column = dataColumn[index];
      const copiedItems = [...column.items!!]
      const leadIndex = copiedItems.findIndex(l => l.leadid === lead.leadid)//v
      copiedItems!.splice(leadIndex, 1); //v
      const totalRevenue = copiedItems!.reduce((a,b) => a + parseFloat(b.expected_revenue), 0)
      const newData = Object.values({...dataColumn, [index]: {...column, total_revenue: totalRevenue, items: copiedItems}}) as dataBackend[]
      setDataColumn(newData);
      const data = { ...lead, status:'ELIMINADO', operation:'UPDATE' }
      dispatch(execute(insLead(data)))
    }
    dispatch(manageConfirmation({
      visible: true,
      question: t(langKeys.confirmation_delete),
      callback
    }))
  }

  /*const handleInsert = (title:string, columns:dataBackend[], setDataColumn:any) => {
    const newIndex = columns.length
    const uuid = uuidv4() // from common/helpers

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
  }*/

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
        newColumn = Object.values({...columns, [sourceIndex]: {...sourceColumn, items: sourceItems}, 0: {...destColumn, total_revenue: destTotalRevenue, items: newDestItems}}) as dataBackend[]
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

  const mainPaginated = useSelector(state => state.main.mainPaginated);
  const resExportData = useSelector(state => state.main.exportData);
  const [pageCount, setPageCount] = useState(0);
  const [totalrow, settotalrow] = useState(0);
  const [fetchDataAux, setfetchDataAux] = useState<IFetchData>({ pageSize: 20, pageIndex: 0, filters: {}, sorts: {}, daterange: null })
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [waitExport, setWaitExport] = useState(false);
  const [allParameters, setAllParameters] = useState<any>({
    asesorid: mainMulti.data[2]?.data?.map(d => d.userid).includes(user?.userid) ? user?.userid : 0,
  });
  const [selectedRows, setSelectedRows] = useState<Dictionary>({});
  const [personsSelected, setPersonsSelected] = useState<Dictionary[]>([]);
  const [gridModal, setGridModal] = useState<IModalProps>({ name: '', open: false, payload: null });

  const CustomCellRender = ({column, row}: any) => {
    switch (column.id) {
      case 'status':
        return (
          <div style={{ cursor: 'pointer' }}>
            {(t(`status_${row[column.id]}`.toLowerCase()) || "").toUpperCase()}
          </div>
        )
      case 'contact_name':
        return (
          <div style={{ cursor: 'pointer' }}>
            <div>{t(langKeys.name)}: {row['contact_name']}</div>
            <div>{t(langKeys.email)}: {row['email']}</div>
            <div>{t(langKeys.phone)}: {row['phone']}</div>
            <Rating
                name="simple-controlled"
                max={3}
                defaultValue={row['priority'] === 'LOW' ? 1 : row['priority'] === 'MEDIUM' ? 2 : row['priority'] === 'HIGH' ? 3 : 1}
                readOnly={true}
            />
            <div>{t(langKeys.assignedTo)}: {row['asesorname']}</div>
          </div>
        )
      case 'tags':
        return (
          <div style={{ cursor: 'pointer' }}>
            {row[column.id] !== '' && row[column.id].split(',').map((t: string, i: number) => (
              <span key={`lead${row['leadid']}${row[column.id]}${i}`} className={classes.tag}>{t}</span>
            ))}
          </div>
        )
      case 'comments':
        return (
          <div style={{ cursor: 'pointer' }}>
            <div>
              <b>{t(langKeys.lastnote)} ({convertLocalDate(row['notedate']).toLocaleString(undefined, {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
              })}):</b> {row['notedescription']}
            </div>
            <div>
              <b>{t(langKeys.nextprogramedactivity)} ({convertLocalDate(row['activitydate']).toLocaleString(undefined, {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
              })}):</b> {row['activitydescription']}
            </div>
          </div>
        )
      default:
        return (
          <div style={{ cursor: 'pointer' }}>
            {
              column.sortType === "datetime" && !!row[column.id]
              ? convertLocalDate(row[column.id]).toLocaleString(undefined, {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
                hour: "numeric",
                minute: "numeric",
                second: "numeric"
              })
              : row[column.id]
            }
          </div>
        )
    }
  }
  
  const cell = (props: any) => {
    const column = props.cell.column;
    const row = props.cell.row.original;
    return (
      <CustomCellRender column={column} row={row} />
    )
  }

  const onClickRow = (row: any) => {
    if (row.leadid) {
      history.push({pathname: paths.CRM_EDIT_LEAD.resolve(row.leadid),});
    }
  }

  const columns = React.useMemo(
    () => [
      {
        Header: t(langKeys.opportunity),
        accessor: 'opportunity',
        Cell: cell
      },
      {
        Header: t(langKeys.lastUpdate),
        accessor: 'changedate',
        type: 'date',
        sortType: 'datetime',
        Cell: cell,
      },
      {
        Header: t(langKeys.customer),
        accessor: 'contact_name',
        NoFilter: true,
        Cell: cell
      },
      {
        Header: t(langKeys.phase),
        accessor: 'phase',
        Cell: cell
      },
      {
        Header: t(langKeys.status),
        accessor: 'status',
        Cell: cell
      },
      {
        Header: t(langKeys.tags),
        accessor: 'tags',
        Cell: cell
      },
      {
        Header: t(langKeys.comments),
        accessor: 'comments',
        NoFilter: true,
        NoSort: true,
        Cell: cell
      },
      {
        accessor: 'actions',
        NoFilter: true,
        isComponent: true,
        Cell: (props: any) => {
          const row = props.cell.row.original;
          if (row.status === 'ACTIVO') {
            return (
              <React.Fragment>
                <div style={{display: 'flex'}}>
                  <IconButton
                    aria-label="more"
                    aria-controls="long-menu"
                    aria-haspopup="true"
                    size="small"
                    onClick={() => setGridModal({name: 'MESSAGE', open: true, payload: { persons: [row], messagetype: 'HSM' }}) }
                  >
                    <HSMIcon
                      width={24}
                      style={{ fill: 'rgba(0, 0, 0, 0.54)' }}
                    />
                  </IconButton>
                  <IconButton
                    aria-label="more"
                    aria-controls="long-menu"
                    aria-haspopup="true"
                    size="small"
                    onClick={() => setGridModal({name: 'MESSAGE', open: true, payload: { persons: [row], messagetype: 'MAIL' }}) }
                  >
                    <MailIcon color="action" />
                  </IconButton>
                  <IconButton
                    aria-label="more"
                    aria-controls="long-menu"
                    aria-haspopup="true"
                    size="small"
                    onClick={() => setGridModal({name: 'MESSAGE', open: true, payload: { persons: [row], messagetype: 'SMS' }}) }
                  >
                    <SmsIcon color="action" />
                  </IconButton>
                </div>
                <div style={{display: 'flex'}}>
                  <IconButton
                    aria-label="more"
                    aria-controls="long-menu"
                    aria-haspopup="true"
                    size="small"
                    onClick={() => setGridModal({name: 'ACTIVITY', open: true, payload: {leadid: row['leadid']}}) }
                  >
                    <AccessTimeIcon
                      titleAccess={t(langKeys.activities)}
                      color="action" 
                    />
                  </IconButton>
                  <IconButton
                    aria-label="more"
                    aria-controls="long-menu"
                    aria-haspopup="true"
                    size="small"
                    onClick={() => setGridModal({name: 'NOTE', open: true, payload: {leadid: row['leadid']}}) }
                  >
                    <NoteIcon
                      titleAccess={t(langKeys.logNote)}
                      color="action" 
                    />
                  </IconButton>
                </div>
              </React.Fragment>
            )
          }
          else {
            return null
          }
      }
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const fetchGridData = ({ pageSize, pageIndex, filters, sorts, daterange }: IFetchData) => {
    setfetchDataAux({...fetchDataAux, ...{ pageSize, pageIndex, filters, sorts }});
    dispatch(getCollectionPaginated(getPaginatedLead(
        {
          startdate: daterange.startDate!,
          enddate: daterange.endDate!,
          sorts: sorts,
          filters: filters,
          take: pageSize,
          skip: pageIndex * pageSize,
          ...allParameters
        }
    )));
  };

  useEffect(() => {
    if (!mainPaginated.loading && !mainPaginated.error) {
        setPageCount(Math.ceil(mainPaginated.count / fetchDataAux.pageSize));
        settotalrow(mainPaginated.count);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mainPaginated]);

  const triggerExportData = ({ filters, sorts, daterange }: IFetchData) => {
    dispatch(exportData(getLeadExport(
      {
        startdate: daterange.startDate!,
        enddate: daterange.endDate!,
        sorts: sorts,
        filters: filters,
        ...allParameters
    })));  
    dispatch(showBackdrop(true));
    setWaitExport(true);
  };

  useEffect(() => {
    if (waitExport) {
        if (!resExportData.loading && !resExportData.error) {
            dispatch(showBackdrop(false));
            setWaitExport(false);
            window.open(resExportData.url, '_blank');
        } else if (resExportData.error) {
            const errormessage = t(resExportData.code || "error_unexpected_error", { module: t(langKeys.blacklist).toLocaleLowerCase() })
            dispatch(showSnackbar({ show: true, success: false, message: errormessage }))
            dispatch(showBackdrop(false));
            setWaitExport(false);
        }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resExportData, waitExport]);

  useEffect(() => {
    if (!(Object.keys(selectedRows).length === 0 && personsSelected.length === 0)) {
        setPersonsSelected(p => Object.keys(selectedRows).map(x => mainPaginated.data.find(y => y.leadid === parseInt(x)) || p.find(y => y.leadid === parseInt(x)) || {}))
    }
// eslint-disable-next-line react-hooks/exhaustive-deps
}, [selectedRows])

  return (
      <div style={{ width: '100%', display: 'flex', flexDirection: 'column'}}>
        <div style={{ marginBottom: '34px' }}>
          <div style={{ position: 'fixed', right: '20px' }}>
            <IconButton
              color="default"
              disabled={display === 'BOARD'}
              onClick={() => dispatch(setDisplay('BOARD'))}
              style={{ padding: '5px' }}
            >
              <ViewColumnIcon />
            </IconButton>
            <IconButton
              color="default"
              disabled={display === 'GRID'}
              onClick={() => dispatch(setDisplay('GRID'))}
              style={{ padding: '5px' }}
            >
              <ViewListIcon />
            </IconButton>
          </div>
        </div>
        {display === 'BOARD' &&
        <div style={{ display: "flex", /*justifyContent: "center",*/ height: "100%" }}>
          <DragDropContext onDragEnd={result => onDragEnd(result, dataColumn, setDataColumn)}>
            <Droppable droppableId="all-columns" direction="horizontal" type="column" >
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  style={{display:'flex'}}
                >
                  {dataColumn.map((column, index) => {
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
                                onAddCard={() => history.push(paths.CRM_ADD_LEAD.resolve(column.columnid, column.column_uuid))}
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
                                                            onCloseLead={handleCloseLead}
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
          {/* <AddColumnTemplate onSubmit={(columnTitle) =>{ handleInsert(columnTitle,dataColumn, setDataColumn)}} /> */}
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
        }
        {display === 'GRID' &&
        <div style={{ width: 'inherit' }}>
          <div className={classes.containerFilter}>
            <div style={{ display: 'flex', gap: 8 }}>
              <FieldSelect
                  variant="outlined"
                  label={t(langKeys.user)}
                  className={classes.filterComponent}
                  onChange={(value) => setAllParameters({...allParameters, asesorid: value?.userid})}
                  data={mainMulti.data[2]?.data?.sort((a, b) => a?.fullname?.toLowerCase() > b?.fullname?.toLowerCase() ? 1 : -1) || []}
                  optionDesc={'fullname'}
                  optionValue={'userid'}
              />
              <FieldMultiSelect
                  variant="outlined"
                  label={t(langKeys.channel)}
                  className={classes.filterComponent}
                  onChange={(value) => setAllParameters({...allParameters, channel: value?.map((o: Dictionary) => o['communicationchannelid']).join(',')})}
                  data={mainMulti.data[3]?.data?.sort((a, b) => a?.communicationchanneldesc?.toLowerCase() > b?.communicationchanneldesc?.toLowerCase() ? 1 : -1) || []}
                  optionDesc={'communicationchanneldesc'}
                  optionValue={'communicationchannelid'}
              />
              <FieldEdit
                  size="small"
                  variant="outlined"
                  label={t(langKeys.customer)}
                  className={classes.filterComponent}
                  onChange={(value) => setAllParameters({...allParameters, contact: value})}
              />
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <Button
                  variant="contained"
                  color="primary"
                  disabled={mainPaginated.loading || Object.keys(selectedRows).length === 0}
                  startIcon={<HSMIcon width={24} style={{ fill: '#FFF' }} />}
                  onClick={() => setGridModal({name: 'MESSAGE', open: true, payload: { persons: personsSelected, messagetype: 'HSM' }}) }
              >
                  <Trans i18nKey={langKeys.send_hsm} />
              </Button>
              <Button
                  variant="contained"
                  color="primary"
                  disabled={mainPaginated.loading || Object.keys(selectedRows).length === 0}
                  startIcon={<MailIcon width={24} style={{ fill: '#FFF' }} />}
                  onClick={() => setGridModal({name: 'MESSAGE', open: true, payload: { persons: personsSelected, messagetype: 'MAIL' }}) }
              >
                  <Trans i18nKey={langKeys.send_mail} />
              </Button>
              <Button
                  variant="contained"
                  color="primary"
                  disabled={mainPaginated.loading || Object.keys(selectedRows).length === 0}
                  startIcon={<SmsIcon width={24} style={{ fill: '#FFF' }} />}
                  onClick={() => setGridModal({name: 'MESSAGE', open: true, payload: { persons: personsSelected, messagetype: 'SMS' }}) }
              >
                  <Trans i18nKey={langKeys.send_sms} />
              </Button>
            </div>
          </div>
            <TablePaginated
              columns={columns}
              data={mainPaginated.data}
              totalrow={totalrow}
              loading={mainPaginated.loading}
              pageCount={pageCount}
              filterrange={true}
              download={true}
              fetchData={fetchGridData}
              autotrigger={true}
              autoRefresh={{value: autoRefresh, callback: (value) => setAutoRefresh(value) }}
              ButtonsElement={() => (<div></div>)}
              exportPersonalized={triggerExportData}
              useSelection={true}
              selectionFilter={{ key: 'status', value: 'ACTIVO' }}
              selectionKey={selectionKey}
              setSelectedRows={setSelectedRows}
              onClickRow={onClickRow}
            />
          {gridModal.name === 'ACTIVITY' && <NewActivityModal
            gridModalProps={gridModal}
            setGridModal={setGridModal}
            setAutoRefresh={setAutoRefresh}
          />}
          {gridModal.name === 'NOTE' && <NewNoteModal
            gridModalProps={gridModal}
            setGridModal={setGridModal}
            setAutoRefresh={setAutoRefresh}
          />}
          {gridModal.name === 'MESSAGE' && <DialogSendTemplate
            gridModalProps={gridModal}
            setGridModal={setGridModal}
          />}
        </div>
        }
      </div>
    );
};
export default CRM;
