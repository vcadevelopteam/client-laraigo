/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react'; // we need this to make JSX compile
import { useSelector } from 'hooks';
import { FieldEdit, TemplateBreadcrumbs, TitleDetail } from 'components';
import { useTranslation } from 'react-i18next';
import { langKeys } from 'lang/keys';
import { Box, Button, makeStyles, TextField } from '@material-ui/core';
import TableZyx from 'components/fields/table-simple';
import ClearIcon from '@material-ui/icons/Clear';
import { Dictionary, IRequestBody } from '@types';
import { useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import SaveIcon from '@material-ui/icons/Save';
import { manageConfirmation, showBackdrop, showSnackbar } from 'store/popus/actions';
import { convertLocalDate, exportExcel, uploadExcel } from 'common/helpers';
import { intentimport, trainwitai } from 'store/witia/actions';
import { execute, getCollection, getCollectionAux, getMultiCollection, resetAllMain } from 'store/main/actions';
import { exportintent, rasaSynonimIns, rasaSynonimSel } from 'common/helpers/requestBodies';
import AddIcon from '@material-ui/icons/Add';


interface RowSelected {
    row: Dictionary | null,
    edit: Boolean
}

interface DetailProps {
    data: RowSelected;
    fetchData?: () => void;
    setViewSelected: (view: string) => void;
    setExternalViewSelected?: (view: string) => void;
    arrayBread?: any;
}
const useStyles = makeStyles((theme) => ({
    labellink: {
        color: '#7721ad',
        textDecoration: 'underline',
        cursor: 'pointer'
    },
    button: {
        padding: 12,
        fontWeight: 500,
        fontSize: '14px',
        textTransform: 'initial'
    },
    containerDetail: {
        marginTop: theme.spacing(2),
        padding: theme.spacing(2),
        background: '#fff',
    },
    containerFields: {
        paddingRight: "16px"
    },
}));

const DetailSynonims: React.FC<DetailProps> = ({ data: { row, edit }, fetchData,setViewSelected, setExternalViewSelected, arrayBread }) => {
    const classes = useStyles();
    const [waitSave, setWaitSave] = useState(false);
    const [disableSave, setDisableSave] = useState(!row);
    const [disableCreate, setDisableCreate] = useState(true);
    const [selectedRows, setSelectedRows] = useState<Dictionary>({});
    const [newExample, setNewExample] = useState("");
    const [description, setDescription] = useState(row?.description || '');
    const operationRes = useSelector(state => state.witai.witaioperationresult);
    const [examples, setexamples] = useState<any>(row?.values?.split(",")?.reduce((acc:any,x:any)=>[...acc,{name:x}],[])||[]);
    const mainResult = useSelector(state => state.main.mainAux);
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const selectionKey= "name"
    const { register, handleSubmit, setValue, formState: { errors } } = useForm({
        defaultValues: {
            type: 'NINGUNO',
            id: row?.rasasynonymid || 0,
            rasaid: row?.rasaid || 0,
            description: row?.description || '',
            operation: row ? "EDIT" : "INSERT",
            status: "ACTIVO",
        }
    });

    React.useEffect(() => {
        register('type');
        register('id');
        register('status');
        register('operation');
        register('description', { validate: (value) => (value && value.length) || t(langKeys.field_required) });
    }, [edit, register]);

    useEffect(() => {
        if (waitSave) {
            if (!operationRes.loading && !operationRes.error) {
                dispatch(showSnackbar({ show: true, severity: "success", message: t(row ? langKeys.successful_edit : langKeys.successful_register) }))
                fetchData && fetchData();
                dispatch(showBackdrop(false));
                setViewSelected("view-1")
            } else if (operationRes.error) {
                const errormessage = t(operationRes.code || "error_unexpected_error", { module: t(langKeys.whitelist).toLocaleLowerCase() })
                dispatch(showSnackbar({ show: true, severity: "error", message: errormessage }))
                setWaitSave(false);
                dispatch(showBackdrop(false));
            }
        }
    }, [operationRes, waitSave])
    
    const onSubmit = handleSubmit((data) => {
        const callback = () => {
            let examplelist = examples.reduce((acc:any,x:any)=>[...acc,x.name],[])
            dispatch(execute(rasaSynonimIns({...data, examples: examplelist.length, values: examplelist.join(",")})));
            dispatch(showBackdrop(true));
            setWaitSave(true)
        }

        dispatch(manageConfirmation({
            visible: true,
            question: t(langKeys.confirmation_save),
            callback
        }))
    });

    
    const columns = React.useMemo(
        () => [
            {
                Header: t(langKeys.sinonims),
                accessor: 'name',
                NoFilter: true,
                width: "auto",
            },
        ],
        []
    );

    return (
        <div style={{width: '100%'}}>
            {!!arrayBread && <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <TemplateBreadcrumbs
                    breadcrumbs={[...arrayBread, { id: "view-2", name: t(langKeys.sinonims) }]}
                    handleClick={setExternalViewSelected}
                />
            </div>}
            <form onSubmit={onSubmit}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div>
                        <TitleDetail
                            title={row ? `${row.description}` : `${t(langKeys.new)} ${t(langKeys.sinonim)}`}
                        />
                    </div>
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center'  }}>
                        <Button
                            variant="contained"
                            type="button"
                            color="primary"
                            startIcon={<ClearIcon color="secondary" />}
                            style={{ backgroundColor: "#FB5F5F" }}
                            onClick={() => setViewSelected("view-1")}
                        >{t(langKeys.back)}</Button>
                        <Button
                            className={classes.button}
                            variant="contained"
                            disabled={disableSave}
                            color="primary"
                            type="submit"
                            startIcon={<SaveIcon color="secondary" />}
                            style={{ backgroundColor: disableSave?"#dbdbdc":"#55BD84" }}
                        >{t(langKeys.save)}
                        </Button>
                    </div>
                </div>
                <div className={classes.containerDetail}>
                    <div className="row-zyx">
                        <div className={classes.containerFields}>
                            <Box fontWeight={500} lineHeight="18px" fontSize={14} mb={.5} color="textPrimary">{t(langKeys.keyword)}</Box>
                            <TextField
                                color="primary"
                                fullWidth
                                disabled={!disableSave}
                                value={description}
                                error={!!errors?.description?.message}
                                helperText={errors?.description?.message || null}
                                onInput={(e: any) => {
                                    // eslint-disable-next-line no-useless-escape
                                    if(!((/^[a-zA-Z_]/g).test(e.target.value) && (/[a-zA-Z0-9\_]$/g).test(e.target.value))){
                                        if(e.target.value!=="") e.target.value = description
                                    }
                                }}
                                onChange={(e) => {
                                    setValue('description', e.target.value)
                                    setDescription(e.target.value)
                                    setDisableCreate(e.target.value==="")
                                }}
                            />
                        </div>
                    </div>
                    {(disableSave) &&
                        <div className="row-zyx">
                            <Button
                                variant="contained"
                                type="button"
                                className='col-3'
                                disabled={disableCreate}
                                color="primary"
                                style={{ backgroundColor: disableCreate?"#dbdbdc":"#0078f6" }}
                                onClick={() => {
                                    setDisableCreate(true);
                                    setDisableSave(false)
                                }}
                            >{t(langKeys.create)}</Button>
                        </div>
                    }
                    
                </div>
                {!disableSave && (
                    
                    <div className={classes.containerDetail}>
                        <FieldEdit
                            label={`${t(langKeys.register)} ${t(langKeys.sinonim)}`}
                            className="col-12"
                            rows={1}
                            valueDefault={newExample}
                            onChange={(value) => setNewExample(value)}
                        />
                        <div style={{paddingTop:"8px", paddingBottom:"8px"}}></div>
                        <Button
                            variant="contained"
                            type="button"
                            className='col-3'
                            disabled={newExample===""}
                            color="primary"
                            startIcon={<AddIcon color="secondary" />}
                            style={{ backgroundColor: newExample===""?"#dbdbdc":"#0078f6" }}
                            onClick={() => {
                                setexamples([...examples,{name: newExample}]);
                                setNewExample("")    
                            }}
                        >{t(langKeys.add)}</Button>
                        
                        <div style={{ width: '100%' }}>
                            <TableZyx
                                columns={columns}
                                data={examples}
                                filterGeneral={false}
                                useSelection={true}
                                selectionKey={selectionKey}
                                setSelectedRows={setSelectedRows}
                                ButtonsElement={() => (
                                    <div style={{display: "flex", justifyContent: "end", width: "100%"}}>
                                        <Button
                                            disabled={Object.keys(selectedRows).length===0}
                                            variant="contained"
                                            type="button"
                                            color="primary"
                                            startIcon={<ClearIcon color="secondary" />}
                                            style={{ backgroundColor: Object.keys(selectedRows).length===0?"#dbdbdc":"#FB5F5F" }}
                                            onClick={() => {setexamples(examples.filter((x:any)=>!Object.keys(selectedRows).includes(x.name)))}}
                                        >{t(langKeys.delete)}</Button>
                                    </div>
                                )}
                                loading={mainResult.loading}
                                register={false}
                                download={false}
                                pageSizeDefault={20}
                                initialPageIndex={0}
                            />
                        </div>
                    </div>
                    
                )}
            </form>
        </div>
    );
}

interface IntentionProps {
    setExternalViewSelected?: (view: string) => void;
    arrayBread?: any;
}

export const SynonimsRasa: React.FC<IntentionProps> = ({ setExternalViewSelected, arrayBread }) => {
    const dispatch = useDispatch();

    const { t } = useTranslation();
    const classes = useStyles();
    const mainResult = useSelector(state => state.main);
    const [selectedRows, setSelectedRows] = useState<any>({});
    const [waitSave, setWaitSave] = useState(false);
    const [sendTrainCall, setSendTrainCall] = useState(false);
    const operationRes = useSelector(state => state.witai.witaioperationresult);
    const [waitExport, setWaitExport] = useState(false);
    const mainResultAux = useSelector(state => state.main.mainAux);
    const [rowSelected, setRowSelected] = useState<RowSelected>({ row: null, edit: false });
    const multiResult = useSelector(state => state.main.multiData);

    const [viewSelected, setViewSelected] = useState("view-1");
    const [waitImport, setWaitImport] = useState(false);
    const trainResult = useSelector(state => state.witai.witaitrainresult);

    const fetchData = () => {dispatch(getCollection(rasaSynonimSel(0)))};
    const selectionKey = 'rasasynonymid';

    
    useEffect(() => {
        if(sendTrainCall){
            if(!trainResult.loading && !trainResult.error){
                let message="";
                switch (trainResult.data.training_status) {
                    case ("done"):
                        message=t(langKeys.bot_training_done)
                        break;
                    case ("scheduled"):
                        message=t(langKeys.bot_training_scheduled)
                        break;
                    case ("ongoing"):
                        message=t(langKeys.bot_training_ongoing)
                        break;
                }
                dispatch(showSnackbar({ show: true, severity: "success", message:  message}))
                setSendTrainCall(false);
                dispatch(showBackdrop(false));
            }else if(trainResult.error){
                const errormessage = t(trainResult.code || "error_unexpected_error", { module: t(langKeys.test).toLocaleLowerCase() })
                dispatch(showSnackbar({ show: true, severity: "error", message: errormessage }))
                setSendTrainCall(false);
                dispatch(showBackdrop(false));
            }
        }
    }, [trainResult,sendTrainCall]);
    
    useEffect(() => {
        fetchData();
        return () => {
            dispatch(resetAllMain());
        };
    }, []);

    useEffect(() => {
        if (waitSave) {
            if (!multiResult.loading && !multiResult.error) {
                dispatch(showSnackbar({ show: true, severity: "success", message: t(langKeys.successful_delete) }))
                fetchData();
                dispatch(showBackdrop(false));
                setViewSelected("view-1")
            } else if (multiResult.error) {
                const errormessage = t(multiResult.code || "error_unexpected_error", { module: t(langKeys.sinonims).toLocaleLowerCase() })
                dispatch(showSnackbar({ show: true, severity: "error", message: errormessage }))
                setWaitSave(false);
                dispatch(showBackdrop(false));
            }
        }
    }, [multiResult, waitSave])

    useEffect(() => {
        if (waitImport) {
            if (!operationRes.loading && !operationRes.error) {
                dispatch(showSnackbar({ show: true, severity: "success", message: t(langKeys.successful_transaction) }))
                fetchData();
                dispatch(showBackdrop(false));
                setWaitImport(false);
            } else if (operationRes.error) {
                const errormessage = t(operationRes.code || "error_unexpected_error", { module: t(langKeys.sinonims).toLocaleLowerCase() })
                dispatch(showSnackbar({ show: true, severity: "error", message: errormessage }))
                dispatch(showBackdrop(false));
                setWaitImport(false);
            }
        }
    }, [operationRes, operationRes]);

    const columns = React.useMemo(
        () => [
            {
                Header: t(langKeys.name),
                accessor: 'description',
                width: "auto",
                NoFilter: true,
                Cell: (props: any) => {
                    const row = props.cell.row.original;
                    return (
                        <label
                            className={classes.labellink}
                            onClick={() => {                    
                                setViewSelected("view-2");
                                setRowSelected({ row: row, edit: true })
                            }}
                        >
                            {row.description}
                        </label>
                    )
                }
                
            },
            {
                Header: t(langKeys.examples),
                accessor: 'examples',
                width: "auto",
                NoFilter: true,
                Cell: (props: any) => {
                    const row = props.cell.row.original;
                    return (
                        <label
                        >
                            {row.examples||"-"}
                        </label>
                    )
                }
            },
            {
                Header: t(langKeys.value_plural),
                accessor: 'values',
                width: "auto",
                NoFilter: true,
            },
            {
                Header: t(langKeys.lastUpdate),
                accessor: 'updatedate',
                width: "auto",
                NoFilter: true,
                Cell: (props: any) => {
                    const row = props.cell.row.original;
                    return convertLocalDate(row.updatedate).toLocaleString()
                }
            },
        ],
        []
    );
    const handleRegister = () => {
        setViewSelected("view-2");
        setRowSelected({ row: null, edit: true })
    }
    const handleDelete = () => {
        const callback = () => {
            let allRequestBody: IRequestBody[] = [];
            Object.keys(selectedRows).forEach(x => {
                allRequestBody.push(rasaSynonimIns({...mainResult.mainData.data.find(y=>y.rasasynonymid === parseInt(x)), operation:"DELETE", id: x}));
            });
            dispatch(getMultiCollection(allRequestBody))
            dispatch(showBackdrop(true));
            setWaitSave(true);
        }

        dispatch(manageConfirmation({
            visible: true,
            question: t(langKeys.confirmation_delete),
            callback
        }))
    }

    
    const triggerExportData = () => {
        if (Object.keys(selectedRows).length === 0) {
            dispatch(showSnackbar({ show: true, severity: "error", message: t(langKeys.no_record_selected)}));
            return null;
        }
        dispatch(getCollectionAux(exportintent({name_json: JSON.stringify(Object.keys(selectedRows).map(x=>({name:x})))})))    
        dispatch(showBackdrop(true));
        setWaitExport(true);
    };

    useEffect(() => {
        if (waitExport) {
            if (!mainResultAux.loading && !mainResultAux.error) {
                dispatch(showBackdrop(false));
                setWaitExport(false);
                exportExcel(t(langKeys.sinonims), mainResultAux.data.map(x=>({...x,intent_datajson: JSON.stringify(x.intent_datajson), utterance_datajson: JSON.stringify(x.utterance_datajson)})))
            } else if (mainResultAux.error) {
                const errormessage = t(mainResultAux.code || "error_unexpected_error", { module: t(langKeys.blacklist).toLocaleLowerCase() })
                dispatch(showSnackbar({ show: true, severity: "error", message: errormessage }))
                dispatch(showBackdrop(false));
                setWaitExport(false);
            }
        }
    }, [mainResultAux, waitExport]);
    useEffect(() => {
        console.log(mainResult)
    }, [mainResult]);

    const handleUpload = async (files: any[]) => {
        const file = files[0];
        if (file) {
            const data: any = (await uploadExcel(file, undefined) as any[]).filter((d: any) => !['', null, undefined].includes(d.intent_name));
            if (data.length > 0) {
                let datareduced = data.reduce((acc:any,element:any)=>{
                    let repeatedindex = acc.findIndex((item:any)=>item.name === element.intent_name)
                    if (repeatedindex < 0){
                        return [...acc, {
                            name: element.intent_name,
                            description: element.intent_description,
                            datajson: JSON.parse(element.intent_datajson),
                            utterance_datajson: [{
                                name: element.utterance_name,
                                datajson: JSON.parse(element.utterance_datajson)
                            }]
                        }]
                    }else{
                        let newacc = acc
                        newacc[repeatedindex].utterance_datajson.push(
                            {
                                name: element.utterance_name,
                                datajson: JSON.parse(element.utterance_datajson)
                            })                         
                        return newacc

                    }
                },[])
                dispatch(showBackdrop(true));
                setWaitImport(true)
                dispatch(intentimport({
                    utterance_datajson: JSON.stringify(datareduced.reduce((acc:any,x:any) => [...acc,...x.utterance_datajson],[])),
                    datajson: JSON.stringify(datareduced.map((x:any) => ({ name:x.name, description:x.description, datajson:x.datajson }))),
                }))            
            }
            else {
                dispatch(showSnackbar({ show: true, severity: "error", message: t(langKeys.no_records_valid) }));
            }
        }
    }
    
    if (viewSelected==="view-1"){
        return (
            <React.Fragment>
                <div style={{ height: 10 }}></div>
                <div style={{ width: "100%" }}>
                    {!!arrayBread && <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <TemplateBreadcrumbs
                            breadcrumbs={[...arrayBread,{ id: "view-1", name:  t(langKeys.sinonims) }]}
                            handleClick={setExternalViewSelected}
                        />
                    </div>}
                    <TableZyx
                        columns={columns}
                        data={mainResult.mainData.data}
                        filterGeneral={false}
                        useSelection={true}
                        titlemodule={!!arrayBread?t(langKeys.sinonims):""}
                        selectionKey={selectionKey}
                        setSelectedRows={setSelectedRows}
                        ButtonsElement={() => (     
                            <div style={{display: "flex", justifyContent: "end", width: "100%"}}>                       
                                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                                    <Button
                                        disabled={Object.keys(selectedRows).length===0}
                                        variant="contained"
                                        type="button"
                                        color="primary"
                                        startIcon={<ClearIcon color="secondary" />}
                                        style={{ backgroundColor: Object.keys(selectedRows).length===0?"#dbdbdc":"#FB5F5F" }}
                                        onClick={handleDelete}
                                    >{t(langKeys.delete)}</Button>
                                    <Button
                                        variant="contained"
                                        type="button"
                                        color="primary"
                                        style={{ backgroundColor: "#7721ad" }}
                                        onClick={()=>{dispatch(trainwitai());setSendTrainCall(true)}}
                                    >{t(langKeys.train)}</Button>
                                </div>
                            </div>
                        )}
                        loading={mainResult.mainData.loading}
                        register={true}
                        download={true}
                        triggerExportPersonalized={true}
                        exportPersonalized={triggerExportData}
                        handleRegister={handleRegister}
                        importCSV={handleUpload}
                        pageSizeDefault={20}
                        initialPageIndex={0}
                    />
                </div>
            </React.Fragment>
            );
    }else if (viewSelected==="view-2"){
        return (
            <div style={{ width: '100%' }}>
                <DetailSynonims
                    data={rowSelected}
                    fetchData={fetchData}
                    setViewSelected={setViewSelected}
                    setExternalViewSelected={setExternalViewSelected}
                    arrayBread={arrayBread}
                />
            </div>
        );
    }else
        return null;
}