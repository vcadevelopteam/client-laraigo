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
import { useFieldArray, useForm } from 'react-hook-form';
import AddIcon from '@material-ui/icons/Add';
import SaveIcon from '@material-ui/icons/Save';
import { manageConfirmation, showBackdrop, showSnackbar } from 'store/popus/actions';
import DeleteIcon from '@material-ui/icons/Delete';
import { getCollection, resetAllMain } from 'store/main/actions';
import { selEntities } from 'common/helpers/requestBodies';


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
        margin: theme.spacing(1),
        minHeight: 58,
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
    const executeRes = useSelector(state => state.main.execute);
    const dispatch = useDispatch();
    const { t } = useTranslation();

    const { control,register, handleSubmit, setValue, getValues, trigger, formState: { errors } } = useForm({
        defaultValues: {
            type: 'NINGUNO',
            id: row ? row.whitelistid : 0,
            name: row?.name || '',
            sinonims: row?.sinonims || '',
            operation: row ? "EDIT" : "INSERT",
            keywords: row?.keywords || [],
            status: "ACTIVO",
        }
    });

    const { fields: fieldsKeywords, append: keywordsAppend, remove: keywordsRemove } = useFieldArray({
        control,
        name: 'keywords',
    });
    React.useEffect(() => {
        register('type');
        register('id');
        register('status');
        register('operation');
        register('sinonims');
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
            //dispatch(execute(insWhitelist(data)));
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
                                                            keywordsAppend({ keyword: '' });
                                                        }}
                                                    >
                                                        <AddIcon />
                                                    </IconButton>
                                                </TableCell>
                                                <TableCell>{t(langKeys.keywords)}</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody style={{ marginTop: 5 }}>
                                            {fieldsKeywords.map((item: any, i: number) =>
                                                <TableRow key={item.id}>
                                                    <TableCell width={30}>
                                                        <div style={{ display: 'flex' }}>
                                                            <IconButton
                                                                size="small"
                                                                onClick={() => { keywordsRemove(i) }}
                                                            >
                                                                <DeleteIcon style={{ color: '#777777' }} />
                                                            </IconButton>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell style={{ width: 200 }}>
                                                        <FieldEditArray
                                                            fregister={{
                                                                ...register(`keywords.${i}.keyword`),
                                                            }}
                                                            valueDefault={getValues(`keywords.${i}.keyword`)}
                                                            error={errors?.keywords?.[i]?.keyword?.message}
                                                            onChange={(value) => setValue(`keywords.${i}.keyword`, value)}
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
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <div className={classes.title}>{t(langKeys.sinonims)}</div>
                            </div>
                            <div>
                                <FieldMultiSelectFreeSolo
                                    className={classes.field}
                                    valueDefault={getValues('sinonims')}
                                    onChange={(value) => {
                                        const sinonims = value.join();
                                        setValue('sinonims', sinonims);
                                    }}
                                    error={errors?.sinonims?.message}
                                    loading={false}
                                    data={getValues('sinonims').split(',').filter((i: any) => i !== '')}
                                    optionDesc="domaindesc"
                                    optionValue="domaindesc"
                                />
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
    const [selectedRows, setSelectedRows] = useState<Dictionary>({});
    const [rowSelected, setRowSelected] = useState<RowSelected>({ row: null, edit: false });

    const [viewSelected, setViewSelected] = useState("view-1");
    const selectionKey= "name"

    const fetchData = () => {dispatch(getCollection(selEntities()))};
    
    useEffect(() => {
        fetchData();

        return () => {
            dispatch(resetAllMain());
        };
    }, []);

    const columns = React.useMemo(
        () => [
            {
                Header: t(langKeys.entities),
                accessor: 'name',
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
                            {row.name}
                        </label>
                    )
                }
                
            },
            {
                Header: t(langKeys.value_plural),
                accessor: 'description',
                NoFilter: true,
                Cell: (props: any) => {
                    const row = props.cell.row.original;
                    debugger
                    return (
                        <label>
                            {row?.datajson?.keywords?.reduce((acc:string,item:any)=>acc + item.keyword + ",","").slice(0,-1)}
                        </label>
                    )
                }
            },
            {
                Header: "ID",
                accessor: 'id',
                NoFilter: true,
            },
            {
                Header: t(langKeys.lastUpdate),
                accessor: 'updatedate',
                NoFilter: true,
            },
        ],
        []
    );
    const handleRegister = () => {
        setViewSelected("view-2");
        setRowSelected({ row: null, edit: true })
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
                                onClick={() => {debugger}}
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