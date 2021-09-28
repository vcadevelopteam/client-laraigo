/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react'; // we need this to make JSX compile
import { useSelector } from 'hooks';
import { useDispatch } from 'react-redux';
import { getCampaignSel } from 'common/helpers';
import { Dictionary, ICampaign, MultiData } from "@types";
import { getCollectionAux, resetMainAux } from 'store/main/actions';
import { CampaignGeneral, CampaignPerson, CampaignMessage } from 'pages';
import { showBackdrop } from 'store/popus/actions';
import { TemplateBreadcrumbs, TitleDetail, FieldView, FieldEdit, FieldSelect, DialogZyx, FieldEditArray } from 'components';
import { makeStyles } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';
import { langKeys } from 'lang/keys';

interface RowSelected {
    row: Dictionary | null,
    edit: boolean
}

interface DetailProps {
    setViewSelected: (view: string) => void;
}

const arrayBread = [
    { id: "view-1", name: "Campaign" },
    { id: "view-2", name: "Campaign report" }
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

export const CampaignReport: React.FC<DetailProps> = ({ setViewSelected }) => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const auxResult = useSelector(state => state.main.mainAux);
    
    return (
        <div style={{ width: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div>
                    <TemplateBreadcrumbs
                        breadcrumbs={arrayBread}
                        handleClick={setViewSelected}
                    />
                    <TitleDetail
                        title={t(langKeys.newcampaign)}
                    />
                </div>
                {/* <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
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
                            style={{ backgroundColor: "#55BD84" }}
                            onClick={() => onSubmit()}
                        >{t(langKeys.next)}
                        </Button>
                    }
                </div> */}
            </div>
            <div className={classes.containerDetail}>

            </div>
        </div>
    )
}