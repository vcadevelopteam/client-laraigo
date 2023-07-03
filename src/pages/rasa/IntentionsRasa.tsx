/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react'; // we need this to make JSX compile
import { useSelector } from 'hooks';
import { DialogZyx, FieldEdit, TemplateBreadcrumbs, TitleDetail } from 'components';
import { useTranslation } from 'react-i18next';
import { langKeys } from 'lang/keys';
import { Box, Button, makeStyles, TextField } from '@material-ui/core';
import TableZyx from 'components/fields/table-simple';
import ClearIcon from '@material-ui/icons/Clear';
import { Dictionary } from '@types';
import { useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import SaveIcon from '@material-ui/icons/Save';
import { manageConfirmation, showBackdrop, showSnackbar } from 'store/popus/actions';
import { convertLocalDate, exportExcel, uploadExcel } from 'common/helpers';
import { intentdel, intentimport, trainwitai } from 'store/witia/actions';
import { execute, getCollection, getCollectionAux, resetAllMain } from 'store/main/actions';
import { exportintent, rasaIntentIns, rasaIntentSel, selUtterance } from 'common/helpers/requestBodies';
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

const IntentionCell: React.FC<{row:any, index: number, openModalEntity: (entity: any, index: number)=>void}> = ({row, index, openModalEntity}) => {
    const wordSeparation = [];
    let startIndex = 0;
    const classes = useStyles();
    
    while (true) {
      const delimiterIndex = row?.texto.indexOf('[', startIndex);
      
      if (delimiterIndex === -1) {
        wordSeparation.push(row?.texto.slice(startIndex));
        break;
      }
      
      wordSeparation.push(row?.texto.slice(startIndex, delimiterIndex));
      wordSeparation.push('[' + row?.texto.slice(delimiterIndex + '['.length, row?.texto.indexOf("]", delimiterIndex) + 1));
      
      startIndex = row?.texto.indexOf("]", delimiterIndex) + 1;
    }
    return <label>{wordSeparation.map((x:any, i: number)=>{
        if(x.includes('[')){
            return <label className={classes.labellink} onClick={()=>openModalEntity(row, index)}>{x}</label>
        }else{
            return <>{x}</>
        }
    })}</label>
}

const DetailIntentions: React.FC<DetailProps> = ({ data: { row, edit }, fetchData,setViewSelected, setExternalViewSelected, arrayBread }) => {
    const classes = useStyles();
    const [waitSave, setWaitSave] = useState(false);
    const [disableSave, setDisableSave] = useState(!row);
    const [disableCreate, setDisableCreate] = useState(true);
    const [openModal, setOpenModal] = useState(false);
    const [selectedRows, setSelectedRows] = useState<Dictionary>({});
    const [name, setname] = useState(row?.intent_name || '');
    const [intentionIndex, setIntentionIndex] = useState(-1);
    const [newIntention, setnewIntention] = useState("");
    const [newEntity, setNewEntity] = useState<Dictionary>({
        entity: "",
        description: "",
        value: "",
    });
    const [examples, setexamples] = useState(row?.intent_examples||[]);
    const mainResult = useSelector(state => state.main.mainAux);
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const executeResult = useSelector(state => state.main.execute);
    const selectionKey= "texto"

    const { register, handleSubmit, setValue, getValues, formState: { errors } } = useForm({
        defaultValues: {
            type: 'NINGUNO',
            id: row?.rasaintentid || 0,
            rasaid: row?.rasaid || 0,
            intent_name: row?.intent_name || '',
            intent_description: row?.intent_description || '',
            operation: row ? "EDIT" : "INSERT",
            status: "ACTIVO",
        }
    });

    const fetchutterance = () => {dispatch(getCollectionAux(selUtterance(row?.name||"")))};
    
    useEffect(() => {
        if(row){
            fetchutterance();
        }
    }, []);

    React.useEffect(() => {
        register('type');
        register('id');
        register('status');
        register('operation');
        register('intent_name', { validate: (value) => (value && value.length) || t(langKeys.field_required) });
        register('intent_description'//, { validate: (value) => (value && value.length) || t(langKeys.field_required) }
        );
    }, [edit, register]);

    useEffect(() => {
        if (waitSave) {
            if (!executeResult.loading && !executeResult.error) {
                dispatch(showSnackbar({ show: true, severity: "success", message: t(row ? langKeys.successful_edit : langKeys.successful_register) }))
                fetchData && fetchData();
                dispatch(showBackdrop(false));
                setViewSelected("view-1")
            } else if (executeResult.error) {
                const errormessage = t(executeResult.code || "error_unexpected_error", { module: t(langKeys.whitelist).toLocaleLowerCase() })
                dispatch(showSnackbar({ show: true, severity: "error", message: errormessage }))
                setWaitSave(false);
                dispatch(showBackdrop(false));
            }
        }
    }, [executeResult, waitSave])
    
    const onSubmit = handleSubmit((data) => {
        const callback = () => {
            let entitiesList:any[] =[]
            examples.forEach((item:any) => {
                item.entidades.forEach((entidad:any) => {
                    entitiesList.push(entidad);
                });
              });
            let uniqueEntities:any[] =[]
            let uniqueValues:any[] =[]
            entitiesList.forEach((item:any) => {
              if (!uniqueEntities.includes(item.entity)) {
                uniqueEntities.push(item.entity);
              }
              if (!uniqueValues.includes(item.value)) {
                uniqueValues.push(item.value);
              }
            });
            let tempexamples = examples
            tempexamples.forEach((e:any)=>delete e.updatedate)
            dispatch(execute(rasaIntentIns({...data, intent_examples: JSON.stringify(examples), entity_examples: uniqueEntities.length, entities: uniqueEntities.join(","), entity_values: uniqueValues.join(",") })))
            dispatch(showBackdrop(true));
            setWaitSave(true)
        }

        dispatch(manageConfirmation({
            visible: true,
            question: t(langKeys.confirmation_save),
            callback
        }))
    });
    
    const openModalEntity = (entity:any, index: number)=>{
        setIntentionIndex(index);
        setOpenModal(true)
        setNewEntity({
            entity: entity.entidades[0].entity,
            description: entity.entidades[0]?.description||"",
            value: entity.entidades[0].value,
        });
    }
    const addtoTable = ()=>{
        console.log(newIntention)
        if(!!newEntity.entity.trim() && !!newEntity.value.trim()){
            let auxExamples = examples
            auxExamples[intentionIndex].entidades=[newEntity]
            setexamples(auxExamples)
            setNewEntity({
                entity: "",
                description: "",
                value: "",
            });
            setOpenModal(false)               
        }else{
            dispatch(showSnackbar({ show: true, severity: "warning", message: t(langKeys.errorRasaEntity) }))
        }
    }

    
    const columns = React.useMemo(
        () => [
            {
                Header: t(langKeys.userexample),
                accessor: 'texto',
                NoFilter: true,
                width: "auto",
                Cell: (props: any) => {
                    const row = props.cell.row.original;
                    return <IntentionCell row={row} openModalEntity={openModalEntity} index={props.cell.row.index}/>
                }
            },
        ],
        []
    );

    return (
        <div style={{width: '100%'}}>
            {!!arrayBread && <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <TemplateBreadcrumbs
                    breadcrumbs={[...arrayBread, { id: "view-2", name: t(langKeys.intentions) }]}
                    handleClick={setExternalViewSelected}
                />
            </div>}
            <form onSubmit={onSubmit}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div>
                        <TitleDetail
                            title={row ? `${row.intent_name}` : t(langKeys.newintention)}
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
                            <Box fontWeight={500} lineHeight="18px" fontSize={14} mb={.5} color="textPrimary">{t(langKeys.name)}</Box>
                            <TextField
                                color="primary"
                                fullWidth
                                disabled={!disableSave}
                                value={name}
                                error={!!errors?.intent_name?.message}
                                helperText={errors?.intent_name?.message || null}
                                onInput={(e: any) => {
                                    // eslint-disable-next-line no-useless-escape
                                    if(!((/^[a-zA-Z_]/g).test(e.target.value) && (/[a-zA-Z0-9\_]$/g).test(e.target.value))){
                                        if(e.target.value!=="") e.target.value = name
                                    }
                                }}
                                onChange={(e) => {
                                    setValue('intent_name', e.target.value)
                                    setname(e.target.value)
                                    setDisableCreate(getValues("intent_description")===""||e.target.value==="")
                                }}
                            />
                        </div>
                        <div style={{ paddingTop:"8px",paddingBottom:"16px"}}>{t(langKeys.intentionnametooltip)}</div>
                        <FieldEdit
                            label={t(langKeys.description)} 
                            disabled={!disableSave}
                            className={classes.containerFields}
                            onChange={(value) => {
                                setValue('intent_description', value)
                                setDisableCreate(getValues("intent_name")===""||value==="")
                            }}
                            valueDefault={row?.intent_description || ""}
                            error={errors?.intent_description?.message}
                        />
                        <div style={{ paddingTop:"8px"}}>{t(langKeys.intentiondescriptiontooltip)}</div>
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
                                    let tempint =newIntention
                                    setnewIntention(tempint)
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
                            label={t(langKeys.adduserexample)}
                            className="col-12"
                            valueDefault={newIntention}
                            onChange={(value) => setnewIntention(value)}
                        />
                        <div style={{paddingTop:"8px", paddingBottom:"8px"}}>{t(langKeys.uniqueexamplesuser)}</div>
                        <Button
                            variant="contained"
                            type="button"
                            className='col-3'
                            disabled={newIntention===""}
                            color="primary"
                            startIcon={<AddIcon color="secondary" />}
                            style={{ backgroundColor: newIntention===""?"#dbdbdc":"#0078f6" }}
                            onClick={() => {
                                if(newIntention.trim()){
                                    setexamples([{texto: newIntention, entidades: []},...examples])    
                                    if(/\[[^\]]+\]/.test(newIntention)){
                                        setOpenModal(true)
                                        setIntentionIndex(0)
                                    }
                                    setnewIntention("")
                                }
                                
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
                <DialogZyx
                    open={openModal}
                    title={t(langKeys.entities)}
                    buttonText1={t(langKeys.cancel)}
                    buttonText2={t(langKeys.save)}
                    handleClickButton1={() => setOpenModal(false)}
                    handleClickButton2={addtoTable}
                >
                    <div className="row-zyx">                    
                        <FieldEdit
                            label={t(langKeys.name)} 
                            className={classes.containerFields}
                            onChange={(value) => {
                                setNewEntity({...newEntity, entity: value})
                            }}
                            valueDefault={newEntity.entity}
                        />
                    </div>
                    <div className="row-zyx">
                        <FieldEdit
                            label={t(langKeys.description)} 
                            className={classes.containerFields}
                            onChange={(value) => {
                                setNewEntity({...newEntity, description: value})
                            }}
                            valueDefault={newEntity.description}
                        />
                    </div>
                    <div className="row-zyx">
                        <FieldEdit
                            label={t(langKeys.value)} 
                            className={classes.containerFields}
                            onChange={(value) => {
                                setNewEntity({...newEntity, value: value})
                            }}
                            valueDefault={newEntity.value}
                        />
                    </div>
                </DialogZyx>
            </form>
        </div>
    );
}

interface IntentionProps {
    setExternalViewSelected?: (view: string) => void;
    arrayBread?: any;
}

export const IntentionsRasa: React.FC<IntentionProps> = ({ setExternalViewSelected, arrayBread }) => {
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

    const [viewSelected, setViewSelected] = useState("view-1");
    const [waitImport, setWaitImport] = useState(false);
    const trainResult = useSelector(state => state.witai.witaitrainresult);

    const fetchData = () => {dispatch(getCollection(rasaIntentSel(0)))};
    const selectionKey = 'rasaintentid';

    
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
            if (!operationRes.loading && !operationRes.error) {
                dispatch(showSnackbar({ show: true, severity: "success", message: t(langKeys.successful_delete) }))
                fetchData();
                dispatch(showBackdrop(false));
                setViewSelected("view-1")
            } else if (operationRes.error) {
                const errormessage = t(operationRes.code || "error_unexpected_error", { module: t(langKeys.intentions).toLocaleLowerCase() })
                dispatch(showSnackbar({ show: true, severity: "error", message: errormessage }))
                setWaitSave(false);
                dispatch(showBackdrop(false));
            }
        }
    }, [operationRes, waitSave])

    useEffect(() => {
        if (waitImport) {
            if (!operationRes.loading && !operationRes.error) {
                dispatch(showSnackbar({ show: true, severity: "success", message: t(langKeys.successful_transaction) }))
                fetchData();
                dispatch(showBackdrop(false));
                setWaitImport(false);
            } else if (operationRes.error) {
                const errormessage = t(operationRes.code || "error_unexpected_error", { module: t(langKeys.intentions).toLocaleLowerCase() })
                dispatch(showSnackbar({ show: true, severity: "error", message: errormessage }))
                dispatch(showBackdrop(false));
                setWaitImport(false);
            }
        }
    }, [operationRes, operationRes]);

    const columns = React.useMemo(
        () => [
            {
                Header: t(langKeys.intentions),
                accessor: 'name',
                width: "auto",
                NoFilter: true,
                Cell: (props: any) => {
                    const row = props.cell.row.original;
                    return (
                        <label
                            className={classes.labellink}
                            onClick={() => {      
                                dispatch(getCollectionAux(selUtterance(row?.name||"")))                  
                                setViewSelected("view-2");
                                setRowSelected({ row: row, edit: true })
                            }}
                        >
                            #{row.intent_name}
                        </label>
                    )
                }
                
            },
            {
                Header: t(langKeys.description),
                accessor: 'intent_examples',
                width: "auto",
                NoFilter: true,
                Cell: (props: any) => {
                    const row = props.cell.row.original;
                    return (
                        <label
                        >
                            {row.intent_examples?.length||"-"}
                        </label>
                    )
                }
            },
            {
                Header: t(langKeys.entities),
                accessor: 'entities',
                width: "auto",
                NoFilter: true,
            },
            {
                Header: `${t(langKeys.examples)} ${t(langKeys.entities)}`,
                accessor: 'entity_examples',
                width: "auto",
                NoFilter: true,
            },            
            {
                Header: t(langKeys.entities),
                accessor: 'entity_values',
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
        dispatch(getCollectionAux(selUtterance("")))    
        setViewSelected("view-2");
        setRowSelected({ row: null, edit: true })
    }
    const handleDelete = () => {
        const callback = () => {
            dispatch(intentdel({table:JSON.stringify(Object.keys(selectedRows).map(x=>({name:x})))}))
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
                exportExcel(t(langKeys.intentions), mainResultAux.data.map(x=>({...x,intent_datajson: JSON.stringify(x.intent_datajson), utterance_datajson: JSON.stringify(x.utterance_datajson)})))
            } else if (mainResultAux.error) {
                const errormessage = t(mainResultAux.code || "error_unexpected_error", { module: t(langKeys.blacklist).toLocaleLowerCase() })
                dispatch(showSnackbar({ show: true, severity: "error", message: errormessage }))
                dispatch(showBackdrop(false));
                setWaitExport(false);
            }
        }
    }, [mainResultAux, waitExport]);

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
                            breadcrumbs={[...arrayBread,{ id: "view-1", name:  t(langKeys.intentions) }]}
                            handleClick={setExternalViewSelected}
                        />
                    </div>}
                    <TableZyx
                        columns={columns}
                        data={mainResult.mainData.data}
                        filterGeneral={false}
                        useSelection={true}
                        titlemodule={!!arrayBread?t(langKeys.intentionsandentities):""}
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
                <DetailIntentions
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