import React, { useEffect, useState } from "react";
import Typography from "@material-ui/core/Typography";
import TablePaginated from "components/fields/table-paginated";
import Graphic from "components/fields/Graphic";
import { makeStyles } from "@material-ui/core/styles";
import { useTranslation } from "react-i18next";
import { langKeys } from "lang/keys";
import CategoryIcon from "@material-ui/icons/Category";
import { TemplateBreadcrumbs, FieldSelect, DialogZyx, FieldMultiSelect,} from "components";
import { useSelector } from "hooks";
import { Dictionary, IFetchData } from "@types";
import { getPaginatedForReports, getReportExport, convertLocalDate, getReportGraphic, getUserAsesorByOrgID, getReportFilterSel, getCommChannelLstTypeDesc } from "common/helpers";
import { getCollectionPaginated, resetCollectionPaginated, exportData, getMultiCollection, resetMultiMain, getMainGraphic, cleanViewChange, setViewChange } from "store/main/actions";
import { showSnackbar, showBackdrop } from "store/popus/actions";
import { useDispatch } from "react-redux";
import Button from "@material-ui/core/Button";
import MenuItem from "@material-ui/core/MenuItem";
import { useForm } from "react-hook-form";
import AssessmentIcon from "@material-ui/icons/Assessment";
import { ListItemIcon } from "@material-ui/core";
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

const useStyles = makeStyles(() => ({
    container: {
        display: "flex",
        flexDirection: "column",
        width: "100%",
    },  
    filterComponent: {
        minWidth: "220px",
        maxWidth: "260px",
    },   
    button: {
        padding: 12,
        fontWeight: 500,
        fontSize: "14px",
        textTransform: "initial",
    },   
}));

const ProductivityHoursReport: React.FC<ItemProps> = ({ setViewSelected, setSearchValue, row }) => {
    const { t } = useTranslation();
    const classes = useStyles();
    const dispatch = useDispatch();
    const multiData = useSelector((state) => state.main.multiData);
    const mainPaginated = useSelector((state) => state.main.mainPaginated);
    const resExportData = useSelector((state) => state.main.exportData);
    const [pageCount, setPageCount] = useState(0);
    const [waitSave, setWaitSave] = useState(false);
    const [selectedRow, setSelectedRow] = useState<Dictionary | undefined>({});
    const [totalrow, settotalrow] = useState(0);
    const [isTypificationFilterModalOpen, setTypificationFilterModalOpen] = useState(false);   
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

    useEffect(() => {
        dispatch(getMultiCollection([getReportFilterSel("UFN_REPORT_HOURS_SEL", "UFN_REPORT_HOURS_SEL", ""), getUserAsesorByOrgID(), getCommChannelLstTypeDesc()]));
        dispatch(setViewChange(`report_${"userproductivityhours"}`));
        return () => {
            dispatch(cleanViewChange());
        };
    }, []);

    const reportColumns = [
        {
        "proargnames": "datehour",
        "proargmodes": "t",
        "proargtype": "date"
        },
        {
        "proargnames": "agent",
        "proargmodes": "t",
        "proargtype": "text"
        },
        {
        "proargnames": "hoursrange",
        "proargmodes": "t",
        "proargtype": "text"
        },
        {
        "proargnames": "worktime",
        "proargmodes": "t",
        "proargtype": "text"
        },
        {
        "proargnames": "busytimewithinwork",
        "proargmodes": "t",
        "proargtype": "text"
        },
        {
        "proargnames": "freetimewithinwork",
        "proargmodes": "t",
        "proargtype": "text"
        },
        {
        "proargnames": "busytimeoutsidework",
        "proargmodes": "t",
        "proargtype": "text"
        },
        {
        "proargnames": "onlinetime",
        "proargmodes": "t",
        "proargtype": "text"
        },
        {
        "proargnames": "availabletime",
        "proargmodes": "t",
        "proargtype": "text"
        },
        {
        "proargnames": "idletime",
        "proargmodes": "t",
        "proargtype": "text"
        },
        {
        "proargnames": "idletimewithoutattention",
        "proargmodes": "t",
        "proargtype": "text"
        },
        {
        "proargnames": "qtytickets",
        "proargmodes": "t",
        "proargtype": "bigint"
        },
        {
        "proargnames": "qtyconnection",
        "proargmodes": "t",
        "proargtype": "bigint"
        },
        {
        "proargnames": "qtydisconnection",
        "proargmodes": "t",
        "proargtype": "bigint"
        }
    ];

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
                }) // eslint-disable-next-line react/prop-types
                : row[column.id]}
            </div>
        )
    }
  
    const columns = React.useMemo(
        () => [                    
            {
                Header: t(langKeys.report_userproductivityhours_datehour),
                accessor: 'datehour',                          
                type: 'date',
                sortType: 'datetime',
                Cell: (props: CellProps<Dictionary>) => {
                    const { datehour } = props.cell.row.original || {};
                    return datehour ? new Date(datehour).toLocaleDateString() : null;
                }            
               
            },
            {
                Header: t(langKeys.report_userproductivityhours_agent),
                accessor: 'agent',            
                Cell: (props: CellProps<Dictionary>) => {
                    const { agent } = props.cell.row.original || {};
                    return <div onClick={() => { setSelectedRow(props.cell.row.original); setOpenModal(true); }}>{agent}</div>;
                },
            },
            {
                Header: t(langKeys.report_userproductivityhours_hoursrange),
                accessor: 'hoursrange',            
                Cell: (props: CellProps<Dictionary>) => {
                    const { hoursrange } = props.cell.row.original || {};
                    return <div onClick={() => { setSelectedRow(props.cell.row.original); setOpenModal(true); }}>{hoursrange}</div>;
                },
            },
            {
                Header: t(langKeys.report_userproductivityhours_worktime),
                helpText: t(langKeys.report_userproductivityhours_worktime_help),
                accessor: 'worktime',
                Cell: (props: CellProps<Dictionary>) => {
                    const { worktime } = props.cell.row.original || {};
                    return <div onClick={() => { setSelectedRow(props.cell.row.original); setOpenModal(true); }}>{worktime}</div>;
                },
            },
            {
                Header: t(langKeys.report_userproductivityhours_busytimeoutsidework),
                helpText: t(langKeys.report_userproductivityhours_busytimeoutsidework),
                accessor: 'busytimeoutsidework',
                showColumn: true,  
                Cell: (props: CellProps<Dictionary>) => {
                    const { busytimeoutsidework } = props.cell.row.original || {};
                    return <div onClick={() => { setSelectedRow(props.cell.row.original); setOpenModal(true); }}>{busytimeoutsidework}</div>;
                },
            },
            {
                Header: t(langKeys.report_userproductivityhours_busytimewithinwork),
                accessor: 'busytimewithinwork',
                helpText: t(langKeys.report_userproductivityhours_busytimewithinwork_help),             
                showColumn: true,                     
                Cell: (props: CellProps<Dictionary>) => {
                    const { busytimewithinwork } = props.cell.row.original || {};
                    return <div onClick={() => { setSelectedRow(props.cell.row.original); setOpenModal(true); }}>{busytimewithinwork}</div>;
                },
            },
            {
                Header: t(langKeys.report_userproductivityhours_freetimewithinwork),
                accessor: 'freetimewithinwork',
                showColumn: true,                   
                Cell: (props: CellProps<Dictionary>) => {
                    const { freetimewithinwork } = props.cell.row.original || {};
                    return <div onClick={() => { setSelectedRow(props.cell.row.original); setOpenModal(true); }}>{freetimewithinwork}</div>;
                },
            },
            {
                Header: t(langKeys.report_userproductivityhours_onlinetime),
                accessor: 'onlinetime',         
                helpText: t(langKeys.report_userproductivityhours_onlinetime_help),            
                Cell: (props: CellProps<Dictionary>) => {
                    const { onlinetime } = props.cell.row.original || {};
                    return <div onClick={() => { setSelectedRow(props.cell.row.original); setOpenModal(true); }}>{onlinetime}</div>;
                },
            },
            {
                Header: t(langKeys.report_userproductivityhours_availabletime),
                accessor: 'availabletime',
                helpText: t(langKeys.report_userproductivityhours_availabletime_help),
                groupedBy: false,  
                showColumn: true, 
                Cell: (props: CellProps<Dictionary>) => {
                    const { availabletime } = props.cell.row.original || {};
                    return <div onClick={() => { setSelectedRow(props.cell.row.original); setOpenModal(true); }}>{availabletime}</div>;
                },
            },
            {
                Header: t(langKeys.report_userproductivityhours_idletime),
                accessor: 'idletime',
                groupedBy: false,  
                helpText: t(langKeys.report_userproductivityhours_idletime_help),
                showColumn: true,     
                Cell: (props: CellProps<Dictionary>) => {
                    const { idletime } = props.cell.row.original || {};
                    return <div onClick={() => { setSelectedRow(props.cell.row.original); setOpenModal(true); }}>{idletime}</div>;
                },
            },
            {
                Header: t(langKeys.report_userproductivityhours_idletimewithoutattention),
                accessor: 'idletimewithoutattention',                 
                Cell: (props: CellProps<Dictionary>) => {
                    const { idletimewithoutattention } = props.cell.row.original || {};
                    return <div onClick={() => { setSelectedRow(props.cell.row.original); setOpenModal(true); }}>{idletimewithoutattention}</div>;
                },
            },
            {
                Header: t(langKeys.report_userproductivityhours_qtytickets),
                accessor: 'qtytickets',
                helpText: t(langKeys.report_userproductivityhours_qtytickets_help),
                groupedBy: false,  
                Cell: (props: CellProps<Dictionary>) => {
                    const { qtytickets } = props.cell.row.original || {};
                    return <div onClick={() => { setSelectedRow(props.cell.row.original); setOpenModal(true); }}>{qtytickets}</div>;
                },
            },
            {
                Header: t(langKeys.report_userproductivityhours_qtyconnection),
                accessor: 'qtyconnection',         
                helpText: t(langKeys.report_userproductivityhours_qtyconnection_help),      
                showColumn: true,     
                Cell: (props: CellProps<Dictionary>) => {
                    const { qtyconnection } = props.cell.row.original || {};
                    return <div onClick={() => { setSelectedRow(props.cell.row.original); setOpenModal(true); }}>{qtyconnection}</div>;
                },
            },
            {
                Header: t(langKeys.report_userproductivityhours_qtydisconnection),
                helpText: t(langKeys.report_userproductivityhours_qtydisconnection_help),      
                accessor: 'qtydisconnection',
                showColumn: true,     
                groupedBy: false,  
                Cell: (props: CellProps<Dictionary>) => {
                    const { qtydisconnection } = props.cell.row.original || {};
                    return <div onClick={() => { setSelectedRow(props.cell.row.original); setOpenModal(true); }}>{qtydisconnection}</div>;
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
                getReportExport("UFN_REPORT_USERPRODUCTIVITYHOURS_EXPORT", "userproductivityhours", {
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

    const fetchData = ({ pageSize, pageIndex, filters, sorts, daterange }: IFetchData) => {
        setfetchDataAux({ pageSize, pageIndex, filters, sorts, daterange });
        dispatch(
            getCollectionPaginated(
                getPaginatedForReports(
                    "UFN_REPORT_USERPRODUCTIVITYHOURS_SEL",
                    "UFN_REPORT_USERPRODUCTIVITYHOURS_TOTALRECORDS",
                    "userproductivityhours",
                    {
                        startdate: daterange.startDate!,
                        enddate: daterange.endDate!,
                        take: pageSize,
                        skip: pageIndex * pageSize,
                        sorts: sorts,
                        filters: {...filters},
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
                getReportGraphic("UFN_REPORT_USERPRODUCTIVITYHOURS_GRAPHIC", "userproductivityhours", {
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
                    breadcrumbs={getArrayBread(t("report_" + "userproductivityhours"), t(langKeys.report_plural))}
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
                                <Typography variant="inherit">{t(langKeys.filters) + " - " + t(langKeys.report_userproductivityhours)}</Typography>
                            </MenuItem>
                        }
                        FiltersElement={
                            <FieldSelect
                                valueDefault={allParameters["channel"]}
                                label={t("report_userproductivityhours_filter_channels")}
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
                                    label={t("report_userproductivityhours_filter_channels")}
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
                columnsprefix={"report_" + "userproductivityhours" + "_"}
                allParameters={allParameters}
            />
            <DialogZyx
                open={isTypificationFilterModalOpen}
                title={t(langKeys.filters)}
                buttonText1={t(langKeys.close)}         
                buttonText2={t(langKeys.apply)}         
                handleClickButton1={() => setTypificationFilterModalOpen(false)}      
                handleClickButton2={() => {
                    setTypificationFilterModalOpen(false);
                    fetchData(fetchDataAux)
                }}           
                maxWidth="sm"
                buttonStyle1={{ marginBottom: "0.3rem" }}
                buttonStyle2={{ marginRight: "1rem", marginBottom: "0.3rem" }}
            >
                <div className="row-zyx">
                    <FieldMultiSelect
                        limitTags={1}
                        label={t(langKeys.hours)}
                        className={classes.filterComponent + " col-6"}
                        valueDefault={allParameters?.hours || ""}
                        key={"UFN_REPORT_HOURS_SEL"}
                        onChange={(value) =>
                            setValue("hours", value ? value.map((o: Dictionary) => o["hours"]).join() : "")
                        }
                        variant="outlined"
                        data={multiData?.data?.find(x=>x.key==="UFN_REPORT_HOURS_SEL")?.data || []}
                        optionDesc={"hourdescription"}
                        optionValue={"hours"}
                    />
                    <FieldSelect 
                        label={t(langKeys.agent)}
                        className={classes.filterComponent + " col-6"}
                        valueDefault={allParameters?.asesorid || ""}
                        key={"UFN_USER_ASESORBYORGID_LST"}
                        onChange={(value) => setValue("asesorid", value?.userid || 0) }
                        variant="outlined"
                        data={multiData?.data?.find(x=>x.key==="UFN_USER_ASESORBYORGID_LST")?.data || []}
                        optionDesc={"userdesc"}
                        optionValue={"userid"}
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
                getReportGraphic("UFN_REPORT_USERPRODUCTIVITYHOURS_GRAPHIC" || "", "userproductivityhours" || "", {
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

    const excludeProductivityHours = [
        "busytimewithinwork",
        "freetimewithinwork",  
        "busytimeoutsidework",
        "availabletime",
        "idletime",
        "idletimewithoutattention",
        "qtydisconnection",   
    ];

    const filteredColumns = columns.filter((column) => !excludeProductivityHours.includes(column));
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

export default ProductivityHoursReport;