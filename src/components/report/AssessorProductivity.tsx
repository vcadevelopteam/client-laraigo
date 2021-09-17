
import { Dictionary, MultiData } from "@types";
import React, { FC, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { useSelector } from 'hooks';
import { getCollectionAux, resetMainAux } from "store/main/actions";
import { getUserProductivitySel } from "common/helpers/requestBodies";
import TableZyx from "components/fields/table-paginated";
import { DateRangePicker, FieldMultiSelect, FieldSelect } from "components";
import { makeStyles } from '@material-ui/core/styles';
import Switch from "@material-ui/core/Switch/Switch";
import FormControlLabel from "@material-ui/core/FormControlLabel/FormControlLabel";
import { Button } from "@material-ui/core";
import { CalendarIcon, DownloadIcon, SearchIcon } from "icons";
import { Range } from 'react-date-range';

interface Assessor {
    row: Dictionary | null;
    multiData: MultiData[];
    allFilters: Dictionary[];
}

const useStyles = makeStyles((theme) => ({
    containerFilter: {
        width: '100%',
        marginTop: theme.spacing(2),
        padding: theme.spacing(2),
    },
    filterComponent: {
        width: '15%'
    },
    containerDetails: {
        marginTop: theme.spacing(2),
        marginBottom: theme.spacing(2),
        padding: theme.spacing(2),
        width: '100%'
    },
    containerItem: {
        display: 'flex',
        justifyContent: 'space-between',
        backgroundColor: '#FFF',
        padding: theme.spacing(2),
    },
    border: {
        padding: theme.spacing(2),
        borderColor: 'secondary',
        borderStyle: 'solid'
    },
    button: {
        padding: 12,
        fontWeight: 500,
        fontSize: '14px',
        textTransform: 'initial'
    },
}));

const AssessorProductivity: FC<Assessor> = ({ row, multiData, allFilters }) => {
    const { t } = useTranslation();
    const classes = useStyles();
    const dispatch = useDispatch();
    const detailCustomReport = useSelector(state => state.main.mainAux);
    const [allParameters, setAllParameters] = useState({});
    const [dateRange, setdateRange] = useState<Range>({
        startDate: new Date(new Date().setDate(0)),
        endDate: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0),
        key: 'selection'
    });
    const [openDateRangeModal, setOpenDateRangeModal] = useState(false);
    const [state, setState] = useState({ checkedA: false, checkedB: false });

    const columns = React.useMemo(
        () => [
            {
                Header: 'ID',
                accessor: 'userid',
                NoFilter: false,
            },
            {
                Header: 'Name of advisor',
                accessor: 'fullname',
                NoFilter: false
            },
            {
                Header: 'First login',
                accessor: 'hourfirstlogin',
                NoFilter: false
            },
            {
                Header: 'Nº ticket',
                accessor: 'totaltickets',
                NoFilter: false
            },
            {
                Header: 'Closed',
                accessor: 'closedtickets',
                NoFilter: false
            },
            {
                Header: 'Assigned',
                accessor: 'asignedtickets',
                NoFilter: false
            },
            {
                Header: 'Suspended',
                accessor: 'suspendedtickets',
                NoFilter: false
            },
            {
                Header: 'TME AVG',
                accessor: 'avgfirstreplytime',
                NoFilter: false
            },
            {
                Header: 'TME MAX',
                accessor: 'maxfirstreplytime',
                NoFilter: false
            },
            {
                Header: 'TME MIN',
                accessor: 'minfirstreplytime',
                NoFilter: false
            },
            {
                Header: 'TMO MAX',
                accessor: 'maxtotalduration',
                NoFilter: false
            },
            {
                Header: 'TMO MIN',
                accessor: 'mintotalduration',
                NoFilter: false
            },
            {
                Header: 'TMO advisor AVG',
                accessor: 'avgtotalasesorduration',
                NoFilter: false
            },
            {
                Header: 'TMO advisor max',
                accessor: 'maxtotalasesorduration',
                NoFilter: false
            },
            {
                Header: 'TMO advisor min',
                accessor: 'mintotalasesorduration',
                NoFilter: false
            },
            {
                Header: 'Minutes connected',
                accessor: 'userconnectedduration',
                NoFilter: false
            },
            {
                Header: 'Actual state',
                accessor: 'userstatus',
                NoFilter: false
            },
            {
                Header: 'Attetion group ',
                accessor: 'groups',
                NoFilter: false
            }
        ],
        []
    );

    useEffect(() => {
        setAllParameters({
            ...allParameters,
            ['startDate']: dateRange.startDate ? new Date(dateRange.startDate.setHours(10)).toISOString().substring(0, 10) : null,
            ['endDate']: dateRange.endDate ? new Date(dateRange.endDate.setHours(10)).toISOString().substring(0, 10) : null
        });
    }, [dateRange]);

    const fetchData = () => {
        dispatch(resetMainAux());
        dispatch(getCollectionAux(getUserProductivitySel({ ...allParameters })));
    };

    const setValue = (parameterName: any, value: any) => {
        setAllParameters({ ...allParameters, [parameterName]: value });
    }

    const handleChange = (event: any) => {
        setState({ ...state, [event.target.name]: event.target.checked });
        setValue("bot", event.target.checked);
    };

    const format = (date: Date) => date.toISOString().split('T')[0];

    return (
        <>
            <div className={classes.containerFilter} style={{ display: 'flex', gap: '30px', alignItems: 'flex-end' }}>
                <div>
                    <DateRangePicker
                        open={openDateRangeModal}
                        setOpen={setOpenDateRangeModal}
                        range={dateRange}
                        onSelect={setdateRange}
                    >
                        <Button
                            disabled={detailCustomReport.loading}
                            style={{ border: '2px solid #EBEAED', borderRadius: 4 }}
                            startIcon={<CalendarIcon />}
                            onClick={() => setOpenDateRangeModal(!openDateRangeModal)}
                        >
                            {format(dateRange.startDate!) + " - " + format(dateRange.endDate!)}
                        </Button>
                    </DateRangePicker>
                </div>
                {
                    allFilters.map(filtro => (
                        (filtro.values[0].multiselect ?
                            <FieldMultiSelect
                                label={t('report_' + row?.origin + '_filter_' + filtro.values[0].label || '')}
                                className={classes.filterComponent}
                                key={filtro.values[0].isListDomains ? filtro.values[0].filter + "_" + filtro.values[0].domainname : filtro.values[0].filter}
                                onChange={(value) => setValue(filtro.values[0].parameterName, value ? value.map((o: Dictionary) => o[filtro.values[0].optionValue]).join() : '')}
                                error=""
                                loading={detailCustomReport.loading}
                                data={multiData[multiData.findIndex(x => x.key === (filtro.values[0].isListDomains ? filtro.values[0].filter + "_" + filtro.values[0].domainname : filtro.values[0].filter))].data}
                                optionDesc={filtro.values[0].optionDesc}
                                optionValue={filtro.values[0].optionValue}
                            />
                            :
                            <FieldSelect
                                loading={detailCustomReport.loading}
                                label={t('report_' + row?.origin + '_filter_' + filtro.values[0].label || '')}
                                className={classes.filterComponent}
                                key={filtro.values[0].isListDomains ? filtro.values[0].filter + "_" + filtro.values[0].domainname : filtro.values[0].filter}
                                onChange={(value) => setValue(filtro.values[0].parameterName, value ? value[filtro.values[0].optionValue] : '')}
                                error=""
                                data={multiData[multiData.findIndex(x => x.key === filtro.values[0].isListDomains ? filtro.values[0].filter + "_" + filtro.values[0].domainname : filtro.values[0].filter)].data}
                                optionDesc={filtro.values[0].optionDesc}
                                optionValue={filtro.values[0].optionValue}
                            />
                        )
                    )
                    )
                }
                <FormControlLabel
                    control={<Switch checked={state.checkedA}
                        onChange={handleChange}
                        name="checkedA" />}
                    label="Incluir Bot"
                />
                <Button
                    disabled={detailCustomReport.loading}
                    variant="contained"
                    color="primary"
                    startIcon={<SearchIcon style={{ color: 'white' }} />}
                    style={{ marginLeft: 8, backgroundColor: '#55BD84', width: 120 }}
                    onClick={() => {
                        fetchData()
                    }}
                >Buscar</Button>
                <Button
                    className={classes.button}
                    variant="contained"
                    color="primary"
                    disabled={detailCustomReport.loading}
                    onClick={() => {
                        fetchData()
                    }}
                    startIcon={<DownloadIcon />}
                >Descargar</Button>
            </div>
            <div style={{ width: '100%' }}>
                <TableZyx
                    columns={columns}
                    titlemodule=''
                    data={detailCustomReport.data}
                    download={false}
                    loading={detailCustomReport.loading}
                    register={false}
                    filterrange={false}
                    fetchData={fetchData}
                />
            </div>
        </>
    );
};

export default AssessorProductivity;
