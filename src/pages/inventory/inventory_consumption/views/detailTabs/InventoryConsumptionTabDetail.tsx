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
import { execute, getCollection, getMultiCollectionAux2 } from 'store/main/actions';
import { manageConfirmation, showBackdrop } from 'store/popus/actions';
import SelectReservedProductsDialog from '../../dialogs/SelectReservedProductsDialog';
import SelectProductsForReturnDialog from '../../dialogs/SelectProductsForReturnDialog';
import { getInventoryConsumptionDetail, getWarehouseProducts } from 'common/helpers';
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
    setDetailToDelete:(arg0: any)=>void;
    setDataDetail:(arg0: any)=>void;
}

const InventoryConsumptionTabDetail: React.FC<WarehouseTabDetailProps> = ({
    row,
    edit,
    setValue,
    getValues,
    dataDetail,
    setDetailToDelete,
    setDataDetail,
    errors,
    viewSelected
}) => {
    const { t } = useTranslation();
    const classes = useStyles();
    const dispatch = useDispatch();
    const multiData = useSelector(state => state.main.multiDataAux);
    const multiDataAux2 = useSelector(state => state.main.multiDataAux2);
    const [openModal, setOpenModal] = useState(false);
    const [openModalWarehouse, setOpenModalWarehouse] = useState(false);
    const [openModalReservedProducts, setOpenModalReservedProducts] = useState(false);
    const [rowSelected, setRowSelected] = useState<Dictionary|null>(null);
    const [openModalReturnProducts, setOpenModalReturnProducts] = useState(false);
    const [selectedWarehouse, setSelectedWarehouse] = useState<any>(null);
    const [warehouseProducts, setWarehouseProducts] = useState<any>(null);
    const mainData = useSelector(state => state.main.mainData);

    function setWarehouse(warehouseSelected:any){
        setSelectedWarehouse(warehouseSelected)
        setValue('warehouseid', warehouseSelected.warehouseid)
    }

    useEffect(() => {
        if (viewSelected=="detail-view") {
            setSelectedWarehouse(null)
        }       
    }, [viewSelected]);

    useEffect(() => {
        if(!mainData?.loading && !mainData?.error){
            if(mainData?.key === "UFN_ALL_PRODUCT_WAREHOUSE_SEL"){
                setWarehouseProducts(mainData?.data||[])
            }
        }   
    }, [mainData]);

    useEffect(() => {
        if(selectedWarehouse && !edit){
            debugger
            dispatch(getCollection(getWarehouseProducts(selectedWarehouse?.warehouseid||0)))
        }
    }, [selectedWarehouse]);


    const handleDelete = (row: Dictionary) => {
        if (row && row.operation !== "INSERT") {
            setDetailToDelete((p: any) => [...p, { ...row, operation: "DELETE", status: 'ELIMINADO' }]);
        } else {
            row.operation = 'DELETE';
        }

        setDataDetail((p: any) => p.filter((x:any) => (row.operation === "DELETE" ? x.operation !== "DELETE" : row.inventoryconsumptionid !== x.inventoryconsumptionid)));
    }

    const handleEdit = (row: Dictionary) => {
        setOpenModal(true)
        setRowSelected({ row, edit: true })
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
                const row = props.cell.row.original;
                return (
                    <TemplateIcons
                        deleteFunction={() => handleDelete(row)}
                    />
                )
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
                    valueDefault={getValues('inventoryconsumptionid')}
                    className="col-3"
                    disabled
                />
                <FieldEdit
                    label={t(langKeys.description)}
                    valueDefault={getValues('description')}
                    className="col-6"
                    maxLength={256}
                    error={(errors?.description?.message as string) ?? ""}
                    onChange={(value) => setValue('description', value)}
                />
               <FieldSelect
                    label={t(langKeys.status)}
                    className="col-3"
                    disabled={edit}
                    data={(multiData.data[2]?.data||[])} 
                    optionValue="domainvalue"
                    optionDesc="domaindesc"
                    valueDefault={getValues("transactiontype")}
                    onChange={(value) => setValue("transactiontype", value.domainvalue)}  
                />
                <div className='row-zyx col-9'>
                    <FieldEdit
                        label={t(langKeys.warehouse)}
                        className="col-3"
                        disabled
                        valueDefault={edit? row?.warehousename: selectedWarehouse?.name}   
                        error={(errors?.warehouseid?.message as string) ?? ""}
                        InputProps={
                            !edit? {
                                    endAdornment: (
                                        <IconButton onClick={() => { setOpenModalWarehouse(true) }}>
                                            <Add />
                                        </IconButton>
                                    )
                                }: {}
                        }                   
                    />
                </div>
                <FieldSelect
                    disabled={edit}
                    label={t(langKeys.status)}
                    className="col-3"
                    data={(multiData.data[0]?.data||[])} 
                    optionValue="domainvalue"
                    optionDesc="domaindesc"
                    valueDefault={getValues("status")}
                    onChange={(value) => setValue("status", value.domainvalue)}  
                />
            </div>
            <div className="row-zyx">
                <div className='row-zyx'>
                    <TitleDetail
                        title={t(langKeys.inventoryconsumptionlines)}
                    />
                </div>
                <div className="row-zyx">
                    <TableZyx
                        ButtonsElement={() => (
                            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                                <Button
                                    color="primary"
                                    style={{ backgroundColor: "#55BD84" }}
                                    onClick={handleOpenModalReturnProducts}
                                    variant="contained"
                                >
                                    {t(langKeys.selectproductsforreturn)}
                                </Button>
                                <Button
                                    color="primary"
                                    style={{ backgroundColor: "#55BD84" }}
                                    onClick={handleOpenModalReservedProducts}
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
                        register={!edit && !!selectedWarehouse}
                        onClickRow={handleEdit}
                    />
                </div>
            </div>
            <AddInventoryConsumptionLineDialog
                openModal={openModal}
                setOpenModal={setOpenModal}
                rowSelected={rowSelected}
                warehouseProducts={warehouseProducts}
                row={row}
                edit={edit}
            />
            <TableSelectionDialog
                openModal={openModalWarehouse}
                setOpenModal={setOpenModalWarehouse}
                setRow={setWarehouse}
                data={multiData?.data?.[1]?.data||[]}
                columns={columnsSelectionWarehouse}
                title={t(langKeys.warehouse)}
            />
            <SelectReservedProductsDialog 
                openModal={openModalReservedProducts}
                setOpenModal={setOpenModalReservedProducts}
            />
            <SelectProductsForReturnDialog
                openModal={openModalReturnProducts}
                setOpenModal={setOpenModalReturnProducts}
            />
        </div>
    )
}

export default InventoryConsumptionTabDetail;

