/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react'; // we need this to make JSX compile
import { useDispatch } from 'react-redux';
// import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import { TemplateBreadcrumbs, TitleDetail } from 'components';
import { Dictionary, ICampaign, MultiData } from "@types";
import TableZyx from '../../components/fields/table-simple';
import { makeStyles } from '@material-ui/core/styles';
import { useTranslation, Trans } from 'react-i18next';
import { langKeys } from 'lang/keys';
import { useForm } from 'react-hook-form';

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

export const CampaignPerson: React.FC<DetailProps> = ({ row, edit, auxdata, detaildata, setDetailData, setViewSelected, setStep, multiData, fetchData }) => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const { t } = useTranslation();

    const [personData, setPersonData] = useState([]);
    const [loadingPerson, setLoadingPerson] = useState(false);

    const columns = React.useMemo(
        () => [],
        []
    )

    useEffect(() => {
        if (detaildata.source === 'INTERNAL') {
            // dispatch(getPersonSel());
        }
        else if (detaildata.source === 'EXTERNAL') {
        }
    }, [detaildata])

    const AdditionalButtons = () => {
        return (
            <React.Fragment>
                <Button
                    className={classes.button}
                    variant="contained"
                    color="primary"
                    // startIcon={<AddIcon color="secondary" />}
                    onClick={() => console.log('blacklist')}
                    style={{ backgroundColor: "#ea2e49" }}
                ><Trans i18nKey={langKeys.uploadFile} />
                </Button>
                <Button
                    className={classes.button}
                    variant="contained"
                    color="primary"
                    // startIcon={<AddIcon color="secondary" />}
                    onClick={() => console.log('report')}
                    style={{ backgroundColor: "#22b66e" }}
                ><Trans i18nKey={langKeys.clean} />
                </Button>
            </React.Fragment>
        )
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
                        title={row ? `${row.name}` : t(langKeys.person_plural)}
                    />
                </div>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <Button
                        variant="contained"
                        type="button"
                        color="primary"
                        // startIcon={<ClearIcon color="secondary" />}
                        style={{ backgroundColor: "#FB5F5F" }}
                        onClick={() => setViewSelected("view-1")}
                    >{t(langKeys.cancel)}</Button>
                    {edit &&
                        <Button
                            className={classes.button}
                            variant="contained"
                            color="primary"
                            type="button"
                            // startIcon={<SaveIcon color="secondary" />}
                            style={{ backgroundColor: "#53a6fa" }}
                            onClick={() => setStep("step-1")}
                        >{t(langKeys.back)}
                        </Button>
                    }
                    {edit &&
                        <Button
                            className={classes.button}
                            variant="contained"
                            color="primary"
                            type="button"
                            // startIcon={<SaveIcon color="secondary" />}
                            style={{ backgroundColor: "#55BD84" }}
                            onClick={() => setStep("step-3")}
                        >{t(langKeys.next)}
                        </Button>
                    }
                </div>
            </div>
            <div className={classes.containerDetail}>
                <TableZyx
                    columns={columns}
                    data={personData}
                    loading={loadingPerson}
                    download={false}
                    filterGeneral={false}
                    ButtonsElement={AdditionalButtons}
                />
            </div>
        </React.Fragment>
    )
}