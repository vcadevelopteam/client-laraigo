/* eslint-disable react-hooks/exhaustive-deps */
import { Button, makeStyles } from "@material-ui/core";
import { DialogZyx, FieldEdit, FieldSelect, FieldCheckbox } from "components";
import { langKeys } from "lang/keys";
import { useEffect, useState } from "react";
import ClearIcon from "@material-ui/icons/Clear";
import { useTranslation } from "react-i18next";
import SaveIcon from "@material-ui/icons/Save";
import { execute, resetMainAux } from "store/main/actions";
import { useDispatch } from "react-redux";
import { useSelector } from "hooks";
import { useForm } from "react-hook-form";
import React from "react";
import { manageConfirmation, showBackdrop, showSnackbar } from "store/popus/actions";
import { customerByPartnerIns, getPropertySelByName } from "common/helpers";
import { Dictionary } from "@types";

const useStyles = makeStyles((theme) => ({
  button: {
    marginRight: theme.spacing(2),
  },
}));

interface RowSelected {
  row2: Dictionary | null;
  edit: boolean;
}

const RegisterClientDialog: React.FC<{
  openModal: any;
  setOpenModal: (dat: any) => void;
  row: any;
  fetchData: any;
  data: RowSelected
}> = ({ openModal, setOpenModal, row, fetchData, data: {row2, edit} }) => {
  const { t } = useTranslation();
  const classes = useStyles();
  const dispatch = useDispatch();
  const [waitSave, setWaitSave] = useState(false);
  const executeRes = useSelector(state => state.main.execute);
  const multiDataAux = useSelector(state => state.main.multiDataAux);
  const [corpId, setCorpId] = useState(row2 ? row2?.corpId : 0);
  const [status, setStatus] = useState(row2 ? row2?.status : '');
  const [comissionPercentageValue, setComissionPercentageValue] = useState(row2 ? row2?.comissionPercentageValue : 0);

  console.log(row2)
  console.log(corpId)

  const { register, handleSubmit, setValue, getValues, reset} = useForm({
    defaultValues: {
        partnerid: row?.partnerid || 0,
        orgid: row2?.orgid || 0,
        corpid: row2?.corpid || 3,
        typepartner: row2?.typepartner || '',
        billingplan: row?.billingplan || '',
        comissionpercentage: row2?.comissionpercentage || 0.00,
    }
  });

  useEffect(() => {
    if (waitSave) {
        if (!executeRes.loading && !executeRes.error) {
            dispatch(showSnackbar({ show: true, severity: "success", message: t(row2 ? langKeys.successful_edit : langKeys.successful_register) }))
            dispatch(showBackdrop(false));
            reset()
            fetchData();
            setOpenModal(false);
        } else if (executeRes.error) {
            const errormessage = t(executeRes.code || "error_unexpected_error", { module: t(langKeys.domain).toLocaleLowerCase() })
            dispatch(showSnackbar({ show: true, severity: "error", message: errormessage }))
            setWaitSave(false);
            dispatch(showBackdrop(false));
        }
    }
}, [executeRes, waitSave])

function setComissionPercentage(value: string) {
  if (value === 'ENTERPRISE') {
    setValue('comissionpercentage', multiDataAux?.data?.[8]?.data?.[0]?.propertyvalue);
  } else if (value === 'RESELLER') {
    setValue('comissionpercentage', multiDataAux?.data?.[7]?.data?.[0]?.propertyvalue);
  } else if (value === 'DEVELOPER') {
    setValue('comissionpercentage', multiDataAux?.data?.[6]?.data?.[0]?.propertyvalue);
  }
}

React.useEffect(() => {
  register('corpid');
  register('orgid');
  register('partnerid');
  register('typepartner', { validate: (value) =>((value && value.length>0) ? true : t(langKeys.field_required) + "") });
  register('billingplan', { validate: (value) =>((value && value.length>0) ? true : t(langKeys.field_required) + "") });
  register('comissionpercentage');
}, [register, openModal]);
  
const onMainSubmit = handleSubmit((data) => {
  console.log(data);
  const callback = () => {
      dispatch(showBackdrop(true));
      if(edit) {
        dispatch(execute(customerByPartnerIns({...data, operation: 'UPDATE'})));
      } else {
        dispatch(execute(customerByPartnerIns({...data, operation: 'INSERT'})));
      }
      setWaitSave(true);
  }
  dispatch(manageConfirmation({
      visible: true,
      question: t(langKeys.confirmation_save),
      callback
  }))
});

  return (
    <form onSubmit={onMainSubmit}>
    <DialogZyx open={openModal} title={`${t(langKeys.new)} ${t(langKeys.client )}`} maxWidth="md">
      <div className="row-zyx">
          <FieldSelect
            label={t(langKeys.corporation)}
            valueDefault={row2?.corpid || 0}
            className="col-6"
            data={(multiDataAux?.data?.[1]?.data||[])}
            onChange={(value) => {
              setCorpId(value.corpid);
              setValue('corpid', value.corpid)
            }}
            optionValue="corpid"
            optionDesc="description"
          />
          <FieldSelect
            label={t(langKeys.organization)}
            valueDefault={row2?.orgid || 0}
            className="col-6"
            data={edit ? (multiDataAux?.data?.[0]?.data||[]).filter(x => x.corpid === row2?.corpid): (multiDataAux?.data?.[0]?.data||[]).filter(x => x.corpid === corpId)}
            onChange={(value) => {
              setValue('orgid', value.orgid)
              setStatus(value.status)
            }}
            optionValue="orgid"
            optionDesc="orgdesc"
          />
          <FieldSelect
            label={t(langKeys.partnertype)}
            className="col-6"
            valueDefault={row2?.typepartner || ''}
            data={(multiDataAux?.data?.[5]?.data||[])}
            onChange={(value) => {
              setValue('typepartner', value.domainvalue)
              setComissionPercentage(value.domainvalue)
              setComissionPercentageValue(getValues('comissionpercentage'))
            }}
            optionValue="domainvalue"
            optionDesc="domaindesc"
          />
          <FieldEdit
            label={t(langKeys.status)}
            valueDefault={status}
            className="col-6"
            inputProps={{ maxLength: 256 }}
            disabled={true}
          />
          <FieldEdit
            label={t(langKeys.billingplan)}
            valueDefault={getValues('billingplan')}
            className="col-6"
            inputProps={{ maxLength: 256 }}
            disabled={true}
          />
          <FieldEdit
            label={t(langKeys.billingcurrency)}
            valueDefault={row?.billingcurrency}
            className="col-6"
            inputProps={{ maxLength: 256 }}
            disabled={true}
          />
          <FieldEdit
            label={t(langKeys.creationuser)}
            valueDefault={row2?.createby || ''}
            className="col-6"
            inputProps={{ maxLength: 256 }}
            disabled={true}
          />
          <FieldEdit
            label={t(langKeys.commissionpercentage)}
            valueDefault={comissionPercentageValue}
            className="col-6"
            inputProps={{ maxLength: 256 }}
            disabled={true}
          />
          <FieldEdit
            label={t(langKeys.lastmodificationuser)}
            valueDefault={row2?.changeby || ''}
            className="col-6"
            inputProps={{ maxLength: 256 }}
            disabled={true}
          />
          <FieldEdit
            label={t(langKeys.creationDate)}
            valueDefault={row2?.createdate || ''}
            className="col-6"
            inputProps={{ maxLength: 256 }}
            disabled={true}
          />
          <FieldEdit
            label={t(langKeys.lastmodificationdate)}
            valueDefault={row2?.changedate || ''}
            className="col-6"
            inputProps={{ maxLength: 256 }}
            disabled={true}
          />
      </div>
      <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
        <Button
          variant="contained"
          type="button"
          color="primary"
          startIcon={<ClearIcon color="secondary" />}
          style={{ backgroundColor: "#FB5F5F" }}
          onClick={() => {
            setOpenModal(false);
            row2 = null
            setCorpId(0)
            setStatus('');
            reset()
          }}
        >
          {t(langKeys.back)}
        </Button>
        <Button
          className={classes.button}
          variant="contained"
          color="primary"
          type="button"
          startIcon={<SaveIcon color="secondary" />}
          style={{ backgroundColor: "#55BD84" }}
          onClick={() => {
            setStatus('');
            row2 = null
            onMainSubmit()
          }}
        >
          {t(langKeys.save)}
        </Button>
      </div>
    </DialogZyx>
    </form>
  );
};

export default RegisterClientDialog;