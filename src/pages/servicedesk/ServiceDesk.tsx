/* eslint-disable react-hooks/exhaustive-deps */
import { convertLocalDate, getAdviserFilteredUserRol, getColumnsSDSel, getCommChannelLst, getDateCleaned, getLeadExport, getLeadsSDSel, getLeadTasgsSel, getPaginatedSDLead, getUserGroupsSel, getValuesFromDomain, 
  insArchiveServiceDesk, insSDLead } from "common/helpers";
import React, { FC, useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch } from 'react-redux';
import { useSelector } from 'hooks';
import { getMultiCollection, resetAllMain, execute, getCollectionPaginated, exportData } from "store/main/actions";
import paths from "common/constants/paths";
import { useHistory, useLocation } from "react-router";
import { manageConfirmation, showBackdrop, showSnackbar } from "store/popus/actions";
import { langKeys } from "lang/keys";
import { Trans, useTranslation } from "react-i18next";
import { DateRangePicker, DialogZyx3Opt, FieldMultiSelect, FieldSelect } from "components";
import { Search as SearchIcon, ViewColumn as ViewColumnIcon, ViewList as ViewListIcon, Sms as SmsIcon, Mail as MailIcon, Add as AddIcon } from '@material-ui/icons';
import { Button, IconButton, Tooltip } from "@material-ui/core";
import { Dictionary, IDomain, IFetchData, IServiceDeskLead } from "@types";
import TablePaginated, { buildQueryFilters, useQueryParams } from 'components/fields/table-paginated';
import { makeStyles } from '@material-ui/core/styles';
import { Rating } from '@material-ui/lab';
import { DialogSendTemplate, NewActivityModal, NewNoteModal } from "./Modals";
import { CalendarIcon, WhatsappIcon } from "icons";
import GroupIcon from '@material-ui/icons/Group';
import { KanbanTable } from "./components/KanbanTable";
import { Range } from 'react-date-range';
import { KanbanTableGroups } from "./components/KanbanTableGroups";
const isIncremental = window.location.href.includes("incremental")

interface dataBackend {
  columnid: number,
  column_uuid: string,
  description: string,
  status: string,
  type: string,
  globalid: string,
  index: number,
  total_revenue?: number | null,
  items?: IServiceDeskLead[] | null
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
  itemDate: {
      minHeight: 40,
      height: 40,
      border: '1px solid #bfbfc0',
      borderRadius: 4,
      color: 'rgb(143, 146, 161)'
  },
}));

const selectionKey = 'leadid';

interface IModalProps {
  name: string;
  open: boolean;
  payload: Dictionary | null;
}

interface IBoardFilter {
  company: string;
  groups: string;
  /**ID de la campaña */
  /**filtro por nombre completo */
  customer: string;
  /**separado por comas */
  products: string;
  /**separados por coma */
  tags: string;
  /**id del asesor */
}

const initialRange = {
  startDate: new Date(new Date().setDate(1)),
  endDate: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0),
  key: 'selection'
}

const ServiceDesk: FC = () => {
  const user = useSelector(state => state.login.validateToken.user);
  const history = useHistory();
  const location = useLocation();
  const dispatch = useDispatch();
  const [columnsName, setColumnsName] = useState<any[]>([])
  const [dataColumn, setDataColumn] = useState<dataBackend[]>([])
  const [columnGroups, setColumnGroups] = useState<any[]>([])
  const [dataColumnByGroup, setDataColumnByGroup] = useState<dataBackend[]>([])
  const [openDateRangeCreateDateModal, setOpenDateRangeCreateDateModal] = useState(false);
  const [dateRangeCreateDate, setDateRangeCreateDate] = useState<Range>(initialRange);
  const [openDialog, setOpenDialog] = useState(false);
  // const display = useSelector(state => state.lead.display);
  const mainMulti = useSelector(state => state.main.multiData);
  const { t } = useTranslation();
  const classes = useStyles();

  const query = useMemo(() => new URLSearchParams(location.search), [location]);
  const params = useQueryParams(query, {
    ignore: [
      'company', 'groups', 'channels', 'contact', 'display', 'products', 'tags',
    ],
  });
  const otherParams = useMemo(() => ({
    company: query.get('company'),
    groups: query.get('groups'),
    channels: query.get('channels') || '',
    contact: query.get('contact') || '',
    products: query.get('products') || '',
    tags: query.get('tags') || '',
  }), [query]);
  const [display, setDisplay] = useState(query.get('display') || 'BOARD');
  const [boardFilter, setBoardFilterPrivate] = useState<IBoardFilter>({
    company: user?.roledesc.includes("VISOR") ? (user?.companyuser||"") : (otherParams?.company||""),
    groups: otherParams?.groups||"",
    customer: otherParams.contact,
    products: otherParams.products,
    tags: otherParams.tags,
  });

  const setBoardFilter = useCallback((prop: React.SetStateAction<typeof boardFilter>) => {
    if (!user) return;
    setBoardFilterPrivate(prop);
  }, [user, boardFilter]);

  useEffect(() => {
      dispatch(getMultiCollection([
          getColumnsSDSel(1,true),
          getLeadsSDSel({
            id: 0,
            company: boardFilter?.company||"",
            groups: boardFilter.groups,
            leadproduct: boardFilter.products,
            tags: boardFilter.tags,
            fullname: boardFilter.customer,
            supervisorid: user?.userid || 0,
            startdate: dateRangeCreateDate.startDate,
            enddate: dateRangeCreateDate.endDate,
            offset: (new Date().getTimezoneOffset() / 60) * -1
          }),
          // adviserSel(),
          getAdviserFilteredUserRol(),
          getCommChannelLst(),
          getUserGroupsSel(),
          getValuesFromDomain('OPORTUNIDADPRODUCTOS'),
          getLeadTasgsSel(),
          getValuesFromDomain('TIPOPERSONA'),
          getValuesFromDomain('EMPRESA'),
          getValuesFromDomain('GRUPOSSERVICEDESK', '_GRUPOSSERVICEDESK'),
      ]));
      return () => {
          dispatch(resetAllMain());
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);

  useEffect(() => {
    if (!mainMulti.error && !mainMulti.loading) {
      if (mainMulti.data.length && mainMulti.data[0].key && mainMulti.data[0].key === "UFN_COLUMN_SD_SEL") {
        setColumnsName(mainMulti.data[0] && mainMulti.data[0].success ? mainMulti.data[0].data : [])
        setColumnGroups(mainMulti.data.filter(x=>x.key==="UFN_DOMAIN_LST_VALORES_GRUPOSSERVICEDESK")?.[0]?.data||[])
        const columns = (mainMulti.data[0] && mainMulti.data[0].success ? mainMulti.data[0].data : []) as dataBackend[]
        const leads = (mainMulti.data[1] && mainMulti.data[1].success ? mainMulti.data[1].data : []) as IServiceDeskLead[]
        let columngroup = mainMulti.data.filter(x=>x.key==="UFN_DOMAIN_LST_VALORES_GRUPOSSERVICEDESK")?.[0]?.data||[]
        columngroup.unshift({domainid: 0, domainvalue:"", domaindesc:""})
        let unorderedcolumngroup= columngroup.reduce((acc:any,x)=>[...acc,{...x,items:[]}],[])

        let unordeneddatacolumns = columns.map((column) => {
          column.items = leads.filter( x => x.column_uuid === column.column_uuid);
          return {...column, total_revenue: (column.items.reduce((a,b) => a + parseFloat(b.expected_revenue), 0))}
        })
        let ordergroup = unorderedcolumngroup.map((column:any) => {
          column.items = leads.filter( x => x.leadgroups === column.domainvalue);
          return {...column}
        })
        setDataColumnByGroup(ordergroup)
        let ordereddata: dataBackend[] =[];
        columns.forEach((x,i)=>{
          ordereddata = [...ordereddata, ...unordeneddatacolumns.filter((y:any)=>y.column_uuid===x.column_uuid)]
        })
        setDataColumn(ordereddata)
      }
    }
  },[mainMulti]);

  const fetchBoardLeadsWithFilter = useCallback(() => {
    const newParams = new URLSearchParams(location.search);
    newParams.set('company', String(boardFilter.company));
    newParams.set('groups', String(boardFilter.groups));
    newParams.set('products', String(boardFilter.products));
    newParams.set('tags', String(boardFilter.tags));
    newParams.set('contact', String(boardFilter.customer));
    history.push({ search: newParams.toString() });

    dispatch(getMultiCollection([
      getColumnsSDSel(1,true),
      getLeadsSDSel({
        id: 0,
        company: boardFilter?.company||"",
        groups: boardFilter.groups,
        fullname: boardFilter.customer,
        leadproduct: boardFilter.products,
        tags: boardFilter.tags,
        supervisorid: user?.userid || 0,
        startdate: dateRangeCreateDate.startDate,
        enddate: dateRangeCreateDate.endDate,
        offset: (new Date().getTimezoneOffset() / 60) * -1
      }),
      // adviserSel(),
      getAdviserFilteredUserRol(),
      getCommChannelLst(),
      getUserGroupsSel(),
      getValuesFromDomain('OPORTUNIDADPRODUCTOS'),
      getLeadTasgsSel(),
      getValuesFromDomain('TIPOPERSONA'),
      getValuesFromDomain('EMPRESA'),
      getValuesFromDomain('GRUPOSSERVICEDESK', '_GRUPOSSERVICEDESK'),
    ]));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [boardFilter,dateRangeCreateDate, dispatch]);

  const handleCloseLead = (lead: IServiceDeskLead) => {
    const callback = () => {
      const index = dataColumn.findIndex(c => c.column_uuid === lead.column_uuid)
      const column = dataColumn[index];
      const copiedItems = [...column.items!!]
      const leadIndex = copiedItems.findIndex(l => l.leadid === lead.leadid)//v
      copiedItems!.splice(leadIndex, 1); //v
      const totalRevenue = copiedItems!.reduce((a,b) => a + parseFloat(b.expected_revenue), 0)
      const newData = Object.values({...dataColumn, [index]: {...column, total_revenue: totalRevenue, items: copiedItems}}) as dataBackend[]
      setDataColumn(newData);
      dispatch(execute(insArchiveServiceDesk(lead)))
    }
    dispatch(manageConfirmation({
      visible: true,
      question: t(langKeys.confirmation_close),
      callback
    }))
  }

  const handleDelete = (lead: IServiceDeskLead) => {
    const callback = () => {
      const index = dataColumn.findIndex(c => c.column_uuid === lead.column_uuid)
      const column = dataColumn[index];
      const copiedItems = [...column.items!!]
      const leadIndex = copiedItems.findIndex(l => l.leadid === lead.leadid)
      copiedItems!.splice(leadIndex, 1);
      dispatch(execute(insSDLead({...lead, status: 'ELIMINADO'}, "UPDATE")))
      fetchBoardLeadsWithFilter()
    }
    dispatch(manageConfirmation({
      visible: true,
      question: t(langKeys.confirmation_delete),
      callback
    }))
  }

  const mainPaginated = useSelector(state => state.main.mainPaginated);
  const resExportData = useSelector(state => state.main.exportData);
  const [pageCount, setPageCount] = useState(0);
  const [totalrow, settotalrow] = useState(0);
  const [fetchDataAux, setfetchDataAux] = useState<IFetchData>({ pageSize: 20, pageIndex: 0, filters: {}, sorts: {}, daterange: null })
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [waitExport, setWaitExport] = useState(false);
  const voxiConnection = useSelector(state => state.voximplant.connection);
  const callOnLine = useSelector(state => state.voximplant.callOnLine);
  const [allParameters, setAllParametersPrivate] = useState<{ company: string, groups: string, contact: string, leadproduct:string }>({
    company: user?.roledesc.includes("VISOR") ? (user?.companyuser||"") : (otherParams?.company||""),
    groups: otherParams?.groups||"",
    leadproduct: otherParams?.products||"",
    contact: otherParams.contact,
  });
  const [selectedRows, setSelectedRows] = useState<Dictionary>({});
  const [personsSelected, setPersonsSelected] = useState<Dictionary[]>([]);
  const [gridModal, setGridModal] = useState<IModalProps>({ name: '', open: false, payload: null });

  const setAllParameters = useCallback((prop: typeof allParameters) => {
    if (!user) return;
    setAllParametersPrivate(prop);
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
            {!!row['persontype'] && <div>{t(langKeys.personType)}: {row['persontype']}</div>}
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
    if (row.leadid && !user?.roledesc.includes("VISOR")) {
      history.push({pathname: paths.SERVICE_DESK_EDIT_LEAD.resolve(row.leadid),});
    }
  }

  const columns = React.useMemo(
    () => [
      {
        Header: t(langKeys.request),
        accessor: 'sd_request',
        isComponent: true,
        Cell: cell
      },
      {
        Header: t(langKeys.channel),
        accessor: 'communicationchannel',
        isComponent: true,
        Cell: cell
      },
      {
        Header: t(langKeys.lastUpdate),
        accessor: 'changedate',
        type: 'date',
        sortType: 'datetime',
        isComponent: true,
        Cell: cell,
      },
      {
        Header: t(langKeys.type),
        accessor: 'type',
        isComponent: true,
        Cell: cell
      },
      {
        Header: t(langKeys.group),
        accessor: 'leadgroups',
        isComponent: true,
        Cell: cell
      },
      {
        Header: t(langKeys.phase),
        accessor: 'column_description',
        isComponent: true,
        Cell: cell
      },
      {
        Header: t(langKeys.description),
        accessor: 'description',
        isComponent: true,
        Cell: cell
      },
      {
        Header: t(langKeys.ticket),
        accessor: 'ticketnum',
        isComponent: true,
        Cell: cell
      },
      {
        Header: t(langKeys.user),
        accessor: 'displayname',
        isComponent: true,
        NoFilter: true,
        Cell: cell
      },
      {
        Header: t(langKeys.tags),
        accessor: 'tags',
        isComponent: true,
        Cell: cell
      },
      {
        Header: t(langKeys.priority),
        accessor: 'priority',
        isComponent: true,
      },
      {
        Header: t(langKeys.business),
        accessor: 'company',
        isComponent: true,
        Cell: cell
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [voxiConnection, callOnLine]
  );

  const fetchGridData = ({ pageSize, pageIndex, filters, sorts, daterange }: IFetchData) => {
    setfetchDataAux({...fetchDataAux, ...{ pageSize, pageIndex, filters, sorts }});
    dispatch(getCollectionPaginated(getPaginatedSDLead(
        {
          startdate: daterange.startDate!,
          enddate: daterange.endDate!,
          sorts: sorts,
          filters: filters,
          take: pageSize,
          skip: pageIndex * pageSize,
          tags: boardFilter.tags,
          supervisorid: user?.userid || 0,
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

  const tags = useMemo(() => {
    if (!mainMulti.data[6]?.data || mainMulti.data[6]?.key !== "UFN_LEAD_TAGSDISTINCT_SEL") return [];
    return (mainMulti.data[6].data as any[]).sort((a, b) => {
      return a.tags?.localeCompare(b.tags || '') || 0;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mainMulti.data[6]]);

  const filtersElement = useMemo(() => (
    <>      
      <FieldSelect
        variant="outlined"
        label={t(langKeys.business)}
        className={classes.filterComponent}//cambiar
        valueDefault={allParameters.company}
        onChange={(value) => {setAllParameters({...allParameters, company: value?.domainvalue||""})}}
        data={mainMulti.data[8]?.data || []}
        optionDesc="domaindesc"
        optionValue="domainvalue"
        disabled={user?.roledesc.includes("VISOR")}
        loading={mainMulti.loading}
      />
      <FieldMultiSelect
        variant="outlined"
        label={t(langKeys.group)}
        className={classes.filterComponent}
        valueDefault={allParameters.groups}
        onChange={(value) => {setAllParameters({...allParameters, groups: value?.map((o: Dictionary) => o['domainvalue']).join(',')})}}
        data={mainMulti.data[4]?.data || []}
        loading={mainMulti.loading}
        optionDesc="domaindesc"
        optionValue="domainvalue"
      />
      <FieldMultiSelect
        variant="outlined"
        label={t(langKeys.product)}
        className={classes.filterComponent}
        valueDefault={boardFilter.products}
        onChange={(v) => {
          const products = v?.map((o: IDomain) => o.domainvalue).join(',') || '';
          setAllParameters({...allParameters, leadproduct: products})
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
    </>
    // eslint-disable-next-line react-hooks/exhaustive-deps
  ), [user, allParameters, classes, mainMulti, t]);

  const goToAddLead = useCallback(() => {
    history.push(paths.SERVICE_DESK_ADD_LEAD);
  }, [history]);

  return (
      <div style={{ width: '100%', display: 'flex', flexDirection: 'column'}}>
        <div style={{ marginBottom: '34px' }}>
          <div style={{ position: 'fixed', right: '20px' }}>
            <Tooltip title={t(langKeys.kanbanviewbyphase) + ""} arrow placement="top">
              <IconButton
                color="default"
                disabled={display === 'BOARD'}
                onClick={() => setDisplay('BOARD')}
                style={{ padding: '5px' }}
              >
                <ViewColumnIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title={t(langKeys.kanbanviewbyassignedgroup) + ""} arrow placement="top">
              <IconButton
                color="default"
                disabled={display === 'BOARDGROUP'}
                onClick={() => setDisplay('BOARDGROUP')}
                style={{ padding: '5px' }}
              >
                <GroupIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title={t(langKeys.listview) + ""} arrow placement="top">
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
            <DateRangePicker
                open={openDateRangeCreateDateModal}
                setOpen={setOpenDateRangeCreateDateModal}
                range={dateRangeCreateDate}
                onSelect={setDateRangeCreateDate}
            >
                <Button
                    className={classes.itemDate}
                    startIcon={<CalendarIcon />}
                    onClick={() => setOpenDateRangeCreateDateModal(!openDateRangeCreateDateModal)}
                >
                    {getDateCleaned(dateRangeCreateDate.startDate!) + " - " + getDateCleaned(dateRangeCreateDate.endDate!)}
                </Button>
            </DateRangePicker>
            <FieldSelect
              variant="outlined"
              label={t(langKeys.business)}
              className={classes.filterComponent}//cambiar
              valueDefault={boardFilter.company}
              onChange={(value) => {setBoardFilter({...boardFilter, company: value?.domainvalue})}}
              data={mainMulti.data[8]?.data || []}
              optionDesc="domaindesc"
              optionValue="domainvalue"
              loading={mainMulti.loading}
              disabled={user?.roledesc.includes("VISOR")}
            />
            <FieldMultiSelect
              variant="outlined"
              label={t(langKeys.group)}
              className={classes.filterComponent}
              valueDefault={boardFilter.groups}
              onChange={(v) => {
                const groups = v?.map((o: IDomain) => o.domainvalue).join(',') || '';
                setBoardFilter(prev => ({ ...prev, groups }));
              }}
              data={mainMulti.data[4]?.data || []}
              loading={mainMulti.loading}
              optionDesc="domaindesc"
              optionValue="domainvalue"
            />
            <FieldMultiSelect
              variant="outlined"
              label={t(langKeys.product)}
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
            <div style={{ flexGrow: 1 }} />
            {(!isIncremental && !user?.roledesc.includes("VISOR")) &&
            <Button
                variant="contained"
                color="primary"
                disabled={mainMulti.loading}
                startIcon={<AddIcon color="secondary" />}
                onClick={goToAddLead}
                style={{ backgroundColor: "#55BD84" }}
              >
                <Trans i18nKey={langKeys.register} />
            </Button>}
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
          <KanbanTable
            dataColumn={dataColumn}
            handleDelete= {handleDelete}
            handleCloseLead={handleCloseLead}
            columns={columnsName}
          />
          <DialogZyx3Opt
            open={openDialog}
            title={t(langKeys.confirmation)}
            buttonText1={t(langKeys.cancel)}
            buttonText2={t(langKeys.negative)}
            buttonText3={t(langKeys.affirmative)}
            handleClickButton1={() => setOpenDialog(false)}
            maxWidth={'xs'}
            >
            <div>{t(langKeys.question_delete_all_items)}</div>
            <div className="row-zyx">
            </div>
          </DialogZyx3Opt>
        </div>
        }
        {display === 'BOARDGROUP' &&
        <div style={{ display: "flex", flexDirection: 'column', height: "100%" }}>
          <div className={classes.canvasFiltersHeader}>
            <DateRangePicker
                open={openDateRangeCreateDateModal}
                setOpen={setOpenDateRangeCreateDateModal}
                range={dateRangeCreateDate}
                onSelect={setDateRangeCreateDate}
            >
                <Button
                    className={classes.itemDate}
                    startIcon={<CalendarIcon />}
                    onClick={() => setOpenDateRangeCreateDateModal(!openDateRangeCreateDateModal)}
                >
                    {getDateCleaned(dateRangeCreateDate.startDate!) + " - " + getDateCleaned(dateRangeCreateDate.endDate!)}
                </Button>
            </DateRangePicker>
            <FieldSelect
              variant="outlined"
              label={t(langKeys.business)}
              className={classes.filterComponent}//cambiar
              valueDefault={boardFilter.company}
              onChange={(value) => {setBoardFilter({...boardFilter, company: value?.domainvalue})}}
              data={mainMulti.data[8]?.data || []}
              optionDesc="domaindesc"
              optionValue="domainvalue"
              loading={mainMulti.loading}
              disabled={user?.roledesc.includes("VISOR")}
            />
            <FieldMultiSelect
              variant="outlined"
              label={t(langKeys.group)}
              className={classes.filterComponent}
              valueDefault={boardFilter.groups}
              onChange={(v) => {
                const groups = v?.map((o: IDomain) => o.domainvalue).join(',') || '';
                setBoardFilter(prev => ({ ...prev, groups }));
              }}
              data={mainMulti.data[4]?.data || []}
              loading={mainMulti.loading}
              optionDesc="domaindesc"
              optionValue="domainvalue"
            />
            <FieldMultiSelect
              variant="outlined"
              label={t(langKeys.product)}
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
            {(!user?.roledesc.includes("VISOR")) &&
            <Button
                variant="contained"
                color="primary"
                disabled={mainMulti.loading}
                startIcon={<AddIcon color="secondary" />}
                onClick={goToAddLead}
                style={{ backgroundColor: "#55BD84" }}
              >
                <Trans i18nKey={langKeys.register} />
            </Button>}
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
          <KanbanTableGroups
            dataColumn={dataColumnByGroup}
            handleDelete= {handleDelete}
            handleCloseLead={handleCloseLead}
            columns={columnGroups}
          />
          <DialogZyx3Opt
            open={openDialog}
            title={t(langKeys.confirmation)}
            buttonText1={t(langKeys.cancel)}
            buttonText2={t(langKeys.negative)}
            buttonText3={t(langKeys.affirmative)}
            handleClickButton1={() => setOpenDialog(false)}
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
            {(!isIncremental && !user?.roledesc.includes("VISOR")) &&
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
              {(!user?.roledesc.includes("VISOR")) &&
              <Button
                  variant="contained"
                  color="primary"
                  disabled={mainMulti.loading}
                  startIcon={<AddIcon color="secondary" />}
                  onClick={goToAddLead}
                  style={{ backgroundColor: "#55BD84" }}
                >
                  <Trans i18nKey={langKeys.register} />
              </Button>}
            </div>}
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
                params.set('contact', String(allParameters.contact));
                history.push({ search: params.toString() });
              }}
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
export default ServiceDesk;
