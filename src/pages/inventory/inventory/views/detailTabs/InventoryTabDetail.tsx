/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react'; // we need this to make JSX compile
import { Dictionary, IFile } from "@types";
import { makeStyles } from '@material-ui/core/styles';
import { Button } from "@material-ui/core";
import { Search as SearchIcon } from "@material-ui/icons";
import Box from '@material-ui/core/Box';
import { ItemFile, UploaderIcon } from '../../components/components';
import { useTranslation } from 'react-i18next';
import { langKeys } from 'lang/keys';
import { FieldErrors, UseFormGetValues, UseFormSetValue } from 'react-hook-form';
import { FieldEdit, FieldCheckbox, TitleDetail, TemplateIcons } from 'components';
import TableZyx from "components/fields/table-simple";
import { useSelector } from 'hooks';
import RegisterInventoryBalanceDialog from '../../dialogs/RegisterInventoryBalanceDialog';
import { convertLocalDate, insInventoryBalance } from 'common/helpers';
import { useDispatch } from 'react-redux';
import { execute } from 'store/main/actions';
import { manageConfirmation, showBackdrop, showSnackbar } from 'store/popus/actions';

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
    button: {
        marginRight: theme.spacing(2),
    },
}));

interface InventoryTabDetailProps {
    row: Dictionary | null;
    setValue: UseFormSetValue<any>;
    getValues: UseFormGetValues<any>;
    errors: FieldErrors<any>;
    tabIndex:any
    fetchdata:any
}

const InventoryTabDetail: React.FC<InventoryTabDetailProps> = ({
    row,
    setValue,
    getValues,
    errors,
    tabIndex,
    fetchdata
}) => {
    const { t } = useTranslation();
    const classes = useStyles();
    const initialValueAttachments = getValues('attachments');
    const [files, setFiles] = useState<IFile[]>(initialValueAttachments? initialValueAttachments.split(',').map((url:string) => ({ url })):[]);
    const [openModal, setOpenModal] = useState(false);
    const dataBalance = useSelector(state => state.main.mainAux);
    const dispatch = useDispatch();
    const [waitSave, setWaitSave] = useState(false);
    const executeResult = useSelector(state => state.main.execute);

    useEffect(() => {
      if(tabIndex===0){
        fetchdata();
      }
    }, [tabIndex])

    useEffect(() => {
        if (waitSave) {
            if (!executeResult.loading && !executeResult.error) {
                dispatch(showSnackbar({ show: true, severity: "success", message: t(langKeys.successful_delete) }))
                fetchdata();
                dispatch(showBackdrop(false));
                setWaitSave(false);
            } else if (executeResult.error) {
                const errormessage = t(executeResult.code || "error_unexpected_error", { module: t(langKeys.domain).toLocaleLowerCase() })
                dispatch(showSnackbar({ show: true, severity: "error", message: errormessage }))
                dispatch(showBackdrop(false));
                setWaitSave(false);
            }
        }
    }, [executeResult, waitSave])

    const handleDelete = (row: Dictionary) => {
        const callback = () => {
            dispatch(execute(insInventoryBalance({ ...row, operation: 'DELETE', status: 'ELIMINADO' })));
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
            Header: t(langKeys.shelf),
            accessor: "shelf",
            width: "auto",
          },
          {
            Header: t(langKeys.batch),
            accessor: "lotecode",
            width: "auto",
          },
          {
            Header: t(langKeys.current_balance),
            accessor: "currentbalance",
            width: "auto",
          },
          {
            Header: t(langKeys.physicalcount),
            accessor: "recountphysical",
            width: "auto",
          },
          {
            Header: t(langKeys.dateofphysicalcount),
            accessor: "recountphysicaldate",
            width: "auto",
            sortType: 'datetime',
            Cell: (props: any) => {
                const row = props.cell.row.original;
                return convertLocalDate(row.recountphysicaldate).toLocaleString()
            }
          },
          {
            Header: t(langKeys.isconciliated),
            accessor: "isreconciled",
            width: "auto",
            type: 'boolean',
            sortType: 'basic',
            Cell: (props: any) => {
                const { isreconciled } = props.cell.row.original;
                return isreconciled ? t(langKeys.yes) : "No"
            }
          },
          {
            Header: t(langKeys.shelflifeindays),
            accessor: "shelflifedays",
            width: "auto",
          },
          {
            Header: t(langKeys.dueDate),
            accessor: "duedate",
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
            <div className="row-zyx">
                <div className='col-6'>
                    <div className='row-zyx'>
                        <FieldEdit
                            label={t(langKeys.product)}
                            valueDefault={row?.productcode}
                            className="col-6"
                            disabled={true}
                        />
                        <FieldEdit
                            label={t(langKeys.description)}
                            valueDefault={row?.productdescription}
                            className="col-6"
                            disabled={true}
                        />
                    </div>
                    <div className='row-zyx'>
                        <FieldEdit
                            label={t(langKeys.warehouse)}
                            valueDefault={row?.warehousename}
                            className="col-6"
                            disabled={true}
                        />
                        <FieldEdit
                            label={t(langKeys.description)}
                            valueDefault={row?.warehousedescription}
                            className="col-6"
                            disabled={true}
                        />
                    </div>
                    <div className='row-zyx'>
                        <FieldCheckbox
                            label={`${t(langKeys.warehouse)} ${t(langKeys.default)}`}
                            className="col-6"
                            valueDefault={row?.iswharehousedefault}
                            disabled={true}
                        />
                    </div>
                    <div className='row-zyx'>
                        <FieldEdit
                            label={t(langKeys.default_shelf)}
                            valueDefault={getValues('rackdefault')}
                            className="col-6"
                            error={errors?.rackdefault?.message}
                            onChange={(value) => setValue('rackdefault', value)}
                        />
                    </div>
                </div>
                <div className='row-zyx col-6'>
                    <div className='col-6'>
                        <div className='row-zyx'>
                            <FieldEdit
                                label={t(langKeys.typecostdispatch)}
                                valueDefault={row?.unitdispatchdescription}
                                className="col-6"
                                disabled={true}
                            />  
                        </div>
                        <div className='row-zyx'>
                            <FieldEdit
                                label={t(langKeys.current_balance)}
                                valueDefault={row?.currentbalance}
                                className="col-6"
                                disabled={true}
                            />
                        </div>
                        <div className='row-zyx'>
                            <FieldEdit
                                label={t(langKeys.family)}
                                valueDefault={row?.familydescription}
                                className="col-6"
                                disabled={true}
                            /> 
                        </div>
                        <div className='row-zyx'>
                            <FieldEdit
                                label={t(langKeys.status)}
                                valueDefault={row?.status}
                                className="col-6"
                                disabled={true}
                            /> 
                        </div>  
                    </div>
                    <div className='row-zyx col-6'>
                        <div className="col-12">
                            <Box fontWeight={500} lineHeight="18px" fontSize={14} mb={1} color="textPrimary">{t(langKeys.files)}</Box>
                            <UploaderIcon classes={classes} setFiles={setFiles} />
                            
                            {files.length > 0 &&
                                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', borderBottom: '1px solid #EBEAED', paddingBottom: 8 }}>
                                    {files.map((item: IFile) => <ItemFile key={item.id} item={item} setFiles={setFiles} />)}
                                </div>
                            }
                        </div>
                        <div className='col-12'>
                            <FieldEdit
                                label={t(langKeys.subfamily)}
                                valueDefault={row?.subfamilydescription}
                                className="col-6"
                                disabled={true}
                            /> 
                        </div>
                    </div>
                </div>
            </div>
            <div className="row-zyx">
                <div className='col-6'>
                    <div className='row-zyx'>
                        <TitleDetail
                            title={t(langKeys.availablebalancesummary)}
                        />
                    </div>
                    <div className='row-zyx'>
                        <FieldEdit
                            label={t(langKeys.current_balance)}
                            valueDefault={row?.currentbalance}
                            className="col-6"
                            error={errors?.address?.message}
                            onChange={(value) => setValue('address', value)}
                            disabled={true}
                        />  
                    </div>
                    <div className='row-zyx'>
                        <FieldEdit
                            label={t(langKeys.overdueamountinstock)}
                            valueDefault={row?.expiredamountstock}
                            className="col-6"
                            disabled={true}
                        />
                    </div>
                    <div className='row-zyx'>
                        <FieldEdit
                            label={t(langKeys.availablequantity)}
                            valueDefault={row?.quantityavailable}
                            className="col-6"
                            disabled={true}
                        />  
                    </div>
                    <div className='row-zyx'>
                        <FieldEdit
                            label={t(langKeys.reservedquantity)}
                            valueDefault={row?.reservedquantity}
                            className="col-6"
                            disabled={true}
                        />
                    </div>
                </div>
                <div className='col-6'>
                    <div className='row-zyx'>
                        <TitleDetail
                            title={t(langKeys.dispatchhistory)}
                        />
                    </div>
                    <div className='row-zyx'>
                        <FieldEdit
                            label={t(langKeys.dateoflastshipment)}
                            type="datetime-local"
                            valueDefault={new Date(row?.lastdispatch).toISOString().substring(0, 16)}
                            className="col-6"
                            disabled={true}
                        />  
                    </div>
                    <div className='row-zyx'>
                        <FieldEdit
                            label={t(langKeys.accumulatedannual)}
                            valueDefault={row?.annualcumulative}
                            className="col-6"
                            disabled={true}
                        />
                    </div>
                    <div className='row-zyx'>
                        <FieldEdit
                            label={t(langKeys.lastyear)}
                            valueDefault={row?.lastyear}
                            className="col-6"
                            disabled={true}
                        />  
                    </div>
                    <div className='row-zyx'>
                        <FieldEdit
                            label={t(langKeys.lasttwoyears)}
                            valueDefault={row?.last2year}
                            className="col-6"
                            disabled={true}
                        />
                    </div>
                </div>
            </div>
            <div className="row-zyx">
                <div className='row-zyx'>
                    <TitleDetail
                        title={t(langKeys.inventorycosts)}
                    />
                </div>
                <div className='row-zyx'>
                    <FieldEdit
                        label={t(langKeys.standard_cost)}
                        valueDefault={row?.standarcost}
                        className="col-4"
                        disabled={true}
                    />
                    <FieldEdit
                        label={t(langKeys.average_cost)}
                        valueDefault={row?.averagecost}
                        className="col-4"
                        disabled={true}
                    />
                    <FieldEdit
                        label={t(langKeys.dateoflastmodification)}
                        type="datetime-local"
                        valueDefault={new Date(row?.lastmodified).toISOString().substring(0, 16)}
                        className="col-4"
                        error={errors?.address?.message}
                        onChange={(value) => setValue('address', value)}
                        disabled={true}
                    />  
                </div>
            </div>
            <div className='row-zyx'>
                <div className='row-zyx'>
                    <TitleDetail
                        title={t(langKeys.inventorybalance)}
                    />
                </div>
                <div className='row-zyx'>
                    <TableZyx
                        columns={columns}
                        data={dataBalance?.data||[]}
                        download={false}
                        filterGeneral={false}
                        register={true}
                        handleRegister={handleRegister}
                    />
                </div>
            </div>
            <RegisterInventoryBalanceDialog
                openModal={openModal}
                setOpenModal={setOpenModal}
                row={row}
                fetchData={fetchdata}
            />
        </div>
    )
}

export default InventoryTabDetail;