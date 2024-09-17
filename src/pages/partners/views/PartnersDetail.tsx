import React, { ChangeEvent, useEffect, useState } from 'react';
import ClearIcon from '@material-ui/icons/Clear';
import SaveIcon from '@material-ui/icons/Save';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import { useSelector } from 'hooks';
import { useDispatch } from 'react-redux';
import { TemplateBreadcrumbs, AntTab, AntTabPanel } from 'components';
import { Dictionary } from "@types";
import { Trans, useTranslation } from 'react-i18next';
import { langKeys } from 'lang/keys';
import { useForm } from 'react-hook-form';
import { execute, getCollectionAux } from 'store/main/actions';
import { showSnackbar, showBackdrop, manageConfirmation } from 'store/popus/actions';
import { Tabs } from '@material-ui/core';
import PartnersTabDetail from './detailTabs/PartnersTabDetail';
import ClientsTabDetail from './detailTabs/ClientsTabDetail';
import { customerByPartnerSel, partnerIns } from 'common/helpers';
import { format, parse } from 'date-fns';


interface RowSelected {
    row: Dictionary | null;
    edit: boolean;
}

interface DetailProps {
    data: RowSelected;
    setViewSelected: (view: string) => void;
    fetchData: () => void;
}


const useStyles = makeStyles((theme) => ({
    button: {
        marginRight: theme.spacing(2),
        backgroundColor: "#55BD84"
    },
    tabs: {
        color: '#989898',
        backgroundColor: 'white',
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        width: 'inherit',
    },
    mainComponent: {
        display: 'flex',
        flexDirection: 'column',
        width: '100%'
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between'
    },
    headerButtons: {
        display: 'flex',
        gap: '10px',
        alignItems: 'center'
    },
    tab: {
        display: 'flex',
        gap: 8,
        alignItems: 'center'
    }
}));

const PartnersDetail: React.FC<DetailProps> = ({ data: { row }, setViewSelected, fetchData }) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const [tabIndex, setTabIndex] = useState(0);
    const [waitSave, setWaitSave] = useState(false);
    const executeRes = useSelector(state => state.main.execute);
    const classes = useStyles();

    const arrayBread = [
        { id: "main-view", name: t(langKeys.partner) },
        { id: "detail-view", name: `${t(langKeys.partner)} ${t(langKeys.detail)}` },
    ];

    const emailRequired = (value: string) => {
        if (value.length === 0) {
            return t(langKeys.field_required) as string;
        } else if (!/\S+@\S+\.\S+/.test(value)) {
            return t(langKeys.emailverification) as string;
        }
    }
    
    const { register, handleSubmit, setValue, getValues, formState: { errors } } = useForm({
        defaultValues: {
            id: row ? row.partnerid : 0,
            country: row?.country || '',
            billingcurrency: row?.billingcurrency || '',
            documenttype: row?.documenttype || '',
            documentnumber: row?.documentnumber || '',
            company: row?.company || '',
            address: row?.address || '',
            billingcontact: row?.billingcontact || '',
            email: row?.email || '',
            signaturedate: row?.signaturedate
            ? format(parse(row.signaturedate, 'dd/MM/yyyy HH:mm:ss', new Date()), 'yyyy-MM-dd') + ' 19:00:00'
            : format(new Date(), 'yyyy-MM-dd') + ' 19:00:00',
            enterprisepartner: row?.enterprisepartner || false,
            billingplan: row?.billingplan || '',
            typecalculation: row?.typecalculation || '',            
            numbercontactsbag: row?.numbercontactsbag || 0,
            puadditionalcontacts: row?.puadditionalcontacts || '0',
            priceperbag: row?.priceperbag || '0',
            automaticgenerationdrafts: row?.automaticgenerationdrafts || false,
            automaticperiodgeneration: row?.automaticperiodgeneration || false,
            montlyplancost: row?.montlyplancost || 0,
            numberplancontacts: row?.numberplancontacts || 0,
            status: row?.status || 'ACTIVO',
            type: row?.type || '',
            operation: row ? "UPDATE" : "INSERT",
        }
    });

    const fetchCustomerByPartner = () => {
        dispatch(getCollectionAux(customerByPartnerSel(row?.partnerid || 0)));
    }

    useEffect(() => {
        if (waitSave) {
            if (!executeRes.loading && !executeRes.error) {
                dispatch(showSnackbar({ show: true, severity: "success", message: t(row ? langKeys.successful_edit : langKeys.successful_register) }))
                fetchCustomerByPartner();
                fetchData();
                dispatch(showBackdrop(false));
                setViewSelected("main-view");
            } else if (executeRes.error) {
                const errormessage = t(executeRes.code || "error_unexpected_error", { module: t(langKeys.product).toLocaleLowerCase() })
                dispatch(showSnackbar({ show: true, severity: "error", message: errormessage }))
                setWaitSave(false);
                dispatch(showBackdrop(false));
            }
        }
    }, [executeRes, waitSave])

    React.useEffect(() => {
        register('id');
        register('country', { validate: (value) => (value && value.length) || t(langKeys.field_required) });
        register('billingcurrency', { validate: (value) => (value && value.length) || t(langKeys.field_required) });
        register('documenttype', { validate: (value) => (value && value.length) || t(langKeys.field_required) });
        register('documentnumber', { validate: (value) => (value && value.length) || t(langKeys.field_required) })
        register('company', { validate: (value) => (value && value.length) || t(langKeys.field_required) });
        register('address', { validate: (value) => (value && value.length) || t(langKeys.field_required) });
        register('billingcontact', { validate: (value) => (value && value.length) || t(langKeys.field_required) });
        register('email', { validate: emailRequired, value: '' });
        register('signaturedate');
        register('enterprisepartner');
        register('billingplan');
        register('typecalculation')
        register('numbercontactsbag');
        register('puadditionalcontacts');
        register('priceperbag');
        register('automaticgenerationdrafts');
        register('automaticperiodgeneration');
        register('status');
        register('type');
        register('operation');
    }, [register, setValue]);

    const onMainSubmit = handleSubmit((data) => {
        const callback = () => {
            dispatch(showBackdrop(true));

            const pricePerBagValue = String(getValues('priceperbag'));
            const additionalContactsValue = String(getValues('puadditionalcontacts'));

            if (getValues('operation') === 'INSERT') {
                if (getValues('typecalculation') === 'Por bolsa') {
                    if (pricePerBagValue.split('.').length === 1) {
                        dispatch(execute(partnerIns({...data, priceperbag: pricePerBagValue + '.00'})));
                    } else {
                        dispatch(execute(partnerIns(data)));
                    }
                } else {
                    if (additionalContactsValue.split('.').length === 1) {
                        dispatch(execute(partnerIns({...data, puadditionalcontacts: additionalContactsValue + '.00'})));
                    } else {
                        dispatch(execute(partnerIns(data)));
                    }
                }
            } else {
                if (getValues('typecalculation') === 'Por bolsa') {
                    if (pricePerBagValue.split('.').length === 1) {
                        dispatch(execute(partnerIns({...data, id: row?.partnerid, priceperbag: pricePerBagValue + '.00'})));
                    } else {
                        dispatch(execute(partnerIns(data)));
                    }
                } else {
                    if (additionalContactsValue.split('.').length === 1) {
                        dispatch(execute(partnerIns({...data, id: row?.partnerid, puadditionalcontacts: additionalContactsValue + '.00'})));
                    } else {
                        dispatch(execute(partnerIns({...data, id: row?.partnerid})));
                    }
                }
            }
            setWaitSave(true);
        };

        dispatch(manageConfirmation({
            visible: true,
            question: t(langKeys.confirmation_save),
            callback
        }));
    });


    const handleChangeTab = (event: ChangeEvent<NonNullable<unknown>>, newIndex: number) => {
        setTabIndex(newIndex);
    };

    return (
        <>
            <form onSubmit={onMainSubmit} className={classes.mainComponent}>
                <div className={classes.header}>
                    <div>
                        <TemplateBreadcrumbs
                            breadcrumbs={arrayBread}
                            handleClick={(view) => {
                                setViewSelected(view);
                            }}
                        />
                    </div>
                    <div className={classes.headerButtons}>
                        <Button
                            variant="contained"
                            type="button"
                            color="primary"
                            startIcon={<ClearIcon color="secondary" />}
                            style={{ backgroundColor: "#FB5F5F" }}
                            onClick={() => setViewSelected("main-view")}
                        >{t(langKeys.back)}</Button>
                        <Button
                            className={classes.button}
                            variant="contained"
                            color="primary"
                            type="submit"
                            startIcon={<SaveIcon color="secondary" />} >
                            {t(langKeys.save)}
                        </Button>
                    </div>
                </div>
                <Tabs
                    value={tabIndex}
                    onChange={handleChangeTab}
                    className={classes.tabs}
                    textColor="primary"
                    indicatorColor="primary"
                    variant="fullWidth"
                >
                    <AntTab
                        label={(
                            <div className={classes.tab}>
                                <Trans i18nKey={langKeys.generalinformation} />
                            </div>
                        )}
                    />
                    {row && (
                        <AntTab
                            label={(
                                <div className={classes.tab}>
                                    <Trans i18nKey={langKeys.clients} />
                                </div>
                            )}
                        />
                    )}
                </Tabs>
                <AntTabPanel index={0} currentIndex={tabIndex}>
                    <PartnersTabDetail
                        row={row}
                        setValue={setValue}
                        getValues={getValues}
                        errors={errors}
                    />
                </AntTabPanel>
                {row && (
                    <AntTabPanel index={1} currentIndex={tabIndex}>
                        <ClientsTabDetail fetchdata={fetchCustomerByPartner} row={row} />
                    </AntTabPanel>
                )}
            </form>
        </>
    );

}


export default PartnersDetail;
