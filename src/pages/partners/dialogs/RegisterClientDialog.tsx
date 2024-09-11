import { DialogZyx, FieldEdit, FieldSelect } from "components";
import { langKeys } from "lang/keys";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { execute } from "store/main/actions";
import { useDispatch } from "react-redux";
import { useSelector } from "hooks";
import { useForm } from "react-hook-form";
import React from "react";
import { manageConfirmation, showBackdrop, showSnackbar } from "store/popus/actions";
import { customerByPartnerIns } from "common/helpers";
import { Dictionary } from "@types";

interface RowSelected {
  row2: Dictionary | null;
  edit: boolean;
}

const RegisterClientDialog: React.FC<{
  openModal: boolean;
  setOpenModal: (dat: boolean) => void;
  row: Dictionary;
  fetchData: () => void;
  data: RowSelected
}> = ({ openModal, setOpenModal, row, fetchData, data: {row2, edit} }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [waitSave, setWaitSave] = useState(false);
  const executeRes = useSelector(state => state.main.execute);
  const multiDataAux = useSelector(state => state.main.multiDataAux);
  const [corpId, setCorpId] = useState(edit ? row2?.corpid : 0);
  const [orgId, setOrgId] = useState(edit ? row2?.orgid : 0);
  const [status, setStatus] = useState(edit ? row2?.status : '');
  const [comissionPercentageValue, setComissionPercentageValue] = useState(edit ? row2?.comissionPercentageValue : 0);

  const { register, handleSubmit, setValue, getValues, reset, formState:{errors}} = useForm({
    defaultValues: {
        id: row2?.customerpartnerid || 0,
        partnerid: row?.partnerid || 0,
        orgid: row2?.orgid || 0,
        corpid: row2?.corpid || 0,
        typepartner: row2?.typepartner || '',
        billingplan: row?.billingplan || '',
        comissionpercentage: row2?.comissionpercentage || 0,
        status: row2?.status || 'ACTIVO',
    }
  });

  useEffect(() => {
    if(row2) {
      setValue('id', row2.customerpartnerid)
      setValue('orgid', row2.orgid)
      setValue('corpid', row2.corpid)
      setValue('typepartner', row2.typepartner)
      setValue('billingplan', row2.billingplan)
      setValue('comissionpercentage', row2.comissionpercentage)
      setValue('status', row2.status)
    }
  }, [row2])

  useEffect(() => {
    if (waitSave) {
        if (!executeRes.loading && !executeRes.error) {
            dispatch(showSnackbar({ show: true, severity: "success", message: t(row2 ? langKeys.successful_edit : langKeys.successful_register) }))
            dispatch(showBackdrop(false));
            reset()
            fetchData();
            setOpenModal(false);
            setStatus('');
            setOrgId(0)
            setCorpId(0)
            setComissionPercentageValue(0)
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
  register('id')
  register('corpid', { validate: (value) =>((value && value > 0) ? true : String(t(langKeys.field_required)) + "") });
  register('orgid', { validate: (value) =>((value && value > 0) ? true : String(t(langKeys.field_required)) + "") });
  register('partnerid');
  register('typepartner', { validate: (value) =>((value && value.length>0) ? true : String(t(langKeys.field_required)) + "") });
  register('billingplan');
  register('comissionpercentage');
  register('status')
}, [register, openModal]);
  
const onMainSubmit = handleSubmit((data) => {
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

const exitConfirmation = (() => {
  const callback = () => {
      onMainSubmit()
  }
  dispatch(manageConfirmation({
      visible: true,
      question: t(langKeys.confirmation_exit),
      textConfirm: 'Sí',
      textCancel: 'No',
      callback: (() => {
        setOpenModal(false)
        setOrgId(0)
        setStatus('');
        setComissionPercentageValue(0)
      }),
      callbackcancel: callback
  }))
});

  return (
    <form onSubmit={onMainSubmit}>
      <DialogZyx
        open={openModal}
        title={`${t(langKeys.new)} ${t(langKeys.client )}`}
        maxWidth="md"
        buttonText1={t(langKeys.back)}
        buttonText2={t(langKeys.save)}
        handleClickButton1={exitConfirmation}
        handleClickButton2={onMainSubmit}
      >
        <div className="row-zyx">
            <FieldSelect
              label={t(langKeys.corporation)}
              valueDefault={row2?.corpid || 0}
              className="col-6"
              data={(multiDataAux?.data?.[1]?.data||[])}
              error={typeof errors?.corpid?.message === "string" ? errors?.corpid?.message : ''}
              onChange={(value) => {
                value ? setCorpId(value.corpid) : setCorpId(0)
                setValue('corpid', value?.corpid || 0)
              }}
              optionValue="corpid"
              optionDesc="description"
            />
            <FieldSelect
              label={t(langKeys.organization)}
              valueDefault={edit ? row2?.orgid : orgId}
              className="col-6"
              data={edit ? (multiDataAux?.data?.[0]?.data||[]).filter(x => x.corpid === row2?.corpid): (multiDataAux?.data?.[0]?.data||[]).filter(x => x.corpid === corpId)}
              error={typeof errors?.orgid?.message === 'string' ? errors?.orgid?.message : ''}
              onChange={(value) => {
                setOrgId(value?.orgid || 0)
                setValue('orgid', value?.orgid || 0)
                setStatus(value?.status || 0)
                setValue('status', value?.status || 0)
              }}
              optionValue="orgid"
              optionDesc="orgdesc"
            />
            <FieldSelect
                label={t(langKeys.partnertype)}
                className="col-6"
                valueDefault={getValues('typepartner') || ''}
                data={row?.enterprisepartner ? multiDataAux?.data?.[5]?.data : multiDataAux?.data?.[5]?.data.filter(item => item.domainvalue !== 'ENTERPRISE')}
                error={typeof errors?.typepartner?.message === 'string' ? errors?.typepartner?.message : ''}
                onChange={(value) => {
                    setValue('typepartner', value?.domainvalue || '');
                    setComissionPercentage(value?.domainvalue || '');
                    setComissionPercentageValue(getValues('comissionpercentage'));
                }}
                optionValue="domainvalue"
                optionDesc="domaindesc"
            />

            <FieldEdit
              label={t(langKeys.status)}
              valueDefault={edit ? row2?.status : status}
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
              label={t(langKeys.billingcurrency)}
              valueDefault={row?.billingcurrency}
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
              label={t(langKeys.commissionpercentage)}
              valueDefault={edit ? row2?.comissionpercentage : comissionPercentageValue}
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
            <FieldEdit
              label={t(langKeys.creationDate)}
              valueDefault={row2?.createdate || ''}
              className="col-6"
              inputProps={{ maxLength: 256 }}
              disabled={true}
            />
        </div>
      </DialogZyx>
    </form>
  );
};

export default RegisterClientDialog;