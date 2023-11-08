/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState } from 'react'; // we need this to make JSX compile
import { Dictionary } from "@types";
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import { useTranslation } from 'react-i18next';
import { langKeys } from 'lang/keys';
import { FieldErrors, UseFormGetValues, UseFormSetValue } from 'react-hook-form';
import { FieldEdit, FieldCheckbox, TitleDetail, TemplateIcons, IOSSwitch, FieldSelect } from 'components';
import TableZyx from "components/fields/table-simple";
import { Button, Checkbox, FormControl, FormControlLabel, FormGroup, Tooltip, Typography } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import AssociatedVehicleDialog from '../../dialogs/AssociatedVehicleDialog';
import { InfoRoundedIcon } from 'icons';
import { AntTab, DialogZyx, TemplateSwitchYesNo } from 'components';



const useStyles = makeStyles((theme) => ({
    containerDetail: {
        marginTop: theme.spacing(2),
        padding: theme.spacing(2),
        background: '#fff',
    },
    containerDescription: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        paddingBottom: '10px',
    },
    containerDescriptionTitle: {
        fontSize: 24
    },
    containerDescriptionSubtitle: {
        fontSize: 14,
        fontWeight: 500
    },
    iconResponse: {
        cursor: 'pointer',
        poisition: 'relative',
        color: '#2E2C34',
        '&:hover': {
            // color: theme.palette.primary.main,
            backgroundColor: '#EBEAED',
            borderRadius: 4
        }
    },
    iconSendDisabled: {
        backgroundColor: "#EBEAED",
        cursor: 'not-allowed',
    },
    button: {
        marginRight: theme.spacing(2),
    },
}));

interface ConfigurationTabDetailProps {
    row: Dictionary | null;
    setValue: UseFormSetValue<any>;
    getValues: UseFormGetValues<any>;
    errors: FieldErrors<any>;
    setOpenModalNonWorkingDays: (flag: boolean) => void;
    setOpenModalDeliveryShifts: (flag: boolean) => void;
    setOpenModalVehicleType: (flag: boolean) => void;
    setOpenModalDeliveryOrderPhoto: (flag: boolean) => void;
    setOpenModalCoincidenseMeters: (flag: boolean) => void;
}

const DeliveryConfigurationTabDetail: React.FC<ConfigurationTabDetailProps> = ({
    row,
    setValue,
    getValues,
    errors,
    setOpenModalNonWorkingDays,
    setOpenModalDeliveryShifts,
    setOpenModalVehicleType,
    setOpenModalDeliveryOrderPhoto,
    setOpenModalCoincidenseMeters
}) => {
    const { t } = useTranslation();
    const classes = useStyles();
    const [openModalAssociatedVehicleDialog, setOpenModalAssociatedVehicleDialog] = useState(false)
    const [routingLogic, setRoutingLogic] = useState(false);
    const [deliveryOrderPhoto, setDeliveryOrderPhoto] = useState(false);
    const [automaticAppointment, setAutomaticAppointment] = useState(false);
    const [manualAppointment, setManualAppointment] = useState(false);
    const [defaultAppointment, setDefaultAppointment] = useState(false);
    const [immediateAppointment, setImmediateAppointment] = useState(false);
    const [invoiceElectronicTicket, setInvoiceElectronicTicket] = useState(false);
    const [shareVoucher, setShareVoucher] = useState(false);
    const [referralGuide, setReferralGuide] = useState(false);
    const [whatsapp1, setWhatsapp1] = useState(false);
    const [email1, setEmail1] = useState(false);
    const [sendScheduling, setSendScheduling] = useState(false);
    const [sendShipment, setSendShipment] = useState(false);
    const [sms, setSms] = useState(false);
    const [whatsapp2, setWhatsapp2] = useState(false);
    const [email2, setEmail2] = useState(false);
    const [insuredLimit, setInsuredLimit] = useState(false);
    const [capacity, setCapacity] = useState(false);
    const [monday, setMonday] = useState(false);
    const [tuesday, setTuesday] = useState(false);
    const [wednesday, setWednesday] = useState(false);
    const [thursday, setThursday] = useState(false);
    const [friday, setFriday] = useState(false);
    const [saturday, setSaturday] = useState(false);
    const [sunday, setSunday] = useState(false);

    const columns = React.useMemo(
        () => [
          {
            accessor: 'productalternativeid',
            NoFilter: true,
            isComponent: true,
            minWidth: 60,
            width: '1%',
            Cell: (props: any) => {
                const row = props.cell.row.original;
                return (
                    <TemplateIcons
                        //deleteFunction={() => handleDelete(row)}
                        //editFunction={() => handleEdit(row)}
                    />
                )
            }
          },
          {
            Header: t(langKeys.organization),
            accessor: "productdescription",
            width: "auto",
          },
          {
            Header: t(langKeys.vehicletype),
            accessor: "productdescriptionlarge",
            width: "auto",
          },
          {
            Header: t(langKeys.brand),
            accessor: "familydescription",
            width: "auto",
          },
          {
            Header: t(langKeys.model),
            accessor: "subfamilydescription",
            width: "auto",
          },
          {
            Header: t(langKeys.platenum),
            accessor: "dateofphysicalcount",
            width: "auto",
          },
          {
            Header: t(langKeys.capacity),
            accessor: "isconciliated",
            width: "auto",
          },
          {
            Header: t(langKeys.averagespeed),
            accessor: "shelflifeindays",
            width: "auto",
          },
          {
            Header: t(langKeys.insuredamount),
            accessor: "dueDate",
            width: "auto",
          },
          {
            Header: t(langKeys.carriername),
            accessor: "carriername",
            width: "auto",
          },
          {
            Header: t(langKeys.licensenum),
            accessor: "licensenum",
            width: "auto",
          },
        ],
        []
    );

    return (
        <div className={classes.containerDetail}>
         

            <div className='row-zyx'>     

                <div className='col-2'>                                  
                    <FormControl component="fieldset" >
                        <TableZyx
                            titlemodule={t(langKeys.appointmenttype)}     
                            columns={[]}            
                            data={[]}           
                            filterGeneral={false}
                            toolsFooter={false}                             
                        />
                        <FormGroup>
                            <FormControlLabel
                                style={{ pointerEvents: "none" }}
                                control={<Checkbox color="primary" style={{ pointerEvents: "auto" }} checked={automaticAppointment} onChange={(e) => setAutomaticAppointment(e.target.checked)} name="auto" />}
                                label={t(langKeys.automatic)}
                            />
                            <FormControlLabel
                                style={{ pointerEvents: "none" }}
                                control={<Checkbox color="primary" style={{ pointerEvents: "auto" }} checked={manualAppointment} onChange={(e) => setManualAppointment(e.target.checked)} name="man" />}
                                label={t(langKeys.manual)}
                            />
                            <FormControlLabel
                                style={{ pointerEvents: "none" }}
                                control={<Checkbox color="primary" style={{ pointerEvents: "auto" }} checked={defaultAppointment} onChange={(e) => setDefaultAppointment(e.target.checked)} name="predef" />}
                                label={t(langKeys.default2)}
                            />
                            <FormControlLabel
                                style={{ pointerEvents: "none" }}
                                control={<Checkbox color="primary" style={{ pointerEvents: "auto" }} checked={immediateAppointment} onChange={(e) => setImmediateAppointment(e.target.checked)} name="inme" />}
                                label={t(langKeys.immediate)}
                            />
                        </FormGroup><></>
                    </FormControl>
                </div> 

                <div className='col-2'>
                    <FormControl component="fieldset" >
                        <TableZyx
                            titlemodule={t(langKeys.documentsissuance)}     
                            columns={[]}            
                            data={[]}           
                            filterGeneral={false}
                            toolsFooter={false}                             
                        />
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
                <div className='col-2'>
                    <FormControl component="fieldset" >
                        <TableZyx
                            titlemodule={t(langKeys.send_invoice)}     
                            helperText={t(langKeys.send_invoice_helper_text)}
                            columns={[]}            
                            data={[]}           
                            filterGeneral={false}
                            toolsFooter={false}                             
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
                <div className='col-2'>
                    <FormControl component="fieldset" >
                        <TableZyx
                            titlemodule={t(langKeys.sendnotification)}     
                            helperText={t(langKeys.send_invoice_helper_text)}
                            columns={[]}            
                            data={[]}           
                            filterGeneral={false}
                            toolsFooter={false}                             
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
                <div className='col-2'>
                    <FormControl component="fieldset" >
                        <TableZyx
                            titlemodule={t(langKeys.notificationtype)}     
                            columns={[]}            
                            data={[]}           
                            filterGeneral={false}
                            toolsFooter={false}                             
                        />        
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
                <div className='col-2'>
                    <FormControl component="fieldset" >
                          
                        <div style={{display:'flex'}}>
                            <TableZyx
                                titlemodule={t(langKeys.routinglogic)}     
                                columns={[]}            
                                data={[]}           
                                filterGeneral={false}
                                toolsFooter={false}                             
                            />                                
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
            </div>

            <div className='row-zyx'>
                <div className='col-2'>
                    <FormControl component="fieldset" >
                        <TableZyx
                            titlemodule={t(langKeys.workingdays)}     
                            columns={[]}            
                            data={[]}           
                            filterGeneral={false}
                            toolsFooter={false}                             
                        />
                        <FormGroup>
                            <div style={{display:'flex'}}>
                                <FormControlLabel
                                    style={{ pointerEvents: "none" }}
                                    control={<Checkbox color="primary" style={{ pointerEvents: "auto" }} checked={monday} onChange={(e) => setMonday(e.target.checked)} name="sun" />}
                                    label={t(langKeys.monday)}
                                />
                                <FormControlLabel
                                    style={{ pointerEvents: "none" }}
                                    control={<Checkbox color="primary" style={{ pointerEvents: "auto" }} checked={tuesday} onChange={(e) => setTuesday(e.target.checked)} name="mon" />}
                                    label={t(langKeys.friday)}
                                />
                            </div>
                            <div style={{display:'flex'}}>
                                <FormControlLabel
                                    style={{ pointerEvents: "none" }}
                                    control={<Checkbox color="primary" style={{ pointerEvents: "auto" }} checked={wednesday} onChange={(e) => setWednesday(e.target.checked)} name="mon" />}
                                    label={t(langKeys.tuesday)}
                                />
                                <FormControlLabel
                                    style={{ pointerEvents: "none" }}
                                    control={<Checkbox color="primary" style={{ pointerEvents: "auto" }} checked={thursday} onChange={(e) => setThursday(e.target.checked)} name="mon" />}
                                    label={t(langKeys.saturday)}
                                />
                            </div>
                            <div style={{display:'flex'}}>
                                <FormControlLabel
                                    style={{ pointerEvents: "none" }}
                                    control={<Checkbox color="primary" style={{ pointerEvents: "auto" }} checked={friday} onChange={(e) => setFriday(e.target.checked)} name="mon" />}
                                    label={t(langKeys.wednesday)}
                                />
                                <FormControlLabel
                                    style={{ pointerEvents: "none" }}
                                    control={<Checkbox color="primary" style={{ pointerEvents: "auto" }} checked={saturday} onChange={(e) => setSaturday(e.target.checked)} name="mon" />}
                                    label={t(langKeys.sunday)}
                                />
                            </div>
                            <FormControlLabel
                                style={{ pointerEvents: "none" }}
                                control={<Checkbox color="primary" style={{ pointerEvents: "auto" }} checked={sunday} onChange={(e) => setSunday(e.target.checked)} name="mon" />}
                                label={t(langKeys.thursday)}
                            />
                        </FormGroup><></>
                    </FormControl>
                </div>                
                <div className='col-2'>
                    <TableZyx
                            titlemodule={t(langKeys.nonWorkingdays)}     
                            columns={[]}            
                            data={[]}           
                            filterGeneral={false}
                            toolsFooter={false}                             
                    />
                    <span style={{color: 'blue', textDecoration:'underline solid', cursor: 'pointer', display: 'block'}} onClick={() => setOpenModalNonWorkingDays(true)}>
                        {t(langKeys.edit) + ' ' + t(langKeys.nonworkingdays)}
                    </span><></>
                </div>
                <div className='col-2'>
                    <TableZyx
                        titlemodule={t(langKeys.deliveryshifts)}     
                        columns={[]}            
                        data={[]}           
                        filterGeneral={false}
                        toolsFooter={false}                             
                    />
                    <span style={{color: 'blue', textDecoration:'underline solid', cursor: 'pointer', display: 'block'}} onClick={() => setOpenModalDeliveryShifts(true)}>
                        {t(langKeys.edit) + ' ' + t(langKeys.deliveryshifts)}
                    </span><></>
                </div>
                <div className='col-2'>
                    <TableZyx
                        titlemodule={t(langKeys.vehicletype)}     
                        columns={[]}            
                        data={[]}           
                        filterGeneral={false}
                        toolsFooter={false}                             
                    />
                    <span style={{color: 'blue', textDecoration:'underline solid', cursor: 'pointer', display: 'block'}} onClick={() => setOpenModalVehicleType(true)}>
                        {t(langKeys.edit) + ' ' + t(langKeys.vehicletype)}
                    </span><></>
                </div>
                <div className='col-2'>
                    <div style={{display:'flex'}}>
                        <div style={{display:'flex'}}>
                                <TableZyx
                                    titlemodule={t(langKeys.deliveryphotoorder)}     
                                    columns={[]}            
                                    data={[]}           
                                    filterGeneral={false}
                                    toolsFooter={false}                             
                                />                                
                            <div style={{ width: 6 }} />
                                <IOSSwitch checked={deliveryOrderPhoto} onChange={(e) => {setDeliveryOrderPhoto(e.target.checked)}} name="checkedB" />
                        </div>
                        <div style={{ width: 1 }} />
                    </div>
                    <span style={{color: deliveryOrderPhoto ? 'blue' : 'grey', textDecoration:'underline solid', cursor: 'pointer', display: 'block'}} onClick={() => {
                        if(deliveryOrderPhoto) setOpenModalDeliveryOrderPhoto(true)
                    }}>
                        {t(langKeys.edit) + ' ' + t(langKeys.deliveryphotoorder)}
                    </span><></>
                </div>
                <div className='col-2'>
                    <TableZyx
                        titlemodule={t(langKeys.deliveryvalidationdistance)}     
                        columns={[]}            
                        data={[]}           
                        filterGeneral={false}
                        toolsFooter={false}                             
                    />                     
                    <span style={{color: 'blue', textDecoration:'underline solid', cursor: 'pointer', display: 'block'}} onClick={() => setOpenModalCoincidenseMeters(true)}>
                        {t(langKeys.edit) + ' ' + t(langKeys.coincidencemeters)}
                    </span><></><></>
                </div>
            </div>

            <div className='row-zyx'>
                <div className='row-zyx'>
                   
                </div>
                <div style={{ display: 'flex', gap: '10px', justifyContent: 'space-between'  }}>
                    <div>
                    <TitleDetail
                            title={t(langKeys.associatedvehicles)}
                    />
                    </div>                   
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>                       
                        <Button
                            className={classes.button}
                            variant="contained"
                            color="primary"
                            type="submit"
                            startIcon={<AddIcon color="secondary" />}
                            onClick={() => {setOpenModalAssociatedVehicleDialog(true)}}
                            style={{ backgroundColor: "#55BD84" }}>
                            {t(langKeys.register)}
                        </Button>
                    </div>

                    <AssociatedVehicleDialog
                        openModal={openModalAssociatedVehicleDialog}
                        setOpenModal={setOpenModalAssociatedVehicleDialog}
                    />
                        
                    </div>
                
                <div className='row-zyx'>                
                    <TableZyx
                        columns={columns}
                        data={[]}
                        download={false}
                        filterGeneral={false}
                        register={false}
                    />
                </div>
            </div>
        </div>
    )
}

export default DeliveryConfigurationTabDetail;