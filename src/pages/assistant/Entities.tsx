/* eslint-disable react-hooks/exhaustive-deps */
import React, { FC, useEffect, useState } from 'react'; // we need this to make JSX compile
import { useSelector } from 'hooks';
import {  FieldEdit, FieldEditArray, FieldMultiSelectFreeSolo } from 'components';
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
import { execute, getCollection, getMultiCollection, resetAllMain } from 'store/main/actions';
import { entitydelete, insertentity, selEntities } from 'common/helpers/requestBodies';
import { exportExcel, uploadExcel } from 'common/helpers';


interface RowSelected {
    row: Dictionary | null,
    edit: Boolean
}

interface DetailProps {
    data: RowSelected;
    fetchData?: () => void;
    setViewSelected: (view: string) => void;
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
}));



const DetailEntities: React.FC<DetailProps> = ({ data: { row, edit }, fetchData,setViewSelected }) => {
    const classes = useStyles();
    const [waitSave, setWaitSave] = useState(false);
    const [keywords, setkeywords] = useState<any>(row?.datajson?.keywords || []);
    const executeRes = useSelector(state => state.main.execute);
    const dispatch = useDispatch();
    const { t } = useTranslation();

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
                const errormessage = t(executeRes.code || "error_unexpected_error", { module: t(langKeys.entities).toLocaleLowerCase() })
                dispatch(showSnackbar({ show: true, severity: "error", message: errormessage }))
                setWaitSave(false);
                dispatch(showBackdrop(false));
            }
        }
    }, [executeRes, waitSave])
    
    const onSubmit = handleSubmit((data) => {
        const callback = () => {
            dispatch(execute(insertentity({...data, datajson:JSON.stringify({...row?.datajson,
                keywords:keywords,
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

    return (
        <div style={{width: '100%'}}>
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
                            className="col-12"
                            onChange={(value) => {
                                setValue('name', value)
                            }}
                            valueDefault={row?.name || ""}
                            error={errors?.name?.message}
                        />
                    </div>
                </div>
                <div className={classes.containerDetail}>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                        <div style={{ flex: .55 }} className={classes.containerDetail}>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <div className={classes.title}>{t(langKeys.keywords)}</div>
                            </div>
                            <div>
                                <TableContainer>
                                    <Table size="small">
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>
                                                    <IconButton
                                                        size="small"
                                                        onClick={async () => {
                                                            setkeywords([...keywords,{ keyword: '', synonyms: [] }])
                                                        }}
                                                    >
                                                        <AddIcon />
                                                    </IconButton>
                                                </TableCell>
                                                <TableCell>{t(langKeys.keywords)}</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody style={{ marginTop: 5 }}>
                                            {keywords.map((item: any, i: number) =>
                                                <TableRow key={i}>
                                                    <TableCell width={30}>
                                                        <div style={{ display: 'flex' }}>
                                                            <IconButton
                                                                size="small"
                                                                onClick={() => { setkeywords(keywords.splice(i,1)) }}
                                                            >
                                                                <DeleteIcon style={{ color: '#777777' }} />
                                                            </IconButton>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell style={{ width: 200 }}>
                                                        <FieldEditArray
                                                            valueDefault={keywords[i].keyword}
                                                            onChange={(value) => {
                                                                let tempkeywords = keywords
                                                                tempkeywords[i].keyword = value
                                                                setkeywords(tempkeywords)
                                                            }}
                                                        />
                                                    </TableCell>
                                                </TableRow>
                                            )}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </div>
                        </div>

                        <div style={{ flex: .45 }} className={classes.containerDetail}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: "45px" }}>
                                <div className={classes.title}>{t(langKeys.sinonims)}</div>
                            </div>
                            <div>
                                
                                {keywords.map((item: any, i: number) =>
                                
                                    <FieldMultiSelectFreeSolo
                                        valueDefault={keywords[i].synonyms.join()||""}
                                        className={classes.field}
                                        key={i}
                                        onChange={(value) => {
                                            let tempkeywords = keywords
                                            tempkeywords[i].synonyms = value
                                            setkeywords(tempkeywords)
                                        }}
                                        loading={false}
                                        data={keywords[i].synonyms.map((x:any) => ({ value: x }))}
                                        optionDesc="value"
                                        optionValue="value"
                                    />
                                )}
                            </div>
                        </div>
                    </div>
                </div>                 
            </form>
        </div>
    );
}

export const Entities: FC = () => {
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
    const [waitImport, setWaitImport] = useState(false);
    const multiData = useSelector(state => state.main.multiData);

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
            if (!multiData.loading && !multiData.error && !!multiData.data?.reduce((acc:number,element:any)=>acc * element.success,1)) {
                dispatch(showSnackbar({ show: true, severity: "success", message: t(langKeys.successful_transaction) }))
                dispatch(showBackdrop(false));
                setWaitImport(false);
                fetchData();
            } else if (multiData.error || !!multiData.data?.reduce((acc:number,element:any)=>acc * element.success,1)) {
                const errormessage = t(multiData.code || "error_unexpected_error", { module: t(langKeys.intentions).toLocaleLowerCase() })
                dispatch(showSnackbar({ show: true, severity: "error", message: errormessage }))
                dispatch(showBackdrop(false));
                setWaitImport(false);
            }
        }
    }, [multiData, waitImport]);

    const handleUpload = async (files: any[]) => {
        debugger
        const file = files[0];
        if (file) {
            const data: any = (await uploadExcel(file, undefined) as any[]).filter((d: any) => !['', null, undefined].includes(d.name));
            if (data.length > 0) {
                dispatch(showBackdrop(true));
                setWaitImport(true)
                debugger
                dispatch(getMultiCollection(data.reduce((acc:any,d:any) => [...acc,insertentity({
                    name: d.name, 
                    datajson: d.datajson, 
                    operation: d.operation || 'INSERT',
                })],[])))
            
            }
        }
    }
    

    if (viewSelected==="view-1"){
        return (
            <React.Fragment>
                <div style={{ height: 10 }}></div>
                <TableZyx
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
                    download={true}
                    triggerExportPersonalized={true}
                    handleRegister={handleRegister}
                    exportPersonalized={triggerExportData}
                    importCSV={handleUpload}
                    pageSizeDefault={20}
                    initialPageIndex={0}
                />
            </React.Fragment>
            );
    }else if (viewSelected==="view-2"){
        return (
            <div style={{ width: '100%' }}>
                <DetailEntities
                    data={rowSelected}
                    fetchData={fetchData}
                    setViewSelected={setViewSelected}
                />
            </div>
        );
    }else
        return null;
}