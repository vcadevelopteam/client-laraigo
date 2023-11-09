/* eslint-disable react-hooks/exhaustive-deps */
import React, { FC, useState, useEffect } from 'react'; // we need this to make JSX compile
import { Dictionary, IFetchData } from "@types";
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import { Trans, useTranslation } from 'react-i18next';
import { langKeys } from 'lang/keys';
import { FieldErrors, UseFormGetValues, UseFormSetValue } from 'react-hook-form';
import { FieldEdit, FieldCheckbox, TitleDetail, TemplateIcons, TemplateSwitch, IOSSwitch, TemplateBreadcrumbs, Title } from 'components';
import { useSelector } from "hooks";
import { showSnackbar, showBackdrop } from "store/popus/actions";
import { useDispatch } from "react-redux";
import TableZyx from 'components/fields/table-simple';
import { Typography } from '@material-ui/core';
import InvoiceA4Dialog from '../../dialogs/InvoiceA4Dialog';


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

interface InformationTabDetailProps {
    row: Dictionary | null;
    setValue: UseFormSetValue<any>;
    getValues: UseFormGetValues<any>;
    errors: FieldErrors<any>;
}

const InformationTabDetail: React.FC<InformationTabDetailProps> = ({
    row,
    setValue,
    getValues,
    errors,
}) => {
    const { t } = useTranslation();
    const classes = useStyles();
    const [attentionOrders,setAttentionOrders] = useState(false);
    const executeResult = useSelector((state) => state.main.execute);

    const dispatch = useDispatch();
    const [waitSave, setWaitSave] = useState(false);
    const [selectedRows, setSelectedRows] = useState<Dictionary>({});
    const [cleanSelected, setCleanSelected] = useState(false);
    const [waitExport, setWaitExport] = useState(false);
    const resExportData = useSelector(state => state.main.exportData);
    const [waitUpload, setWaitUpload] = useState(false);  
    const importRes = useSelector((state) => state.main.execute);
    const [openModalInvoiceA4, setOpenModalInvoiceA4] = useState(false);



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
      if (waitSave) {
        if (!executeResult.loading && !executeResult.error) {
          dispatch(
            showSnackbar({
              show: true,
              severity: "success",
              message: t(langKeys.successful_delete),
            })
          );
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
          Header: t(langKeys.description),
          accessor: "description",
          width: "auto",
        },
        {
          Header: t(langKeys.quantity),
          accessor: "quantity",
          width: "auto",
        },   
        {
          Header: t(langKeys.currency),
          accessor: "currency",
          width: "auto",
        },
        {
          Header: t(langKeys.unitaryprice),
          accessor: "unitaryprice",
          width: "auto",
        },  
        {
          Header: t(langKeys.totalamount),
          accessor: "totalamount",
          width: "auto",
        },  
      ],
      []
    );


    return (
      <div className={classes.containerDetail}>
        <div className='row-zyx'>
          <div className='row-zyx'>
            <FieldEdit
              label={t(langKeys.clientfullname)}
              className="col-8"
              type='text'
              disabled={true}
            />
            <FieldEdit
              label={t(langKeys.contactnum)}
              className="col-4"
              type='number'
              disabled={true}
            />
          </div>

          <div className='row-zyx'>
            <FieldEdit
              label={t(langKeys.deliverydate)}
              className="col-4"
              type='date'
              
            />
            <FieldEdit
              label={t(langKeys.ticket_number)}
              className="col-4"
              type='number'    
              disabled={true}         
            />

            <div className='col-4'>
              <Typography style={{fontSize:"0.9rem", fontWeight:"lighter", padding:"0 0 0.3rem 0"}}>
                {t(langKeys.paymentreceipt)}
              </Typography>  
              <span style={{color: 'blue', textDecoration:'underline solid', cursor: 'pointer' }} 
                onClick={() => setOpenModalInvoiceA4(true)}>
                {t(langKeys.viewonlinepayment)}
              </span>
            </div>           
         
          </div>

          <div className='row-zyx'>

            <div style={{paddingBottom:"2rem"}}>
              <FieldEdit
                label={t(langKeys.registeredaddress)}
                className="col-12"
                type='text'   
                disabled={true}                
              />   
            </div>           

            <div className='col-4'>
              <img 
                style={{display:"flex", textAlign:"center", width:"100%", height:"10rem", objectFit:"cover"}} 
                src="https://i0.wp.com/www.cssscript.com/wp-content/uploads/2018/03/Simple-Location-Picker.png?fit=561%2C421&ssl=1" 
                alt="map">
              </img>
            </div>
            
            <div className='col-4' style={{padding:"0rem 2rem 1rem 0"}}>
              <div  style={{paddingBottom:"2rem"}}>
                <FieldEdit
                    label={t(langKeys.latitude)}
                    className="col-3"
                    type='number'   
                    disabled={true}
                  />
              </div>
              <div  style={{paddingBottom:"2rem"}}>
                <FieldEdit
                    label={t(langKeys.longitude)}
                    className="col-3"
                    type='number'   
                    disabled={true}
                  />      
              </div>   
            </div>

            <div className='col-4'style={{padding:"0rem 2rem 1rem 0"}}>
              <div  style={{paddingBottom:"2rem"}}>
                  <FieldEdit
                      label={t(langKeys.carriername)}
                      className="col-3"
                      type='text'   
                      disabled={true}
                    />
                </div>
                <div  style={{paddingBottom:"1rem"}}>
                  <FieldEdit
                      label={t(langKeys.deliveryaddress)}
                      className="col-3"
                      type='text'   
                      disabled={true}
                    />      
                </div>      
            </div>
          </div>         
        </div>

        <Typography style={{fontSize:"2rem", paddingBottom:"0.5rem"}}>
            {t(langKeys.orderlist)}
          </Typography>  
        <div className="row-zyx">
        
          <TableZyx
            columns={columns}            
            data={[]}           
            filterGeneral={false}
            toolsFooter={false}            
          />          
        </div>
        <Typography style={{textAlign:"right", padding:"2rem 2rem 0 0", fontSize:"1rem"}}>
              {t(langKeys.total) + ": S/0.00"}
        </Typography>  

        <InvoiceA4Dialog
          openModal={openModalInvoiceA4}
          setOpenModal={setOpenModalInvoiceA4}
        />     
      </div>
      
    )
}

export default InformationTabDetail;