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
          Header: t(langKeys.product),
          accessor: "product",
          width: "auto",
        },
        {
          Header: t(langKeys.unitaryprice),
          accessor: "unitaryprice",
          width: "auto",
        },   
        {
          Header: t(langKeys.quantity),
          accessor: "quantity",
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
          <TitleDetail title={t(langKeys.orderlist)} />
        </div>
        <div className="row-zyx">
          <TableZyx
            columns={columns}            
            data={[]}           
            filterGeneral={false}
            toolsFooter={false}            
          />          
        </div>
        <Typography style={{textAlign:"right", padding:"2rem 2rem 0 0", fontSize:"1rem"}}>
              {t(langKeys.totallistprice) + ": 00.00"}
        </Typography>         
      </div>
    )
}

export default OrderListTabDetail;