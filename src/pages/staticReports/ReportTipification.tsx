import React, { useEffect, useState } from "react";
import Typography from "@material-ui/core/Typography";
import TablePaginated from "components/fields/table-paginated";
import Graphic from "components/fields/Graphic";
import { makeStyles } from "@material-ui/core/styles";
import { useTranslation } from "react-i18next";
import { langKeys } from "lang/keys";
import CategoryIcon from "@material-ui/icons/Category";
import { TemplateBreadcrumbs, FieldSelect, DialogZyx,} from "components";
import { useSelector } from "hooks";
import { Dictionary, IFetchData } from "@types";
import { getPaginatedForReports, getReportExport, convertLocalDate, getReportGraphic, getCommChannelLstTypeDesc, getClassificationLevel1 } from "common/helpers";
import { getCollectionPaginated, resetCollectionPaginated, exportData, getMultiCollection, resetMultiMain, getMainGraphic, cleanViewChange, setViewChange } from "store/main/actions";
import { showSnackbar, showBackdrop } from "store/popus/actions";
import { useDispatch } from "react-redux";
import Button from "@material-ui/core/Button";
import MenuItem from "@material-ui/core/MenuItem";
import { useForm } from "react-hook-form";
import AssessmentIcon from "@material-ui/icons/Assessment";
import { ListItemIcon } from "@material-ui/core";
import { getTipificationLevel2, getTipificationLevel3, resetGetTipificationLevel2, resetGetTipificationLevel3 } from "store/inbox/actions";
import { CellProps } from 'react-table';
import PropTypes from 'prop-types';

interface ItemProps {
    setViewSelected: (view: string) => void;
    setSearchValue: (searchValue: string) => void;
    row: Dictionary | null;
}

const getArrayBread = (nametmp: string, nameView1: string) => [
    { id: "view-1", name: nameView1 || "Reports" },
    { id: "view-2", name: nametmp },
];

const useStyles = makeStyles((theme) => ({
    container: {
        display: "flex",
        flexDirection: "column",
        width: "100%",
    },
    containerDetails: {
        marginTop: theme.spacing(3),
    },
    media: {
        objectFit: "contain",
    },
    containerSearch: {
        width: "100%",
        display: "flex",
        gap: theme.spacing(1),
        alignItems: "center",
        [theme.breakpoints.up("sm")]: {
            width: "50%",
        },
    },
    containerFilter: {
        width: "100%",
        marginBottom: theme.spacing(2),
        display: "flex",
        gap: 16,
        flexWrap: "wrap",
    },
    filterComponent: {
        minWidth: "220px",
        maxWidth: "260px",
    },
    containerFilterGeneral: {
        display: "flex",
        justifyContent: "space-between",
        backgroundColor: "#FFF",
        padding: theme.spacing(1),
    },
    title: {
        fontSize: "22px",
        fontWeight: "bold",
        color: theme.palette.text.primary,
    },
    containerHeader: {
        display: "block",
        marginBottom: 0,
        [theme.breakpoints.up("sm")]: {
            display: "flex",
        },
    },
    mb2: {
        marginBottom: theme.spacing(4),
    },
    button: {
        padding: 12,
        fontWeight: 500,
        fontSize: "14px",
        textTransform: "initial",
    },
    itemDate: {
        minHeight: 40,
        height: 40,
        border: "1px solid #bfbfc0",
        borderRadius: 4,
        color: "rgb(143, 146, 161)",
    },
}));

const TipificationReport: React.FC<ItemProps> = ({ setViewSelected, setSearchValue, row }) => {
    const { t } = useTranslation();
    const classes = useStyles();
    const dispatch = useDispatch();
    const multiData = useSelector((state) => state.main.multiData);
    const mainPaginated = useSelector((state) => state.main.mainPaginated);
    const resExportData = useSelector((state) => state.main.exportData);
    const [pageCount, setPageCount] = useState(0);
    const [waitSave, setWaitSave] = useState(false);
    const [totalrow, settotalrow] = useState(0);
    const [isTypificationFilterModalOpen, setTypificationFilterModalOpen] = useState(false);
    const [tipification1, setTipification1] = useState("");
    const [tipification2, setTipification2] = useState("");
    const [tipification3, setTipification3] = useState("");
    const tipificationLevel2 = useSelector((state) => state.inbox.tipificationsLevel2);
    const tipificationLevel3 = useSelector((state) => state.inbox.tipificationsLevel3);
    const [fetchDataAux, setfetchDataAux] = useState<IFetchData>({
        pageSize: 0,
        pageIndex: 0,
        filters: {},
        sorts: {},
        distinct: {},
        daterange: null,
    });
    const [allParameters, setAllParameters] = useState<any>({});
    const [openModal, setOpenModal] = useState(false);
    const [view, setView] = useState("GRID");

    const [selectedRow, setSelectedRow] = useState<Dictionary | undefined>({});

    useEffect(() => {
        dispatch(getMultiCollection([getCommChannelLstTypeDesc(), getClassificationLevel1("TIPIFICACION")]));
        dispatch(setViewChange(`report_${"tipification"}`));
        return () => {
            dispatch(cleanViewChange());
        };
    }, []);


    const cell = (props: CellProps<Dictionary>) => {// eslint-disable-next-line react/prop-types
        const column = props.cell.column;// eslint-disable-next-line react/prop-types
        const row = props.cell.row.original;
        return (
            <div onClick={() => {
                setSelectedRow(row);
                setOpenModal(true);
            }}>             
                {column.sortType === "datetime" && !!row[column.id] 
                ? convertLocalDate(row[column.id]).toLocaleString(undefined, {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                    hour: "numeric",
                    minute: "numeric",
                    second: "numeric"
                })// eslint-disable-next-line react/prop-types
                : row[column.id]}
            </div>
        )
    }

    const reportColumns = [
        {
            proargnames: "ticket", //accesor
            proargmodes: "t",
            proargtype: "character varying", //type
        },
        {
            proargnames: "datehour",
            proargmodes: "t",
            proargtype: "timestamp without time zone",
        },
        {
            proargnames: "enddate",
            proargmodes: "t",
            proargtype: "text",
        },
        {
            proargnames: "endtime",
            proargmodes: "t",
            proargtype: "text",
        },
        {
            proargnames: "firstinteractiondate",
            proargmodes: "t",
            proargtype: "text",
        },
        {
            proargnames: "firstinteractiontime",
            proargmodes: "t",
            proargtype: "text",
        },
        {
            proargnames: "person",
            proargmodes: "t",
            proargtype: "character varying",
        },
        {
            proargnames: "phone",
            proargmodes: "t",
            proargtype: "character varying",
        },
        {
            proargnames: "closedby",
            proargmodes: "t",
            proargtype: "character varying",
        },
        {
            proargnames: "agent",
            proargmodes: "t",
            proargtype: "text",
        },
        {
            proargnames: "closetype",
            proargmodes: "t",
            proargtype: "character varying",
        },
        {
            proargnames: "channel",
            proargmodes: "t",
            proargtype: "character varying",
        },
        {
            proargnames: "classificationlevel1",
            proargmodes: "t",
            proargtype: "character varying",
        },
        {
            proargnames: "classificationlevel2",
            proargmodes: "t",
            proargtype: "character varying",
        },
        {
            proargnames: "classificationlevel3",
            proargmodes: "t",
            proargtype: "character varying",
        },
    ];

    const columns = React.useMemo(
        () => [      
                          
            {
                Header: t(langKeys.report_tipification_ticket),
                accessor: 'ticket',
                groupedBy: false,  
                showColumn: true,   
                Cell: (props: CellProps<Dictionary>) => {
                    const { ticket } = props.cell.row.original || {};
                    return <div onClick={() => { setSelectedRow(props.cell.row.original); setOpenModal(true); }}>{ticket}</div>;
                },
            },
            {
                Header: t(langKeys.report_tipification_datehour),
                accessor: 'datehour',
                type: 'date',                
                sortType: 'datetime',
                groupedBy: false,  
                Cell: (props: CellProps<Dictionary>) => {
                    const { datehour } = props.cell.row.original || {};
                    return datehour ? new Date(datehour).toLocaleDateString() : null;
                },             
            },
            {
                Header: t(langKeys.report_tipification_enddate),
                accessor: 'enddate',
                groupedBy: false,           
                showColumn: true,     
                Cell: (props: CellProps<Dictionary>) => {
                    const { enddate } = props.cell.row.original || {};
                    return <div onClick={() => { setSelectedRow(props.cell.row.original); setOpenModal(true); }}>{enddate}</div>;
                },
            },
            {
                Header: t(langKeys.report_tipification_endtime),
                accessor: 'endtime',
                showColumn: true,                 
                Cell: (props: CellProps<Dictionary>) => {
                    const { endtime } = props.cell.row.original || {};
                    return <div onClick={() => { setSelectedRow(props.cell.row.original); setOpenModal(true); }}>{endtime}</div>;
                },
            },
            {
                Header: t(langKeys.report_tipification_firstinteractiondate),
                accessor: 'firstinteractiondate',
                groupedBy: false,  
                showColumn: true,               
                Cell: (props: CellProps<Dictionary>) => {
                    const { firstinteractiondate } = props.cell.row.original || {};
                    return <div onClick={() => { setSelectedRow(props.cell.row.original); setOpenModal(true); }}>{firstinteractiondate}</div>;
                },
            },
            {
                Header: t(langKeys.report_tipification_firstinteractiontime),
                accessor: 'firstinteractiontime',              
                showColumn: true, 
                Cell: (props: CellProps<Dictionary>) => {
                    const { firstinteractiontime } = props.cell.row.original || {};
                    return <div onClick={() => { setSelectedRow(props.cell.row.original); setOpenModal(true); }}>{firstinteractiontime}</div>;
                },
                
            },
            {
                Header: t(langKeys.report_tipification_person),
                accessor: 'person',
                groupedBy: false,  
                showColumn: true,                
                Cell: (props: CellProps<Dictionary>) => {
                    const { person } = props.cell.row.original || {};
                    return <div onClick={() => { setSelectedRow(props.cell.row.original); setOpenModal(true); }}>{person}</div>;
                },
            },
            {
                Header: t(langKeys.report_tipification_phone),
                accessor: 'phone',
                showColumn: true, 
                groupedBy: false,  
                Cell: (props: CellProps<Dictionary>) => {
                    const { phone } = props.cell.row.original || {};
                    return <div onClick={() => { setSelectedRow(props.cell.row.original); setOpenModal(true); }}>{phone}</div>;
                },
            },
            {
                Header: t(langKeys.report_tipification_closedby),
                accessor: 'closedby',
                showColumn: true, 
                groupedBy: false,  
                Cell: (props: CellProps<Dictionary>) => {
                    const { closedby } = props.cell.row.original || {};
                    return <div onClick={() => { setSelectedRow(props.cell.row.original); setOpenModal(true); }}>{closedby}</div>;
                },
            },
            {
                Header: t(langKeys.report_tipification_agent),
                accessor: 'agent',
                showColumn: true, 
                Cell: (props: CellProps<Dictionary>) => {
                    const { agent } = props.cell.row.original || {};
                    return <div onClick={() => { setSelectedRow(props.cell.row.original); setOpenModal(true); }}>{agent}</div>;
                },
            },
            {
                Header: t(langKeys.report_tipification_closetype),
                accessor: 'closetype',
                groupedBy: false,  
                showColumn: true, 
                Cell: (props: CellProps<Dictionary>) => {
                    const { closetype } = props.cell.row.original || {};
                    return <div onClick={() => { setSelectedRow(props.cell.row.original); setOpenModal(true); }}>{closetype}</div>;
                },
            },
            {
                Header: t(langKeys.report_tipification_channel),
                accessor: 'channel',               
                showColumn: true,               
                Cell: (props: CellProps<Dictionary>) => {
                    const { channel } = props.cell.row.original || {};
                    return <div onClick={() => { setSelectedRow(props.cell.row.original); setOpenModal(true); }}>{channel}</div>;
                },
            }, 
            {
                Header: t(langKeys.report_tipification_classificationlevel1),
                accessor: 'classificationlevel1',
                groupedBy: false,          
                Cell: (props: CellProps<Dictionary>) => {
                    const { classificationlevel1 } = props.cell.row.original || {};
                    return <div onClick={() => { setSelectedRow(props.cell.row.original); setOpenModal(true); }}>{classificationlevel1}</div>;
                },
            },
            {
                Header: t(langKeys.report_tipification_classificationlevel2),
                accessor: 'classificationlevel2',
                groupedBy: false,          
                Cell: (props: CellProps<Dictionary>) => {
                    const { classificationlevel2 } = props.cell.row.original || {};
                    return <div onClick={() => { setSelectedRow(props.cell.row.original); setOpenModal(true); }}>{classificationlevel2}</div>;
                },
            },
            {
                Header: t(langKeys.report_tipification_classificationlevel3),
                accessor: 'classificationlevel3',
                groupedBy: false,  
                Cell: (props: CellProps<Dictionary>) => {
                    const { classificationlevel3 } = props.cell.row.original || {};
                    return <div onClick={() => { setSelectedRow(props.cell.row.original); setOpenModal(true); }}>{classificationlevel3}</div>;
                },
            },  
        ],
        []
    );


    useEffect(() => {
        if (!mainPaginated.loading && !mainPaginated.error) {
            setPageCount(Math.ceil(mainPaginated.count / fetchDataAux.pageSize));
            settotalrow(mainPaginated.count);
        }
    }, [mainPaginated]);

    useEffect(() => {
        if (waitSave) {
            if (!resExportData.loading && !resExportData.error) {
                dispatch(showBackdrop(false));
                setWaitSave(false);
                resExportData.url?.split(",").forEach((x) => window.open(x, "_blank"));
            } else if (resExportData.error) {
                const errormessage = t(resExportData.code ?? "error_unexpected_error", {
                    module: t(langKeys.property).toLocaleLowerCase(),
                });
                dispatch(showSnackbar({ show: true, severity: "error", message: errormessage }));
                dispatch(showBackdrop(false));
                setWaitSave(false);
            }
        }
    }, [resExportData, waitSave]);

    const triggerExportData = ({ filters, sorts, daterange }: IFetchData) => {
        const columnsExport = columns.map((x: Dictionary) => ({
            key: x.accessor,
            alias: x.Header,
        }));
        dispatch(
            exportData(
                getReportExport("UFN_REPORT_TIPIFICATION_EXPORT", "tipification", {
                    filters,
                    sorts,
                    startdate: daterange.startDate!,
                    enddate: daterange.endDate!,
                    ...allParameters,
                }),
                "",
                "excel",
                false,
                columnsExport
            )
        );
        dispatch(showBackdrop(true));
        setWaitSave(true);
    };

    const fetchData = ({ pageSize, pageIndex, filters, sorts, distinct, daterange }: IFetchData) => {
        setfetchDataAux({ pageSize, pageIndex, filters, sorts, distinct, daterange });
        dispatch(
            getCollectionPaginated(
                getPaginatedForReports(
                    "UFN_REPORT_TIPIFICATION_SEL",
                    "UFN_REPORT_TIPIFICATION_TOTALRECORDS",
                    "tipification",
                    {
                        startdate: daterange.startDate!,
                        enddate: daterange.endDate!,
                        take: pageSize,
                        skip: pageIndex * pageSize,
                        sorts: sorts,
                        filters: {
                            ...(tipification1
                                ? { classificationlevel1: { value: tipification1, operator: "equals" } }
                                : {}),
                            ...(tipification2
                                ? { classificationlevel2: { value: tipification2, operator: "equals" } }
                                : {}),
                            ...(tipification3
                                ? { classificationlevel3: { value: tipification3, operator: "equals" } }
                                : {}),
                            ...filters,
                        },
                        ...allParameters,
                    }
                )
            )
        );
    };

    const handlerSearchGraphic = (daterange: any, column: string) => {
        setfetchDataAux((prev) => ({ ...prev, daterange }));
        dispatch(
            getMainGraphic(
                getReportGraphic("UFN_REPORT_TIPIFICATION_GRAPHIC", "tipification", {
                    filters: {},
                    sorts: {},
                    startdate: daterange?.startDate!,
                    enddate: daterange?.endDate!,
                    column,
                    summarization: "COUNT",
                    ...allParameters,
                })
            )
        );
    };

    const handleSelected = () => {
        dispatch(resetCollectionPaginated());
        dispatch(resetMultiMain());
        setSearchValue("");
        setViewSelected("view-1");
    };

    const setValue = (parameterName: any, value: any) => {
        setAllParameters({ ...allParameters, [parameterName]: value });
    };

    const [waitExport, setWaitExport] = useState(false);

    useEffect(() => {
        if (waitExport) {
            if (!resExportData.loading && !resExportData.error) {
                dispatch(showBackdrop(false));
                setWaitExport(false);
                resExportData.url?.split(",").forEach((x) => window.open(x, "_blank"));
            } else if (resExportData.error) {
                const errormessage = t(resExportData.code || "error_unexpected_error", {
                    module: t(langKeys.blacklist).toLocaleLowerCase(),
                });
                dispatch(showSnackbar({ show: true, severity: "error", message: errormessage }));
                dispatch(showBackdrop(false));
                setWaitExport(false);
            }
        }
    }, [resExportData, waitExport]);

    useEffect(() => {
        if (!mainPaginated.loading && !mainPaginated.error) {
            setPageCount(Math.ceil(mainPaginated.count / fetchDataAux.pageSize));
            settotalrow(mainPaginated.count);
            dispatch(showBackdrop(false));
        }
    }, [mainPaginated]);

    const handleOpeTypificationFilterModal = () => {
        setTypificationFilterModalOpen(true);
    };

    return (
        <div style={{ width: "100%", display: "flex", flex: 1, flexDirection: "column" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <TemplateBreadcrumbs
                    breadcrumbs={getArrayBread(t("report_" + "tipification"), t(langKeys.report_plural))}
                    handleClick={handleSelected}
                />
            </div>

            <>
                {view === "GRID" ? (
                    <TablePaginated
                        columns={columns}
                        data={mainPaginated.data}
                        totalrow={totalrow}
                        loading={mainPaginated.loading}
                        pageCount={pageCount}
                        filterrange={true}
                        showHideColumns={true}
                        ExtraMenuOptions={
                            <MenuItem
                                style={{ padding: "0.7rem 1rem", fontSize: "0.96rem" }}
                                onClick={handleOpeTypificationFilterModal}
                            >
                                <ListItemIcon>
                                    <CategoryIcon fontSize="small" style={{ fill: "grey", height: "25px" }} />
                                </ListItemIcon>
                                <Typography variant="inherit">{t(langKeys.filters) + " - " + t(langKeys.tipifications)}</Typography>
                            </MenuItem>
                        }
                        FiltersElement={
                            <FieldSelect
                                valueDefault={allParameters["channel"]}
                                label={t("report_tipification_filter_channels")}
                                className={classes.filterComponent}
                                key={"UFN_COMMUNICATIONCHANNEL_LST_TYPEDESC"}
                                variant="outlined"
                                loading={multiData.loading}
                                onChange={(value) => setValue("channel", value ? value["typedesc"] : "")}
                                data={
                                    multiData?.data[
                                        multiData?.data?.findIndex(
                                            (x) => x.key === "UFN_COMMUNICATIONCHANNEL_LST_TYPEDESC"
                                        )
                                    ]?.data
                                }
                                optionDesc={"type"}
                                optionValue={"typedesc"}
                            />
                        }
                        ButtonsElement={
                            <>
                                <Button
                                    className={classes.button}
                                    variant="contained"
                                    color="primary"
                                    disabled={mainPaginated.loading || mainPaginated.data.length <= 0}
                                    onClick={() => setOpenModal(true)}
                                    startIcon={<AssessmentIcon />}
                                >
                                    {t(langKeys.graphic_view)}
                                </Button>
                            </>
                        }
                        download={true}
                        fetchData={fetchData}
                        exportPersonalized={triggerExportData}
                    />
                ) : (
                    <div className={classes.container}>
                        <Graphic
                            graphicType={view.split("-")?.[1] || "BAR"}
                            column={view.split("-")?.[2] || "summary"}
                            openModal={openModal}
                            setOpenModal={setOpenModal}
                            daterange={fetchDataAux.daterange}
                            setView={setView}
                            row={row!!}
                            handlerSearchGraphic={handlerSearchGraphic}
                            FiltersElement={
                                <FieldSelect
                                    valueDefault={allParameters["channel"]}
                                    label={t("report_tipification_filter_channels")}
                                    className={classes.filterComponent}
                                    key={"UFN_COMMUNICATIONCHANNEL_LST_TYPEDESC"}
                                    variant="outlined"
                                    onChange={(value) => setValue("channel", value ? value["typedesc"] : "")}
                                    data={
                                        multiData?.data?.[
                                            multiData?.data.findIndex(
                                                (x) => x.key === "UFN_COMMUNICATIONCHANNEL_LST_TYPEDESC"
                                            )
                                        ]?.data
                                    }
                                    optionDesc={"type"}
                                    optionValue={"typedesc"}
                                />
                            }
                        />
                    </div>
                )}
            </>

            <SummaryGraphic
                openModal={openModal}
                setOpenModal={setOpenModal}
                setView={setView}
                row={row}
                daterange={fetchDataAux.daterange}
                filters={fetchDataAux.filters}
                columns={reportColumns.map((x) => x.proargnames)}
                columnsprefix={"report_" + "tipification" + "_"}
                allParameters={allParameters}
            />
            <DialogZyx
                open={isTypificationFilterModalOpen}
                title={t(langKeys.typify)}
                buttonText1={t(langKeys.close)}
                buttonText2={t(langKeys.apply)}
                handleClickButton1={() => setTypificationFilterModalOpen(false)}
                handleClickButton2={() => {
                    setTypificationFilterModalOpen(false);
                    fetchData(fetchDataAux);
                }}
                maxWidth="sm"
                buttonStyle1={{ marginBottom: "0.3rem" }}
                buttonStyle2={{ marginRight: "1rem", marginBottom: "0.3rem" }}
            >
                <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem", marginBottom: "1rem" }}>
                    <FieldSelect
                        label={t(langKeys.report_tipification_classificationlevel1)}
                        className="col-12"
                        loading={multiData.loading}
                        data={
                            multiData?.data?.[
                                multiData?.data.findIndex(
                                    (x) => x.key === "UFN_CONVERSATIONCLASSIFICATIONLIST_LEVEL1_SEL"
                                )
                            ]?.data
                        }
                        valueDefault={tipification1}
                        onChange={(e) => {
                            setTipification1(e?.description || "");
                            setTipification2("");
                            setTipification3("");

                            if (e?.classificationid) dispatch(getTipificationLevel2(e.classificationid));
                            else dispatch(resetGetTipificationLevel2());
                        }}
                        optionDesc="description"
                        optionValue="description"
                    />
                    <FieldSelect
                        label={t(langKeys.report_tipification_classificationlevel2)}
                        className="col-12"
                        valueDefault={tipification2}
                        onChange={(value) => {
                            setTipification2(value?.description || "");
                            setTipification3("");
                            if (value?.classificationid) dispatch(getTipificationLevel3(value.classificationid));
                            else dispatch(resetGetTipificationLevel3());
                        }}
                        data={tipificationLevel2.data}
                        loading={tipificationLevel2.loading}
                        optionDesc="description"
                        optionValue="description"
                    />
                    <FieldSelect
                        label={t(langKeys.report_tipification_classificationlevel3)}
                        className="col-12"
                        valueDefault={tipification3}
                        onChange={(value) => {
                            setTipification3(value?.description || "");
                        }}
                        data={tipificationLevel3.data}
                        loading={tipificationLevel3.loading}
                        optionDesc="description"
                        optionValue="description"
                    />
                </div>
            </DialogZyx>
        </div>
    );
};

interface SummaryGraphicProps {
    openModal: boolean;
    setOpenModal: (value: boolean) => void;
    setView: (value: string) => void;
    row: Dictionary | null;
    daterange: any;
    filters: Dictionary;
    columns: string[];
    columnsprefix: string;
    allParameters?: any;
}

const SummaryGraphic: React.FC<SummaryGraphicProps> = ({
    openModal,
    setOpenModal,
    setView,
    row,
    daterange,
    filters,
    columns,
    columnsprefix,
    allParameters = {},
}) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();

    const {
        register,
        handleSubmit,
        setValue,
        getValues,
        formState: { errors },
    } = useForm<any>({
        defaultValues: {
            graphictype: "BAR",
            column: "",
        },
    });

    useEffect(() => {
        register("graphictype", { validate: (value: any) => (value && value.length) || t(langKeys.field_required) });
        register("column", { validate: (value: any) => (value && value.length) || t(langKeys.field_required) });
    }, [register]);

    const handleCancelModal = () => {
        setOpenModal(false);
    };

    const handleAcceptModal = handleSubmit((data) => {
        triggerGraphic(data);
    });

    const triggerGraphic = (data: any) => {
        setView(`CHART-${data.graphictype}-${data.column}`);
        setOpenModal(false);
        dispatch(
            getMainGraphic(
                getReportGraphic("UFN_REPORT_TIPIFICATION_GRAPHIC" || "", "tipification" || "", {
                    filters,
                    sorts: {},
                    startdate: daterange?.startDate!,
                    enddate: daterange?.endDate!,
                    column: data.column,
                    summarization: "COUNT",
                    ...allParameters,
                })
            )
        );
    };

    const excludeTypification = [
        "ticket",
        "datehour",
        "enddate",
        "endtime",
        "firstinteractiondate",
        "firstinteractiontime",
        "phone"
    ];

    const filteredColumns = columns.filter((column) => !excludeTypification.includes(column));
    return (
        <DialogZyx
            open={openModal}
            title={t(langKeys.graphic_configuration)}
            button1Type="button"
            buttonText1={t(langKeys.cancel)}
            handleClickButton1={handleCancelModal}
            button2Type="button"
            buttonText2={t(langKeys.accept)}
            handleClickButton2={handleAcceptModal}
        >
            <div className="row-zyx">
                <FieldSelect
                    label={t(langKeys.graphic_type)}
                    className="col-12"
                    valueDefault={getValues("graphictype")}
                    error={(errors?.graphictype?.message as string) ?? ""}
                    onChange={(value) => setValue("graphictype", value?.key)}
                    data={[
                        { key: "BAR", value: "BAR" },
                        { key: "PIE", value: "PIE" },
                        { key: "LINE", value: "LINEA" },
                    ]}
                    uset={true}
                    prefixTranslation="graphic_"
                    optionDesc="value"
                    optionValue="key"
                />
            </div>
            <div className="row-zyx">
                <FieldSelect
                    label={t(langKeys.graphic_view_by)}
                    className="col-12"
                    valueDefault={getValues("column")}
                    error={(errors?.column?.message as string) ?? ""}
                    onChange={(value) => setValue("column", value?.key)}
                    data={filteredColumns.map((x) => ({ key: x, value: x }))}
                    optionDesc="value"
                    optionValue="key"
                    uset={true}
                    prefixTranslation={columnsprefix}
                />
            </div>
        </DialogZyx>
    );
};

export default TipificationReport;