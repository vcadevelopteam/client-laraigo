/* eslint-disable react-hooks/exhaustive-deps */
import React, { FC, ReactElement, Fragment, useEffect, useState } from 'react';
import Box from '@material-ui/core/Box';
import { makeStyles } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';
import { langKeys } from 'lang/keys';
import { useSelector } from 'hooks';
import { Dictionary } from "@types";
import { getDateCleaned } from 'common/helpers';
import TableZyx from 'components/fields/table-simple';
import SearchIcon from '@material-ui/icons/Search';
import Button from '@material-ui/core/Button';
import { Range } from 'react-date-range';
import { CalendarIcon } from 'icons';
import { DateRangePicker } from 'components';
import { CircularProgress } from '@material-ui/core';
import { XAxis, YAxis, ResponsiveContainer, Tooltip as ChartTooltip, BarChart, Bar, PieChart, Pie, Cell, CartesianGrid, LabelList } from 'recharts';
import ListIcon from '@material-ui/icons/List';
import SettingsIcon from '@material-ui/icons/Settings';

const useStyles = makeStyles((theme) => ({
    container: {
        width: '100%'
    },
    containerDetails: {
        marginTop: theme.spacing(3)
    },
    media: {
        objectFit: "contain"
    },
    containerSearch: {
        width: '100%',
        display: 'flex',
        gap: theme.spacing(1),
        alignItems: 'center',
        [theme.breakpoints.up('sm')]: {
            width: '50%',
        },
    },
    containerFilter: {
        width: '100%',
        marginBottom: theme.spacing(2),
        display: 'flex',
        gap: 16,
        flexWrap: 'wrap'
    },
    filterComponent: {
        minWidth: '220px',
        maxWidth: '260px'
    },
    containerFilterGeneral: {
        display: 'flex',
        justifyContent: 'space-between',
        backgroundColor: '#FFF',
        padding: theme.spacing(1),
    },
    title: {
        fontSize: '22px',
        fontWeight: 'bold',
        color: theme.palette.text.primary,
    },
    containerHeader: {
        display: 'block',
        marginBottom: 0,
        [theme.breakpoints.up('sm')]: {
            display: 'flex',
        },
    },
    mb2: {
        marginBottom: theme.spacing(4),
    },
    button: {
        padding: 12,
        fontWeight: 500,
        fontSize: '14px',
        textTransform: 'initial'
    },
    containerHeaderItem: {
        backgroundColor: '#FFF',
        padding: 8,
        display: 'block',
        flexWrap: 'wrap',
        gap: 8,
        [theme.breakpoints.up('sm')]: {
            display: 'flex',
        }
    },
}));

var randomColor = () => Math.floor(Math.random() * 16777215).toString(16);

interface IGraphic {
    graphicType: string;
    column: string;
    FiltersElement?: ReactElement;
    openModal: boolean;
    setOpenModal: (value: boolean) => void;
    setView: (value: string) => void;
    daterange: any;
    handlerSearchGraphic: (value: any, value1: any) => void;
    row: Dictionary;
}

const RADIAN = Math.PI / 180;
const RenderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, summary, ...rest }: Dictionary) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
        <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
            {summary}
        </text>
    );
};

const TableResume: FC<{ graphicType: string; data: Dictionary[] }> = ({ data, graphicType }) => {
    const { t } = useTranslation();

    const columns = React.useMemo(
        () => [
            {
                Header: t(langKeys.field),
                accessor: 'columnname',
                NoFilter: true,
                Cell: (props: any) => {
                    const row = props.cell.row.original;

                    if (graphicType === "BAR")
                        return row.columnname;
                    return (
                        <div style={{ display: 'flex', gap: 4 }}>
                            <div style={{ width: 15, height: 15, backgroundColor: row.color }}></div>
                            {row.columnname}
                        </div>
                    )
                }
            },
            {
                Header: t(langKeys.amount),
                accessor: 'summary',
                NoFilter: true,
                type: 'number'
            },
            {
                Header: "Percentage",
                accessor: 'percentage',
                NoFilter: true,
                type: 'number'
            },
        ],
        []
    );

    return (
        <div>
            <TableZyx
                columns={columns}
                // titlemodule={t(langKeys.personAverageReplyTimexFecha)}
                data={data}
                download={false}
                pageSizeDefault={10}
                filterGeneral={false}
                toolsFooter={false}
            />
        </div>
    )
}

const Graphic: FC<IGraphic> = ({ graphicType, column, setOpenModal, setView, FiltersElement, row, daterange, handlerSearchGraphic }) => {
    const classes = useStyles();
    const { t } = useTranslation();
    const [openDateRangeModal, setOpenDateRangeModal] = useState(false);
    const [dataGraphic, setDataGraphic] = useState<Dictionary[]>([])

    const [dateRange, setdateRange] = useState<Range>({
        startDate: new Date(`${daterange.startDate} 10:00:00`),
        endDate: new Date(`${daterange.endDate} 10:00:00`),
        key: 'selection'
    });
    const mainGraphicRes = useSelector(state => state.main.mainGraphic);
    useEffect(() => {
        if (!mainGraphicRes.loading && !mainGraphicRes.error) {
            const total = mainGraphicRes.data.reduce((acc, item) => acc + parseInt(item.summary), 0)
            setDataGraphic(mainGraphicRes.data.map(x => ({
                ...x,
                summary: parseInt(x.summary),
                percentage: parseFloat(((parseInt(x.summary) / total) * 100).toFixed(2)),
                color: `#${randomColor()}`
            })));
        }
    }, [mainGraphicRes])

    return (
        <>
            <Box className={classes.containerHeaderItem} justifyContent="space-between" alignItems="center" >
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    <DateRangePicker
                        open={openDateRangeModal}
                        setOpen={setOpenDateRangeModal}
                        range={dateRange}
                        onSelect={setdateRange}
                    >
                        <Button
                            disabled={mainGraphicRes.loading}
                            style={{ border: '1px solid #bfbfc0', borderRadius: 4, color: 'rgb(143, 146, 161)' }}
                            startIcon={<CalendarIcon />}
                            onClick={() => setOpenDateRangeModal(!openDateRangeModal)}
                        >
                            {getDateCleaned(dateRange.startDate!) + " - " + getDateCleaned(dateRange.endDate!)}
                        </Button>
                    </DateRangePicker>
                    {FiltersElement && FiltersElement}
                    <Button
                        disabled={mainGraphicRes.loading}
                        variant="contained"
                        color="primary"
                        startIcon={<SearchIcon style={{ color: 'white' }} />}
                        style={{ backgroundColor: '#55BD84', width: 120 }}
                        onClick={() => handlerSearchGraphic(dateRange, column)}
                    >
                        {t(langKeys.search)}
                    </Button>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                    <Button
                        className={classes.button}
                        variant="contained"
                        color="primary"
                        onClick={() => setOpenModal(true)}
                        startIcon={<SettingsIcon />}
                    >
                        {t(langKeys.configuration)}
                    </Button>
                    <Button
                        className={classes.button}
                        variant="contained"
                        color="primary"
                        onClick={() => setView('GRID')}
                        startIcon={<ListIcon />}
                    >
                        {t(langKeys.grid_view)}
                    </Button>
                </div>
            </Box>
            <div style={{ fontWeight: 500, padding: 16 }}>
                Reporte gráfico de {t('report_' + row?.origin)} por {t('report_' + row?.origin + '_' + column)}
            </div>
            {mainGraphicRes.loading ? (
                <div style={{ flex: 1, height: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <CircularProgress />
                </div>
            ) : (graphicType === "BAR" ? (
                <div style={{ display: 'flex' }}>
                    <div style={{ flex: '0 0 70%', height: 500 }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                width={500}
                                height={300}
                                data={mainGraphicRes.data}
                                margin={{
                                    top: 5,
                                    right: 30,
                                    left: 20,
                                    bottom: 5,
                                }}
                            >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="columnname" />
                                <YAxis />
                                <ChartTooltip />
                                <Bar dataKey="summary" fill="#8884d8" >
                                    <LabelList dataKey="summary" position="inside" />
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                    <div>
                        <TableResume
                            graphicType={graphicType}
                            data={dataGraphic}
                        />
                    </div>
                </div>
            ) : (
                <div style={{ display: 'flex' }}>
                    <div style={{ flex: '0 0 70%', height: 500 }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <ChartTooltip />
                                <Pie
                                    data={dataGraphic}
                                    dataKey="summary"
                                    labelLine={false}
                                    label={RenderCustomizedLabel}
                                    nameKey="columnname"
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={40}
                                    fill="#8884d8"
                                >
                                    {dataGraphic.map((item, i) => (
                                        <Cell
                                            key={item.columnname}
                                            fill={item.color}
                                        />
                                    ))}
                                </Pie>
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <div>
                        <TableResume
                            graphicType={graphicType}
                            data={dataGraphic}
                        />
                    </div>
                </div>
            ))}
        </>

    )
}

export default Graphic;