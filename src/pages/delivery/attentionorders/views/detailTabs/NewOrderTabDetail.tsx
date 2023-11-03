/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useTranslation } from "react-i18next";
import { langKeys } from "lang/keys";
import TableZyx from "components/fields/table-simple";
import { useSelector } from "hooks";
import { TitleDetail, FieldEdit, FieldCheckbox, FieldSelect } from 'components';
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

const NewOrderTabDetail: React.FC<NewOrderTabDetailProps> = ({fetchdata, errors, row}) => {
  const { t } = useTranslation();
  const classes = useStyles();
  const dataProducts = useSelector(state => state.main.mainAux);
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    fetchdata();
  }, [])

  const columns = React.useMemo(
    () => [
      {
        Header: t(langKeys.product),
        accessor: "productdescription",
        width: "auto",
      },
      {
        Header: t(langKeys.product),
        accessor: "descriptionlarge",
        width: "auto",
      },
      {
        Header: t(langKeys.product),
        accessor: "standarcost",
        width: "auto",
      },
      {
        Header: t(langKeys.model),
        accessor: "averagecost",
        width: "auto",
      },
      {
        Header: t(langKeys.product),
        accessor: "current_balance",
        width: "auto",
      },
      {
        Header: t(langKeys.product),
        accessor: "purchase_unit",
        width: "auto",
      },
      {
        Header: t(langKeys.product),
        accessor: "last_price",
        width: "auto",
      },
      {
        Header: t(langKeys.product),
        accessor: "dateoflastshipment",
        width: "auto",
      },
    ],
    []
  );
  function handleRegister() {
    setOpenModal(true)
  }

  return (
    <div className={classes.containerDetail}>
      <div className='row-zyx'>
        <div className='col-6'>
          <div className='row-zyx'>
              <TitleDetail
                  title={t(langKeys.product)}
              />
          </div>
          <div className='row-zyx'>
              <FieldCheckbox
                  label={t(langKeys.product)}
                  className="col-6"
              />
          </div>
          <div className='row-zyx'>
              <FieldEdit
                  label={t(langKeys.product)}
                  className="col-6"
                  error={errors?.address?.message}
              />  
          </div>
          <div className='row-zyx'>
              <FieldEdit
                  label={t(langKeys.product)}
                  className="col-6"
                  error={errors?.latitude?.message}
              />
          </div>
          <div className='row-zyx'>
              <FieldEdit
                  label={t(langKeys.product)}
                  className="col-6"
                  error={errors?.address?.message}
              />  
          </div>
          <div className='row-zyx'>
              <FieldEdit
                  label={t(langKeys.product)}
                  className="col-6"
                  error={errors?.latitude?.message}
              />
          </div>
          <div className='row-zyx'>
              <FieldSelect
                label={t(langKeys.product)}
                className="col-6"
                error={errors?.producttype?.message}
                optionValue="domainvalue"
                optionDesc="domaindesc"
              />
          </div>
        </div>
        <div className='col-6'>
          <div className='row-zyx'>
              <TitleDetail
                  title={t(langKeys.product)}
              />
          </div>
          <div className='row-zyx'>
              <FieldSelect
                label={t(langKeys.product)}
                className="col-6"
                error={errors?.producttype?.message}
                optionValue="domainvalue"
                optionDesc="domaindesc"
              />
              <FieldEdit
                  label={t(langKeys.description)}
                  className="col-6"
                  error={errors?.address?.message}
              /> 
          </div>
          <div className='row-zyx'>
              <FieldSelect
                label={t(langKeys.product)}
                className="col-6"
                error={errors?.producttype?.message}
                optionValue="domainvalue"
                optionDesc="domaindesc"
              />
              <FieldEdit
                  label={t(langKeys.description)}
                  className="col-6"
                  error={errors?.address?.message}
              />   
          </div>
          <div className='row-zyx'>
              <FieldEdit
                  label={t(langKeys.model)}
                  className="col-6"
                  error={errors?.latitude?.message}
              />
          </div>
          <div className='row-zyx'>
              <FieldEdit
                  label={t(langKeys.product)}
                  className="col-6"
                  error={errors?.address?.message}
              />  
          </div>
        </div>
      </div>
      <div className='row-zyx'>
        <div className='row-zyx'>
          <TitleDetail
              title={t(langKeys.product)}
          />
        </div>
        <div className="row-zyx">
          <TableZyx
            columns={columns}
            data={dataProducts.data}
            download={false}
            filterGeneral={false}
            register={true}
            handleRegister={handleRegister}
          />
        </div>
      </div>
    </div>
  );
};

export default NewOrderTabDetail;
