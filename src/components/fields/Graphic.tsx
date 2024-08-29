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
import { XAxis, YAxis, ResponsiveContainer, Tooltip as ChartTooltip, BarChart, Bar, PieChart, Pie, Cell, CartesianGrid, LabelList, LineChart, Line } from 'recharts';
import ListIcon from '@material-ui/icons/List';
import SettingsIcon from '@material-ui/icons/Settings';
import KeyboardArrowLeftIcon from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@material-ui/icons/KeyboardArrowRight';
import { CellProps } from 'react-table';

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
interface IGraphic {
    graphicType: string;
    column: string;
    FiltersElement?: ReactElement;
    openModal: boolean;
    setOpenModal: (value: boolean) => void;
    setView: (value: string) => void;
    daterange: any;
    handlerSearchGraphic: (value: any, value1: any) => void;
    row?: Dictionary;
    withFilters?: boolean;
    withButtons?: boolean;
    data?: Dictionary[];
    loading?: boolean;
    columnDesc?: string;
}

const RADIAN = Math.PI / 180;
export const RenderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, summary, ...rest }: Dictionary) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
        <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
            {summary}
        </text>
    );
};

const TableResume: FC<{ row?: Dictionary; column: string; graphicType: string; data: Dictionary[]; columnDesc?: string }> = ({ row, column, data, graphicType, columnDesc }) => {
    const { t } = useTranslation();


    const columns = React.useMemo(
        () => [
            {
                Header: !!columnDesc ? columnDesc : t('report_' + row?.origin + '_' + column),
                accessor: 'columnname',
                NoFilter: true,               
                Cell: (props: CellProps<Dictionary>) => {
                    const row = props.cell.row.original || {};

                    return (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                            <div style={{ width: 15, height: 15, backgroundColor: row.color }}></div>
                            {t(row?.columnname)}
                        </div>
                    );
                },
            },
            {
                Header: t(langKeys.quantity),
                accessor: 'summary',
                NoFilter: true,
                type: 'number'
            },
            {
                Header: t(langKeys.percentage),
                accessor: 'percentage',
                NoFilter: true,
                type: 'number',
                Cell: (props: any) => {
                    const row = props.cell.row.original || {};
                    return row.percentage + "%";
                }
            },
        ],
        []
    );

    return (
        <div>
            <TableZyx
                columns={columns}
                data={data}
                download={false}
                pageSizeDefault={100}
                filterGeneral={false}
                toolsFooter={false}
            />
        </div>
    )
}

const Graphic: FC<IGraphic> = ({ graphicType, column, setOpenModal, setView, FiltersElement, row, daterange, handlerSearchGraphic, withFilters = true, withButtons = true, data, loading, columnDesc }) => {
    const classes = useStyles();
    const { t } = useTranslation();
    const [openDateRangeModal, setOpenDateRangeModal] = useState(false);
    const [dataGraphic, setDataGraphic] = useState<Dictionary[]>([])

    const [dateRange, setdateRange] = useState<Range>({
        startDate: new Date(`${daterange.startDate} 10:00:00`),
        endDate: new Date(`${daterange.endDate} 10:00:00`),
        key: 'selection'
    });

    const [maxSummary, setMaxSummary] = useState<number>(0);

    const [currentPage, setCurrentPage] = useState(0);
    const itemsPerPage = 10;

    const slicedData = dataGraphic.slice(
        currentPage * itemsPerPage,
        (currentPage + 1) * itemsPerPage
    );

    const generateRandomColor = () => "#" + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
    
    const getNextColorGenerator = (): (() => string) => {
        const predefinedColors = ["#7721AD", "#B41A1A", "#9DABBD", "#FFA000", "#50AE54", "#001AFF", "#2BD37B", "#FFA34F", "#FC0D1B", "#FFBF00", "#0F7F13", "#00CFE5", "#1D1856", "#FB5F5F", "#B061E1"];
        let currentIndex = 0;
        const usedColors = [...predefinedColors];
    
        return () => {
            if (currentIndex < predefinedColors.length) {
                const color = predefinedColors[currentIndex];
                currentIndex++;
                return color;
            } else {
                const randomColor = generateRandomColor();
                if (!usedColors.includes(randomColor)) {
                    usedColors.push(randomColor);
                    return randomColor;
                } else {
                    return getNextColorGenerator()();
                }
            }
        };
    };    
    const randomColorGenerator = getNextColorGenerator();

  
    const getNextColorGeneratorPerPage = (): (() => string) => {
        const predefinedColorsPerPage = [
            "#7721AD", "#B41A1A", "#9DABBD", "#FFA000", "#50AE54", "#001AFF", "#2BD37B", "#FFA34F", "#FC0D1B", "#FFBF00"
        ];
    
        const getNextColor = (index: number): string => {
            const colorIndex = index % predefinedColorsPerPage.length;
            return predefinedColorsPerPage[colorIndex];
        };
    
        let currentIndex = 0;
    
        return () => {
            const color = getNextColor(currentIndex);
            currentIndex++;
            return color;
        };
    };    
    const randomColorGeneratorPerPage = getNextColorGeneratorPerPage();

    useEffect(() => {
        if (dataGraphic.length > 0) {
            const newMaxSummary = Math.max(...dataGraphic.map(item => item.summary), 0) + 10;
            setMaxSummary(newMaxSummary);
        }
        setCurrentPage(0)
    }, [dataGraphic]);

    const mainGraphicRes = useSelector(state => state.main.mainGraphic);
    useEffect(() => {
        if (data) {
            if (!loading) {
                const objectItems = data.reduce((acc, item) => ({
                    ...acc,
                    [item[column] || ""]: (acc[item[column] || ""] || 0) + 1
                }), {})
    
                const dataReady = Object.entries(objectItems).map(([key, value]) => ({
                    columnname: key,
                    summary: value,
                }));
    
                const total = dataReady.reduce((acc, item) => acc + parseInt(item.summary), 0)
                setDataGraphic(dataReady.sort((a, b) => parseInt(a.summary) < parseInt(b.summary) ? 1 : -1).map(x => ({
                    ...x,
                    columnname: x.columnname?.startsWith('report_') ? t((langKeys as any)[x.columnname]) : (x.columnname === '' ? `(${t(langKeys.in_white)})` : x.columnname),
                    summary: parseInt(x.summary),
                    percentage: parseFloat(((parseInt(x.summary) / total) * 100).toFixed(2)),
                    color: randomColorGeneratorPerPage()
                    //color: generateRandomColor()
                })));
            }
        } else {
            if (!mainGraphicRes.loading && !mainGraphicRes.error) {
                const total = mainGraphicRes.data.reduce((acc, item) => acc + parseInt(item.summary), 0)
                setDataGraphic(mainGraphicRes.data.sort((a, b) => parseInt(a.summary) < parseInt(b.summary) ? 1 : -1).map(x => ({
                    ...x,
                    columnname: x.columnname?.startsWith('report_') ? t((langKeys as any)[x.columnname]) : (x.columnname === '' ? `(${t(langKeys.in_white)})` : x.columnname),
                    summary: parseInt(x.summary),
                    percentage: parseFloat(((parseInt(x.summary) / total) * 100).toFixed(2)),               
                    color: randomColorGenerator()
                })));
            }
        }
    }, [mainGraphicRes, data, loading])
    
    return (
        <>
            {(withFilters || withButtons) && (
                <Box className={classes.containerHeaderItem} justifyContent="space-between" alignItems="center" >
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                        {withFilters &&
                            (
                                <>
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
                                </>

                            )}
                    </div>
                    <div style={{ display: 'flex', gap: 8 }}>
                        {withButtons && (
                            <>
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
                            </>
                        )}
                    </div>
                </Box>
            )}           
            {!data && row?.origin === 'sentmessages' && (
                <div style={{ fontWeight: 500, padding: 16 }}>
                    {t(langKeys.graphic_report_of, { report: t(langKeys.recordhsmreportexternal), column: t('report_' + row?.origin + '_' + column) })}

                </div>
            )}
            {!data && row?.origin !== 'sentmessages' && (
                <div style={{ fontWeight: 500, padding: 16 }}>
                    {t(langKeys.graphic_report_of, { report: t('report_' + row?.origin), column: t('report_' + row?.origin + '_' + column) })}
                </div>
            )}           
            {(loading || mainGraphicRes.loading) ? (
                <div style={{ flex: 1, height: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <CircularProgress />
                </div>
            ) : (graphicType === "BAR" ? (
                <div style={{ display: 'flex' }}>
                    <div style={{ flex: '0 0 70%', height: 500 }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: 10 }}>
                            <Button
                                color="primary"
                                onClick={() => setCurrentPage((prevPage) => Math.max(prevPage - 1, 0))}
                                disabled={currentPage === 0}
                            >
                                <KeyboardArrowLeftIcon />
                            </Button>
                            <div>
                            {`${currentPage + 1} de ${Math.ceil(dataGraphic.length / itemsPerPage)}`}
                            </div>
                            <Button
                                color="primary"
                                onClick={() => setCurrentPage((prevPage) => prevPage + 1)}
                                disabled={(currentPage + 1) * itemsPerPage >= dataGraphic.length}
                            >
                                <KeyboardArrowRightIcon />
                            </Button>
                        </div>

                        <ResponsiveContainer aspect={4.0 / 2}>
                            <BarChart
                                data={slicedData}
                                margin={{ top: 20, right: 30, left: 20, bottom: 5}}
                            >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="columnname" style={{ fontSize: "0.8em" }} angle={315} interval={0} textAnchor="end" height={160} dy={5} dx={-5} tickFormatter={(value) => t(value)} />
                                <YAxis domain={[0, maxSummary]}/>
                                <ChartTooltip formatter={(value:any, name:any)=> [value,t(name)]} labelFormatter={(label) => t(label)}/>
                                <Bar
                                    dataKey="summary" 
                                    fill="#7721AD" 
                                    textAnchor="end" 
                                    stackId="a" 
                                    type="monotone" 
                                >
                                    <LabelList dataKey="summary" position="top" />
                                    {
                                        slicedData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={randomColorGeneratorPerPage()} />
                                        ))
                                    }                                    
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>


                    </div>
                    <div style={{ overflowX: 'auto' }}>
                        <TableResume
                            row={row}
                            column={column}
                            graphicType={graphicType}
                            columnDesc={columnDesc}
                            data={dataGraphic}
                        />
                    </div>
                </div>  
                ) : (graphicType === "PIE" ? (
                    <div style={{ display: 'flex' }}>
                    <div style={{ flex: '0 0 65%', height: 500 }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <ChartTooltip
                                    formatter={(value: any, name: any) => [value, t(name)]}
                                    labelFormatter={(label) => t(label)}
                                />                                <Pie
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
                                    {dataGraphic.map((item) => (
                                        <Cell
                                            key={item.columnname}
                                            fill={item.color}
                                        />
                                    ))}
                                </Pie>
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <div style={{ overflowX: 'auto' }}>
                        <TableResume
                            row={row}
                            column={column}
                            graphicType={graphicType}
                            columnDesc={columnDesc}
                            data={dataGraphic}
                        />
                    </div>
                    </div>          
            ) : (
                <div style={{ display: 'flex' }}>
                    <div style={{ flex: '0 0 70%', height: 500 }}>
                        <ResponsiveContainer aspect={4.0 / 2}>
                            <LineChart
                                data={slicedData}
                                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                            >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="columnname" style={{ fontSize: "0.8em" }} angle={315} interval={0} textAnchor="end" height={160} dy={5} dx={-5} tickFormatter={(value) => t(value)} />
                                <YAxis domain={[0, maxSummary]} />
                                <ChartTooltip formatter={(value: number, name: string) => [value, t(name)]} labelFormatter={(label) => t(label)} />
                                <Line
                                    type="linear" 
                                    dataKey="summary" 
                                    stroke={randomColorGeneratorPerPage()} 
                                />
                               
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                    <div style={{ overflowX: 'auto' }}>
                        <TableResume
                            row={row}
                            column={column}
                            graphicType={graphicType}
                            data={dataGraphic}
                            columnDesc={columnDesc}
                        />
                    </div>
                </div>
            )))}
        </>

    )
}

export default Graphic;