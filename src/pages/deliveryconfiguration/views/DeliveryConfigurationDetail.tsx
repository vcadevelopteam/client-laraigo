import React, { useEffect, useState } from 'react';
import ClearIcon from '@material-ui/icons/Clear';
import SaveIcon from '@material-ui/icons/Save';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import { useSelector } from 'hooks';
import { useDispatch } from 'react-redux';
import { TemplateBreadcrumbs, TitleDetail } from 'components';
import { useTranslation } from 'react-i18next';
import { langKeys } from 'lang/keys';
import { showSnackbar, showBackdrop, manageConfirmation } from 'store/popus/actions';
import DeliveryConfigurationTabDetail from './detailTabs/DeliveryConfigurationTabDetail';
import { getCollection, getCollectionAux } from 'store/main/actions';
import VehicleTypeDialog from '../dialogs/VehicleTypeDialog';
import NonWorkingDaysDialog from '../dialogs/NonWorkingDaysDialog';
import DeliverySchedulesDialog from '../dialogs/DeliverySchedulesDialog';
import DeliveryPhotoDialog from '../dialogs/DeliveryPhotoDialog';
import NonWorkingDaysCopyDialog from '../dialogs/NonWorkingDaysDialog copy';
import { deliveryConfigurationIns, deliveryConfigurationSel, deliveryVehicleSel } from 'common/helpers';
import { execute } from "store/main/actions";

const useStyles = makeStyles(() => ({      
    corporationNameAndButtons: {
        display: 'flex', 
        justifyContent: 'space-between',
        gap: '10px', 
        alignItems: 'center', 
    },
}));

interface ConfigJson {
    automaticA: boolean;
    manualA: boolean;
    predefinedA: boolean;
    inmediateA: boolean;
    invoiceD: boolean;
    shareInvoiceD: boolean;
    guideD: boolean;
    wspI: boolean;
    emailI: boolean;
    sendScheduleN: boolean;
    sendDispatchN: boolean;
    smsN: boolean;
    wspN: boolean;
    emailN: boolean;
    routingLogic: boolean;
    insuredLimitR: boolean;
    capacityR: boolean;
    monday: boolean;
    tuesday: boolean;
    wednesday: boolean;
    thursday: boolean;
    friday: boolean;
    saturday: boolean;
    sunday: boolean;
    validationDistance: null | number;
    deliveryphoto: boolean;
    morningStartTime: string | null;
    morningEndTime: string | null;
    afternoonStartTime: string | null;
    afternoonEndTime: string | null;
    nightStartTime: string | null;
    nightEndTime: string | null;
}

const DeliveryConfigurationDetail: React.FC = () => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const [waitSave, setWaitSave] = useState(false);
    const [waitSave2, setWaitSave2] = useState(false);
    const executeRes = useSelector(state => state.main.execute);
    const classes = useStyles();
    const [openModalNonWorkingDays, setOpenModalNonWorkingDays] = useState(false)
    const [openModalNonWorkingDaysCopy, setOpenModalNonWorkingDaysCopy] = useState(false)
    const [openModalVehicleType, setOpenModalVehicleType] = useState(false)
    const [openModalDeliverySchedules, setOpenModalDeliverySchedules] = useState(false)
    const [openModalDeliverPhoto, setOpenModalDeliverPhoto] = useState(false)
    const main = useSelector((state) => state.main.mainData);
    const [configjson, setConfigjson] = useState<ConfigJson>({
        automaticA: false,
        manualA: false,
        predefinedA: false,
        inmediateA: false,
        invoiceD: false,
        shareInvoiceD: false,
        guideD: false,
        wspI: false,
        emailI: false,
        sendScheduleN: false,
        sendDispatchN: false,
        smsN: false,
        wspN: false,
        emailN: false,
        routingLogic: false,
        insuredLimitR: false,
        capacityR: false,
        monday: false,
        tuesday: false,
        wednesday: false,
        thursday: false,
        friday: false,
        saturday: false,
        sunday: false,
        validationDistance: null,
        deliveryphoto: false,
        morningStartTime: null,
        morningEndTime: null,
        afternoonStartTime: null,
        afternoonEndTime: null,
        nightStartTime: null,
        nightEndTime: null,
    })

    const fetchOriginalConfig = () => {
        if(main.data.length) {
            setConfigjson({
                automaticA: main?.data?.[0]?.config?.automaticA,
                manualA: main?.data?.[0]?.config?.manualA,
                predefinedA: main?.data?.[0]?.config?.predefinedA,
                inmediateA: main?.data?.[0]?.config?.inmediateA,
                invoiceD: main?.data?.[0]?.config?.invoiceD,
                shareInvoiceD: main?.data?.[0]?.config?.shareInvoiceD,
                guideD: main?.data?.[0]?.config?.guideD,
                wspI: main?.data?.[0]?.config?.wspI,
                emailI: main?.data?.[0]?.config?.emailI,
                sendScheduleN: main?.data?.[0]?.config?.sendScheduleN,
                sendDispatchN: main?.data?.[0]?.config?.sendDispatchN,
                smsN: main?.data?.[0]?.config?.smsN,
                wspN: main?.data?.[0]?.config?.wspN,
                emailN: main?.data?.[0]?.config?.emailN,
                routingLogic: main?.data?.[0]?.config?.routingLogic,
                insuredLimitR: main?.data?.[0]?.config?.insuredLimitR,
                capacityR: main?.data?.[0]?.config?.capacityR,
                monday: main?.data?.[0]?.config?.monday,
                tuesday: main?.data?.[0]?.config?.tuesday,
                wednesday: main?.data?.[0]?.config?.wednesday,
                thursday: main?.data?.[0]?.config?.thursday,
                friday: main?.data?.[0]?.config?.friday,
                saturday: main?.data?.[0]?.config?.saturday,
                sunday: main?.data?.[0]?.config?.sunday,
                validationDistance: main?.data?.[0]?.config?.validationDistance,
                deliveryphoto: main?.data?.[0]?.config?.deliveryphoto,
                morningStartTime: main?.data?.[0]?.config?.morningStartTime,
                morningEndTime: main?.data?.[0]?.config?.morningEndTime,
                afternoonStartTime: main?.data?.[0]?.config?.afternoonStartTime,
                afternoonEndTime: main?.data?.[0]?.config?.afternoonEndTime,
                nightStartTime: main?.data?.[0]?.config?.nightStartTime,
                nightEndTime: main?.data?.[0]?.config?.nightEndTime,
            })
        } else {
            setConfigjson({
                automaticA: false,
                manualA: false,
                predefinedA: false,
                inmediateA: true,
                invoiceD: true,
                shareInvoiceD: true,
                guideD: true,
                wspI: false,
                emailI: false,
                sendScheduleN: false,
                sendDispatchN: false,
                smsN: false,
                wspN: false,
                emailN: false,
                routingLogic: false,
                insuredLimitR: false,
                capacityR: false,
                monday: true,
                tuesday: true,
                wednesday: true,
                thursday: true,
                friday: true,
                saturday: false,
                sunday: false,
                validationDistance: null,
                deliveryphoto: false,
                morningStartTime: null,
                morningEndTime: null,
                afternoonStartTime: null,
                afternoonEndTime: null,
                nightStartTime: null,
                nightEndTime: null,
            })
        }
    }

    const arrayBread = [
        { id: "main-view", name: t(langKeys.delivery) },
        { id: "detail-view", name: t(langKeys.configuration) },
    ];

    const fetchConfiguration = () => dispatch(getCollection(deliveryConfigurationSel({id: 0, all: true})));
    const fetchVehicles = () => dispatch(getCollectionAux(deliveryVehicleSel({id: 0, all: true})));

    useEffect(() => {
        fetchConfiguration()
        fetchVehicles()
        setWaitSave2(true)
    }, [])

    useEffect(() => {
        if (waitSave2) {
            if (!main.loading && !main.error && main.key === 'UFN_DELIVERYCONFIGURATION_SEL') {
                fetchOriginalConfig()
                setWaitSave2(false)
            } else if (main.error) {
                const errormessage = t(main.code || "error_unexpected_error", { module: t(langKeys.product).toLocaleLowerCase() })
                dispatch(showSnackbar({ show: true, severity: "error", message: errormessage }))
                setWaitSave2(false);
            }
        }
    }, [main, waitSave2])

    const onMainSubmit = (() => {
        const existingConfig = main.data[0];
        const callback = () => {
            dispatch(showBackdrop(true));
            if(existingConfig) {
                dispatch(execute(deliveryConfigurationIns({
                    id: existingConfig?.deliveryconfigurationid,
                    config: JSON.stringify(configjson),
                    status: 'ACTIVO',
                    type: '',              
                    operation: 'UPDATE',
                })));
            } else {
                dispatch(execute(deliveryConfigurationIns({
                    id: 0,
                    config: JSON.stringify(configjson),
                    status: 'ACTIVO',
                    type: '',              
                    operation: 'INSERT',
                })));
            }
            setWaitSave(true);            
        }
        dispatch(manageConfirmation({
            visible: true,
            question: t(langKeys.confirmation_save),
            callback
        }))
    });

    useEffect(() => {
        if (waitSave) {
            if (!executeRes.loading && !executeRes.error) {
                dispatch(showBackdrop(false));
                fetchConfiguration()
                setWaitSave(false)
            } else if (executeRes.error) {
                const errormessage = t(executeRes.code || "error_unexpected_error", { module: t(langKeys.product).toLocaleLowerCase() })
                dispatch(showSnackbar({ show: true, severity: "error", message: errormessage }))
                setWaitSave(false);
                dispatch(showBackdrop(false));
            }
        }
    }, [executeRes, waitSave])

    return (
        <>
            <form style={{width: '100%'}}>
                <div className={classes.corporationNameAndButtons}>
                    <div>
                        <TemplateBreadcrumbs
                            breadcrumbs={arrayBread}
                        />
                        <TitleDetail
                            title={`${t(langKeys.name)} ${t(langKeys.corporation)}`}
                        />
                    </div>
                    <div className={classes.corporationNameAndButtons}>
                        <Button
                            variant="contained"
                            type="button"
                            color="primary"
                            startIcon={<ClearIcon color="secondary" />}
                            style={{ backgroundColor: "#FB5F5F" }}
                            onClick={() => fetchOriginalConfig()}
                        >{t(langKeys.back)}</Button>
                        <Button
                            variant="contained"
                            color="primary"
                            startIcon={<SaveIcon color="secondary" />}
                            style={{ backgroundColor: "#55BD84" }}
                            onClick={() => onMainSubmit()}
                        >
                            {t(langKeys.save)}
                        </Button>
                    </div>
                </div>
                <DeliveryConfigurationTabDetail
                    setOpenModalNonWorkingDays={setOpenModalNonWorkingDays}
                    setOpenModalNonWorkingDaysCopy={setOpenModalNonWorkingDaysCopy}
                    setOpenModalDeliveryShifts={setOpenModalDeliverySchedules}
                    setOpenModalVehicleType={setOpenModalVehicleType}
                    setOpenModalDeliveryOrderPhoto={setOpenModalDeliverPhoto}
                    fetchConfiguration={fetchConfiguration}
                    fetchVehicles={fetchVehicles}
                    setConfigjson={setConfigjson}
                    configjson={configjson}
                />
                <VehicleTypeDialog
                    openModal={openModalVehicleType}
                    setOpenModal={setOpenModalVehicleType}
                />
                <NonWorkingDaysDialog
                    openModal={openModalNonWorkingDays}
                    setOpenModal={setOpenModalNonWorkingDays}
                />
                <NonWorkingDaysCopyDialog
                    openModal={openModalNonWorkingDaysCopy}
                    setOpenModal={setOpenModalNonWorkingDaysCopy}
                />
                <DeliverySchedulesDialog
                    openModal={openModalDeliverySchedules}
                    setOpenModal={setOpenModalDeliverySchedules}
                    onMainSubmit={onMainSubmit}
                    configjson={configjson}
                    setConfigjson={setConfigjson}
                />
                <DeliveryPhotoDialog
                    openModal={openModalDeliverPhoto}
                    setOpenModal={setOpenModalDeliverPhoto}
                />
            </form>
        </>
    );
}


export default DeliveryConfigurationDetail;