/* eslint-disable react-hooks/exhaustive-deps */
import React, { FC, useEffect, useState } from 'react'; // we need this to make JSX compile
import { useSelector } from 'hooks';
import { useDispatch } from 'react-redux';
import Button from '@material-ui/core/Button';
import { TemplateIcons, DateRangePicker } from 'components';
import { getRecordHSMList, getRecordHSMReport } from 'common/helpers';
import { Dictionary } from "@types";
import TableZyx from '../components/fields/table-simple';
import { makeStyles } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';
import { langKeys } from 'lang/keys';
import { getCollection, getCollectionAux, resetAllMain } from 'store/main/actions';
import { showBackdrop } from 'store/popus/actions';
import { CalendarIcon } from 'icons';
import { Range } from 'react-date-range';
import ClearIcon from '@material-ui/icons/Clear';
import {
    Search as SearchIcon,
} from '@material-ui/icons';

interface RowSelected {
    row: Dictionary | null,
    edit: boolean
}
interface DetailRecordHSMRecordProps {
    data: RowSelected;
    setViewSelected: (view: string) => void;
}

const format = (date: Date) => date.toISOString().split('T')[0];

const initialRange = {
    startDate: new Date(new Date().setDate(0)),
    endDate: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0),
    key: 'selection'
}
const useStyles = makeStyles((theme) => ({
    containerDetail: {
        marginTop: theme.spacing(2),
        padding: theme.spacing(2),
        background: '#fff',
    },
    button: {
        padding: 12,
        fontWeight: 500,
        fontSize: '14px',
        textTransform: 'initial'
    },
    itemDate: {
        minHeight: 40,
        height: 40,
        border: '1px solid #bfbfc0',
        borderRadius: 4,
        color: 'rgb(143, 146, 161)'
    },
}));

const DetailRecordHSMRecord: React.FC<DetailRecordHSMRecordProps> = ({ data: { row }, setViewSelected }) => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const mainResult = useSelector(state => state.main);

    function search(){
        dispatch(showBackdrop(true))
        dispatch(getCollectionAux(getRecordHSMReport({
            campaignname: row?.campaignname||"",
            date: row?.date||""
        })))
    }
    useEffect(() => {
        if (!mainResult.mainAux.loading){
            dispatch(showBackdrop(false))
        }
    }, [mainResult])

    useEffect(() => {
        search()
    }, [])

    const columns = React.useMemo(
        () => [
            {
                accessor: 'inputvalidationid',
                NoFilter: true,
                isComponent: true,
                hidden: true
            },
            {
                Header: t(langKeys.firstname),
                accessor: 'firstname',
                NoFilter: true
            },
            {
                Header: t(langKeys.lastname),
                accessor: 'lastname',
                NoFilter: true
            },
            {
                Header: t(langKeys.contact),
                accessor: 'contact',
                NoFilter: true
            },
            {
                Header: t(langKeys.status),
                accessor: 'status',
                NoFilter: true
            },
            {
                Header: t(langKeys.failed),
                accessor: 'failed',
                NoFilter: true
            },
            {
                Header: `${t(langKeys.channel)}`,
                accessor: 'channel',
                NoFilter: true
            },
            {
                Header: `${t(langKeys.origin)}`,
                accessor: 'origin',
                NoFilter: true
            },
            {
                Header: `N° ${t(langKeys.transaction)}`,
                accessor: 'transactionid',
                NoFilter: true
            },
            {
                Header: t(langKeys.group),
                accessor: 'usergroup',
                NoFilter: true
            },
            {
                Header: t(langKeys.success),
                accessor: 'success',
                NoFilter: true
            },
            {
                Header: t(langKeys.log),
                accessor: 'log',
                NoFilter: true
            },
            {
                Header: t(langKeys.body),
                accessor: 'body',
                NoFilter: true
            },
            {
                Header: t(langKeys.parameters),
                accessor: 'parameters',
                NoFilter: true
            },
            
        ],
        [t]
    );

    return (
        <div style={{width: '100%'}}>
            <div className={classes.containerDetail}>
                <TableZyx
                    titlemodule={row?.campaigname||`${t(langKeys.recordhsmreport)} ${t(langKeys.detail)}`}
                    ButtonsElement={() => (
                        <Button
                            variant="contained"
                            type="button"
                            color="primary"
                            startIcon={<ClearIcon color="secondary" />}
                            style={{ backgroundColor: "#FB5F5F" }}
                            onClick={() => setViewSelected("view-1")}
                        >{t(langKeys.back)}</Button>
                    )}
                    columns={columns}
                    data={mainResult.mainAux.data}
                    download={true}
                    loading={mainResult.mainAux.loading}
                    register={false}
                    filterGeneral={false}
                // fetchData={fetchData}
                />
            </div>
        </div>
    );
}

const RecordHSMRecord: FC = () => {
    // const history = useHistory();
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const mainResult = useSelector(state => state.main);
    
    const classes = useStyles()
    const [openDateRangeCreateDateModal, setOpenDateRangeCreateDateModal] = useState(false);
    const [dateRangeCreateDate, setDateRangeCreateDate] = useState<Range>(initialRange);
    const [viewSelected, setViewSelected] = useState("view-1");
    const [rowSelected, setRowSelected] = useState<RowSelected>({ row: null, edit: false });

    const columns = React.useMemo(
        () => [
            {
                accessor: 'inputvalidationid',
                NoFilter: true,
                isComponent: true,
                Cell: (props: any) => {
                    const row = props.cell.row.original;
                    return (
                        <TemplateIcons
                            editFunction={() => handleView(row)}
                        />
                    )
                }
            },
            {
                Header: t(langKeys.campaign),
                accessor: 'campaign',
                NoFilter: true
            },
            {
                Header: t(langKeys.date),
                accessor: 'date',
                NoFilter: true
            },
            {
                Header: t(langKeys.total),
                accessor: 'total',
                NoFilter: true
            },
            {
                Header: t(langKeys.success),
                accessor: 'success',
                NoFilter: true
            },
            {
                Header: t(langKeys.failed),
                accessor: 'failed',
                NoFilter: true
            },
            {
                Header: `% ${t(langKeys.success)}`,
                accessor: 'successp',
                NoFilter: true
            },
            {
                Header: `% ${t(langKeys.failed)}`,
                accessor: 'failedp',
                NoFilter: true
            },
            
        ],
        [t]
    );
    
    
    function search(){
        dispatch(showBackdrop(true))
        dispatch(getCollection(getRecordHSMList(
            {
                startdate: dateRangeCreateDate.startDate,
                enddate: dateRangeCreateDate.endDate
            }
        )))
    }
    useEffect(() => {
        search()
        return () => {
            dispatch(resetAllMain());
        };
    }, [])
    useEffect(() => {
        if (!mainResult.mainData.loading){
            dispatch(showBackdrop(false))
        }
    }, [mainResult])

    const handleView = (row: Dictionary) => {
        setViewSelected("view-2");
        setRowSelected({ row, edit: false });
    }

    if (viewSelected === "view-1") {

        return (
            <TableZyx
                columns={columns}
                titlemodule={t(langKeys.recordhsmreport, { count: 2 })}
                data={mainResult.mainData.data}
                ButtonsElement={() => (
                    <div style={{display: 'flex', gap: 8, flexWrap: 'wrap'}}>
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
                        <Button
                            disabled={mainResult.mainData.loading}
                            variant="contained"
                            color="primary"
                            startIcon={<SearchIcon style={{ color: 'white' }} />}
                            style={{ width: 120, backgroundColor: "#55BD84" }}
                            onClick={() => search()}
                        >{t(langKeys.search)}
                        </Button>
                    </div>
                )}
                download={true}
                filterGeneral={false}
                loading={mainResult.mainData.loading}
                register={false}
            // fetchData={fetchData}
            />
        )
    }
    else if (viewSelected === "view-2") {
        return (
            <DetailRecordHSMRecord
                data={rowSelected}
                setViewSelected={setViewSelected}
            />
        )
    } 
    else
        return null;

}

export default RecordHSMRecord;