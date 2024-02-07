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

const DeliveryConfigurationDetail: React.FC = () => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const [waitSave, setWaitSave] = useState(false);
    const executeRes = useSelector(state => state.main.execute);
    const classes = useStyles();
    const [openModalNonWorkingDays, setOpenModalNonWorkingDays] = useState(false)
    const [openModalNonWorkingDaysCopy, setOpenModalNonWorkingDaysCopy] = useState(false)
    const [openModalVehicleType, setOpenModalVehicleType] = useState(false)
    const [openModalDeliverySchedules, setOpenModalDeliverySchedules] = useState(false)
    const [openModalDeliverPhoto, setOpenModalDeliverPhoto] = useState(false)
    const main = useSelector((state) => state.main.mainData);

    const [configjson, setConfigjson] = useState({
        automaticA: false,
        manualA: false,
        predefinedA: false,
        inmediateA: true,
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
        monday: true,
        tuesday: true,
        wednesday: true,
        thursday: true,
        friday: true,
        saturday: false,
        sunday: false,
        validationDistance: false,
        deliveryphoto: false,
    })

    const fetchOriginalConfig = () => {
        setConfigjson({
            automaticA: main?.data?.[0]?.config?.automaticA || false,
            manualA: main?.data?.[0]?.config?.manualA || false,
            predefinedA: main?.data?.[0]?.config?.predefinedA || false,
            inmediateA: main?.data?.[0]?.config?.inmediateA || true,
            invoiceD: main?.data?.[0]?.config?.invoiceD || false,
            shareInvoiceD: main?.data?.[0]?.config?.shareInvoiceD || false,
            guideD: main?.data?.[0]?.config?.guideD || false,
            wspI: main?.data?.[0]?.config?.wspI || false,
            emailI: main?.data?.[0]?.config?.emailI || false,
            sendScheduleN: main?.data?.[0]?.config?.sendScheduleN || false,
            sendDispatchN: main?.data?.[0]?.config?.sendDispatchN || false,
            smsN: main?.data?.[0]?.config?.smsN || false,
            wspN: main?.data?.[0]?.config?.wspN || false,
            emailN: main?.data?.[0]?.config?.emailN || false,
            routingLogic: main?.data?.[0]?.config?.routingLogic || false,
            insuredLimitR: main?.data?.[0]?.config?.insuredLimitR || false,
            capacityR: main?.data?.[0]?.config?.capacityR || false,
            monday: main?.data?.[0]?.config?.monday || true,
            tuesday: main?.data?.[0]?.config?.tuesday || true,
            wednesday: main?.data?.[0]?.config?.wednesday || true,
            thursday: main?.data?.[0]?.config?.thursday || true,
            friday: main?.data?.[0]?.config?.friday || true,
            saturday: main?.data?.[0]?.config?.saturday || false,
            sunday: main?.data?.[0]?.config?.sunday || false,
            validationDistance: main?.data?.[0]?.config?.validationDistance || false,
            deliveryphoto: main?.data?.[0]?.config?.deliveryphoto || false,
        })
    } 

    useEffect(() => {
        fetchOriginalConfig()
    }, [main.data[0]])

    const arrayBread = [
        { id: "main-view", name: t(langKeys.delivery) },
        { id: "detail-view", name: t(langKeys.configuration) },
    ];

    const fetchConfiguration = () => dispatch(getCollection(deliveryConfigurationSel({id: 0, all: true})));
    const fetchVehicles = () => dispatch(getCollectionAux(deliveryVehicleSel({id: 0, all: true})));

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