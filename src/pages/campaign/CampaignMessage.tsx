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
import { insCampaign } from 'common/helpers';
import { manageConfirmation, showBackdrop, showSnackbar } from 'store/popus/actions';
import { useSelector } from 'hooks';


interface DetailProps {
    row: Dictionary | null,
    edit: boolean,
    auxdata: Dictionary;
    detaildata: ICampaign;
    setDetailData: (data: any) => void;
    setViewSelected: (view: string) => void;
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

export const CampaignMessage: React.FC<DetailProps> = ({ row, edit, auxdata, detaildata, setDetailData, setViewSelected, setStep, multiData, fetchData }) => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const executeRes = useSelector(state => state.main.execute);
    // const auxResult = useSelector(state => state.main.mainAux);

    const [waitSave, setWaitSave] = useState(false);

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

    const onSubmit = () => {
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
    
    return (
        <React.Fragment>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div>
                    <TemplateBreadcrumbs
                        breadcrumbs={arrayBread}
                        handleClick={setViewSelected}
                    />
                    <TitleDetail
                        title={row ? `${row.name}` : t(langKeys.message)}
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
                            label={t(langKeys.message)}
                            className="col-12"
                            valueDefault={detaildata.message || ''}
                            onChange={(value) => setDetailData({
                                ...detaildata, 
                                message: value
                            })}
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