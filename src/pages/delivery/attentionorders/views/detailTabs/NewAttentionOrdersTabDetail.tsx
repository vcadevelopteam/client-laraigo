/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useTranslation } from "react-i18next";
import { langKeys } from "lang/keys";
import { TitleDetail, FieldEdit, FieldCheckbox, FieldSelect, IOSSwitch, Title } from 'components';
import { FieldErrors } from "react-hook-form";
import { FormControlLabel, Typography } from "@material-ui/core";
import { useSelector } from 'hooks';
import TableZyx from "components/fields/table-simple";

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

interface NewAttentionOrdersTabDetailProps {
  fetchdata: any
  errors: FieldErrors<any>
  row: any
  getValues: any,
  setValue: any
}

const NewAttentionOrdersTabDetail: React.FC<NewAttentionOrdersTabDetailProps> = ({fetchdata, errors, row, setValue, getValues}) => {
  const { t } = useTranslation();
  const classes = useStyles();
  const [inStore, setInStore] = useState(false);
  const multiData = useSelector(state => state.main.multiData);

  useEffect(() => {
    fetchdata();
  }, [])

  const columns = React.useMemo(
    () => [   
      {
        Header: t(langKeys.product),
        accessor: "product",
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
        <FieldEdit
            label={t(langKeys.clientname)}
            valueDefault={getValues('storename')}
            onChange={(value) => setValue('storename', value)}
            className="col-6"
            maxLength={100}
            error={typeof errors?.storename?.message === 'string' ? errors?.storename?.message : ''}
        />
        <FieldEdit
            label={t(langKeys.documentnumber)}
            type="number"
            maxLength={15}
            valueDefault={getValues('phonenumber')}
            onChange={(value) => setValue('phonenumber', value)}
            className="col-6"
            error={typeof errors?.phonenumber?.message === 'string' ? errors?.phonenumber?.message : ''}
        />
        <FieldEdit
            label={t(langKeys.telephonenumber)}
            valueDefault={getValues('address')}
            maxLength={200}
            onChange={(value) => setValue('address', value)}
            className="col-6"
            error={typeof errors?.address?.message === 'string' ? errors?.address?.message : ''}
        />
        <FieldEdit
            label={t(langKeys.address)}
            valueDefault={getValues('coveragearea')}
            onChange={(value) => setValue('coveragearea', value)}
            className="col-6"
            error={typeof errors?.coveragearea?.message === 'string' ? errors?.coveragearea?.message : ''}
        />
        <div style={{paddingTop:"2.3rem"}}>            
            <TitleDetail
                title={row?.name || `${t(langKeys.validated)}`}
            />                    
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
              {t(langKeys.totallistprice) + ": S/00.00"}
        </Typography>  
          
        
        
      </div>
    </div>
  );
};

export default NewAttentionOrdersTabDetail;
