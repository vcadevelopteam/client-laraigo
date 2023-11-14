import React, { FC, useState, useEffect } from 'react'; 
import { Dictionary, IFetchData } from "@types";
import { makeStyles } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';
import { langKeys } from 'lang/keys';
import { FieldErrors, UseFormGetValues, UseFormSetValue } from 'react-hook-form';
import { FieldEdit, TitleDetail } from 'components';
import { useSelector } from "hooks";
import { showSnackbar, showBackdrop } from "store/popus/actions";
import { useDispatch } from "react-redux";

const useStyles = makeStyles((theme) => ({
    containerDetail: {
        marginTop: theme.spacing(2),
        padding: theme.spacing(2),
        background: '#fff',
    },     
}));

interface InventoryTabDetailProps {
    row: Dictionary | null;
    setValue: UseFormSetValue<any>;
    getValues: UseFormGetValues<any>;
    errors: FieldErrors<any>;
}

const ClientDataTabDetail: React.FC<InventoryTabDetailProps> = ({
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

    return (
      <div className={classes.containerDetail}>
        <div className='row-zyx'>
          <div className='col-8'>
            <TitleDetail title={t(langKeys.clientdata)}/>
          </div>
          <div className='col-4'>
            <TitleDetail title={t(langKeys.receptionistdata)}/>
          </div>
        </div>
        <div className='row-zyx'>
          <FieldEdit
            label={t(langKeys.documenttype)}
            disabled={true}
            className="col-4"
          />
          <FieldEdit
            label={t(langKeys.contactnum)}
            disabled={true}
            className="col-4"
          />
          <FieldEdit
            label={t(langKeys.documenttype)}
            disabled={true}
            className="col-4"
          />
        </div>
        <div className='row-zyx'>
          <FieldEdit
            label={t(langKeys.documentnumber)}
            disabled={true}
            className="col-4"
          />
          <FieldEdit
            label={t(langKeys.email)}
            disabled={true}
            className="col-4"
          />
          <FieldEdit
            label={t(langKeys.documentnumber)}
            disabled={true}
            className="col-4"
          />
        </div>
        <div className='row-zyx'>
          <FieldEdit
            label={t(langKeys.clientfullname)}
            disabled={true}
            className="col-4"
          />
          <FieldEdit
            label={t(langKeys.willdeliveryhappen)}
            disabled={true}
            className="col-4"
          />
          <FieldEdit
            label={t(langKeys.fullname) + ' (' + t(langKeys.optional)+ ')'}
            disabled={true}
            className="col-4"
          />
        </div>
        <div className='row-zyx' style={{paddingTop:'20px'}}>
          <FieldEdit
            label={t(langKeys.paymentmethod)}
            disabled={true}
            className="col-4"
          />
          <FieldEdit
            label={t(langKeys.deliverytype)}
            disabled={true}
            className="col-4"
          />
          <FieldEdit
            label={t(langKeys.vouchertype)}
            disabled={true}
            className="col-4"
          />
        </div>
        <div className='row-zyx'>
          <TitleDetail title={t(langKeys.data4voucher)}/>
        </div>
        <div className='row-zyx'>
          <FieldEdit
            label={t(langKeys.rucnumber)}
            disabled={true}
            className="col-4"
          />
          <FieldEdit
            label={t(langKeys.businessname)}
            disabled={true}
            className="col-4"
          />
          <FieldEdit
            label={t(langKeys.address)}
            disabled={true}
            className="col-4"
          />
        </div>
      </div>
    )
}

export default ClientDataTabDetail;