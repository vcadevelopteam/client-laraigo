import { getDomainByDomainNameList } from "common/helpers";
import CustomTableZyxEditable from "components/fields/customtable-editable";
import { useSelector } from "hooks";
import { langKeys } from "lang/keys";
import { CustomVariableTabProps } from "pages/person/model";
import { FC, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { getCollectionAux2 } from "store/main/actions";

const CustomVariableTab: FC<CustomVariableTabProps> = ({ tableData, setTableData }) => {
    const dispatch = useDispatch();
    const domains = useSelector(state => state.person.editableDomains);
    const { t } = useTranslation();
    const [skipAutoReset, setSkipAutoReset] = useState(false)
    const [updatingDataTable, setUpdatingDataTable] = useState(false);
    const domainsCustomTable = useSelector((state) => state.main.mainAux2);

    const updateCell = (rowIndex: number, columnId: string, value: string) => {
        setSkipAutoReset(true);
        const auxTableData = tableData
        auxTableData[rowIndex][columnId] = value
        setTableData(auxTableData)
        setUpdatingDataTable(!updatingDataTable);
    }
    useEffect(() => {
        if (!domains.loading && !domains.error && domains.value?.customVariables) {
            dispatch(getCollectionAux2(getDomainByDomainNameList(domains.value?.customVariables?.filter(item => item.domainname !== "").map(item => item.domainname).join(","))));
        }
    }, [domains]);

    useEffect(() => {
        setSkipAutoReset(false)
    }, [updatingDataTable])

    const columns = useMemo(
        () => [
            {
                Header: t(langKeys.variable),
                accessor: 'variablename',
                NoFilter: true,
                sortType: 'string'
            },
            {
                Header: t(langKeys.description),
                accessor: 'description',
                NoFilter: true,
                sortType: 'string',
            },
            {
                Header: t(langKeys.datatype),
                accessor: 'variabletype',
                NoFilter: true,
                sortType: 'string',
                prefixTranslation: 'datatype_',
                Cell: (props: any) => {
                    const { variabletype } = props.cell.row.original || {};
                    return (t(`datatype_${variabletype}`.toLowerCase()) || "").toUpperCase()
                }
            },
            {
                Header: t(langKeys.value),
                accessor: 'value',
                NoFilter: true,
                type: 'string',
                editable: true,
                width: 250,
                maxWidth: 250
            },
        ],
        []
    )
    return (
        <CustomTableZyxEditable
            columns={columns}
            data={(tableData).map(x => ({
                ...x,
                domainvalues: (domainsCustomTable?.data || []).filter(y => y.domainname === x?.domainname)
            }))}
            download={false}
            loading={domainsCustomTable.loading && domains.loading}
            register={false}
            filterGeneral={false}
            updateCell={updateCell}
            skipAutoReset={skipAutoReset}
        />
    );
}

export default CustomVariableTab;