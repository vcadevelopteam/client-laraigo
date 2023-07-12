/* eslint-disable react-hooks/exhaustive-deps */
import React, { FC, useEffect, useState } from 'react'; // we need this to make JSX compile
import { useSelector } from 'hooks';
import { useDispatch } from 'react-redux';
import Button from '@material-ui/core/Button';
import { TemplateIcons, TemplateBreadcrumbs } from 'components';
import { getCorpSel, getOrgSel, getPropertySelByNameOrg, getTimeZoneSel, getValuesFromDomain, getValuesFromDomainCorp, insOrg } from 'common/helpers';
import { Dictionary } from "@types";
import TableZyx from '../../components/fields/table-simple';
import { useTranslation } from 'react-i18next';
import { langKeys } from 'lang/keys';
import { getCollection, getMultiCollection, execute, resetAllMain } from 'store/main/actions';
import { showSnackbar, showBackdrop, manageConfirmation } from 'store/popus/actions';
import { getCurrencyList } from "store/signup/actions";
import ClearIcon from '@material-ui/icons/Clear';
import { getCountryList } from 'store/signup/actions';
import { useHistory } from 'react-router-dom';
import paths from 'common/constants/paths';
import DetailOrganization from './Detail/DetailOrganization';

interface RowSelected {
    row: Dictionary | null,
    edit: boolean
}

const Organizations: FC = () => {
    const history = useHistory();
    const dispatch = useDispatch();
    const ressignup = useSelector(state => state.signup.currencyList);
    const { t } = useTranslation();
    const mainResult = useSelector(state => state.main);
    const executeResult = useSelector(state => state.main.execute);

    const [viewSelected, setViewSelected] = useState("view-1");
    const [rowSelected, setRowSelected] = useState<RowSelected>({ row: null, edit: false });
    const [waitSave, setWaitSave] = useState(false);
    const arrayBread = [
        { id: "view-0", name: t(langKeys.configuration_plural) },
        { id: "view-1", name: t(langKeys.organization_plural) },
    ];
    function redirectFunc(view: string) {
        if (view === "view-0") {
            history.push(paths.CONFIGURATION)
            return;
        }
        setViewSelected(view)
    }

    const columns = React.useMemo(
        () => [
            {
                accessor: 'orgid',
                NoFilter: true,
                isComponent: true,
                minWidth: 60,
                width: '1%',
                Cell: (props: any) => {
                    const row = props.cell.row.original;
                    return (
                        <TemplateIcons
                            viewFunction={() => handleView(row)}
                            deleteFunction={() => handleDelete(row)}
                            editFunction={() => handleEdit(row)}
                        />
                    )
                }
            },
            {
                Header: t(langKeys.organization),
                accessor: 'orgdesc',
                NoFilter: true
            },
            {
                Header: t(langKeys.type),
                accessor: 'type',
                prefixTranslation: 'type_org_',
                NoFilter: true,
                Cell: (props: any) => {
                    const { type } = props.cell.row.original;
                    return (t(`type_org_${type}`.toLowerCase()) || "").toUpperCase()
                }
            },
            {
                Header: t(langKeys.status),
                accessor: 'status',
                NoFilter: true,
                prefixTranslation: 'status_',
                Cell: (props: any) => {
                    const { status } = props.cell.row.original;
                    return (t(`status_${status}`.toLowerCase()) || "").toUpperCase()
                }
            },
            {
                Header: t(langKeys.currency),
                accessor: 'currency',
                NoFilter: true,
                /*prefixTranslation: 'status_',
                Cell: (props: any) => {
                    const { status } = props.cell.row.original;
                    return (t(`status_${status}`.toLowerCase()) || "").toUpperCase()
                }*/
            },
        ],
        []
    );

    const fetchData = () => dispatch(getCollection(getOrgSel(0)));

    useEffect(() => {
        fetchData();
        dispatch(getCurrencyList())
        dispatch(getCountryList())
        dispatch(getMultiCollection([
            getValuesFromDomain("ESTADOGENERICO"),
            getValuesFromDomain("TIPOORG"),
            getCorpSel(0),
            getValuesFromDomainCorp('BILLINGDOCUMENTTYPE', '_DOCUMENT', 1, 0),
            getValuesFromDomain("TYPECREDIT"),
            getTimeZoneSel(),
            getPropertySelByNameOrg("VOXIMPLANTAUTOMATICRECHARGE", 0, "_RECHARGE"),
            getPropertySelByNameOrg("VOXIMPLANTRECHARGERANGE", 0, "_RANGE"),
            getPropertySelByNameOrg("VOXIMPLANTRECHARGEPERCENTAGE", 0, "_PERCENTAGE"),
            getPropertySelByNameOrg("VOXIMPLANTADDITIONALPERCHANNEL", 0, "_CHANNEL"),
        ]));
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
                const errormessage = t(executeResult.code || "error_unexpected_error", { module: t(langKeys.organization_plural).toLocaleLowerCase() })
                dispatch(showSnackbar({ show: true, severity: "error", message: errormessage }))
                dispatch(showBackdrop(false));
                setWaitSave(false);
            }
        }
    }, [executeResult, waitSave])

    const handleRegister = () => {
        setViewSelected("view-2");
        setRowSelected({ row: null, edit: true });
    }

    const handleView = (row: Dictionary) => {
        setViewSelected("view-2");
        setRowSelected({ row, edit: false });
    }

    const handleEdit = (row: Dictionary) => {
        setViewSelected("view-2");
        setRowSelected({ row, edit: true });
    }

    const handleDelete = (row: Dictionary) => {
        const callback = () => {
            dispatch(execute(insOrg({ ...row, description: row.orgdesc, type: row.type, operation: 'DELETE', status: 'ELIMINADO', id: row.orgid, currency: row.currency })));
            dispatch(showBackdrop(true));
            setWaitSave(true);
        }

        dispatch(manageConfirmation({
            visible: true,
            question: t(langKeys.confirmation_delete),
            callback
        }))
    }

    if (viewSelected === "view-1") {

        return (
            <div style={{ width: "100%", display: 'flex', flexDirection: 'column', flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <TemplateBreadcrumbs
                        breadcrumbs={arrayBread}
                        handleClick={redirectFunc}
                    />
                </div>
                <TableZyx
                    columns={columns}
                    titlemodule={t(langKeys.organization_plural, { count: 2 })}
                    data={mainResult.mainData.data}
                    download={true}
                    ButtonsElement={() => (
                        <Button
                            disabled={mainResult.mainData.loading}
                            variant="contained"
                            type="button"
                            color="primary"
                            startIcon={<ClearIcon color="secondary" />}
                            style={{ backgroundColor: "#FB5F5F" }}
                            onClick={() => history.push(paths.CONFIGURATION)}
                        >{t(langKeys.back)}</Button>
                    )}
                    onClickRow={handleEdit}
                    loading={mainResult.mainData.loading}
                    register={true}
                    handleRegister={handleRegister}
                />
            </div>
        )
    }
    else if (viewSelected === "view-2") {
        return (
            <DetailOrganization
                data={rowSelected}
                setViewSelected={redirectFunc}
                multiData={mainResult.multiData.data}
                fetchData={fetchData}
                dataCurrency={ressignup.data}
                arrayBread={arrayBread}
            />
        )
    } else
        return null;

}

export default Organizations;