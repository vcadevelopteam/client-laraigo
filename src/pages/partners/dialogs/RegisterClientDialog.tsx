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
import { customerByPartnerIns } from "common/helpers";

const useStyles = makeStyles((theme) => ({
  button: {
    marginRight: theme.spacing(2),
  },
}));

const RegisterClientDialog: React.FC<{
  openModal: any;
  setOpenModal: (dat: any) => void;
  row: any;
  fetchData: any;
}> = ({ openModal, setOpenModal, row, fetchData }) => {
  const { t } = useTranslation();
  const classes = useStyles();
  const dispatch = useDispatch();
  const [waitSave, setWaitSave] = useState(false);
  const executeRes = useSelector(state => state.main.execute);
  const multiDataAux = useSelector(state => state.main.multiDataAux);
  const [corpId, setCorpId] = useState('');

  const { register, handleSubmit, setValue, getValues, reset} = useForm({
    defaultValues: {
        corpid: 0,
        orgid: 0,
        partnerid: row?.partnerid || 0,
        typepartner: '',
        billingplan: row?.billingplan || '',
        comissionpercentage: 0.00,
        operation: 'INSERT' 
    }
  });

  useEffect(() => {
    if (waitSave) {
        if (!executeRes.loading && !executeRes.error) {
            dispatch(showSnackbar({ show: true, severity: "success", message: t(row ? langKeys.successful_edit : langKeys.successful_register) }))
            dispatch(showBackdrop(false));
            reset()
            setOpenModal(false);
        } else if (executeRes.error) {
            const errormessage = t(executeRes.code || "error_unexpected_error", { module: t(langKeys.domain).toLocaleLowerCase() })
            dispatch(showSnackbar({ show: true, severity: "error", message: errormessage }))
            setWaitSave(false);
            dispatch(showBackdrop(false));
        }
    }
}, [executeRes, waitSave])

React.useEffect(() => {
  register('corpid');
  register('orgid');
  register('partnerid');
  register('typepartner', { validate: (value) =>((value && value.length>0) ? true : t(langKeys.field_required) + "") });
  register('billingplan', { validate: (value) =>((value && value.length>0) ? true : t(langKeys.field_required) + "") });
  register('comissionpercentage');
  register('operation');
  dispatch(resetMainAux());
}, [register]);
  
const onMainSubmit = handleSubmit((data) => {
  const callback = () => {
      dispatch(showBackdrop(true));
      dispatch(execute(customerByPartnerIns(data)));
      fetchData();
      setWaitSave(true);
  }
  dispatch(manageConfirmation({
      visible: true,
      question: t(langKeys.confirmation_save),
      callback
  }))
});

  return (
    <DialogZyx open={openModal} title={`${t(langKeys.new)} ${t(langKeys.client )}`} maxWidth="md">
      <form onSubmit={onMainSubmit}>
      <div className="row-zyx">
          <FieldSelect
            label={t(langKeys.corporation)}
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
            className="col-6"
            data={corpId? ( multiDataAux?.data?.[0]?.data||[]).filter(x => x.corpid === corpId): []}
            onChange={(value) => setValue('orgid', value.orgid)}
            optionValue="orgid"
            optionDesc="orgdesc"
          />
          <FieldSelect
            label={t(langKeys.partnertype)}
            className="col-6"
            data={(multiDataAux?.data?.[5]?.data||[])}
            onChange={(value) => setValue('typepartner', value.domainvalue)}
            optionValue="domainvalue"
            optionDesc="domaindesc"
          />
          <FieldEdit
            label={t(langKeys.status)}
            valueDefault={getValues('corpid')}
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
            valueDefault={getValues('corpid')}
            className="col-6"
            inputProps={{ maxLength: 256 }}
            disabled={true}
          />
          <FieldEdit
            label={t(langKeys.creationuser)}
            valueDefault={getValues('corpid')}
            className="col-6"
            inputProps={{ maxLength: 256 }}
            disabled={true}
          />
          <FieldEdit
            label={t(langKeys.commissionpercentage)}
            valueDefault={getValues('comissionpercentage')}
            className="col-6"
            inputProps={{ maxLength: 256 }}
            disabled={true}
          />
          <FieldEdit
            label={t(langKeys.lastmodificationuser)}
            valueDefault={getValues('corpid')}
            className="col-6"
            inputProps={{ maxLength: 256 }}
            disabled={true}
          />
          <FieldEdit
            label={t(langKeys.creationDate)}
            valueDefault={getValues('corpid')}
            className="col-6"
            inputProps={{ maxLength: 256 }}
            disabled={true}
          />
          <FieldEdit
            label={t(langKeys.lastmodificationdate)}
            valueDefault={getValues('corpid')}
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
            setCorpId('')
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
            setCorpId('')
            onMainSubmit()
          }}
        >
          {t(langKeys.save)}
        </Button>
      </div>
      </form>
    </DialogZyx>
  );
};

export default RegisterClientDialog;