/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react'; // we need this to make JSX compile
import { useDispatch } from 'react-redux';
// import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import { FieldEdit, FieldEditMulti, FieldView, TemplateBreadcrumbs, TitleDetail } from 'components';
import { Dictionary, ICampaign, MultiData } from "@types";
import { makeStyles } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';
import { langKeys } from 'lang/keys';
import { execute } from 'store/main/actions';
import { extractVariables, filterPipe, insCampaign } from 'common/helpers';
import { manageConfirmation, showBackdrop, showSnackbar } from 'store/popus/actions';
import { useSelector } from 'hooks';


interface DetailProps {
    row: Dictionary | null,
    edit: boolean,
    auxdata: Dictionary;
    detaildata: ICampaign;
    setDetailData: (data: any) => void;
    setViewSelected: (view: string) => void;
    step: string,
    setStep: (step: string) => void;
    multiData: MultiData[];
    fetchData: () => void
}

const arrayBread = [
    { id: "view-1", name: "Campaign" },
    { id: "view-2", name: "Campaign detail" }
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
    flexgrow1: {
        flexGrow: 1
    }
}));

export const CampaignMessage: React.FC<DetailProps> = ({ row, edit, auxdata, detaildata, setDetailData, setViewSelected, step, setStep, multiData, fetchData }) => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const executeRes = useSelector(state => state.main.execute);
    // const auxResult = useSelector(state => state.main.mainAux);

    const [waitSave, setWaitSave] = useState(false);
    const [tablevariable, setTableVariable] = useState<any[]>([]);
    const [tablevariableShow, setTableVariableShow] = useState<any[]>([]);

    const [actualid, setActualId] = useState<string>('');
    const [showTableVariable, setShowTableVariable] = useState(false);

    useEffect(() => {
        if (detaildata.operation === 'INSERT' && detaildata.source === 'INTERNAL') {
            setTableVariable([
                { "description": "personcommunicationchannelowner", "persistent": false },
                { "description": "name", "persistent": false },
                { "description": "personcommunicationchannel", "persistent": false },
                { "description": "type", "persistent": false },
                { "description": "phone", "persistent": false },
                { "description": "email", "persistent": false },
            ]);
        }
        else if (detaildata.source === 'EXTERNAL') {
            setTableVariable(detaildata.selectedColumns?.columns.reduce((ac: any, c: string) => {
                ac.push({description: c, persistent: false})
                return ac;
            }, []));
        }
        else {
            setTableVariable([
                {"description":"corpid","persistent":true}, 
                {"description":"orgid","persistent":true}, 
                {"description":"campaignmemberid","persistent":true}, 
                {"description":"campaignid","persistent":true}, 
                {"description":"personid","persistent":true}, 
                {"description":"status","persistent":true}, 
                {"description":"globalid","persistent":true}, 
                {"description":"personcommunicationchannel","persistent":true}, 
                {"description":"type","persistent":true}, 
                {"description":"displayname","persistent":true}, 
                {"description":"personcommunicationchannelowner","persistent":true}, 
                {"description":"field1","persistent":true}, 
                {"description":"field2","persistent":true}, 
                {"description":"field3","persistent":true}, 
                {"description":"field4","persistent":true}, 
                {"description":"field5","persistent":true}, 
                {"description":"field6","persistent":true}, 
                {"description":"field7","persistent":true}, 
                {"description":"field8","persistent":true}, 
                {"description":"field9","persistent":true}, 
                {"description":"field10","persistent":true}, 
                {"description":"field11","persistent":true}, 
                {"description":"field12","persistent":true}, 
                {"description":"field13","persistent":true}, 
                {"description":"field14","persistent":true}, 
                {"description":"field15","persistent":true}, 
                {"description":"resultfromsend","persistent":true}, 
                {"description":"batchindex","persistent":true}
            ]);
        }
    }, [step])

    useEffect(() => {
        if (waitSave) {
            if (!executeRes.loading && !executeRes.error) {
                dispatch(showSnackbar({ show: true, success: true, message: t(row ? langKeys.successful_edit : langKeys.successful_register) }))
                fetchData();
                dispatch(showBackdrop(false));
                setViewSelected("view-1")
            } else if (executeRes.error) {
                const errormessage = t(executeRes.code || "error_unexpected_error", { module: t(langKeys.integrationmanager).toLocaleLowerCase() })
                dispatch(showSnackbar({ show: true, success: false, message: errormessage }))
                dispatch(showBackdrop(false));
                setWaitSave(false);
            }
        }
    }, [executeRes, waitSave])

    const checkValidity = () => {
        if (detaildata.messagetemplateheader?.type === 'text'
        && detaildata.messagetemplateheader?.value === '') {
            return { success: false, message: 'NANO__Falta encabezado' }
        }
        let elemVariables = [];
        let errorIndex = null;
        if (detaildata.communicationchanneltype === 'MAIL') {
            elemVariables = extractVariables(detaildata.subject || '');
            errorIndex = elemVariables.findIndex(v => !(v.includes('field') || tablevariable.map(t => t.description).includes(v)))
            if (!errorIndex) {
                return { success: false, message: `NANO__Parámetro inválido ${elemVariables[errorIndex]}` }
            }
        }
        if ((detaildata.messagetemplateheader?.value || '') !== '') {
            elemVariables = extractVariables(detaildata.messagetemplateheader?.value || '')
            errorIndex = elemVariables.findIndex(v => !(v.includes('field') || tablevariable.map(t => t.description).includes(v)))
            if (!errorIndex) {
                return { success: false, message: `NANO__Parámetro inválido ${elemVariables[errorIndex]}` }
            }
        }
        if ((detaildata.message || '') !== '') {
            elemVariables = extractVariables(detaildata.message || '')
            errorIndex = elemVariables.findIndex(v => !(v.includes('field') || tablevariable.map(t => t.description).includes(v)))
            if (!errorIndex) {
                return { success: false, message: `NANO__Parámetro inválido ${elemVariables[errorIndex]}` }
            }
        }
    }

    const onSubmit = () => {
        // checkValidity();
        const callback = () => {
            dispatch(execute(insCampaign(detaildata)));
            dispatch(showBackdrop(true));
            setWaitSave(true)
        }

        dispatch(manageConfirmation({
            visible: true,
            question: t(langKeys.confirmation_save),
            callback
        }))
    };

    const toggleVariableSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        let elem = e.target;
        setActualId(elem.id);
        if (elem) {
            let selectionStart = elem.selectionStart || 0;
            let startIndex = elem.value.slice(0, selectionStart || 0).lastIndexOf('{{');
            let partialText = '';
            if (startIndex !== -1) {
                if (elem.value.slice(startIndex, selectionStart).indexOf(' ') === -1
                && elem.value.slice(startIndex, selectionStart).indexOf('}}') === -1) {
                    setShowTableVariable(true);
                    partialText = elem.value.slice(startIndex + 2, selectionStart);
                    setTableVariableShow(filterPipe(tablevariable, 'description', partialText));
                }
            }
        }
    }
    
    return (
        <React.Fragment>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div>
                    <TemplateBreadcrumbs
                        breadcrumbs={arrayBread}
                        handleClick={setViewSelected}
                    />
                    <TitleDetail
                        title={row ? `${row.title}` : t(langKeys.newcampaign)}
                    />
                </div>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <Button
                        variant="contained"
                        type="button"
                        color="primary"
                        style={{ backgroundColor: "#FB5F5F" }}
                        onClick={() => setViewSelected("view-1")}
                    >{t(langKeys.cancel)}</Button>
                    {edit &&
                        <Button
                            className={classes.button}
                            variant="contained"
                            color="primary"
                            type="button"
                            style={{ backgroundColor: "#53a6fa" }}
                            onClick={() => setStep("step-2")}
                        >{t(langKeys.back)}
                        </Button>
                    }
                    {edit &&
                        <Button
                            className={classes.button}
                            variant="contained"
                            color="primary"
                            type="button"
                            style={{ backgroundColor: "#55BD84" }}
                            onClick={() => {
                                console.log(detaildata);
                                onSubmit();
                            }}
                        >{t(langKeys.next)}
                        </Button>
                    }
                </div>
            </div>
            <div className={classes.containerDetail}>
                {detaildata.communicationchanneltype === 'MAIL' ?
                <div className="row-zyx">
                    {edit ?
                        <FieldEdit
                            label={t(langKeys.title)}
                            className="col-12"
                            valueDefault={detaildata.subject || ''}
                            onChange={(value) => setDetailData({...detaildata, subject: value})}
                        />
                        :
                        <FieldView
                            label={t(langKeys.title)}
                            value={detaildata.subject || ''}
                            className="col-12"
                        />
                    }
                </div> : null}
                {(detaildata.messagetemplateheader?.type || '') !== '' ?
                <div className="row-zyx">
                    {edit ?
                        <FieldEdit
                            label={t(langKeys.header)}
                            className="col-12"
                            valueDefault={detaildata.messagetemplateheader?.value || ''}
                            onChange={(value) => setDetailData({
                                ...detaildata, 
                                messagetemplateheader: {...detaildata.messagetemplateheader, value: value}
                            })}
                        />
                        :
                        <FieldView
                            label={t(langKeys.title)}
                            value={detaildata.messagetemplateheader?.value || ''}
                            className="col-12"
                        />
                    }
                </div> : null}
                <div className="row-zyx">
                    {edit ?
                        <FieldEditMulti
                            primitive={true}
                            label={t(langKeys.message)}
                            className="col-12"
                            valueDefault={detaildata.message || ''}
                            onChange={(e) => {
                                setDetailData({
                                    ...detaildata, 
                                    message: e.target.value
                                });
                                toggleVariableSelect(e)
                            }}
                        />
                        :
                        <FieldView
                            label={t(langKeys.title)}
                            value={detaildata.messagetemplateheader?.value || ''}
                            className="col-12"
                        />
                    }
                </div>
            </div>
        </React.Fragment>
    )
}