import { convertLocalDate, getAdviserFilteredUserRol, getCampaignLst, getColumnsSel, getCommChannelLst, getLeadExport, getLeadsSel, getLeadTasgsSel, getPaginatedLead, getValuesFromDomain, insArchiveLead, insColumns, 
  insLead2, updateColumnsLeads, updateColumnsOrder, uuidv4 } from "common/helpers";
import React, { FC, useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch } from 'react-redux';
import { useSelector } from 'hooks';
import { DragDropContext, Droppable, Draggable, DropResult } from "react-beautiful-dnd";
import { AddColumnTemplate, DraggableLeadCardContent, DraggableLeadColumn, DroppableLeadColumnList } from "./components";
import { getMultiCollection, resetAllMain, execute, getCollectionPaginated, exportData } from "store/main/actions";
import NaturalDragAnimation from "./prueba";
import paths from "common/constants/paths";
import { useHistory, useLocation } from "react-router";
import { manageConfirmation, showBackdrop, showSnackbar } from "store/popus/actions";
import { langKeys } from "lang/keys";
import { Trans, useTranslation } from "react-i18next";
import { DialogZyx3Opt, FieldEdit, FieldMultiSelect, FieldSelect } from "components";
import { Search as SearchIcon, ViewColumn as ViewColumnIcon, ViewList as ViewListIcon, AccessTime as AccessTimeIcon, Note as NoteIcon, Sms as SmsIcon, Mail as MailIcon, Add as AddIcon } from '@material-ui/icons';
import { Button, IconButton } from "@material-ui/core";
import PhoneIcon from '@material-ui/icons/Phone';
import { Dictionary, ICampaignLst, IChannel, ICrmLead, IDomain, IFetchData } from "@types";
import TablePaginated, { buildQueryFilters, useQueryParams } from 'components/fields/table-paginated';
import { makeStyles } from '@material-ui/core/styles';
import { Rating } from '@material-ui/lab';
import { DialogSendTemplate, NewActivityModal, NewNoteModal } from "./Modals";
import { WhatsappIcon } from "icons";
import { setModalCall, setPhoneNumber } from "store/voximplant/actions";

interface dataBackend {
  columnid: number,
  column_uuid: string,
  description: string,
  status: string,
  type: string,
  globalid: string,
  index: number,
  total_revenue?: number | null,
  items?: ICrmLead[] | null
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
  canvasFiltersHeader: {
    margin: theme.spacing(1),
    display: 'flex',
    flexDirection: 'row',
    gap: '1em',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
}));

const selectionKey = 'leadid';

interface IModalProps {
  name: string;
  open: boolean;
  payload: Dictionary | null;
}

interface IBoardFilter {
  /**ID de la campaña */
  campaign: number;
  /**filtro por nombre completo */
  customer: string;
  /**separado por comas */
  products: string;
  /**separados por coma */
  tags: string;
  /**id del asesor */
  asesorid: number;
}

const DraggablesCategories : FC<{column:any,deletable:boolean, index:number, hanldeDeleteColumn:(a:string)=>void, handleDelete:(lead: ICrmLead)=>void, handleCloseLead:(lead: ICrmLead)=>void}> = ({column, 
  index, hanldeDeleteColumn, handleDelete, handleCloseLead, deletable }) => {
    const { t } = useTranslation();
  return (
    <Draggable draggableId={column.column_uuid} index={index+1} key={column.column_uuid}>
      { (provided) => (
        <div
          {...provided.draggableProps}
          ref={provided.innerRef}
        >
          <DraggableLeadColumn 
            title={t(column.description.toLowerCase())}
            key={index+1} 
            snapshot={null} 
            provided={provided} 
            // titleOnChange={(val) =>{handleEdit(column.column_uuid,val,dataColumn, setDataColumn)}}
            columnid={column.column_uuid} 
            deletable={deletable}
            onDelete={hanldeDeleteColumn}
            total_revenue={column.total_revenue!}
            // onAddCard={() => history.push(paths.CRM_ADD_LEAD.resolve(column.columnid, column.column_uuid))}
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
                      {column.items?.map((item:any, index:any) => {
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
  )
}

const CRM: FC = () => {
  const user = useSelector(state => state.login.validateToken.user);
  const history = useHistory();
  const location = useLocation();
  const dispatch = useDispatch();
  const [dataColumn, setDataColumn] = useState<dataBackend[]>([])
  const [openDialog, setOpenDialog] = useState(false);
  const [deleteColumn, setDeleteColumn] = useState('')
  // const display = useSelector(state => state.lead.display);
  const mainMulti = useSelector(state => state.main.multiData);
  const { t } = useTranslation();
  const classes = useStyles();

  const query = useMemo(() => new URLSearchParams(location.search), [location]);
  const params = useQueryParams(query, {
    ignore: [
      'asesorid', 'channels', 'contact', 'display', 'products', 'tags', 'campaign',
    ],
  });
  const otherParams = useMemo(() => ({
    asesorid: Number(query.get('asesorid')),
    channels: query.get('channels') || '',
    contact: query.get('contact') || '',
    products: query.get('products') || '',
    tags: query.get('tags') || '',
    campaign: Number(query.get('campaign')),
  }), [query]);
  const [display, setDisplay] = useState(query.get('display') || 'BOARD');
  const [boardFilter, setBoardFilterPrivate] = useState<IBoardFilter>({
    campaign: otherParams.campaign,
    customer: otherParams.contact,
    products: otherParams.products,
    tags: otherParams.tags,
    asesorid: otherParams.asesorid,
  });

  const setBoardFilter = useCallback((prop: React.SetStateAction<typeof boardFilter>) => {
    if (!user) return;

    if (user.roledesc === "ASESOR") {
      setBoardFilterPrivate({
        ...(typeof prop === "function" ? prop(boardFilter) : prop),
        asesorid: user.userid,
      });
    } else {
      setBoardFilterPrivate(prop);
    }
  }, [user, boardFilter]);

  useEffect(() => {
      dispatch(getMultiCollection([
          getColumnsSel(1),
          getLeadsSel({
            id: 0,
            campaignid: boardFilter.campaign,
            fullname: boardFilter.customer,
            leadproduct: boardFilter.products,
            tags: boardFilter.tags,
            userid: boardFilter.asesorid,
            supervisorid: user?.userid || 0,
          }),
          // adviserSel(),
          getAdviserFilteredUserRol(),
          getCommChannelLst(),
          getCampaignLst(),
          getValuesFromDomain('OPORTUNIDADPRODUCTOS'),
          getLeadTasgsSel(),
      ]));
      return () => {
          dispatch(resetAllMain());
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);

  useEffect(() => {
    if (!mainMulti.error && !mainMulti.loading) {
      if (mainMulti.data.length && mainMulti.data[0].key && mainMulti.data[0].key === "UFN_COLUMN_SEL") {
        const columns = (mainMulti.data[0] && mainMulti.data[0].success ? mainMulti.data[0].data : []) as dataBackend[]
        const leads = (mainMulti.data[1] && mainMulti.data[1].success ? mainMulti.data[1].data : []) as ICrmLead[]
        let unordeneddatacolumns = columns.map((column) => {
          column.items = leads.filter( x => x.column_uuid === column.column_uuid);
          return {...column, total_revenue: (column.items.reduce((a,b) => a + parseFloat(b.expected_revenue), 0))}
        })
        let ordereddata = [...unordeneddatacolumns.filter((x:any)=>x.type==="NEW"),
          ...unordeneddatacolumns.filter((x)=>x.type==="QUALIFIED"),
          ...unordeneddatacolumns.filter((x)=>x.type==="PROPOSITION"),
          ...unordeneddatacolumns.filter((x)=>x.type==="WON"),
        ];
        console.log(unordeneddatacolumns)
        console.log(ordereddata)
        setDataColumn(ordereddata)
      }
    }
  },[mainMulti]);

  const fetchBoardLeadsWithFilter = useCallback(() => {
    const newParams = new URLSearchParams(location.search);
    newParams.set('campaign', String(boardFilter.campaign));
    newParams.set('products', String(boardFilter.products));
    newParams.set('tags', String(boardFilter.tags));
    newParams.set('contact', String(boardFilter.customer));
    newParams.set('asesorid', String(boardFilter.asesorid));
    history.push({ search: newParams.toString() });

    dispatch(getMultiCollection([
      getColumnsSel(1),
      getLeadsSel({
        id: 0,
        campaignid: boardFilter.campaign,
        fullname: boardFilter.customer,
        leadproduct: boardFilter.products,
        tags: boardFilter.tags,
        userid: boardFilter.asesorid,
        supervisorid: user?.userid || 0,
      }),
      // adviserSel(),
      getAdviserFilteredUserRol(),
      getCommChannelLst(),
      getCampaignLst(),
      getValuesFromDomain('OPORTUNIDADPRODUCTOS'),
      getLeadTasgsSel(),
    ]));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [boardFilter, dispatch]);

  const onDragEnd = (result:DropResult, columns:dataBackend[], setDataColumn:any) => {
    if (!result.destination) return;
    const { source, destination, type } = result;
  
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
    }
  };

  const handleCloseLead = (lead: ICrmLead) => {
    const callback = () => {
      const index = dataColumn.findIndex(c => c.column_uuid === lead.column_uuid)
      const column = dataColumn[index];
      const copiedItems = [...column.items!!]
      const leadIndex = copiedItems.findIndex(l => l.leadid === lead.leadid)//v
      copiedItems!.splice(leadIndex, 1); //v
      const totalRevenue = copiedItems!.reduce((a,b) => a + parseFloat(b.expected_revenue), 0)
      const newData = Object.values({...dataColumn, [index]: {...column, total_revenue: totalRevenue, items: copiedItems}}) as dataBackend[]
      setDataColumn(newData);
      dispatch(execute(insArchiveLead(lead)))
    }
    dispatch(manageConfirmation({
      visible: true,
      question: t(langKeys.confirmation_close),
      callback
    }))
  }

  const handleDelete = (lead: ICrmLead) => {
    const callback = () => {
      const index = dataColumn.findIndex(c => c.column_uuid === lead.column_uuid)
      const column = dataColumn[index];
      const copiedItems = [...column.items!!]
      const leadIndex = copiedItems.findIndex(l => l.leadid === lead.leadid)
      copiedItems!.splice(leadIndex, 1);
      const totalRevenue = copiedItems!.reduce((a,b) => a + parseFloat(b.expected_revenue), 0)
      const newData = Object.values({...dataColumn, [index]: {...column, total_revenue: totalRevenue, items: copiedItems}}) as dataBackend[]
      setDataColumn(newData);
      dispatch(execute(insLead2({ ...lead, status: 'ELIMINADO' }, "DELETE")));
    }
    dispatch(manageConfirmation({
      visible: true,
      question: t(langKeys.confirmation_delete),
      callback
    }))
  }

  // No borrar
  const handleInsert = (infa:any, columns:dataBackend[], setDataColumn:any) => {
    const newIndex = columns.length
    const uuid = uuidv4() // from common/helpers

    const data = {
      id: uuid,
      description: infa.title,
      type: infa.type,
      status: 'ACTIVO',
      edit: true,
      index: newIndex,
      operation: 'INSERT',
    }
    
    const newColumn = {
      columnid: null,
      column_uuid: uuid,
      description: infa.title,
      status: 'ACTIVO',
      type: infa.type,
      globalid: '',
      index: newIndex,
      items: []
    }
    let unordeneddatacolumns = Object.values({...columns, newColumn})
    let ordereddata = [...unordeneddatacolumns.filter((x:any)=>x.type==="NEW"),
      ...unordeneddatacolumns.filter((x:any)=>x.type==="QUALIFIED"),
      ...unordeneddatacolumns.filter((x:any)=>x.type==="PROPOSITION"),
      ...unordeneddatacolumns.filter((x:any)=>x.type==="WON"),
    ];
    dispatch(execute(insColumns(data)))
    setDataColumn(Object.values(ordereddata));
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
        const newDestItems = [...destColumn.items!].concat(removed)
        newDestItems.map((item) => item.column_uuid = destColumn.column_uuid)
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

  const initialAsesorId = useMemo(() => {
    if (!user) return 0;
    if (user.roledesc === "ASESOR") return user.userid;
    else return otherParams.asesorid || mainMulti.data[2]?.data?.map(d => d.userid).includes(user?.userid) ? (user?.userid || 0) : 0;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [otherParams, user]);

  const mainPaginated = useSelector(state => state.main.mainPaginated);
  const resExportData = useSelector(state => state.main.exportData);
  const [pageCount, setPageCount] = useState(0);
  const [totalrow, settotalrow] = useState(0);
  const [fetchDataAux, setfetchDataAux] = useState<IFetchData>({ pageSize: 20, pageIndex: 0, filters: {}, sorts: {}, daterange: null })
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [waitExport, setWaitExport] = useState(false);
  const voxiConnection = useSelector(state => state.voximplant.connection);
  const statusCall = useSelector(state => state.voximplant.statusCall);
  const userConnected = useSelector(state => state.inbox.userConnected);
  const [allParameters, setAllParametersPrivate] = useState<{ contact: string, channel: string, asesorid: number }>({
    // asesorid: otherParams.asesorid || mainMulti.data[2]?.data?.map(d => d.userid).includes(user?.userid) ? (user?.userid || 0) : 0,
    asesorid: initialAsesorId,
    channel: otherParams.channels,
    contact: otherParams.contact,
  });
  const [selectedRows, setSelectedRows] = useState<Dictionary>({});
  const [personsSelected, setPersonsSelected] = useState<Dictionary[]>([]);
  const [gridModal, setGridModal] = useState<IModalProps>({ name: '', open: false, payload: null });

  const setAllParameters = useCallback((prop: typeof allParameters) => {
    if (!user) return;

    if (user.roledesc === "ASESOR" && prop.asesorid !== user.userid) {
      setAllParametersPrivate({ ...prop, asesorid: user.userid });
    } else {
      setAllParametersPrivate(prop);
    }
  }, [user]);

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
                value={row['priority'] === 'LOW' ? 1 : row['priority'] === 'MEDIUM' ? 2 : row['priority'] === 'HIGH' ? 3 : 1}
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
          console.log((!voxiConnection.error && !voxiConnection.loading && statusCall!=="CONNECTED" && userConnected && statusCall!=="CONNECTING" && !!row.phone))
          if (row.status === 'ACTIVO') {
            return (
              <React.Fragment>
                <div style={{display: 'flex'}}>
                  <IconButton
                    aria-label="more"
                    aria-controls="long-menu"
                    aria-haspopup="true"
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      setGridModal({name: 'MESSAGE', open: true, payload: { persons: [row], messagetype: 'HSM' }})
                    }}
                  >
                    <WhatsappIcon
                      width={24}
                      style={{ fill: 'rgba(0, 0, 0, 0.54)' }}
                    />
                  </IconButton>
                  <IconButton
                    aria-label="more"
                    aria-controls="long-menu"
                    aria-haspopup="true"
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      setGridModal({name: 'MESSAGE', open: true, payload: { persons: [row], messagetype: 'MAIL' }}) 
                    }}
                  >
                    <MailIcon color="action" />
                  </IconButton>
                  <IconButton
                    aria-label="more"
                    aria-controls="long-menu"
                    aria-haspopup="true"
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      setGridModal({name: 'MESSAGE', open: true, payload: { persons: [row], messagetype: 'SMS' }}) 
                    }}
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
                    onClick={(e) => {
                      e.stopPropagation();
                      setGridModal({name: 'ACTIVITY', open: true, payload: {leadid: row['leadid']}}) 
                    }}
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
                    onClick={(e) => {
                      e.stopPropagation();
                      setGridModal({name: 'NOTE', open: true, payload: {leadid: row['leadid']}}) 
                    }}
                  >
                    <NoteIcon
                      titleAccess={t(langKeys.logNote)}
                      color="action" 
                    />
                  </IconButton>
                  {(!voxiConnection.error && !voxiConnection.loading && statusCall!=="CONNECTED" && userConnected && statusCall!=="CONNECTING" && !!row.phone) &&
                    <IconButton
                      aria-label="more"
                      aria-controls="long-menu"
                      aria-haspopup="true"
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        dispatch(setPhoneNumber(row.phone))
                        dispatch(setModalCall(true))
                      }}
                    >
                      <PhoneIcon color="action" titleAccess={t(langKeys.make_call)}/>
                    </IconButton>
                  }
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
    [voxiConnection,statusCall]
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
          ...allParameters,
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
    const columnsExport = [
      ...columns.filter(x => !x.isComponent && x.accessor !== 'comments').map(x => ({
        key: x.accessor,
        alias: x.Header,
      })),
      { key: 'notedescription', alias: t(langKeys.notedescription) }, // parte de la columna comments
      { key: 'activitydescription', alias: t(langKeys.activitydescription) }, // parte de la columna comments
    ];
    dispatch(exportData(getLeadExport(
      {
        startdate: daterange.startDate!,
        enddate: daterange.endDate!,
        sorts: sorts,
        filters: filters,
        ...allParameters
      }), "", "excel", false, columnsExport));
    dispatch(showBackdrop(true));
    setWaitExport(true);
  };

  const goToAddLead = useCallback(() => {
    history.push(paths.CRM_ADD_LEAD);
  }, [history]);

  useEffect(() => {
    if (waitExport) {
        if (!resExportData.loading && !resExportData.error) {
            dispatch(showBackdrop(false));
            setWaitExport(false);
            window.open(resExportData.url, '_blank');
        } else if (resExportData.error) {
            const errormessage = t(resExportData.code || "error_unexpected_error", { module: t(langKeys.blacklist).toLocaleLowerCase() })
            dispatch(showSnackbar({ show: true, severity: "error", message: errormessage }))
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

  useEffect(() => {
    const p = new URLSearchParams(location.search);
    p.set('display', display);
    history.push({ search: p.toString() });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [display, history]);

  const campaigns = useMemo(() => {
    if (!mainMulti.data[4]?.data || mainMulti.data[4]?.key !== "UFN_CAMPAIGN_LST") return [];
    return (mainMulti.data[4].data as ICampaignLst[]).sort((a, b) => {
      return a.description.localeCompare(b.description);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mainMulti.data[4]]);

  const tags = useMemo(() => {
    if (!mainMulti.data[6]?.data || mainMulti.data[6]?.key !== "UFN_LEAD_TAGSDISTINCT_SEL") return [];
    return (mainMulti.data[6].data as any[]).sort((a, b) => {
      return a.tags?.localeCompare(b.tags || '') || 0;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mainMulti.data[6]]);

  const channels = useMemo(() => {
    if (!mainMulti.data[3]?.data || mainMulti.data[3]?.key !== "UFN_COMMUNICATIONCHANNEL_LST") return [];
    return (mainMulti.data[3].data as IChannel[]).sort((a, b) => {
      return a.communicationchanneldesc.localeCompare(b.communicationchanneldesc);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mainMulti.data[3]]);

  const filtersElement = useMemo(() => (
    <>
      {(user && user.roledesc !== "ASESOR") && <FieldSelect
        variant="outlined"
        label={t(langKeys.agent)}
        className={classes.filterComponent}
        valueDefault={allParameters.asesorid}
        onChange={(value) => setAllParameters({...allParameters, asesorid: value?.userid})}
        data={mainMulti.data[2]?.data?.sort((a, b) => a?.fullname?.toLowerCase() > b?.fullname?.toLowerCase() ? 1 : -1) || []}
        optionDesc={'fullname'}
        optionValue={'userid'}
        disabled={user?.roledesc === "ASESOR" || false}
      />}
      <FieldMultiSelect
          variant="outlined"
          label={t(langKeys.channel)}
          className={classes.filterComponent}
          valueDefault={allParameters.channel}
          onChange={(value) => setAllParameters({...allParameters, channel: value?.map((o: Dictionary) => o['communicationchannelid']).join(',')})}
          data={channels}
          optionDesc={'communicationchanneldesc'}
          optionValue={'communicationchannelid'}
      />
      <FieldEdit
          size="small"
          variant="outlined"
          label={t(langKeys.customer)}
          className={classes.filterComponent}
          valueDefault={allParameters.contact}
          onChange={(value) => setAllParameters({...allParameters, contact: value})}
      />
    </>
    // eslint-disable-next-line react-hooks/exhaustive-deps
  ), [user, allParameters, classes, mainMulti, t]);

  return (
      <div style={{ width: '100%', display: 'flex', flexDirection: 'column'}}>
        <div style={{ marginBottom: '34px' }}>
          <div style={{ position: 'fixed', right: '20px' }}>
            <IconButton
              color="default"
              disabled={display === 'BOARD'}
              onClick={() => setDisplay('BOARD')}
              style={{ padding: '5px' }}
            >
              <ViewColumnIcon />
            </IconButton>
            <IconButton
              color="default"
              disabled={display === 'GRID'}
              onClick={() => setDisplay('GRID')}
              style={{ padding: '5px' }}
            >
              <ViewListIcon />
            </IconButton>
          </div>
        </div>
        {display === 'BOARD' &&
        <div style={{ display: "flex", flexDirection: 'column', height: "100%" }}>
          <div className={classes.canvasFiltersHeader}>
            {(user && user.roledesc !== "ASESOR") && <FieldSelect
              variant="outlined"
              label={t(langKeys.agent)}
              className={classes.filterComponent}
              valueDefault={boardFilter.asesorid}
              onChange={(value) => setBoardFilter(prev => ({...prev, asesorid: value?.userid || 0}))}
              data={mainMulti.data[2]?.data?.sort((a, b) => a?.fullname?.toLowerCase() > b?.fullname?.toLowerCase() ? 1 : -1) || []}
              optionDesc="fullname"
              optionValue="userid"
              loading={mainMulti.loading}
              disabled={user?.roledesc === "ASESOR" || false}
            />}
            <FieldSelect
              variant="outlined"
              label={t(langKeys.campaign)}
              className={classes.filterComponent}
              valueDefault={boardFilter.campaign}
              onChange={(v: ICampaignLst) => setBoardFilter(prev => ({ ...prev, campaign: v?.id || 0 }))}
              data={campaigns}
              loading={mainMulti.loading}
              optionDesc="description"
              optionValue="id"
            />
            <FieldMultiSelect
              variant="outlined"
              label={t(langKeys.product, { count: 2 })}
              className={classes.filterComponent}
              valueDefault={boardFilter.products}
              onChange={(v) => {
                const products = v?.map((o: IDomain) => o.domainvalue).join(',') || '';
                setBoardFilter(prev => ({ ...prev, products }));
              }}
              data={mainMulti.data[5]?.data || []}
              loading={mainMulti.loading}
              optionDesc="domaindesc"
              optionValue="domainvalue"
            />
            <FieldMultiSelect
              variant="outlined"
              label={t(langKeys.tag, { count: 2 })}
              className={classes.filterComponent}
              valueDefault={boardFilter.tags}
              onChange={(v) => {
                const tags = v?.map((o: any) => o.tags).join(',') || '';
                setBoardFilter(prev => ({ ...prev, tags }));
              }}
              data={tags}
              loading={mainMulti.loading}
              optionDesc="tags"
              optionValue="tags"
            />
            <FieldEdit
              size="small"
              variant="outlined"
              valueDefault={boardFilter.customer}
              label={t(langKeys.customer)}
              className={classes.filterComponent}
              disabled={mainMulti.loading}
              onChange={(v: string) => setBoardFilter(prev => ({ ...prev, customer: v }))}
            />
            <div style={{ flexGrow: 1 }} />
            <Button
                variant="contained"
                color="primary"
                disabled={mainMulti.loading}
                startIcon={<AddIcon color="secondary" />}
                onClick={goToAddLead}
                style={{ backgroundColor: "#55BD84" }}
              >
                <Trans i18nKey={langKeys.register} />
            </Button>
            <Button
                variant="contained"
                color="primary"
                startIcon={<SearchIcon style={{ color: 'white' }} />}
                style={{ backgroundColor: '#55BD84', width: 120 }}
                onClick={fetchBoardLeadsWithFilter}
                disabled={mainMulti.loading}
            >
                <Trans i18nKey={langKeys.search} />
            </Button>
          </div>
          <AddColumnTemplate onSubmit={(data) =>{ handleInsert(data,dataColumn, setDataColumn)}} /> 
          <div style={{display:"flex", color: "white", paddingTop: 10, fontSize: "1.6em", fontWeight: "bold"}}>
            <div style={{minWidth: 280, maxWidth: 280, backgroundColor:"#aa53e0", padding:"10px 0", margin: "0 5px", display: "flex", overflow: "hidden", maxHeight: "100%", textAlign: "center", flexDirection: "column",}}>{t(langKeys.new)}</div>
            <div style={{minWidth: 280*dataColumn.filter((x:any)=>x.type==="QUALIFIED").length + 10*(dataColumn.filter((x:any)=>x.type==="QUALIFIED").length-1), 
                        maxWidth: 280*dataColumn.filter((x:any)=>x.type==="QUALIFIED").length + 10*(dataColumn.filter((x:any)=>x.type==="QUALIFIED").length-1), backgroundColor:"#aa53e0", padding:"10px 0", margin: "0 5px", display: "flex", overflow: "hidden", maxHeight: "100%", textAlign: "center", flexDirection: "column",}}>{t(langKeys.qualified)}</div>
            <div style={{minWidth: 280*dataColumn.filter((x:any)=>x.type==="PROPOSITION").length + 10*(dataColumn.filter((x:any)=>x.type==="PROPOSITION").length-1), 
                        maxWidth: 280*dataColumn.filter((x:any)=>x.type==="PROPOSITION").length + 10*(dataColumn.filter((x:any)=>x.type==="PROPOSITION").length-1), backgroundColor:"#aa53e0", padding:"10px 0", margin: "0 5px", display: "flex", overflow: "hidden", maxHeight: "100%", textAlign: "center", flexDirection: "column",}}>{t(langKeys.proposition)}</div>
            <div style={{minWidth: 280*dataColumn.filter((x:any)=>x.type==="WON").length + 10*(dataColumn.filter((x:any)=>x.type==="WON").length-1), 
                        maxWidth: 280*dataColumn.filter((x:any)=>x.type==="WON").length + 10*(dataColumn.filter((x:any)=>x.type==="WON").length-1), backgroundColor:"#aa53e0", padding:"10px 0", margin: "0 5px", display: "flex", overflow: "hidden", maxHeight: "100%", textAlign: "center", flexDirection: "column",}}>{t(langKeys.won)}</div>
          </div>
          <DragDropContext onDragEnd={result => onDragEnd(result, dataColumn, setDataColumn)}>
            <Droppable droppableId="all-columns" direction="horizontal" type="column" >
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  style={{display:'flex'}}
                >
                  {dataColumn.map((column, index) => 
                       <DraggablesCategories deletable={dataColumn.filter((x:any)=>x.type===column.type).length >1} column={column} index={index} hanldeDeleteColumn={hanldeDeleteColumn} handleDelete={handleDelete} handleCloseLead={handleCloseLead}/>
                  )}
                </div>
              )}
            </Droppable>
          </DragDropContext>
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
              
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <Button
                  variant="contained"
                  color="primary"
                  disabled={mainPaginated.loading || Object.keys(selectedRows).length === 0}
                  startIcon={<WhatsappIcon width={24} style={{ fill: '#FFF' }} />}
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
              FiltersElement={filtersElement}
              onFilterChange={f => {
                const params = buildQueryFilters(f, location.search);
                params.set('asesorid', String(allParameters.asesorid));
                params.set('channels', String(allParameters.channel));
                params.set('contact', String(allParameters.contact));
                history.push({ search: params.toString() });
              }}
              initialEndDate={params.endDate}
              initialStartDate={params.startDate}
              initialFilters={params.filters}
              initialPageIndex={params.page}
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
