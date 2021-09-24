/* eslint-disable react-hooks/exhaustive-deps */
import React, { FC, useEffect, useState } from 'react'; // we need this to make JSX compile
import { useSelector } from 'hooks';
import { useDispatch } from 'react-redux';
import Button from '@material-ui/core/Button';
import { TemplateIcons} from 'components';
import { getCampaignLst, delCampaign, getValuesFromDomain, getCommChannelLst, getMessageTemplateSel, getUserGroupsSel } from 'common/helpers';
import { Dictionary } from "@types";
import TableZyx from '../../components/fields/table-simple';
import { makeStyles } from '@material-ui/core/styles';
import { useTranslation, Trans } from 'react-i18next';
import { langKeys } from 'lang/keys';
import { getCollection, resetMain, getMultiCollection, execute } from 'store/main/actions';
import { showSnackbar, showBackdrop, manageConfirmation } from 'store/popus/actions';
import { CampaignDetail } from 'pages';

interface RowSelected {
    row: Dictionary | null,
    edit: boolean
}

const useStyles = makeStyles((theme) => ({
    containerDetail: {
        marginTop: theme.spacing(2),
        padding: theme.spacing(2),
        background: '#fff',
    },
    button: {
        padding: 12,
        fontWeight: 500,
        fontSize: '14px',
        textTransform: 'initial'
    },
}));

export const Campaign: FC = () => {
    const dispatch = useDispatch();
    const classes = useStyles();
    const { t } = useTranslation();
    const mainResult = useSelector(state => state.main);
    const executeResult = useSelector(state => state.main.execute);

    const [viewSelected, setViewSelected] = useState("view-1");
    const [rowSelected, setRowSelected] = useState<RowSelected>({ row: null, edit: false });
    const [waitSave, setWaitSave] = useState(false);

    const columns = React.useMemo(
        () => [
            {
                accessor: 'id',
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
                Header: t(langKeys.campaign),
                accessor: 'title',
                NoFilter: true
            },
            {
                Header: t(langKeys.description),
                accessor: 'description',
                NoFilter: true
            },
            {
                Header: t(langKeys.startdate),
                accessor: 'startdate',
                NoFilter: true
            },
            {
                Header: t(langKeys.enddate),
                accessor: 'enddate',
                NoFilter: true
            },
            {
                Header: t(langKeys.status),
                accessor: 'status',
                NoFilter: true,
                Cell: (props: any) => {
                    const { status } = props.cell.row.original;
                    return (t(`status_${status}`.toLowerCase()) || "").toUpperCase()
                }
            },
        ],
        []
    )

    const fetchData = () => dispatch(getCollection(getCampaignLst()));

    useEffect(() => {
        fetchData();
        dispatch(getMultiCollection([
            getValuesFromDomain("ESTADOGENERICO"),
            getCommChannelLst(),
            getUserGroupsSel(),
            getMessageTemplateSel(0)
        ]));
        return () => {
            dispatch(resetMain());
        };
    }, []);

    useEffect(() => {
        if (waitSave) {
            if (!executeResult.loading && !executeResult.error) {
                dispatch(showSnackbar({ show: true, success: true, message: t(langKeys.successful_delete) }))
                fetchData();
                dispatch(showBackdrop(false));
                setWaitSave(false);
            } else if (executeResult.error) {
                const errormessage = t(executeResult.code || "error_unexpected_error", { module: t(langKeys.campaign).toLocaleLowerCase() })
                dispatch(showSnackbar({ show: true, success: false, message: errormessage }))
                dispatch(showBackdrop(false));
                setWaitSave(false);
            }
        }
    }, [executeResult, waitSave]);

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
            dispatch(execute(delCampaign({ ...row, operation: 'DELETE', status: 'ELIMINADO', id: row.id })));
            dispatch(showBackdrop(true));
            setWaitSave(true);
        }

        dispatch(manageConfirmation({
            visible: true,
            question: t(langKeys.confirmation_delete),
            callback
        }))
    }

    const AdditionalButtons = () => {
        return (
            <React.Fragment>
                <Button
                    className={classes.button}
                    variant="contained"
                    color="primary"
                    disabled={mainResult.mainData.loading}
                    // startIcon={<AddIcon color="secondary" />}
                    onClick={() => console.log('blacklist')}
                    style={{ backgroundColor: "#ea2e49" }}
                ><Trans i18nKey={langKeys.blacklist} />
                </Button>
                <Button
                    className={classes.button}
                    variant="contained"
                    color="primary"
                    disabled={mainResult.mainData.loading}
                    // startIcon={<AddIcon color="secondary" />}
                    onClick={() => console.log('report')}
                    style={{ backgroundColor: "#22b66e" }}
                ><Trans i18nKey={langKeys.report} />
                </Button>
            </React.Fragment>
        )
    }

    if (viewSelected === "view-1") {

        if (mainResult.mainData.error) {
            return <h1>ERROR</h1>;
        }

        return (
            <TableZyx
                columns={columns}
                titlemodule={t(langKeys.campaign_plural, { count: 2 })}
                data={mainResult.mainData.data}
                download={true}
                loading={mainResult.mainData.loading}
                register={true}
                ButtonsElement={AdditionalButtons}
                handleRegister={handleRegister}
            />
        )
    }
    else
        return (
            <CampaignDetail
                data={rowSelected}
                setViewSelected={setViewSelected}
                multiData={mainResult.multiData.data}
                fetchData={fetchData}
            />
        )
}