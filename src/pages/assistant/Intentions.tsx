/* eslint-disable react-hooks/exhaustive-deps */
import React, { FC, useEffect, useState } from 'react'; // we need this to make JSX compile
import { useSelector } from 'hooks';
import { FieldEdit, FieldEditWithSelect, TitleDetail } from 'components';
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
import { execute, getCollection, getCollectionAux, getCollectionAux2, resetAllMain } from 'store/main/actions';
import { insertutterance, selEntities, selIntent, selUtterance, utterancedelete } from 'common/helpers/requestBodies';
import { filterPipe } from 'common/helpers';


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
}));

/*{
    name: "Quiero comprar un Samsung",
    datajson: {
        text: "Quiero comprar un Samsung",
        intent: {
            id: "525288882688594",
            "name": "saludo"
        },
        traits: [],
        entities: [
            {
                id: "1136777953889025",
                end: 25,
                body: "comprar un Samsung",
                name: "marca",
                role: "marca",
                start: 7,
                entities: [
                    {
                        id: "1767365776940765",
                        end: 18,
                        body: "Samsung",
                        name: "documento",
                        role: "documento",
                        start: 11,
                        entities: []
                    }
                ]
            }
        ]
    }
}*/


class VariableHandler {
    show: boolean;
    item: any;
    inputkey: string;
    inputvalue: string;
    range: number[];
    top: number;
    left: number;
    changer: ({ ...param }) => any;
    constructor() {
        this.show = false;
        this.item = null;
        this.inputkey = '';
        this.inputvalue = '';
        this.range = [-1, -1];
        this.changer = ({ ...param }) => null;
        this.top = 0;
        this.left = 0;
    }
}

const DetailIntentions: React.FC<DetailProps> = ({ data: { row, edit }, fetchData,setViewSelected }) => {
    const classes = useStyles();
    const [waitSave, setWaitSave] = useState(false);
    const [disableSave, setDisableSave] = useState(!row);
    const [disableCreate, setDisableCreate] = useState(true);
    const [selectedRows, setSelectedRows] = useState<Dictionary>({});
    const [dataEntities, setdataEntities] = useState<any>([]);
    const [variableHandler, setVariableHandler] = useState<VariableHandler>(new VariableHandler());
    const [newIntention, setnewIntention] = useState<Dictionary>({
        name: "",
        datajson: {
            text: "",
            traits: [],
            entities: [],        
            intent: {
                name:row?.name || '',
            },
        }
    });
    const [examples, setexamples] = useState<any>([]);
    const mainResult = useSelector(state => state.main.mainAux);
    const mainResultAux = useSelector(state => state.main.mainAux2);
    const executeRes = useSelector(state => state.main.execute);
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const selectionKey= "name"

    const { register, handleSubmit, setValue, getValues, formState: { errors } } = useForm({
        defaultValues: {
            type: 'NINGUNO',
            id: row ? row.id : 0,
            name: row?.name || '',
            description: row?.description || '',
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
    useEffect(() => {
        if(!mainResultAux.loading && !mainResultAux.error){
            setdataEntities(mainResultAux.data.map((e)=>e.datajson.keywords.map((x:any)=>({name: e.name + '.' + x.keyword, entity: e}))).reduce((acc,item)=>[...acc,...item],[]))
        }
    }, [mainResultAux]);

    useEffect(() => {
        if(!mainResult.loading && !mainResult.error){            
            setexamples(mainResult.data);
        }
    }, [mainResult]);

    React.useEffect(() => {
        register('type');
        register('id');
        register('status');
        register('operation');
        register('name', { validate: (value) => (value && value.length) || t(langKeys.field_required) });
        register('description'//, { validate: (value) => (value && value.length) || t(langKeys.field_required) }
        );
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
            let tempexamples = examples
            tempexamples.forEach((e:any)=>delete e.updatedate)
            dispatch(execute(insertutterance({...data, datajson: JSON.stringify({name: ""}), utterance_datajson: JSON.stringify(tempexamples)})));
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
                accessor: 'name',
                NoFilter: true,
                width: "auto",
            },
            {
                Header: t(langKeys.added),
                accessor: 'updatedate',
                NoFilter: true,
                width: "auto",
            },
        ],
        []
    );
    const selectionVariableSelect = (e: React.ChangeEvent<any>, value: string) => {
        const { item, inputkey, inputvalue, range, changer } = variableHandler;
        if (range[1] !== -1 && (range[1] > range[0] || range[0] !== -1)) {
            changer({
                ...item,
                [inputkey]: inputvalue.substring(0, range[0] + 2)
                    + value
                    + (inputvalue[range[1] - 2] !== '}' ? '}}' : '')
                    + inputvalue.substring(range[1] - 2)
            });
            setVariableHandler(new VariableHandler());
        }
    }

    const toggleVariableSelect = (e: React.ChangeEvent<any>, item: any, inputkey: string, changefunc: (data:any) => void, filter = true) => {
        let elem = e.target;
        if (elem) {
            let selectionStart = elem.selectionStart || 0;
            let lines = (elem.value || '').substr(0, selectionStart).split('\n');
            let row = lines.length - 1;
            let column = lines[row].length * 3;
            let startIndex = (elem.value || '').slice(0, selectionStart || 0)?.lastIndexOf('{{');
            let partialText = '';
            if (startIndex !== -1) {
                if (elem.value.slice(startIndex, selectionStart).indexOf(' ') === -1
                    && elem.value.slice(startIndex, selectionStart).indexOf('}}') === -1
                    && elem.value[selectionStart - 1] !== '}') {
                    partialText = elem.value.slice(startIndex + 2, selectionStart);
                    let rightText = (elem.value || '').slice(selectionStart, elem.value.length);
                    let selectionEnd = rightText.indexOf('}}') !== -1 ? rightText.indexOf('}}') : 0;
                    let endIndex = startIndex + partialText.length + selectionEnd + 4;
                    setVariableHandler({
                        show: true,
                        item: item,
                        inputkey: inputkey,
                        inputvalue: elem.value,
                        range: [startIndex, endIndex],
                        changer: ({ ...param }) => changefunc({ ...param }),
                        top: 24 + row * 21,
                        left: column
                    })
                    if (filter) {
                        setdataEntities(filterPipe(mainResultAux.data.map((e)=>e.datajson.keywords.map((x:any)=>({name: e.name + '.' + x.keyword, entity: e}))).reduce((acc,item)=>[...acc,...item],[]), 'name', partialText, '%'));
                    }
                    else {
                        setdataEntities(dataEntities);
                    }
                }else {
                    setVariableHandler(new VariableHandler());
                }
            }
            else {
                setVariableHandler(new VariableHandler());
            }
        }
    }

    return (
        <div style={{width: '100%'}}>
            <form onSubmit={onSubmit}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div>
                        <TitleDetail
                            title={row ? `${row.name}` : t(langKeys.newintention)}
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
                            label={t(langKeys.name)} 
                            disabled={!disableSave}
                            className="col-12"
                            onChange={(value) => {
                                setValue('name', value)
                                setDisableCreate(getValues("description")===""||value==="")
                            }}
                            valueDefault={row?.name || ""}
                            error={errors?.name?.message}
                        />
                        <FieldEdit
                            label={t(langKeys.description)} 
                            disabled={!disableSave}
                            className="col-12"
                            onChange={(value) => {
                                setValue('description', value)
                                setDisableCreate(getValues("name")===""||value==="")
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
                                    let tempint =newIntention
                                    tempint.datajson.intent.name = getValues("name")
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
                        <FieldEditWithSelect
                            label={t(langKeys.adduserexample)}
                            className="col-12"
                            rows={1}
                            valueDefault={newIntention.name}
                            onChange={(value) => setnewIntention({ ...newIntention, name: value })}
                            inputProps={{
                                onClick: (e: any) => toggleVariableSelect(e, newIntention, 'name', setnewIntention),
                                onInput: (e: any) => toggleVariableSelect(e, newIntention, 'name', setnewIntention),
                            }}
                            show={variableHandler.show}
                            data={dataEntities}
                            datakey="name"
                            top={variableHandler.top}
                            left={variableHandler.left}
                            onClickSelection={(e, value) => selectionVariableSelect(e, value)}
                            onClickAway={(variableHandler) => setVariableHandler({ ...variableHandler, show: false })}
                        />
                        <div style={{paddingTop:"8px", paddingBottom:"8px"}}>{t(langKeys.uniqueexamplesuser)}</div>
                        <Button
                            variant="contained"
                            type="button"
                            className='col-3'
                            disabled={newIntention.name===""}
                            color="primary"
                            style={{ backgroundColor: newIntention.name===""?"#dbdbdc":"#0078f6" }}
                            onClick={() => {
                                let holdingpos=0
                                let cleanedstring=""
                                let tempnewintention = newIntention
                                newIntention.name.split("{{").forEach((e:any) => {
                                    if(e.includes("}}")){
                                        let entityfound = dataEntities.filter((x:any)=>x.name===e.split("}}")[0])[0]
                                        tempnewintention.datajson.entities =[...tempnewintention.datajson.entities, 
                                            {
                                                name: entityfound.entity.name,
                                                role: entityfound.entity.name,
                                                body: e.split("}}")[0].split(".")[1], 
                                                start:holdingpos,
                                                end:holdingpos + e.split("}}")[0].split(".")[1].length,
                                                entities:[] 
                                            }
                                        ]
                                        holdingpos+=e.split("}}")[0].split(".")[1].length
                                        cleanedstring+=e.split("}}")[0].split(".")[1]
                                    }else{
                                        holdingpos+=e.length
                                        cleanedstring+=e
                                    }
                                });
                                tempnewintention.name = cleanedstring
                                tempnewintention.datajson.text = cleanedstring
                                setexamples([...examples,tempnewintention]);
                                setnewIntention({
                                    name: "",
                                    datajson: {
                                        text: "",
                                        traits: [],
                                        entities: [],
                                        intent: getValues("name"),
                                    }
                                })      
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

export const Intentions: FC = () => {
    const dispatch = useDispatch();

    const { t } = useTranslation();
    const classes = useStyles();
    const mainResult = useSelector(state => state.main);
    const [selectedRows, setSelectedRows] = useState<any>({});
    const [waitSave, setWaitSave] = useState(false);
    const executeRes = useSelector(state => state.main.execute);
    const [rowSelected, setRowSelected] = useState<RowSelected>({ row: null, edit: false });

    const [viewSelected, setViewSelected] = useState("view-1");

    const fetchData = () => {dispatch(getCollection(selIntent()))};
    const selectionKey = 'name';
    
    useEffect(() => {
        fetchData();
        dispatch(getCollectionAux2(selEntities()))
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
                            {row.name}
                        </label>
                    )
                }
                
            },
            {
                Header: t(langKeys.description),
                accessor: 'description',
                width: "auto",
                NoFilter: true,
            },
            {
                Header: "ID",
                accessor: 'id',
                width: "auto",
                NoFilter: true,
            },
            {
                Header: t(langKeys.examples),
                accessor: 'utteranceqty',
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
        dispatch(getCollectionAux(selUtterance("")))    
        setViewSelected("view-2");
        setRowSelected({ row: null, edit: true })
    }
    const handleDelete = () => {
        const callback = () => {
            dispatch(execute(utterancedelete({table:JSON.stringify(Object.keys(selectedRows).map(x=>({name:x})))})))
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