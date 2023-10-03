/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import ClearIcon from '@material-ui/icons/Clear';
import SaveIcon from '@material-ui/icons/Save';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import { useSelector } from 'hooks';
import { useDispatch } from 'react-redux';
import { TemplateBreadcrumbs, TitleDetail, AntTab, AntTabPanel } from 'components';
import { Dictionary } from "@types";
import { Trans, useTranslation } from 'react-i18next';
import { langKeys } from 'lang/keys';
import { useForm } from 'react-hook-form';
import { execute, getCollectionAux, resetMainAux } from 'store/main/actions';
import { showSnackbar, showBackdrop, manageConfirmation } from 'store/popus/actions';
import { Tabs } from '@material-ui/core';
import PartnersTabDetail from './detailTabs/PartnersTabDetail';
import ClientsTabDetail from './detailTabs/ClientsTabDetail';
import { customerByPartnerSel, partnerIns } from 'common/helpers';


interface RowSelected {
    row: Dictionary | null;
    edit: boolean;
}

interface DetailProps {
    data: RowSelected;
    setViewSelected: (view: string) => void;
    fetchData: any;
}


const useStyles = makeStyles((theme) => ({
    containerDetail: {
        // marginTop: theme.spacing(2),
        // marginRight: theme.spacing(2),
        // padding: theme.spacing(2),
        // background: '#fff',
        width: '100%'
    },
    button: {
        marginRight: theme.spacing(2),
    },
    containerHeader: {
        padding: theme.spacing(1),
    },
    itemDate: {
        minHeight: 40,
        height: 40,
        border: '1px solid #bfbfc0',
        borderRadius: 4,
        color: 'rgb(143, 146, 161)'
    },
    tabs: {
        color: '#989898',
        backgroundColor: 'white',
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        width: 'inherit',
    },
}));

const PartnersDetail: React.FC<DetailProps> = ({ data: { row, edit }, setViewSelected, fetchData }) => {
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
    
    const { register, handleSubmit, setValue, trigger, getValues, formState: { errors } } = useForm({
        defaultValues: {
            id: row ? row.id : 0,
            country: row?.country || '',
            billingcurrency: row?.billingcurrency || '',
            documenttype: row?.documenttype || '',
            documentnumber: row?.documentnumber || '',
            company: row?.company || '',
            address: row?.address || '',
            billingcontact: row?.billingcontact || '',
            email: row?.email || '',
            signaturedate: new Date(row?.signaturedate || null).toISOString().split('T')[0],
            enterprisepartner: row?.isEnterprise || false,
            billingplan: row?.billingplan || '',
            typecalculation: row?.typecalculation || '',            
            numbercontactsbag: row?.numbercontactsbag || 0,
            puadditionalcontacts: row?.puadditionalcontacts || 0,
            priceperbag: row?.priceperbag || 0,
            automaticgenerationdrafts: row?.automaticgenerationdrafts || false,
            automaticperiodgeneration: row?.automaticperiodgeneration || false,
            status: row?.status || '',
            type: row?.type || '',
            operation: row ? "UPDATE" : "INSERT",
        }
    });

    const fetchCustomerByPartner = () => {
        dispatch(getCollectionAux(customerByPartnerSel(row?.partnerid)));
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
        register('country');
        register('billingcurrency');
        register('documenttype');
        register('documentnumber')
        register('company', { validate: (value) => (value && value.length) || t(langKeys.field_required) });
        register('address');
        register('billingcontact');
        register('email');
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
            if (getValues('operation') === 'INSERT') {
                dispatch(execute(partnerIns(data)));
            } else {
                dispatch(execute(partnerIns({...data, id: row?.partnerid})));
            }
            setWaitSave(true);
        }
        dispatch(manageConfirmation({
            visible: true,
            question: t(langKeys.confirmation_save),
            callback
        }))
    });

    return (
        <>
            <form onSubmit={onMainSubmit} style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div>
                        <TemplateBreadcrumbs
                            breadcrumbs={arrayBread}
                            handleClick={(view) => {
                                setViewSelected(view);
                            }}
                        />
                    </div>
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                        <Button
                            variant="contained"
                            type="button"
                            color="primary"
                            startIcon={<ClearIcon color="secondary" />}
                            style={{ backgroundColor: "#FB5F5F" }}
                            onClick={() => {
                                setViewSelected("main-view")
                            }}
                        >{t(langKeys.back)}</Button>
                        <Button
                            className={classes.button}
                            variant="contained"
                            color="primary"
                            type="submit"
                            startIcon={<SaveIcon color="secondary" />}
                            style={{ backgroundColor: "#55BD84" }}>
                            {t(langKeys.save)}
                        </Button>
                    </div>

                </div>
                <Tabs
                    value={tabIndex}
                    onChange={(_:any, i:any) => setTabIndex(i)}
                    className={classes.tabs}
                    textColor="primary"
                    indicatorColor="primary"
                    variant="fullWidth"
                >
                    <AntTab
                        label={(
                            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                                <Trans i18nKey={langKeys.generalinformation} />
                            </div>
                        )}
                    />
                    {!!row && (
                        <AntTab
                        label={(
                            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                                <Trans i18nKey={langKeys.clients}/>
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
                <AntTabPanel index={1} currentIndex={tabIndex}>
                    <ClientsTabDetail fetchdata={fetchCustomerByPartner} errors={errors} row={row}/>
                </AntTabPanel>
            </form>
        </>
    );
}


export default PartnersDetail;

function handleMainSubmit(arg0: (data: any) => void) {
    throw new Error('Function not implemented.');
}
