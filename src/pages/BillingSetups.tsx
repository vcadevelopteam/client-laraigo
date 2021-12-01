/* eslint-disable react-hooks/exhaustive-deps */
import React, { FC, Fragment, useEffect, useState } from 'react'; // we need this to make JSX compile
import { useSelector } from 'hooks';
import { useDispatch } from 'react-redux';
import Button from '@material-ui/core/Button';
import { TemplateIcons, TemplateBreadcrumbs, TitleDetail, FieldView, FieldEdit, FieldSelect, AntTab } from 'components';
import { billingSupportIns, getBillingSupportSel, getPlanSel, getValuesFromDomain } from 'common/helpers';
import { Dictionary } from "@types";
import TableZyx from '../components/fields/table-simple';
import { makeStyles } from '@material-ui/core/styles';
import SaveIcon from '@material-ui/icons/Save';
import { useTranslation } from 'react-i18next';
import { langKeys } from 'lang/keys';
import { useForm } from 'react-hook-form';
import { getCollection, getMultiCollection, execute } from 'store/main/actions';
import { showSnackbar, showBackdrop, manageConfirmation } from 'store/popus/actions';
import ClearIcon from '@material-ui/icons/Clear';
import { Tabs, TextField } from '@material-ui/core';

interface RowSelected {
    row: Dictionary | null,
    edit: boolean
}
interface DetailSupportPlanProps {
    data: RowSelected;
    setViewSelected: (view: string) => void;
    fetchData: () => void,
    dataPlan: any[];
}
const arrayBread = [
    { id: "view-1", name: "Support Plan" },
    { id: "view-2", name: "Support Plan detail" }
];



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
    mb2: {
        marginBottom: theme.spacing(4),
    },
    itemDate: {
        minHeight: 40,
        height: 40,
        border: '1px solid #bfbfc0',
        borderRadius: 4,
        width: "100%",
        color: 'rgb(143, 146, 161)'
    },
    fieldsfilter: {
        width: "100%",
    },
}));

const DetailSupportPlan: React.FC<DetailSupportPlanProps> = ({ data: { row, edit }, setViewSelected, fetchData,dataPlan }) => {
    const user = useSelector(state => state.login.validateToken.user);
    const classes = useStyles();
    const [waitSave, setWaitSave] = useState(false);
    const executeRes = useSelector(state => state.main.execute);
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const [datetoshow, setdatetoshow] = useState(
        row? `${row.year}-${String(row.month).padStart(2, '0')}` : `${new Date(new Date().setDate(1)).getFullYear()}-${String(new Date(new Date().setDate(1)).getMonth()+1).padStart(2, '0')}`
    )
    
    const { register, handleSubmit, setValue, getValues, formState: { errors } } = useForm({
        defaultValues: {
            id: row ? row.billingsupportid : 0,
            startdate: row?.startdate || new Date(new Date().setDate(1)),
            enddate: row?.enddate || new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0),
            year: row?.year ||new Date().getFullYear(),
            month: row?.month ||new Date().getMonth() + 1,
            plan: row?.plan||"",
            basicfee: row?.basicfee||0,
            starttime: row?.starttime || new Date().getTime(),
            finishtime: row?.finishtime || new Date().getTime(),
            status: row ? row.status : 'ACTIVO',
            type: row ? row.type : '',
            description: row ? row.description : '',
            operation: row ? "UPDATE" : "INSERT",
        }
    });

    function handleDateChange(e: any){
        let datetochange = new Date(e+"-02")
        let mes = datetochange?.getMonth()+1
        let year = datetochange?.getFullYear()
        let startdate = new Date(year, mes-1, 1)
        let enddate = new Date(year, mes, 0)
        setValue('startdate',startdate)
        setValue('enddate',enddate)
        setdatetoshow(`${year}-${String(mes).padStart(2, '0')}`)
        setValue('year',year)
        setValue('month',mes)
    }

    React.useEffect(() => {
        register('id');
        register('type');
        register('status');
        register('year');
        register('month');
        register('operation');
        register('description', { validate: (value) => (value && value.length) || t(langKeys.field_required) });
        register('plan', { validate: (value) => (value && value.length) || t(langKeys.field_required) });
        register('basicfee', { validate: (value) => (value && value>0) || t(langKeys.field_required) });
        register('starttime', { validate: (value) => (value && value.length) || t(langKeys.field_required) });
        register('finishtime', { validate: (value) => (value && value.length) || t(langKeys.field_required) });
    }, [edit, register]);

    useEffect(() => {
        if (waitSave) {
            if (!executeRes.loading && !executeRes.error) {
                dispatch(showSnackbar({ show: true, success: true, message: t(row ? langKeys.successful_edit : langKeys.successful_register) }))
                fetchData && fetchData();
                dispatch(showBackdrop(false));
                setViewSelected("view-1")
            } else if (executeRes.error) {
                const errormessage = t(executeRes.code || "error_unexpected_error", { module: t(langKeys.organization_plural).toLocaleLowerCase() })
                dispatch(showSnackbar({ show: true, success: false, message: errormessage }))
                setWaitSave(false);
                dispatch(showBackdrop(false));
            }
        }
    }, [executeRes, waitSave])

    const onSubmit = handleSubmit((data) => {
        const callback = () => {
            dispatch(execute(billingSupportIns(data)));
            dispatch(showBackdrop(true));
            setWaitSave(true)
        }

        dispatch(manageConfirmation({
            visible: true,
            question: t(langKeys.confirmation_save),
            callback
        }))
    });

    return (
        <div style={{ width: '100%' }}>
            <form onSubmit={onSubmit}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div>
                        <TemplateBreadcrumbs
                            breadcrumbs={arrayBread}
                            handleClick={setViewSelected}
                        />
                        <TitleDetail
                            title={row ? `${row.description}` : t(langKeys.newsupportplan)}
                        />
                    </div>
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                        <Button
                            variant="contained"
                            type="button"
                            color="primary"
                            startIcon={<ClearIcon color="secondary" />}
                            style={{ backgroundColor: "#FB5F5F" }}
                            onClick={() => setViewSelected("view-1")}
                        >{t(langKeys.back)}</Button>
                        {edit &&
                            <Button
                                className={classes.button}
                                variant="contained"
                                color="primary"
                                type="submit"
                                startIcon={<SaveIcon color="secondary" />}
                                style={{ backgroundColor: "#55BD84" }}
                            >{t(langKeys.save)}
                            </Button>
                        }
                    </div>
                </div>
                <div className={classes.containerDetail}>
                    <div className="row-zyx">
                        {edit ?
                            <FieldEdit
                                label={t(langKeys.description)}
                                onChange={(value) => setValue('description', value)}
                                valueDefault={getValues('description')}
                                error={errors?.description?.message}
                                className="col-6"
                                //error={errors?.documentnumber?.message}
                            />
                            : <FieldView
                                label={t(langKeys.type)}
                                value={row ? (row.type || "") : ""}
                                className="col-6"
                            />}
                        {edit ?
                            <TextField
                                id="date"
                                className="col-6"
                                type="month"
                                variant="outlined"
                                onChange={(e)=>handleDateChange(e.target.value)}
                                value={datetoshow}
                                size="small"
                            />
                            : <FieldView
                                label={t(langKeys.corporation)}
                                value={user?.corpdesc}
                                className="col-6"
                            />}
                    </div>
                    <div className="row-zyx">
                        {edit ?
                            <FieldSelect
                                label="Plan"
                                className="col-6"
                                valueDefault={getValues("plan")}
                                onChange={(value) => setValue('plan',value.description)}
                                data={dataPlan}
                                optionDesc="description"
                                optionValue="description"
                                error={errors?.plan?.message}
                            />
                            : <FieldView
                                label={t(langKeys.description)}
                                value={row ? (row.orgdesc || "") : ""}
                                className="col-6"
                            />}
                        {edit ?
                            <FieldEdit
                                label={t(langKeys.supportprice)}
                                onChange={(value) => setValue('basicfee', value)}
                                valueDefault={getValues('basicfee')}
                                error={errors?.basicfee?.message}
                                type="number"
                                className="col-6"
                                //error={errors?.documentnumber?.message}
                            />
                            : <FieldView
                                label={t(langKeys.type)}
                                value={row ? (row.type || "") : ""}
                                className="col-6"
                            />}
                    </div>
                    <div className="row-zyx">
                        {edit ?
                            <FieldEdit
                                type="time"
                                label={t(langKeys.starttime)}
                                error={errors?.starttime?.message}
                                className="col-6"
                                onChange={(value) => setValue('starttime', value)}
                                valueDefault={getValues("starttime")}
                            />
                            : <FieldView
                                label={t(langKeys.status)}
                                value={row ? (row.status || "") : ""}
                                className="col-6"
                            />}
                        {edit ?
                            <FieldEdit
                                type="time"
                                label={t(langKeys.finishtime)}
                                error={errors?.finishtime?.message}
                                className="col-6"
                                onChange={(value) => setValue('finishtime', value)}
                                valueDefault={getValues("finishtime")}
                            />
                            : <FieldView
                                label={t(langKeys.status)}
                                value={row ? (row.status || "") : ""}
                                className="col-6"
                            />}
                    </div>
                </div>
            </form>
        </div>
    );
}

const SupportPlan: React.FC <{ dataPlan: any}> = ({ dataPlan }) => {
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const mainResult = useSelector(state => state.main);
    const executeResult = useSelector(state => state.main.execute);
    const classes = useStyles();
    const [viewSelected, setViewSelected] = useState("view-1");
    const [rowSelected, setRowSelected] = useState<RowSelected>({ row: null, edit: false });
    const [waitSave, setWaitSave] = useState(false);
    const [dataMain, setdataMain] = useState({
        startdate: new Date(new Date().setDate(1)),
        enddate: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0),
        datetoshow: `${new Date(new Date().setDate(1)).getFullYear()}-${String(new Date(new Date().setDate(1)).getMonth()+1).padStart(2, '0')}`,
        plan: "",
        year: new Date().getFullYear(),
        month: new Date().getMonth() + 1
    });

    function handleDateChange(e: any){
        let datetochange = new Date(e+"-02")
        let mes = datetochange?.getMonth()+1
        let year = datetochange?.getFullYear()
        let startdate = new Date(year, mes-1, 1)
        let enddate = new Date(year, mes, 0)
        let datetoshow = `${startdate.getFullYear()}-${String(startdate.getMonth()+1).padStart(2, '0')}`
        setdataMain(prev=>({...prev,startdate,enddate,datetoshow,year,month:mes}))
    }
    function search(){
        dispatch(showBackdrop(true))
        dispatch(getCollection(getBillingSupportSel(dataMain)))
    }
    useEffect(() => {
        search()
    }, [])
    useEffect(() => {
        if (!mainResult.mainData.loading){
            dispatch(showBackdrop(false))
        }
    }, [mainResult])
    const columns = React.useMemo(
        () => [
            {
                accessor: 'orgid',
                isComponent: true,
                minWidth: 60,
                width: '1%',
                Cell: (props: any) => {
                    const row = props.cell.row.original;
                    return (
                        <TemplateIcons
                            deleteFunction={() => handleDelete(row)}
                            editFunction={() => handleEdit(row)}
                            viewFunction={() => handleView(row)} //esta es la funcion de duplicar
                            extraOption={t(langKeys.duplicate)}
                        />
                    )
                }
            },
            {
                Header: t(langKeys.month),
                accessor: 'month',
            },
            {
                Header: t(langKeys.year),
                accessor: 'year',
            },
            {
                Header: t(langKeys.supportplan),
                accessor: 'plan',
            },
            {
                Header: t(langKeys.supportprice),
                accessor: 'basicfee',
            },
            {
                Header: t(langKeys.starttime),
                accessor: 'starttime',
            },
            {
                Header: t(langKeys.finishtime),
                accessor: 'finishtime',
            },
        ],
        []
    );

    const fetchData = () => dispatch(getCollection(getBillingSupportSel(dataMain)));


    useEffect(() => {
        if (waitSave) {
            if (!executeResult.loading && !executeResult.error) {
                dispatch(showSnackbar({ show: true, success: true, message: t(langKeys.successful_delete) }))
                fetchData();
                dispatch(showBackdrop(false));
                setWaitSave(false);
            } else if (executeResult.error) {
                const errormessage = t(executeResult.code || "error_unexpected_error", { module: t(langKeys.organization_plural).toLocaleLowerCase() })
                dispatch(showSnackbar({ show: true, success: false, message: errormessage }))
                dispatch(showBackdrop(false));
                setWaitSave(false);
            }
        }
    }, [executeResult, waitSave])

    const handleRegister = () => {
        setViewSelected("view-2");
        setRowSelected({ row: null, edit: true });
    }

    const handleView = (row: Dictionary) => {
        const callback = () => {
            dispatch(execute(billingSupportIns({ ...row, type: row.type, operation: 'DUPLICATE', id: 0 })));
            dispatch(showBackdrop(true));
            setWaitSave(true);
        }

        dispatch(manageConfirmation({
            visible: true,
            question: t(langKeys.confirmation_delete),
            callback
        }))
    }

    const handleEdit = (row: Dictionary) => {
        setViewSelected("view-2");
        setRowSelected({ row, edit: true });
    }

    const handleDelete = (row: Dictionary) => {
        const callback = () => {
            dispatch(execute(billingSupportIns({ ...row, type: row.type, operation: 'DELETE', status: 'ELIMINADO', id: row.billingsupportid })));
            dispatch(showBackdrop(true));
            setWaitSave(true);
        }

        dispatch(manageConfirmation({
            visible: true,
            question: t(langKeys.confirmation_delete),
            callback
        }))
    }

    if (viewSelected === "view-1") {

        return (
            <Fragment>
                <div>
                    <div style={{width:"100%", display: "flex", padding: 10}}>
                        <div style={{flex:1, paddingRight: "10px",}}>
                            <TextField
                                id="date"
                                className={classes.fieldsfilter}
                                type="month"
                                variant="outlined"
                                onChange={(e)=>handleDateChange(e.target.value)}
                                value={dataMain.datetoshow}
                                size="small"
                            />
                        </div>
                        <div style={{flex:1, paddingRight: "10px",}}>
                            <FieldSelect
                                label="Plan"
                                className={classes.fieldsfilter}
                                valueDefault={dataMain.plan}
                                variant="outlined"
                                onChange={(value) => setdataMain(prev=>({...prev,plan:value?value:""}))}
                                data={dataPlan}
                                optionDesc="description"
                                optionValue="description"
                            />
                        </div>
                        <div style={{flex:1, paddingLeft: 20}}>
                            <Button
                                variant="contained"
                                color="primary"
                                style={{ width: "100%", backgroundColor: "#007bff" }}
                                onClick={() => search()}
                            >{t(langKeys.search)}
                            </Button>
                        </div>
                    </div>
                </div>

                <TableZyx
                    columns={columns}
                    // titlemodule={t(langKeys.organization_plural, { count: 2 })}
                    data={mainResult.mainData.data}
                    filterGeneral={false}
                    download={true}
                    loading={mainResult.mainData.loading}
                    register={true}
                    handleRegister={handleRegister}
                />
            </Fragment>
        )
    }
    else if (viewSelected === "view-2") {
        return (
            <DetailSupportPlan
                data={rowSelected}
                setViewSelected={setViewSelected}
                fetchData={fetchData}
                dataPlan = {dataPlan}
            />
        )
    } else
        return null;
}

const BillingSetup: FC = () => {
    const dispatch = useDispatch();
    const { t } = useTranslation();
    
    const multiData = useSelector(state => state.main.multiData);
    const [pageSelected, setPageSelected] = useState(0);
    const [sentfirstinfo, setsentfirstinfo] = useState(false);
    const [dataPlan, setdataPlan] = useState<any>([]);
    useEffect(() => {
        if(!multiData.loading && sentfirstinfo){
            setsentfirstinfo(false)
            setdataPlan(multiData.data[0] && multiData.data[0].success ? multiData.data[0].data : [])
        }
    }, [multiData])
    useEffect(()=>{
        setsentfirstinfo(true)
        dispatch(getMultiCollection([
            getPlanSel(),
            getValuesFromDomain("ESTADOGENERICO"),
        ]));
    },[])
    return (
        <div style={{ width: '100%' }}>
            <Tabs
                value={pageSelected}
                indicatorColor="primary"
                variant="fullWidth"
                style={{ borderBottom: '1px solid #EBEAED', backgroundColor: '#FFF', marginTop: 8 }}
                textColor="primary"
                onChange={(_, value) => setPageSelected(value)}
            >
                <AntTab label={t(langKeys.supportplan)} />
                <AntTab label={t(langKeys.contractedplanbyperiod)} />
                <AntTab label="Costo de conversación" />
                <AntTab label="Costo por periodo" />
                <AntTab label="Costo por periodo HSM" />
                <AntTab label="Reporte del periodo" />
            </Tabs>
            {pageSelected === 0 &&
                <div style={{ marginTop: 16 }}>
                    <SupportPlan dataPlan={dataPlan}/>
                </div>
            }
            {pageSelected === 1 &&
                <span>hola</span>
            }
        </div>
    );

}

export default BillingSetup;