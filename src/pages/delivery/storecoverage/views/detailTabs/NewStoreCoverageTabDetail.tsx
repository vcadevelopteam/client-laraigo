import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useTranslation } from "react-i18next";
import { langKeys } from "lang/keys";
import { FieldEdit, FieldSelect, IOSSwitch } from 'components';
import { FieldErrors } from "react-hook-form";
import { FormControlLabel } from "@material-ui/core";
import { useSelector } from 'hooks';
import { Dictionary } from "@types";

const useStyles = makeStyles((theme) => ({
  containerDetail: {
    marginTop: theme.spacing(2),
    padding: theme.spacing(2),
    background: "#fff",
  },
  button: {
    marginRight: theme.spacing(2),
  },
}));

interface NewOrderTabDetailProps {
  fetchdata: () => void
  errors: FieldErrors
  row: Dictionary
  getValues: any,
  setValue: any
}

const NewStoreCoverageTabDetail: React.FC<NewOrderTabDetailProps> = ({fetchdata, errors, row, setValue, getValues}) => {
  const { t } = useTranslation();
  const classes = useStyles();
  const [inStore, setInStore] = useState(false);
  const multiData = useSelector(state => state.main.multiData);

  useEffect(() => {
    fetchdata();
  }, [])

  console.log(multiData?.data?.[0]?.data)

  return (
    <div className={classes.containerDetail}>
      <div className='row-zyx'>
        <FieldEdit
            label={t(langKeys.storezonename)}
            valueDefault={getValues('description')}
            onChange={(value) => setValue('description', value)}
            className="col-6"
            maxLength={100}
            error={typeof errors?.description?.message === 'string' ? errors?.description?.message : ''}
        />
        <FieldEdit
            label={t(langKeys.telephonenumber)}
            type="number"
            maxLength={15}
            valueDefault={getValues('phone')}
            onChange={(value) => setValue('phone', value)}
            className="col-6"
            error={typeof errors?.phone?.message === 'string' ? errors?.phone?.message : ''}
        />
        <FieldEdit
            label={t(langKeys.address)}
            valueDefault={getValues('address')}
            maxLength={200}
            onChange={(value) => setValue('address', value)}
            className="col-6"
            error={typeof errors?.address?.message === 'string' ? errors?.address?.message : ''}
        />
        <FieldEdit
            label={t(langKeys.coveragearea)}
            valueDefault={getValues('coveragearea')}
            onChange={(value) => setValue('coveragearea', value)}
            className="col-6"
            error={typeof errors?.coveragearea?.message === 'string' ? errors?.coveragearea?.message : ''}
        />
        <FieldSelect
          label={t(langKeys.status)}
          className="col-6"
          data={[
            { domainvalue: "ACTIVO", domaindesc: "ACTIVO" },
            { domainvalue: "INACTIVO", domaindesc: "INACTIVO" },
          ]}
          valueDefault={getValues('status')}
          onChange={(value) => setValue('status', value?.domainvalue)}
          error={typeof errors?.status?.message === 'string' ? errors?.status?.message : ''}
          optionValue="domainvalue"
          optionDesc="domaindesc"
        />
        <FieldSelect
          label={t(langKeys.warehouse)}
          className="col-6"
          valueDefault={getValues('warehouseid')}
          data={multiData?.data?.[0]?.data || []}
          onChange={(value) => setValue('warehouseid', value?.domainvalue)}
          error={typeof errors?.warehouseid?.message === 'string' ? errors?.warehouseid?.message : ''}
          optionValue="warehouseid"
          optionDesc="name"
        />
        <FormControlLabel 
          style={{paddingLeft:"10px"}}
          control={
          <IOSSwitch
              checked={inStore}
              onChange={(event) => {
                  setValue('isInStore', event.target.checked)
                  setInStore(event.target.checked)
              }}
              color='primary'
          />}
          label={t(langKeys.instorewarehouse)}
          className="col-5"
        />       
      </div>
    </div>
  );
};

export default NewStoreCoverageTabDetail;
