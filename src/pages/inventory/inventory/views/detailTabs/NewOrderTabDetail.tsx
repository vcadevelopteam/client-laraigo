/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useTranslation } from "react-i18next";
import { langKeys } from "lang/keys";
import TableZyx from "components/fields/table-simple";
import { useSelector } from "hooks";
import { TitleDetail, FieldEdit, FieldCheckbox, FieldSelect } from 'components';
import { FieldErrors, UseFormGetValues, UseFormSetValue } from "react-hook-form";
import RegisterDealerDialog from "../../dialogs/RegisterDealerDialog";

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
  setValue: UseFormSetValue<any>;
  getValues: UseFormGetValues<any>;
  row: any
  tabIndex:any
  setdisableSave:any
}

const NewOrderTabDetail: React.FC<NewOrderTabDetailProps> = ({fetchdata, errors, row, tabIndex,setValue,getValues, setdisableSave}) => {
  const { t } = useTranslation();
  const classes = useStyles();
  const dataProducts = useSelector(state => state.main.mainAux);
  const [openModal, setOpenModal] = useState(false);
  const [disableType, setDisableType] = useState('');
  const multiDataAux = useSelector(state => state.main.multiDataAux);

  useEffect(() => {
    if(tabIndex===1){
      fetchdata();
    }
  }, [tabIndex])

  const columns = React.useMemo(
    () => [
      {
        Header: t(langKeys.dealer),
        accessor: "distributordescription",
        width: "auto",
      },
      {
        Header: t(langKeys.defaultdealer),
        accessor: "isstockistdefault",
        width: "auto",
        type: 'boolean',
        sortType: 'basic',
        Cell: (props: any) => {
            const { isstockistdefault } = props.cell.row.original;
            return isstockistdefault ? t(langKeys.yes) : "No"
        }
      },
      {
        Header: t(langKeys.manufacturer),
        accessor: "manufacturerdescription",
        width: "auto",
      },
      {
        Header: t(langKeys.model),
        accessor: "model",
        width: "auto",
      },
      {
        Header: t(langKeys.catalog_nro),
        accessor: "catalognumber",
        width: "auto",
      },
      {
        Header: t(langKeys.purchase_unit),
        accessor: "unitbuydescription",
        width: "auto",
      },
      {
        Header: t(langKeys.last_price),
        accessor: "lastprice",
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
  function handleRegister() {
    setOpenModal(true)
  }

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
                  valueDefault={getValues("isneworder")}
                  onChange={(value) => {setValue("isneworder", value); setdisableSave(!value)}}    
                  helperText={t(langKeys.newordertooltip)}        
              />
          </div>
          <div className='row-zyx'>
              <FieldEdit
                  label={t(langKeys.restockingpoint)}
                  helperText={t(langKeys.restockingpointtooltip)}     
                  type="number"
                  valueDefault={getValues("replenishmentpoint")}
                  onChange={(value) => setValue("replenishmentpoint", value)}   
                  error={(errors?.replenishmentpoint?.message as string) ?? ""}
                  className="col-6"
                  inputProps={{ maxLength: 15 }}
              />  
          </div>
          <div className='row-zyx'>
              <FieldEdit
                  label={t(langKeys.deliverytimedays)}
                  helperText={t(langKeys.deliverytimedaystooltip)}    
                  type="number"
                  valueDefault={getValues("deliverytimedays")}
                  error={(errors?.deliverytimedays?.message as string) ?? ""}
                  onChange={(value) => setValue("deliverytimedays", value)}   
                  className="col-6"
              />
          </div>
          <div className='row-zyx'>
              <FieldEdit
                  label={t(langKeys.safetystock)}
                  helperText={t(langKeys.safetystocktooltip)} 
                  className="col-6"
                  type="number"
                  valueDefault={getValues("securitystock")}
                  error={(errors?.securitystock?.message as string) ?? ""}
                  onChange={(value) => setValue("securitystock", value)}   
              />  
          </div>
          <div className='row-zyx'>
              <FieldEdit
                  label={t(langKeys.economicquantityoforders)}
                  helperText={t(langKeys.economicquantityoforderstooltip)} 
                  type="number"
                  className="col-6"
                  valueDefault={getValues("economicorderquantity")}
                  error={(errors?.economicorderquantity?.message as string) ?? ""}
                  onChange={(value) => setValue("economicorderquantity", value)}   
              />
          </div>
          <div className='row-zyx'>
              <FieldSelect
                label={t(langKeys.purchase_unit)}
                helperText={t(langKeys.purchase_unittooltip)} 
                className="col-6"
                data={multiDataAux?.data?.[0]?.data}
                optionValue="domainid"
                optionDesc="domaindesc"
                valueDefault={getValues("unitbuyid")}
                error={(errors?.unitbuyid?.message as string) ?? ""}
                onChange={(value) => setValue("unitbuyid", value.domainid)}   
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
              <FieldSelect
                label={t(langKeys.dealer)}
                className="col-6"
                data={(multiDataAux?.data?.[4]?.data||[]).filter(x=>x.typemanufacter_desc ==="D")}
                optionValue="distributorid"
                optionDesc="description"
                valueDefault={getValues("distributorid")}
                disabled={disableType==="distributor"}
                onChange={(value) => {  
                  setDisableType(value?.manufacturerid?"manufacturer":"")              
                  setValue("distributorid", value?.manufacturerid||0)
                }}  
              />
          </div>
          <div className='row-zyx'>
              <FieldSelect
                label={t(langKeys.manufacturer)}
                disabled={disableType==="manufacturer"}
                className="col-6"
                data={(multiDataAux?.data?.[4]?.data||[]).filter(x=>x.typemanufacter_desc ==="F")}
                optionValue="manufacturerid"
                optionDesc="description"
                valueDefault={getValues("manufacturerid")}
                onChange={(value) => {
                  setDisableType(value?.manufacturerid?"distributor":"")
                  setValue("manufacturerid", value?.manufacturerid||0)
                }}  
              />
          </div>
          <div className='row-zyx'>
              <FieldEdit
                  label={t(langKeys.model)}
                  helperText={t(langKeys.modeltooltip)}
                  className="col-6"
                  valueDefault={getValues("model")}
                  onChange={(value) => setValue("model", value)}  
              />
          </div>
          <div className='row-zyx'>
              <FieldEdit
                  label={t(langKeys.catalog_nro)}
                  helperText={t(langKeys.catalog_nrotooltip)}
                  className="col-6"
                  valueDefault={getValues("catalognumber")}
                  onChange={(value) => setValue("catalognumber", value)}  
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
          <TableZyx
            columns={columns}
            data={dataProducts?.data||[]}
            loading={dataProducts?.loading}
            download={false}
            filterGeneral={false}
            register={true}
            handleRegister={handleRegister}
          />
        </div>
      </div>
      <RegisterDealerDialog
        openModal={openModal}
        setOpenModal={setOpenModal}
        fetchData={fetchdata}
        row={row}
      />
    </div>
  );
};

export default NewOrderTabDetail;
