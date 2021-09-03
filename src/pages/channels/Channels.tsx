import TableZyx from 'components/fields/table-simple';
import { useHistory } from 'react-router-dom';
import paths from 'common/constants/paths';
import { useDispatch } from 'react-redux';
import { useSelector } from 'hooks';
import { FC, useEffect, useState } from 'react';
import { langKeys } from 'lang/keys';
import { useTranslation } from 'react-i18next';
import { manageConfirmation, showBackdrop } from 'store/popus/actions';
import { Dictionary } from '@types';
import React from 'react';
import { TemplateIcons } from 'components';
import { getCollection, resetMain } from 'store/main/actions';
import { getChannelSel } from 'common/helpers/requestBodies';

interface RowSelected {
    row: Dictionary | null,
    edit: boolean
}

export const Channels: FC = () => {
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const mainResult = useSelector(state => state.main);
    const executeResult = useSelector(state => state.main.execute);

    const [viewSelected, setViewSelected] = useState("view-1");
    const [rowSelected, setRowSelected] = useState<RowSelected>({ row: null, edit: false });
    const [waitSave, setWaitSave] = useState(false);
    const history = useHistory();
    const handleRegister = () => {
        //setViewSelected("view-2");
        setRowSelected({ row: null, edit: true });
    }

    const handleView = (row: Dictionary) => {
        //setViewSelected("view-2");
        setRowSelected({ row, edit: false });
    }

    const handleEdit = (row: Dictionary) => {
        //setViewSelected("view-2");
        setRowSelected({ row, edit: true });
    }

    const handleDelete = (row: Dictionary) => {
        const callback = () => {
            //dispatch(execute(insOrg({description:row.orgdesc, type:row.type, operation: 'DELETE', status: 'ELIMINADO', id: row.orgid })));
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
                NoFilter: true
            },
        ],
        []
    );
    const fetchData = () => dispatch(getCollection(getChannelSel(0)));

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
            titlemodule={t(langKeys.user, { count: 2 })}
            data={mainResult.mainData.data}
            download={true}
            loading={mainResult.mainData.loading}
            register={true}
            hoverShadow={true}
            handleRegister={() => history.push(paths.CHANNELS_ADD.path)}
        />
    );
};


