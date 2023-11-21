/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react'; // we need this to make JSX compile
import { Button, IconButton } from "@material-ui/core";
import { Dictionary } from "@types";
import { makeStyles } from '@material-ui/core/styles';
import { Add } from '@material-ui/icons';
import { useTranslation } from 'react-i18next';
import { langKeys } from 'lang/keys';
import { FieldErrors, UseFormGetValues, UseFormSetValue } from 'react-hook-form';
import { FieldEdit, FieldSelect, PhoneFieldEdit, TemplateIcons, TitleDetail } from 'components';
import { useSelector } from 'hooks';
import TableZyx from 'components/fields/table-simple';
import AddInventoryConsumptionLineDialog from '../../dialogs/AddInventoryConsumptionLineDialog';
import TableSelectionDialog from '../../dialogs/TableSelectionDialog';
import { execute, getCollection, getMultiCollection, getMultiCollectionAux2 } from 'store/main/actions';
import { manageConfirmation, showBackdrop } from 'store/popus/actions';
import SelectReservedProductsDialog from '../../dialogs/SelectReservedProductsDialog';
import SelectProductsForReturnDialog from '../../dialogs/SelectProductsForReturnDialog';
import { getInventoryConsumptionDetail, getWarehouseProducts, reservationswarehouseSel } from 'common/helpers';
import { useDispatch } from 'react-redux';

const useStyles = makeStyles((theme) => ({
    containerDetail: {
        marginTop: theme.spacing(2),
        padding: theme.spacing(2),
        background: '#fff',
    },
    containerDescription: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        paddingBottom: '10px',
    },
    containerDescriptionTitle: {
        fontSize: 24
    },
    containerDescriptionSubtitle: {
        fontSize: 14,
        fontWeight: 500
    },
    iconResponse: {
        cursor: 'pointer',
        poisition: 'relative',
        color: '#2E2C34',
        '&:hover': {
            // color: theme.palette.primary.main,
            backgroundColor: '#EBEAED',
            borderRadius: 4
        }
    },
    iconSendDisabled: {
        backgroundColor: "#EBEAED",
        cursor: 'not-allowed',
    },
}));

interface WarehouseTabDetailProps {
    row: Dictionary | null;
    edit: boolean;
    setValue: UseFormSetValue<any>;
    getValues: UseFormGetValues<any>;
    errors: FieldErrors<any>;
    viewSelected: string;
    dataDetail: any;
    setDataDetail:(arg0: any)=>void;
}

const InventoryConsumptionTabDetail: React.FC<WarehouseTabDetailProps> = ({
    row,
    edit,
    setValue,
    getValues,
    dataDetail,
    setDataDetail,
    errors,
    viewSelected
}) => {
    const { t } = useTranslation();
    const classes = useStyles();
    const dispatch = useDispatch();
    const multiData = useSelector(state => state.main.multiData);
    const multiDataAux = useSelector(state => state.main.multiDataAux);
    const multiDataAux2 = useSelector(state => state.main.multiDataAux2);
    const [openModal, setOpenModal] = useState(false);
    const [openModalWarehouse, setOpenModalWarehouse] = useState(false);
    const [openModalReservedProducts, setOpenModalReservedProducts] = useState(false);
    const [rowSelected, setRowSelected] = useState<Dictionary|null>(null);
    const [openModalReturnProducts, setOpenModalReturnProducts] = useState(false);
    const [selectedWarehouse, setSelectedWarehouse] = useState<any>(null);
    const [warehouseProducts, setWarehouseProducts] = useState<any>(null);

    function setWarehouse(warehouseSelected:any){
        setSelectedWarehouse(warehouseSelected)
        setDataDetail([]);
        setValue('warehouseid', warehouseSelected.warehouseid)
    }

    useEffect(() => {
        if (viewSelected==="detail-view") {
            setSelectedWarehouse(null)
            setWarehouseProducts(null)
        }       
    }, [viewSelected]);

    useEffect(() => {
        if(!multiData?.loading && !multiData?.error){
            if(multiData?.data?.[0]?.key === "UFN_ALL_PRODUCT_WAREHOUSE_SEL"){
                setWarehouseProducts(multiData?.data?.[0]?.data||[])
            }
        }   
    }, [multiData]);

    useEffect(() => {
        if(selectedWarehouse && !edit){
            dispatch(getMultiCollection([
                getWarehouseProducts(selectedWarehouse?.warehouseid||0),
                reservationswarehouseSel(selectedWarehouse?.warehouseid||0),
            ]))
        }
    }, [selectedWarehouse]);


    const handleDelete = (i: number) => {
        setDataDetail((p: any) => p.filter((_:any, index:number) => index !== i));
    }

    const handleEdit = (rowSelected: Dictionary) => {
        setOpenModal(true)
        setRowSelected({ row: rowSelected, edit: true })
    }

    const handleRegister = () => {
        setOpenModal(true)
        setRowSelected({ row: null, edit: false });
    }


    const columns = React.useMemo(
        () => [
        {
            accessor: 'inventoryconsumptiondetailid',
            NoFilter: true,
            isComponent: true,
            
            minWidth: 60,
            width: '1%',
            Cell: (props: any) => {
                if (!edit) {
                    return (
                        <TemplateIcons
                            deleteFunction={() => handleDelete(props.cell.row.index)}
                        />
                    )                    
                } else {                    
                    return (<div></div>)
                }
            }
        },
          {
            Header: t(langKeys.line),
            accessor: "line",
            width: "auto",
          },
          {
            Header: t(langKeys.product),
            accessor: "productid",
            width: "auto",
          },
          {
            Header: t(langKeys.description),
            accessor: "description",
            width: "auto",
          },
          {
            Header: t(langKeys.quantity),
            accessor: "quantity",
            width: "auto",
          },
          {
            Header: t(langKeys.unitcost),
            accessor: "unitcost",
            width: "auto",
          },
          {
            Header: t(langKeys.linecost),
            accessor: "onlinecost",
            width: "auto",
          },
        ],
        []
    );


    function handleOpenModalReservedProducts() {
        setOpenModalReservedProducts(true)
    }

    function handleOpenModalReturnProducts() {
        setOpenModalReturnProducts(true)
    }

    const columnsSelectionWarehouse = React.useMemo(
        () => [
          {
            Header: t(langKeys.warehouse),
            accessor: "name",
            width: "auto",
          },
          {
            Header: t(langKeys.description),
            accessor: "description",
            width: "auto",
          },
        ],
        []
      )

    return (
        <div className={classes.containerDetail}>
            <div className="row-zyx">
                <FieldEdit
                    label={"N° " + t(langKeys.inventory_consumption)}
                    valueDefault={getValues("inventoryconsumptionid")}
                    className="col-3"
                    disabled
                />
                <FieldEdit
                    label={t(langKeys.description)}
                    valueDefault={getValues("description")}
                    className="col-6"
                    maxLength={256}
                    error={(errors?.description?.message as string) ?? ""}
                    onChange={(value) => setValue("description", value)}
                />
                <FieldSelect
                    label={t(langKeys.status)}
                    className="col-3"
                    disabled={edit}
                    data={multiDataAux.data[2]?.data || []}
                    optionValue="domainvalue"
                    optionDesc="domaindesc"
                    valueDefault={getValues("transactiontype")}
                    onChange={(value) => {
                        setValue("transactiontype", value.domainvalue)
                        setDataDetail([]);                        
                    }}
                />
                <div className="row-zyx col-9">
                    <FieldEdit
                        label={t(langKeys.warehouse)}
                        className="col-3"
                        disabled
                        valueDefault={edit ? row?.warehousename : selectedWarehouse?.name}
                        error={(errors?.warehouseid?.message as string) ?? ""}
                        InputProps={
                            !edit
                                ? {
                                      endAdornment: (
                                          <IconButton
                                              onClick={() => {
                                                  setOpenModalWarehouse(true);
                                              }}
                                          >
                                              <Add />
                                          </IconButton>
                                      ),
                                  }
                                : {}
                        }
                    />
                </div>
                <FieldSelect
                    disabled={edit}
                    label={t(langKeys.status)}
                    className="col-3"
                    data={multiDataAux.data[0]?.data || []}
                    optionValue="domainvalue"
                    optionDesc="domaindesc"
                    valueDefault={getValues("status")}
                    onChange={(value) => setValue("status", value.domainvalue)}
                />
            </div>
            <div className="row-zyx">
                <div className="row-zyx">
                    <TitleDetail title={t(langKeys.inventoryconsumptionlines)} />
                </div>
                <div className="row-zyx">
                    <TableZyx
                        ButtonsElement={() => (
                            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "flex-end" }}>
                                <Button
                                    color="primary"
                                    style={{ backgroundColor: "#55BD84" }}
                                    onClick={handleOpenModalReturnProducts}
                                    disabled={!edit}
                                    variant="contained"
                                >
                                    {t(langKeys.selectproductsforreturn)}
                                </Button>
                                <Button
                                    color="primary"
                                    style={{ backgroundColor: "#55BD84" }}
                                    onClick={handleOpenModalReservedProducts}
                                    disabled={edit || !selectedWarehouse}
                                    variant="contained"
                                >
                                    {t(langKeys.selectreservedproducts)}
                                </Button>
                            </div>
                        )}
                        handleRegister={handleRegister}
                        columns={columns}
                        data={dataDetail}
                        loading={multiDataAux2.loading}
                        download={false}
                        filterGeneral={false}
                        register={!edit && Boolean(selectedWarehouse)}
                        onClickRow={handleEdit}
                    />
                </div>
            </div>
            <AddInventoryConsumptionLineDialog
                openModal={openModal}
                setOpenModal={setOpenModal}
                updateRecords={setDataDetail}
                rowSelected={rowSelected}
                warehouseProducts={warehouseProducts}
                row={row}
                edit={edit}
                transactiontype={getValues("transactiontype")}
                editRow={Boolean(row)}
            />
            <TableSelectionDialog
                openModal={openModalWarehouse}
                setOpenModal={setOpenModalWarehouse}
                setRow={setWarehouse}
                data={multiDataAux?.data?.[1]?.data || []}
                columns={columnsSelectionWarehouse}
                title={t(langKeys.warehouse)}
            />
            <SelectReservedProductsDialog
                openModal={openModalReservedProducts}
                setOpenModal={setOpenModalReservedProducts}
                updateRecords={setDataDetail}
            />
            <SelectProductsForReturnDialog
                openModal={openModalReturnProducts}
                setOpenModal={setOpenModalReturnProducts}
            />
        </div>
    );
}

export default InventoryConsumptionTabDetail;

