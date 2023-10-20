/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState } from 'react'; // we need this to make JSX compile
import { IconButton } from "@material-ui/core";
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
import { execute } from 'store/main/actions';
import { manageConfirmation, showBackdrop } from 'store/popus/actions';

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
    setValue: UseFormSetValue<any>;
    getValues: UseFormGetValues<any>;
    errors: FieldErrors<any>;
}

const InventoryConsumptionTabDetail: React.FC<WarehouseTabDetailProps> = ({
    row,
    setValue,
    getValues,
    errors,
}) => {
    const { t } = useTranslation();
    const classes = useStyles();
    const user = useSelector(state => state.login.validateToken.user);
    const [openModal, setOpenModal] = useState(false);
    const [openModalWarehouse, setOpenModalWarehouse] = useState(false);
    const [selectedWarehouse, setSelectedWarehouse] = useState<any>(null);
    const [waitSave, setWaitSave] = useState(false);

    const handleDelete = (row: Dictionary) => {
        const callback = () => {
            //dispatch(execute(insInventoryBalance({ ...row, operation: 'DELETE', status: 'ELIMINADO' })));
            dispatch(showBackdrop(true));
            setWaitSave(true);
        }

        dispatch(manageConfirmation({
            visible: true,
            question: t(langKeys.confirmation_delete),
            callback
        }))
    }

    const columns = React.useMemo(
        () => [
        {
            accessor: 'productalternativeid',
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
            accessor: "distributordescription",
            width: "auto",
          },
          {
            Header: t(langKeys.product),
            accessor: "manufacturerdescription",
            width: "auto",
          },
          {
            Header: t(langKeys.description),
            accessor: "model",
            width: "auto",
          },
          {
            Header: t(langKeys.quantity),
            accessor: "catalognumber",
            width: "auto",
          },
          {
            Header: t(langKeys.unitcost),
            accessor: "unitbuydescription",
            width: "auto",
          },
          {
            Header: t(langKeys.linecost),
            accessor: "lastprice",
            width: "auto",
          },
        ],
        []
    );

    function handleRegister() {
        setOpenModal(true)
    }

    const columnsSelectionWarehouse = React.useMemo(
        () => [
          {
            Header: t(langKeys.warehouse),
            accessor: "manufacturercode",
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
                    label={t(langKeys.inventory_consumption)}
                    valueDefault={getValues('name')}
                    className="col-3"
                    error={errors?.name?.message}
                    onChange={(value) => setValue('name', value)}
                />
                <FieldEdit
                    label={t(langKeys.description)}
                    valueDefault={getValues('description')}
                    className="col-6"
                    error={errors?.description?.message}
                    onChange={(value) => setValue('description', value)}
                />
                <FieldSelect
                    label={t(langKeys.transactiontype)}
                    className="col-3"
                    data={[]}
                    optionValue="manufacturerid"
                    optionDesc="description"
                    valueDefault={getValues("manufacturerid")}
                    onChange={(value) => setValue("manufacturerid", value.manufacturerid)}  
                />
                <div className='row-zyx col-9'>
                    <FieldEdit
                        label={t(langKeys.warehouse)}
                        className="col-3"
                        disabled
                        valueDefault={""}
                        InputProps={{
                            endAdornment: (
                                <IconButton onClick={()=>{setOpenModalWarehouse(true)}}>
                                    <Add />
                                </IconButton>
                            )
                        }}
                    />
                </div>
                <FieldEdit
                    label={t(langKeys.status)}
                    valueDefault={getValues('description')}
                    className="col-3"
                    error={errors?.description?.message}
                    onChange={(value) => setValue('description', value)}
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
                        columns={columns}
                        data={[]}
                        download={false}
                        filterGeneral={false}
                        register={true}
                        handleRegister={handleRegister}
                    />
                </div>
            </div>
            <AddInventoryConsumptionLineDialog
                openModal={openModal}
                setOpenModal={setOpenModal}
                row={row}
            />
            <TableSelectionDialog
                openModal={openModalWarehouse}
                setOpenModal={setOpenModalWarehouse}
                setRow={setSelectedWarehouse}
                data={[]}
                columns={columnsSelectionWarehouse}
                title={t(langKeys.warehouse)}
            />
        </div>
    )
}

export default InventoryConsumptionTabDetail;

function dispatch(arg0: any) {
    throw new Error('Function not implemented.');
}
