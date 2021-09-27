/* eslint-disable react-hooks/exhaustive-deps */
import React, { FC, useEffect, useState } from 'react'; // we need this to make JSX compile
import { useSelector } from 'hooks';
import { useDispatch } from 'react-redux';
import Button from '@material-ui/core/Button';
import { TemplateIcons, TemplateBreadcrumbs, TitleDetail, FieldView, FieldEdit, FieldSelect } from 'components';
import { getOrgSel, getValuesFromDomain, insOrg } from 'common/helpers';
import { Dictionary } from "@types";
import TableZyx from 'components/fields/table-simple';
import { makeStyles } from '@material-ui/core/styles';
import SaveIcon from '@material-ui/icons/Save';
import { useTranslation } from 'react-i18next';
import { langKeys } from 'lang/keys';
import { useForm } from 'react-hook-form';
import { getCollection, resetMain, getMultiCollection, execute } from 'store/main/actions';
import { showSnackbar, showBackdrop, manageConfirmation } from 'store/popus/actions';
import { Range } from 'react-date-range';

const arrayBread = [
    { id: "view-1", name: "Designed reports" },
    { id: "view-2", name: "Report detail" }
];

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

interface MultiData {
    data: Dictionary[];
    success: boolean;
}

interface DetailReportProps {
    item: Dictionary;
    setViewSelected: (view: string) => void;
    multiData?: MultiData[];
}

const initialRange = {
    startDate: new Date(new Date().setDate(0)),
    endDate: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0),
    key: 'selection'
}

const PersonalizedReport: FC<DetailReportProps> = ({ setViewSelected, item }) => {
    
    const dispatch = useDispatch();
    const { t } = useTranslation();

    const [dateRangeCreateDate, setDateRangeCreateDate] = useState<Range>(initialRange);
    const [dateRangeFinishDate, setDateRangeFinishDate] = useState<Range>(initialRange);

    const mainResult = useSelector(state => state.main);

    const columns = React.useMemo(
        () => [
            {
                Header: t(langKeys.description),
                accessor: 'orgdesc',
                NoFilter: true
            },
            {
                Header: t(langKeys.type),
                accessor: 'type',
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

    const fetchData = () => dispatch(getCollection(getOrgSel(0)));

    useEffect(() => {
        // fetchData();
        // dispatch(getMultiCollection([
        //     getValuesFromDomain("ESTADOGENERICO"),
        //     getValuesFromDomain("TIPOORG")
        // ]));
        // return () => {
        //     dispatch(resetMain());
        // };
    }, []);

    console.log(item)

    return (
        <div style={{width: '100%'}}>
            <TemplateBreadcrumbs
                breadcrumbs={arrayBread}
                handleClick={setViewSelected}
            />
            <TableZyx
                columns={columns}
                titlemodule={item.description}
                data={mainResult.mainData.data}
                download={true}
                loading={mainResult.mainData.loading}
            // fetchData={fetchData}
            />
        </div >
    )

}

export default PersonalizedReport;