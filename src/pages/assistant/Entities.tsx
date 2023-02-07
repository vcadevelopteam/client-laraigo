/* eslint-disable react-hooks/exhaustive-deps */
import React, { FC, useEffect, useState } from 'react'; // we need this to make JSX compile
import { useSelector } from 'hooks';
import {  FieldEdit, FieldEditArray, FieldMultiSelectFreeSolo, TemplateBreadcrumbs } from 'components';
import { useTranslation } from 'react-i18next';
import { langKeys } from 'lang/keys';
import { Button, IconButton, makeStyles, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@material-ui/core';
import TableZyx from 'components/fields/table-simple';
import ClearIcon from '@material-ui/icons/Clear';
import { Dictionary } from '@types';
import { useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import AddIcon from '@material-ui/icons/Add';
import SaveIcon from '@material-ui/icons/Save';
import { manageConfirmation, showBackdrop, showSnackbar } from 'store/popus/actions';
import DeleteIcon from '@material-ui/icons/Delete';
import { execute, getCollection, resetAllMain } from 'store/main/actions';
import { entitydelete, insertentity, selEntities } from 'common/helpers/requestBodies';


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
    const [keyword, setkeyword] = useState("");
    const [synonim, setsynonim] = useState("");
    const [disableCreate, setDisableCreate] = useState(true);
    const [dataKeywords, setDataKeywords] = useState<any>(row?.datajson?.keywords || []);
    const [selectedRows, setSelectedRows] = useState<Dictionary>({});
    const executeRes = useSelector(state => state.main.execute);
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
            if (!executeRes.loading && !executeRes.error) {
                dispatch(showSnackbar({ show: true, severity: "success", message: t(row ? langKeys.successful_edit : langKeys.successful_register) }))
                fetchData && fetchData();
                dispatch(showBackdrop(false));
                setViewSelected("view-1")
            } else if (executeRes.error) {
                const errormessage = t(executeRes.code || "error_unexpected_error", { module: t(langKeys.whitelist).toLocaleLowerCase() })
                dispatch(showSnackbar({ show: true, severity: "error", message: errormessage }))
                setWaitSave(false);
                dispatch(showBackdrop(false));
            }
        }
    }, [executeRes, waitSave])
    
    const onSubmit = handleSubmit((data) => {
        const callback = () => {
            dispatch(execute(insertentity({...data, datajson:JSON.stringify({...row?.datajson,
                keywords:dataKeywords,
                lookups: ["keywords"],
                name:data.name,
                roles: [row?.datajson?.roles? (row?.datajson?.roles[0]):data.name]
            })})));
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
                Header: t(langKeys.keywords),
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
    const executeRes = useSelector(state => state.main.execute);

    const fetchData = () => {dispatch(getCollection(selEntities()))};
    
    useEffect(() => {
        fetchData();

        return () => {
            dispatch(resetAllMain());
        };
    }, []);

    useEffect(() => {
        if (waitSave) {
            if (!executeRes.loading && !executeRes.error) {
                dispatch(showSnackbar({ show: true, severity: "success", message: t(langKeys.successful_delete) }))
                fetchData();
                dispatch(showBackdrop(false));
                setViewSelected("view-1")
            } else if (executeRes.error) {
                const errormessage = t(executeRes.code || "error_unexpected_error", { module: t(langKeys.messagingcost).toLocaleLowerCase() })
                dispatch(showSnackbar({ show: true, severity: "error", message: errormessage }))
                setWaitSave(false);
                dispatch(showBackdrop(false));
            }
        }
    }, [executeRes, waitSave])

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
                            {row.name}
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
                Header: "ID",
                accessor: 'id',
                width: "auto",
                NoFilter: true,
            },
            {
                Header: t(langKeys.lastUpdate),
                accessor: 'updatedate',
                width: "auto",
                NoFilter: true,
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
            dispatch(execute(entitydelete({table:JSON.stringify(Object.keys(selectedRows).map(x=>({name:x})))})))
            dispatch(showBackdrop(true));
            setWaitSave(true);
        }

        dispatch(manageConfirmation({
            visible: true,
            question: t(langKeys.confirmation_delete),
            callback
        }))
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
                                <Button
                                    disabled={Object.keys(selectedRows).length===0}
                                    variant="contained"
                                    type="button"
                                    color="primary"
                                    startIcon={<ClearIcon color="secondary" />}
                                    style={{ backgroundColor: Object.keys(selectedRows).length===0?"#dbdbdc":"#FB5F5F" }}
                                    onClick={handleDelete}
                                >{t(langKeys.delete)}</Button>
                            </div>
                        )}
                        loading={mainResult.mainData.loading}
                        register={true}
                        download={false}
                        handleRegister={handleRegister}
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