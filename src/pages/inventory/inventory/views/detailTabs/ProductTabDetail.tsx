/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useTranslation } from "react-i18next";
import { langKeys } from "lang/keys";
import TableZyx from "components/fields/table-simple";
import { Button } from "@material-ui/core";
import { Search as SearchIcon } from "@material-ui/icons";
import { useSelector } from "hooks";
import { TitleDetail, FieldEdit, FieldCheckbox } from 'components';
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

interface ProductTabDetailProps {
  fetchdata: any
  errors: FieldErrors<any>
}

const ProductTabDetail: React.FC<ProductTabDetailProps> = ({fetchdata, errors}) => {
  const { t } = useTranslation();
  const classes = useStyles();
  const dataProducts = useSelector(state => state.main.mainAux);

  useEffect(() => {
    fetchdata();
  }, [])

  const columns = React.useMemo(
    () => [
      {
        Header: t(langKeys.dealer),
        accessor: "productdescription",
        width: "auto",
      },
      {
        Header: t(langKeys.defaultdealer),
        accessor: "descriptionlarge",
        width: "auto",
      },
      {
        Header: t(langKeys.manufacturer),
        accessor: "standarcost",
        width: "auto",
      },
      {
        Header: t(langKeys.model),
        accessor: "averagecost",
        width: "auto",
      },
      {
        Header: t(langKeys.catalog_nro),
        accessor: "current_balance",
        width: "auto",
      },
      {
        Header: t(langKeys.purchase_unit),
        accessor: "purchase_unit",
        width: "auto",
      },
      {
        Header: t(langKeys.last_price),
        accessor: "last_price",
        width: "auto",
      },
      {
        Header: t(langKeys.dateoflastorder),
        accessor: "dateoflastshipment",
        width: "auto",
      },
    ],
    []
  );
  return (
    <div className={classes.containerDetail}>
      <div className='row-zyx'>
        <div className='col-6'>
          <div className='row-zyx'>
              <TitleDetail
                  title={t(langKeys.newordersdetail)}
              />
          </div>
          <div className='row-zyx'>
              <FieldCheckbox
                  label={t(langKeys.neworder)}
                  className="col-6"
              />
          </div>
          <div className='row-zyx'>
              <FieldEdit
                  label={t(langKeys.restockingpoint)}
                  className="col-6"
                  error={errors?.address?.message}
              />  
          </div>
          <div className='row-zyx'>
              <FieldEdit
                  label={t(langKeys.deliverytimedays)}
                  className="col-6"
                  error={errors?.latitude?.message}
              />
          </div>
          <div className='row-zyx'>
              <FieldEdit
                  label={t(langKeys.safetystock)}
                  className="col-6"
                  error={errors?.address?.message}
              />  
          </div>
          <div className='row-zyx'>
              <FieldEdit
                  label={t(langKeys.economicquantityoforders)}
                  className="col-6"
                  error={errors?.latitude?.message}
              />
          </div>
          <div className='row-zyx'>
              <FieldEdit
                  label={t(langKeys.purchase_unit)}
                  className="col-6"
                  error={errors?.latitude?.message}
              />
          </div>
        </div>
        <div className='col-6'>
          <div className='row-zyx'>
              <TitleDetail
                  title={t(langKeys.maindealer)}
              />
          </div>
          <div className='row-zyx'>
              <FieldEdit
                  label={t(langKeys.dealer)}
                  className="col-6"
                  error={errors?.address?.message}
              />
              <FieldEdit
                  label={t(langKeys.description)}
                  className="col-6"
                  error={errors?.address?.message}
              /> 
          </div>
          <div className='row-zyx'>
              <FieldEdit
                  label={t(langKeys.manufacturer)}
                  className="col-6"
                  error={errors?.address?.message}
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
                  label={t(langKeys.catalog_nro)}
                  className="col-6"
                  error={errors?.address?.message}
              />  
          </div>
        </div>
      </div>
      <div className='row-zyx'>
        <div className='row-zyx'>
          <TitleDetail
              title={t(langKeys.dealers)}
          />
        </div>
        <div className="row-zyx">
          <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            <Button
              className={classes.button}
              variant="contained"
              color="primary"
              type="button"
              startIcon={<SearchIcon style={{ color: "white" }} />}
              style={{ backgroundColor: "#55BD84" }}
            >
              {t(langKeys.register)}
            </Button>
          </div>
        </div>
        <div className="row-zyx">
          <TableZyx
            columns={columns}
            data={dataProducts.data}
            download={false}
            filterGeneral={false}
            register={false}
          />
        </div>
      </div> 
    </div>
  );
};

export default ProductTabDetail;
