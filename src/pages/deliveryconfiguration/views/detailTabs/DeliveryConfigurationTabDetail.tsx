import React, { useEffect, useState } from 'react'; 
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
    setOpenModalNonWorkingDays: (flag: boolean) => void;
    setOpenModalNonWorkingDaysCopy: (flag: boolean) => void;
    setOpenModalDeliveryShifts: (flag: boolean) => void;
    setOpenModalVehicleType: (flag: boolean) => void;
    setOpenModalDeliveryOrderPhoto: (flag: boolean) => void;
    fetchConfiguration: () => void;
    fetchVehicles: () => void;
    setConfigjson: (data: any) => void;
    configjson: Dictionary;
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
    setConfigjson,
    configjson,
}) => {
    const { t } = useTranslation();
    const classes = useStyles();
    const [openModalAssociatedVehicleDialog, setOpenModalAssociatedVehicleDialog] = useState(false)
    const [routingLogic, setRoutingLogic] = useState(configjson.routingLogic);
    const mainVehicles = useSelector(state => state.main.mainAux);
    const dispatch = useDispatch();
    const [waitSave, setWaitSave] = useState(false);
    const executeResult = useSelector((state) => state.main.execute);

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
        fetchConfiguration()
        fetchVehicles()
    }, [])

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
                                    checked={configjson.automaticA} 
                                    onChange={(e) => {
                                        setConfigjson({...configjson, automaticA: e.target.checked})
                                    }} 
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
                                    checked={configjson.manualA} 
                                    onChange={(e) => {
                                        setConfigjson({...configjson, manualA: e.target.checked})
                                    }} 
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
                                        checked={configjson.predefinedA} 
                                        onChange={(e) => {
                                            setConfigjson({...configjson, predefinedA: e.target.checked})

                                        }} 
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
                                    checked={configjson.inmediateA}
                                    onChange={()=>{
                                        setConfigjson({...configjson, inmediateA: true})
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
                                style={{ pointerEvents: "none" }}
                                control={
                                    <Checkbox color="primary" style={{ pointerEvents: "auto" }}
                                        checked={configjson.invoiceD}
                                        onChange={(e) => {
                                            setConfigjson({...configjson, invoiceD: e.target.checked})
                                        }} 
                                        name="sun" 
                                    />
                                }
                                label={t(langKeys.electronic_ticket_and_invoice)}
                            />
                            <FormControlLabel
                                style={{ pointerEvents: "none" }}
                                control={
                                    <Checkbox color="primary" 
                                        style={{ pointerEvents: "auto" }} 
                                        checked={configjson.shareInvoiceD}
                                        onChange={(e) => {
                                            setConfigjson({...configjson, shareInvoiceD: e.target.checked})
                                        }} 
                                        name="mon"
                                    />
                                }
                                label={t(langKeys.sharevoucher)}
                            />
                            <FormControlLabel
                                style={{ pointerEvents: "none" }}
                                control={
                                    <Checkbox color="primary" 
                                        style={{ pointerEvents: "auto" }}
                                        checked={configjson.guideD}
                                        onChange={(e) => {
                                            setConfigjson({...configjson, guideD: e.target.checked})
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
                                style={{ pointerEvents: "none" }}
                                control={
                                    <Checkbox
                                        color="primary"
                                        style={{ pointerEvents: "auto" }}
                                        checked={configjson.wspI}
                                        onChange={(e) => {
                                            setConfigjson({...configjson, wspI: e.target.checked})
                                        }}
                                        name="sun"
                                    />
                                }
                                label={t(langKeys.WHATSAPP)}
                            />
                            <FormControlLabel
                                style={{ pointerEvents: "none" }}
                                control={
                                    <Checkbox
                                        color="primary"
                                        style={{ pointerEvents: "auto" }}
                                        checked={configjson.emailI}
                                        onChange={(e) => {
                                            setConfigjson({...configjson, emailI: e.target.checked})
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
                           helperText={t(langKeys.send_invoice_helper_text)}                         
                        />     
                        <FormGroup>
                            <FormControlLabel
                                style={{ pointerEvents: "none" }}
                                control={
                                    <Checkbox
                                        color="primary"
                                        style={{ pointerEvents: "auto" }}
                                        checked={configjson.sendScheduleN}
                                        onChange={(e) => {
                                            setConfigjson({...configjson, sendScheduleN: e.target.checked})
                                        }}
                                        name="sun"
                                    />
                                }
                                label={t(langKeys.sendduringscheduling)}
                            />
                            <FormControlLabel
                                style={{ pointerEvents: "none" }}
                                control={
                                    <Checkbox 
                                        color="primary"
                                        style={{ pointerEvents: "auto" }}
                                        checked={configjson.sendDispatchN}
                                        onChange={(e) => {
                                            setConfigjson({...configjson, sendDispatchN: e.target.checked})
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
                                style={{ pointerEvents: "none" }}
                                control={
                                    <Checkbox
                                        color="primary"
                                        style={{ pointerEvents: "auto" }}
                                        checked={configjson.smsN}
                                        onChange={(e) => {
                                            setConfigjson({...configjson, smsN: e.target.checked})
                                        }}
                                        name="sun"
                                    />
                                }
                                label={t(langKeys.sms)}
                            />
                            <FormControlLabel
                                style={{ pointerEvents: "none" }}
                                control={
                                    <Checkbox
                                        color="primary"
                                        style={{ pointerEvents: "auto" }}
                                        checked={configjson.wspN}
                                        onChange={(e) => {
                                            setConfigjson({...configjson, wspN: e.target.checked})
                                        }}
                                        name="mon"
                                    />
                                }
                                label={t(langKeys.WHATSAPP)}
                            />
                            <FormControlLabel
                                style={{ pointerEvents: "none" }}
                                control={
                                    <Checkbox
                                        color="primary"
                                        style={{ pointerEvents: "auto" }}
                                        checked={configjson.emailN}
                                        onChange={(e) => {
                                            setConfigjson({...configjson, emailN: e.target.checked})
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
                        <div style={{display:'flex'}}>
                            <CustomTitleHelper title={t(langKeys.routinglogic)}/>                                
                            <div style={{ width: 6 }} />
                            <IOSSwitch
                                checked={configjson.routingLogic}
                                onChange={(e) => {
                                    setRoutingLogic(e.target.checked)
                                    setConfigjson({...configjson, routingLogic: e.target.checked})
                                }}
                                name="checkedB"
                            />
                        </div>
                        <FormGroup>
                            <FormControlLabel
                                style={{ pointerEvents: "none" }}
                                control={
                                    <Checkbox
                                        color="primary"
                                        style={{ pointerEvents: "auto" }}
                                        checked={configjson.insuredLimitR}
                                        onChange={(e) => {
                                            setConfigjson({...configjson, insuredLimitR: e.target.checked})
                                        }}
                                        name="sun"
                                    />
                                }
                                label={t(langKeys.insuredlimit)}
                                disabled={!routingLogic}
                            />
                            <FormControlLabel
                                style={{ pointerEvents: "none" }}
                                control={
                                    <Checkbox
                                        color="primary"
                                        style={{ pointerEvents: "auto" }}
                                        checked={configjson.capacityR}
                                        onChange={(e) => {
                                            setConfigjson({...configjson, capacityR: e.target.checked})
                                        }}
                                        name="mon"
                                    />
                                }
                                label={t(langKeys.CAPACITY)}
                                disabled={!routingLogic}
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
                            <div style={{display:'flex'}}>
                                <FormControlLabel
                                    style={{ pointerEvents: "none" }}
                                    control={
                                        <Checkbox
                                            color="primary"
                                            style={{ pointerEvents: "auto" }}
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
                                    style={{ pointerEvents: "none" }}
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
                            <div style={{display:'flex'}}>
                                <FormControlLabel
                                    style={{ pointerEvents: "none" }}
                                    control={
                                        <Checkbox
                                            color="primary"
                                            style={{ pointerEvents: "auto" }}
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
                                    style={{ pointerEvents: "none" }}
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
                            <div style={{display:'flex'}}>
                                <FormControlLabel
                                    style={{ pointerEvents: "none" }}
                                    control={
                                        <Checkbox
                                            color="primary"
                                            style={{ pointerEvents: "auto" }}
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
                                    style={{ pointerEvents: "none" }}
                                    control={
                                        <Checkbox
                                            color="primary"
                                            style={{ pointerEvents: "auto" }}
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
                                className={classes.thursdayseparation}                                
                                control={
                                    <Checkbox
                                        color="primary"
                                        style={{ pointerEvents: "auto" }}
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
                            valueDefault={configjson.validationDistance}
                            className="col-2"
                            type='number'
                            onChange={(value) => setConfigjson({...configjson, validationDistance: value})}
                        />
                    </div>
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