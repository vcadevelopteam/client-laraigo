/* eslint-disable react-hooks/exhaustive-deps */
import React, { FC, useEffect, useState } from 'react'; // we need this to make JSX compile
import { useSelector } from 'hooks';
import { useDispatch } from 'react-redux';
import { TemplateBreadcrumbs, DateRangePicker, FieldEdit } from 'components';
import { Dictionary } from "@types";
import TableZyx from 'components/fields/table-simple';
import { makeStyles } from '@material-ui/core/styles';
import SearchIcon from '@material-ui/icons/Search';
import Button from '@material-ui/core/Button';
import { useTranslation } from 'react-i18next';
import { langKeys } from 'lang/keys';
import { CalendarIcon, DownloadIcon } from 'icons';
import { showSnackbar } from 'store/popus/actions';
import { getCollectionDynamic, resetMainDynamic, exportDynamic, resetExportMainDynamic } from 'store/main/actions';
import { Range } from 'react-date-range';
import { getDateCleaned } from 'common/helpers/functions'


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

export interface IReport {
    columns: Dictionary[];
    filters: Dictionary[];
    summaries: Dictionary[];
    description: string;
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

const format = (date: Date) => date.toISOString().split('T')[0];

const FilterDynamic: FC<{ filter: Dictionary, setFiltersDynamic: (param: any) => void }> = ({ filter, setFiltersDynamic }) => {
    const [openDialogDate, setOpenDialogDate] = useState(false);
    const [dateRange, setDateRange] = useState<Range>(initialRange);
    const classes = useStyles();
    const { t } = useTranslation();

    useEffect(() => {
        setFiltersDynamic((prev: any) => ({
            ...prev,
            [filter.columnname]: {
                ...prev[filter.columnname],
                start: getDateCleaned(dateRange.startDate!!),
                end: getDateCleaned(dateRange.endDate!!)
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
                size="small"
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

const PersonalizedReport: FC<DetailReportProps> = ({ setViewSelected, item: { columns, summaries, filters, description } }) => {
    const classes = useStyles()
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const [dataCleaned, setDataCleaned] = useState<Dictionary[]>([])

    const [filtersDynamic, setFiltersDynamic] = useState<Dictionary>(filters.reduce((acc: Dictionary, item: Dictionary) => ({
        ...acc,
        [item.columnname]: item
    }), {}));

    const columnsDynamic = React.useMemo(
        () => columns.map((x: Dictionary) => ({
            Header: x.alias,
            accessor: x.columnname.replace(".", ""),
        })), [columns]
    )

    useEffect(() => {
        dispatch(resetMainDynamic())
        dispatch(resetExportMainDynamic())
    }, [])

    const mainDynamic = useSelector(state => state.main.mainDynamic);
    const resExportDynamic = useSelector(state => state.main.exportDynamicData);

    useEffect(() => {
        if (!resExportDynamic.loading && !resExportDynamic.error && resExportDynamic.url) {
            window.open(resExportDynamic.url, '_blank');
        } else if (resExportDynamic.error) {
            const errormessage = t(resExportDynamic.code || "error_unexpected_error")
            dispatch(showSnackbar({ show: true, success: false, message: errormessage }))
        }
    }, [resExportDynamic]);

    useEffect(() => {
        if (!mainDynamic.loading && !mainDynamic.error) {
            const columnsDate = columns.filter(x => ["timestamp without time zone", "date"].includes(x.type));
            if (columnsDate.length > 0) {
                setDataCleaned(mainDynamic.data.map(x => {
                    columnsDate.forEach(y => {
                        const columnclean = y.columnname.replace(".", "");
                        if (!!x[columnclean]) {
                            const date = new Date(x[columnclean]);
                            if (!isNaN(date.getTime())) {
                                if (y.type === "timestamp without time zone")
                                    x[columnclean] = date.toLocaleString();
                                else
                                    x[columnclean] = date.toLocaleDateString();
                            } else {
                                const regex = /[0-9]{4}-[0-9]{2}-[0-9]{2}\s[0-9]{2}:[0-9]{2}:[0-9]{2}.[0-9]{0,6}Z/gi
                                const resRegex = (x[columnclean] + "").matchAll(regex);
                                Array.from(resRegex).forEach(z => {
                                    console.log(z)
                                    if (z) {
                                        if (y.type === "timestamp without time zone")
                                            x[columnclean] = x[columnclean].replace(z, new Date(z[0]).toLocaleString());
                                        else
                                            x[columnclean] = x[columnclean].replace(z, new Date(z[0]).toLocaleDateString());
                                    }
                                })
                            }
                        }
                    })
                    return x;
                }));
            } else {
                setDataCleaned(mainDynamic.data);
            }
        }
    }, [mainDynamic])

    const onSearch = (isExport: Boolean = false) => {
        const body = {
            columns,
            parameters: {
                offset: (new Date().getTimezoneOffset() / 60) * -1,
            },
            summaries,
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
        <div style={{ width: '100%' }}>
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
                <div>
                    <Button
                        variant="contained"
                        color="primary"
                        disabled={resExportDynamic.loading}
                        onClick={() => onSearch(true)}
                        startIcon={<DownloadIcon />}
                    >{t(langKeys.download)}
                    </Button>
                </div>
            </div>
            <TableZyx
                columns={columnsDynamic}
                filterGeneral={false}
                data={dataCleaned}
                download={false}
                loading={mainDynamic.loading}
            />
        </div >
    )

}

export default PersonalizedReport;