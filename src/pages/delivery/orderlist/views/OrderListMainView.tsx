/* eslint-disable react-hooks/exhaustive-deps */
import React, { FC, useState, useEffect } from 'react'; // we need this to make JSX compile
import { Dictionary, IFetchData } from "@types";
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import { Trans, useTranslation } from 'react-i18next';
import { langKeys } from 'lang/keys';
import { FieldErrors, UseFormGetValues, UseFormSetValue } from 'react-hook-form';
import { FieldEdit, FieldCheckbox, TitleDetail, TemplateIcons, TemplateSwitch, IOSSwitch, TemplateBreadcrumbs, Title } from 'components';
import TableZyx from "components/fields/table-simple";
import { Button, FormControlLabel, Menu, MenuItem } from '@material-ui/core';
import { useSelector } from "hooks";
import ListAltIcon from '@material-ui/icons/ListAlt';
import PrintIcon from '@material-ui/icons/Print';
import LocationOnIcon from '@material-ui/icons/LocationOn';
import ReceiptIcon from '@material-ui/icons/Receipt';
import { showSnackbar, showBackdrop, manageConfirmation} from "store/popus/actions";
import TablePaginated from "components/fields/table-paginated";
import { useDispatch } from "react-redux";
import UndeliveredDialog from '../dialogs/UndeliveredDialog';
import CanceledDialog from '../dialogs/CanceledDialog';
import AssignCarrierDialog from '../dialogs/AssignCarrierDialog';
import ManualSchedulingDialog from '../dialogs/ManualSchedulingDialog';
import ReschedulingUndeliveredDialog from '../dialogs/ReschedulingUndeliveredDialog';
import ElectronicTicketAndInvoiceDialog from '../dialogs/ElectronicTicketAndInvoiceDialog';
import PrintDialog from '../dialogs/PrintDialog';

const selectionKey = "warehouseid";

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
    setViewSelected: (view: string) => void;
    fetchData: any;
    fetchDataAux: any;
    setRowSelected: (rowdata: any) => void;
    
}

const OrderListMainView: React.FC<InventoryTabDetailProps> = ({
    setViewSelected,
    setRowSelected,
    fetchData,
    fetchDataAux,
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
    const [openModalCanceled, setOpenModalCanceled] = useState(false);
    const [openModalAssignCarrier, setOpenModalAssignCarrier] = useState(false);
    const [openModalManualScheduling, setOpenModalManualScheduling] = useState(false);
    const [openModalReschedulingUndelivered, setOpenModalReschedulingUndelivered] = useState(false);
    const [openModalElectronicTicketAndInvoice, setOpenModalElectronicTicketAndInvoice] = useState(false);
    const [openModalPrint, setOpenModalPrint] = useState(false);

    
    const dispatch = useDispatch();
    const [waitSave, setWaitSave] = useState(false);
    const [selectedRows, setSelectedRows] = useState<Dictionary>({});
    const [cleanSelected, setCleanSelected] = useState(false);
    const [waitExport, setWaitExport] = useState(false);
    const resExportData = useSelector(state => state.main.exportData);
    const [waitUpload, setWaitUpload] = useState(false);  
    const importRes = useSelector((state) => state.main.execute);
    
    const arrayBread = [
      { id: "main-view", name: t(langKeys.delivery) },
      { id: "detail-view", name: t(langKeys.orderlist) },
    ];
  
    const handleEdit = (row: Dictionary) => {    
      setRowSelected({ row, edit: true });
    };

    const handleDelete = (row: Dictionary) => {
      const callback = () => {
        /*dispatch(
          execute(insWarehouse({ ...row, operation: "DELETE", status: "ELIMINADO" }))
        );*/
        dispatch(showBackdrop(true));
        setWaitSave(true);
    };

    useEffect(() => {
      if (waitUpload) {
        if (!importRes.loading && !importRes.error) {
          dispatch(
            showSnackbar({
              show: true,
              severity: "success",
              message: t(langKeys.successful_import),
            })
          );
          dispatch(showBackdrop(false));
          setWaitUpload(false);
          fetchData(fetchDataAux);
        } else if (importRes.error) {
          dispatch(
            showSnackbar({
              show: true,
              severity: "error",
              message: t(importRes.code || "error_unexpected_error"),
            })
          );
          dispatch(showBackdrop(false));
          setWaitUpload(false);
        }
      }
    }, [importRes, waitUpload]);

    useEffect(() => {
      if (waitExport) {
          if (!resExportData.loading && !resExportData.error) {
              dispatch(showBackdrop(false));
              setWaitExport(false);
              resExportData.url?.split(",").forEach(x => window.open(x, '_blank'))
          } else if (resExportData.error) {
              const errormessage = t(resExportData.code || "error_unexpected_error", { module: t(langKeys.person).toLocaleLowerCase() })
              dispatch(showSnackbar({ show: true, severity: "error", message: errormessage }))
              dispatch(showBackdrop(false));
              setWaitExport(false);
          }
      }
    }, [resExportData, waitExport]);

    useEffect(() => {
      if (!mainPaginated.loading && !mainPaginated.error) {
        setPageCount(
          fetchDataAux.pageSize
            ? Math.ceil(mainPaginated.count / fetchDataAux.pageSize)
            : 0
        );
        settotalrow(mainPaginated.count);
      }
    }, [mainPaginated]);

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
          fetchData(fetchDataAux);
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

    dispatch(
      manageConfirmation({
        visible: true,
        question: t(langKeys.confirmation_delete),
        callback,
        })
      );
    };

    const columns = React.useMemo(
        () => [
          {
            accessor: 'orderlistid',
            NoFilter: true,
            isComponent: true,
            minWidth: 60,
            width: '1%',
            Cell: (props: any) => {
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
  
    function handleOpenUndeliveredModal () {
      setOpenModalUndelivered(true);
    };

    function handleOpenCanceledModal () {
      setOpenModalCanceled(true);
    };

    function handleOpenAssignCarrierModal () {
      setOpenModalAssignCarrier(true);
    };

    function handleOpenManualSchedulingModal () {
      setOpenModalManualScheduling(true);
    };

    function handleOpenReschedulingUndeliveredModal () {
      setOpenModalReschedulingUndelivered(true);
    };
  
    const handleClose = (e: any) => {
      e.stopPropagation();
      setAnchorEl(null);
    }

    const handleRegister = () => {
        setViewSelected("detail-view");
        setRowSelected({ row: null, edit: false });
    };

    return (
        <div 
            style={{
                width: "100%",
                display: "flex",
                flexDirection: "column",
                flex: 1,
            }}
        >
            <div
                style={{
                    display: "flex",
                    gap: 8,
                    flexDirection: "row",
                    marginBottom: 12,
                    marginTop: 4,
                  }}
            >
                <div style={{ flexGrow: 1 }}>
                    <TemplateBreadcrumbs
                        breadcrumbs={arrayBread}
                    />
                    <TitleDetail
                        title={t(langKeys.orderlist)}
                    />
                </div>
            </div>
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
            />
            <TableZyx
              columns={columns}
              data={[]}                 
              filterGeneral={true}      
              useSelection={true}
              register={true}
              handleRegister={handleRegister}
              ButtonsElement={() => (
                <div style={{ textAlign: 'right'}}>            
                    <Button      
                        variant="contained"
                        color="primary"
                        disabled={mainPaginated.loading}
                        startIcon={<LocationOnIcon color="secondary" />}             
                        style={{ backgroundColor: "#55BD84"}}                       
                    >
                        <Trans i18nKey={langKeys.routinglogic} />
                    </Button>  
                    <Button     
                        variant="contained"
                        color="primary"
                        disabled={mainPaginated.loading}
                        startIcon={<ListAltIcon color="secondary" />}             
                        style={{ backgroundColor: "#55BD84", marginLeft: "8px"}}       
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
                        style={{ backgroundColor: "#55BD84", marginLeft: "8px"}}                            
                        onClick={() => {setOpenModalPrint(true)}}
                    >
                        <Trans i18nKey={langKeys.print} />
                    </Button>
                    <Button                        
                        variant="contained"
                        color="primary"
                        disabled={mainPaginated.loading}
                        startIcon={<ReceiptIcon color="secondary" />}             
                        style={{ backgroundColor: "#55BD84", marginLeft: "8px"}}       
                        onClick={() => {setOpenModalElectronicTicketAndInvoice(true)}}
                    >
                        <Trans i18nKey={langKeys.electronic_ticket_and_invoice} />
                    </Button>
                    <Button                        
                        variant="contained"
                        color="primary"
                        disabled={mainPaginated.loading}
                        startIcon={<ReceiptIcon color="secondary" />}             
                        style={{ backgroundColor: "#55BD84", marginLeft: "8px"}}       
                        onClick={() => {
                          setViewSelected("detail-view2");
                          setRowSelected({ row: null, edit: false });
                        }}
                    >
                        <Trans i18nKey={langKeys.test} />
                    </Button>
                </div>
              )}                   
              loading={mainPaginated.loading}                     
            />    
            <Menu
                id="menu-appbar"
                anchorEl={null}
                getContentAnchorEl={null}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: "right",
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                open={Boolean(anchorEl)}
                onClose={handleClose}
            >
                <MenuItem
                    onClick={(e) => {
                        e.stopPropagation();
                        setAnchorEl(null);
                        handleOpenAssignCarrierModal();
                    }}
                >
                    <Trans i18nKey={langKeys.assigned} />
                </MenuItem>

                <MenuItem
                    onClick={(e) => {
                        e.stopPropagation();
                        setAnchorEl(null);
                        handleOpenUndeliveredModal();
                    }}
                >
                    <Trans i18nKey={langKeys.undelivered} />
                </MenuItem>

                <MenuItem
                    onClick={(e) => {
                        e.stopPropagation();
                        setAnchorEl(null);
                        handleOpenCanceledModal();
                    }}
                >
                    <Trans i18nKey={langKeys.cancel} />
                </MenuItem>    

                <MenuItem
                    onClick={(e) => {
                        e.stopPropagation();
                        setAnchorEl(null);
                        handleOpenManualSchedulingModal();
                    }}
                >
                    <Trans i18nKey={langKeys.manualscheduling} />
                </MenuItem>    

                <MenuItem
                    onClick={(e) => {
                        e.stopPropagation();
                        setAnchorEl(null);
                        handleOpenReschedulingUndeliveredModal();
                    }}
                >
                    <Trans i18nKey={`${t(langKeys.rescheduling)}` + " - " + `${t(langKeys.undelivered)}`} />
                </MenuItem>    
                       
            </Menu>         

            <UndeliveredDialog
                openModal={openModalUndelivered}
                setOpenModal={setOpenModalUndelivered}
            />    
            <CanceledDialog
                openModal={openModalCanceled}
                setOpenModal={setOpenModalCanceled}
            />  
            <AssignCarrierDialog
                openModal={openModalAssignCarrier}
                setOpenModal={setOpenModalAssignCarrier}
            />    
            <ManualSchedulingDialog
                openModal={openModalManualScheduling}
                setOpenModal={setOpenModalManualScheduling}
            />  
            <ReschedulingUndeliveredDialog
                openModal={openModalReschedulingUndelivered}
                setOpenModal={setOpenModalReschedulingUndelivered}
            />  
            <ElectronicTicketAndInvoiceDialog
                openModal={openModalElectronicTicketAndInvoice}
                setOpenModal={setOpenModalElectronicTicketAndInvoice}
            />
            <PrintDialog
                openModal={openModalPrint}
                setOpenModal={setOpenModalPrint}
            />
        </div>
    )
}

export default OrderListMainView;