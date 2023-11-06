/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState } from 'react'; // we need this to make JSX compile
import { Dictionary } from "@types";
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import { useTranslation } from 'react-i18next';
import { langKeys } from 'lang/keys';
import { FieldErrors, UseFormGetValues, UseFormSetValue } from 'react-hook-form';
import { FieldEdit, FieldCheckbox, TitleDetail, TemplateIcons, TemplateSwitch } from 'components';
import TableZyx from "components/fields/table-simple";

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

const OrderListTabDetail: React.FC<InventoryTabDetailProps> = ({
    row,
    setValue,
    getValues,
    errors,
}) => {
    const { t } = useTranslation();
    const classes = useStyles();

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
            Header: t(langKeys.deliverynumber),
            accessor: "deliverynumber",
            width: "auto",
          },
          {
            Header: t(langKeys.ordernumber),
            accessor: "ordernumber",
            width: "auto",
          },
          {
            Header: t(langKeys.uniqueroutingcode),
            accessor: "uniqueroutingcode",
            width: "auto",
          },
          {
            Header: t(langKeys.clientname),
            accessor: "clientname",
            width: "auto",
          },
          {
            Header: t(langKeys.phone),
            accessor: "phone",
            width: "auto",
          },
          {
            Header: t(langKeys.totalamount),
            accessor: "totalamount",
            width: "auto",
          },
          {
            Header: t(langKeys.orderstatus),
            accessor: "orderstatus",
            width: "auto",
          },
          {
            Header: t(langKeys.deliverytype),
            accessor: "deliverytype",
            width: "auto",
          },
          {
            Header: t(langKeys.appointmenttype),
            accessor: "appointmenttype",
            width: "auto",
          },
          {
            Header: t(langKeys.orderdate),
            accessor: "orderdate",
            width: "auto",
          },
          {
            Header: t(langKeys.scheduleddate),
            accessor: "scheduleddate",
            width: "auto",
          },
          {
            Header: t(langKeys.scheduledshift),
            accessor: "scheduledshift",
            width: "auto",
          },
          {
            Header: t(langKeys.deliverydate),
            accessor: "deliverydate",
            width: "auto",
          },
          {
            Header: t(langKeys.ordertime),
            accessor: "ordertime",
            width: "auto",
          },
        ],
        []
    );

    return (
        <div className={classes.containerDetail}>
              <TemplateSwitch
                label={t(langKeys.attentionorders)}
                  className="col-6"
                  valueDefault={getValues('attentionorders')}
                  onChange={(value) => {
                  setValue('attentionorders', value)
                  setallowsconsecutivenumbers(value)                        
                }}
                />  

            <div className='row-zyx'>       
                                 
                <TableZyx
                    columns={columns}
                    data={[]}
                    download={true}                    
                    importData={true}
                    deleteData={true}  
                    filterGeneral={true}      
                    useSelection={true}            
                />
               
            </div>
        </div>
    )
}

export default OrderListTabDetail;