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
import DeliverySchedulesDialog from '../dialogs/DeliverySchedulesDialog';
import DeliveryPhotoDialog from '../dialogs/DeliveryPhotoDialog';
import { deliveryConfigurationIns, deliveryConfigurationSel, deliveryVehicleSel } from 'common/helpers';
import { execute } from "store/main/actions";
import NonWorkingDaysDialog from '../dialogs/NonWorkingDaysDialog';

const useStyles = makeStyles(() => ({      
    corporationNameAndButtons: {
        display: 'flex', 
        justifyContent: 'space-between',
        gap: '10px', 
        alignItems: 'center', 
    },
}));

interface ConfigJson {
    automatica: boolean;
    manuala: boolean;
    predefineda: boolean;
    inmediatea: boolean;
    invoiced: boolean;
    shareinvoiced: boolean;
    guided: boolean;
    wspi: boolean;
    emaili: boolean;
    sendschedulen: boolean;
    senddispatchn: boolean;
    smsn: boolean;
    wspn: boolean;
    emailn: boolean;
    routinglogic: boolean;
    insuredlimitr: boolean;
    capacityr: boolean;
    monday: boolean;
    tuesday: boolean;
    wednesday: boolean;
    thursday: boolean;
    friday: boolean;
    saturday: boolean;
    sunday: boolean;
    validationdistance: null | number;
    deliveryphoto: boolean;
    morningstarttime: string | null;
    morningendtime: string | null;
    afternoonstarttime: string | null;
    afternoonendtime: string | null;
    nightstarttime: string | null;
    nightendtime: string | null;
}

interface VehicleType {
    vehicle: string;
    insuredamount: number;
    speed: number;
    capacity: number;
}

const DeliveryConfigurationDetail: React.FC = () => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const [waitSave, setWaitSave] = useState(false);
    const [waitSave2, setWaitSave2] = useState(false);
    const executeRes = useSelector(state => state.main.execute);
    const classes = useStyles();
    const [openModalNonWorkingDays, setOpenModalNonWorkingDays] = useState(false)
    const [openModalVehicleType, setOpenModalVehicleType] = useState(false)
    const [openModalDeliverySchedules, setOpenModalDeliverySchedules] = useState(false)
    const [openModalDeliverPhoto, setOpenModalDeliverPhoto] = useState(false)
    const main = useSelector((state) => state.main.mainData);
    const [configjson, setConfigjson] = useState<ConfigJson>({
        automatica: false,
        manuala: false,
        predefineda: false,
        inmediatea: false,
        invoiced: false,
        shareinvoiced: false,
        guided: false,
        wspi: false,
        emaili: false,
        sendschedulen: false,
        senddispatchn: false,
        smsn: false,
        wspn: false,
        emailn: false,
        routinglogic: false,
        insuredlimitr: false,
        capacityr: false,
        monday: false,
        tuesday: false,
        wednesday: false,
        thursday: false,
        friday: false,
        saturday: false,
        sunday: false,
        validationdistance: null,
        deliveryphoto: false,
        morningstarttime: null,
        morningendtime: null,
        afternoonstarttime: null,
        afternoonendtime: null,
        nightstarttime: null,
        nightendtime: null,
    })
    const [nonWorkingDates, setNonWorkingDates] = useState<string[]>([])
    const [vehicleTypes, setVehicleTypes] = useState<VehicleType[]>([])
    const [deliveryPhotos, setDeliveryPhotos] = useState<string[]>([])

    const fetchOriginalConfig = () => {
        if(main.data.length) {
            setConfigjson({
                automatica: main?.data?.[0]?.config?.automatica,
                manuala: main?.data?.[0]?.config?.manuala,
                predefineda: main?.data?.[0]?.config?.predefineda,
                inmediatea: main?.data?.[0]?.config?.inmediatea,
                invoiced: main?.data?.[0]?.config?.invoiced,
                shareinvoiced: main?.data?.[0]?.config?.shareinvoiced,
                guided: main?.data?.[0]?.config?.guided,
                wspi: main?.data?.[0]?.config?.wspi,
                emaili: main?.data?.[0]?.config?.emaili,
                sendschedulen: main?.data?.[0]?.config?.sendschedulen,
                senddispatchn: main?.data?.[0]?.config?.senddispatchn,
                smsn: main?.data?.[0]?.config?.smsn,
                wspn: main?.data?.[0]?.config?.wspn,
                emailn: main?.data?.[0]?.config?.emailn,
                routinglogic: main?.data?.[0]?.config?.routinglogic,
                insuredlimitr: main?.data?.[0]?.config?.insuredlimitr,
                capacityr: main?.data?.[0]?.config?.capacityr,
                monday: main?.data?.[0]?.config?.monday,
                tuesday: main?.data?.[0]?.config?.tuesday,
                wednesday: main?.data?.[0]?.config?.wednesday,
                thursday: main?.data?.[0]?.config?.thursday,
                friday: main?.data?.[0]?.config?.friday,
                saturday: main?.data?.[0]?.config?.saturday,
                sunday: main?.data?.[0]?.config?.sunday,
                validationdistance: main?.data?.[0]?.config?.validationdistance,
                deliveryphoto: main?.data?.[0]?.config?.deliveryphoto,
                morningstarttime: main?.data?.[0]?.config?.morningstarttime,
                morningendtime: main?.data?.[0]?.config?.morningendtime,
                afternoonstarttime: main?.data?.[0]?.config?.afternoonstarttime,
                afternoonendtime: main?.data?.[0]?.config?.afternoonendtime,
                nightstarttime: main?.data?.[0]?.config?.nightstarttime,
                nightendtime: main?.data?.[0]?.config?.nightendtime,
            })
            setNonWorkingDates(main?.data?.[0]?.config?.nonworkingdates)
            setVehicleTypes(main?.data?.[0]?.config?.vehicletypes)
            setDeliveryPhotos(main?.data?.[0]?.config?.deliveryphotos)
        } else {
            setConfigjson({
                automatica: false,
                manuala: false,
                predefineda: false,
                inmediatea: true,
                invoiced: true,
                shareinvoiced: true,
                guided: true,
                wspi: false,
                emaili: false,
                sendschedulen: false,
                senddispatchn: false,
                smsn: false,
                wspn: false,
                emailn: false,
                routinglogic: false,
                insuredlimitr: false,
                capacityr: false,
                monday: true,
                tuesday: true,
                wednesday: true,
                thursday: true,
                friday: true,
                saturday: false,
                sunday: false,
                validationdistance: null,
                deliveryphoto: false,
                morningstarttime: null,
                morningendtime: null,
                afternoonstarttime: null,
                afternoonendtime: null,
                nightstarttime: null,
                nightendtime: null,
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
                    config: JSON.stringify({...configjson, nonworkingdates: nonWorkingDates, vehicletypes: vehicleTypes, deliveryphotos: deliveryPhotos}),
                    status: 'ACTIVO',
                    type: '',              
                    operation: 'UPDATE',
                })));
            } else {
                dispatch(execute(deliveryConfigurationIns({
                    id: 0,
                    config: JSON.stringify({...configjson, nonworkingdates: nonWorkingDates, vehicletypes: vehicleTypes, deliveryphotos: deliveryPhotos}),
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
                    setOpenModalDeliveryShifts={setOpenModalDeliverySchedules}
                    setOpenModalVehicleType={setOpenModalVehicleType}
                    setOpenModalDeliveryOrderPhoto={setOpenModalDeliverPhoto}
                    fetchConfiguration={fetchConfiguration}
                    fetchVehicles={fetchVehicles}
                    setConfigjson={setConfigjson}
                    configjson={configjson}
                    vehicleTypes={vehicleTypes}
                />
                <VehicleTypeDialog
                    openModal={openModalVehicleType}
                    setOpenModal={setOpenModalVehicleType}
                    vehicleTypes={vehicleTypes}
                    setVehicleTypes={setVehicleTypes}
                    onMainSubmit={onMainSubmit}
                    fetchOriginalConfig={fetchOriginalConfig}
                />
                <NonWorkingDaysDialog
                    openModal={openModalNonWorkingDays}
                    setOpenModal={setOpenModalNonWorkingDays}
                    nonWorkingDates={nonWorkingDates}
                    setNonWorkingDates={setNonWorkingDates}
                    onMainSubmit={onMainSubmit}
                    fetchOriginalConfig={fetchOriginalConfig}
                />
                <DeliverySchedulesDialog
                    openModal={openModalDeliverySchedules}
                    setOpenModal={setOpenModalDeliverySchedules}
                    onMainSubmit={onMainSubmit}
                    configjson={configjson}
                    setConfigjson={setConfigjson}
                    fetchOriginalConfig={fetchOriginalConfig}
                />
                <DeliveryPhotoDialog
                    openModal={openModalDeliverPhoto}
                    setOpenModal={setOpenModalDeliverPhoto}
                    onMainSubmit={onMainSubmit}
                    deliveryPhotos={deliveryPhotos}
                    setDeliveryPhotos={setDeliveryPhotos}
                    fetchOriginalConfig={fetchOriginalConfig}
                />
            </form>
        </>
    );
}


export default DeliveryConfigurationDetail;