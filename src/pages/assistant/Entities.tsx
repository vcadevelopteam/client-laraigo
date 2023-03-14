/* eslint-disable react-hooks/exhaustive-deps */
import React, { FC, useEffect, useState } from 'react'; // we need this to make JSX compile
import { useSelector } from 'hooks';
import {  FieldEdit, FieldEditArray, FieldMultiSelectFreeSolo, TemplateBreadcrumbs } from 'components';
import { useTranslation } from 'react-i18next';
import { langKeys } from 'lang/keys';
import { Box, Button, IconButton, makeStyles, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField } from '@material-ui/core';
import TableZyx from 'components/fields/table-simple';
import ClearIcon from '@material-ui/icons/Clear';
import { Dictionary } from '@types';
import { useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import AddIcon from '@material-ui/icons/Add';
import SaveIcon from '@material-ui/icons/Save';
import { manageConfirmation, showBackdrop, showSnackbar } from 'store/popus/actions';
import DeleteIcon from '@material-ui/icons/Delete';
import { getCollection, resetAllMain } from 'store/main/actions';
import { selEntities } from 'common/helpers/requestBodies';
import { convertLocalDate, exportExcel, uploadExcel } from 'common/helpers';
import { entitydel, entityimport, entityins, trainwitai } from 'store/witia/actions';


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
    field: {
        minHeight: 38,
    },
    title: {
        fontSize: '22px',
        fontWeight: 'bold',
        color: theme.palette.text.primary,
    },
    containerFields: {
        paddingRight: "16px"
    },
}));



const DetailEntities: React.FC<DetailProps> = ({ data: { row, edit }, fetchData,setViewSelected, setExternalViewSelected, arrayBread }) => {
    const classes = useStyles();
    const [waitSave, setWaitSave] = useState(false);
    const operationRes = useSelector(state => state.witai.witaioperationresult);
    const [keyword, setkeyword] = useState("");
    const [synonim, setsynonim] = useState("");
    const [disableCreate, setDisableCreate] = useState(true);
    const [dataKeywords, setDataKeywords] = useState<any>(row?.datajson?.keywords || []);
    const [selectedRows, setSelectedRows] = useState<Dictionary>({});
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const selectionKey= "keyword"

    const { register, handleSubmit, setValue, formState: { errors } } = useForm({
        defaultValues: {
            type: 'NINGUNO',
            id: row ? row.id : 0,
            name: row?.name || '',
            operation: row ? "EDIT" : "INSERT",
            status: "ACTIVO",
        }
    });
    
    React.useEffect(() => {
        register('type');
        register('id');
        register('status');
        register('operation');
        register('name', { validate: (value) => (value && value.length) || t(langKeys.field_required) });
    }, [edit, register]);

    useEffect(() => {
        if (waitSave) {
            if (!operationRes.loading && !operationRes.error) {
                dispatch(showSnackbar({ show: true, severity: "success", message: t(row ? langKeys.successful_edit : langKeys.successful_register) }))
                fetchData && fetchData();
                dispatch(showBackdrop(false));
                setViewSelected("view-1")
            } else if (operationRes.error) {
                const errormessage = t(operationRes.code || "error_unexpected_error", { module: t(langKeys.entities).toLocaleLowerCase() })
                dispatch(showSnackbar({ show: true, severity: "error", message: errormessage }))
                setWaitSave(false);
                dispatch(showBackdrop(false));
            }
        }
    }, [operationRes, waitSave])
    
    const onSubmit = handleSubmit((data) => {
        const callback = () => {
            dispatch(entityins({...data, datajson:JSON.stringify({...row?.datajson,
                keywords:dataKeywords,
                lookups: ["keywords"],
                name:data.name,
                roles: [row?.datajson?.roles? (row?.datajson?.roles[0]):data.name]
            })}));
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
                Header: t(langKeys.keyword),
                accessor: 'keyword',
                NoFilter: true,
                width: "auto",
            },
            {
                Header: t(langKeys.sinonims),
                accessor: 'synonyms',
                NoFilter: true,
                width: "auto",
                Cell: (props: any) => {
                    const row = props.cell.row.original;
                    return row.synonyms.join();
                }
            },
        ],
        []
    );

    return (
        <div style={{width: '100%'}}>
            {!!arrayBread && <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <TemplateBreadcrumbs
                    breadcrumbs={[...arrayBread, { id: "view-2", name: t(langKeys.entities) }]}
                    handleClick={setExternalViewSelected}
                />
            </div>}
            <form onSubmit={onSubmit}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div>
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
                            color="primary"
                            type="submit"
                            startIcon={<SaveIcon color="secondary" />}
                            style={{ backgroundColor: "#55BD84" }}
                        >{t(langKeys.save)}
                        </Button>
                    </div>
                </div>
                <div className={classes.containerDetail}>
                    <div className="row-zyx">
                        <FieldEdit
                            label={t(langKeys.newentity)} 
                            className={classes.containerFields}
                            onChange={(value) => {
                                setValue('name', value)
                            }}
                            valueDefault={row?.name || ""}
                            error={errors?.name?.message}
                        />
                        <div style={{ paddingTop:"8px",paddingBottom:"16px"}}>{t(langKeys.entitynametooltip)}</div>
                    </div>
                </div>
                <div className={classes.containerDetail}>
                    <div className={classes.title}>{t(langKeys.keywordsandsinonyms)}</div>
                    <div className="row-zyx">
                        <div className='col-6'>

                            <FieldEdit
                                label={t(langKeys.keyword)} 
                                className={classes.containerFields}
                                onChange={(value) => {
                                    setkeyword(value);
                                    setDisableCreate(value==="")
                                }}
                                valueDefault={keyword}
                            />
                            <div style={{ paddingTop:"8px",paddingBottom:"16px"}}>{t(langKeys.entitykeywordtooltip)}</div>
                        </div>
                        <div className='col-6'>
                            <FieldEdit
                                label={t(langKeys.sinonims)} 
                                className={classes.containerFields}
                                onChange={(value) => {
                                    setsynonim(value)
                                }}
                                valueDefault={synonim}
                            />
                            <div style={{ paddingTop:"8px"}}>{t(langKeys.entitysinonimtooltip)}</div>
                        </div>
                    </div>
                    <div className="row-zyx">
                        <Button
                            variant="contained"
                            type="button"
                            className='col-1'
                            disabled={disableCreate}
                            color="primary"
                            startIcon={<AddIcon color="secondary" />}
                            style={{ backgroundColor: disableCreate?"#dbdbdc":"#0078f6" }}
                            onClick={() => {
                                let partialdata = dataKeywords
                                let alreadyin = partialdata.filter((x:any)=>x.keyword === keyword)
                                if(!!alreadyin.length){
                                    alreadyin[0].synonyms = synonim.split(',')
                                    setDataKeywords(partialdata)

                                }else{
                                    setDataKeywords([...dataKeywords,{keyword: keyword, synonyms: synonim.split(',')}])
                                }
                                setkeyword("")
                                setsynonim("")
                                setDisableCreate(true)    
                            }}
                        >{t(langKeys.add)}</Button>
                    </div>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                        <div style={{ width: '100%' }}>
                            <TableZyx
                                columns={columns}
                                data={dataKeywords}
                                filterGeneral={false}
                                useSelection={true}
                                selectionKey={selectionKey}
                                setSelectedRows={setSelectedRows}
                                onClickRow={e=>{ setkeyword(e.keyword);setsynonim(e.synonyms.join()); setDisableCreate(false) }}
                                ButtonsElement={() => (
                                    <div style={{display: "flex", justifyContent: "end", width: "100%"}}>
                                        <Button
                                            disabled={Object.keys(selectedRows).length===0}
                                            variant="contained"
                                            type="button"
                                            color="primary"
                                            startIcon={<ClearIcon color="secondary" />}
                                            style={{ backgroundColor: Object.keys(selectedRows).length===0?"#dbdbdc":"#FB5F5F" }}
                                            onClick={() => {setDataKeywords(dataKeywords.filter((x:any)=>!Object.keys(selectedRows).includes(x.keyword)))}}
                                        >{t(langKeys.delete)}</Button>
                                    </div>
                                )}
                                register={false}
                                download={false}
                                pageSizeDefault={20}
                                initialPageIndex={0}
                            />
                        </div>
                    </div>
                </div>                 
            </form>
        </div>
    );
}

interface EntityProps {
    setExternalViewSelected?: (view: string) => void;
    arrayBread?: any;
}

export const Entities: React.FC<EntityProps> = ({ setExternalViewSelected, arrayBread }) => {
    const dispatch = useDispatch();

    const { t } = useTranslation();
    const classes = useStyles();
    const mainResult = useSelector(state => state.main);
    const [waitSave, setWaitSave] = useState(false);
    const [selectedRows, setSelectedRows] = useState<Dictionary>({});
    const [rowSelected, setRowSelected] = useState<RowSelected>({ row: null, edit: false });

    const [viewSelected, setViewSelected] = useState("view-1");
    const selectionKey= "name"
    const operationRes = useSelector(state => state.witai.witaioperationresult);
    const [waitImport, setWaitImport] = useState(false);
    const [sendTrainCall, setSendTrainCall] = useState(false);
    const trainResult = useSelector(state => state.witai.witaitrainresult);

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

    const fetchData = () => {dispatch(getCollection(selEntities()))};
    
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

    const columns = React.useMemo(
        () => [
            {
                Header: t(langKeys.entities),
                accessor: 'name',
                NoFilter: true,
                width: "auto",
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
                            @{row.name}
                        </label>
                    )
                }
                
            },
            {
                Header: t(langKeys.value_plural),
                accessor: 'description',
                NoFilter: true,
                width: "auto",
                Cell: (props: any) => {
                    const row = props.cell.row.original;
                    return (

                        <label>
                            {row?.datajson?.keywords?.reduce((acc:string,item:any)=>acc + item.keyword + ", ","").slice(0,-2)}
                        </label>
                    )
                }
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
            dispatch(entitydel({table:JSON.stringify(Object.keys(selectedRows).map(x=>({name:x})))}))
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
        let keys = Object.keys(selectedRows)
        let filtereddata = mainResult.mainData.data.filter(x=>keys.includes(x.name))
        exportExcel(t(langKeys.entities), filtereddata.map(x=>({...x,datajson: JSON.stringify(x.datajson)})))
    };
    useEffect(() => {
        if (waitImport) {
            if (!operationRes.loading && !operationRes.error) {
                dispatch(showSnackbar({ show: true, severity: "success", message: t(langKeys.successful_transaction) }))
                dispatch(showBackdrop(false));
                setWaitImport(false);
                fetchData();
            } else if (operationRes.error) {
                const errormessage = t(operationRes.code || "error_unexpected_error", { module: t(langKeys.intentions).toLocaleLowerCase() })
                dispatch(showSnackbar({ show: true, severity: "error", message: errormessage }))
                dispatch(showBackdrop(false));
                setWaitImport(false);
            }
        }
    }, [operationRes, waitImport]);

    const handleUpload = async (files: any[]) => {
        debugger
        const file = files[0];
        if (file) {
            const data: any = (await uploadExcel(file, undefined) as any[]).filter((d: any) => !['', null, undefined].includes(d.name));
            if (data.length > 0) {
                dispatch(showBackdrop(true));
                setWaitImport(true)
                let datatosend = data.reduce((acc:any,d:any) => [...acc,{
                    name: d.name, 
                    datajson: JSON.parse(d.datajson), 
                    operation: d.operation || 'INSERT',
                }],[])

                dispatch(entityimport({
                    datajson: JSON.stringify(datatosend)
                }))
            
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
                            breadcrumbs={[...arrayBread,{ id: "view-1", name:  t(langKeys.entities) }]}
                            handleClick={setExternalViewSelected}
                        />
                    </div>}
                    <TableZyx
                        titlemodule={!!arrayBread?t(langKeys.entities):""}
                        columns={columns}
                        data={mainResult.mainData.data}
                        filterGeneral={false}
                        useSelection={true}
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
                <DetailEntities
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