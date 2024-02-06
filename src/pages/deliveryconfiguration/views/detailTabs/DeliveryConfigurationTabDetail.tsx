import React, { useEffect, useState } from 'react'; 
import { Dictionary } from "@types";
import { makeStyles } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';
import { langKeys } from 'lang/keys';
import { FieldErrors, UseFormGetValues, UseFormSetValue } from 'react-hook-form';
import { TitleDetail, TemplateIcons, IOSSwitch, FieldEdit } from 'components';
import TableZyx from "components/fields/table-simple";
import { Checkbox, FormControl, FormControlLabel, FormGroup } from '@material-ui/core';
import Tooltip from '@material-ui/core/Tooltip';
import AssociatedVehicleDialog from '../../dialogs/AssociatedVehicleDialog';
import InfoRoundedIcon from '@material-ui/icons/InfoRounded';
import { CellProps } from 'react-table';
import { useSelector } from 'hooks';

const useStyles = makeStyles((theme) => ({
    containerDetail: {
        marginTop: theme.spacing(2),
        padding: theme.spacing(2),
        background: '#fff',
    },   
    iconHelpText: {
        width: 15,
        height: 15,
        cursor: 'pointer',
    },    
    span: {
        color: 'blue', 
        textDecoration:'underline solid', 
        cursor: 'pointer', 
        display: 'block',
        paddingBottom:"20px",
    },
    spandisabled: {
        textDecoration:'underline solid', 
        cursor: 'pointer', 
        display: 'block', 
        paddingBottom:"20px"
    }, 
    subtittles: {
        fontSize: '1rem', 
        fontWeight:"bold",
    },
    thursdayseparation: {
        pointerEvents: "none", 
        paddingBottom:"10px",
    }    
}));

interface CustomTitleHelperProps {
    title: string;
    helperText?: string; 
}
  
const CustomTitleHelper: React.FC<CustomTitleHelperProps> = ({ title, helperText }) => {
    const classes = useStyles();

    return (
        <span className={classes.subtittles}>
            {title}
            {helperText ? (
                <Tooltip title={helperText} arrow placement="top" >
                    <InfoRoundedIcon color="action" className={classes.iconHelpText} />
                </Tooltip>
            ) : ""}
        </span>
    );
};

interface ConfigurationTabDetailProps {
    row: Dictionary | null;
    setValue: UseFormSetValue<any>;
    getValues: UseFormGetValues<any>;
    errors: FieldErrors;
    setOpenModalNonWorkingDays: (flag: boolean) => void;
    setOpenModalNonWorkingDaysCopy: (flag: boolean) => void;
    setOpenModalDeliveryShifts: (flag: boolean) => void;
    setOpenModalVehicleType: (flag: boolean) => void;
    setOpenModalDeliveryOrderPhoto: (flag: boolean) => void;
    fetchConfiguration: () => void;
    fetchVehicles: () => void;
}

interface RowSelected {
    row2: Dictionary | null;
    edit: boolean;
}

const DeliveryConfigurationTabDetail: React.FC<ConfigurationTabDetailProps> = ({  
    setOpenModalNonWorkingDays,
    setOpenModalNonWorkingDaysCopy,
    setOpenModalDeliveryShifts,
    setOpenModalVehicleType,
    setOpenModalDeliveryOrderPhoto,
    fetchConfiguration,
    fetchVehicles,
}) => {
    const { t } = useTranslation();
    const classes = useStyles();
    const [openModalAssociatedVehicleDialog, setOpenModalAssociatedVehicleDialog] = useState(false)
    const [routingLogic, setRoutingLogic] = useState(false);
    const [deliveryOrderPhoto, setDeliveryOrderPhoto] = useState(false);
    const [automaticAppointment, setAutomaticAppointment] = useState(false);
    const [manualAppointment, setManualAppointment] = useState(false);
    const [defaultAppointment, setDefaultAppointment] = useState(false);
    const [immediateAppointment, setImmediateAppointment] = useState(true);
    const [invoiceElectronicTicket, setInvoiceElectronicTicket] = useState(true);
    const [shareVoucher, setShareVoucher] = useState(true);
    const [referralGuide, setReferralGuide] = useState(true);
    const [whatsapp1, setWhatsapp1] = useState(false);
    const [email1, setEmail1] = useState(false);
    const [sendScheduling, setSendScheduling] = useState(true);
    const [sendShipment, setSendShipment] = useState(true);
    const [sms, setSms] = useState(false);
    const [whatsapp2, setWhatsapp2] = useState(false);
    const [email2, setEmail2] = useState(false);
    const [insuredLimit, setInsuredLimit] = useState(false);
    const [capacity, setCapacity] = useState(false);
    const [monday, setMonday] = useState(true);
    const [tuesday, setTuesday] = useState(true);
    const [wednesday, setWednesday] = useState(true);
    const [thursday, setThursday] = useState(false);
    const [friday, setFriday] = useState(true);
    const [saturday, setSaturday] = useState(false);
    const [sunday, setSunday] = useState(true);
    const mainConfig = useSelector(state => state.main.execute);
    const mainVehicles = useSelector(state => state.main.mainAux);

    const [selectedRow, setSelectedRow] = useState<RowSelected>({
        row2: null,
        edit: false,
    });

    const handleEdit = (row2: Dictionary) => {   
        setSelectedRow({ row2, edit: true });
        setOpenModalAssociatedVehicleDialog(true)
    }

    function handleRegister() {
        setSelectedRow({row2: null, edit: false})
        setOpenModalAssociatedVehicleDialog(true)
    }

    useEffect(() => {
        fetchConfiguration()
        fetchVehicles()
    }, [])

    const columns = React.useMemo(
        () => [
          {
            accessor: 'deliveryvehicleid',
            NoFilter: true,
            disableGlobalFilter: true,
            isComponent: true,
            minWidth: 60,
            width: '1%',
            Cell: (props: CellProps<Dictionary>) => {
                const row = props.cell.row.original;
                return (
                    <TemplateIcons
                        deleteFunction={() => handleEdit(row)}
                        editFunction={() => handleEdit(row)}
                    />
                )
            }
          },
          {
            Header: t(langKeys.organization),
            accessor: "createdate",
            width: "auto",
          },
          {
            Header: t(langKeys.vehicletype),
            accessor: "type",
            width: "auto",
          },
          {
            Header: t(langKeys.brand),
            accessor: "brand",
            width: "auto",
          },
          {
            Header: t(langKeys.model),
            accessor: "model",
            width: "auto",
          },
          {
            Header: t(langKeys.platenum),
            accessor: "vehicleplate",
            width: "auto",
          },
          {
            Header: t(langKeys.capacity),
            accessor: "ability",
            width: "auto",
          },
          {
            Header: t(langKeys.averagespeed),
            accessor: "averagespeed",
            width: "auto",
          },
          {
            Header: t(langKeys.insuredamount),
            accessor: "insuredamount",
            width: "auto",
          },
          {
            Header: t(langKeys.carriername),
            accessor: "userid",
            width: "auto",
          },
          {
            Header: t(langKeys.licensenum),
            accessor: "license",
            width: "auto",
          },
        ],
        []
    );

    return (
        <div className={classes.containerDetail}>
            <div className='row-zyx'>
                <div className='col-3'>                                  
                    <FormControl component="fieldset" >                                             
                        <CustomTitleHelper title={t(langKeys.appointmenttype)}/>                                           
                        <FormGroup>
                            <FormControlLabel
                                style={{ pointerEvents: "none" }}
                                control={
                                <Checkbox 
                                    color="primary" 
                                    style={{ pointerEvents: "auto" }} 
                                    checked={automaticAppointment} 
                                    onChange={(e) => setAutomaticAppointment(e.target.checked)} 
                                    name="auto" 
                                />}
                                label={t(langKeys.automatic)}
                            />
                            <FormControlLabel
                                style={{ pointerEvents: "none" }}
                                control={
                                <Checkbox 
                                    color="primary" 
                                    style={{ pointerEvents: "auto" }} 
                                    checked={manualAppointment} 
                                    onChange={(e) => setManualAppointment(e.target.checked)} 
                                    name="man" 
                                />}
                                label={t(langKeys.manual)}
                            />
                            <FormControlLabel
                                style={{ pointerEvents: "none" }}
                                control={
                                    <Checkbox 
                                        color="primary" 
                                        style={{ pointerEvents: "auto" }} 
                                        checked={defaultAppointment} 
                                        onChange={(e) => setDefaultAppointment(e.target.checked)} 
                                        name="predef" 
                                    />}
                                label={t(langKeys.default2)}
                            />
                            <FormControlLabel
                                style={{ pointerEvents: "none" }}
                                control={
                                <Checkbox 
                                    color="primary" 
                                    style={{ pointerEvents: "visible" }} 
                                    checked={immediateAppointment} 
                                    onChange={(e) => setImmediateAppointment(e.target.checked)} 
                                    name="immediate" 
                                />}
                                label={t(langKeys.immediate)}
                            />
                        </FormGroup><></>
                    </FormControl>
                </div>
                <div className='col-3'>                                  
                    <FormControl component="fieldset" >                       
                        <CustomTitleHelper title={t(langKeys.documentsissuance)}/>     
                        <FormGroup>
                            <FormControlLabel
                                style={{ pointerEvents: "none" }}
                                control={<Checkbox color="primary" style={{ pointerEvents: "auto" }} checked={invoiceElectronicTicket} onChange={(e) => setInvoiceElectronicTicket(e.target.checked)} name="sun" />}
                                label={t(langKeys.electronic_ticket_and_invoice)}
                            />
                            <FormControlLabel
                                style={{ pointerEvents: "none" }}
                                control={<Checkbox color="primary" style={{ pointerEvents: "auto" }} checked={shareVoucher} onChange={(e) => setShareVoucher(e.target.checked)} name="mon" />}
                                label={t(langKeys.sharevoucher)}
                            />
                            <FormControlLabel
                                style={{ pointerEvents: "none" }}
                                control={<Checkbox color="primary" style={{ pointerEvents: "auto" }} checked={referralGuide} onChange={(e) => setReferralGuide(e.target.checked)} name="tue" />}
                                label={t(langKeys.referralguide)}
                            />
                        </FormGroup><></>
                    </FormControl>
                </div>
                <div className='col-3'>                                  
                    <FormControl component="fieldset" >
                        <CustomTitleHelper
                            title={t(langKeys.send_invoice) + ' '}
                            helperText={t(langKeys.send_invoice_helper_text)}
                        /> 
                        <FormGroup>
                            <FormControlLabel
                                style={{ pointerEvents: "none" }}
                                control={<Checkbox color="primary" style={{ pointerEvents: "auto" }} checked={whatsapp1} onChange={(e) => setWhatsapp1(e.target.checked)} name="sun" />}
                                label={t(langKeys.WHATSAPP)}
                            />
                            <FormControlLabel
                                style={{ pointerEvents: "none" }}
                                control={<Checkbox color="primary" style={{ pointerEvents: "auto" }} checked={email1} onChange={(e) => setEmail1(e.target.checked)} name="mon" />}
                                label={t(langKeys.emitteremail)}
                            />
                        </FormGroup><></>
                    </FormControl>
                </div>
                <div className='col-3'>                                  
                    <FormControl component="fieldset">                       
                        <CustomTitleHelper
                           title={t(langKeys.sendnotification)}     
                           helperText={t(langKeys.send_invoice_helper_text)}                         
                        />     
                        <FormGroup>
                            <FormControlLabel
                                style={{ pointerEvents: "none" }}
                                control={<Checkbox color="primary" style={{ pointerEvents: "auto" }} checked={sendScheduling} onChange={(e) => setSendScheduling(e.target.checked)} name="sun" />}
                                label={t(langKeys.sendduringscheduling)}
                            />
                            <FormControlLabel
                                style={{ pointerEvents: "none" }}
                                control={<Checkbox color="primary" style={{ pointerEvents: "auto" }} checked={sendShipment} onChange={(e) => setSendShipment(e.target.checked)} name="mon" />}
                                label={t(langKeys.sendduringshipment)}
                            />
                        </FormGroup><></>
                    </FormControl>
                </div>
                <div className='col-3'>                                  
                    <FormControl component="fieldset" >                        
                        <CustomTitleHelper title={t(langKeys.notificationtype)}/>        
                        <FormGroup>
                            <FormControlLabel
                                style={{ pointerEvents: "none" }}
                                control={<Checkbox color="primary" style={{ pointerEvents: "auto" }} checked={sms} onChange={(e) => setSms(e.target.checked)} name="sun" />}
                                label={t(langKeys.sms)}
                            />
                            <FormControlLabel
                                style={{ pointerEvents: "none" }}
                                control={<Checkbox color="primary" style={{ pointerEvents: "auto" }} checked={whatsapp2} onChange={(e) => setWhatsapp2(e.target.checked)} name="mon" />}
                                label={t(langKeys.WHATSAPP)}
                            />
                            <FormControlLabel
                                style={{ pointerEvents: "none" }}
                                control={<Checkbox color="primary" style={{ pointerEvents: "auto" }} checked={email2} onChange={(e) => setEmail2(e.target.checked)} name="tue" />}
                                label={t(langKeys.emitteremail)}
                            />
                        </FormGroup><></>
                    </FormControl>
                </div>
                <div className='col-3'>                                  
                    <FormControl component="fieldset" >
                        <div style={{display:'flex'}}>
                            <CustomTitleHelper title={t(langKeys.routinglogic)}/>                                
                            <div style={{ width: 6 }} />
                            <IOSSwitch checked={routingLogic} onChange={(e) => setRoutingLogic(e.target.checked)} name="checkedB" />
                        </div>
                        <FormGroup>
                            <FormControlLabel
                                style={{ pointerEvents: "none" }}
                                control={<Checkbox color="primary" style={{ pointerEvents: "auto" }} checked={insuredLimit} onChange={(e) => setInsuredLimit(e.target.checked)} name="sun" />}
                                label={t(langKeys.insuredlimit)}
                                disabled={!routingLogic}
                            />
                            <FormControlLabel
                                style={{ pointerEvents: "none" }}
                                control={<Checkbox color="primary" style={{ pointerEvents: "auto" }} checked={capacity} onChange={(e) => setCapacity(e.target.checked)} name="mon" />}
                                label={t(langKeys.CAPACITY)}
                                disabled={!routingLogic}
                            />
                        </FormGroup><></>
                    </FormControl>
                </div>
                <div className='col-3'>     
                    <CustomTitleHelper title={t(langKeys.deliveryshifts)}/>     
                    <span className={classes.span} onClick={() => setOpenModalDeliveryShifts(true)}>
                        {t(langKeys.edit) + ' ' + t(langKeys.deliveryshifts)}
                    </span><></>
                </div>
                <div className='col-3'>   
                    <CustomTitleHelper title={t(langKeys.vehicletype)}/>                                
                    <span className={classes.span} onClick={() => setOpenModalVehicleType(true)}>
                        {t(langKeys.edit) + ' ' + t(langKeys.vehicletype)}
                    </span><></>
                </div>

                <div className='col-3'>                                  
                    <FormControl component="fieldset" >
                        <CustomTitleHelper title={t(langKeys.workingdays)}/>                           
                        <FormGroup>

                            <div style={{display:'flex'}}>
                                <FormControlLabel
                                    style={{ pointerEvents: "none" }}
                                    control={<Checkbox color="primary" style={{ pointerEvents: "auto" }} checked={monday} onChange={(e) => setMonday(e.target.checked)} name="monday" />}
                                    label={t(langKeys.monday)}
                                />
                                <FormControlLabel
                                    style={{ pointerEvents: "none" }}
                                    control={<Checkbox color="primary" style={{ pointerEvents: "auto", paddingLeft:"2rem" }} checked={tuesday} onChange={(e) => setTuesday(e.target.checked)} name="motuesdayn" />}
                                    label={t(langKeys.friday)}
                                />
                            </div>

                            <div style={{display:'flex'}}>
                                <FormControlLabel
                                    style={{ pointerEvents: "none" }}
                                    control={<Checkbox color="primary" style={{ pointerEvents: "auto" }} checked={wednesday} onChange={(e) => setWednesday(e.target.checked)} name="wednesday" />}
                                    label={t(langKeys.tuesday)}
                                />
                                <FormControlLabel
                                    style={{ pointerEvents: "none" }}
                                    control={<Checkbox color="primary" style={{ pointerEvents: "auto", paddingLeft:"1.5rem"}} checked={thursday} onChange={(e) => setThursday(e.target.checked)} name="thursday" />}
                                    label={t(langKeys.saturday)}
                                />
                            </div>

                            <div style={{display:'flex'}}>
                                <FormControlLabel
                                    style={{ pointerEvents: "none" }}
                                    control={<Checkbox color="primary" style={{ pointerEvents: "auto" }} checked={friday} onChange={(e) => setFriday(e.target.checked)} name="friday" />}
                                    label={t(langKeys.wednesday)}
                                />
                                <FormControlLabel
                                    style={{ pointerEvents: "none" }}
                                    control={<Checkbox color="primary" style={{ pointerEvents: "auto" }} checked={saturday} onChange={(e) => setSaturday(e.target.checked)} name="saturday" />}
                                    label={t(langKeys.sunday)}
                                />
                            </div>

                            <FormControlLabel
                                className={classes.thursdayseparation}                                
                                control={<Checkbox color="primary" style={{ pointerEvents: "auto" }} checked={sunday} onChange={(e) => setSunday(e.target.checked)} name="sunday" />}
                                label={t(langKeys.thursday)}
                            />

                        </FormGroup>
                    </FormControl>
                </div>        
                
                <div className='col-3'>    
                    <CustomTitleHelper title={t(langKeys.nonWorkingdays)}/>           
                    <span className={classes.span} onClick={() => setOpenModalNonWorkingDaysCopy(true)}>
                        {t(langKeys.edit) + ' ' + t(langKeys.nonworkingdays)}
                    </span>
                </div>
                <div className='col-3'>                                  
                    <div style={{display:'flex'}}>
                        <div style={{display:'flex'}}>
                            <CustomTitleHelper title={t(langKeys.deliveryphotoorder)}/>                                                             
                            <div style={{ width: 6 }} />
                                <IOSSwitch 
                                    checked={deliveryOrderPhoto} 
                                    onChange={(e) => {setDeliveryOrderPhoto(e.target.checked)}} 
                                    name="checkedB" 
                                />
                        </div>
                        <div style={{ width: 10 }} />
                    </div>
                    <span className={classes.spandisabled} style={{color: deliveryOrderPhoto ? 'blue' : 'grey'}} onClick={() => {
                        if(deliveryOrderPhoto) setOpenModalDeliveryOrderPhoto(true)
                    }}>
                        {t(langKeys.edit) + ' ' + t(langKeys.deliveryphotoorder)}
                    </span>
                </div>

                <div className='col-3'>   
                        <CustomTitleHelper title={t(langKeys.deliveryvalidationdistance)}/>  
                        <div style={{ width: 300 }}>
                            <FieldEdit
                                valueDefault={''}
                                className="col-2"
                                type='number'
                            />
                        </div>        
                      
                </div>
            </div>

            <div className='row-zyx'>
                <div>
                    <div>
                        <TitleDetail
                            title={t(langKeys.associatedvehicles)}
                        />
                    </div>                  
                    <AssociatedVehicleDialog
                        openModal={openModalAssociatedVehicleDialog}
                        setOpenModal={setOpenModalAssociatedVehicleDialog}    
                        data={selectedRow}   
                        fetchVehicles={fetchVehicles}                 
                    />
                </div>
                <div className='row-zyx'>                
                    <TableZyx
                        columns={columns}
                        data={mainVehicles.data || []}
                        download={false}
                        filterGeneral={false}
                        register={true}
                        handleRegister={handleRegister}
                        onClickRow={handleEdit}
                    />
                </div>
            </div>
        </div>
    )
}

export default DeliveryConfigurationTabDetail;