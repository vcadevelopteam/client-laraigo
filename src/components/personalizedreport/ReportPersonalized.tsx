/* eslint-disable react-hooks/exhaustive-deps */
import React, { FC, useEffect, useState } from 'react'; // we need this to make JSX compile
import { useSelector } from 'hooks';
import { useDispatch } from 'react-redux';
import { TemplateBreadcrumbs, DateRangePicker, FieldMultiSelect, FieldSelect } from 'components';
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


const getArrayBread = (nametmp: string) => ([
    { id: "view-1", name: "Reports" },
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
        padding: theme.spacing(2),
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

interface MultiData {
    data: Dictionary[];
    success: boolean;
}

interface DetailReportProps {
    item: Dictionary;
    setViewSelected: (view: string) => void;
    multiData: MultiData[];
}

const initialRange = {
    startDate: new Date(new Date().setDate(0)),
    endDate: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0),
    key: 'selection'
}

const format = (date: Date) => date.toISOString().split('T')[0];

const PersonalizedReport: FC<DetailReportProps> = ({ setViewSelected, multiData, item: { columns, finishdate,
    startdate, channels, tags, usergroup, description } }) => {
    const classes = useStyles()
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const [columnsDynamic, setcolumnsDynamic] = useState([])
    const [openDateRangeCreateDateModal, setOpenDateRangeCreateDateModal] = useState(false);
    const [openDateRangeFinishDateModal, setOpenDateRangeFinishDateModal] = useState(false);
    const [dateRangeCreateDate, setDateRangeCreateDate] = useState<Range>(initialRange);
    const [dateRangeFinishDate, setDateRangeFinishDate] = useState<Range>(initialRange);
    const [filters, setFilters] = useState({
        usergroup: "",
        communicationchannelid: "",
        tag: ""
    })

    useEffect(() => {
        dispatch(resetMainDynamic())
        dispatch(resetExportMainDynamic())
        setcolumnsDynamic(columns.map((x: Dictionary) => ({
            Header: x.value,
            accessor: x.key,
        })))
    }, [])

    const mainDynamic = useSelector(state => state.main.mainDynamic);
    const resExportDynamic = useSelector(state => state.main.exportDynamicData);

    const dataGroups = multiData[1] && multiData[1].success ? multiData[1].data : [];
    const dataTags = multiData[2] && multiData[2].success ? multiData[2].data : [];
    const dataChannels = multiData[3] && multiData[3].success ? multiData[3].data : [];

    useEffect(() => {
        if (!resExportDynamic.loading && !resExportDynamic.error && resExportDynamic.url) {
            window.open(resExportDynamic.url, '_blank');
        } else if (resExportDynamic.error) {
            const errormessage = t(resExportDynamic.code || "error_unexpected_error")
            dispatch(showSnackbar({ show: true, success: false, message: errormessage }))
        }
    }, [resExportDynamic])

    const onSearch = (isExport: Boolean = false) => {
        const body = {
            columns,
            parameters: {
                offset: (new Date().getTimezoneOffset() / 60) * -1,
            },
            filters: [
                ...(startdate ? [{
                    column: "startdate",
                    start: getDateCleaned(dateRangeCreateDate.startDate!!),
                    end: getDateCleaned(dateRangeCreateDate.endDate!!)
                }] : []),
                ...(finishdate ? [{
                    column: "finishdate",
                    start: getDateCleaned(dateRangeFinishDate.startDate!!),
                    end: getDateCleaned(dateRangeFinishDate.endDate!!)
                }] : []),
                ...(usergroup ? [{
                    column: "usergroup",
                    value: filters.usergroup
                }] : []),
                ...(tags ? [{
                    column: "tag",
                    value: filters.tag
                }] : []),
                ...(channels ? [{
                    column: "communicationchannelid",
                    value: filters.communicationchannelid
                }] : []),
            ]
        }
        if (isExport)
            dispatch(exportDynamic(body, description));
        else
            dispatch(getCollectionDynamic(body));
    }

    return (
        <div style={{ width: '100%' }}>
            <TemplateBreadcrumbs
                breadcrumbs={getArrayBread(description)}
                handleClick={setViewSelected}
            />
            <div className={classes.containerFilters}>
                <div className={classes.itemFlex}>
                    {startdate &&
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
                                {format(dateRangeCreateDate.startDate!) + " - " + format(dateRangeCreateDate.endDate!)}
                            </Button>
                        </DateRangePicker>
                    }
                    {finishdate &&
                        <DateRangePicker
                            open={openDateRangeFinishDateModal}
                            setOpen={setOpenDateRangeFinishDateModal}
                            range={dateRangeFinishDate}
                            onSelect={setDateRangeFinishDate}
                        >
                            <Button
                                disabled={mainDynamic.loading}
                                className={classes.itemDate}
                                startIcon={<CalendarIcon />}
                                onClick={() => setOpenDateRangeFinishDateModal(!openDateRangeFinishDateModal)}
                            >
                                {format(dateRangeFinishDate.startDate!) + " - " + format(dateRangeFinishDate.endDate!)}
                            </Button>
                        </DateRangePicker>
                    }
                    {tags &&
                        <FieldSelect
                            label={t(langKeys.tag)}
                            className={classes.itemFilter}
                            onChange={(value) => setFilters(p => ({ ...p, tag: value.tag }))}
                            data={dataTags}
                            optionDesc="tag"
                            variant="outlined"
                            optionValue="tag"
                        />
                    }
                    {channels &&
                        <FieldMultiSelect
                            label={t(langKeys.channel_plural)}
                            className={classes.itemFilter}
                            variant="outlined"
                            onChange={(value) => setFilters(p => ({ ...p, communicationchannelid: value.map((o: Dictionary) => o.communicationchannelid).join() }))}
                            data={dataChannels}
                            optionDesc="communicationchanneldesc"
                            optionValue="communicationchannelid"
                        />
                    }
                    {usergroup &&
                        <FieldMultiSelect
                            label={t(langKeys.group_plural)}
                            className={classes.itemFilter}
                            variant="outlined"
                            onChange={(value) => setFilters(p => ({ ...p, usergroup: value.map((o: Dictionary) => o.domainvalue).join() }))}
                            data={dataGroups}
                            optionDesc="domaindesc"
                            optionValue="domainvalue"
                        />
                    }
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
                        // onClick={() => exportExcel(String(titlemodule) + "Report", data, columns.filter((x: any) => (!x.isComponent && !x.activeOnHover)))}
                        startIcon={<DownloadIcon />}
                    >{t(langKeys.download)}
                    </Button>
                </div>
            </div>
            <TableZyx
                columns={columnsDynamic}
                filterGeneral={false}
                data={mainDynamic.data}
                download={false}
                loading={mainDynamic.loading}
            // fetchData={fetchData}
            />
        </div >
    )

}

export default PersonalizedReport;