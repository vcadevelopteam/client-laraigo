import React, { useEffect, useState } from 'react';
import { useSelector } from 'hooks';
import { useDispatch } from 'react-redux';
import { convertLocalDate, dictToArrayKV, getCampaignReportExport, getCampaignReportPaginated, getCampaignReportProactiveExport, getCommChannelLst, getDateCleaned, getHSMShipping } from 'common/helpers';
import { Dictionary, IFetchData } from "@types";
import { exportData, getCollectionAux, getCollectionAux2, getCollectionPaginated, resetCollectionPaginated, resetMainAux } from 'store/main/actions';
import { showBackdrop, showSnackbar } from 'store/popus/actions';
import { TemplateBreadcrumbs, TitleDetail, DialogZyx, FieldSelect, DateRangePicker } from 'components';
import { makeStyles } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';
import { langKeys } from 'lang/keys';
import { DownloadIcon } from 'icons';
import { Button } from '@material-ui/core';
import TablePaginated from 'components/fields/table-paginated';
import TableZyx from 'components/fields/table-simple';
import { Range } from 'react-date-range';
import { CalendarIcon } from 'icons';
import { Search as SearchIcon } from '@material-ui/icons';
import { CellProps } from 'react-table';
import { FieldErrors } from "react-hook-form";

interface DetailProps {
    setViewSelected?: (view: string) => void;
    externalUse?: boolean;
    setValue: Dictionary
    getValues: Dictionary,
    errors: FieldErrors
}

const arrayBread = [
    { id: "view-1", name: "Campaign" },
    { id: "view-2", name: "Campaign report" }
];

const useStyles = makeStyles(() => ({
    select: {
        width: '200px'
    },
    itemDate: {
        minHeight: 40,
        height: 40,
        border: '1px solid #bfbfc0',
        borderRadius: 4,
        color: 'rgb(143, 146, 161)',
        alignItems: 'left'
    },
    button: {
        padding: 12,
        fontWeight: 500,
        fontSize: '14px',
        textTransform: 'initial'
    },
    filterComponent: {
        width: '180px'
    },
}));

const dataReportType = {
    default: 'default',
    proactive: 'proactive'
}

const initialRange = {
    startDate: new Date(new Date().setDate(1)),
    endDate: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0),
    key: 'selection'
}

export const ReportHSMShipping: React.FC<DetailProps> = ({ setViewSelected, externalUse }) => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const mainAux = useSelector(state => state.main.mainAux2);
    const resExportData = useSelector(state => state.main.exportData);
    const [waitExport, setWaitExport] = useState(false);

    const [openModal, setOpenModal] = useState(false);
    const [selectedRow, setSelectedRow] = useState<Dictionary | undefined>({});

    const [reportType, setReportType] = useState<string>('default');

    const [openDateRangeCreateDateModal, setOpenDateRangeCreateDateModal] = useState(false);
    const [dateRangeCreateDate, setDateRangeCreateDate] = useState<Range>(initialRange);

    const filterChannel = useSelector((state) => state.main.mainAux)

    const cell = (props: CellProps<Dictionary>) => {
        const column = props.cell.column;
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
                    })
                    : row[column.id]}
            </div>
        )
    }

    const columns = React.useMemo(
        () => [
            {
                Header: t(langKeys.templatename),
                accessor: 'templatename',
                showGroupedBy: true,
                Cell: cell
            },
            {
                Header: t(langKeys.templatecategory),
                accessor: 'category',
                showGroupedBy: true,
                Cell: cell
            },
            {
                Header: t(langKeys.sent_plural),
                accessor: 'total',
                type: 'number',
                sortType: 'number',
                showGroupedBy: true, 
                Cell: cell
            },
            {
                Header: t(langKeys.successful_plural),
                accessor: 'satisfactory',
                type: 'number',
                sortType: 'number',
                showGroupedBy: true, 
                Cell: cell
            },
            {
                Header: t(langKeys.failed_plural),
                accessor: 'failed',
                type: 'number',
                sortType: 'number',
                showGroupedBy: true, 
                Cell: cell
            },
            {
                Header: t(langKeys.read),
                accessor: 'seen',
                type: 'number',
                sortType: 'number',
                showGroupedBy: true, 
                Cell: cell
            },
            {
                Header: t(langKeys.contested),
                type: 'number',
                sortType: 'number',
                showGroupedBy: true, 
                accessor: 'answered',
                Cell: cell
            },
        ],
        []
    );

    React.useEffect(() => {
        console.log(filterChannel)
    }, [filterChannel]);

    const fetchData = () => {
        dispatch(showBackdrop(true))
        dispatch(getCollectionAux2(getHSMShipping(
            {
                startdate: dateRangeCreateDate.startDate,
                enddate: dateRangeCreateDate.endDate,
                communicationchannelid: selectedChannel || 0,
            }
        )));
    };

    useEffect(() => {
        dispatch(resetCollectionPaginated());
        fetchData();
        fetchFiltersChannels();
        return () => {
            dispatch(resetCollectionPaginated());
        };
    }, []);

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
        if (!mainAux.loading && !mainAux.error) {
            dispatch(showBackdrop(false));
        }
    }, [mainAux]);  

    //channel Filter ----------------------------------------------------------------------------------
    const channelTypeList = filterChannel.data || [];
    const channelTypeFilteredList = new Set();
    const [selectedChannel, setSelectedChannel] = useState(0);
    const fetchFiltersChannels = () => dispatch(getCollectionAux(getCommChannelLst()))

    return (
        <div style={{ width: '100%' }}>
            {!externalUse && <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div>
                    <TemplateBreadcrumbs
                        breadcrumbs={arrayBread}
                        handleClick={setViewSelected}
                    />
                    <TitleDetail
                        title={t(langKeys.report)}
                    />
                </div>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <Button
                        variant="contained"
                        type="button"
                        color="primary"
                        style={{ backgroundColor: "#FB5F5F" }}
                        onClick={() => setViewSelected && setViewSelected("view-1")}
                    >{t(langKeys.back)}</Button>
                </div>
            </div>}
            {externalUse && <div style={{ height: 10 }}></div>}



            <div style={{ position: 'relative', height: '100%' }}>

                <div style={{ width: 'calc(100% - 60px)', display: 'flex', background: 'white', padding: '1rem 0 0 1rem', position: 'absolute', top: 0, right: 50 }}>

                    <div style={{ textAlign: 'left', display: 'flex', gap: '0.5rem', marginRight: 'auto' }}>
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
                            label={t(langKeys.channel)}
                            variant="outlined"
                            className={classes.filterComponent}
                            data={filterChannel.data.filter(x => x.type.includes("WHA")) || []}
                            valueDefault={selectedChannel}
                            onChange={(value) => setSelectedChannel(value?.type || 0)}
                            optionDesc="communicationchanneldesc"
                            optionValue="communicationchannelid"
                        />

                        <Button
                            disabled={mainAux.loading}
                            variant="contained"
                            color="primary"
                            startIcon={<SearchIcon style={{ color: 'white' }} />}
                            style={{ width: 120, backgroundColor: "#55BD84" }}
                            onClick={() => fetchData()}
                        >
                            {t(langKeys.search)}
                        </Button>

                    </div>
                </div>

                <TableZyx
                    columns={columns}
                    data={mainAux.data}
                    groupedBy={true}
                    loading={mainAux.loading}
                    showHideColumns={true}
                    download={true}
                />
            </div>

            {openModal && <ModalReport
                openModal={openModal}
                setOpenModal={setOpenModal}
                row={selectedRow}
            />}
        </div>
    )
}

interface ModalProps {
    openModal: boolean;
    setOpenModal: (value: boolean) => any;
    row: any;
}

const ModalReport: React.FC<ModalProps> = ({ openModal, setOpenModal, row }) => {
    const dispatch = useDispatch();
    const { t } = useTranslation();

    const mainAux = useSelector(state => state.main.mainAux);
    const [waitView, setWaitView] = useState(false);

    const columns = React.useMemo(
        () => [
            {
                Header: t(langKeys.contact),
                accessor: 'contact',
            },
            {
                Header: t(langKeys.status),
                accessor: 'status',
            },
            {
                Header: t(langKeys.log),
                accessor: 'log',
            }
        ],
        []
    );

    const handleCancelModal = () => {
        setOpenModal(false);
    }

    useEffect(() => {
        if (row !== null) {
            dispatch(getCollectionAux(getCampaignReportExport(
                [{
                    campaignid: row.id.split('_')[0],
                    rundate: row.id.split('_')[1],
                }]
            )))
            setWaitView(true);
            return () => {
                dispatch(resetMainAux());
            };
        }
    }, []);

    useEffect(() => {
        if (waitView) {
            if (!mainAux.loading && !mainAux.error) {
                setWaitView(false);
            }
        }
    }, [mainAux, waitView]);

    return (
        <DialogZyx
            maxWidth="md"
            open={openModal}
            title={`${row.title} ${convertLocalDate(row.rundate).toLocaleString()}`}
            button1Type="button"
            buttonText1={t(langKeys.close)}
            handleClickButton1={handleCancelModal}
        >
            <div className="row-zyx">
                <TableZyx
                    columns={columns}
                    data={mainAux.data}
                    loading={mainAux.loading}
                    filterGeneral={false}
                    download={false}
                />
            </div>
        </DialogZyx>
    )
}   