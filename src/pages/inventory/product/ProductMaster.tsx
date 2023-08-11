/* eslint-disable react-hooks/exhaustive-deps */
import React, { FC, useEffect, useState } from 'react';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import { useSelector } from 'hooks';
import { useDispatch } from 'react-redux';
import { TemplateIcons, DateRangePicker, Title, DialogZyx, FieldSelect } from 'components';
import { getDomainSel, insDomain, getDateCleaned } from 'common/helpers';
import { Dictionary } from "@types";
import { Trans, useTranslation } from 'react-i18next';
import { langKeys } from 'lang/keys';
import { getCollection, execute, resetAllMain } from 'store/main/actions';
import { showSnackbar, showBackdrop, manageConfirmation } from 'store/popus/actions';
import TableZyx from 'components/fields/table-simple';
import { Range } from 'react-date-range';
import { CalendarIcon, DuplicateIcon, SearchIcon } from 'icons';
import ProductMasterDetail from './ProductMasterDetail';
import BackupIcon from '@material-ui/icons/Backup';
import { ChangeStatusModal } from './components/ChangeStatusModal';

const selectionKey = 'domainname';

const initialRange = {
    startDate: new Date(new Date().setDate(1)),
    endDate: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0),
    key: 'selection'
}

interface RowSelected {
    row: Dictionary | null;
    edit: boolean;
}


const useStyles = makeStyles((theme) => ({
    button: {
        marginRight: theme.spacing(2),
    },
    containerHeader: {
        padding: theme.spacing(1),
    },
    itemDate: {
        minHeight: 40,
        height: 40,
        border: '1px solid #bfbfc0',
        borderRadius: 4,
        color: 'rgb(143, 146, 161)'
    },
}));

const ProductMaster: FC = () => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const mainResult = useSelector(state => state.main);
    const executeResult = useSelector(state => state.main.execute);
    const [viewSelected, setViewSelected] = useState("view-1");
    const [rowSelected, setRowSelected] = useState<RowSelected>({ row: null, edit: false });
    const [openDateRangeCreateDateModal, setOpenDateRangeCreateDateModal] = useState(false);
    const [dateRangeCreateDate, setDateRangeCreateDate] = useState<Range>(initialRange);
    const [waitSave, setWaitSave] = useState(false);
    const [selectedRows, setSelectedRows] = useState<Dictionary>({});
    const [cleanSelected, setCleanSelected] = useState(false)
    const [selectedTemplate, setSelectedTemplate] = useState("false")
    const [openModal, setOpenModal] = useState(false);
    const [openModalChangeStatus, setOpenModalChangeStatus] = useState(false);
    const classes = useStyles()

    function redirectFunc(view:string){
        setViewSelected(view)
    }
    const columns = React.useMemo(
        () => [
            {
                accessor: 'domainid',
                NoFilter: true,
                isComponent: true,
                minWidth: 60,
                width: '1%',
                Cell: (props: any) => {
                    const row = props.cell.row.original;
                    return (
                        <TemplateIcons
                            deleteFunction={() => handleDelete(row)}
                            editFunction={() => handleEdit(row)}
                            extraFunction={() => handleDuplicate(row)}
                            ExtraICon={() => <DuplicateIcon width={28} style={{ fill: '#7721AD' }} />}
                        />
                    )
                }
            },
            {
                Header: t(langKeys.product),
                accessor: 'product',
                width: "auto",
            },
            {
                Header: t(langKeys.description),
                accessor: 'description',
                width: "auto",
            },
            {
                Header: t(langKeys.type),
                accessor: 'type',
                width: "auto",
                prefixTranslation: 'type_domain_',
                Cell: (props: any) => {
                    const { type } = props.cell.row.original;
                    return (t(`type_domain_${type}`.toLowerCase()) || "").toUpperCase()
                }
            },
            {
                Header: t(langKeys.family),
                accessor: 'family',
                width: "auto",
            },
            {
                Header: t(langKeys.subfamily),
                accessor: 'subfamily',
                width: "auto",
            },
            {
                Header: t(langKeys.purchase_unit),
                accessor: 'purchase_unit',
                width: "auto",
            },
            {
                Header: t(langKeys.dispatch_unit),
                accessor: 'dispatch_unit',
                width: "auto",
            },
            {
                Header: t(langKeys.status),
                accessor: 'status',
                width: "auto",
                prefixTranslation: 'status_',
                Cell: (props: any) => {
                    const { status } = props.cell.row.original;
                    return (t(`status_${status}`.toLowerCase()) || "").toUpperCase()
                }
            }
        ],
        []
    );

    const fetchData = () => dispatch(getCollection(getDomainSel('')));

    useEffect(() => {
        return () => {
            dispatch(resetAllMain());
        };
    }, []);

    useEffect(() => {
        if (waitSave) {
            if (!executeResult.loading && !executeResult.error) {
                dispatch(showSnackbar({ show: true, severity: "success", message: t(langKeys.successful_delete) }))
                fetchData();
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

    const handleRegister = () => {
        setViewSelected("view-2");
        setRowSelected({ row: null, edit: false });
    }

    const handleEdit = (row: Dictionary) => {
        setViewSelected("view-2");
        setRowSelected({ row, edit: true });
    }
    const handleDuplicate = (row: Dictionary) => {
        setViewSelected("view-2");
        setRowSelected({ row, edit: false });
    }

    const handleDelete = (row: Dictionary) => {
        const callback = () => {
            dispatch(execute(insDomain({ ...row, operation: 'DELETE', status: 'ELIMINADO' })));
            dispatch(showBackdrop(true));
            setWaitSave(true);
        }

        dispatch(manageConfirmation({
            visible: true,
            question: t(langKeys.confirmation_delete),
            callback
        }))
    }
    function handleImport(){
        setOpenModal(false)        
    }

    if (viewSelected === "view-1") {

        if (mainResult.mainData.error) {
            return <h1>ERROR</h1>;
        }

        return (
            <div style={{ width: "100%", display: 'flex', flexDirection: 'column', flex: 1 }}>

                <div style={{ display: 'flex', gap: 8, flexDirection: 'row', marginBottom: 12, marginTop: 4 }}>
                    <div style={{ flexGrow: 1 }} >
                        <Title><Trans i18nKey={langKeys.productMaster} /></Title>
                    </div>
                </div>
                <TableZyx
                    columns={columns}
                    data={mainResult.mainData.data}
                    download={true}
                    onClickRow={handleEdit}
                    loading={mainResult.mainData.loading}
                    handleRegister={handleRegister}
                    filterGeneral={false}
                    useSelection={true}
                    setSelectedRows={setSelectedRows}
                    initialSelectedRows={selectedRows}
                    cleanSelection={cleanSelected}
                    setCleanSelection={setCleanSelected}
                    register={true}
                    selectionKey={selectionKey}
                    ButtonsElement={() => (
                        <div className={classes.containerHeader} style={{display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'space-between'}}>
                            <div style={{display: 'flex', gap: 8}}>
                                <DateRangePicker
                                    open={openDateRangeCreateDateModal}
                                    setOpen={setOpenDateRangeCreateDateModal}
                                    range={dateRangeCreateDate}
                                    onSelect={setDateRangeCreateDate}
                                >
                                    <Button
                                        className={classes.itemDate}
                                        startIcon={<CalendarIcon />}
                                        onClick={() => setOpenDateRangeCreateDateModal(!openDateRangeCreateDateModal)}
                                    >
                                        {getDateCleaned(dateRangeCreateDate.startDate!) + " - " + getDateCleaned(dateRangeCreateDate.endDate!)}
                                    </Button>
                                </DateRangePicker>
                                <div>
                                    <Button
                                        disabled={mainResult.mainData.loading}
                                        variant="contained"
                                        color="primary"
                                        startIcon={<SearchIcon style={{ color: 'white' }} />}
                                        style={{ width: 120, backgroundColor: "#55BD84" }}
                                        onClick={() => fetchData()}
                                    >{t(langKeys.search)}
                                    </Button>
                                </div>
                                <div>
                                    <Button
                                        className={classes.button}
                                        variant="contained"
                                        component="span"
                                        color="primary"
                                        onClick={()=>setOpenModal(true)}
                                        startIcon={<BackupIcon color="secondary" />}
                                        style={{ backgroundColor: "#55BD84" }}
                                    ><Trans i18nKey={langKeys.import} />
                                    </Button>
                                </div>
                                <div>
                                    <Button
                                        disabled={!!selectedRows}
                                        className={classes.button}
                                        variant="contained"
                                        component="span"
                                        color="primary"
                                        onClick={()=>setOpenModalChangeStatus(true)}
                                        style={{ backgroundColor: "#55BD84" }}
                                    ><Trans i18nKey={langKeys.change_status} />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )}
            />
            
                <DialogZyx
                    open={openModal}
                    title={t(langKeys.import)}
                    button1Type="button"
                    buttonText1={t(langKeys.cancel)}
                    handleClickButton1={()=>setOpenModal(false)}
                    button2Type="button"
                    buttonText2={t(langKeys.import)}
                    handleClickButton2={handleImport}
                >
                    <div className="row-zyx">
                        <FieldSelect
                            label={t(langKeys.template)}
                            className="col-12"
                            valueDefault={selectedTemplate}
                            onChange={(value) => setSelectedTemplate(value?.template)}
                            data={[]}
                            optionDesc="desc"
                            optionValue="value"
                        />
                    </div>
                </DialogZyx>
                <ChangeStatusModal
                    openModal={openModalChangeStatus}
                    setOpenModal={setOpenModalChangeStatus} 
                    massive={true}                
                />
            </div>
        )
    }
    else
        return (
            <ProductMasterDetail
                data={rowSelected}
                setViewSelected={redirectFunc}
                multiData={mainResult.multiData.data}
                fetchData={fetchData}
            />
        )
}

export default ProductMaster;