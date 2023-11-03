/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useTranslation } from "react-i18next";
import { langKeys } from "lang/keys";
import { TitleDetail, FieldEdit, FieldCheckbox, FieldSelect, IOSSwitch } from 'components';
import { FieldErrors } from "react-hook-form";

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
  fetchdata: any
  errors: FieldErrors<any>
  row: any
}

const NewStoreCoverageTabDetail: React.FC<NewOrderTabDetailProps> = ({fetchdata, errors, row}) => {
  const { t } = useTranslation();
  const classes = useStyles();
  const [inStore, setInStore] = useState(false);

  useEffect(() => {
    fetchdata();
  }, [])

  return (
    <div className={classes.containerDetail}>
      <div className='row-zyx'>
        <FieldEdit
            label={t(langKeys.storezonename)}
            className="col-6"
            error={errors?.address?.message}
        />
        <FieldEdit
            label={t(langKeys.telephonenumber)}
            className="col-6"
            error={errors?.address?.message}
        />
        <FieldEdit
            label={t(langKeys.address)}
            className="col-6"
            error={errors?.address?.message}
        />
        <FieldEdit
            label={t(langKeys.coveragearea)}
            className="col-6"
            error={errors?.address?.message}
        />
        <FieldSelect
          label={t(langKeys.status)}
          className="col-6"
          error={errors?.producttype?.message}
          optionValue="domainvalue"
          optionDesc="domaindesc"
        />
        <div className="col-6">
          <IOSSwitch checked={inStore} onChange={(e:any) => setInStore(e.target.checked)} name="checkedB" />
        </div>
        <FieldSelect
          label={t(langKeys.warehouse)}
          className="col-6"
          error={errors?.producttype?.message}
          optionValue="domainvalue"
          optionDesc="domaindesc"
        />
      </div>
    </div>
  );
};

export default NewStoreCoverageTabDetail;
