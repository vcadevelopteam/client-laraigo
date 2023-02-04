/* eslint-disable react-hooks/exhaustive-deps */
import React, { FC, useEffect, useState } from 'react'; // we need this to make JSX compile
import { useSelector } from 'hooks';
import { useDispatch } from 'react-redux';
import Button from '@material-ui/core/Button';
import { DateRangePicker, DialogZyx, FieldSelect } from 'components';
import { getDateCleaned, getRecordHSMGraphic, getRecordHSMList, getRecordHSMReport } from 'common/helpers';
import { Dictionary } from "@types";
import TableZyx from '../components/fields/table-simple';
import { makeStyles } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';
import { langKeys } from 'lang/keys';
import { cleanViewChange, getMainGraphic, getMultiCollection, getMultiCollectionAux2, resetMultiMain, setViewChange } from 'store/main/actions';
import { showBackdrop } from 'store/popus/actions';
import { CalendarIcon } from 'icons';
import { Range } from 'react-date-range';
import ClearIcon from '@material-ui/icons/Clear';
import {
    Search as SearchIcon,
} from '@material-ui/icons';
import { useForm } from 'react-hook-form';
import Graphic from 'components/fields/Graphic';
import AssessmentIcon from '@material-ui/icons/Assessment';

interface RowSelected {
    row: Dictionary | null,
    edit: boolean
}
interface DetailRecordHSMRecordProps {
    data: RowSelected;
    setViewSelected: (view: string) => void;
}

const initialRange = {
    startDate: new Date(new Date().setDate(1)),
    endDate: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0),
    key: 'selection'
}
const useStyles = makeStyles((theme) => ({
    containerHeader: {
        padding: theme.spacing(1),
    },
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

const columnsTemp = [
    'name',
    'shippingdate',
    'from',
    'total',
    'satisfactory',
    'failed',
    'satisfactoryp',
    'failedp'
]

const DetailRecordHSMRecord: React.FC<DetailRecordHSMRecordProps> = ({ data: { row }, setViewSelected }) => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const multiDataAux2 = useSelector(state => state.main.multiDataAux2);

    function search(){
        dispatch(showBackdrop(true))
        dispatch(getMultiCollectionAux2([
            getRecordHSMReport({
                name: row?.name || "",
                from: row?.from || "",
                date: row?.shippingdate || "",
                type: row?.type || "",
            })
        ]))
    }
    useEffect(() => {
        if (!multiDataAux2.loading){
            dispatch(showBackdrop(false))
        }
    }, [multiDataAux2])

    useEffect(() => {
        search()
    }, [])

    const columns = React.useMemo(
        () => [
            {
                Header: t(langKeys.recipientsname),
                accessor: 'clientname',
                NoFilter: true
            },
            {
                Header: t(langKeys.contact),
                accessor: 'contact',
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
                Header: t(langKeys.group),
                accessor: 'group',
                NoFilter: true
            },
            {
                Header: t(langKeys.status),
                accessor: 'status',
                NoFilter: true,
                prefixTranslation: 'status_',
                Cell: (props: any) => {
                    const { status } = props.cell.row.original;
                    return (t(`status_${status}`.toLowerCase()) || "").toUpperCase()
                }
            },
            {
                Header: t(langKeys.communicationtemplate),
                accessor: 'templatename',
                NoFilter: true
            },
            {
                Header: t(langKeys.body),
                accessor: 'body',
                NoFilter: true
            },
            {
                Header: t(langKeys.log),
                accessor: 'log',
                NoFilter: true
            },
        ],
        [t]
    );

    return (
        <div style={{width: '100%'}}>
            <div className={classes.containerDetail}>
                <TableZyx
                    titlemodule={`${row?.name_translated} (${row?.shippingdate})` || `${t(langKeys.recordhsmreport)} ${t(langKeys.detail)}`}
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
                    data={multiDataAux2.data[0]?.data||[]}
                    download={true}
                    loading={multiDataAux2.loading}
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
    const multiData = useSelector(state => state.main.multiData);
    
    // const multiDataAux = useSelector(state => state.main.multiDataAux);
    const classes = useStyles()
    const [openDateRangeCreateDateModal, setOpenDateRangeCreateDateModal] = useState(false);
    const [dateRangeCreateDate, setDateRangeCreateDate] = useState<Range>(initialRange);
    // const [shippingTypesData, setshippingTypesData] = useState<any>([]);
    const [viewSelected, setViewSelected] = useState("view-1");
    // const [shippingtype, setshippingtype] = useState("");
    const [rowSelected, setRowSelected] = useState<RowSelected>({ row: null, edit: false });
    const [gridData, setGridData] = useState<any[]>([]);
    const [openModal, setOpenModal] = useState(false);
    const [view, setView] = useState('GRID');
    
    useEffect(() => {
        dispatch(setViewChange("recordhsmreport"))
        return () => {
            dispatch(cleanViewChange());
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    
    const columns = React.useMemo(
        () => [
            {
                Header: t(langKeys.shippingreason),
                accessor: 'name_translated',
            },
            {
                Header: t(langKeys.shippingdate),
                accessor: 'shippingdate',
                NoFilter: true
            },
            {
                Header: t(langKeys.shippingfrom),
                accessor: 'from',
                NoFilter: true,
            },
            {
                Header: t(langKeys.total),
                accessor: 'total',
                NoFilter: true,
                type: 'number',
                sortType: 'number',
            },
            {
                Header: t(langKeys.satisfactory),
                accessor: 'satisfactory',
                NoFilter: true,
                type: 'number',
                sortType: 'number',
            },
            {
                Header: t(langKeys.failed),
                accessor: 'failed',
                NoFilter: true,
                type: 'number',
                sortType: 'number',
            },
            {
                Header: `% ${t(langKeys.satisfactory)}`,
                accessor: 'satisfactoryp',
                NoFilter: true,
                type: 'number',
                sortType: 'number',
                Cell: (props: any) => {
                    const { satisfactoryp } = props.cell.row.original;
                    return `${parseInt(satisfactoryp)} %`;
                }
            },
            {
                Header: `% ${t(langKeys.failed)}`,
                accessor: 'failedp',
                NoFilter: true,
                type: 'number',
                sortType: 'number',
                Cell: (props: any) => {
                    const { failedp } = props.cell.row.original;
                    return `${parseInt(failedp)} %`;
                }
            },
            
        ],
        [t]
    );
    
    
    function search(){
        dispatch(showBackdrop(true))
        dispatch(getMultiCollection([
            getRecordHSMList(
                {
                    startdate: dateRangeCreateDate.startDate,
                    enddate: dateRangeCreateDate.endDate,
                    type: '' //shippingtype
                }
            )
        ]))
    }
    useEffect(() => {
        // dispatch(getMultiCollectionAux([getValuesFromDomain("SHIPPINGTYPES")]));
        // search();
        return () => {
            dispatch(resetMultiMain());
            // dispatch(resetMultiMainAux());
        }
    }, [])
    useEffect(() => {
        if (!multiData.loading){
            setGridData(multiData.data[0]?.data.map(x => ({
                ...x,
                name_translated: x.name !== x.translationname?(t(`report_sentmessages_${x.name}`.toLowerCase()) || "").toUpperCase():x.name?.toUpperCase(),
            }))||[]);
            dispatch(showBackdrop(false));
        }
    }, [multiData])
    // useEffect(() => {
    //     if (!multiDataAux.loading){
    //         setshippingTypesData(multiDataAux.data[0]?.data||[])
    //     }
    // }, [multiDataAux])

    const handleView = (row: Dictionary) => {
        setViewSelected("view-2");
        setRowSelected({ row, edit: false });
    }

    const handlerSearchGraphic = (daterange: any, column: string) => {
        dispatch(getMainGraphic(getRecordHSMGraphic(
            {
                startdate: daterange?.startDate!,
                enddate: daterange?.endDate!,
                column,
                summarization: 'COUNT'
            }
        )));
    }

    if (viewSelected === "view-1") {

        return (
            <React.Fragment>
                <div style={{ height: 10 }}></div>
                {view === "GRID" ? (
                    <TableZyx
                        onClickRow={handleView}    
                        columns={columns}
                        data={gridData}
                        ButtonsElement={() => (
                            <div className={classes.containerHeader} style={{display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'space-between'}}>
                                <div style={{display: 'flex', gap: 8}}>
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
                                    {/* <FieldSelect
                                        onChange={(value) => setshippingtype(value?.domainvalue||"")}
                                        label={t(langKeys.shippingtype)}
                                        loading={multiDataAux.loading}
                                        variant="outlined"
                                        valueDefault={shippingtype}
                                        style={{width: "170px"}}
                                        data={shippingTypesData}
                                        optionValue="domainvalue"
                                        optionDesc="domainvalue"
                                        uset={true}
                                        prefixTranslation='type_shippingtype_'
                                    /> */}
                                    <div>
                                        <Button
                                            disabled={multiData.loading}
                                            variant="contained"
                                            color="primary"
                                            startIcon={<SearchIcon style={{ color: 'white' }} />}
                                            style={{ width: 120, backgroundColor: "#55BD84" }}
                                            onClick={() => search()}
                                        >{t(langKeys.search)}
                                        </Button>
                                    </div>
                                </div>
                                <Button
                                    className={classes.button}
                                    variant="contained"
                                    color="primary"
                                    disabled={multiData.loading || !(multiData.data.length > 0)}
                                    onClick={() => setOpenModal(true)}
                                    startIcon={<AssessmentIcon />}
                                >
                                    {t(langKeys.graphic_view)}
                                </Button>
                            </div>
                        )}
                        download={true}
                        filterGeneral={false}
                        loading={multiData.loading}
                        register={false}
                    // fetchData={fetchData}
                    />
                ) : (
                    <Graphic
                        graphicType={view.split("-")?.[1] || "BAR"}
                        column={view.split("-")?.[2] || "summary"}
                        openModal={openModal}
                        setOpenModal={setOpenModal}
                        daterange={{
                            startDate: dateRangeCreateDate.startDate?.toISOString().substring(0,10),
                            endDate: dateRangeCreateDate.endDate?.toISOString().substring(0,10),
                        }}
                        setView={setView}
                        row={{origin: 'sentmessages'}}
                        handlerSearchGraphic={handlerSearchGraphic}
                    />
                )}
                <SummaryGraphic
                    openModal={openModal}
                    setOpenModal={setOpenModal}
                    setView={setView}
                    daterange={dateRangeCreateDate}
                    columns={columnsTemp.map(c => ({
                        key: c, value: `report_sentmessages_${c}`
                    }))}
                    columnsprefix='report_sentmessages_'
                />
            </React.Fragment>
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

interface SummaryGraphicProps {
    openModal: boolean;
    setOpenModal: (value: boolean) => void;
    setView: (value: string) => void;
    row?: Dictionary | null;
    daterange: any;
    filters?: Dictionary;
    columns: any[];
    columnsprefix: string;
}

const SummaryGraphic: React.FC<SummaryGraphicProps> = ({ openModal, setOpenModal, setView, row, daterange, filters, columns, columnsprefix }) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();

    const { register, handleSubmit, setValue, getValues, formState: { errors } } = useForm<any>({
        defaultValues: {
            graphictype: 'BAR',
            column: ''
        }
    });

    useEffect(() => {
        register('graphictype', { validate: (value: any) => (value && value.length) || t(langKeys.field_required) });
        register('column', { validate: (value: any) => (value && value.length) || t(langKeys.field_required) });
    }, [register]);

    const handleCancelModal = () => {
        setOpenModal(false);
    }

    const handleAcceptModal = handleSubmit((data) => {
        triggerGraphic(data);
    });

    const triggerGraphic = (data: any) => {
        setView(`CHART-${data.graphictype}-${data.column}`);
        setOpenModal(false);
        dispatch(getMainGraphic(getRecordHSMGraphic(
            {
                startdate: daterange?.startDate!,
                enddate: daterange?.endDate!,
                column: data.column,
                summarization: 'COUNT'
            }
        )));
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
                    onChange={(value) => setValue('column', value?.key)}
                    data={columns}
                    optionDesc="value"
                    optionValue="key"
                    uset={true}
                    prefixTranslation=""
                />
            </div>
        </DialogZyx>
    )
}

export default RecordHSMRecord;