/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useTranslation } from "react-i18next";
import { langKeys } from "lang/keys";
import TableZyx from "components/fields/table-simple";
import RegisterSpecificationDialog from "../../dialogs/RegisterSpecificationDialog";
import { useSelector } from "hooks";
import { useDispatch } from "react-redux";
import { showBackdrop, showSnackbar } from "store/popus/actions";
import { TemplateIcons } from "components";
import { Dictionary } from "@types";
import { execute } from "store/main/actions";
import { insProductAttribute } from "common/helpers";

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

interface SpecificationTabDetailProps {
  fetchData: any;
  row: any;
  edit: boolean;
  tabIndex: any;
  dataTable: Dictionary[];
  setDataTable: (a:Dictionary[])=>void;
}

const SpecificationTabDetail: React.FC<SpecificationTabDetailProps> = ({fetchData,edit, dataTable,setDataTable, row, tabIndex}) => {
  const { t } = useTranslation();
  const classes = useStyles();
  const [openModalDealer, setOpenModalDealer] = useState(false);
  const dispatch = useDispatch();
  const [waitSave, setWaitSave] = useState(false);
  const executeRes = useSelector(state => state.main.execute);
  const mainData = useSelector(state => state.main.mainAux);

  useEffect(() => {
    if(!mainData?.loading && !mainData?.error && edit && mainData?.key==="UFN_ALL_ATTRIBUTE_PRODUCT_SEL"){
      setDataTable(mainData.data)
    }
  }, [mainData]);

  useEffect(() => {
    if(tabIndex === 3) {
      fetchData()
    }
  }, [tabIndex]);

  useEffect(() => {
    if (waitSave) {
        if (!executeRes.loading && !executeRes.error) {
            dispatch(showSnackbar({ show: true, severity: "success", message: t(langKeys.successful_register) }))
            dispatch(showBackdrop(false));
            fetchData();
        } else if (executeRes.error) {
            const errormessage = t(executeRes.code || "error_unexpected_error", { module: t(langKeys.warehouse).toLocaleLowerCase() })
            dispatch(showSnackbar({ show: true, severity: "error", message: errormessage }))
            setWaitSave(false);
            dispatch(showBackdrop(false));
        }
    }
  }, [executeRes, waitSave])

  const handleDelete = (data: Dictionary, i:number) => {
    
    if(edit){
      dispatch(execute(insProductAttribute({
        ...data,
        status: 'ELIMINADO',
        type: 'NINGUNO',
        operation: 'DELETE'
      })))
      setWaitSave(true);
    }else{
      const dataTableAux = dataTable
      dataTableAux.splice(i,1)
      setDataTable(dataTableAux)
    }

  }

  const columns = React.useMemo(
    () => [
      {
        accessor: 'productattributeid',
        NoFilter: true,
        isComponent: true,
        minWidth: 60,
        width: '1%',
        Cell: (props: any) => {
            const row = props.cell.row.original;
            return (
                <TemplateIcons
                deleteFunction={() => handleDelete(row, props.cell.row.index)}
                />
            )
        }
      },
      {
        Header: t(langKeys.attribute),
        accessor: "attributeid",
        width: "auto",
      },
      {
        Header: t(langKeys.value),
        accessor: "value",
        width: "auto",
      },
      {
        Header: t(langKeys.measureunit),
        accessor: "unitmeasuredescription",
        width: "auto",
      },
    ],
    []
  );
  function handleRegister() {
    setOpenModalDealer(true)
  }
  return (
    <div className={classes.containerDetail}>
      <div className="row-zyx">
        <TableZyx
          columns={columns}
          data={dataTable}
          download={false}
          filterGeneral={false}
          register={true}
          handleRegister={handleRegister}
          loading={mainData.loading}
        />
      </div>
      <RegisterSpecificationDialog
        openModal={openModalDealer}
        setOpenModal={setOpenModalDealer}
        setDataTable={setDataTable}
        row={row}
        fetchData={fetchData}
        edit={edit}
      />
    </div>
  );
};

export default SpecificationTabDetail;
