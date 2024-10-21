import React, { ChangeEvent, useEffect, useState } from 'react'; 
import { Dictionary } from "@types";
import { makeStyles } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';
import { langKeys } from 'lang/keys';
import { TitleDetail, TemplateIcons, IOSSwitch, FieldEdit } from 'components';
import TableZyx from "components/fields/table-simple";
import { Checkbox, FormControl, FormControlLabel, FormGroup } from '@material-ui/core';
import Tooltip from '@material-ui/core/Tooltip';
import AssociatedVehicleDialog from '../../dialogs/AssociatedVehicleDialog';
import InfoRoundedIcon from '@material-ui/icons/InfoRounded';
import { CellProps } from 'react-table';
import { useSelector } from 'hooks';
import { execute } from "store/main/actions";
import { deliveryVehicleIns } from 'common/helpers';
import { showSnackbar,  showBackdrop,  manageConfirmation,} from "store/popus/actions";
import { useDispatch } from "react-redux";

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
    checkboxContainer: {
        display: 'flex', 
        alignItems: 'center',
    },
    checkboxLabel: {
        color: 'blue',
        textDecoration: 'underline',
        cursor: 'pointer'
    },
    formControlLabelPointer: {
        pointerEvents: "none"
    },
    checkboxPointer: {
        pointerEvents: "auto"
    },
    flex: {
        display: 'flex',
    },
}));

interface VehicleType {
    vehicle: string;
    insuredamount: number;
    speed: number;
    capacity: number;
}

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
    setOpenModalNonWorkingDays: (flag: boolean) => void;
    setOpenModalDeliveryShifts: (flag: boolean) => void;
    setOpenModalVehicleType: (flag: boolean) => void;
    setOpenModalDeliveryOrderPhoto: (flag: boolean) => void;
    setOpenModalAutomaticDelivery: (flag: boolean) => void;
    setOpenModalMotiveDialog: (flag: boolean) => void;
    fetchConfiguration: () => void;
    fetchVehicles: () => void;
    setConfigjson: (data: any) => void;
    configjson: Dictionary;
    vehicleTypes: VehicleType[];
}

interface RowSelected {
    row2: Dictionary | null;
    edit: boolean;
}

const DeliveryConfigurationTabDetail: React.FC<ConfigurationTabDetailProps> = ({  
    setOpenModalNonWorkingDays,
    setOpenModalDeliveryShifts,
    setOpenModalVehicleType,
    setOpenModalDeliveryOrderPhoto,
    setOpenModalAutomaticDelivery,
    setOpenModalMotiveDialog,
    fetchConfiguration,
    fetchVehicles,
    setConfigjson,
    configjson,
    vehicleTypes,
}) => {
    const { t } = useTranslation();
    const classes = useStyles();
    const [openModalAssociatedVehicleDialog, setOpenModalAssociatedVehicleDialog] = useState(false)
    const mainVehicles = useSelector(state => state.main.mainAux);
    const dispatch = useDispatch();
    const [waitSave, setWaitSave] = useState(false);
    const executeResult = useSelector((state) => state.main.execute);
    const user = useSelector(state => state.login.validateToken.user);

    const [selectedRow, setSelectedRow] = useState<RowSelected>({
        row2: null,
        edit: false,
    });

    function handleRegister() {
        setSelectedRow({row2: null, edit: false})
        setOpenModalAssociatedVehicleDialog(true)
    }

    const handleEdit = (row2: Dictionary) => {   
        setSelectedRow({ row2, edit: true });
        setOpenModalAssociatedVehicleDialog(true)
    }

    const handleDelete = (row2: Dictionary) => {   
        const callback = () => {
            dispatch(
              execute(deliveryVehicleIns({ ...row2, id: row2.deliveryvehicleid, operation: "DELETE", status: "ELIMINADO"}))
            );
            dispatch(showBackdrop(true));
            setWaitSave(true);
          };
      
          dispatch(
            manageConfirmation({
              visible: true,
              question: t(langKeys.confirmation_delete),
              callback,
            })
          );
    }

    useEffect(() => {
        if (waitSave) {
          if (!executeResult.loading && !executeResult.error) {
            dispatch(
              showSnackbar({
                show: true,
                severity: "success",
                message: t(langKeys.successful_delete),
              })
            );          
            fetchVehicles();
            dispatch(showBackdrop(false));
            setWaitSave(false);
          } else if (executeResult.error) {
            const errormessage = t(executeResult.code || "error_unexpected_error", {
              module: t(langKeys.domain).toLocaleLowerCase(),
            });
            dispatch(
              showSnackbar({ show: true, severity: "error", message: errormessage })
            );
            dispatch(showBackdrop(false));
            setWaitSave(false);
          }
        }
    }, [executeResult, waitSave]);

    <TitleDetail
    title={user?.corpdesc}
/>

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
                        deleteFunction={() => handleDelete(row)}
                        editFunction={() => handleEdit(row)}
                    />
                )
            }
          },        
          {
            Header: t(langKeys.organization),
            accessor: "orgdesc",
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
            accessor: "capacity",
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

    const handleChange = (name: string) => (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) {
            // Contar cuántos checkboxes están en true
            const checkedCount = [configjson.automatica, configjson.manuala, configjson.predefineda, configjson.inmediatea].filter(value => value).length;
    
            // Permitir el cambio solo si hay menos de 2 checkboxes en true
            if (checkedCount < 2 || configjson[name]) {
                setConfigjson({ ...configjson, [name]: e.target.checked });
            }
        } else {
            setConfigjson({ ...configjson, [name]: e.target.checked });
        }
    };

    return (
        <div className={classes.containerDetail}>
            <div className='row-zyx'>
                <div className='col-3'>                                  
                    <FormControl component="fieldset" >                                             
                        <CustomTitleHelper title={t(langKeys.appointmenttype)}/>
                        <FormGroup>
                            <div className={classes.checkboxContainer}>
                                <Checkbox 
                                    color="primary" 
                                    style={{ paddingLeft: 0 }}
                                    checked={configjson.automatica} 
                                    onChange={handleChange('automatica')} 
                                    name="auto" 
                                />
                                <span
                                    onClick={() => setOpenModalAutomaticDelivery(true)}
                                    className={classes.checkboxLabel}
                                >
                                    {t(langKeys.automatic)}
                                </span>
                            </div>
                            <FormControlLabel
                                className={classes.formControlLabelPointer}
                                control={
                                <Checkbox 
                                    color="primary" 
                                    className={classes.checkboxPointer}
                                    checked={configjson.manuala} 
                                    onChange={handleChange('manuala')} 
                                    name="man" 
                                />}
                                label={t(langKeys.manual)}
                            />
                            <FormControlLabel
                                className={classes.formControlLabelPointer}
                                control={
                                    <Checkbox 
                                        color="primary" 
                                        className={classes.checkboxPointer}
                                        checked={configjson.predefineda} 
                                        onChange={handleChange('predefineda')} 
                                        name="predef" 
                                    />}
                                label={t(langKeys.default2)}
                            />
                            <FormControlLabel
                                className={classes.formControlLabelPointer}
                                control={
                                <Checkbox 
                                    color="primary"
                                    className={classes.checkboxPointer}
                                    checked={configjson.inmediatea}
                                    onChange={()=>{
                                        setConfigjson({...configjson, inmediatea: true})
                                    }}
                                    name="immediate"
                                />}
                                label={t(langKeys.immediate)}
                            />
                        </FormGroup>
                    </FormControl>
                </div>
                <div className='col-3'>                                  
                    <FormControl component="fieldset" >                       
                        <CustomTitleHelper title={t(langKeys.documentsissuance)}/>     
                        <FormGroup>
                            <FormControlLabel
                                className={classes.formControlLabelPointer}
                                control={
                                    <Checkbox
                                        color="primary"
                                        className={classes.checkboxPointer}
                                        checked={configjson.invoiced}
                                        onChange={(e) => {
                                            setConfigjson({...configjson, invoiced: e.target.checked})
                                        }} 
                                        name="sun" 
                                    />
                                }
                                label={t(langKeys.electronic_ticket_and_invoice)}
                            />
                            <FormControlLabel
                                className={classes.formControlLabelPointer}
                                control={
                                    <Checkbox
                                        color="primary" 
                                        className={classes.checkboxPointer}
                                        checked={configjson.shareinvoiced}
                                        onChange={(e) => {
                                            setConfigjson({...configjson, shareinvoiced: e.target.checked})
                                        }} 
                                        name="mon"
                                    />
                                }
                                label={t(langKeys.sharevoucher)}
                            />
                            <FormControlLabel
                                className={classes.formControlLabelPointer}
                                control={
                                    <Checkbox
                                        color="primary"
                                        className={classes.checkboxPointer}
                                        checked={configjson.guided}
                                        onChange={(e) => {
                                            setConfigjson({...configjson, guided: e.target.checked})
                                        }} 
                                        name="tue"
                                    />
                                }
                                label={t(langKeys.referralguide)}
                            />
                        </FormGroup>
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
                                className={classes.formControlLabelPointer}
                                control={
                                    <Checkbox
                                        disabled={!configjson.shareinvoiced}
                                        color="primary"
                                        className={classes.checkboxPointer}
                                        checked={configjson.wspi}
                                        onChange={(e) => {
                                            setConfigjson({...configjson, wspi: e.target.checked})
                                        }}
                                        name="sun"
                                    />
                                }
                                label={t(langKeys.WHATSAPP)}
                            />
                            <FormControlLabel
                                className={classes.formControlLabelPointer}
                                control={
                                    <Checkbox
                                        disabled={!configjson.shareinvoiced}
                                        color="primary"
                                        className={classes.checkboxPointer}
                                        checked={configjson.emaili}
                                        onChange={(e) => {
                                            setConfigjson({...configjson, emaili: e.target.checked})
                                        }}
                                        name="mon"
                                    />
                                }
                                label={t(langKeys.emitteremail)}
                            />
                        </FormGroup>
                    </FormControl>
                </div>
                <div className='col-3'>                                  
                    <FormControl component="fieldset">                       
                        <CustomTitleHelper
                           title={t(langKeys.sendnotification)}     
                           helperText={t(langKeys.send_notification_helper_text)}                         
                        />     
                        <FormGroup>
                            <FormControlLabel
                                className={classes.formControlLabelPointer}
                                control={
                                    <Checkbox
                                        color="primary"
                                        className={classes.checkboxPointer}
                                        checked={configjson.sendschedulen}
                                        onChange={(e) => {
                                            setConfigjson({...configjson, sendschedulen: e.target.checked})
                                        }}
                                        name="sun"
                                    />
                                }
                                label={t(langKeys.sendduringscheduling)}
                            />
                            <FormControlLabel
                                className={classes.formControlLabelPointer}
                                control={
                                    <Checkbox 
                                        color="primary"
                                        className={classes.checkboxPointer}
                                        checked={configjson.senddispatchn}
                                        onChange={(e) => {
                                            setConfigjson({...configjson, senddispatchn: e.target.checked})
                                        }}
                                        name="mon"
                                    />
                                }
                                label={t(langKeys.sendduringshipment)}
                            />
                        </FormGroup>
                    </FormControl>
                </div>
                <div className='col-3'>                                  
                    <FormControl component="fieldset" >                        
                        <CustomTitleHelper title={t(langKeys.notificationtype)}/>        
                        <FormGroup>
                            <FormControlLabel
                                className={classes.formControlLabelPointer}
                                control={
                                    <Checkbox
                                        color="primary"
                                        disabled={!configjson.senddispatchn && !configjson.sendschedulen}
                                        className={classes.checkboxPointer}
                                        checked={configjson.smsn}
                                        onChange={(e) => {
                                            setConfigjson({...configjson, smsn: e.target.checked})
                                        }}
                                        name="sun"
                                    />
                                }
                                label={t(langKeys.sms)}
                            />
                            <FormControlLabel
                                className={classes.formControlLabelPointer}
                                control={
                                    <Checkbox
                                        color="primary"
                                        disabled={!configjson.senddispatchn && !configjson.sendschedulen}
                                        className={classes.checkboxPointer}
                                        checked={configjson.wspn}
                                        onChange={(e) => {
                                            setConfigjson({...configjson, wspn: e.target.checked})
                                        }}
                                        name="mon"
                                    />
                                }
                                label={t(langKeys.WHATSAPP)}
                            />
                            <FormControlLabel
                                className={classes.formControlLabelPointer}
                                control={
                                    <Checkbox
                                        color="primary"
                                        disabled={!configjson.senddispatchn && !configjson.sendschedulen}
                                        className={classes.checkboxPointer}
                                        checked={configjson.emailn}
                                        onChange={(e) => {
                                            setConfigjson({...configjson, emailn: e.target.checked})
                                        }}
                                        name="tue"
                                    />
                                }
                                label={t(langKeys.emitteremail)}
                            />
                        </FormGroup>
                    </FormControl>
                </div>
                <div className='col-3'>                                  
                    <FormControl component="fieldset" >
                        <div className={classes.checkboxContainer}>
                            <CustomTitleHelper title={t(langKeys.routinglogic)}/>                                
                            <div style={{ width: 6 }} />
                            <IOSSwitch
                                checked={configjson.routinglogic}
                                onChange={(e) => {
                                    setConfigjson({...configjson, routinglogic: e.target.checked})
                                }}
                                name="checkedB"
                            />
                        </div>
                        <FormGroup>
                            <FormControlLabel
                                className={classes.formControlLabelPointer}
                                control={
                                    <Checkbox
                                        color="primary"
                                        className={classes.checkboxPointer}
                                        checked={configjson.insuredlimitr}
                                        onChange={(e) => {
                                            setConfigjson({...configjson, insuredlimitr: e.target.checked})
                                        }}
                                        name="sun"
                                    />
                                }
                                label={t(langKeys.insuredlimit)}
                                disabled={!configjson.routinglogic}
                            />
                            <FormControlLabel
                                className={classes.formControlLabelPointer}
                                control={
                                    <Checkbox
                                        color="primary"
                                        className={classes.checkboxPointer}
                                        checked={configjson.capacityr}
                                        onChange={(e) => {
                                            setConfigjson({...configjson, capacityr: e.target.checked})
                                        }}
                                        name="mon"
                                    />
                                }
                                label={t(langKeys.CAPACITY)}
                                disabled={!configjson.routinglogic}
                            />
                        </FormGroup>
                    </FormControl>
                </div>
                <div className='col-3'>     
                    <CustomTitleHelper title={t(langKeys.deliveryshifts)}/>     
                    <span className={classes.span} onClick={() => setOpenModalDeliveryShifts(true)}>
                        {t(langKeys.edit) + ' ' + t(langKeys.deliveryshifts)}
                    </span>
                </div>
                <div className='col-3'>   
                    <CustomTitleHelper title={t(langKeys.vehicletype)}/>                                
                    <span className={classes.span} onClick={() => setOpenModalVehicleType(true)}>
                        {t(langKeys.edit) + ' ' + t(langKeys.vehicletype)}
                    </span>
                </div>
                <div className='col-3'>                                  
                    <FormControl component="fieldset">
                        <CustomTitleHelper title={t(langKeys.workingdays)}/>                           
                        <FormGroup>
                            <div className={classes.flex}>
                                <FormControlLabel
                                    className={classes.formControlLabelPointer}
                                    control={
                                        <Checkbox
                                            color="primary"
                                            className={classes.checkboxPointer}
                                            checked={configjson.monday}
                                            onChange={(e) => {
                                                setConfigjson({...configjson, monday: e.target.checked})}
                                            }
                                            name="monday"
                                        />
                                    }
                                    label={t(langKeys.monday)}
                                />
                                <FormControlLabel
                                    className={classes.formControlLabelPointer}
                                    control={
                                        <Checkbox
                                            color="primary"
                                            style={{ pointerEvents: "auto", paddingLeft:"2rem" }}
                                            checked={configjson.friday}
                                            onChange={(e) => {
                                                setConfigjson({...configjson, friday: e.target.checked})}
                                            }
                                            name="motuesdayn"
                                        />
                                    }
                                    label={t(langKeys.friday)}
                                />
                            </div>
                            <div className={classes.flex}>
                                <FormControlLabel
                                    className={classes.formControlLabelPointer}
                                    control={
                                        <Checkbox
                                            color="primary"
                                            className={classes.checkboxPointer}
                                            checked={configjson.tuesday}
                                            onChange={(e) => {
                                                setConfigjson({...configjson, tuesday: e.target.checked})
                                            }}
                                            name="wednesday"
                                        />
                                    }
                                    label={t(langKeys.tuesday)}
                                />
                                <FormControlLabel
                                    className={classes.formControlLabelPointer}
                                    control={
                                        <Checkbox
                                            color="primary"
                                            style={{ pointerEvents: "auto", paddingLeft:"1.5rem"}}
                                            checked={configjson.saturday}
                                            onChange={(e) => {
                                                setConfigjson({...configjson, saturday: e.target.checked})
                                            }}
                                            name="thursday"
                                        />
                                    }
                                    label={t(langKeys.saturday)}
                                />
                            </div>
                            <div className={classes.flex}>
                                <FormControlLabel
                                    className={classes.formControlLabelPointer}
                                    control={
                                        <Checkbox
                                            color="primary"
                                            className={classes.checkboxPointer}
                                            checked={configjson.wednesday}
                                            onChange={(e) => {
                                                setConfigjson({...configjson, wednesday: e.target.checked})
                                            }}
                                            name="friday"
                                        />
                                    }
                                    label={t(langKeys.wednesday)}
                                />
                                <FormControlLabel
                                    className={classes.formControlLabelPointer}
                                    control={
                                        <Checkbox
                                            color="primary"
                                            className={classes.checkboxPointer}
                                            checked={configjson.sunday}
                                            onChange={(e) =>{
                                                setConfigjson({...configjson, sunday: e.target.checked})
                                            }}
                                            name="saturday"
                                        />
                                    }
                                    label={t(langKeys.sunday)}
                                />
                            </div>
                            <FormControlLabel
                                className={classes.formControlLabelPointer}                                
                                control={
                                    <Checkbox
                                        color="primary"
                                        className={classes.checkboxPointer}
                                        checked={configjson.thursday}
                                        onChange={(e) => {
                                            setConfigjson({...configjson, thursday: e.target.checked})
                                        }}
                                        name="sunday"
                                    />
                                }
                                label={t(langKeys.thursday)}
                            />
                        </FormGroup>
                    </FormControl>
                </div>
                <div className='col-3'>    
                    <CustomTitleHelper title={t(langKeys.nonWorkingdays)}/>           
                    <span className={classes.span} onClick={() => setOpenModalNonWorkingDays(true)}>
                        {t(langKeys.edit) + ' ' + t(langKeys.nonworkingdays)}
                    </span>
                </div>
                <div className='col-3'>                                  
                    <div className={classes.flex}>
                        <div className={classes.flex}>
                            <CustomTitleHelper title={t(langKeys.deliveryphotoorder)}/>
                            <div style={{ width: 6 }} />
                                <IOSSwitch
                                    checked={configjson.deliveryphoto}
                                    onChange={(e) => setConfigjson({...configjson, deliveryphoto: e.target.checked})}
                                    name="checkedB"
                                />
                        </div>
                        <div style={{ width: 10 }} />
                    </div>
                    <span className={classes.spandisabled} style={{color: configjson.deliveryphoto ? 'blue' : 'grey'}} onClick={() => {
                        if(configjson.deliveryphoto) setOpenModalDeliveryOrderPhoto(true)
                    }}>
                        {t(langKeys.edit) + ' ' + t(langKeys.deliveryphotoorder)}
                    </span>
                </div>
                <div className='col-3'>
                    <CustomTitleHelper title={t(langKeys.deliveryvalidationdistance)}/>
                    <div style={{ width: 300 }}>
                        <FieldEdit
                            valueDefault={configjson.validationdistance}
                            className="col-2"
                            type='number'
                            onChange={(value) => setConfigjson({...configjson, validationdistance: value})}
                        />
                    </div>
                </div>
                <div className='col-3'>
                    <CustomTitleHelper title={`${t(langKeys.ticket_reason)} y ${t(langKeys.submotive)} de ${t(langKeys.undelivered)}`}/>
                    <span className={classes.span} onClick={() => setOpenModalMotiveDialog(true)}>
                        {t(langKeys.edit) + ' ' + t(langKeys.ticket_reason) + ' y ' + t(langKeys.submotive)}
                    </span>
                </div>
            </div>
            <div className='row-zyx'>
                <div>
                    <div>
                        <TitleDetail title={t(langKeys.associatedvehicles)}/>
                    </div>                  
                    <AssociatedVehicleDialog
                        openModal={openModalAssociatedVehicleDialog}
                        setOpenModal={setOpenModalAssociatedVehicleDialog}    
                        data={selectedRow}   
                        fetchVehicles={fetchVehicles}
                        vehicleTypes={vehicleTypes}
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