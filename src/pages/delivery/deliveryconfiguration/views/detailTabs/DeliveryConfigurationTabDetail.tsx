/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState } from 'react'; // we need this to make JSX compile
import { Dictionary } from "@types";
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import { useTranslation } from 'react-i18next';
import { langKeys } from 'lang/keys';
import { FieldErrors, UseFormGetValues, UseFormSetValue } from 'react-hook-form';
import { FieldEdit, FieldCheckbox, TitleDetail, TemplateIcons } from 'components';
import TableZyx from "components/fields/table-simple";
import { Button } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import AssociatedVehicleDialog from '../../dialogs/AssociatedVehicleDialog';



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

interface InventoryTabDetailProps {
    row: Dictionary | null;
    setValue: UseFormSetValue<any>;
    getValues: UseFormGetValues<any>;
    errors: FieldErrors<any>;
}

const DeliveryConfigurationTabDetail: React.FC<InventoryTabDetailProps> = ({
    row,
    setValue,
    getValues,
    errors,
}) => {
    const { t } = useTranslation();
    const classes = useStyles();
    const [openModalAssociatedVehicleDialog, setOpenModalAssociatedVehicleDialog] = useState(false)


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
            <div className="row-zyx">
                <FieldCheckbox
                    label={t(langKeys.appointmenttype)}
                    className="col-4"
                    valueDefault={getValues("ispredeterminate")}
                    onChange={(value) => setValue("ispredeterminate", value)}
                />
                <FieldCheckbox
                    label={t(langKeys.documentsissuance)}
                    className="col-4"
                    valueDefault={getValues("ispredeterminate")}
                    onChange={(value) => setValue("ispredeterminate", value)}
                />
                <FieldCheckbox
                    label={t(langKeys.send_invoice)}
                    className="col-4"
                    valueDefault={getValues("ispredeterminate")}
                    onChange={(value) => setValue("ispredeterminate", value)}
                    /*helpertexto*/
                />
                <FieldCheckbox
                    label={t(langKeys.sendnotification)}
                    className="col-4"
                    valueDefault={getValues("ispredeterminate")}
                    onChange={(value) => setValue("ispredeterminate", value)}
                   /*helpertexto*/
                />
                <FieldCheckbox
                    label={t(langKeys.notificationtype)}
                    className="col-4"
                    valueDefault={getValues("ispredeterminate")}
                    onChange={(value) => setValue("ispredeterminate", value)}
                />
                <FieldCheckbox
                    label={t(langKeys.routinglogic)}
                    className="col-4"
                    valueDefault={getValues("ispredeterminate")}
                    onChange={(value) => setValue("ispredeterminate", value)}
                />
                <FieldCheckbox                    
                    label={t(langKeys.workingdays)}
                    className="col-4"
                    valueDefault={getValues("ispredeterminate")}
                    onChange={(value) => setValue("ispredeterminate", value)}
                />                    
                <FieldEdit
                    label={t(langKeys.nonWorkingdays)}
                    valueDefault={getValues('nonWorkingdays')}
                    className="col-4"
                    onChange={(value) => setValue('name', value)}   
                />
                <FieldEdit
                    label={t(langKeys.deliveryshifts)}
                    valueDefault={getValues('name')}
                    className="col-4"
                    onChange={(value) => setValue('name', value)}
                    helperText={t(langKeys.send_invoice_helper_text)}

                />
                <FieldEdit
                    label={t(langKeys.vehicletype)}
                    valueDefault={getValues('name')}
                    className="col-4"
                    onChange={(value) => setValue('name', value)}
                    helperText={t(langKeys.sendnotification_helper_text)}

                />
                <FieldEdit
                    label={t(langKeys.deliveryphotoorder)}
                    valueDefault={getValues('name')}
                    className="col-4"
                    onChange={(value) => setValue('name', value)}
                />
                <FieldEdit
                    label={t(langKeys.deliveryvalidationdistance)}
                    valueDefault={getValues('name')}
                    className="col-4"
                    onChange={(value) => setValue('name', value)}
                />

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