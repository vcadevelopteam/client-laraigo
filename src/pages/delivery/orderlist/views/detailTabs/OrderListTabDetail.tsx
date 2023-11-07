/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react'; // we need this to make JSX compile
import { Dictionary, IFetchData } from "@types";
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import { Trans, useTranslation } from 'react-i18next';
import { langKeys } from 'lang/keys';
import { FieldErrors, UseFormGetValues, UseFormSetValue } from 'react-hook-form';
import { FieldEdit, FieldCheckbox, TitleDetail, TemplateIcons, TemplateSwitch, IOSSwitch } from 'components';
import TableZyx from "components/fields/table-simple";
import { Button, FormControlLabel, Menu, MenuItem } from '@material-ui/core';
import { useSelector } from "hooks";
import ListAltIcon from '@material-ui/icons/ListAlt';
import PrintIcon from '@material-ui/icons/Print';
import LocationOnIcon from '@material-ui/icons/LocationOn';
import ReceiptIcon from '@material-ui/icons/Receipt';




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
    fetchData: any;
    fetchDataAux: any;
}




const OrderListTabDetail: React.FC<InventoryTabDetailProps> = ({
    row,
    setValue,
    getValues,
    errors,
}) => {
    const { t } = useTranslation();
    const classes = useStyles();
    const [attentionOrders,setAttentionOrders] = useState(false);
    const executeResult = useSelector((state) => state.main.execute);
    const mainPaginated = useSelector((state) => state.main.mainPaginated);
    const [pageCount, setPageCount] = useState(0);
    const [totalrow, settotalrow] = useState(0);
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const [openModalDelivered, setOpenModalDelivered] = useState(false);
    const [openModalUndelivered, setOpenModalUndelivered] = useState(false);

    
    


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

    function handleOpenDeliveredModal () {
      setOpenModalDelivered(true);
    };
  
    function handleOpenUndeliveredModal () {
      setOpenModalUndelivered(true);
    };

    const handleClose = (e: any) => {
      e.stopPropagation();
      setAnchorEl(null);
    }


    return (
        <div className={classes.containerDetail}>
              <FormControlLabel 
                style={{paddingLeft:"10px"}}
                control={
                <IOSSwitch
                    checked={attentionOrders}
                    onChange={(event) => {
                        setAttentionOrders(event.target.checked)
                    }}
                    color='primary'
          />}
          label={t(langKeys.attentionorders)}
          className="col-5"
        />       

            <div className='row-zyx'>
              <TableZyx
                  columns={columns}
                  data={[]}                 
                  filterGeneral={true}      
                  useSelection={true}  
                  ButtonsElement={() => (
                    <div style={{textAlign:"right"}}>                      
                      <Button      
                        variant="contained"
                        color="primary"
                        disabled={mainPaginated.loading}
                        startIcon={<LocationOnIcon color="secondary" />}             
                        style={{ backgroundColor: "#55BD84", marginLeft: "10px"}}
                        onClick={(e) => {
                          setAnchorEl(e.currentTarget);
                          e.stopPropagation();
                        }}
                      >
                       <Trans i18nKey={langKeys.routinglogic} />
                      </Button>
                      <Button     
                        variant="contained"
                        color="primary"
                        disabled={mainPaginated.loading}
                        startIcon={<ListAltIcon color="secondary" />}             
                        style={{ backgroundColor: "#55BD84", marginLeft: "10px"}}
                        onClick={(e) => {
                          setAnchorEl(e.currentTarget);
                          e.stopPropagation();
                        }}
                      >
                       <Trans i18nKey={langKeys.typing} />
                      </Button>
                      <Button                        
                        variant="contained"
                        color="primary"
                        disabled={mainPaginated.loading}
                        startIcon={<PrintIcon color="secondary" />}             
                        style={{ backgroundColor: "#55BD84", marginLeft: "10px"}}
                        onClick={(e) => {
                          setAnchorEl(e.currentTarget);
                          e.stopPropagation();
                        }}
                      >
                       <Trans i18nKey={langKeys.print} />
                      </Button>
                      <Button                        
                        variant="contained"
                        color="primary"
                        disabled={mainPaginated.loading}
                        startIcon={<ReceiptIcon color="secondary" />}             
                        style={{ backgroundColor: "#55BD84", marginLeft: "10px"}}
                        onClick={(e) => {
                          setAnchorEl(e.currentTarget);
                          e.stopPropagation();
                        }}
                      >
                       <Trans i18nKey={langKeys.electronic_ticket_and_invoice} />
                      </Button>
                    </div>
                    
                    )}                   
                  loading={mainPaginated.loading}
                      
              />              
            </div>
        </div>
    )
}

export default OrderListTabDetail;