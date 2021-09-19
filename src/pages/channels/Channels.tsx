/* eslint-disable react-hooks/exhaustive-deps */
import TableZyx from 'components/fields/table-simple';
import { useHistory } from 'react-router-dom';
import paths from 'common/constants/paths';
import { useDispatch } from 'react-redux';
import { useSelector } from 'hooks';
import { FC, useEffect, useState } from 'react';
import { langKeys } from 'lang/keys';
import { useTranslation } from 'react-i18next';
import { manageConfirmation, showBackdrop, showSnackbar } from 'store/popus/actions';
import { Dictionary } from '@types';
import React from 'react';
import { TemplateIcons } from 'components';
import { getCollection, resetMain } from 'store/main/actions';
import { getChannelSel } from 'common/helpers/requestBodies';
import { deleteChannel } from 'store/channel/actions';

interface RowSelected {
    row: Dictionary | null,
    edit: boolean
}

export const Channels: FC = () => {
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const mainResult = useSelector(state => state.main);
    const executeResult = useSelector(state => state.channel.channelList);

    const [rowSelected, setRowSelected] = useState<RowSelected>({ row: null, edit: false });
    const [waitSave, setWaitSave] = useState(false);
    const history = useHistory();
    
    const handleView = (row: Dictionary) => {
        //setViewSelected("view-2");
        setRowSelected({ row, edit: false });
    }

    const handleEdit = (row: Dictionary) => {
        //setViewSelected("view-2");
        setRowSelected({ row, edit: true });
    }
    
    const fetchData = () => dispatch(getCollection(getChannelSel(0)));

    useEffect(() => {
        if (waitSave) {
            console.log("dddaaaww", executeResult)
            if (!executeResult.loading && !executeResult.error) {
                console.log("ddaaa111")
                dispatch(showSnackbar({ show: true, success: true, message: t(langKeys.successful_delete) }))
                fetchData();
                
                dispatch(showBackdrop(false));
                setWaitSave(false);
                //dispatch(getCollection(getChannelSel(0)));
            } else if (executeResult.error) {
                console.log("ddaaa")
                const errormessage = t(executeResult.code || "error_unexpected_error", { module: t(langKeys.property).toLocaleLowerCase() })
                dispatch(showSnackbar({ show: true, success: false, message: errormessage }))
                dispatch(showBackdrop(false));
                setWaitSave(false);
            }
        }
    }, [executeResult, waitSave])

    const handleDelete = (row: Dictionary) => {
        const callback = () => {
            dispatch(deleteChannel({
                method: "UFN_COMMUNICATIONCHANNEL_INS",
                parameters:{
                    ...row,id:row.communicationchannelid, description:row.communicationchanneldesc, operation: 'DELETE', status: 'ELIMINADO' 
                }
                }));
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
                accessor: 'communicationchannelid',
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
                Header: t(langKeys.corporation),
                accessor: 'corpdesc',
                NoFilter: true
            },
            {
                Header: t(langKeys.organization),
                accessor: 'orgdesc',
                NoFilter: true
            },
            {
                Header: t(langKeys.communicationchannel),
                accessor: 'typedesc',
                NoFilter: true
            },
            {
                Header: t(langKeys.communicationchanneldesc),
                accessor: 'communicationchanneldesc',
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
    );

    useEffect(() => {
        fetchData();
        //dispatch(getMultiCollection([
        //    getValuesFromDomain("ESTADOGENERICO"),
        //    getValuesFromDomain("TIPOORG")
        //]));
        return () => {
            dispatch(resetMain());
        };
    }, []);
    
    return (
        <TableZyx
            columns={columns}
            titlemodule={t(langKeys.channel_plural, { count: 2 })}
            data={mainResult.mainData.data}
            download={true}
            loading={mainResult.mainData.loading}
            register={true}
            hoverShadow={true}
            handleRegister={() => history.push(paths.CHANNELS_ADD)}
        />
    );
};


