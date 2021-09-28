/* eslint-disable react-hooks/exhaustive-deps */
import React, { FC, useEffect, useState } from 'react'; // we need this to make JSX compile
import { useSelector } from 'hooks';
import { useDispatch } from 'react-redux';
import { TemplateIcons, TemplateBreadcrumbs, DateRangePicker, FieldMultiSelect, FieldSelect } from 'components';
import { getOrgSel, getValuesFromDomain, insOrg } from 'common/helpers';
import { Dictionary } from "@types";
import TableZyx from 'components/fields/table-simple';
import { makeStyles } from '@material-ui/core/styles';
import SearchIcon from '@material-ui/icons/Search';
import Button from '@material-ui/core/Button';
import { useTranslation } from 'react-i18next';
import { langKeys } from 'lang/keys';
import { CalendarIcon } from 'icons';
import { getCollection, resetMain, getMultiCollection, execute } from 'store/main/actions';
import { showSnackbar, showBackdrop, manageConfirmation } from 'store/popus/actions';
import { Range } from 'react-date-range';
import { getDateCleaned } from 'common/helpers/functions'
const arrayBread = [
    { id: "view-1", name: "Designed reports" },
    { id: "view-2", name: "Report detail" }
];

const useStyles = makeStyles((theme) => ({
    containerFilters: {
        display: 'flex',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: theme.spacing(1),
        marginTop: theme.spacing(1)
    },
    itemFilter: {
        flex: '0 0 220px',
    },
    itemDate: {
        minHeight: 40,
        height: 40,
        border: '1px solid #bfbfc0',
        borderRadius: 4,
        color: 'rgb(143, 146, 161)'
    }
}));

interface MultiData {
    data: Dictionary[];
    success: boolean;
}

interface DetailReportProps {
    item: Dictionary;
    setViewSelected: (view: string) => void;
    multiData: MultiData[];
}

const initialRange = {
    startDate: new Date(new Date().setDate(0)),
    endDate: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0),
    key: 'selection'
}

const format = (date: Date) => date.toISOString().split('T')[0];

const PersonalizedReport: FC<DetailReportProps> = ({ setViewSelected, multiData, item: { columns, finishdate,
    startdate, channels, tags, usergroup, description } }) => {
    const classes = useStyles()
    const dispatch = useDispatch();
    const { t } = useTranslation();

    const [openDateRangeCreateDateModal, setOpenDateRangeCreateDateModal] = useState(false);
    const [openDateRangeFinishDateModal, setOpenDateRangeFinishDateModal] = useState(false);
    const [dateRangeCreateDate, setDateRangeCreateDate] = useState<Range>(initialRange);
    const [dateRangeFinishDate, setDateRangeFinishDate] = useState<Range>(initialRange);

    const [filters, setFilters] = useState({
        usergroup: "",
        communicationchannelid: "",
        tag: ""
    })

    const mainResult = useSelector(state => state.main);


    const dataGroups = multiData[1] && multiData[1].success ? multiData[1].data : [];
    const dataTags = multiData[2] && multiData[2].success ? multiData[2].data : [];
    const dataChannels = multiData[3] && multiData[3].success ? multiData[3].data : [];

    const columnstt = React.useMemo(
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

    const onSearch = () => {
        const body = {
            columns,
            filters: [
                ...(startdate ? [{
                    column: "startdate",
                    start: getDateCleaned(dateRangeCreateDate.startDate!!),
                    end: getDateCleaned(dateRangeCreateDate.endDate!!)
                }] : []),
                ...(finishdate ? [{
                    column: "finishdate",
                    start: getDateCleaned(dateRangeFinishDate.startDate!!),
                    end: getDateCleaned(dateRangeFinishDate.endDate!!)
                }] : []),
                ...(usergroup ? [{
                    column: "usergroup",
                    value: filters.usergroup
                }] : []),
                ...(tags ? [{
                    column: "tag",
                    value: filters.tag
                }] : []),
                ...(channels ? [{
                    column: "communicationchannelid",
                    value: filters.communicationchannelid
                }] : []),
            ]
        }
    }

    // console.log(item)

    return (
        <div style={{ width: '100%' }}>
            <TemplateBreadcrumbs
                breadcrumbs={arrayBread}
                handleClick={setViewSelected}
            />
            <div className={classes.containerFilters}>
                {startdate &&
                    <DateRangePicker
                        open={openDateRangeCreateDateModal}
                        setOpen={setOpenDateRangeCreateDateModal}
                        range={dateRangeCreateDate}
                        onSelect={setDateRangeCreateDate}
                    >
                        <Button
                            // disabled={loading}
                            className={classes.itemDate}
                            startIcon={<CalendarIcon />}
                            onClick={() => setOpenDateRangeCreateDateModal(!openDateRangeCreateDateModal)}
                        >
                            {format(dateRangeCreateDate.startDate!) + " - " + format(dateRangeCreateDate.endDate!)}
                        </Button>
                    </DateRangePicker>
                }
                {finishdate &&
                    <DateRangePicker
                        open={openDateRangeFinishDateModal}
                        setOpen={setOpenDateRangeFinishDateModal}
                        range={dateRangeFinishDate}
                        onSelect={setDateRangeFinishDate}
                    >
                        <Button
                            // disabled={loading}
                            className={classes.itemDate}
                            startIcon={<CalendarIcon />}
                            onClick={() => setOpenDateRangeFinishDateModal(!openDateRangeFinishDateModal)}
                        >
                            {format(dateRangeFinishDate.startDate!) + " - " + format(dateRangeFinishDate.endDate!)}
                        </Button>
                    </DateRangePicker>
                }
                {tags &&
                    <FieldSelect
                        label={t(langKeys.tag)}
                        className={classes.itemFilter}
                        onChange={(value) => setFilters(p => ({ ...p, tag: value.tag }))}
                        data={dataTags}
                        optionDesc="tag"
                        variant="outlined"
                        optionValue="tag"
                    />
                }
                {channels &&
                    <FieldMultiSelect
                        label={t(langKeys.channel_plural)}
                        className={classes.itemFilter}
                        variant="outlined"
                        onChange={(value) => setFilters(p => ({ ...p, communicationchannelid: value.map((o: Dictionary) => o.communicationchannelid).join() }))}
                        data={dataChannels}
                        optionDesc="communicationchanneldesc"
                        optionValue="communicationchannelid"
                    />
                }
                {usergroup &&
                    <FieldMultiSelect
                        label={t(langKeys.group_plural)}
                        className={classes.itemFilter}
                        variant="outlined"
                        onChange={(value) => setFilters(p => ({ ...p, usergroup: value.map((o: Dictionary) => o.domainvalue).join() }))}
                        data={dataGroups}
                        optionDesc="domaindesc"
                        optionValue="domainvalue"
                    />
                }
            </div>
            <div className={classes.containerFilters}>
                <Button
                    // disabled={loading}
                    variant="contained"
                    color="primary"
                    startIcon={<SearchIcon style={{ color: 'white' }} />}
                    style={{ backgroundColor: '#55BD84', width: 120 }}
                    onClick={onSearch}
                >
                    {t(langKeys.search)}
                </Button>
            </div>
            <TableZyx
                columns={columnstt}
                // titlemodule={description}
                data={mainResult.mainData.data}
                download={false}
                loading={mainResult.mainData.loading}
            // fetchData={fetchData}
            />
        </div >
    )

}

export default PersonalizedReport;