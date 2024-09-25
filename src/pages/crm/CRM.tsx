import { convertLocalDate, getAdviserFilteredUserRol, getCampaignLst, getColumnsSel, getCommChannelLst, getLeadExport, getLeadsSel, getLeadTasgsSel, getPaginatedLead, getValuesFromDomain, insArchiveLead, insColumns, insLead2, updateColumnsLeads, updateColumnsOrder, uuidv4 } from "common/helpers";
import React, { FC, useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch } from 'react-redux';
import { useSelector } from 'hooks';
import { DragDropContext, Droppable, Draggable, DropResult } from "react-beautiful-dnd";
import { AddColumnTemplate, DraggableLeadCardContent, DraggableLeadColumn, DroppableLeadColumnList } from "./components";
import { getMultiCollection, execute, getCollectionPaginated, exportData } from "store/main/actions";
import NaturalDragAnimation from "./prueba";
import paths from "common/constants/paths";
import { useHistory, useLocation } from "react-router";
import { manageConfirmation, showBackdrop, showSnackbar } from "store/popus/actions";
import { langKeys } from "lang/keys";
import { useTranslation } from "react-i18next";
import { DialogZyx, DialogZyx3Opt, FieldEdit, FieldMultiSelect, FieldSelect } from "components";
import { ViewColumn as ViewColumnIcon, ViewList as ViewListIcon, AccessTime as AccessTimeIcon, Note as NoteIcon, Sms as SmsIcon, Mail as MailIcon} from '@material-ui/icons';
import TuneIcon from '@material-ui/icons/Tune';
import { ClickAwayListener, Divider, IconButton, ListItemIcon, MenuItem, Paper, Popper, Tooltip, Typography } from "@material-ui/core";
import PhoneIcon from '@material-ui/icons/Phone';
import { Dictionary, ICampaignLst, IChannel, ICrmLead, IDomain, IFetchData } from "@types";
import TablePaginated, { buildQueryFilters, useQueryParams } from 'components/fields/table-paginated';
import { makeStyles } from '@material-ui/core/styles';
import { Rating } from '@material-ui/lab';
import { DialogSendTemplate, NewActivityModal, NewNoteModal } from "./Modals";
import { WhatsappIcon } from "icons";
import { setModalCall, setPhoneNumber } from "store/voximplant/actions";
const isIncremental = window.location.href.includes("incremental")
import MoreVertIcon from '@material-ui/icons/MoreVert';
import useColumnWidths from "./components/useColumnWidths";

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
    button: {
        backgroundColor: '#ffff',
        color: '#7721AD',
        '&:hover': {
            backgroundColor: '#EBEAED',
            borderRadius: 4
        }
    },
    errorModalContent: {
        backgroundColor: 'white',
        borderRadius: '8px',
        padding: '20px',
        textAlign: 'center',
    },
    text: {
        alignSelf: "center",
        marginLeft: '25px',
        fontSize: 16
    },
    addBtn: {
        width: 35,
        height: 35,

        display: "flex",
        justifyContent: "center",
        alignItems: "center",

    },
    addBtnContainer: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-start",
        backgroundColor: "inherit",
        position: "relative",
        height: 35,
        width: "fit-content",
    },
    newTitle: {
        height: 70,                       
        backgroundColor: "#F9F9FA", 
        padding: "14px 0 1px 0", 
        marginLeft: "5px",                              
        display: "flex", 
        overflow: "hidden", 
        maxHeight: "100%", 
        textAlign: "center", 
        flexDirection: "column",
        borderTopLeftRadius: '20px',
        borderTopRightRadius: '20px',
        borderBottomLeftRadius: '0px',
        borderBottomRightRadius: '0px',
    },
    otherTitles: {
        height: 70,                       
        backgroundColor: "#F9F9FA", 
        padding: "14px 0 1px 0", 
        marginLeft: "21px",                          
        display: "flex", 
        overflow: "hidden", 
        maxHeight: "100%", 
        textAlign: "center", 
        flexDirection: "column",
        borderTopLeftRadius: '20px',
        borderTopRightRadius: '20px',
        borderBottomLeftRadius: '0px',
        borderBottomRightRadius: '0px',    
    },
    columnsTitles: {
        display: "flex", 
        color: "white", 
        paddingTop: 10, 
        fontSize: "20px", 
        fontWeight: "bold" 
    },
    greyPart: {
        height: 45,                       
        backgroundColor: "#AFAFAF", 
        padding: "5px 0", 
        margin: "2px 15px",                          
        display: "flex", 
        overflow: "hidden", 
        maxHeight: "100%", 
        textAlign: "center", 
        flexDirection: "column",
        borderRadius: '20px',
    },
    otherGreyPart: {
        height: 45,                       
        backgroundColor: "#AFAFAF", 
        padding: "5px 0", 
        margin: "2px 15px 0 15px",                        
        display: "flex", 
        overflow: "hidden", 
        maxHeight: "100%", 
        textAlign: "center", 
        flexDirection: "column",
        borderRadius: '20px',  
    },
    oportunityList: {
        background: '#F9F9FA',               
        marginRight: '1rem',
        marginLeft: '0.3rem',
        padding: '0 0.6rem 0.5rem 0.6rem',  
        borderTopLeftRadius: '0px',
        borderTopRightRadius: '0px',
        borderBottomLeftRadius: '20px',
        borderBottomRightRadius: '20px', 
    },
    titleDialogZyx: {
        fontSize: 30,
        fontWeight: 'bold'
    },
    titleSection: {
        width: "inherit",
    },
}));

const selectionKey = 'leadid';

interface IModalProps {
    name: string;
    open: boolean;
    payload: Dictionary | null;
}

interface IBoardFilter {
    campaign: number;
    customer: string;
    products: string;
    tags: string;
    asesorid: number;
    persontype: string;
}

const DraggablesCategories: FC<{ column: Dictionary, deletable: boolean, index: number, hanldeDeleteColumn: (a: string) => void, handleDelete: (lead: ICrmLead) => void, handleCloseLead: (lead: ICrmLead) => void, isIncremental: boolean, sortParams: sortParams, configuration: any }> = ({ column,
    index, hanldeDeleteColumn, handleDelete, handleCloseLead, deletable, isIncremental, sortParams, configuration }) => {
    const { t } = useTranslation();
    return (
        <Draggable draggableId={column.column_uuid} index={index + 1} key={column.column_uuid} isDragDisabled={isIncremental}>
        {(provided) => (
            <div
            {...provided.draggableProps}
            ref={provided.innerRef}
            >
            <DraggableLeadColumn
                title={t(column.description.toLowerCase())}
                key={index + 1}
                snapshot={null}
                provided={provided}
                columnid={column.column_uuid}
                deletable={deletable}
                onDelete={hanldeDeleteColumn}
                total_revenue={column.total_revenue!}
                total_cards={column.items.length}
            >
                <Droppable droppableId={column.column_uuid} type="task">
                {(provided, snapshot) => {
                    return (
                    <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        style={{ width: '100%', overflowY:'scroll', maxHeight: '65vh', overflowX:'clip'}}
                    >
                        <DroppableLeadColumnList snapshot={snapshot} itemCount={column.items?.length || 0}>
                        {column.items?.map((item: any, index: any) => {
                            return (                                
                            <Draggable
                                isDragDisabled={isIncremental}
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
                                    {(style: Dictionary) => (
                                        <div
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        {...provided.dragHandleProps}
                                        style={{ width: '100%', ...style }}
                                        >
                                        <DraggableLeadCardContent
                                            lead={item}
                                            snapshot={snapshot}
                                            onDelete={handleDelete}
                                            onCloseLead={handleCloseLead}
                                            configuration={configuration}
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

interface sortParams {
    type: string
    order: string
}

interface Configuration {
    monbegin: string
    monend: string
    tuebegin: string
    tueend: string
    wedbegin: string
    wedend: string
    thubegin: string
    thuend: string
    fribegin: string
    friend: string
    satbegin: string
    satend: string
    sunbegin: string
    sunend: string
    maxgreen: string
    maxyellow: string
}

const CRM: FC = () => {
    const user = useSelector(state => state.login.validateToken.user);
    const history = useHistory();
    const location = useLocation();
    const dispatch = useDispatch();
    const [dataColumn, setDataColumn] = useState<dataBackend[]>([])
    const [openDialog, setOpenDialog] = useState(false);
    const [deleteColumn, setDeleteColumn] = useState('')
    const mainMulti = useSelector(state => state.main.multiData);
    const { t } = useTranslation();
    const classes = useStyles();
    const { newWidth, qualifiedWidth, propositionWidth, wonWidth } = useColumnWidths(dataColumn);
    const query = useMemo(() => new URLSearchParams(location.search), [location]);
    const params = useQueryParams(query, {
        ignore: [
        'asesorid', 'channels', 'contact', 'display', 'products', 'tags', 'campaign', 'persontype'
        ],
    });

    const otherParams = useMemo(() => ({
        asesorid: Number(query.get('asesorid')),
        channels: query.get('channels') || '',
        contact: query.get('contact') || '',
        products: query.get('products') || '',
        persontype: query.get('persontype') || '',
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
        persontype: otherParams.persontype,
    });

    const setBoardFilter = useCallback((prop: React.SetStateAction<typeof boardFilter>) => {
        if (!user) return;
        if (user.roledesc?.includes("ASESOR")) {
        setBoardFilterPrivate({
            ...(typeof prop === "function" ? prop(boardFilter) : prop),
            asesorid: user.userid,
        });
        } else {
        setBoardFilterPrivate(prop);
        }
    }, [user, boardFilter]);

    const [sortParams, setSortParams] = useState({
        type: '',
        order: ''
    })

    const updateSortParams = (value: sortParams) => {
        setSortParams(value)
    }

    useEffect(() => {
        setDataColumn([])
        dispatch(getMultiCollection([
        getColumnsSel(1),
        getLeadsSel({
            id: 0,
            campaignid: boardFilter.campaign,
            fullname: boardFilter.customer,
            leadproduct: boardFilter.products,
            persontype: boardFilter.persontype,
            tags: boardFilter.tags,
            userid: String(boardFilter.asesorid || ""),
            supervisorid: user?.userid || 0,
            ordertype: sortParams.type,
            orderby: sortParams.order,
        }),
        getAdviserFilteredUserRol(),
        getCommChannelLst(),
        getCampaignLst(),
        getValuesFromDomain('OPORTUNIDADPRODUCTOS'),
        getLeadTasgsSel(),
        getValuesFromDomain('TIPOPERSONA'),
        getValuesFromDomain('ORDERTYPE'),
        getValuesFromDomain('ORDERBY'),
        ]));

        return () => {
        //dispatch(resetAllMain());
        };
    }, [dispatch, sortParams]);

    useEffect(() => {
        if (!mainMulti.error && !mainMulti.loading) {
        if (mainMulti.data.length && mainMulti.data[0].key && mainMulti.data[0].key === "UFN_COLUMN_SEL") {
            const columns = (mainMulti.data[0] && mainMulti.data[0].success ? mainMulti.data[0].data : []) as dataBackend[]
            const leads = (mainMulti.data[1] && mainMulti.data[1].success ? mainMulti.data[1].data : []) as ICrmLead[]
            const unordeneddatacolumns = columns.map((column) => {
            column.items = leads.filter(x => x.column_uuid === column.column_uuid);
            return { ...column, total_revenue: (column.items.reduce((a, b) => a + parseFloat(b.expected_revenue), 0)) }
            })
            const ordereddata = [...unordeneddatacolumns.filter((x: Dictionary) => x.type === "NEW"),
            ...unordeneddatacolumns.filter((x) => x.type === "QUALIFIED"),
            ...unordeneddatacolumns.filter((x) => x.type === "PROPOSITION"),
            ...unordeneddatacolumns.filter((x) => x.type === "WON"),
            ];
            setDataColumn(ordereddata)
        }
        }
    }, [mainMulti]);

    const [isModalOpenBOARD, setModalOpenBOARD] = useState(false);
    const [isModalOpenGRID, setModalOpenGRID] = useState(false);

    const fetchBoardLeadsWithFilter = useCallback(async () => {
        try {
            const newParams = new URLSearchParams(location.search);
            newParams.set('campaign', String(boardFilter.campaign));
            newParams.set('products', String(boardFilter.products));
            newParams.set('persontype', String(boardFilter.persontype));
            newParams.set('tags', String(boardFilter.tags));
            newParams.set('contact', String(boardFilter.customer));
            newParams.set('asesorid', String(boardFilter.asesorid));
            history.push({ search: newParams.toString() });
            setDataColumn([])
            await dispatch(getMultiCollection([
                getColumnsSel(1),
                getLeadsSel({
                    id: 0,
                    campaignid: boardFilter.campaign,
                    fullname: boardFilter.customer,
                    leadproduct: boardFilter.products,
                    persontype: boardFilter.persontype,
                    tags: boardFilter.tags,
                    userid: String(boardFilter.asesorid || ""),
                    supervisorid: user?.userid || 0,
                    ordertype: sortParams.type,
                    orderby: sortParams.order,
                }),
                getAdviserFilteredUserRol(),
                getCommChannelLst(),
                getCampaignLst(),
                getValuesFromDomain('OPORTUNIDADPRODUCTOS'),
                getLeadTasgsSel(),
                getValuesFromDomain('TIPOPERSONA'),
                getValuesFromDomain('ORDERTYPE'),
                getValuesFromDomain('ORDERBY'),
            ]));
    
            setModalOpenBOARD(false);
        } catch (error) {
            console.error("Error al aplicar filtros:", error);
        }
    }, [boardFilter, dispatch, location.search, history, setModalOpenBOARD, sortParams, user]);
      

    const onDragEnd = (result: DropResult, columns: dataBackend[], setDataColumn: any) => {
        if (!result.destination) return;
        const { source, destination, type } = result;

        if (type === 'column') {
        const newColumnOrder = [...columns]
        if (newColumnOrder[destination.index - 1].type !== newColumnOrder[source.index - 1].type) return;
        const [removed] = newColumnOrder.splice((source.index - 1), 1)
        newColumnOrder.splice(destination.index - 1, 0, removed)
        setDataColumn(newColumnOrder)
        const columns_uuid = newColumnOrder.slice(1).map(x => x.column_uuid).join(',')
        dispatch(execute(updateColumnsOrder({ columns_uuid })));
        return;
        }

        if (source.droppableId === destination.droppableId) {
        const index = columns.findIndex(c => c.column_uuid === source.droppableId)
        if (index >= 0) {
            const column = columns[index];
            const copiedItems = [...column.items!!]
            const [removed] = copiedItems!.splice(source.index, 1);
            copiedItems!.splice(destination.index, 0, removed);
            setDataColumn(Object.values({ ...columns, [index]: { ...column, items: copiedItems } }));

            const cards_startingcolumn = copiedItems!.map(x => x.leadid).join(',')
            const startingcolumn_uuid = column.column_uuid
            dispatch(execute(updateColumnsLeads({ cards_startingcolumn, cards_finalcolumn: '', startingcolumn_uuid, finalcolumn_uuid: startingcolumn_uuid })));
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
            const date = new Date().toISOString().replace('T', ' ').replace('Z', '')
            removed.lastchangestatusdate = date
            removed.column_uuid = destination.droppableId
            destItems!.splice(destination.index, 0, removed);
            const sourceTotalRevenue = sourceItems!.reduce((a, b) => a + parseFloat(b.expected_revenue), 0)
            const destTotalRevenue = destItems!.reduce((a, b) => a + parseFloat(b.expected_revenue), 0)

            setDataColumn(Object.values({ ...columns, [sourceIndex]: { ...sourceColumn, total_revenue: sourceTotalRevenue, items: sourceItems }, [destIndex]: { ...destColumn, total_revenue: destTotalRevenue, items: destItems } }));

            const cards_startingcolumn = sourceItems!.map(x => x.leadid).join(',')
            const cards_finalcolumn = destItems!.map(x => x.leadid).join(',')
            const startingcolumn_uuid = sourceColumn.column_uuid
            const finalcolumn_uuid = destColumn.column_uuid
            dispatch(execute(updateColumnsLeads({ cards_startingcolumn, cards_finalcolumn, startingcolumn_uuid, finalcolumn_uuid, leadid: removed.leadid })));
        }
        }
    };

    const handleCloseLead = (lead: ICrmLead) => {
        const callback = () => {
        const index = dataColumn.findIndex(c => c.column_uuid === lead.column_uuid)
        const column = dataColumn[index];
        const copiedItems = [...column.items!!]
        const leadIndex = copiedItems.findIndex(l => l.leadid === lead.leadid)
        copiedItems!.splice(leadIndex, 1);
        const totalRevenue = copiedItems!.reduce((a, b) => a + parseFloat(b.expected_revenue), 0)
        const newData = Object.values({ ...dataColumn, [index]: { ...column, total_revenue: totalRevenue, items: copiedItems } }) as dataBackend[]
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
        const totalRevenue = copiedItems!.reduce((a, b) => a + parseFloat(b.expected_revenue), 0)
        const newData = Object.values({ ...dataColumn, [index]: { ...column, total_revenue: totalRevenue, items: copiedItems } }) as dataBackend[]
        setDataColumn(newData);
        dispatch(execute(insLead2({ ...lead, status: 'ELIMINADO' }, "DELETE")));
        }
        dispatch(manageConfirmation({
        visible: true,
        question: t(langKeys.confirmation_delete),
        callback
        }))
    }

    const handleInsert = (infa: Dictionary, columns: dataBackend[], setDataColumn: any) => {
        const newIndex = columns.length
        const uuid = uuidv4()

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
        const unordeneddatacolumns = Object.values({ ...columns, newColumn })
        const ordereddata = [...unordeneddatacolumns.filter((x: any) => x.type === "NEW"),
        ...unordeneddatacolumns.filter((x: any) => x.type === "QUALIFIED"),
        ...unordeneddatacolumns.filter((x: any) => x.type === "PROPOSITION"),
        ...unordeneddatacolumns.filter((x: any) => x.type === "WON"),
        ];
        dispatch(execute(insColumns(data)))
        setDataColumn(Object.values(ordereddata));
    }

    const hanldeDeleteColumn = (column_uuid: string, delete_all: boolean = true) => {
        if (column_uuid === '00000000-0000-0000-0000-000000000000') return;

        if (openDialog) {
        const columns = [...dataColumn]
        const sourceIndex = columns.findIndex(c => c.column_uuid === column_uuid)
        const sourceColumn = columns[sourceIndex];
        let newColumn: dataBackend[] = [];
        if (delete_all) {
            newColumn = columns
        } else {
            const destColumn = columns[0];
            const sourceItems = [...sourceColumn.items!]
            const removed = sourceItems!.splice(0)
            const newDestItems = [...destColumn.items!].concat(removed)
            newDestItems.map((item) => item.column_uuid = destColumn.column_uuid)
            const destTotalRevenue = newDestItems!.reduce((a, b) => a + parseFloat(b.expected_revenue), 0)
            newColumn = Object.values({ ...columns, [sourceIndex]: { ...sourceColumn, items: sourceItems }, 0: { ...destColumn, total_revenue: destTotalRevenue, items: newDestItems } }) as dataBackend[]
        }
        setDataColumn(newColumn.filter(c => c.column_uuid !== column_uuid))
        dispatch(execute(insColumns({ ...sourceColumn, status: 'ELIMINADO', delete_all, id: sourceColumn.column_uuid, operation: 'DELETE' })));
        setOpenDialog(false)

        return;
        } else {
        setDeleteColumn(column_uuid)
        setOpenDialog(true)
        }
    }

    const initialAsesorId = useMemo(() => {
        if (!user) return "";
        if (user.roledesc?.includes("ASESOR")) return user.userid;
        else return otherParams.asesorid || mainMulti.data[2]?.data?.map(d => d.userid).includes(user?.userid) ? (user?.userid || "") : "";
    }, [otherParams, user]);
  

    const mainPaginated = useSelector(state => state.main.mainPaginated);
    const resExportData = useSelector(state => state.main.exportData);
    const [pageCount, setPageCount] = useState(0);
    const [totalrow, settotalrow] = useState(0);
    const [fetchDataAux, setfetchDataAux] = useState<IFetchData>({ pageSize: 20, pageIndex: 0, filters: {}, sorts: {}, daterange: null })
    const [autoRefresh, setAutoRefresh] = useState(false);
    const [waitExport, setWaitExport] = useState(false);
    const voxiConnection = useSelector(state => state.voximplant.connection);
    const callOnLine = useSelector(state => state.voximplant.callOnLine);
    const userConnected = useSelector(state => state.inbox.userConnected);
    const [allParameters, setAllParametersPrivate] = useState<{ contact: string, channel: string, asesorid: string, persontype: string }>({
        asesorid: String(initialAsesorId),
        channel: otherParams.channels,
        contact: otherParams.contact,
        persontype: otherParams.persontype,
    });
    const [selectedRows, setSelectedRows] = useState<Dictionary>({});
    const [personsSelected, setPersonsSelected] = useState<Dictionary[]>([]);
    const [gridModal, setGridModal] = useState<IModalProps>({ name: '', open: false, payload: null });

    const [configuration, setConfiguration] = useState<Configuration>()

    const passConfiguration = (value: Configuration) => {
        setConfiguration(value)
    }

    const setAllParameters = useCallback((prop: typeof allParameters) => {
        if (!user) return;

        if (user.roledesc?.includes("ASESOR") && prop.asesorid !== String(user.userid || "")) {
        setAllParametersPrivate({ ...prop, asesorid: String(user.userid || "") });
        } else {
        setAllParametersPrivate(prop);
        }
    }, [user]);

    const CustomCellRender = ({ column, row }: Dictionary) => {
        switch (column.id) {
        case 'status':
            return (
            <div style={{ cursor: 'pointer' }}>
                {row[column.id] ? (t(`status_${row[column.id]}`.toLowerCase()) || "").toUpperCase() : ""}
            </div>            
            )
        case 'contact_name':
            return (
            <div style={{ cursor: 'pointer' }}>
<div>{t(langKeys.name)}: {row && row['contact_name'] !== undefined ? row['contact_name'] : ""}</div>

{Boolean(row['persontype']) && <div>{t(langKeys.personType)}: {row['persontype'] || ""}</div>}

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
              {row[column.id] && row[column.id] !== '' && row[column.id].split(',').map((t: string, i: number) => (
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
        case 'phase':
        return (
          <div style={{ cursor: 'pointer' }}>
           {row && column.id && (t((row[column.id]).toLowerCase()) || '').toUpperCase() }
          </div>
        )
      default:
            return (
            <div style={{ cursor: 'pointer' }}>
                {
                    column.sortType === "datetime" && row && column.id && Boolean(row[column.id])
                        ? convertLocalDate(row[column.id]).toLocaleString(undefined, {
                            year: "numeric",
                            month: "2-digit",
                            day: "2-digit",
                            hour: "numeric",
                            minute: "numeric",
                            second: "numeric"
                        })
                        : row && column.id && row[column.id]
                }

            </div>
            )
        }
    }

    const cell = (props: Dictionary) => {
        const column = props.cell.column;
        const row = props.cell.row.original;
        return (
        <CustomCellRender column={column} row={row} />
        )
    }

    const onClickRow = (row: Dictionary) => {
        if (row.leadid) {
        history.push({ pathname: paths.CRM_EDIT_LEAD.resolve(row.leadid), });
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
            Cell: (props: Dictionary) => {
            const row = props.cell.row.original;
            if (row.status === 'ACTIVO') {
                return (
                <>
                    {!isIncremental &&
                    <React.Fragment>
                        <div style={{ display: 'flex' }}>
                        <IconButton
                            aria-label="more"
                            aria-controls="long-menu"
                            aria-haspopup="true"
                            size="small"
                            onClick={(e) => {
                            e.stopPropagation();
                            setGridModal({ name: 'MESSAGE', open: true, payload: { persons: [row], messagetype: 'HSM' } })
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
                            setGridModal({ name: 'MESSAGE', open: true, payload: { persons: [row], messagetype: 'MAIL' } })
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
                            setGridModal({ name: 'MESSAGE', open: true, payload: { persons: [row], messagetype: 'SMS' } })
                            }}
                        >
                            <SmsIcon color="action" />
                        </IconButton>
                        </div>
                        <div style={{ display: 'flex' }}>
                        <IconButton
                            aria-label="more"
                            aria-controls="long-menu"
                            aria-haspopup="true"
                            size="small"
                            onClick={(e) => {
                            e.stopPropagation();
                            setGridModal({ name: 'ACTIVITY', open: true, payload: { leadid: row['leadid'] } })
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
                            setGridModal({ name: 'NOTE', open: true, payload: { leadid: row['leadid'] } })
                            }}
                        >
                            <NoteIcon
                            titleAccess={t(langKeys.logNote)}
                            color="action"
                            />
                        </IconButton>
                        {(!voxiConnection.error && !voxiConnection.loading && userConnected && !callOnLine && Boolean(row.phone)) &&
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
                            <PhoneIcon color="action" titleAccess={t(langKeys.make_call)} />
                            </IconButton>
                        }
                        </div>
                    </React.Fragment>}
                </>
                )
            }
            else {
                return null
            }
            }
        },
        ],
        [voxiConnection, callOnLine]
    );

    const fetchGridData = ({ pageSize, pageIndex, filters, sorts, daterange }: IFetchData) => {     
        setfetchDataAux({ ...fetchDataAux, daterange:daterange, ...{ pageSize, pageIndex, filters, sorts } });
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

    const fetchBoardLeadsWithFilterGRID = useCallback(async () => {
        try {                       
            const newParams = new URLSearchParams(location.search);
          
            for (const key in fetchDataAux) {
                const value = (fetchDataAux as Dictionary)[key];
                if (key === 'filters' || value === undefined || value === null || key === 'sorts' || key === 'daterange') continue;
                newParams.set(key, String(value));
            }
            const colFilters = fetchDataAux.filters;
            for (const key in colFilters) {
                if (typeof colFilters[key] === 'object' && 'value' in colFilters[key] && 'operator' in colFilters[key]) {
                    newParams.set(key, String(colFilters[key].value));
                    newParams.set(`${key}-operator`, String(colFilters[key].operator));
                }
            }

            newParams.set('asesorid', String(allParameters.asesorid));
            newParams.set('channels', String(allParameters.channel));
            newParams.set('contact', String(allParameters.contact));           
            history.push({ search: newParams.toString() });
     
            setModalOpenGRID(false);
            fetchGridData({...fetchDataAux});               
        } catch (error) {
            console.error("Error al aplicar filtros:", error);
        }
    }, [boardFilter, dispatch, history, location.search, setModalOpenGRID, sortParams, user, fetchGridData]);

    useEffect(() => {
        if (!mainPaginated.loading && !mainPaginated.error) {
        setPageCount(Math.ceil(mainPaginated.count / fetchDataAux.pageSize));
        settotalrow(mainPaginated.count);
        }
    }, [mainPaginated]);

    const triggerExportData = ({ filters, sorts, daterange }: IFetchData) => {
        const columnsExport = [
        ...columns.filter(x => !x.isComponent && x.accessor !== 'comments').map(x => ({
            key: x.accessor,
            alias: x.Header,
        })),
        { key: 'notedescription', alias: t(langKeys.notedescription) }, 
        { key: 'activitydescription', alias: t(langKeys.activitydescription) }, 
        { key: 'estimatedimplementationdate', alias: t(langKeys.estimatedimplementationdate) }, 
        { key: 'estimatedbillingdate', alias: t(langKeys.estimatedbillingdate) },
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

    useEffect(() => {
        if (waitExport) {
        if (!resExportData.loading && !resExportData.error) {
            dispatch(showBackdrop(false));
            setWaitExport(false);
            resExportData.url?.split(",").forEach(x => window.open(x, '_blank'))
        } else if (resExportData.error) {
            const errormessage = t(resExportData.code || "error_unexpected_error", { module: t(langKeys.blacklist).toLocaleLowerCase() })
            dispatch(showSnackbar({ show: true, severity: "error", message: errormessage }))
            dispatch(showBackdrop(false));
            setWaitExport(false);
        }
        }
    }, [resExportData, waitExport]);

    useEffect(() => {
        if (!(Object.keys(selectedRows).length === 0 && personsSelected.length === 0)) {
        setPersonsSelected(p => Object.keys(selectedRows).map(x => mainPaginated.data.find(y => y.leadid === parseInt(x)) || p.find(y => y.leadid === parseInt(x)) || {}))
        }
    }, [selectedRows])

    useEffect(() => {
        const p = new URLSearchParams(location.search);
        p.set('display', display);
        history.push({ search: p.toString() });
    }, [display, history]);

    const campaigns = useMemo(() => {
        if (!mainMulti.data[4]?.data || mainMulti.data[4]?.key !== "UFN_CAMPAIGN_LST") return [];
        return (mainMulti.data[4].data as ICampaignLst[]).sort((a, b) => {
        return a.description.localeCompare(b.description);
        });
    }, [mainMulti.data[4]]);

    const tags = useMemo(() => {
        if (!mainMulti.data[6]?.data || mainMulti.data[6]?.key !== "UFN_LEAD_TAGSDISTINCT_SEL") return [];
        return (mainMulti.data[6].data as Dictionary[]).sort((a, b) => {
        return a.tags?.localeCompare(b.tags || '') || 0;
        });
    }, [mainMulti.data[6]]);

    const channels = useMemo(() => {
        if (!mainMulti.data[3]?.data || mainMulti.data[3]?.key !== "UFN_COMMUNICATIONCHANNEL_LST") return [];
        return (mainMulti.data[3].data as IChannel[]).sort((a, b) => {
        return a.communicationchanneldesc.localeCompare(b.communicationchanneldesc);
        });
    }, [mainMulti.data[3]]);

    const userType = useMemo(() => {
        if (!mainMulti.data[7]?.data || mainMulti.data[7]?.key !== "UFN_DOMAIN_LST_VALORES") return [];
        return (mainMulti.data[7].data);
    }, [mainMulti.data[7]]);
  

    const [anchorElSeButtons, setAnchorElSeButtons] = React.useState<null | HTMLElement>(null);
    const [openSeButtons, setOpenSeButtons] = useState(false);

    const handleClickSeButtons = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElSeButtons(event.currentTarget);
        setOpenSeButtons((prevOpen) => !prevOpen);
     };
    
    const handleCloseSeButtons = () => {
    setAnchorElSeButtons(null);
    setOpenSeButtons(false);
    };
      
    console.log('dataColumn', dataColumn)

    return (
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
            <div style={{ marginBottom: '10px' }}>
                <div style={{ position: 'fixed', right: '25px', display: "flex", paddingBottom: '20px' }}>   
                    <Tooltip title={t(langKeys.filters) + " "} arrow placement="top">
                        <IconButton
                            color="default"
                            onClick={() => {
                                if (display === 'BOARD') {
                                  setModalOpenBOARD(true);
                                } else if (display === 'GRID') {
                                  setModalOpenGRID(true);
                                }
                            }}
                            style={{ padding: '5px' }}
                        >
                            <TuneIcon />
                        </IconButton>
                    </Tooltip>
                    <div style={{ height: '20px', borderRight: '1px solid #ccc', margin: '6px 7px' }}></div>
                    <Tooltip title={t(langKeys.kanbanview) + " "} arrow placement="top">
                        <IconButton
                            color="default"
                            disabled={display === 'BOARD'}
                            onClick={() => setDisplay('BOARD')}
                            style={{ padding: '5px' }}
                        >
                            <ViewColumnIcon />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title={t(langKeys.listview) + " "} arrow placement="top">
                        <IconButton
                            color="default"
                            disabled={display === 'GRID'}
                            onClick={() => setDisplay('GRID')}
                            style={{ padding: '5px' }}
                        >
                            <ViewListIcon />
                        </IconButton>
                    </Tooltip>         
                </div>
            </div>

            {display === 'BOARD' &&    
                <div style={{ display: "flex", flexDirection: 'column', height: "100%" }}> 
                    <div className={classes.canvasFiltersHeader}>
                        <div style={{ flexGrow: 1 }} />  
                        <DialogZyx 
                            open={isModalOpenBOARD} 
                            title={t(langKeys.filters)} 
                            buttonText1={t(langKeys.close)}
                            buttonText2={t(langKeys.apply) +  " " +t(langKeys.filters)}
                            handleClickButton1={() => setModalOpenBOARD(false)}                    
                            handleClickButton2={fetchBoardLeadsWithFilter}
                            maxWidth="sm"
                            buttonStyle1={{marginBottom:'0.3rem'}}
                            buttonStyle2={{marginRight:'1rem', marginBottom:'0.3rem'}}
                        >                     
                            <div className="row-zyx" >
                                {(user && !(user.roledesc?.includes("ASESOR"))) && 
                                <FieldMultiSelect
                                    variant="outlined"
                                    label={t(langKeys.agent)}
                                    className="col-6"                   
                                    valueDefault={boardFilter.asesorid}
                                    onChange={(value) => setBoardFilter(prev => ({ ...prev, asesorid: value?.map((o: Dictionary) => o['userid']).join(',') }))}
                                    data={mainMulti.data[2]?.data?.sort((a, b) => a?.fullname?.toLowerCase() > b?.fullname?.toLowerCase() ? 1 : -1) || []}
                                    optionDesc={'fullname'}
                                    optionValue={'userid'}
                                    disabled={Boolean(user?.roledesc?.includes("ASESOR")) || false}
                                />}
                                <FieldSelect
                                    variant="outlined"
                                    label={t(langKeys.campaign)}
                                    className="col-6"                   
                                    valueDefault={boardFilter.campaign}
                                    onChange={(v: ICampaignLst) => setBoardFilter(prev => ({ ...prev, campaign: v?.id || 0 }))}
                                    data={campaigns}
                                    loading={mainMulti.loading}
                                    optionDesc="description"
                                    optionValue="id"
                                />
                            </div>

                            <div className="row-zyx">
                                <FieldMultiSelect
                                    variant="outlined"
                                    label={t(langKeys.product, { count: 2 })}
                                    className="col-6"                   
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
                                    className="col-6"                   
                                    valueDefault={boardFilter.tags}
                                    onChange={(v) => {
                                        const tags = v?.map((o: Dictionary) => o.tags).join(',') || '';
                                        setBoardFilter(prev => ({ ...prev, tags }));
                                    }}
                                    data={tags}
                                    loading={mainMulti.loading}
                                    optionDesc="tags"
                                    optionValue="tags"
                                />
                            </div>              
                        
                            <div className="row-zyx" style={{marginBottom:'0'}}>
                                <FieldEdit
                                    size="small"
                                    variant="outlined"
                                    valueDefault={boardFilter.customer}
                                    label={t(langKeys.customer)}
                                    className="col-6"                   
                                    disabled={mainMulti.loading}
                                    onChange={(v: string) => setBoardFilter(prev => ({ ...prev, customer: v }))}
                                />
                                <FieldMultiSelect
                                    variant="outlined"
                                    label={t(langKeys.personType, { count: 2 })}
                                    className="col-6"                   
                                    valueDefault={boardFilter.persontype}
                                    onChange={(v) => {
                                        const persontype = v?.map((o: IDomain) => o.domainvalue).join(',') || '';
                                        setBoardFilter(prev => ({ ...prev, persontype }));
                                    }}
                                    data={mainMulti.data[7]?.data || []}
                                    loading={mainMulti.loading}
                                    optionDesc="domainvalue"
                                    optionValue="domainvalue"
                                />
                            </div>           
                        </DialogZyx>   
                    </div>                                         

                    {!isIncremental && 
                        <AddColumnTemplate onSubmit={(data) => { 
                            handleInsert(data, dataColumn, setDataColumn) 
                        }} 
                            updateSortParams={updateSortParams} 
                            passConfiguration={passConfiguration} 
                            ordertype={mainMulti?.data[8]?.data} 
                            orderby={mainMulti?.data[9]?.data} 
                        />
                    }

                    <div style= {{borderRadius:'2rem'}}>                  
                        <div className={classes.columnsTitles}>
                            <div className={classes.newTitle} style={{ minWidth: newWidth, maxWidth: newWidth }}>
                                <div className={classes.greyPart}>
                                    <div style={{ display: 'flex', alignContent: 'center', justifyContent: 'center' }}>
                                        <div style={{ paddingTop: '4px' }}>
                                            {t(langKeys.new)}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className={classes.otherTitles} style={{ minWidth: qualifiedWidth, maxWidth: qualifiedWidth }}>
                                <div className={classes.otherGreyPart}>
                                    <div style={{ display: 'flex', alignContent: 'center', justifyContent: 'center' }}>
                                        <div style={{ paddingTop: '4px' }}> {t(langKeys.qualified)} </div>
                                    </div>
                                </div>
                            </div>

                            <div className={classes.otherTitles} style={{ minWidth: propositionWidth, maxWidth: propositionWidth }}>
                                <div className={classes.otherGreyPart}>
                                    <div style={{ display: 'flex', alignContent: 'center', justifyContent: 'center' }}>
                                        <div style={{ paddingTop: '4px' }}> {t(langKeys.proposition)} </div>
                                    </div>
                                </div>
                            </div>

                            <div className={classes.otherTitles} style={{ minWidth: wonWidth, maxWidth: wonWidth }}>
                                <div className={classes.otherGreyPart}>
                                    <div style={{ display: 'flex', alignContent: 'center', justifyContent: 'center' }}>
                                        <div style={{ paddingTop: '4px' }}> {t(langKeys.won)} </div>
                                    </div>
                                </div>
                            </div>
                        </div>                        
                                        
                        <DragDropContext onDragEnd={result => onDragEnd(result, dataColumn, setDataColumn)}>               
                            <Droppable droppableId="all-columns" direction="horizontal" type="column" >                    
                                {(provided) => (
                                    <div style={{ display: 'flex' }} {...provided.droppableProps} ref={provided.innerRef} >
                                        {dataColumn.map((column, index) => (
                                            <div key={index} className={classes.oportunityList} >
                                                <DraggablesCategories
                                                    isIncremental={isIncremental}
                                                    deletable={dataColumn.filter((x: Dictionary) => x.type === column.type).length > 1}
                                                    column={column}
                                                    index={index}
                                                    hanldeDeleteColumn={hanldeDeleteColumn}
                                                    handleDelete={handleDelete}
                                                    handleCloseLead={handleCloseLead}
                                                    sortParams={sortParams}                                 
                                                    configuration={configuration}
                                                />
                                            </div>                       
                                        ))}
                                    </div>
                                )}
                            </Droppable>           
                        </DragDropContext>


                    </div>

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
                <div style={{ width: 'inherit', marginTop:'1.3rem' }}>

                    <div className={classes.canvasFiltersHeader}>
                        <div style={{ flexGrow: 1 }} />  
                        <DialogZyx 
                            open={isModalOpenGRID} 
                            title={t(langKeys.filters) + " "} 
                            buttonText1={t(langKeys.close)}
                            buttonText2={t(langKeys.apply) +  " " +t(langKeys.filters)}
                            handleClickButton1={() => setModalOpenGRID(false)}                    
                            handleClickButton2={fetchBoardLeadsWithFilterGRID}
                            maxWidth="sm"
                            buttonStyle1={{marginBottom:'0.3rem'}}
                            buttonStyle2={{marginRight:'1rem', marginBottom:'0.3rem'}}
                        >                     
                            <div className="row-zyx" >
                                {(user && !(user.roledesc?.includes("ASESOR"))) && 
                                <FieldMultiSelect
                                    variant="outlined"
                                    label={t(langKeys.agent)}
                                    className="col-6"                  
                                    valueDefault={allParameters.asesorid}
                                    onChange={(value) => { setAllParameters({ ...allParameters, asesorid: value?.map((o: Dictionary) => o['userid']).join(',') }) }}
                                    data={mainMulti.data[2]?.data?.sort((a, b) => a?.fullname?.toLowerCase() > b?.fullname?.toLowerCase() ? 1 : -1) || []}
                                    optionDesc={'fullname'}
                                    optionValue={'userid'}
                                    disabled={Boolean(user?.roledesc?.includes("ASESOR")) || false}
                                />}
                                <FieldMultiSelect
                                    variant="outlined"
                                    label={t(langKeys.channel)}
                                    className="col-6"                   
                                    valueDefault={allParameters.channel}
                                    onChange={(value) => setAllParameters({ ...allParameters, channel: value?.map((o: Dictionary) => o['communicationchannelid']).join(',') })}
                                    data={channels}
                                    optionDesc={'communicationchanneldesc'}
                                    optionValue={'communicationchannelid'}
                                />
                            </div>

                            <div className="row-zyx" style={{marginBottom:'0'}}>
                            <FieldEdit
                                size="small"
                                variant="outlined"
                                label={t(langKeys.customer)}
                                className="col-6"                   
                                valueDefault={allParameters.contact}
                                onChange={(value) => setAllParameters({ ...allParameters, contact: value })}
                            />

                            <FieldMultiSelect
                                variant="outlined"
                                label={t(langKeys.personType, { count: 2 })}
                                className="col-6"                   
                                valueDefault={allParameters.persontype}
                                onChange={(v) => {
                                const persontype = v?.map((o: IDomain) => o.domainvalue).join(',') || '';
                                setAllParameters({ ...allParameters, persontype });
                                }}
                                data={userType}
                                optionDesc="domainvalue"
                                optionValue="domainvalue"
                            />
                            </div>           
                        </DialogZyx>   
                    </div> 

                                 
                    
                    <TablePaginated
                        columns={columns}
                        data={mainPaginated.data}
                        totalrow={totalrow}
                        loading={mainPaginated.loading}
                        pageCount={pageCount}                        
                        filterrange={true}
                        download={true}
                        FiltersElement={<></>}
                        fetchData={fetchGridData}
                        autotrigger={true}                       
                        autoRefresh={{ value: autoRefresh, callback: (value) => setAutoRefresh(value) }}                       
                        exportPersonalized={triggerExportData}
                        useSelection={true}
                        selectionFilter={{ key: 'status', value: 'ACTIVO' }}
                        selectionKey={selectionKey}
                        onFilterChange={f => {
                            const params = buildQueryFilters(f, location.search);
                            params.set('asesorid', String(allParameters.asesorid));
                            params.set('channels', String(allParameters.channel));
                            params.set('contact', String(allParameters.contact));
                            history.push({ search: params.toString() });
                        }}
                        setSelectedRows={setSelectedRows}
                        onClickRow={onClickRow}                        
                                      
                        initialEndDate={params.endDate}
                        initialStartDate={params.startDate}                      
                        initialPageIndex={params.page}
                        ButtonsElement={ <>
                            <div style={{ display: 'flex', gap: 8 }}></div>
                            <div>
                                <IconButton
                                    aria-label="more"
                                    id="long-button"
                                    onClick={handleClickSeButtons}
                                    style={{ backgroundColor: openSeButtons ? '#F6E9FF' : undefined, color: openSeButtons ? '#7721AD' : undefined }}
                                >
                                    <MoreVertIcon />
                                </IconButton>
                                <Popper
                                    open={openSeButtons}
                                    anchorEl={anchorElSeButtons}
                                    placement="bottom"
                                    transition
                                    style={{ zIndex: 1300, marginRight: '1rem' }}
                                >
                                    {({ TransitionProps }) => (
                                        <ClickAwayListener onClickAway={handleCloseSeButtons}>
                                            <Paper {...TransitionProps} elevation={5}>
                                                <MenuItem
                                                    disabled={mainPaginated.loading || Object.keys(selectedRows).length === 0}
                                                    style={{ padding: '0.7rem 1rem', fontSize: '0.96rem' }}
                                                    onClick={() => {
                                                        handleCloseSeButtons();
                                                        setGridModal({ name: 'MESSAGE', open: true, payload: { persons: personsSelected, messagetype: 'HSM' } });
                                                    }}
                                                >
                                                    <ListItemIcon>
                                                        <WhatsappIcon fontSize="small" style={{ fill: 'grey', height: '23px' }} />
                                                    </ListItemIcon>
                                                    <Typography variant="inherit">{t(langKeys.send_hsm)}</Typography>
                                                </MenuItem>
                                                <Divider />
                                                <MenuItem
                                                    disabled={mainPaginated.loading || Object.keys(selectedRows).length === 0}
                                                    style={{ padding: '0.7rem 1rem', fontSize: '0.96rem' }}
                                                    onClick={() => {
                                                        handleCloseSeButtons();
                                                        setGridModal({ name: 'MESSAGE', open: true, payload: { persons: personsSelected, messagetype: 'MAIL' } });
                                                    }}
                                                >
                                                    <ListItemIcon>
                                                        <MailIcon fontSize="small" style={{ fill: 'grey', height: '25px' }} />
                                                    </ListItemIcon>
                                                    <Typography variant="inherit">{t(langKeys.send_mail)}</Typography>
                                                </MenuItem>
                                                <Divider />
                                                <MenuItem
                                                    disabled={mainPaginated.loading || Object.keys(selectedRows).length === 0}
                                                    style={{ padding: '0.7rem 1rem', fontSize: '0.96rem' }}
                                                    onClick={() => {
                                                        handleCloseSeButtons();
                                                        setGridModal({ name: 'MESSAGE', open: true, payload: { persons: personsSelected, messagetype: 'SMS' } });
                                                    }}
                                                >
                                                    <ListItemIcon>
                                                        <SmsIcon fontSize="small" style={{ fill: 'grey', height: '25px' }} />
                                                    </ListItemIcon>
                                                    <Typography variant="inherit" noWrap>{t(langKeys.send_sms)}</Typography>
                                                </MenuItem>
                                            </Paper>
                                        </ClickAwayListener>
                                    )}
                                </Popper>
                            </div>
                        </>
                        }                       
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