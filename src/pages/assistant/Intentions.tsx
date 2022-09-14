/* eslint-disable react-hooks/exhaustive-deps */
import React, { FC, useEffect, useState } from 'react'; // we need this to make JSX compile
import { useSelector } from 'hooks';
import { FieldEdit, TitleDetail } from 'components';
import { useTranslation } from 'react-i18next';
import { langKeys } from 'lang/keys';
import { Button, makeStyles } from '@material-ui/core';
import TableZyx from 'components/fields/table-simple';
import ClearIcon from '@material-ui/icons/Clear';
import { Dictionary } from '@types';
import { useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import SaveIcon from '@material-ui/icons/Save';
import { manageConfirmation, showBackdrop, showSnackbar } from 'store/popus/actions';
import { getCollection, resetAllMain } from 'store/main/actions';
import { selIntent } from 'common/helpers/requestBodies';


interface RowSelected {
    row: Dictionary | null,
    edit: Boolean
}

interface DetailProps {
    data: RowSelected;
    fetchData?: () => void;
    setViewSelected: (view: string) => void;
}
const selectionKey = 'intentionid';
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
}));

const DetailIntentions: React.FC<DetailProps> = ({ data: { row, edit }, fetchData,setViewSelected }) => {
    const classes = useStyles();
    const [waitSave, setWaitSave] = useState(false);
    const [disableSave, setDisableSave] = useState(!row);
    const [disableCreate, setDisableCreate] = useState(true);
    const [selectedRows, setSelectedRows] = useState<Dictionary>({});
    const [newIntention, setnewIntention] = useState("");
    const executeRes = useSelector(state => state.main.execute);
    const dispatch = useDispatch();
    const { t } = useTranslation();

    const { register, handleSubmit, setValue, getValues, formState: { errors } } = useForm({
        defaultValues: {
            type: 'NINGUNO',
            id: row ? row.whitelistid : 0,
            intentionname: row?.intentionname || '',
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
        register('intentionname', { validate: (value) => (value && value.length) || t(langKeys.field_required) });
        register('description', { validate: (value) => (value && value.length) || t(langKeys.field_required) });
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

    
    const columns = React.useMemo(
        () => [
            {
                Header: t(langKeys.userexample),
                accessor: 'description',
                NoFilter: true,
                width: "50%"
            },
            {
                Header: t(langKeys.added),
                accessor: 'examples',
                NoFilter: true,
                width: "50%"
            },
        ],
        []
    );

    return (
        <div style={{width: '100%'}}>
            <form onSubmit={onSubmit}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div>
                        <TitleDetail
                            title={row ? `${row.intention}` : t(langKeys.newintention)}
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
                        <FieldEdit
                            label={t(langKeys.intentionname)} 
                            disabled={!disableSave}
                            className="col-12"
                            onChange={(value) => {
                                setValue('intentionname', value)
                                setDisableCreate(getValues("description")===""||value==="")
                            }}
                            valueDefault={row?.intentionname || ""}
                            error={errors?.intentionname?.message}
                        />
                        <FieldEdit
                            label={t(langKeys.description)} 
                            disabled={!disableSave}
                            className="col-12"
                            onChange={(value) => {
                                setValue('description', value)
                                setDisableCreate(getValues("intentionname")===""||value==="")
                            }}
                            valueDefault={row?.description || ""}
                            error={errors?.description?.message}
                        />
                    </div>
                    {!row &&
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
                            label={t(langKeys.adduserexample)} 
                            className="col-12"
                            onChange={(value) => {
                                setnewIntention(value)
                            }}
                            valueDefault={newIntention}
                            error={errors?.intentionname?.message}
                        />
                        <div style={{paddingTop:"8px", paddingBottom:"8px"}}>{t(langKeys.uniqueexamplesuser)}</div>
                        <Button
                            variant="contained"
                            type="button"
                            className='col-3'
                            disabled={newIntention===""}
                            color="primary"
                            style={{ backgroundColor: newIntention===""?"#dbdbdc":"#0078f6" }}
                            onClick={() => {
                                //agregar a la tabla de ejemplos
                            }}
                        >{t(langKeys.add)}</Button>
                        
                        <div style={{ width: '100%' }}>
                            <TableZyx
                                columns={columns}
                                data={[]}
                                filterGeneral={false}
                                useSelection={true}
                                selectionKey={"exampleid"}
                                //setSelectedRows={setSelectedRows}
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
                                loading={false}
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

export const Intentions: FC = () => {
    const dispatch = useDispatch();

    const { t } = useTranslation();
    const classes = useStyles();
    const mainResult = useSelector(state => state.main);
    const multiData = useSelector(state => state.main.multiDataAux);
    const [selectedRows, setSelectedRows] = useState<any>({});
    const [rowSelected, setRowSelected] = useState<RowSelected>({ row: null, edit: false });

    const [viewSelected, setViewSelected] = useState("view-1");

    const fetchData = () => {dispatch(getCollection(selIntent()))};
    
    useEffect(() => {
        fetchData();
        
        return () => {
            dispatch(resetAllMain());
        };
    }, []);

    const columns = React.useMemo(
        () => [
            {
                Header: t(langKeys.intentions),
                accessor: 'intentionname',
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
                            {row.intentionname}
                        </label>
                    )
                }
                
            },
            {
                Header: t(langKeys.description),
                accessor: 'description',
                NoFilter: true,
            },
            {
                Header: "ID",
                accessor: 'intentionid',
                NoFilter: true,
            },
            {
                Header: t(langKeys.examples),
                accessor: 'examples',
                NoFilter: true,
            },
            {
                Header: t(langKeys.lastUpdate),
                accessor: 'lastupdate',
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
                <DetailIntentions
                    data={rowSelected}
                    fetchData={fetchData}
                    setViewSelected={setViewSelected}
                />
            </div>
        );
    }else
        return null;
}