
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react'; // we need this to make JSX compile
import { useSelector } from 'hooks';
import { FieldEdit, TemplateBreadcrumbs, TitleDetail } from 'components';
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
import { execute } from 'store/main/actions';
import { rasaSynonimIns } from 'common/helpers/requestBodies';
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

export const DetailEntities: React.FC<DetailProps> = ({ data: { row, edit }, fetchData,setViewSelected, setExternalViewSelected, arrayBread }) => {
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
                dispatch(showBackdrop(false));
                setViewSelected("view-1")
                setTimeout(()=>{fetchData && fetchData()},500);
            } else if (operationRes.error) {
                const errormessage = t(operationRes.code || "error_unexpected_error", { module: t(langKeys.sinonim).toLocaleLowerCase() })
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
                                value={description}
                                error={!!errors?.description?.message}
                                helperText={errors?.description?.message || null}
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