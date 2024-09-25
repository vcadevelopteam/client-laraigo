/* eslint-disable react-hooks/exhaustive-deps */
import React, { FC, useEffect, useState } from 'react'; // we need this to make JSX compile
import { useSelector } from 'hooks';
import { useDispatch } from 'react-redux';
import { TemplateBreadcrumbs, DateRangePicker, FieldEdit, DialogZyx, FieldSelect } from 'components';
import { Dictionary } from "@types";
import TableZyx from 'components/fields/table-simple';
import { makeStyles } from '@material-ui/core/styles';
import SearchIcon from '@material-ui/icons/Search';
import AssessmentIcon from '@material-ui/icons/Assessment';
import Button from '@material-ui/core/Button';
import { useTranslation } from 'react-i18next';
import { langKeys } from 'lang/keys';
import { CalendarIcon, DownloadIcon } from 'icons';
import { showSnackbar } from 'store/popus/actions';
import { getCollectionDynamic, resetMainDynamic, exportDynamic, resetExportMainDynamic } from 'store/main/actions';
import { Range } from 'react-date-range';
import { getDateCleaned, secondsToTime } from 'common/helpers/functions'
import { useForm } from 'react-hook-form';
import Graphic from 'components/fields/Graphic';
import ListIcon from '@material-ui/icons/List';
import { exportExcel } from 'common/helpers';

const getArrayBread = (nametmp: string, nameView1: string) => ([
    { id: "view-1", name: nameView1 || "Reports" },
    { id: "view-2", name: nametmp }
]);

const useStyles = makeStyles((theme) => ({
    containerFilters: {
        display: 'flex',
        alignItems: 'center',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        gap: theme.spacing(1),
        marginTop: theme.spacing(1),
        backgroundColor: '#FFF',
        padding: theme.spacing(1),
    },
    itemFilter: {
        flex: '0 0 220px',
    },
    itemDate: {
        minHeight: 40,
        height: 40,
        border: '1px solid #bfbfc0',
        borderRadius: 4,
        color: 'rgb(143, 146, 161)'
    },
    itemFlex: {
        display: 'flex',
        flexWrap: 'wrap',
        gap: theme.spacing(1),
    }
}));

interface SummaryGraphicProps {
    openModal: boolean;
    setOpenModal: (value: boolean) => void;
    setView: (value: string) => void;
    columns: Dictionary[];
    getCollection: () => void;
}

export interface IReport {
    columns: Dictionary[];
    filters: Dictionary[];
    summaries: Dictionary[];
    description: string;
    reporttemplateid: number;
}

interface DetailReportProps {
    item: IReport;
    setViewSelected: (view: string) => void;
}

const initialRange = {
    startDate: new Date(new Date().setDate(1)),
    endDate: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0),
    key: 'selection'
}

const SummaryGraphic: React.FC<SummaryGraphicProps> = ({ openModal, setOpenModal, setView, columns, getCollection }) => {
    const { t } = useTranslation();

    const { register, handleSubmit, setValue, getValues, formState: { errors } } = useForm<any>({
        defaultValues: {
            graphictype: 'BAR',
            column: '',
            columntext: ''
        }
    });

    useEffect(() => {
        register('graphictype', { validate: (value: any) => (value?.length) || t(langKeys.field_required) });
        register('column', { validate: (value: any) => (value?.length) || t(langKeys.field_required) });
    }, [register]);

    const handleCancelModal = () => {
        setOpenModal(false);
    }

    const handleAcceptModal = handleSubmit((data) => {
        triggerGraphic(data);
    });

    const triggerGraphic = (data: any) => {
        getCollection();
        setView(`CHART-${data.graphictype}-${data.column}-${data.columntext}`);
        setOpenModal(false);

    }

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
                    valueDefault={getValues('graphictype')}
                    error={errors?.graphictype?.message}
                    onChange={(value) => setValue('graphictype', value?.key)}
                    data={[{ key: 'BAR', value: 'BAR' }, { key: 'PIE', value: 'PIE' }]}
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
                    valueDefault={getValues('column')}
                    error={errors?.column?.message}
                    onChange={(value) => {
                        setValue('column', value?.accessor || '');
                        setValue('columntext', value?.Header || '');
                    }}
                    data={columns}
                    optionDesc="Header"
                    optionValue="accessor"
                />
            </div>
        </DialogZyx>
    )
}

const format = (date: Date) => date.toISOString().split('T')[0];

const FilterDynamic: FC<{ filter: Dictionary, setFiltersDynamic: (param: any) => void }> = ({ filter, setFiltersDynamic }) => {
    const [openDialogDate, setOpenDialogDate] = useState(false);
    const [dateRange, setDateRange] = useState<Range>(initialRange);
    const classes = useStyles();
    const { t } = useTranslation();
    const choosenwidth = filter.description.length * 18

    useEffect(() => {
        setFiltersDynamic((prev: any) => ({
            ...prev,
            [filter.columnname]: {
                ...prev[filter.columnname],
                start: getDateCleaned(dateRange.startDate!),
                end: getDateCleaned(dateRange.endDate!)
            }
        }))
    }, [dateRange])

    if (filter.type === "timestamp without time zone" || filter.type === "date") {
        return (
            <div>
                <DateRangePicker
                    open={openDialogDate}
                    setOpen={setOpenDialogDate}
                    range={dateRange}
                    onSelect={setDateRange}
                >
                    <Button
                        className={classes.itemDate}
                        startIcon={<CalendarIcon />}
                        onClick={() => setOpenDialogDate(!openDialogDate)}
                    >
                        {format(dateRange.startDate!) + " - " + format(dateRange.endDate!)}
                    </Button>
                </DateRangePicker>
            </div>
        )
    } else {
        return (
            <FieldEdit
                label={filter.type === "variable" ? filter.description : t(`personalizedreport_${filter.description}`)}
                variant="outlined"
                width={choosenwidth < 250 ? 250 : choosenwidth}
                disabled={filter.type_filter === "unique_value"}
                size="small"
                valueDefault={filter.type_filter === "unique_value" ? t(langKeys.filter_unique_value) : filter.filter || ""}
                onChange={(value) => setFiltersDynamic((prev: any) => ({
                    ...prev,
                    [filter.columnname]: {
                        ...prev[filter.columnname],
                        value: value
                    }
                }))}
            />
        )
    }
}

const PersonalizedReport: FC<DetailReportProps> = ({ setViewSelected, item: { columns, summaries, filters, description, reporttemplateid } }) => {
    const classes = useStyles()
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const [dataCleaned, setDataCleaned] = useState<Dictionary[]>([])
    const mainDynamic = useSelector(state => state.main.mainDynamic);
    const resExportDynamic = useSelector(state => state.main.exportDynamicData);
    const [showDialogGraphic, setShowDialogGraphic] = useState(false);
    const [dataFiltered, setDataFiltered] = useState<Dictionary[]>([]);
    const [footer, setFooter] = useState<Dictionary | null>(null);
    const [view, setView] = useState('GRID');
    
    const [filtersDynamic, setFiltersDynamic] = useState<Dictionary>(filters.reduce((acc: Dictionary, item: Dictionary) => ({
        ...acc,
        [item.columnname]: {
            ...item,
            value: item.filter || "",
            filter: undefined
        }
    }), {}));

    const columnsDynamic = React.useMemo(
        () => columns.map((x: Dictionary) => ({
            Header: x.alias,
            accessor: x.columnname.replace(".", ""),
            Footer: () => footer?.[x.columnname.replace(".", "")]
        })), [columns, footer]
    )

    useEffect(() => {
        dispatch(resetMainDynamic());
        dispatch(resetExportMainDynamic());
    }, [])


    useEffect(() => {
        if (!resExportDynamic.loading && !resExportDynamic.error && resExportDynamic.url) {
            window.open(resExportDynamic.url, '_blank');
        } else if (resExportDynamic.error) {
            const errormessage = t(resExportDynamic.code || "error_unexpected_error")
            dispatch(showSnackbar({ show: true, severity: "error", message: errormessage }))
        }
    }, [resExportDynamic]);

    const exportDataFiltered = () => {
        exportExcel(description, dataFiltered, columnsDynamic)
    }

    useEffect(() => {
        if (!mainDynamic.loading && !mainDynamic.error) {
            let datato = mainDynamic.data;
            if (summaries.length > 0) {
                setFooter(datato[0]);
                datato.shift()
            }
            if (columns.some(x => x.columnname.replace(".", "") === "conversationclosetype")) {
                datato = datato.map(x => {
                    const cc = t(`type_close_${(x.conversationclosetype || "").toLowerCase().replace(/ /gi, "_")}`)
                    return {
                        ...x,
                        conversationclosetype: cc.includes("type_close") ? x.conversationclosetype : cc
                    }
                })
            }
            const columnsDate = columns.filter(x => ["timestamp without time zone", "date", "boolean", "interval"].includes(x.type) || ["conversation.tags"].includes(x.columnname));
            if (columnsDate.length > 0) {
                setDataCleaned(datato.map(x => {
                    columnsDate.forEach(y => {
                        const columnclean = y.columnname.replace(".", "");
                        if (["timestamp without time zone", "date"].includes(y.type)) {
                            if (x[columnclean]) {
                                const date = new Date(x[columnclean]);
                                if (!isNaN(date.getTime())) {
                                    if (y.type === "timestamp without time zone") {
                                        if (y.format === "time") {
                                            x[columnclean] = date.toLocaleString().replace(",", "").split(" ")[1];
                                        } else if (y.format === "date") {
                                            x[columnclean] = date.toLocaleString().replace(",", "").split(" ")[0];
                                        } else {
                                            x[columnclean] = date.toLocaleString();
                                        }
                                    }
                                    else
                                        x[columnclean] = date.toLocaleDateString();
                                } else {
                                    const regex = /[0-9]{4}-[0-9]{2}-[0-9]{2}\s[0-9]{2}:[0-9]{2}:[0-9]{2}.[0-9]{0,6}Z/gi
                                    const resRegex = (x[columnclean] + "").matchAll(regex);
                                    Array.from(resRegex).forEach(z => {
                                        if (z) {
                                            if (y.type === "timestamp without time zone")
                                                x[columnclean] = x[columnclean].replace(z, new Date(z[0]).toLocaleString());
                                            else
                                                x[columnclean] = x[columnclean].replace(z, new Date(z[0]).toLocaleDateString());
                                        }
                                    })
                                }
                            }
                        } else if (y.type === "interval" && x[columnclean]) {
                            x[columnclean] = secondsToTime(x[columnclean], y.format)
                        } 
                        if (["boolean"].includes(y.type)) {
                            if (columnclean === "hsmcampaignsuccess") {
                                x[columnclean] = t(`status_${x[columnclean]}`)
                            } else {
                                x[columnclean] = x[columnclean] ? t("yes") : t("no")
                            }
                        }
                        if (["conversation.tags"].includes(y.columnname)) {
                            const tagsCleaned = x[columnclean]?.split(',').reduce((accx: Dictionary, itemx: string) => ({
                                lastTag: itemx,
                                acc: accx.lastTag === itemx ? accx.acc : [...accx.acc, itemx]
                            }), { lastTag: '', acc: [] })

                            x[columnclean] = tagsCleaned?.acc.join(",") ?? "";
                        }
                    })
                    return x;
                }));
            } else {
                setDataCleaned(datato);
            }
        }
    }, [mainDynamic])

    const onSearch = (isExport: boolean = false) => {
        const body = {
            // columns,
            reporttemplateid: reporttemplateid,
            parameters: {
                offset: (new Date().getTimezoneOffset() / 60) * -1,
            },
            // summaries,
            filters: Object.values(filtersDynamic)
        }
        if (isExport)
            dispatch(exportDynamic(body, description, "excel", columnsDynamic.map(x => ({
                key: x.accessor,
                alias: x.Header
            }))));
        else
            dispatch(getCollectionDynamic(body));
    }

    return (
        <>
            <div style={{ width: '100%', display: 'flex', flexDirection: 'column', flex: 1 }}>
                <TemplateBreadcrumbs
                    breadcrumbs={getArrayBread(description, t(langKeys.report_plural))}
                    handleClick={setViewSelected}
                />
                <div className={classes.containerFilters}>
                    <div className={classes.itemFlex}>
                        {Object.values(filters).map((filter: Dictionary) => (
                            <FilterDynamic
                                key={filter.columnname}
                                filter={filter}
                                setFiltersDynamic={setFiltersDynamic}
                            />
                        ))}
                        <Button
                            disabled={mainDynamic.loading}
                            variant="contained"
                            color="primary"
                            startIcon={<SearchIcon style={{ color: 'white' }} />}
                            style={{ backgroundColor: '#55BD84', width: 120 }}
                            onClick={() => onSearch()}
                        >
                            {t(langKeys.search)}
                        </Button>
                    </div>
                    <div className={classes.itemFlex}>
                        <Button
                            variant="contained"
                            color="primary"
                            disabled={mainDynamic.loading || !mainDynamic.data.length}
                            onClick={() => setShowDialogGraphic(true)}
                            startIcon={<AssessmentIcon />}
                        >
                            {view === "GRID" ? t(langKeys.graphic_view) : t(langKeys.configuration)}
                        </Button>
                        {view === "GRID" && (
                            <Button
                                variant="contained"
                                color="primary"
                                disabled={resExportDynamic.loading}
                                onClick={exportDataFiltered}
                                startIcon={<DownloadIcon />}
                            >{t(langKeys.download)}
                            </Button>
                        )}
                        {view !== "GRID" && (
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={() => setView('GRID')}
                                startIcon={<ListIcon />}
                            >
                                {t(langKeys.grid_view)}
                            </Button>
                        )}
                    </div>
                </div>
                {view === "GRID" && (
                    <TableZyx
                        columns={columnsDynamic}
                        filterGeneral={false}
                        data={dataCleaned}
                        setDataFiltered={setDataFiltered}
                        download={false}
                        loading={mainDynamic.loading}
                        useFooter={!!footer}
                    />
                )}
                {view !== "GRID" && (
                    <Graphic
                        graphicType={view.split("-")?.[1] || "BAR"}
                        column={view.split("-")?.[2] || "summary"}
                        openModal={showDialogGraphic}
                        setOpenModal={setShowDialogGraphic}
                        daterange={{}}
                        setView={setView}
                        withFilters={false}
                        withButtons={false}
                        data={dataCleaned}
                        loading={mainDynamic.loading}
                        handlerSearchGraphic={() => null}
                        columnDesc={view.split("-")?.[3] || "summary"}
                    />
                )}
            </div>
            <SummaryGraphic
                openModal={showDialogGraphic}
                setOpenModal={setShowDialogGraphic}
                setView={setView}
                columns={columnsDynamic}
                getCollection={onSearch}
            />
        </>
    )

}

export default PersonalizedReport;