import {
    Button,
    createStyles,
    IconButton,
    InputAdornment,
    makeStyles,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Tabs,
    TextField,
    Tooltip,
} from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import AddIcon from "@material-ui/icons/Add";
import { AntTab, DialogZyx, FieldSelect, TemplateSwitchYesNo } from "components";
import { langKeys } from "lang/keys";
import React, { FC, Fragment, useEffect, useState, useCallback } from "react";
import { FieldMultiSelect } from "components";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { showBackdrop, showSnackbar } from "store/popus/actions";
import {
    getasesoresbyorgid,
    getCommChannelLstTypeDesc,
    getHeatmapConfig,
    getValuesFromDomain,
    heatmapConfigIns,
    heatmappage1,
    heatmappage1detail,
    heatmappage2,
    heatmappage2detail1,
    heatmappage2detail2,
    heatmappage3,
    heatmappage3detail,
} from "common/helpers/requestBodies";
import {
    cleanViewChange,
    execute,
    getCollectionAux,
    getMultiCollection,
    getMultiCollectionAux,
    getMultiCollectionAux2,
    resetMainAux,
    resetMultiMain,
    resetMultiMainAux,
    resetMultiMainAux2,
    setViewChange,
} from "store/main/actions";
import { useSelector } from "hooks";
import { Dictionary } from "@types";
import TableZyx from "components/fields/table-simple";
import InfoRoundedIcon from "@material-ui/icons/InfoRounded";
import { CallRecordIcon } from "icons";
import { VoximplantService } from "network";
import DialogInteractions from "components/inbox/DialogInteractions";
import TrafficIcon from "@material-ui/icons/Traffic";
import ColorInputCircular from "components/fields/ColorInputCircular";
import { exportexcelwithgradient } from "common/helpers/exportexcelwithgradient";

const defaultNumberTableConfig = [
    { min: 0, max: 1, color: "#47FF47"},
    { min: 1, max: 5, color: "#FFFF00"},
    { min: 5, max: 999, color: "#FF0000"},
]

const defaultPercentageTableConfig = [
    { min: 0, max: 10, color: "#47FF47"},
    { min: 10, max: 60, color: "#FFFF00"},
    { min: 60, max: 100, color: "#FF0000"},
]

const defaultTimeTableConfig = [
    { min: "00s", max: "15m00s", color: "#47FF47"},
    { min: "15m00s", max: "1h00m00s", color: "#FFFF00"},
    { min: "1h00m00s", max: "999h00m00s", color: "#FF0000"},
]

const hours = [
    "00:00 a 01:00",
    "01:00 a 02:00",
    "02:00 a 03:00",
    "03:00 a 04:00",
    "04:00 a 05:00",
    "05:00 a 06:00",
    "06:00 a 07:00",
    "07:00 a 08:00",
    "08:00 a 09:00",
    "09:00 a 10:00",
    "10:00 a 11:00",
    "11:00 a 12:00",
    "12:00 a 13:00",
    "13:00 a 14:00",
    "14:00 a 15:00",
    "15:00 a 16:00",
    "16:00 a 17:00",
    "17:00 a 18:00",
    "18:00 a 19:00",
    "19:00 a 20:00",
    "20:00 a 21:00",
    "21:00 a 22:00",
    "22:00 a 23:00",
    "23:00 a 00:00",
    "TOTAL",
];
const hoursProm = [
    "00:00 a 01:00",
    "01:00 a 02:00",
    "02:00 a 03:00",
    "03:00 a 04:00",
    "04:00 a 05:00",
    "05:00 a 06:00",
    "06:00 a 07:00",
    "07:00 a 08:00",
    "08:00 a 09:00",
    "09:00 a 10:00",
    "10:00 a 11:00",
    "11:00 a 12:00",
    "12:00 a 13:00",
    "13:00 a 14:00",
    "14:00 a 15:00",
    "15:00 a 16:00",
    "16:00 a 17:00",
    "17:00 a 18:00",
    "18:00 a 19:00",
    "19:00 a 20:00",
    "20:00 a 21:00",
    "21:00 a 22:00",
    "22:00 a 23:00",
    "23:00 a 00:00",
    "PRM",
];

const LIMITHOUR = 24;

function numberToTime(seconds: number) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    let formattedTime = "";
    if (hours > 0) {
        formattedTime += `${hours}h`;
    }
    if (minutes > 0) {
        formattedTime += `${minutes}m`;
    }
    if (remainingSeconds > 0 || formattedTime === "") {
        formattedTime += `${remainingSeconds}s`;
    }
    return formattedTime;
}
const timetonumber = (formattedTime: string) => {
    const regex = /(\d+h)?(\d+m)?(\d+s)?/;
    const matches = formattedTime.match(regex);

    const hours = parseInt(matches?.[1] || "0");
    const minutes = parseInt(matches?.[2] || "0");
    const seconds = parseInt(matches?.[3] || "0");

    return hours * 3600 + minutes * 60 + seconds;
};

const useStyles = makeStyles(() =>
    createStyles({
        itemDate: {
            minHeight: 40,
            height: 40,
            border: "1px solid #bfbfc0",
            borderRadius: 4,
            width: "100%",
            color: "rgb(143, 146, 161)",
        },
        fieldsfilter: {
            width: "100%",
        },
        labellink: {
            color: "#7721ad",
            textDecoration: "underline",
            cursor: "pointer",
        },
        iconHelpText: {
            width: 15,
            height: 15,
            cursor: "pointer",
        },
    })
);
function capitalize(word: string) {
    const wordlower = word.toLowerCase();
    const words = wordlower.split(" ");
    let wordresult = "";
    for (let i = 0; i < words.length; i++) {
        if (words[i].trim() !== "") {
            words[i] = words[i][0].toUpperCase() + words[i].substr(1);
            wordresult = wordresult + words[i] + " ";
        }
    }
    return wordresult;
}

interface ModalProps {
    openModal: boolean;
    setOpenModal: (value: boolean) => void;
    title: string;
    columns: Dictionary[];
    data: Dictionary[];
}

const ModalHeatMap: React.FC<ModalProps> = ({
    openModal,
    setOpenModal,
    title = "",
    columns = [],
    data = [],
}) => {
    const { t } = useTranslation();

    const handleCancelModal = () => {
        setOpenModal(false);
    };

    return (
        <DialogZyx
            open={openModal}
            title={title}
            maxWidth="lg"
            button1Type="button"
            buttonText1={t(langKeys.close)}
            handleClickButton1={handleCancelModal}
        >
            <TableZyx columns={columns} data={data} download={true} pageSizeDefault={20} filterGeneral={false} />
        </DialogZyx>
    );
};

const MainHeatMap: React.FC<{
    dataChannels: Dictionary[];
    setOpenModalConfiguration: (dat: boolean) => void;
    setTableName: (d: string) => void;
    dataTableConfig: Dictionary[];
}> = ({ dataChannels, setOpenModalConfiguration, setTableName, dataTableConfig }) => {
    const { t } = useTranslation();
    const classes = useStyles();
    const [realizedsearch, setrealizedsearch] = useState(false);
    const [heatMapConversations, setheatMapConversations] = useState<Dictionary[]>([]);
    const [heatMapConversationsData, setheatMapConversationsData] = useState<Dictionary[]>([]);
    const [averageHeatMapTMOTitle, setaverageHeatMapTMOTitle] = useState<Dictionary[]>([]);
    const [averageHeatMapTMOData, setaverageHeatMapTMOData] = useState<Dictionary[]>([]);
    const [heatmapaverageagentTMETitle, setheatmapaverageagentTMETitle] = useState<Dictionary[]>([]);
    const [heatmapaverageagentTMEData, setheatmapaverageagentTMEData] = useState<Dictionary[]>([]);
    const [userAverageReplyTimexFechaTitle, setuserAverageReplyTimexFechaTitle] = useState<Dictionary[]>([]);
    const [userAverageReplyTimexFechaData, setuserAverageReplyTimexFechaData] = useState<Dictionary[]>([]);
    const [personAverageReplyTimexFechaTitle, setpersonAverageReplyTimexFechaTitle] = useState<Dictionary[]>([]);
    const [personAverageReplyTimexFechaData, setpersonAverageReplyTimexFechaData] = useState<Dictionary[]>([]);
    const multiDataAux = useSelector((state) => state.main.multiDataAux);
    const dispatch = useDispatch();
    const multiData = useSelector((state) => state.main.multiData);
    const multiDataAux2 = useSelector((state) => state.main.multiDataAux2);
    const mainResult = useSelector((state) => state.main);
    const dataAdvisor = [
        { domaindesc: t(langKeys.agent), domainvalue: "ASESOR" },
        { domaindesc: "Bot", domainvalue: "BOT" },
    ];
    const [dataMainHeatMap, setdataMainHeatMap] = useState({
        communicationchannel: "",
        closedby: "ASESOR",
        startdate: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
        enddate: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0),
        datetoshow: `${new Date(new Date().setDate(1)).getFullYear()}-${String(
            new Date(new Date().setDate(1)).getMonth() + 1
        ).padStart(2, "0")}`,
    });

    const [waitDetail, setWaitDetail] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const [rowSelected, setRowSelected] = useState<Dictionary | null>(null);
    const [openModalTicket, setOpenModalTicket] = useState(false);
    const [modalTitle, setModalTitle] = useState("");
    const [modalColumns, setModalColumns] = useState<Dictionary[]>([]);
    const openDialogInteractions = useCallback(
        (row: Dictionary) => {
            setOpenModalTicket(true);
            setRowSelected({ ...row, displayname: row.asesor, ticketnum: row.ticketnum });
        },
        [mainResult]
    );
    useEffect(() => {
        dispatch(setViewChange("heatmap"));
        return () => {
            dispatch(cleanViewChange());
        };
    }, []);

    const downloadCallRecord = async (ticket: Dictionary) => {
        try {
            const axios_result = await VoximplantService.getCallRecord({
                call_session_history_id: ticket.postexternalid,
            });
            if (axios_result.status === 200) {
                const buff = Buffer.from(axios_result.data, "base64");
                const blob = new Blob([buff], {
                    type: axios_result.headers["content-type"].split(";").find((x: string) => x.includes("audio")),
                });
                const objectUrl = window.URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = objectUrl;
                a.download = ticket.ticketnum;
                a.click();
            }
        } catch (error: any) {
            const errormessage = t(error?.response?.data?.code || "error_unexpected_error");
            dispatch(showSnackbar({ show: true, severity: "error", message: errormessage }));
        }
    };

    const fetchDetail = (grid: string, column: Dictionary, row: Dictionary, mes: number, year: number) => {
        if (
            row.hournum !== "TOTAL" &&
            row.hournum !== "PRM" &&
            ((typeof row[column.id] === "number" && row[column.id] > 0) ||
                (typeof row[column.id] === "string" && row[column.id] !== "00:00:00"))
        ) {
            const day = column.id.replace("day", "");
            const hour = row.hour - 1;
            const hournum = row.hournum.replace("a", "-");
            let option = "";
            switch (grid) {
                case "1.1":
                    setModalTitle(`Tickets ${t(langKeys.day)} ${day} ${hournum}`);
                    setModalColumns([
                        {
                            accessor: "voxiid",
                            isComponent: true,
                            minWidth: 60,
                            width: "1%",
                            Cell: (props: Dictionary) => {
                                const row = props.cell.row.original || {};
                                return row.communicationchanneltype === "VOXI" &&
                                    row.postexternalid &&
                                    row.callanswereddate ? (
                                    <Tooltip title={t(langKeys.download_record) || ""}>
                                        <IconButton size="small" onClick={() => downloadCallRecord(row)}>
                                            <CallRecordIcon style={{ fill: "#7721AD" }} />
                                        </IconButton>
                                    </Tooltip>
                                ) : null;
                            },
                        },
                        {
                            Header: t(langKeys.ticket),
                            accessor: "ticketnum",
                            Cell: (props: Dictionary) => {
                                const row = props.cell.row.original || {};
                                return (
                                    <label className={classes.labellink} onClick={() => openDialogInteractions(row)}>
                                        {row.ticketnum}
                                    </label>
                                );
                            },
                        },
                        { Header: t(langKeys.channel), accessor: "channel" },
                        { Header: t(langKeys.agent), accessor: "asesor" },
                        { Header: t(langKeys.tmo), accessor: "totalduration" },
                    ]);
                    break;
                case "1.2":
                    setModalTitle(`Tickets ${t(langKeys.day)} ${day} ${hournum}`);
                    setModalColumns([
                        {
                            accessor: "voxiid",
                            isComponent: true,
                            minWidth: 60,
                            width: "1%",
                            Cell: (props: Dictionary) => {
                                const row = props.cell.row.original || {};
                                return row.communicationchanneltype === "VOXI" &&
                                    row.postexternalid &&
                                    row.callanswereddate ? (
                                    <Tooltip title={t(langKeys.download_record) || ""}>
                                        <IconButton size="small" onClick={() => downloadCallRecord(row)}>
                                            <CallRecordIcon style={{ fill: "#7721AD" }} />
                                        </IconButton>
                                    </Tooltip>
                                ) : null;
                            },
                        },
                        {
                            Header: t(langKeys.ticket),
                            accessor: "ticketnum",
                            Cell: (props: Dictionary) => {
                                const row = props.cell.row.original || {};
                                return (
                                    <label className={classes.labellink} onClick={() => openDialogInteractions(row)}>
                                        {row.ticketnum}
                                    </label>
                                );
                            },
                        },
                        { Header: t(langKeys.channel), accessor: "channel" },
                        { Header: t(langKeys.tmo), accessor: "totalduration" },
                        { Header: t(langKeys.agent), accessor: "asesor" },
                    ]);
                    break;
                case "1.3":
                    option = "TME";
                    setModalTitle(`Tickets ${t(langKeys.day)} ${day} ${hournum}`);
                    setModalColumns([
                        {
                            accessor: "voxiid",
                            isComponent: true,
                            minWidth: 60,
                            width: "1%",
                            Cell: (props: Dictionary) => {
                                const row = props.cell.row.original || {};
                                return row.communicationchanneltype === "VOXI" &&
                                    row.postexternalid &&
                                    row.callanswereddate ? (
                                    <Tooltip title={t(langKeys.download_record) || ""}>
                                        <IconButton size="small" onClick={() => downloadCallRecord(row)}>
                                            <CallRecordIcon style={{ fill: "#7721AD" }} />
                                        </IconButton>
                                    </Tooltip>
                                ) : null;
                            },
                        },
                        {
                            Header: t(langKeys.ticket),
                            accessor: "ticketnum",
                            Cell: (props: Dictionary) => {
                                const row = props.cell.row.original || {};
                                return (
                                    <label className={classes.labellink} onClick={() => openDialogInteractions(row)}>
                                        {row.ticketnum}
                                    </label>
                                );
                            },
                        },
                        { Header: t(langKeys.channel), accessor: "channel" },
                        { Header: t(langKeys.tme), accessor: "userfirstreplytime" },
                        { Header: t(langKeys.agent), accessor: "asesor" },
                    ]);
                    break;
                case "1.4":
                    option = "TMR";
                    setModalTitle(`Tickets ${t(langKeys.day)} ${day} ${hournum}`);
                    setModalColumns([
                        {
                            accessor: "voxiid",
                            isComponent: true,
                            minWidth: 60,
                            width: "1%",
                            Cell: (props: Dictionary) => {
                                const row = props.cell.row.original || {};
                                return row.communicationchanneltype === "VOXI" &&
                                    row.postexternalid &&
                                    row.callanswereddate ? (
                                    <Tooltip title={t(langKeys.download_record) || ""}>
                                        <IconButton size="small" onClick={() => downloadCallRecord(row)}>
                                            <CallRecordIcon style={{ fill: "#7721AD" }} />
                                        </IconButton>
                                    </Tooltip>
                                ) : null;
                            },
                        },
                        {
                            Header: t(langKeys.ticket),
                            accessor: "ticketnum",
                            Cell: (props: Dictionary) => {
                                const row = props.cell.row.original || {};
                                return (
                                    <label className={classes.labellink} onClick={() => openDialogInteractions(row)}>
                                        {row.ticketnum}
                                    </label>
                                );
                            },
                        },
                        { Header: t(langKeys.channel), accessor: "channel" },
                        { Header: t(langKeys.tmr), accessor: "useraveragereplytime" },
                        { Header: t(langKeys.agent), accessor: "asesor" },
                    ]);
                    break;
                case "1.5":
                    option = "TMRCLIENT";
                    setModalTitle(`Tickets ${t(langKeys.day)} ${day} ${hournum}`);
                    setModalColumns([
                        {
                            accessor: "voxiid",
                            isComponent: true,
                            minWidth: 60,
                            width: "1%",
                            Cell: (props: Dictionary) => {
                                const row = props.cell.row.original || {};
                                return row.communicationchanneltype === "VOXI" &&
                                    row.postexternalid &&
                                    row.callanswereddate ? (
                                    <Tooltip title={t(langKeys.download_record) || ""}>
                                        <IconButton size="small" onClick={() => downloadCallRecord(row)}>
                                            <CallRecordIcon style={{ fill: "#7721AD" }} />
                                        </IconButton>
                                    </Tooltip>
                                ) : null;
                            },
                        },
                        {
                            Header: t(langKeys.ticket),
                            accessor: "ticketnum",
                            Cell: (props: Dictionary) => {
                                const row = props.cell.row.original || {};
                                return (
                                    <label className={classes.labellink} onClick={() => openDialogInteractions(row)}>
                                        {row.ticketnum}
                                    </label>
                                );
                            },
                        },
                        { Header: t(langKeys.channel), accessor: "channel" },
                        { Header: t(langKeys.tmr_client), accessor: "personaveragereplytime" },
                    ]);
                    break;
                default:
                    break;
            }
            dispatch(
                getMultiCollectionAux2([
                    heatmappage1detail({
                        ...dataMainHeatMap,
                        startdate: new Date(year, mes - 1, day),
                        enddate: new Date(year, mes - 1, day),
                        horanum: ["TOTAL", "PRM"].includes(row.hournum) ? "" : hour,
                        option: option,
                    }),
                ])
            );
            dispatch(showBackdrop(true));
            setWaitDetail(true);
        }
    };

    useEffect(() => {
        if (waitDetail) {
            if (!multiDataAux2.loading) {
                dispatch(showBackdrop(false));
                setWaitDetail(false);
                setOpenModal(true);
            }
        }
    }, [multiDataAux2]);

    function handleDateChange(e: string) {
        if (e === "") {
            setdataMainHeatMap((prev) => ({ ...prev, datetoshow: e }));
        } else {
            const year = Number(e.split("-")[0]);
            const mes = Number(e.split("-")[1]);
            const startdate = new Date(year, mes - 1, 1);
            const enddate = new Date(year, mes, 0);
            setdataMainHeatMap((prev) => ({ ...prev, startdate, enddate, datetoshow: e }));
        }
    }

    useEffect(() => {
        if (!multiData.loading && realizedsearch) {
            setrealizedsearch(false);
            dispatch(showBackdrop(false));
            if (multiData.data[0].key === "UFN_REPORT_HEATMAP_PAGE1_SEL") {
                initAtencionesxFechaAsesorGrid(multiData.data[0]?.data || []);
                averageHeatMapTMO(multiData.data[0]?.data || []);
                initUserFirstReplyTimexFechaGrid(multiData.data[0]?.data || []);
                initUserAverageReplyTimexFechaGrid(multiData.data[0]?.data || []);
                initPersonAverageReplyTimexFechaGrid(multiData.data[0]?.data || []);
            } else {
                initAtencionesxFechaAsesorGrid([]);
                averageHeatMapTMO([]);
                initUserFirstReplyTimexFechaGrid([]);
                initUserAverageReplyTimexFechaGrid([]);
                initPersonAverageReplyTimexFechaGrid([]);
            }
        }
    }, [multiData, realizedsearch]);

    useEffect(() => {
        if (!multiDataAux.loading) {
            search();
        }
    }, [multiDataAux]);

    function search() {
        if (dataMainHeatMap.datetoshow === "") {
            dispatch(showSnackbar({ show: true, severity: "error", message: t(langKeys.date_format_error) }));
        } else {
            setheatMapConversationsData([]);
            setaverageHeatMapTMOData([]);
            setheatmapaverageagentTMEData([]);
            setuserAverageReplyTimexFechaData([]);
            setpersonAverageReplyTimexFechaData([]);
            setrealizedsearch(true);
            dispatch(showBackdrop(true));
            dispatch(getMultiCollection([heatmappage1(dataMainHeatMap)]));
        }
    }

    function initAtencionesxFechaAsesorGrid(data: Dictionary[]) {
        let arrayfree: Dictionary[] = [];
        const mes = dataMainHeatMap.startdate?.getMonth() + 1;
        const year = dataMainHeatMap.startdate?.getFullYear();
        let rowmax = 0;
        const dateend = new Date(year, mes, 0).getDate();
        const arrayvalidvalues = new Array(24).fill(0);

        for (let i = 1; i <= LIMITHOUR + 1; i++) {
            const objectfree: Dictionary = {
                hour: i,
                hournum: hours[i - 1],
            };
            for (let j = 1; j <= dateend; j++) {
                objectfree[`day${j}`] = 0;
            }
            objectfree[`totalcol`] = 0;
            arrayfree.push(objectfree);
        }

        data.forEach((row: Dictionary) => {
            const day = parseInt(row.fecha.split("-")[2]);
            const hour = row.hora;
            arrayvalidvalues[row.horanum]++;
            arrayfree = arrayfree.map((x: Dictionary) =>
                x.hournum === hour
                    ? {
                          ...x,
                          [`day${day}`]: x[`day${day}`] + row.atencionesxfecha,
                          [`totalcol`]: x.totalcol + row.atencionesxfecha,
                      }
                    : x
            );

            rowmax = row.atencionesxfecha > rowmax ? row.atencionesxfecha : rowmax;
            arrayfree[24][`day${day}`] += row.atencionesxfecha;
            arrayfree[24][`totalcol`] += row.atencionesxfecha;
        });
        arrayvalidvalues.forEach((x, i) => {
            if (x !== 0) {
                arrayfree[i].totalcol = arrayfree[i].totalcol / x;
            }
        });
        setheatMapConversationsData(arrayfree);

        function gradient(num: number, rowcounter: number) {
            const rules = dataTableConfig?.find((x) => x.report_name === "conversations")?.report_configuration || defaultNumberTableConfig;
            if (rowcounter >= 24) {
                return "#FFFFFF";
            }
            for (const item of rules) {
                if (num >= item.min && num < item.max) {
                    return item.color;
                }
            }
            return "#ffffff";
        }

        const arraytemplate =
            arrayfree.length > 0
                ? Object.entries(arrayfree[0])
                      .filter(([key]) => !/hour|horanum/gi.test(key))
                      .map(([key]) => {
                          const isDayColumn = key.includes("day");
                          return {
                              Header: isDayColumn ? `${key.split("day")[1]}/${mes}` : "Promedio",
                              accessor: key,
                              NoFilter: true,
                              NoSort: true,
                              Cell: (props: Dictionary) => {
                                  const column = props.cell.column;
                                  const row = props.cell.row.original || {};
                                  if (key !== "totalcol") {
                                      const color = gradient(
                                          parseInt(props.data[props.cell.row.index][key]),
                                          props.cell.row.index
                                      );
                                      return (
                                          <div
                                              style={{ background: `${color}`, textAlign: "center", color: "black" }}
                                              onClick={() => fetchDetail("1.1", column, row, mes, year)}
                                          >
                                              {props.data[props.cell.row.index][key]}
                                          </div>
                                      );
                                  } else {
                                      return (
                                          <div style={{ textAlign: "center", fontWeight: "bold", background: "white" }}>
                                              {props.data[props.cell.row.index][key] > 0
                                                  ? props.data[props.cell.row.index][key].toFixed(2)
                                                  : "0"}
                                          </div>
                                      );
                                  }
                              },
                          };
                      })
                : [];

        setheatMapConversations([
            {
                Header: `Hora`,
                accessor: "hournum",
                NoFilter: true,
                NoSort: true,
            },
            ...arraytemplate,
        ]);
    }

    function averageHeatMapTMO(data: Dictionary) {
        const mes = dataMainHeatMap.startdate?.getMonth() + 1;
        const year = dataMainHeatMap.startdate?.getFullYear();
        const dateend = new Date(year, mes, 0).getDate();
        let rowmax = 0;
        let arrayfree: Dictionary[] = [];
        const arrayvalidvalues = new Array(25).fill(0);
        const arrayvalidvaluesmonth = new Array(32).fill(0);
        const LIMITHOUR = 24;

        for (let i = 1; i <= LIMITHOUR + 1; i++) {
            const objectfree: Dictionary = {
                hour: i,
                hournum: hoursProm[i - 1],
            };
            for (let j = 1; j <= dateend; j++) {
                objectfree[`day${j}`] = "00:00:00";
            }
            objectfree[`totalcol`] = "00:00:00";
            arrayfree.push(objectfree);
        }

        data.forEach((row: Dictionary) => {
            const day = parseInt(row.fecha.split("-")[2]);
            const hour = row.hora;
            const timespent = row.totaldurationxfecha.split(":");
            const seconds = parseInt(timespent[0]) * 3600 + parseInt(timespent[1]) * 60 + parseInt(timespent[2]);
            arrayfree = arrayfree.map((x: any) =>
                x.hournum === hour ? { ...x, [`day${day}`]: row.totaldurationxfecha } : x
            );
            rowmax = seconds > rowmax ? seconds : rowmax;
            arrayvalidvalues[row.horanum]++;
            arrayvalidvaluesmonth[day - 1]++;
            arrayfree.forEach((x: Dictionary) => {
                if (x.hournum === hour) {
                    const timespenttotal = x["totalcol"].split(":");
                    const secondstotalnum =
                        timespenttotal[0] * 3600 + timespenttotal[1] * 60 + parseInt(timespenttotal[2]) + seconds;
                    const hh = Math.floor(secondstotalnum / 3600);
                    const mm = Math.floor((secondstotalnum - hh * 3600) / 60);
                    const ss = Math.round(secondstotalnum) - hh * 3600 - mm * 60;
                    x["totalcol"] =
                        hh.toString().padStart(2, "0") +
                        ":" +
                        mm.toString().padStart(2, "0") +
                        ":" +
                        ss.toString().padStart(2, "0");
                }
            });

            if (arrayvalidvaluesmonth[day - 1] === 0) {
                arrayfree[24][`day${day}`] = `00:00:00`;
            } else {
                let timespenttotal = arrayfree[24][`day${day}`].split(":");
                let secondstotalnum =
                    timespenttotal[0] * 3600 + timespenttotal[1] * 60 + parseInt(timespenttotal[2]) + seconds;
                let hh = Math.floor(secondstotalnum / 3600);
                let mm = Math.floor((secondstotalnum - hh * 3600) / 60);
                let ss = Math.round(secondstotalnum) - hh * 3600 - mm * 60;
                arrayfree[24][`day${day}`] =
                    hh.toString().padStart(2, "0") +
                    ":" +
                    mm.toString().padStart(2, "0") +
                    ":" +
                    ss.toString().padStart(2, "0");
                timespenttotal = arrayfree[24].totalcol.split(":");
                secondstotalnum =
                    timespenttotal[0] * 3600 + timespenttotal[1] * 60 + parseInt(timespenttotal[2]) + seconds;
                hh = Math.floor(secondstotalnum / 3600);
                mm = Math.floor((secondstotalnum - hh * 3600) / 60);
                ss = Math.round(secondstotalnum) - hh * 3600 - mm * 60;
                arrayfree[24].totalcol =
                    hh.toString().padStart(2, "0") +
                    ":" +
                    mm.toString().padStart(2, "0") +
                    ":" +
                    ss.toString().padStart(2, "0");
            }
        });

        arrayvalidvaluesmonth.forEach((x, i) => {
            if (x !== 0) {
                const timetoconvert = arrayfree[24][`day${i + 1}`].split(":");
                const secondstotalnum =
                    (timetoconvert[0] * 3600 + timetoconvert[1] * 60 + parseInt(timetoconvert[2])) / x;
                const hh = Math.floor(secondstotalnum / 3600);
                const mm = Math.floor((secondstotalnum - hh * 3600) / 60);
                const ss = Math.round(secondstotalnum) - hh * 3600 - mm * 60;
                arrayfree[24][`day${i + 1}`] =
                    hh.toString().padStart(2, "0") +
                    ":" +
                    mm.toString().padStart(2, "0") +
                    ":" +
                    ss.toString().padStart(2, "0");
            }
        });

        arrayvalidvalues.forEach((x, i) => {
            if (x !== 0) {
                const timetoconvert = arrayfree[i][`totalcol`].split(":");
                const secondstotalnum =
                    (timetoconvert[0] * 3600 + timetoconvert[1] * 60 + parseInt(timetoconvert[2])) / x;
                const hh = Math.floor(secondstotalnum / 3600);
                const mm = Math.floor((secondstotalnum - hh * 3600) / 60);
                const ss = Math.round(secondstotalnum) - hh * 3600 - mm * 60;
                arrayfree[i][`totalcol`] =
                    hh.toString().padStart(2, "0") +
                    ":" +
                    mm.toString().padStart(2, "0") +
                    ":" +
                    ss.toString().padStart(2, "0");
            }
        });
        setaverageHeatMapTMOData(arrayfree);

        function gradient(num: number, rowcounter: number) {
            const rules = dataTableConfig?.find((x) => x.report_name === "averagetmo")?.report_configuration || defaultTimeTableConfig;
            if (rowcounter >= 24) {
                return "#FFFFFF";
            }
            for (const item of rules) {
                if (num >= timetonumber(item.min) && num < timetonumber(item.max)) {
                    return item.color;
                }
            }
            return "#ffffff";
        }

        const arraytemplate =
            arrayfree.length > 0
                ? Object.entries(arrayfree[0])
                      .filter(([key]) => !/hour|horanum/gi.test(key))
                      .map(([key]) => ({
                          Header: key.includes("day") ? `${key.split("day")[1]}/${mes}` : "Promedio",
                          accessor: key,
                          NoFilter: true,
                          NoSort: true,
                          Cell: (props: Dictionary) => {
                            const column = props.cell.column;
                            const row = props.cell.row.original || {};
                            const rowcounter = props.cell.row.index;
                            const timespenttotal = row && row[key] ? row[key].split(":") : ["00", "00", "00"];
                            const hh = timespenttotal[0] === "00" ? "" : timespenttotal[0] + "h ";
                            const mm = timespenttotal[1] === "00" ? "" : timespenttotal[1] + "m ";
                            const ss = timespenttotal[2];
                        
                            if (key !== "totalcol") {
                                const seconds =
                                    parseInt(timespenttotal[0]) * 3600 +
                                    parseInt(timespenttotal[1]) * 60 +
                                    parseInt(timespenttotal[2]);
                                const color = gradient(seconds, rowcounter);
                        
                                return (
                                    <div
                                        style={{ background: color, textAlign: "center", color: "black" }}
                                        onClick={() => fetchDetail("1.3", column, row, mes, year)}
                                    >
                                        {`${hh}${mm}${ss}s`}
                                    </div>
                                );
                            } else {
                                return (
                                    <div
                                        style={{ textAlign: "center", fontWeight: "bold", background: "white" }}
                                    >{`${hh}${mm}${ss}s`}</div>
                                );
                            }
                        },
                        
                        
                        
                      }))
                : [];
        setaverageHeatMapTMOTitle([
            {
                Header: `Hora`,
                accessor: "hournum",
                NoFilter: true,
                NoSort: true,
            },
            ...arraytemplate,
        ]);
    }

    function initUserFirstReplyTimexFechaGrid(data: Dictionary[]) {
        const mes = dataMainHeatMap.startdate?.getMonth() + 1;
        const year = dataMainHeatMap.startdate?.getFullYear();
        const dateend = new Date(year, mes, 0).getDate();
        let rowmax = 0;
        let arrayfree: Dictionary[] = [];

        const arrayvalidvalues = new Array(25).fill(0);
        const arrayvalidvaluesmonth = new Array(32).fill(0);
        const LIMITHOUR = 24;

        for (let i = 1; i <= LIMITHOUR + 1; i++) {
            const objectfree: Dictionary = {
                hour: i,
                hournum: hoursProm[i - 1],
            };
            for (let j = 1; j <= dateend; j++) {
                objectfree[`day${j}`] = "00:00:00";
            }
            objectfree[`totalcol`] = "00:00:00";
            arrayfree.push(objectfree);
        }

        data.forEach((row: Dictionary) => {
            const day = parseInt(row.fecha.split("-")[2]);
            const hour = row.hora;
            const timespent = row.userfirstreplytimexfecha.split(":");
            const seconds = parseInt(timespent[0]) * 3600 + parseInt(timespent[1]) * 60 + parseInt(timespent[2]);

            arrayfree = arrayfree.map((x: any) =>
                x.hournum === hour ? { ...x, [`day${day}`]: row.userfirstreplytimexfecha } : x
            );
            rowmax = seconds > rowmax ? seconds : rowmax;
            arrayvalidvalues[row.horanum]++;
            arrayvalidvaluesmonth[day - 1]++;
            arrayfree.forEach((x: Dictionary) => {
                if (x.hournum === hour) {
                    const timespenttotal = x["totalcol"].split(":");
                    const secondstotalnum =
                        timespenttotal[0] * 3600 + timespenttotal[1] * 60 + parseInt(timespenttotal[2]) + seconds;
                    const hh = Math.floor(secondstotalnum / 3600);
                    const mm = Math.floor((secondstotalnum - hh * 3600) / 60);
                    const ss = Math.round(secondstotalnum) - hh * 3600 - mm * 60;
                    x["totalcol"] =
                        hh.toString().padStart(2, "0") +
                        ":" +
                        mm.toString().padStart(2, "0") +
                        ":" +
                        ss.toString().padStart(2, "0");
                }
            });
            let timespenttotal = arrayfree[24][`day${day}`].split(":");
            let secondstotalnum =
                timespenttotal[0] * 3600 + timespenttotal[1] * 60 + parseInt(timespenttotal[2]) + seconds;
            let hh = Math.floor(secondstotalnum / 3600);
            let mm = Math.floor((secondstotalnum - hh * 3600) / 60);
            let ss = Math.round(secondstotalnum) - hh * 3600 - mm * 60;
            arrayfree[24][`day${day}`] =
                hh.toString().padStart(2, "0") +
                ":" +
                mm.toString().padStart(2, "0") +
                ":" +
                ss.toString().padStart(2, "0");
            timespenttotal = arrayfree[24].totalcol.split(":");
            secondstotalnum = timespenttotal[0] * 3600 + timespenttotal[1] * 60 + parseInt(timespenttotal[2]) + seconds;
            hh = Math.floor(secondstotalnum / 3600);
            mm = Math.floor((secondstotalnum - hh * 3600) / 60);
            ss = Math.round(secondstotalnum) - hh * 3600 - mm * 60;
            arrayfree[24].totalcol =
                hh.toString().padStart(2, "0") +
                ":" +
                mm.toString().padStart(2, "0") +
                ":" +
                ss.toString().padStart(2, "0");
        });

        arrayvalidvaluesmonth.forEach((x, i) => {
            if (x !== 0) {
                const timetoconvert = arrayfree[24][`day${i + 1}`].split(":");
                const secondstotalnum =
                    (timetoconvert[0] * 3600 + timetoconvert[1] * 60 + parseInt(timetoconvert[2])) / x;
                const hh = Math.floor(secondstotalnum / 3600);
                const mm = Math.floor((secondstotalnum - hh * 3600) / 60);
                const ss = Math.round(secondstotalnum) - hh * 3600 - mm * 60;
                arrayfree[24][`day${i + 1}`] =
                    hh.toString().padStart(2, "0") +
                    ":" +
                    mm.toString().padStart(2, "0") +
                    ":" +
                    ss.toString().padStart(2, "0");
            }
        });

        arrayvalidvalues.forEach((x, i) => {
            if (x !== 0) {
                const timetoconvert = arrayfree[i][`totalcol`].split(":");
                const secondstotalnum =
                    (timetoconvert[0] * 3600 + timetoconvert[1] * 60 + parseInt(timetoconvert[2])) / x;
                const hh = Math.floor(secondstotalnum / 3600);
                const mm = Math.floor((secondstotalnum - hh * 3600) / 60);
                const ss = Math.round(secondstotalnum) - hh * 3600 - mm * 60;
                arrayfree[i][`totalcol`] =
                    hh.toString().padStart(2, "0") +
                    ":" +
                    mm.toString().padStart(2, "0") +
                    ":" +
                    ss.toString().padStart(2, "0");
            }
        });

        setheatmapaverageagentTMEData(arrayfree);

        function gradient(num: number, rowcounter: number) {
            const rules = dataTableConfig?.find((x) => x.report_name === "averageagenttme")?.report_configuration || defaultTimeTableConfig;
            if (rowcounter >= 24) {
                return "#FFFFFF";
            }
            for (const item of rules) {
                if (num >= timetonumber(item.min) && num < timetonumber(item.max)) {
                    return item.color;
                }
            }
            return "#ffffff";
        }

        const arraytemplate =
            arrayfree.length > 0
                ? Object.entries(arrayfree[0])
                      .filter(([key]) => !/hour|horanum/gi.test(key))
                      .map(([key]) => ({
                          Header: key.includes("day") ? `${key.split("day")[1]}/${mes}` : "Promedio",
                          accessor: key,
                          NoFilter: true,
                          NoSort: true,
                          Cell: (props: Dictionary) => {
                            const column = props.cell.column;
                            const row = props.cell.row.original || {};
                            const rowcounter = props.cell.row.index;
                            const timespenttotal = row && row[key] ? row[key].split(":") : ["00", "00", "00"];
                            const hh = timespenttotal[0] === "00" ? "" : timespenttotal[0] + "h ";
                            const mm = timespenttotal[1] === "00" ? "" : timespenttotal[1] + "m ";
                            const ss = timespenttotal[2];
                        
                            if (key !== "totalcol") { 
                                const seconds =
                                    parseInt(timespenttotal[0]) * 3600 +
                                    parseInt(timespenttotal[1]) * 60 +
                                    parseInt(timespenttotal[2]);
                                const color = gradient(seconds, rowcounter);
                        
                                return (
                                    <div
                                        style={{ background: color, textAlign: "center", color: "black" }}
                                        onClick={() => fetchDetail("1.3", column, row, mes, year)}
                                    >
                                        {`${hh}${mm}${ss}s`}
                                    </div>
                                );
                            } else {
                                return (
                                    <div
                                        style={{ textAlign: "center", fontWeight: "bold", background: "white" }}
                                    >{`${hh}${mm}${ss}s`}</div>
                                );
                            }
                        },
                        
                        
                      }))
                : [];

        setheatmapaverageagentTMETitle([
            {
                Header: `Hora`,
                accessor: "hournum",
                NoFilter: true,
                NoSort: true,
            },
            ...arraytemplate,
        ]);
    }

    function initUserAverageReplyTimexFechaGrid(data: Dictionary[]) {
        const mes = dataMainHeatMap.startdate?.getMonth() + 1;
        const year = dataMainHeatMap.startdate?.getFullYear();
        const dateend = new Date(year, mes, 0).getDate();
        let rowmax = 0;
        let arrayfree: Dictionary[] = [];
        const LIMITHOUR = 24;
        const arrayvalidvalues = new Array(25).fill(0);
        const arrayvalidvaluesmonth = new Array(32).fill(0);

        for (let i = 1; i <= LIMITHOUR + 1; i++) {
            const objectfree: Dictionary = {
                hour: i,
                hournum: hoursProm[i - 1],
            };
            for (let j = 1; j <= dateend; j++) {
                objectfree[`day${j}`] = "00:00:00";
            }
            objectfree[`totalcol`] = "00:00:00";
            arrayfree.push(objectfree);
        }

        data.forEach((row: Dictionary) => {
            const day = parseInt(row.fecha.split("-")[2]);
            const hour = row.hora;
            const timespent = row.useraveragereplytimexfecha.split(":");
            const seconds = parseInt(timespent[0]) * 3600 + parseInt(timespent[1]) * 60 + parseInt(timespent[2]);

            arrayfree = arrayfree.map((x: any) =>
                x.hournum === hour ? { ...x, [`day${day}`]: row.useraveragereplytimexfecha } : x
            );
            rowmax = seconds > rowmax ? seconds : rowmax;
            arrayvalidvalues[row.horanum]++;
            arrayvalidvaluesmonth[day - 1]++;
            arrayfree.forEach((x: Dictionary) => {
                if (x.hournum === hour) {
                    const timespenttotal = x["totalcol"].split(":");
                    const secondstotalnum =
                        timespenttotal[0] * 3600 + timespenttotal[1] * 60 + parseInt(timespenttotal[2]) + seconds;
                    const hh = Math.floor(secondstotalnum / 3600);
                    const mm = Math.floor((secondstotalnum - hh * 3600) / 60);
                    const ss = Math.round(secondstotalnum) - hh * 3600 - mm * 60;
                    x["totalcol"] =
                        hh.toString().padStart(2, "0") +
                        ":" +
                        mm.toString().padStart(2, "0") +
                        ":" +
                        ss.toString().padStart(2, "0");
                }
            });
            let timespenttotal = arrayfree[24][`day${day}`].split(":");
            let secondstotalnum =
                timespenttotal[0] * 3600 + timespenttotal[1] * 60 + parseInt(timespenttotal[2]) + seconds;
            let hh = Math.floor(secondstotalnum / 3600);
            let mm = Math.floor((secondstotalnum - hh * 3600) / 60);
            let ss = Math.round(secondstotalnum) - hh * 3600 - mm * 60;
            arrayfree[24][`day${day}`] =
                hh.toString().padStart(2, "0") +
                ":" +
                mm.toString().padStart(2, "0") +
                ":" +
                ss.toString().padStart(2, "0");
            timespenttotal = arrayfree[24].totalcol.split(":");
            secondstotalnum = timespenttotal[0] * 3600 + timespenttotal[1] * 60 + parseInt(timespenttotal[2]) + seconds;
            hh = Math.floor(secondstotalnum / 3600);
            mm = Math.floor((secondstotalnum - hh * 3600) / 60);
            ss = Math.round(secondstotalnum) - hh * 3600 - mm * 60;
            arrayfree[24].totalcol =
                hh.toString().padStart(2, "0") +
                ":" +
                mm.toString().padStart(2, "0") +
                ":" +
                ss.toString().padStart(2, "0");
        });

        arrayvalidvaluesmonth.forEach((x, i) => {
            if (x !== 0) {
                const timetoconvert = arrayfree[24][`day${i + 1}`].split(":");
                const secondstotalnum =
                    (timetoconvert[0] * 3600 + timetoconvert[1] * 60 + parseInt(timetoconvert[2])) / x;
                const hh = Math.floor(secondstotalnum / 3600);
                const mm = Math.floor((secondstotalnum - hh * 3600) / 60);
                const ss = Math.round(secondstotalnum) - hh * 3600 - mm * 60;
                arrayfree[24][`day${i + 1}`] =
                    hh.toString().padStart(2, "0") +
                    ":" +
                    mm.toString().padStart(2, "0") +
                    ":" +
                    ss.toString().padStart(2, "0");
            }
        });

        arrayvalidvalues.forEach((x, i) => {
            if (x !== 0) {
                const timetoconvert = arrayfree[i][`totalcol`].split(":");
                const secondstotalnum =
                    (timetoconvert[0] * 3600 + timetoconvert[1] * 60 + parseInt(timetoconvert[2])) / x;
                const hh = Math.floor(secondstotalnum / 3600);
                const mm = Math.floor((secondstotalnum - hh * 3600) / 60);
                const ss = Math.round(secondstotalnum) - hh * 3600 - mm * 60;
                arrayfree[i][`totalcol`] =
                    hh.toString().padStart(2, "0") +
                    ":" +
                    mm.toString().padStart(2, "0") +
                    ":" +
                    ss.toString().padStart(2, "0");
            }
        });

        setuserAverageReplyTimexFechaData(arrayfree);

        function gradient(num: number, rowcounter: number) {
            const rules =
                dataTableConfig?.find((x) => x.report_name === "averagereplytimexfecha")?.report_configuration || defaultTimeTableConfig;
            if (rowcounter >= 24) {
                return "#FFFFFF";
            }
            for (const item of rules) {
                if (num >= timetonumber(item.min) && num < timetonumber(item.max)) {
                    return item.color;
                }
            }
            return "#ffffff";
        }

        const arraytemplate =
            arrayfree.length > 0
                ? Object.entries(arrayfree[0])
                      .filter(([key]) => !/hour|horanum/gi.test(key))
                      .map(([key]) => ({
                          Header: key.includes("day") ? `${key.split("day")[1]}/${mes}` : "Promedio",
                          accessor: key,
                          NoFilter: true,
                          NoSort: true,
                          Cell: (props: Dictionary) => {
                            const column = props.cell.column;
                            const row = props.cell.row.original || {};
                            const rowcounter = props.cell.row.index;
                            const timespenttotal = row && row.original && row.original[key] !== undefined
                                ? row.original[key].split(":")
                                : ["00", "00", "00"];
                        
                            const hh = timespenttotal[0] === "00" ? "" : timespenttotal[0] + "h ";
                            const mm = timespenttotal[1] === "00" ? "" : timespenttotal[1] + "m ";
                            const ss = timespenttotal[2];
                        
                            if (key !== "totalcol") {
                                const seconds =
                                    parseInt(timespenttotal[0]) * 3600 +
                                    parseInt(timespenttotal[1]) * 60 +
                                    parseInt(timespenttotal[2]);
                                const color = gradient(seconds, rowcounter);
                        
                                return (
                                    <div
                                        style={{ background: `${color}`, textAlign: "center", color: "black" }}
                                        onClick={() => fetchDetail("1.4", column, row, mes, year)}
                                    >
                                        {`${hh}${mm}${ss}s`}
                                    </div>
                                );
                            } else {
                                return (
                                    <div
                                        style={{ textAlign: "center", fontWeight: "bold", background: "white" }}
                                    >{`${hh}${mm}${ss}s`}</div>
                                );
                            }
                        },
                        
                        
                        
                      }))
                : [];

        setuserAverageReplyTimexFechaTitle([
            {
                Header: `Hora`,
                accessor: "hournum",
                NoFilter: true,
                NoSort: true,
            },
            ...arraytemplate,
        ]);
    }

    function initPersonAverageReplyTimexFechaGrid(data: Dictionary[]) {
        const mes = dataMainHeatMap.startdate?.getMonth() + 1;
        const year = dataMainHeatMap.startdate?.getFullYear();
        const dateend = new Date(year, mes, 0).getDate();
        let rowmax = 0;
        let arrayfree: Dictionary[] = [];
        const LIMITHOUR = 24;
        const arrayvalidvalues = new Array(25).fill(0);
        const arrayvalidvaluesmonth = new Array(32).fill(0);

        for (let i = 1; i <= LIMITHOUR + 1; i++) {
            const objectfree: Dictionary = {
                hour: i,
                hournum: hoursProm[i - 1],
            };
            for (let j = 1; j <= dateend; j++) {
                objectfree[`day${j}`] = "00:00:00";
            }
            objectfree[`totalcol`] = "00:00:00";
            arrayfree.push(objectfree);
        }

        data.forEach((row: Dictionary) => {
            const day = parseInt(row.fecha.split("-")[2]);
            const hour = row.hora;
            const timespent = row.personaveragereplytimexfecha.split(":");
            const seconds = parseInt(timespent[0]) * 3600 + parseInt(timespent[1]) * 60 + parseInt(timespent[2]);

            arrayfree = arrayfree.map((x: any) =>
                x.hournum === hour ? { ...x, [`day${day}`]: row.personaveragereplytimexfecha } : x
            );
            rowmax = seconds > rowmax ? seconds : rowmax;
            arrayvalidvalues[row.horanum]++;
            arrayvalidvaluesmonth[day - 1]++;
            arrayfree.forEach((x: any) => {
                if (x.hournum === hour) {
                    const timespenttotal = x["totalcol"].split(":");
                    const secondstotalnum =
                        timespenttotal[0] * 3600 + timespenttotal[1] * 60 + parseInt(timespenttotal[2]) + seconds;
                    const hh = Math.floor(secondstotalnum / 3600);
                    const mm = Math.floor((secondstotalnum - hh * 3600) / 60);
                    const ss = Math.round(secondstotalnum) - hh * 3600 - mm * 60;
                    x["totalcol"] =
                        hh.toString().padStart(2, "0") +
                        ":" +
                        mm.toString().padStart(2, "0") +
                        ":" +
                        ss.toString().padStart(2, "0");
                }
            });
            let timespenttotal = arrayfree[24][`day${day}`].split(":");
            let secondstotalnum =
                timespenttotal[0] * 3600 + timespenttotal[1] * 60 + parseInt(timespenttotal[2]) + seconds;
            let hh = Math.floor(secondstotalnum / 3600);
            let mm = Math.floor((secondstotalnum - hh * 3600) / 60);
            let ss = Math.round(secondstotalnum) - hh * 3600 - mm * 60;
            arrayfree[24][`day${day}`] =
                hh.toString().padStart(2, "0") +
                ":" +
                mm.toString().padStart(2, "0") +
                ":" +
                ss.toString().padStart(2, "0");
            timespenttotal = arrayfree[24].totalcol.split(":");
            secondstotalnum = timespenttotal[0] * 3600 + timespenttotal[1] * 60 + parseInt(timespenttotal[2]) + seconds;
            hh = Math.floor(secondstotalnum / 3600);
            mm = Math.floor((secondstotalnum - hh * 3600) / 60);
            ss = Math.round(secondstotalnum) - hh * 3600 - mm * 60;
            arrayfree[24].totalcol =
                hh.toString().padStart(2, "0") +
                ":" +
                mm.toString().padStart(2, "0") +
                ":" +
                ss.toString().padStart(2, "0");
        });

        arrayvalidvaluesmonth.forEach((x, i) => {
            if (x !== 0) {
                const timetoconvert = arrayfree[24][`day${i + 1}`].split(":");
                const secondstotalnum =
                    (timetoconvert[0] * 3600 + timetoconvert[1] * 60 + parseInt(timetoconvert[2])) / x;
                const hh = Math.floor(secondstotalnum / 3600);
                const mm = Math.floor((secondstotalnum - hh * 3600) / 60);
                const ss = Math.round(secondstotalnum) - hh * 3600 - mm * 60;
                arrayfree[24][`day${i + 1}`] =
                    hh.toString().padStart(2, "0") +
                    ":" +
                    mm.toString().padStart(2, "0") +
                    ":" +
                    ss.toString().padStart(2, "0");
            }
        });

        arrayvalidvalues.forEach((x, i) => {
            if (x !== 0) {
                const timetoconvert = arrayfree[i][`totalcol`].split(":");
                const secondstotalnum =
                    (timetoconvert[0] * 3600 + timetoconvert[1] * 60 + parseInt(timetoconvert[2])) / x;
                const hh = Math.floor(secondstotalnum / 3600);
                const mm = Math.floor((secondstotalnum - hh * 3600) / 60);
                const ss = Math.round(secondstotalnum) - hh * 3600 - mm * 60;
                arrayfree[i][`totalcol`] =
                    hh.toString().padStart(2, "0") +
                    ":" +
                    mm.toString().padStart(2, "0") +
                    ":" +
                    ss.toString().padStart(2, "0");
            }
        });

        setpersonAverageReplyTimexFechaData(arrayfree);

        function gradient(num: number, rowcounter: number) {
            const rules =
                dataTableConfig?.find((x) => x.report_name === "averagereplytimexfechaclient")?.report_configuration ||
                defaultTimeTableConfig;
            if (rowcounter >= 24) {
                return "#FFFFFF";
            }
            for (const item of rules) {
                if (num >= timetonumber(item.min) && num < timetonumber(item.max)) {
                    return item.color;
                }
            }
            return "#ffffff";
        }

        const arraytemplate =
            arrayfree.length > 0
                ? Object.entries(arrayfree[0])
                      .filter(([key]) => !/hour|horanum/gi.test(key))
                      .map(([key]) => ({
                          Header: key.includes("day") ? `${key.split("day")[1]}/${mes}` : "Promedio",
                          accessor: key,
                          NoFilter: true,
                          NoSort: true,
                          Cell: (props: Dictionary) => {
                            const column = props.cell.column;
                            const row = props.cell.row.original || {};
                            const rowcounter = props.cell.row.index;
                            const timespenttotal = row !== undefined && row.original !== undefined && key in row.original
                                ? row.original[key].split(":")
                                : ["00", "00", "00"];
                        
                            const hh = timespenttotal[0] === "00" ? "" : timespenttotal[0] + "h ";
                            const mm = timespenttotal[1] === "00" ? "" : timespenttotal[1] + "m ";
                            const ss = timespenttotal[2];
                        
                            if (key !== "totalcol") {
                                const seconds =
                                    parseInt(timespenttotal[0]) * 3600 +
                                    parseInt(timespenttotal[1]) * 60 +
                                    parseInt(timespenttotal[2]);
                                const color = gradient(seconds, rowcounter);
                        
                                return (
                                    <div
                                        style={{ background: `${color}`, textAlign: "center", color: "black" }}
                                        onClick={() => fetchDetail("1.5", column, row, mes, year)}
                                    >
                                        {`${hh}${mm}${ss}s`}
                                    </div>
                                );
                            } else {
                                return (
                                    <div
                                        style={{ textAlign: "center", fontWeight: "bold", background: "white" }}
                                    >{`${hh}${mm}${ss}s`}</div>
                                );
                            }
                        },
                        
                        
                        
                      }))
                : [];

        setpersonAverageReplyTimexFechaTitle([
            {
                Header: `Hora`,
                accessor: "hournum",
                NoFilter: true,
                NoSort: true,
            },
            ...arraytemplate,
        ]);
    }

    return (
        <div>
            <div style={{ width: "100%", display: "flex", paddingTop: 10 }}>
                <div style={{ flex: 1, paddingRight: "10px" }}>
                    <TextField
                        id="date"
                        className={classes.fieldsfilter}
                        type="month"
                        variant="outlined"
                        onChange={(e) => handleDateChange(e.target.value)}
                        value={dataMainHeatMap.datetoshow}
                        size="small"
                    />
                </div>
                <div style={{ flex: 1, paddingRight: 10 }}>
                    <FieldSelect
                        label={t(langKeys.channel)}
                        className={classes.fieldsfilter}
                        variant="outlined"
                        onChange={(value) => {
                            setdataMainHeatMap((p) => ({
                                ...p,
                                communicationchannel: value?.typedesc || "",
                            }));
                        }}
                        valueDefault={dataMainHeatMap.communicationchannel}
                        data={dataChannels}
                        optionDesc="type"
                        optionValue="typedesc"
                    />
                </div>
                <div style={{ flex: 1 }}>
                    <FieldMultiSelect
                        label={t(langKeys.advisor)}
                        className={classes.fieldsfilter}
                        variant="outlined"
                        onChange={(value) => {
                            setdataMainHeatMap((p) => ({
                                ...p,
                                closedby: value.map((o: Dictionary) => o.domainvalue).join(),
                            }));
                        }}
                        valueDefault={dataMainHeatMap.closedby}
                        data={dataAdvisor}
                        optionDesc="domaindesc"
                        optionValue="domainvalue"
                    />
                </div>
                <div style={{ flex: 1, paddingLeft: 20 }}>
                    <Button
                        variant="contained"
                        color="primary"
                        style={{ width: "100%", backgroundColor: "#007bff" }}
                        onClick={() => search()}
                    >
                        {t(langKeys.search)}
                    </Button>
                </div>
            </div>
            {heatMapConversationsData.length ? (
                <div style={{ padding: 10 }}>
                    <TableZyx
                        columns={heatMapConversations}
                        titlemodule={t(langKeys.conversationheatmap)}
                        data={heatMapConversationsData}
                        download={true}
                        loading={multiDataAux.loading}
                        ButtonsElement={() => (
                            <Button
                                variant="outlined"
                                color="primary"
                                onClick={() => {
                                    setOpenModalConfiguration(true);
                                    setTableName("conversations");
                                }}
                                startIcon={<TrafficIcon />}
                            >
                                {t(langKeys.configuration)}
                            </Button>
                        )}
                        pageSizeDefault={50}
                        triggerExportPersonalized={true}
                        exportPersonalized={() => {
                            exportexcelwithgradient(
                                t(langKeys.conversationheatmap) + "Report",
                                heatMapConversationsData,
                                heatMapConversations.filter((x: Dictionary) => !x.isComponent && !x.activeOnHover),
                                dataTableConfig?.find((x) => x.report_name === "conversations")?.report_configuration ||
                                    defaultNumberTableConfig,
                                "day",
                                "number",
                                24
                            );
                        }}
                        filterGeneral={false}
                        toolsFooter={false}
                        helperText={t(langKeys.conversationheatmaptooltip)}
                    />
                </div>
            ) : (
                ""
            )}
            {averageHeatMapTMOData.length ? (
                <div style={{ padding: 10 }}>
                    <TableZyx
                        columns={averageHeatMapTMOTitle}
                        titlemodule={t(langKeys.averageheatmapTMOdata)}
                        data={averageHeatMapTMOData}
                        download={true}
                        loading={multiDataAux.loading}
                        ButtonsElement={() => (
                            <Button
                                variant="outlined"
                                color="primary"
                                onClick={() => {
                                    setOpenModalConfiguration(true);
                                    setTableName("averagetmo");
                                }}
                                startIcon={<TrafficIcon />}
                            >
                                {t(langKeys.configuration)}
                            </Button>
                        )}
                        triggerExportPersonalized={true}
                        exportPersonalized={() => {
                            exportexcelwithgradient(
                                t(langKeys.averageheatmapTMOdata) + "Report",
                                averageHeatMapTMOData,
                                averageHeatMapTMOTitle.filter((x: Dictionary) => !x.isComponent && !x.activeOnHover),
                                dataTableConfig?.find((x) => x.report_name === "averagetmo")?.report_configuration ||
                                defaultTimeTableConfig,
                                "day",
                                "time",
                                24
                            );
                        }}
                        pageSizeDefault={50}
                        filterGeneral={false}
                        toolsFooter={false}
                        helperText={t(langKeys.averageheatmapTMOdatatooltip)}
                    />
                </div>
            ) : (
                ""
            )}
            {heatmapaverageagentTMEData.length ? (
                <div style={{ padding: 10 }}>
                    <TableZyx
                        columns={heatmapaverageagentTMETitle}
                        titlemodule={t(langKeys.heatmapaverageagentTME)}
                        data={heatmapaverageagentTMEData}
                        loading={multiDataAux.loading}
                        download={true}
                        ButtonsElement={() => (
                            <Button
                                variant="outlined"
                                color="primary"
                                onClick={() => {
                                    setOpenModalConfiguration(true);
                                    setTableName("averageagenttme");
                                }}
                                startIcon={<TrafficIcon />}
                            >
                                {t(langKeys.configuration)}
                            </Button>
                        )}
                        triggerExportPersonalized={true}
                        exportPersonalized={() => {
                            exportexcelwithgradient(
                                t(langKeys.heatmapaverageagentTME) + "Report",
                                heatmapaverageagentTMEData,
                                heatmapaverageagentTMETitle.filter((x: Dictionary) => !x.isComponent && !x.activeOnHover),
                                dataTableConfig?.find((x) => x.report_name === "averageagenttme")?.report_configuration ||
                                defaultTimeTableConfig,
                                "day",
                                "time",
                                24
                            );
                        }}
                        pageSizeDefault={50}
                        filterGeneral={false}
                        toolsFooter={false}
                        helperText={t(langKeys.heatmapaverageagentTMEtooltip)}
                    />
                </div>
            ) : (
                ""
            )}
            {userAverageReplyTimexFechaData.length ? (
                <div style={{ padding: 10 }}>
                    <TableZyx
                        columns={userAverageReplyTimexFechaTitle}
                        titlemodule={t(langKeys.userAverageReplyTimexFecha)}
                        data={userAverageReplyTimexFechaData}
                        download={true}
                        loading={multiDataAux.loading}
                        pageSizeDefault={50}
                        filterGeneral={false}
                        ButtonsElement={() => (
                            <Button
                                variant="outlined"
                                color="primary"
                                onClick={() => {
                                    setOpenModalConfiguration(true);
                                    setTableName("averagereplytimexfecha");
                                }}
                                startIcon={<TrafficIcon />}
                            >
                                {t(langKeys.configuration)}
                            </Button>
                        )}
                        triggerExportPersonalized={true}
                        exportPersonalized={() => {
                            exportexcelwithgradient(
                                t(langKeys.userAverageReplyTimexFecha) + "Report",
                                userAverageReplyTimexFechaData,
                                userAverageReplyTimexFechaTitle.filter((x: Dictionary) => !x.isComponent && !x.activeOnHover),
                                dataTableConfig?.find((x) => x.report_name === "averagereplytimexfecha")?.report_configuration ||
                                defaultTimeTableConfig,
                                "day",
                                "time",
                                24
                            );
                        }}
                        toolsFooter={false}
                        helperText={t(langKeys.userAverageReplyTimexFechatooltip)}
                    />
                </div>
            ) : (
                ""
            )}
            {personAverageReplyTimexFechaData.length ? (
                <div style={{ padding: 10 }}>
                    <TableZyx
                        columns={personAverageReplyTimexFechaTitle}
                        titlemodule={t(langKeys.personAverageReplyTimexFecha)}
                        data={personAverageReplyTimexFechaData}
                        download={true}
                        loading={multiDataAux.loading}
                        pageSizeDefault={50}
                        filterGeneral={false}
                        toolsFooter={false}
                        ButtonsElement={() => (
                            <Button
                                variant="outlined"
                                color="primary"
                                onClick={() => {
                                    setOpenModalConfiguration(true);
                                    setTableName("averagereplytimexfechaclient");
                                }}
                                startIcon={<TrafficIcon />}
                            >
                                {t(langKeys.configuration)}
                            </Button>
                        )}
                        triggerExportPersonalized={true}
                        exportPersonalized={() => {
                            exportexcelwithgradient(
                                t(langKeys.personAverageReplyTimexFecha) + "Report",
                                personAverageReplyTimexFechaData,
                                personAverageReplyTimexFechaTitle.filter((x: Dictionary) => !x.isComponent && !x.activeOnHover),
                                dataTableConfig?.find((x) => x.report_name === "averagereplytimexfechaclient")?.report_configuration ||
                                defaultTimeTableConfig,
                                "day",
                                "time",
                                24
                            );
                        }}
                        helperText={t(langKeys.personAverageReplyTimexFechatooltip)}
                    />
                </div>
            ) : (
                ""
            )}
            <ModalHeatMap
                openModal={openModal}
                setOpenModal={setOpenModal}
                title={modalTitle}
                columns={modalColumns}
                data={multiDataAux2.data[0]?.data || []}
            />
            <DialogInteractions openModal={openModalTicket} setOpenModal={setOpenModalTicket} ticket={rowSelected} />
        </div>
    );
};

const HeatMapAsesor: React.FC<{
    dataChannels: Dictionary[];
    companydomain: Dictionary[];
    groupsdomain: Dictionary[];
    setOpenModalConfiguration: (dat: boolean) => void;
    setTableName: (d: string) => void;
    dataTableConfig: Dictionary[];
}> = ({ dataChannels, companydomain, groupsdomain, setOpenModalConfiguration, setTableName, dataTableConfig }) => {
    const { t } = useTranslation();
    const classes = useStyles();
    const [realizedsearch, setrealizedsearch] = useState(false);
    const [completadosxAsesorData, setCompletadosxAsesorData] = useState<Dictionary[]>([]);
    const [completadosxAsesorTitle, setCompletadosxAsesorTitle] = useState<Dictionary[]>([]);
    const [cantidadOportunidadesData, setCantidadOportunidadesData] = useState<Dictionary[]>([]);
    const [cantidadOportunidadesTitle, setCantidadOportunidadesTitle] = useState<Dictionary[]>([]);
    const [abandonosxAsesorData, setabandonosxAsesorData] = useState<Dictionary[]>([]);
    const [abandonosxAsesorTitle, setabandonosxAsesorTitle] = useState<Dictionary[]>([]);
    const [tasaAbandonosxAsesorData, settasaAbandonosxAsesorData] = useState<Dictionary[]>([]);
    const [tasaAbandonosxAsesorTitle, settasaAbandonosxAsesorTitle] = useState<Dictionary[]>([]);
    const [tasaOportunidadesData, setTasaOportunidadesData] = useState<Dictionary[]>([]);
    const [tasaOportunidadesTitle, setTasaOportunidadesTitle] = useState<Dictionary[]>([]);
    const [efectividadxAsesorData, setefectividadxAsesorData] = useState<Dictionary[]>([]);
    const [efectividadxAsesorTitle, setefectividadxAsesorTitle] = useState<Dictionary[]>([]);
    const [efectividadxAsesorOportunidadData, setefectividadxAsesorOportunidadData] = useState<Dictionary[]>([]);
    const [efectividadxAsesorOportunidadTitle, setefectividadxAsesorOportunidadTitle] = useState<Dictionary[]>([]);
    const [ventasxAsesorData, setventasxAsesorData] = useState<Dictionary[]>([]);
    const [ventasxAsesorTitle, setventasxAsesorTitle] = useState<Dictionary[]>([]);
    const [typeEfectiveness, settypeEfectiveness] = useState(true);
    // const [listadvisers, setlistadvisers] = useState<any>([]);
    const dataAdvisor = [
        { domaindesc: t(langKeys.agent), domainvalue: "ASESOR" },
        { domaindesc: "Bot", domainvalue: "BOT" },
    ];
    const dispatch = useDispatch();
    const [modalTitle, setModalTitle] = useState("");
    const [modalColumns, setModalColumns] = useState<Dictionary[]>([]);
    const [rowSelected, setRowSelected] = useState<Dictionary | null>(null);
    const [openModalTicket, setOpenModalTicket] = useState(false);
    const [waitDetail, setWaitDetail] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const mainResult = useSelector((state) => state.main);
    const mainAux = useSelector((state) => state.main.mainAux);
    const multiDataAux = useSelector((state) => state.main.multiDataAux);
    const openDialogInteractions = useCallback(
        (row: Dictionary) => {
            setOpenModalTicket(true);
            setRowSelected({ ...row, displayname: row.asesor, ticketnum: row.ticketnum });
        },
        [mainResult]
    );
    const downloadCallRecord = async (ticket: Dictionary) => {
        try {
            const axios_result = await VoximplantService.getCallRecord({
                call_session_history_id: ticket.postexternalid,
            });
            if (axios_result.status === 200) {
                const buff = Buffer.from(axios_result.data, "base64");
                const blob = new Blob([buff], {
                    type: axios_result.headers["content-type"].split(";").find((x: string) => x.includes("audio")),
                });
                const objectUrl = window.URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = objectUrl;
                a.download = ticket.ticketnum;
                a.click();
            }
        } catch (error: any) {
            const errormessage = t(error?.response?.data?.code || "error_unexpected_error");
            dispatch(showSnackbar({ show: true, severity: "error", message: errormessage }));
        }
    };
    const fetchDetail = (
        grid: string,
        column: Dictionary,
        row: Dictionary,
        page2: boolean,
        mes: number,
        year: number
    ) => {
        if (
            row.hournum !== "TOTAL" &&
            ((typeof row[column.id] === "number" && row[column.id] > 0) ||
                (typeof row[column.id] === "string" && row[column.id] !== "00:00:00"))
        ) {
            const day = column.id.replace("day", "");
            //const user = listadvisers.filter((x:any)=>x.userid === row.userid)[0]?.userdesc;
            const user = (multiData.data[1]?.data || []).filter((x: Dictionary) => x.userid === row.userid)[0]?.userdesc;
            switch (grid) {
                case "COMPLETED":
                    setModalTitle(`Tickets ${capitalize(user || "")} ${t(langKeys.day)} ${day}`);
                    setModalColumns([
                        {
                            accessor: "voxiid",
                            isComponent: true,
                            minWidth: 60,
                            width: "1%",
                            Cell: (props: Dictionary) => {
                                const row = props.cell.row.original || {};
                                return row.communicationchanneltype === "VOXI" &&
                                    row.postexternalid &&
                                    row.callanswereddate ? (
                                    <Tooltip title={t(langKeys.download_record) || ""}>
                                        <IconButton size="small" onClick={() => downloadCallRecord(row)}>
                                            <CallRecordIcon style={{ fill: "#7721AD" }} />
                                        </IconButton>
                                    </Tooltip>
                                ) : null;
                            },
                        },
                        {
                            Header: t(langKeys.ticket),
                            accessor: "ticketnum",
                            Cell: (props: Dictionary) => {
                                const row = props.cell.row.original || {};
                                return (
                                    <label className={classes.labellink} onClick={() => openDialogInteractions(row)}>
                                        {row.ticketnum}
                                    </label>
                                );
                            },
                        },
                        { Header: t(langKeys.channel), accessor: "channel" },
                        { Header: t(langKeys.agent), accessor: "asesor" },
                    ]);
                    break;
                case "ABANDONED":
                    setModalTitle(`Tickets ${capitalize(user || "")} ${t(langKeys.day)} ${day}`);
                    setModalColumns([
                        {
                            accessor: "voxiid",
                            isComponent: true,
                            minWidth: 60,
                            width: "1%",
                            Cell: (props: Dictionary) => {
                                const row = props.cell.row.original || {};
                                return row.communicationchanneltype === "VOXI" &&
                                    row.postexternalid &&
                                    row.callanswereddate ? (
                                    <Tooltip title={t(langKeys.download_record) || ""}>
                                        <IconButton size="small" onClick={() => downloadCallRecord(row)}>
                                            <CallRecordIcon style={{ fill: "#7721AD" }} />
                                        </IconButton>
                                    </Tooltip>
                                ) : null;
                            },
                        },
                        {
                            Header: t(langKeys.ticket),
                            accessor: "ticketnum",
                            Cell: (props: Dictionary) => {
                                const row = props.cell.row.original || {};
                                return (
                                    <label className={classes.labellink} onClick={() => openDialogInteractions(row)}>
                                        {row.ticketnum}
                                    </label>
                                );
                            },
                        },
                        { Header: t(langKeys.channel), accessor: "channel" },
                    ]);
                    break;
                case "OPPORTUNITY":
                    setModalTitle(
                        `${t(langKeys.opportunity_plural)} ${capitalize(user || "")} ${t(langKeys.day)} ${day}`
                    );
                    setModalColumns([
                        {
                            accessor: "voxiid",
                            isComponent: true,
                            minWidth: 60,
                            width: "1%",
                            Cell: (props: Dictionary) => {
                                const row = props.cell.row.original || {};
                                return row.communicationchanneltype === "VOXI" &&
                                    row.postexternalid &&
                                    row.callanswereddate ? (
                                    <Tooltip title={t(langKeys.download_record) || ""}>
                                        <IconButton size="small" onClick={() => downloadCallRecord(row)}>
                                            <CallRecordIcon style={{ fill: "#7721AD" }} />
                                        </IconButton>
                                    </Tooltip>
                                ) : null;
                            },
                        },
                        {
                            Header: t(langKeys.ticket),
                            accessor: "ticketnum",
                            Cell: (props: Dictionary) => {
                                const row = props.cell.row.original || {};
                                return (
                                    <label className={classes.labellink} onClick={() => openDialogInteractions(row)}>
                                        {row.ticketnum}
                                    </label>
                                );
                            },
                        },
                        { Header: t(langKeys.channel), accessor: "channel" },
                        { Header: t(langKeys.opportunityname), accessor: "leadname" },
                    ]);
                    break;
                case "OPPORTUNITYWON":
                    setModalTitle(
                        `${t(langKeys.opportunity_plural)} ${capitalize(user || "")} ${t(langKeys.day)} ${day}`
                    );
                    setModalColumns([
                        {
                            accessor: "voxiid",
                            isComponent: true,
                            minWidth: 60,
                            width: "1%",
                            Cell: (props: Dictionary) => {
                                const row = props.cell.row.original || {};
                                return row.communicationchanneltype === "VOXI" &&
                                    row.postexternalid &&
                                    row.callanswereddate ? (
                                    <Tooltip title={t(langKeys.download_record) || ""}>
                                        <IconButton size="small" onClick={() => downloadCallRecord(row)}>
                                            <CallRecordIcon style={{ fill: "#7721AD" }} />
                                        </IconButton>
                                    </Tooltip>
                                ) : null;
                            },
                        },
                        {
                            Header: t(langKeys.ticket),
                            accessor: "ticketnum",
                            Cell: (props: Dictionary) => {
                                const row = props.cell.row.original || {};
                                return (
                                    <label className={classes.labellink} onClick={() => openDialogInteractions(row)}>
                                        {row.ticketnum}
                                    </label>
                                );
                            },
                        },
                        { Header: t(langKeys.channel), accessor: "channel" },
                        { Header: t(langKeys.opportunitywon), accessor: "opportunitywon" },
                    ]);
                    break;
                default:
                    break;
            }
            !page2
                ? dispatch(
                      getCollectionAux(
                          heatmappage2detail1({
                              ...dataMainHeatMap,
                              startdate: new Date(year, mes - 1, day),
                              enddate: new Date(year, mes - 1, day),
                              agentid: row.userid,
                              option: grid,
                          })
                      )
                  )
                : dispatch(
                      getCollectionAux(
                          heatmappage2detail2({
                              ...dataMainHeatMap,
                              startdate: new Date(year, mes - 1, day),
                              enddate: new Date(year, mes - 1, day),
                              agentid: row.userid,
                              option: grid,
                          })
                      )
                  );
            dispatch(showBackdrop(true));
            setWaitDetail(true);
        }
    };
    const multiData = useSelector((state) => state.main.multiData);
    const [dataMainHeatMap, setdataMainHeatMap] = useState({
        communicationchannel: "",
        closedby: "ASESOR",
        startdate: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
        enddate: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0),
        datetoshow: `${new Date(new Date().setDate(1)).getFullYear()}-${String(
            new Date(new Date().setDate(1)).getMonth() + 1
        ).padStart(2, "0")}`,
        company: "",
        group: "",
    });

    useEffect(() => {
        if (!multiDataAux.loading) {
            search();
        }
    }, [multiDataAux]);

    useEffect(() => {
        if (waitDetail) {
            if (!mainAux.loading) {
                dispatch(showBackdrop(false));
                setWaitDetail(false);
                setOpenModal(true);
            }
        }
    }, [mainAux]);
    useEffect(() => {
        if (!multiData.loading && realizedsearch) {
            const mes = dataMainHeatMap.startdate?.getMonth() + 1;
            const year = dataMainHeatMap.startdate?.getFullYear();
            const dateend = new Date(year, mes, 0).getDate();
            const arrayfree: Dictionary[] = [];
            // setlistadvisers(multiData.data[1]?.data||[])
            const tempadviserlist = multiData.data[1]?.data || [];
            tempadviserlist.forEach((row: Dictionary) => {
                const objectfree: Dictionary = {
                    asesor: capitalize(row.userdesc),
                    userid: row.userid,
                };
                for (let j = 1; j <= dateend; j++) {
                    objectfree[`day${j}`] = 0;
                }
                objectfree[`totalcol`] = 0;
                arrayfree.push(objectfree);
            });
            setrealizedsearch(false);
            dispatch(showBackdrop(false));
            initCompletadosxAsesorGrid(multiData.data[0]?.data || [], arrayfree, tempadviserlist);
            initAbandonosxAsesorGrid(multiData.data[0]?.data || [], arrayfree, tempadviserlist);
            initTasaAbandonosxAsesorGrid(multiData.data[0]?.data || [], arrayfree);
            initCantidadOportunidadesGrid(multiData.data[0]?.data || [], arrayfree, tempadviserlist);
            initTasaOportunidadesGrid(multiData.data[0]?.data || [], arrayfree);
            initVentasxAsesorGrid(multiData.data[0]?.data || [], arrayfree, tempadviserlist);
            initEfectividadxAsesorGrid(multiData.data[0]?.data || [], arrayfree);
            initEfectividadxAsesorxoportunitiesGrid(multiData.data[0]?.data || [], arrayfree);
        }
    }, [multiData, realizedsearch]);

    function initCompletadosxAsesorGrid(data: Dictionary[], arraything: Dictionary[], tempadviserlist: Dictionary[]) {
        let arrayfree: Dictionary[] = [...arraything];
        const mes = dataMainHeatMap.startdate?.getMonth() + 1;
        const year = dataMainHeatMap.startdate?.getFullYear();
        let rowmax = 0;
        const dateend = new Date(year, mes, 0).getDate();
        const objectlast: Dictionary = { asesor: "TOTAL", userid: 0 };
        for (let j = 1; j <= dateend; j++) {
            objectlast[`day${j}`] = 0;
        }
        objectlast[`totalcol`] = 0;
        arrayfree.push(objectlast);

        data.filter((x: Dictionary) => tempadviserlist.filter((e: Dictionary) => e.userid === x.userid).length > 0).forEach(
            (row: Dictionary) => {
                const day = parseInt(row.fecha.split("-")[2]);
                const hour = row.userid;
                arrayfree = arrayfree.map((x: Dictionary) =>
                    x.userid === hour
                        ? {
                              ...x,
                              [`day${day}`]: row.completadosxasesor,
                              [`totalcol`]: x.totalcol + row.completadosxasesor,
                          }
                        : x
                );
                rowmax = row.completadosxasesor > rowmax ? row.completadosxasesor : rowmax;
                arrayfree[tempadviserlist.length][`day${day}`] += row.completadosxasesor;
                arrayfree[tempadviserlist.length][`totalcol`] += row.completadosxasesor;
            }
        );
        setCompletadosxAsesorData(arrayfree);

        function gradient(num: number, rowcount: number) {
            if (rowcount >= tempadviserlist.length) {
                return "#FFFFFF";
            }
            const rules =
                dataTableConfig?.find((x) => x.report_name === "completeconversations")?.report_configuration || defaultNumberTableConfig;
            for (const item of rules) {
                if (num >= item.min && num < item.max) {
                    return item.color;
                }
            }
            return "#ffffff";
        }

        const arraytemplate =
            arrayfree.length > 0
                ? Object.entries(arrayfree[0])
                      .filter(([key]) => !/asesor|horanum/gi.test(key))
                      .map(([key]) => ({
                          Header: key.includes("day")
                              ? `${key.split("day")[1]}/${mes}`
                              : key === "asesor"
                              ? "ASESOR"
                              : "TOTAL",
                          accessor: key,
                          NoFilter: true,
                          NoSort: true,
                          Cell: (props: Dictionary) => {
                              const column = props.cell.column;
                              const row = props.cell.row.original || {};
                              const rowcount = props.cell.row.index;
                              if (key !== "totalcol") {
                                  const color = gradient(props.cell.row.original[key], rowcount);

                                  return (
                                      <div
                                          style={{ background: `${color}`, textAlign: "center", color: "black" }}
                                          onClick={() => fetchDetail("COMPLETED", column, row, false, mes, year)}
                                      >
                                          {props.cell.row.original[key]}
                                      </div>
                                  );
                              } else {
                                  return (
                                      <div style={{ textAlign: "center", fontWeight: "bold", background: "white" }}>
                                          {props.cell.row.original[key]}
                                      </div>
                                  );
                              }
                          },
                      }))
                : [];
        arraytemplate?.shift();
        setCompletadosxAsesorTitle([
            {
                Header: t(langKeys.advisor),
                accessor: "asesor",
                NoFilter: true,
                NoSort: true,
            },
            ...arraytemplate,
        ]);
    }
    function initAbandonosxAsesorGrid(data: Dictionary[], arraything: Dictionary[], tempadviserlist: Dictionary[]) {
        let arrayfree: Dictionary[] = [...arraything];
        const mes = dataMainHeatMap.startdate?.getMonth() + 1;
        const year = dataMainHeatMap.startdate?.getFullYear();
        let rowmax = 0;
        const dateend = new Date(year, mes, 0).getDate();

        const objectlast: Dictionary = { asesor: "TOTAL", userid: 0 };
        for (let j = 1; j <= dateend; j++) {
            objectlast[`day${j}`] = 0;
        }
        objectlast[`totalcol`] = 0;
        arrayfree.push(objectlast);
        data.filter((x: Dictionary) => tempadviserlist.filter((e: Dictionary) => e.userid === x.userid).length > 0).forEach(
            (row: Dictionary) => {
                const day = parseInt(row.fecha.split("-")[2]);
                const hour = row.userid;
                arrayfree = arrayfree.map((x: Dictionary) =>
                    x.userid === hour
                        ? {
                              ...x,
                              [`day${day}`]: row.abandonosxasesor,
                              [`totalcol`]: x.totalcol + row.abandonosxasesor,
                          }
                        : x
                );
                rowmax = row.abandonosxasesor > rowmax ? row.abandonosxasesor : rowmax;
                arrayfree[tempadviserlist.length][`day${day}`] += row.abandonosxasesor;
                arrayfree[tempadviserlist.length][`totalcol`] += row.abandonosxasesor;
            }
        );
        setabandonosxAsesorData(arrayfree);

        function gradient(num: number, rowcount: number) {
            if (rowcount >= tempadviserlist.length) {
                return "#FFFFFF";
            }
            const rules =
                dataTableConfig?.find((x) => x.report_name === "quantityabandonos")?.report_configuration || defaultNumberTableConfig;
            for (const item of rules) {
                if (num >= item.min && num < item.max) {
                    return item.color;
                }
            }
            return "#ffffff";
        }

        const arraytemplate =
            arrayfree.length > 0
                ? Object.entries(arrayfree[0])
                      .filter(([key]) => !/asesor|horanum/gi.test(key))
                      .map(([key]) => ({
                          Header: key.includes("day")
                              ? `${key.split("day")[1]}/${mes}`
                              : key === "asesor"
                              ? "ASESOR"
                              : "TOTAL",
                          accessor: key,
                          NoFilter: true,
                          NoSort: true,
                          Cell: (props: Dictionary) => {
                              const rowcount = props.cell.row.index;
                              if (key !== "totalcol") {
                                  const color = gradient(props.cell.row.original[key], rowcount);
                                  const column = props.cell.column;
                                  const row = props.cell.row.original || {};

                                  return (
                                      <div
                                          onClick={() => fetchDetail("ABANDONED", column, row, false, mes, year)}
                                          style={{ background: `${color}`, textAlign: "center", color: "black" }}
                                      >
                                          {props.cell.row.original[key]}
                                      </div>
                                  );
                              } else {
                                  return (
                                      <div style={{ textAlign: "center", fontWeight: "bold", background: "white" }}>
                                          {props.cell.row.original[key]}
                                      </div>
                                  );
                              }
                          },
                      }))
                : [];
        arraytemplate?.shift();
        setabandonosxAsesorTitle([
            {
                Header: t(langKeys.advisor),
                accessor: "asesor",
                NoFilter: true,
                NoSort: true,
            },
            ...arraytemplate,
        ]);
    }
    function initTasaAbandonosxAsesorGrid(data: Dictionary[], arraything: Dictionary[]) {
        let arrayfree: Dictionary[] = [...arraything];
        const mes = dataMainHeatMap.startdate?.getMonth() + 1;
        data.forEach((row: Dictionary) => {
            const day = parseInt(row.fecha.split("-")[2]);
            const hour = row.userid;
            arrayfree = arrayfree.map((x: Dictionary) =>
                x.userid === hour ? { ...x, [`day${day}`]: row.tasaabandonosxasesor } : x
            );
        });

        settasaAbandonosxAsesorData(arrayfree);

        function gradient(num: number) {
            const rules = dataTableConfig?.find((x) => x.report_name === "tasaabandonos")?.report_configuration || defaultPercentageTableConfig;
            for (const item of rules) {
                if (num >= item.min && num < item.max) {
                    return item.color;
                }
            }
            return "#ffffff";
        }

        const arraytemplate =
            arrayfree.length > 0
                ? Object.entries(arrayfree[0])
                      .filter(([key]) => !/asesor|horanum/gi.test(key))
                      .map(([key]) => ({
                          Header: key.includes("day")
                              ? `${key.split("day")[1]}/${mes}`
                              : key === "asesor"
                              ? "ASESOR"
                              : "TOTAL",
                          accessor: key,
                          NoFilter: true,
                          NoSort: true,
                          type: "porcentage",
                          Cell: (props: Dictionary) => {
                              const color = gradient(Number(props.cell.row.original[key]) * 100);
                              const number = `${(Number(props.cell.row.original[key]) * 100).toFixed(0)} %`;
                              return (
                                  <div style={{ background: `${color}`, textAlign: "center", color: "black" }}>
                                      {number}
                                  </div>
                              );
                          },
                      }))
                : [];
        arraytemplate?.shift();
        arraytemplate?.pop();
        settasaAbandonosxAsesorTitle([
            {
                Header: t(langKeys.advisor),
                accessor: "asesor",
                NoFilter: true,
                NoSort: true,
            },
            ...arraytemplate,
        ]);
    }
    function initCantidadOportunidadesGrid(data: Dictionary[], arraything: Dictionary[], tempadviserlist: Dictionary[]) {
        let arrayfree: Dictionary[] = [...arraything];
        const mes = dataMainHeatMap.startdate?.getMonth() + 1;
        const year = dataMainHeatMap.startdate?.getFullYear();
        let rowmax = 0;
        const dateend = new Date(year, mes, 0).getDate();

        const objectlast: Dictionary = { asesor: "TOTAL", userid: 0 };
        for (let j = 1; j <= dateend; j++) {
            objectlast[`day${j}`] = 0;
        }
        objectlast[`totalcol`] = 0;
        arrayfree.push(objectlast);
        data.filter((x: Dictionary) => tempadviserlist.filter((e: Dictionary) => e.userid === x.userid).length > 0).forEach(
            (row: Dictionary) => {
                const day = parseInt(row.fecha.split("-")[2]);
                const hour = row.userid;
                arrayfree = arrayfree.map((x: Dictionary) =>
                    x.userid === hour
                        ? {
                              ...x,
                              [`day${day}`]: row.oportunidadesxasesor,
                              [`totalcol`]: x.totalcol + row.oportunidadesxasesor,
                          }
                        : x
                );
                rowmax = row.oportunidadesxasesor > rowmax ? row.oportunidadesxasesor : rowmax;
                arrayfree[tempadviserlist.length][`day${day}`] += row.oportunidadesxasesor;
                arrayfree[tempadviserlist.length][`totalcol`] += row.oportunidadesxasesor;
            }
        );
        setCantidadOportunidadesData(arrayfree);

        function gradient(num: number, rowcount: number) {
            if (rowcount >= tempadviserlist.length) {
                return "#FFFFFF";
            }
            const rules =
                dataTableConfig?.find((x) => x.report_name === "quantityoportunities")?.report_configuration || defaultNumberTableConfig;
            for (const item of rules) {
                if (num >= item.min && num < item.max) {
                    return item.color;
                }
            }
            return "#ffffff";
        }

        const arraytemplate =
            arrayfree.length > 0
                ? Object.entries(arrayfree[0])
                      .filter(([key]) => !/asesor|horanum/gi.test(key))
                      .map(([key]) => ({
                          Header: key.includes("day")
                              ? `${key.split("day")[1]}/${mes}`
                              : key === "asesor"
                              ? "ASESOR"
                              : "TOTAL",
                          accessor: key,
                          NoFilter: true,
                          NoSort: true,
                          Cell: (props: Dictionary) => {
                              if (key !== "totalcol") {
                                  const rowcount = props.cell.row.index;
                                  const color = gradient(props.cell.row.original[key], rowcount);
                                  const column = props.cell.column;
                                  const row = props.cell.row.original || {};

                                  return (
                                      <div
                                          onClick={() => fetchDetail("OPPORTUNITY", column, row, true, mes, year)}
                                          style={{ background: `${color}`, textAlign: "center", color: "black" }}
                                      >
                                          {props.cell.row.original[key]}
                                      </div>
                                  );
                              } else {
                                  return (
                                      <div style={{ textAlign: "center", fontWeight: "bold", background: "white" }}>
                                          {props.cell.row.original[key]}
                                      </div>
                                  );
                              }
                          },
                      }))
                : [];
        arraytemplate?.shift();
        setCantidadOportunidadesTitle([
            {
                Header: t(langKeys.advisor),
                accessor: "asesor",
                NoFilter: true,
                NoSort: true,
            },
            ...arraytemplate,
        ]);
    }
    function initTasaOportunidadesGrid(data: Dictionary[], arraything: Dictionary[]) {
        let arrayfree: Dictionary[] = [...arraything];
        const mes = dataMainHeatMap.startdate?.getMonth() + 1;

        data.forEach((row: Dictionary) => {
            const day = parseInt(row.fecha.split("-")[2]);
            const hour = row.userid;
            arrayfree = arrayfree.map((x: Dictionary) =>
                x.userid === hour ? { ...x, [`day${day}`]: row.tasaoportunidadesxasesor } : x
            );
        });

        setTasaOportunidadesData(arrayfree);

        function gradient(num: number) {
            const rules =
                dataTableConfig?.find((x) => x.report_name === "tasaoportunities")?.report_configuration || defaultPercentageTableConfig;
            for (const item of rules) {
                if (num >= item.min && num < item.max) {
                    return item.color;
                }
            }
            return "#ffffff";
        }
        const arraytemplate =
            arrayfree.length > 0
                ? Object.entries(arrayfree[0])
                      .filter(([key]) => !/asesor/gi.test(key))
                      .map(([key]) => ({
                          Header: key.includes("day")
                              ? `${key.split("day")[1]}/${mes}`
                              : key === "asesor"
                              ? "ASESOR"
                              : "TOTAL",
                          accessor: key,
                          NoFilter: true,
                          NoSort: true,
                          type: "porcentage",
                          Cell: (props: Dictionary) => {
                              const color = gradient(Number(props.cell.row.original[key]) * 100);
                              const number = `${(Number(props.cell.row.original[key]) * 100).toFixed(0)} %`;
                              return (
                                  <div style={{ background: `${color}`, textAlign: "center", color: "black" }}>
                                      {number}
                                  </div>
                              );
                          },
                      }))
                : [];
        arraytemplate?.shift();
        arraytemplate?.pop();
        setTasaOportunidadesTitle([
            {
                Header: t(langKeys.advisor),
                accessor: "asesor",
                NoFilter: true,
                NoSort: true,
            },
            ...arraytemplate,
        ]);
    }

    function initVentasxAsesorGrid(data: Dictionary[], arraything: Dictionary[], tempadviserlist: Dictionary[]) {
        let arrayfree: Dictionary[] = [...arraything];
        const mes = dataMainHeatMap.startdate?.getMonth() + 1;
        const year = dataMainHeatMap.startdate?.getFullYear();
        let rowmax = 0;
        const dateend = new Date(year, mes, 0).getDate();

        const objectlast: Dictionary = { asesor: "TOTAL", userid: 0 };
        for (let j = 1; j <= dateend; j++) {
            objectlast[`day${j}`] = 0;
        }
        objectlast[`totalcol`] = 0;
        arrayfree.push(objectlast);

        data.filter((x: Dictionary) => tempadviserlist.filter((e: Dictionary) => e.userid === x.userid).length > 0).forEach(
            (row: Dictionary) => {
                const day = parseInt(row.fecha.split("-")[2]);
                const hour = row.userid;
                arrayfree = arrayfree.map((x: Dictionary) =>
                    x.userid === hour
                        ? {
                              ...x,
                              [`day${day}`]: row.ventasxasesor,
                              [`totalcol`]: x.totalcol + row.ventasxasesor,
                          }
                        : x
                );
                rowmax = row.ventasxasesor > rowmax ? row.ventasxasesor : rowmax;
                arrayfree[tempadviserlist.length][`day${day}`] += row.ventasxasesor;
                arrayfree[tempadviserlist.length][`totalcol`] += row.ventasxasesor;
            }
        );

        setventasxAsesorData(arrayfree);

        function gradient(num: number, rowcount: number) {
            if (rowcount >= tempadviserlist.length) {
                return "#FFFFFF";
            }
            const rules = dataTableConfig?.find((x) => x.report_name === "quantityventas")?.report_configuration || defaultNumberTableConfig;
            for (const item of rules) {
                if (num >= item.min && num < item.max) {
                    return item.color;
                }
            }
            return "#ffffff";
        }

        const arraytemplate =
            arrayfree.length > 0
                ? Object.entries(arrayfree[0])
                      .filter(([key]) => !/asesor|horanum/gi.test(key))
                      .map(([key]) => ({
                          Header: key.includes("day")
                              ? `${key.split("day")[1]}/${mes}`
                              : key === "asesor"
                              ? "ASESOR"
                              : "TOTAL",
                          accessor: key,
                          NoFilter: true,
                          NoSort: true,
                          Cell: (props: Dictionary) => {
                              if (key !== "totalcol") {
                                  const rowcount = props.cell.row.index;
                                  const color = gradient(props.cell.row.original[key], rowcount);
                                  const column = props.cell.column;
                                  const row = props.cell.row.original || {};

                                  return (
                                      <div
                                          onClick={() => fetchDetail("OPPORTUNITYWON", column, row, true, mes, year)}
                                          style={{ background: `${color}`, textAlign: "center", color: "black" }}
                                      >
                                          {props.cell.row.original[key]}
                                      </div>
                                  );
                              } else {
                                  return (
                                      <div style={{ textAlign: "center", fontWeight: "bold", background: "white" }}>
                                          {props.cell.row.original[key]}
                                      </div>
                                  );
                              }
                          },
                      }))
                : [];
        arraytemplate?.shift();
        setventasxAsesorTitle([
            {
                Header: t(langKeys.advisor),
                accessor: "asesor",
                NoFilter: true,
                NoSort: true,
            },
            ...arraytemplate,
        ]);
    }
    function initEfectividadxAsesorGrid(data: Dictionary[], arraything: Dictionary[]) {
        let arrayfree: Dictionary[] = [...arraything];
        const mes = dataMainHeatMap.startdate?.getMonth() + 1;

        data.forEach((row: Dictionary) => {
            const efectividad = row.tasaventasxticket === null ? 0 : row.tasaventasxticket;
            const day = parseInt(row.fecha.split("-")[2]);
            const hour = row.userid;
            arrayfree = arrayfree.map((x: Dictionary) => (x.userid === hour ? { ...x, [`day${day}`]: efectividad } : x));
        });

        setefectividadxAsesorData(arrayfree);

        function gradient(num: number) {
            const rules =
                dataTableConfig?.find((x) => x.report_name === "tasaventasporasesor")?.report_configuration || defaultPercentageTableConfig;
            for (const item of rules) {
                if (num >= item.min && num < item.max) {
                    return item.color;
                }
            }
            return "#ffffff";
        }

        const arraytemplate =
            arrayfree.length > 0
                ? Object.entries(arrayfree[0])
                      .filter(([key]) => !/asesor/gi.test(key))
                      .map(([key]) => ({
                          Header: key.includes("day")
                              ? `${key.split("day")[1]}/${mes}`
                              : key === "asesor"
                              ? "ASESOR"
                              : "TOTAL",
                          accessor: key,
                          NoFilter: true,
                          NoSort: true,
                          type: "porcentage",
                          Cell: (props: Dictionary) => {
                              const color = gradient(Number(props.cell.row.original[key]) * 100);
                              const number = `${(Number(props.cell.row.original[key]) * 100).toFixed(0)} %`;
                              return (
                                  <div style={{ background: `${color}`, textAlign: "center", color: "black" }}>
                                      {number}
                                  </div>
                              );
                          },
                      }))
                : [];
        arraytemplate?.shift();
        arraytemplate?.pop();
        setefectividadxAsesorTitle([
            {
                Header: t(langKeys.advisor),
                accessor: "asesor",
                NoFilter: true,
                NoSort: true,
            },
            ...arraytemplate,
        ]);
    }
    function initEfectividadxAsesorxoportunitiesGrid(data: Dictionary[], arraything: Dictionary[]) {
        let arrayfree: Dictionary[] = [...arraything];
        const mes = dataMainHeatMap.startdate?.getMonth() + 1;

        data.forEach((row: Dictionary) => {
            const efectividad = row.tasaventasxoportunidad === null ? 0 : row.tasaventasxoportunidad;
            const day = parseInt(row.fecha.split("-")[2]);
            const hour = row.userid;
            arrayfree = arrayfree.map((x: Dictionary) => (x.userid === hour ? { ...x, [`day${day}`]: efectividad } : x));
        });

        setefectividadxAsesorOportunidadData(arrayfree);

        function gradient(num: number) {
            let scale = 255 / (1 / 2);
            if (isNaN(scale)) scale = 0;

            if (num <= 1 / 2) {
                const number = Math.floor(num * scale).toString(16);
                return "00".slice(number.length) + number + "ff00";
            }
            const number = Math.floor(255 - (num - 1 / 2) * scale).toString(16);
            return "FF" + "00".slice(number.length) + number + "00";
        }

        const arraytemplate =
            arrayfree.length > 0
                ? Object.entries(arrayfree[0])
                      .filter(([key]) => !/asesor/gi.test(key))
                      .map(([key]) => ({
                          Header: key.includes("day")
                              ? `${key.split("day")[1]}/${mes}`
                              : key === "asesor"
                              ? "ASESOR"
                              : "TOTAL",
                          accessor: key,
                          NoFilter: true,
                          NoSort: true,
                          type: "porcentage",
                          Cell: (props: Dictionary) => {
                              const color = gradient(Number(props.cell.row.original[key]));
                              const number = `${(Number(props.cell.row.original[key]) * 100).toFixed(0)} %`;
                              return (
                                  <div style={{ background: `#${color}`, textAlign: "center", color: "black" }}>
                                      {number}
                                  </div>
                              );
                          },
                      }))
                : [];
        arraytemplate?.shift();
        arraytemplate?.pop();
        setefectividadxAsesorOportunidadTitle([
            {
                Header: t(langKeys.advisor),
                accessor: "asesor",
                NoFilter: true,
                NoSort: true,
            },
            ...arraytemplate,
        ]);
    }
    async function search() {
        if (dataMainHeatMap.datetoshow === "") {
            dispatch(showSnackbar({ show: true, severity: "error", message: t(langKeys.date_format_error) }));
        } else {
            // setlistadvisers([])
            setCompletadosxAsesorData([]);
            setabandonosxAsesorData([]);
            settasaAbandonosxAsesorData([]);
            setTasaOportunidadesData([]);
            setventasxAsesorData([]);
            setefectividadxAsesorOportunidadData([]);
            setefectividadxAsesorData([]);
            setCantidadOportunidadesData([]);
            setrealizedsearch(true);
            dispatch(showBackdrop(true));
            dispatch(
                getMultiCollection([
                    heatmappage2(dataMainHeatMap),
                    getasesoresbyorgid(dataMainHeatMap.closedby, dataMainHeatMap.communicationchannel),
                ])
            );
        }
    }
    function handleDateChange(e: string) {
        if (e === "") {
            setdataMainHeatMap((prev) => ({ ...prev, datetoshow: e }));
        } else {
            const year = Number(e.split("-")[0]);
            const mes = Number(e.split("-")[1]);
            const startdate = new Date(year, mes - 1, 1);
            const enddate = new Date(year, mes, 0);
            setdataMainHeatMap((prev) => ({ ...prev, startdate, enddate, datetoshow: e }));
        }
    }
    return (
        <div>
            <div style={{ width: "100%", display: "flex", paddingTop: 10 }}>
                <div style={{ flex: 1, paddingRight: "10px" }}>
                    <TextField
                        id="date"
                        className={classes.fieldsfilter}
                        type="month"
                        variant="outlined"
                        onChange={(e) => handleDateChange(e.target.value)}
                        value={dataMainHeatMap.datetoshow}
                        size="small"
                    />
                </div>
                <div style={{ flex: 1, paddingRight: 10 }}>
                    <FieldSelect
                        label={t(langKeys.channel)}
                        className={classes.fieldsfilter}
                        variant="outlined"
                        onChange={(value) => {
                            setdataMainHeatMap((p) => ({
                                ...p,
                                communicationchannel: value?.typedesc || "",
                            }));
                        }}
                        valueDefault={dataMainHeatMap.communicationchannel}
                        data={dataChannels}
                        optionDesc="type"
                        optionValue="typedesc"
                    />
                </div>
                <div style={{ flex: 1, paddingRight: 10 }}>
                    <FieldMultiSelect
                        label={t(langKeys.advisor)}
                        className={classes.fieldsfilter}
                        variant="outlined"
                        onChange={(value) => {
                            setdataMainHeatMap((p) => ({
                                ...p,
                                closedby: value.map((o: Dictionary) => o.domainvalue).join(),
                            }));
                        }}
                        valueDefault={dataMainHeatMap.closedby}
                        data={dataAdvisor}
                        optionDesc="domaindesc"
                        optionValue="domainvalue"
                    />
                </div>
                <div style={{ flex: 1, paddingRight: 10 }}>
                    <FieldMultiSelect
                        label={t(langKeys.company)}
                        className={classes.fieldsfilter}
                        variant="outlined"
                        onChange={(value) => {
                            setdataMainHeatMap((p) => ({
                                ...p,
                                company: value.map((o: Dictionary) => o.domainvalue).join(),
                            }));
                        }}
                        valueDefault={dataMainHeatMap.company}
                        data={companydomain}
                        optionDesc="domaindesc"
                        optionValue="domainvalue"
                    />
                </div>
                <div style={{ flex: 1 }}>
                    <FieldMultiSelect
                        label={t(langKeys.group)}
                        className={classes.fieldsfilter}
                        variant="outlined"
                        onChange={(value) => {
                            setdataMainHeatMap((p) => ({
                                ...p,
                                group: value.map((o: Dictionary) => o.domainvalue).join(),
                            }));
                        }}
                        valueDefault={dataMainHeatMap.group}
                        data={groupsdomain}
                        optionDesc="domaindesc"
                        optionValue="domainvalue"
                    />
                </div>
                <div style={{ flex: 1, paddingLeft: 20 }}>
                    <Button
                        variant="contained"
                        color="primary"
                        style={{ width: "100%", backgroundColor: "#007bff" }}
                        onClick={() => search()}
                    >
                        {t(langKeys.search)}
                    </Button>
                </div>
            </div>
            {completadosxAsesorData.length ? (
                <div style={{ padding: 10 }}>
                    <TableZyx
                        columns={completadosxAsesorTitle}
                        titlemodule={t(langKeys.completadosxAsesor)}
                        data={completadosxAsesorData}
                        download={true}
                        loading={multiDataAux.loading}
                        pageSizeDefault={50}
                        filterGeneral={false}
                        ButtonsElement={() => (
                            <Button
                                variant="outlined"
                                color="primary"
                                onClick={() => {
                                    setOpenModalConfiguration(true);
                                    setTableName("completeconversations");
                                }}
                                startIcon={<TrafficIcon />}
                            >
                                {t(langKeys.configuration)}
                            </Button>
                        )}
                        triggerExportPersonalized={true}
                        exportPersonalized={() => {
                            exportexcelwithgradient(
                                t(langKeys.completadosxAsesor) + "Report",
                                completadosxAsesorData,
                                completadosxAsesorTitle.filter((x: Dictionary) => !x.isComponent && !x.activeOnHover),
                                dataTableConfig?.find((x) => x.report_name === "completeconversations")?.report_configuration ||
                                defaultNumberTableConfig,
                                "day",
                                "number",
                                multiData.data[1]?.data.length
                            );
                        }}
                        toolsFooter={false}
                        helperText={t(langKeys.notecompletedasesors)}
                    />
                </div>
            ) : (
                ""
            )}
            {abandonosxAsesorData.length ? (
                <div style={{ padding: 10 }}>
                    <TableZyx
                        columns={abandonosxAsesorTitle}
                        titlemodule={t(langKeys.abandonosxAsesor)}
                        data={abandonosxAsesorData}
                        download={true}
                        loading={multiDataAux.loading}
                        pageSizeDefault={50}
                        ButtonsElement={() => (
                            <Button
                                variant="outlined"
                                color="primary"
                                onClick={() => {
                                    setOpenModalConfiguration(true);
                                    setTableName("quantityabandonos");
                                }}
                                startIcon={<TrafficIcon />}
                            >
                                {t(langKeys.configuration)}
                            </Button>
                        )}
                        triggerExportPersonalized={true}
                        exportPersonalized={() => {
                            exportexcelwithgradient(
                                t(langKeys.abandonosxAsesor) + "Report",
                                abandonosxAsesorData,
                                abandonosxAsesorTitle.filter((x: Dictionary) => !x.isComponent && !x.activeOnHover),
                                dataTableConfig?.find((x) => x.report_name === "quantityabandonos")?.report_configuration ||
                                defaultNumberTableConfig,
                                "day",
                                "number",
                                multiData.data[1]?.data.length
                            );
                        }}
                        filterGeneral={false}
                        toolsFooter={false}
                        helperText={t(langKeys.noteabandonedasesors)}
                    />
                </div>
            ) : (
                ""
            )}
            {tasaAbandonosxAsesorData.length ? (
                <div style={{ padding: 10 }}>
                    <TableZyx
                        columns={tasaAbandonosxAsesorTitle}
                        titlemodule={t(langKeys.tasaAbandonosxAsesor)}
                        data={tasaAbandonosxAsesorData}
                        download={true}
                        loading={multiDataAux.loading}
                        pageSizeDefault={50}
                        ButtonsElement={() => (
                            <Button
                                variant="outlined"
                                color="primary"
                                onClick={() => {
                                    setOpenModalConfiguration(true);
                                    setTableName("tasaabandonos");
                                }}
                                startIcon={<TrafficIcon />}
                            >
                                {t(langKeys.configuration)}
                            </Button>
                        )}
                        triggerExportPersonalized={true}
                        exportPersonalized={() => {
                            exportexcelwithgradient(
                                t(langKeys.tasaAbandonosxAsesor) + "Report",
                                tasaAbandonosxAsesorData,
                                tasaAbandonosxAsesorTitle.filter((x: Dictionary) => !x.isComponent && !x.activeOnHover),
                                dataTableConfig?.find((x) => x.report_name === "tasaabandonos")?.report_configuration ||
                                defaultPercentageTableConfig,
                                "day",
                                "percentage"
                            );
                        }}
                        filterGeneral={false}
                        toolsFooter={false}
                        helperText={t(langKeys.tasaAbandonosxAsesortooltip)}
                    />
                </div>
            ) : (
                ""
            )}
            {cantidadOportunidadesData.length ? (
                <div style={{ padding: 10 }}>
                    <TableZyx
                        columns={cantidadOportunidadesTitle}
                        titlemodule={t(langKeys.oportunidadesxAsesor)}
                        data={cantidadOportunidadesData}
                        download={true}
                        loading={multiDataAux.loading}
                        pageSizeDefault={50}
                        filterGeneral={false}
                        ButtonsElement={() => (
                            <Button
                                variant="outlined"
                                color="primary"
                                onClick={() => {
                                    setOpenModalConfiguration(true);
                                    setTableName("quantityoportunities");
                                }}
                                startIcon={<TrafficIcon />}
                            >
                                {t(langKeys.configuration)}
                            </Button>
                        )}
                        triggerExportPersonalized={true}
                        exportPersonalized={() => {
                            exportexcelwithgradient(
                                t(langKeys.oportunidadesxAsesor) + " Report",
                                cantidadOportunidadesData,
                                cantidadOportunidadesTitle.filter((x: Dictionary) => !x.isComponent && !x.activeOnHover),
                                dataTableConfig?.find((x) => x.report_name === "quantityoportunities")?.report_configuration ||
                                defaultNumberTableConfig,
                                "day",
                                "number",
                                multiData.data[1]?.data.length
                            );
                        }}
                        toolsFooter={false}
                        helperText={t(langKeys.oportunidadesxAsesortooltip)}
                    />
                </div>
            ) : (
                ""
            )}
            {tasaOportunidadesData.length ? (
                <div style={{ padding: 10 }}>
                    <TableZyx
                        columns={tasaOportunidadesTitle}
                        titlemodule={t(langKeys.tasaOportunidades)}
                        data={tasaOportunidadesData}
                        download={true}
                        loading={multiDataAux.loading}
                        pageSizeDefault={50}
                        ButtonsElement={() => (
                            <Button
                                variant="outlined"
                                color="primary"
                                onClick={() => {
                                    setOpenModalConfiguration(true);
                                    setTableName("tasaoportunities");
                                }}
                                startIcon={<TrafficIcon />}
                            >
                                {t(langKeys.configuration)}
                            </Button>
                        )}
                        triggerExportPersonalized={true}
                        exportPersonalized={() => {
                            exportexcelwithgradient(
                                t(langKeys.tasaOportunidades) + "Report",
                                tasaOportunidadesData,
                                tasaOportunidadesTitle.filter((x: Dictionary) => !x.isComponent && !x.activeOnHover),
                                dataTableConfig?.find((x) => x.report_name === "tasaoportunities")?.report_configuration ||
                                defaultPercentageTableConfig,
                                "day",
                                "percentage"
                            );
                        }}
                        filterGeneral={false}
                        toolsFooter={false}
                        helperText={t(langKeys.tasaOportunidadestooltip)}
                    />
                </div>
            ) : (
                ""
            )}

            {ventasxAsesorData.length ? (
                <div style={{ padding: 10 }}>
                    <TableZyx
                        columns={ventasxAsesorTitle}
                        titlemodule={t(langKeys.ventasxAsesor)}
                        data={ventasxAsesorData}
                        download={true}
                        loading={multiDataAux.loading}
                        pageSizeDefault={50}
                        ButtonsElement={() => (
                            <Button
                                variant="outlined"
                                color="primary"
                                onClick={() => {
                                    setOpenModalConfiguration(true);
                                    setTableName("quantityventas");
                                }}
                                startIcon={<TrafficIcon />}
                            >
                                {t(langKeys.configuration)}
                            </Button>
                        )}
                        triggerExportPersonalized={true}
                        exportPersonalized={() => {
                            exportexcelwithgradient(
                                t(langKeys.ventasxAsesor) + " Report",
                                ventasxAsesorData,
                                ventasxAsesorTitle.filter((x: Dictionary) => !x.isComponent && !x.activeOnHover),
                                dataTableConfig?.find((x) => x.report_name === "quantityventas")?.report_configuration ||
                                defaultNumberTableConfig,
                                "day",
                                "number",
                                multiData.data[1]?.data.length
                            );
                        }}
                        filterGeneral={false}
                        toolsFooter={false}
                        helperText={t(langKeys.ventasxAsesortooltip)}
                    />
                </div>
            ) : (
                ""
            )}
            {efectividadxAsesorData.length ? (
                <div style={{ padding: 10 }}>
                    <TableZyx
                        columns={typeEfectiveness ? efectividadxAsesorTitle : efectividadxAsesorOportunidadTitle}
                        titlemodule={t(langKeys.efectividadxAsesor)}
                        data={typeEfectiveness ? efectividadxAsesorData : efectividadxAsesorOportunidadData}
                        download={true}
                        pageSizeDefault={50}
                        loading={multiDataAux.loading}
                        filterGeneral={false}
                        toolsFooter={false}
                        helperText={t(langKeys.efectividadxAsesortooltip)}
                        triggerExportPersonalized={true}
                        exportPersonalized={() => {
                            exportexcelwithgradient(
                                t(langKeys.efectividadxAsesor) + "Report",
                                (typeEfectiveness ? efectividadxAsesorData : efectividadxAsesorOportunidadData),
                                (typeEfectiveness ? efectividadxAsesorTitle : efectividadxAsesorOportunidadTitle).filter((x: Dictionary) => !x.isComponent && !x.activeOnHover),
                                dataTableConfig?.find((x) => x.report_name === "tasaventasporasesor")?.report_configuration ||
                                    [],
                                "day",
                                "percentage"
                            );
                        }}
                        ButtonsElement={() => (
                            <>
                                <TemplateSwitchYesNo
                                    valueDefault={typeEfectiveness}
                                    onChange={(value) => settypeEfectiveness(value)}
                                    textYes={t(langKeys.ticketbase)}
                                    textNo={t(langKeys.oportunitybase)}
                                    labelPlacement="start"
                                    style={{ padding: 10 }}
                                />
                                <Button
                                    variant="outlined"
                                    color="primary"
                                    onClick={() => {
                                        setOpenModalConfiguration(true);
                                        setTableName("tasaventasporasesor");
                                    }}
                                    startIcon={<TrafficIcon />}
                                >
                                    {t(langKeys.configuration)}
                                </Button>
                            </>
                        )}
                    />
                </div>
            ) : (
                ""
            )}
            <ModalHeatMap
                openModal={openModal}
                setOpenModal={setOpenModal}
                title={modalTitle}
                columns={modalColumns}
                data={mainAux?.data || []}
            />
            <DialogInteractions openModal={openModalTicket} setOpenModal={setOpenModalTicket} ticket={rowSelected} />
        </div>
    );
};

const HeatMapTicket: React.FC<{
    dataChannels: Dictionary[];
    setOpenModalConfiguration: (dat: boolean) => void;
    setTableName: (d: string) => void;
    dataTableConfig: Dictionary[];
}> = ({ dataChannels, setOpenModalConfiguration, setTableName, dataTableConfig }) => {
    const { t } = useTranslation();
    const classes = useStyles();
    const dispatch = useDispatch();
    const multiData = useSelector((state) => state.main.multiData);
    const multiDataAux = useSelector((state) => state.main.multiDataAux);
    const multiDataAux2 = useSelector((state) => state.main.multiDataAux2);
    const [realizedsearch, setrealizedsearch] = useState(false);
    const [asesoresConectadosData, setasesoresConectadosData] = useState<Dictionary[]>([]);
    const [asesoresConectadosTitle, setasesoresConectadosTitle] = useState<Dictionary>([]);
    const [dataMainHeatMap, setdataMainHeatMap] = useState({
        communicationchannel: "",
        startdate: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
        enddate: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0),
        datetoshow: `${new Date(new Date().setDate(1)).getFullYear()}-${String(
            new Date(new Date().setDate(1)).getMonth() + 1
        ).padStart(2, "0")}`,
    });

    const [waitDetail, setWaitDetail] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const [modalTitle, setModalTitle] = useState("");
    const [modalColumns, setModalColumns] = useState<Dictionary[]>([]);
    const fetchDetail = (grid: string, column: Dictionary, row: Dictionary, mes: number, year: number) => {
        if (typeof row[column.id] === "number" && row[column.id] > 0) {
            const day = column.id.replace("day", "");
            const hour = row.hour - 1;
            const hournum = row.hournum.replace("a", "-");
            switch (grid) {
                case "3.1":
                    setModalTitle(`${t(langKeys.agent_plural)} ${t(langKeys.day)} ${day} ${hournum}`);
                    setModalColumns([
                        { Header: t(langKeys.agent), accessor: "asesor" },
                        { Header: t(langKeys.channel), accessor: "channel" },
                    ]);
                    break;
                default:
                    break;
            }
            dispatch(
                getMultiCollectionAux2([
                    heatmappage3detail({
                        ...dataMainHeatMap,
                        startdate: new Date(year, mes - 1, day),
                        enddate: new Date(year, mes - 1, day),
                        horanum: row.hournum === "TOTAL" ? "" : hour,
                    }),
                ])
            );
            dispatch(showBackdrop(true));
            setWaitDetail(true);
        }
    };

    useEffect(() => {
        if (waitDetail) {
            if (!multiDataAux2.loading) {
                dispatch(showBackdrop(false));
                setWaitDetail(false);
                setOpenModal(true);
            }
        }
    }, [multiDataAux2]);

    useEffect(() => {
        if (!multiDataAux.loading) {
            search();
        }
    }, [multiDataAux]);

    useEffect(() => {
        if (!multiData.loading && realizedsearch) {
            setrealizedsearch(false);
            dispatch(showBackdrop(false));
            if (multiData.data[0].key === "UFN_REPORT_HEATMAP_ASESORESCONECTADOS_SEL") {
                initAsesoresConectadosGrid(multiData.data[0]?.data || []);
            } else {
                initAsesoresConectadosGrid([]);
            }
        }
    }, [multiData, realizedsearch]);

    function search() {
        if (dataMainHeatMap.datetoshow === "") {
            dispatch(showSnackbar({ show: true, severity: "error", message: t(langKeys.date_format_error) }));
        } else {
            setasesoresConectadosData([]);
            setrealizedsearch(true);
            dispatch(showBackdrop(true));
            dispatch(getMultiCollection([heatmappage3(dataMainHeatMap)]));
        }
    }

    function handleDateChange(e: string) {
        if (e === "") {
            setdataMainHeatMap((prev) => ({ ...prev, datetoshow: e }));
        } else {
            const year = Number(e.split("-")[0]);
            const mes = Number(e.split("-")[1]);
            const startdate = new Date(year, mes - 1, 1);
            const enddate = new Date(year, mes, 0);
            setdataMainHeatMap((prev) => ({ ...prev, startdate, enddate, datetoshow: e }));
        }
    }

    function initAsesoresConectadosGrid(data: Dictionary[]) {
        let arrayfree: Dictionary[] = [];
        const mes = dataMainHeatMap.startdate?.getMonth() + 1;
        const year = dataMainHeatMap.startdate?.getFullYear();
        let rowmax = 0;
        const dateend = new Date(year, mes, 0).getDate();

        const LIMITHOUR = 24;
        for (let i = 1; i <= LIMITHOUR; i++) {
            const objectfree: Dictionary = {
                hour: i,
                hournum: hours[i - 1],
            };
            for (let j = 1; j <= dateend; j++) {
                objectfree[`day${j}`] = 0;
            }
            arrayfree.push(objectfree);
        }

        data.forEach((row: Dictionary) => {
            const day = parseInt(row.fecha.split("-")[2]);
            const hour = row.hora;
            arrayfree = arrayfree.map((x: Dictionary) => (x.hournum === hour ? { ...x, [`day${day}`]: row.value } : x));
            rowmax = row.value > rowmax ? row.value : rowmax;
        });

        function gradient(num: number) {
            const rules =
                dataTableConfig?.find((x) => x.report_name === "asesorsatleastone")?.report_configuration || defaultNumberTableConfig;
            for (const item of rules) {
                if (num >= item.min && num < item.max) {
                    return item.color;
                }
            }
            return "#ffffff";
        }
        setasesoresConectadosData(arrayfree);

        const arraytemplate =
            arrayfree.length > 0
                ? Object.entries(arrayfree[0])
                      .filter(([key]) => !/hour|horanum/gi.test(key))
                      .map(([key]) => ({
                          Header: `${key.split("day")[1]}/${mes}`,
                          accessor: key,
                          NoFilter: true,
                          NoSort: true,
                          Cell: (props: Dictionary) => {
                              const column = props.cell.column;
                              const row = props.cell.row.original || {};
                              const color = gradient(props.cell.row.original[key]);
                              return (
                                  <div
                                      style={{ background: `${color}`, textAlign: "center", color: "black" }}
                                      onClick={() => fetchDetail("3.1", column, row, mes, year)}
                                  >
                                      {props.cell.row.original[key]}
                                  </div>
                              );
                          },
                      }))
                : [];

        setasesoresConectadosTitle([
            {
                Header: `Hora`,
                accessor: "hournum",
                NoFilter: true,
                NoSort: true,
            },
            ...arraytemplate,
        ]);
    }

    return (
        <div>
            <div style={{ width: "100%", display: "flex", paddingTop: 10 }}>
                <div style={{ flex: 1, paddingRight: "10px" }}>
                    <TextField
                        id="date"
                        className={classes.fieldsfilter}
                        type="month"
                        variant="outlined"
                        onChange={(e) => handleDateChange(e.target.value)}
                        value={dataMainHeatMap.datetoshow}
                        size="small"
                    />
                </div>
                <div style={{ flex: 1, paddingRight: 10 }}>
                    <FieldSelect
                        label={t(langKeys.channel)}
                        className={classes.fieldsfilter}
                        variant="outlined"
                        onChange={(value) => {
                            setdataMainHeatMap((p) => ({
                                ...p,
                                communicationchannel: value?.typedesc || "",
                            }));
                        }}
                        valueDefault={dataMainHeatMap.communicationchannel}
                        data={dataChannels}
                        optionDesc="type"
                        optionValue="typedesc"
                    />
                </div>
                <div style={{ flex: 1, paddingLeft: 20 }}>
                    <Button
                        variant="contained"
                        color="primary"
                        style={{ width: "100%", backgroundColor: "#007bff" }}
                        onClick={() => search()}
                    >
                        {t(langKeys.search)}
                    </Button>
                </div>
            </div>
            {asesoresConectadosData.length ? (
                <div style={{ padding: 10 }}>
                    <TableZyx
                        titlemodule={t(langKeys.heatmaptickettable)}
                        helperText={t(langKeys.heatmaptickettable_help)}
                        columns={asesoresConectadosTitle}
                        data={asesoresConectadosData}
                        download={true}
                        loading={multiDataAux.loading}
                        pageSizeDefault={50}
                        triggerExportPersonalized={true}
                        exportPersonalized={() => {
                            exportexcelwithgradient(
                                t(langKeys.heatmaptickettable) + " Report",
                                asesoresConectadosData,
                                asesoresConectadosTitle.filter((x: Dictionary) => !x.isComponent && !x.activeOnHover),
                                dataTableConfig?.find((x) => x.report_name === "asesorsatleastone")?.report_configuration ||
                                defaultNumberTableConfig,
                                "day",
                                "number",
                            );
                        }}
                        ButtonsElement={() => (
                            <Button
                                variant="outlined"
                                color="primary"
                                onClick={() => {
                                    setOpenModalConfiguration(true);
                                    setTableName("asesorsatleastone");
                                }}
                                startIcon={<TrafficIcon />}
                            >
                                {t(langKeys.configuration)}
                            </Button>
                        )}
                        filterGeneral={false}
                        toolsFooter={false}
                    />
                </div>
            ) : (
                ""
            )}
            <ModalHeatMap
                openModal={openModal}
                setOpenModal={setOpenModal}
                title={modalTitle}
                columns={modalColumns}
                data={multiDataAux2.data[0]?.data || []}
            />
        </div>
    );
};

const ConfigurationModalNumber: React.FC<{
    openModal: boolean;
    setOpenModal: (b: boolean) => void;
    reportname: string;
    filterData: Dictionary[];
    SetFilterData: (a: Dictionary[]) => void;
    data: Dictionary[];
    setData: (a: Dictionary[]) => void;
}> = ({ openModal, setOpenModal, reportname, filterData, SetFilterData, data, setData }) => {
    const colorgroup = ["#47FF47", "#FFFF00", "#FF0000"];
    const { t } = useTranslation();
    const classes = useStyles();
    const dispatch = useDispatch();
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
    const [errors, setErrors] = useState<Dictionary>([]);

    function changeData(index: number, key: string, value: string | number) {
        const newData = [...data];
        newData[index] = {
            ...newData[index],
            [key]: value,
        };
        if (key === "min" && index !== 0) {
            newData[index - 1] = {
                ...newData[index - 1],
                max: value,
            };
        }
        if (key === "max" && index !== newData.length - 1) {
            newData[index + 1] = {
                ...newData[index + 1],
                min: value,
            };
        }
        setData(newData);
    }

    function handlesubmit() {
        let noErrors = true;
        const auxErrors: Dictionary[] = [];
        data.forEach((x) => {
            let errormessagemin = "";
            let errormessagemax = "";
            if (x.min > x.max) {
                errormessagemin = t(langKeys.minhighermaxerror);
                errormessagemax = t(langKeys.maxlowerminerror);
                noErrors = false;
            }
            auxErrors.push({
                min: errormessagemin,
                max: errormessagemax,
            });
        });
        setErrors(auxErrors);

        if (noErrors) {
            setOpenModal(false);
            const auxdata = filterData;
            const foundregister = auxdata.find((x) => x.report_name === reportname);
            if (foundregister) {
                foundregister.report_configuration = data;
            } else {
                auxdata.push({
                    report_name: reportname,
                    report_configuration: data,
                });
            }
            SetFilterData(auxdata);
            dispatch(execute(heatmapConfigIns({ reportname, configuration: data })));
            setErrors([]);
        }
    }

    return (
        <DialogZyx
            open={openModal}
            title={t(langKeys.trafficlightconfig)}
            buttonText1={t(langKeys.close)}
            buttonText2={t(langKeys.refresh)}
            handleClickButton1={() => {
                setOpenModal(false);
                setErrors([]);
            }}
            handleClickButton2={() => handlesubmit()}
            maxWidth="md"
        >
            <div className="row-zyx">
                <div>{t(langKeys.colorandlimitsettings)}</div>
                <div>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Color</TableCell>
                                {data.map((x, i) => {
                                    return (
                                        <TableCell
                                            key={`color-${i}`}
                                            style={{ textAlign: "center", position: "relative" }}
                                            onMouseEnter={() => setHoveredIndex(i)}
                                            onMouseLeave={() => setHoveredIndex(null)}
                                        >
                                            {hoveredIndex === i && (
                                                <IconButton
                                                    onClick={() => {
                                                        const auxData = data;
                                                        setData([...auxData.slice(0, i), ...auxData.slice(i + 1)]);
                                                    }}
                                                    style={{ position: "absolute", top: 0, left: "50%" }}
                                                >
                                                    <DeleteIcon />
                                                </IconButton>
                                            )}

                                            <div
                                                style={{
                                                    display: "flex",
                                                    justifyContent: "center",
                                                    alignItems: "center",
                                                }}
                                            >
                                                <ColorInputCircular
                                                    hex={x.color}
                                                    onChange={(e) => {
                                                        changeData(i, "color", e.hex);
                                                    }}
                                                />
                                            </div>
                                        </TableCell>
                                    );
                                })}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            <TableRow>
                                <TableCell>
                                    {t("number")} {t(langKeys.function_minimum)}
                                    <Tooltip
                                        title={<div style={{ fontSize: 12 }}>{t(`${"number"}minimun_helper`)}</div>}
                                        arrow
                                        placement="top"
                                    >
                                        <InfoRoundedIcon color="action" className={classes.iconHelpText} />
                                    </Tooltip>
                                </TableCell>
                                {data.map((x, i) => {
                                    return (
                                        <TableCell key={`min-${i}`}>
                                            <TextField
                                                type={"number"}
                                                value={x.min}
                                                style={{ width: "100%" }}
                                                error={Boolean(errors?.[i]?.min)}
                                                helperText={errors?.[i]?.min}
                                                onChange={(e) => {
                                                    changeData(i, "min", Number(e?.target?.value || "0"));
                                                }}
                                            />
                                        </TableCell>
                                    );
                                })}
                            </TableRow>
                            <TableRow>
                                <TableCell>
                                    {t("number")} {t(langKeys.function_maximum)}{" "}
                                    <Tooltip
                                        title={<div style={{ fontSize: 12 }}>{t(`${"number"}maximum_helper`)}</div>}
                                        arrow
                                        placement="top"
                                    >
                                        <InfoRoundedIcon color="action" className={classes.iconHelpText} />
                                    </Tooltip>
                                </TableCell>
                                {data.map((x, i) => {
                                    return (
                                        <TableCell key={`max-${i}`}>
                                            <TextField
                                                type={"number"}
                                                value={x.max}
                                                error={Boolean(errors?.[i]?.max)}
                                                helperText={errors?.[i]?.max}
                                                style={{ width: "100%" }}
                                                onChange={(e) => {
                                                    changeData(i, "max", Number(e?.target?.value || "0"));
                                                }}
                                            />
                                        </TableCell>
                                    );
                                })}
                            </TableRow>
                        </TableBody>
                    </Table>
                </div>

                <Button
                    variant="outlined"
                    color="primary"
                    disabled={data.length >= 10}
                    onClick={() => {
                        const lastitem = data.length - 1;
                        setData([
                            ...data,
                            {
                                color: colorgroup[lastitem + 1] || "#FFFFFF",
                                min: data?.[lastitem]?.max || 0,
                                max: (data?.[lastitem]?.max || 0) + 5,
                            },
                        ]);
                    }}
                    style={{ marginTop: 65 }}
                    startIcon={<AddIcon />}
                >
                    {t(langKeys.addsection)}
                </Button>
            </div>
        </DialogZyx>
    );
};
const ConfigurationModalTime: React.FC<{
    openModal: boolean;
    setOpenModal: (b: boolean) => void;
    reportname: string;
    filterData: Dictionary[];
    SetFilterData: (a: Dictionary[]) => void;
    data: Dictionary[];
    setData: (a: Dictionary[]) => void;
}> = ({ openModal, setOpenModal, reportname, filterData, SetFilterData, data, setData }) => {
    const colorgroup = ["#47FF47", "#FFFF00", "#FF0000"];
    const { t } = useTranslation();
    const classes = useStyles();
    const dispatch = useDispatch();
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
    const [errors, setErrors] = useState<Dictionary>([]);

    function changeData(index: number, key: string, value: string | number) {
        const newData = [...data];
        newData[index] = {
            ...newData[index],
            [key]: value,
        };
        if (key === "min" && index !== 0) {
            newData[index - 1] = {
                ...newData[index - 1],
                max: value,
            };
        }
        if (key === "max" && index !== newData.length - 1) {
            newData[index + 1] = {
                ...newData[index + 1],
                min: value,
            };
        }
        setData(newData);
    }
    const validateInput = (value:string) => {
        const regex = /^(\d+h)?(\d+m)?(\d+s)?$/;
        return regex.test(value);
    };

    function handlesubmit() {
        let noErrors = true;
        const auxErrors: Dictionary[] = [];
        data.forEach((x) => {
            let errormessagemin = "";
            let errormessagemax = "";
            if (!validateInput(x.min) || !validateInput(x.max)) {
                errormessagemin = !validateInput(x.min) ? t(langKeys.invalid_data) : "";
                errormessagemax = !validateInput(x.max) ? t(langKeys.invalid_data) : "";
                noErrors = false;
            }
            if (noErrors && timetonumber(x.min) > timetonumber(x.max)) {
                errormessagemin = t(langKeys.minhighermaxerror);
                errormessagemax = t(langKeys.maxlowerminerror);
                noErrors = false;
            }
            auxErrors.push({
                min: errormessagemin,
                max: errormessagemax,
            });
        });
        setErrors(auxErrors);
        if (noErrors) {
            setOpenModal(false);
            const auxdata = filterData;
            const foundregister = auxdata.find((x) => x.report_name === reportname);
            if (foundregister) {
                foundregister.report_configuration = data;
            } else {
                auxdata.push({
                    report_name: reportname,
                    report_configuration: data,
                });
            }
            SetFilterData(auxdata);
            dispatch(execute(heatmapConfigIns({ reportname, configuration: data })));
            setErrors([]);
        }
    }

    return (
        <DialogZyx
            open={openModal}
            title={t(langKeys.trafficlightconfig)}
            buttonText1={t(langKeys.close)}
            buttonText2={t(langKeys.refresh)}
            handleClickButton1={() => {
                setOpenModal(false);
                setErrors([]);
            }}
            handleClickButton2={() => handlesubmit()}
            maxWidth="md"
        >
            <div className="row-zyx">
                <div>{t(langKeys.colorandlimitsettings)}</div>
                <div>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Color</TableCell>
                                {data.map((x, i) => {
                                    return (
                                        <TableCell
                                            key={`color-${i}`}
                                            style={{ textAlign: "center", position: "relative" }}
                                            onMouseEnter={() => setHoveredIndex(i)}
                                            onMouseLeave={() => setHoveredIndex(null)}
                                        >
                                            {hoveredIndex === i && (
                                                <IconButton
                                                    onClick={() => {
                                                        const auxData = data;
                                                        setData([...auxData.slice(0, i), ...auxData.slice(i + 1)]);
                                                    }}
                                                    style={{ position: "absolute", top: 0, left: "50%" }}
                                                >
                                                    <DeleteIcon />
                                                </IconButton>
                                            )}

                                            <div
                                                style={{
                                                    display: "flex",
                                                    justifyContent: "center",
                                                    alignItems: "center",
                                                }}
                                            >
                                                <ColorInputCircular
                                                    hex={x.color}
                                                    onChange={(e) => {
                                                        changeData(i, "color", e.hex);
                                                    }}
                                                />
                                            </div>
                                        </TableCell>
                                    );
                                })}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            <TableRow>
                                <TableCell>
                                    {t("time")} {t(langKeys.function_minimum)}
                                    <Tooltip
                                        title={<div style={{ fontSize: 12 }}>{t(`${"time"}minimun_helper`)}</div>}
                                        arrow
                                        placement="top"
                                    >
                                        <InfoRoundedIcon color="action" className={classes.iconHelpText} />
                                    </Tooltip>
                                </TableCell>
                                {data.map((x, i) => {
                                    return (
                                        <TableCell key={`min-${i}`}>
                                            <TextField
                                                type={"string"}
                                                value={x.min}
                                                error={Boolean(errors?.[i]?.min)}
                                                helperText={errors?.[i]?.min}
                                                style={{ width: "100%" }}
                                                onChange={(e) => {
                                                    changeData(i, "min", e?.target?.value || "0");
                                                }}
                                            />
                                        </TableCell>
                                    );
                                })}
                            </TableRow>
                            <TableRow>
                                <TableCell>
                                    {t("time")} {t(langKeys.function_maximum)}{" "}
                                    <Tooltip
                                        title={<div style={{ fontSize: 12 }}>{t(`${"time"}maximum_helper`)}</div>}
                                        arrow
                                        placement="top"
                                    >
                                        <InfoRoundedIcon color="action" className={classes.iconHelpText} />
                                    </Tooltip>
                                </TableCell>
                                {data.map((x, i) => {
                                    return (
                                        <TableCell key={`max-${i}`}>
                                            <TextField
                                                type={"string"}
                                                value={x.max}
                                                error={Boolean(errors?.[i]?.max)}
                                                helperText={errors?.[i]?.max}
                                                style={{ width: "100%" }}
                                                onChange={(e) => {
                                                    changeData(i, "max", e?.target?.value || "0");
                                                }}
                                            />
                                        </TableCell>
                                    );
                                })}
                            </TableRow>
                        </TableBody>
                    </Table>
                </div>

                <Button
                    variant="outlined"
                    color="primary"
                    disabled={data.length >= 10}
                    onClick={() => {
                        const lastitem = data.length - 1;
                        setData([
                            ...data,
                            {
                                color: colorgroup[lastitem + 1] || "#FFFFFF",
                                min: data?.[lastitem]?.max || "0s",
                                max: numberToTime(timetonumber(data?.[lastitem]?.max || "0s") + 30),
                            },
                        ]);
                    }}
                    style={{ marginTop: 65 }}
                    startIcon={<AddIcon />}
                >
                    {t(langKeys.addsection)}
                </Button>
            </div>
        </DialogZyx>
    );
};
const ConfigurationModalPercentage: React.FC<{
    openModal: boolean;
    setOpenModal: (b: boolean) => void;
    reportname: string;
    filterData: Dictionary[];
    SetFilterData: (a: Dictionary[]) => void;
    data: Dictionary[];
    setData: (a: Dictionary[]) => void;
}> = ({ openModal, setOpenModal, reportname, filterData, SetFilterData, data, setData }) => {
    const colorgroup = ["#47FF47", "#FFFF00", "#FF0000"];
    const { t } = useTranslation();
    const classes = useStyles();
    const dispatch = useDispatch();
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
    const [errors, setErrors] = useState<Dictionary>([]);

    function changeData(index: number, key: string, value: string | number) {
        const newData = [...data];
        newData[index] = {
            ...newData[index],
            [key]: value,
        };
        if (key === "min" && index !== 0) {
            newData[index - 1] = {
                ...newData[index - 1],
                max: value,
            };
        }
        if (key === "max" && index !== newData.length - 1) {
            newData[index + 1] = {
                ...newData[index + 1],
                min: value,
            };
        }
        setData(newData);
    }

    function handlesubmit() {
        let noErrors = true;
        const auxErrors: Dictionary[] = [];
        data.forEach((x) => {
            let errormessagemin = "";
            let errormessagemax = "";
            if (x.min > x.max) {
                errormessagemin = t(langKeys.minhighermaxerror);
                errormessagemax = t(langKeys.maxlowerminerror);
                noErrors = false;
            }
            auxErrors.push({
                min: errormessagemin,
                max: errormessagemax,
            });
        });
        setErrors(auxErrors);

        if (noErrors) {
            setOpenModal(false);
            const auxdata = filterData;
            const foundregister = auxdata.find((x) => x.report_name === reportname);
            if (foundregister) {
                foundregister.report_configuration = data;
            } else {
                auxdata.push({
                    report_name: reportname,
                    report_configuration: data,
                });
            }
            SetFilterData(auxdata);
            dispatch(execute(heatmapConfigIns({ reportname, configuration: data })));
            setErrors([]);
        }
    }

    return (
        <DialogZyx
            open={openModal}
            title={t(langKeys.trafficlightconfig)}
            buttonText1={t(langKeys.close)}
            buttonText2={t(langKeys.refresh)}
            handleClickButton1={() => {
                setOpenModal(false);
                setErrors([]);
            }}
            handleClickButton2={() => handlesubmit()}
            maxWidth="md"
        >
            <div className="row-zyx">
                <div>{t(langKeys.colorandlimitsettings)}</div>
                <div>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Color</TableCell>
                                {data.map((x, i) => {
                                    return (
                                        <TableCell
                                            key={`color-${i}`}
                                            style={{ textAlign: "center", position: "relative" }}
                                            onMouseEnter={() => setHoveredIndex(i)}
                                            onMouseLeave={() => setHoveredIndex(null)}
                                        >
                                            {hoveredIndex === i && (
                                                <IconButton
                                                    onClick={() => {
                                                        const auxData = data;
                                                        setData([...auxData.slice(0, i), ...auxData.slice(i + 1)]);
                                                    }}
                                                    style={{ position: "absolute", top: 0, left: "50%" }}
                                                >
                                                    <DeleteIcon />
                                                </IconButton>
                                            )}

                                            <div
                                                style={{
                                                    display: "flex",
                                                    justifyContent: "center",
                                                    alignItems: "center",
                                                }}
                                            >
                                                <ColorInputCircular
                                                    hex={x.color}
                                                    onChange={(e) => {
                                                        changeData(i, "color", e.hex);
                                                    }}
                                                />
                                            </div>
                                        </TableCell>
                                    );
                                })}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            <TableRow>
                                <TableCell>
                                    {t(langKeys.percentage)} {t(langKeys.function_minimum)}
                                    <Tooltip
                                        title={<div style={{ fontSize: 12 }}>{t(`porcentageminimun_helper`)}</div>}
                                        arrow
                                        placement="top"
                                    >
                                        <InfoRoundedIcon color="action" className={classes.iconHelpText} />
                                    </Tooltip>
                                </TableCell>
                                {data.map((x, i) => {
                                    return (
                                        <TableCell key={`min-${i}`}>
                                            <TextField
                                                type={"number"}
                                                value={x.min}
                                                style={{ width: "100%" }}
                                                InputProps={{
                                                    endAdornment: <InputAdornment position="end">%</InputAdornment>,
                                                }}
                                                error={Boolean(errors?.[i]?.min)}
                                                helperText={errors?.[i]?.min}
                                                onChange={(e) => {
                                                    changeData(i, "min", Number(e?.target?.value || "0"));
                                                }}
                                            />
                                        </TableCell>
                                    );
                                })}
                            </TableRow>
                            <TableRow>
                                <TableCell>
                                    {t(langKeys.percentage)} {t(langKeys.function_maximum)}{" "}
                                    <Tooltip
                                        title={<div style={{ fontSize: 12 }}>{t(`porcentagemaximum_helper`)}</div>}
                                        arrow
                                        placement="top"
                                    >
                                        <InfoRoundedIcon color="action" className={classes.iconHelpText} />
                                    </Tooltip>
                                </TableCell>
                                {data.map((x, i) => {
                                    return (
                                        <TableCell key={`max-${i}`}>
                                            <TextField
                                                type={"number"}
                                                value={x.max}
                                                style={{ width: "100%" }}
                                                error={Boolean(errors?.[i]?.max)}
                                                helperText={errors?.[i]?.max}
                                                InputProps={{
                                                    endAdornment: <InputAdornment position="end">%</InputAdornment>,
                                                }}
                                                onChange={(e) => {
                                                    changeData(i, "max", Number(e?.target?.value || "0"));
                                                }}
                                            />
                                        </TableCell>
                                    );
                                })}
                            </TableRow>
                        </TableBody>
                    </Table>
                </div>

                <Button
                    variant="outlined"
                    color="primary"
                    disabled={data.length >= 10}
                    onClick={() => {
                        const lastitem = data.length - 1;
                        setData([
                            ...data,
                            {
                                color: colorgroup[lastitem + 1] || "#FFFFFF",
                                min: data?.[lastitem]?.max || 0,
                                max: (data?.[lastitem]?.max || 0) + 10,
                            },
                        ]);
                    }}
                    style={{ marginTop: 65 }}
                    startIcon={<AddIcon />}
                >
                    {t(langKeys.addsection)}
                </Button>
            </div>
        </DialogZyx>
    );
};
const ConfigurationModal: React.FC<{
    openModal: boolean;
    setOpenModal: (b: boolean) => void;
    reportname: string;
    filterData: Dictionary[];
    SetFilterData: (a: Dictionary[]) => void;
}> = ({ openModal, setOpenModal, reportname, filterData, SetFilterData }) => {
    const [data, setData] = useState<Dictionary[]>([]);
    const [typeData, setTypeData] = useState<string>("number");

    useEffect(() => {
        if (openModal) {
            switch (reportname) {
                case "averagetmo":
                case "averageagenttme":
                case "averagereplytimexfecha":
                case "averagereplytimexfechaclient":
                    setTypeData("time");
                    setData(filterData.find((x) => x.report_name === reportname)?.report_configuration || defaultTimeTableConfig);
                    break;
                case "tasaabandonos":
                case "tasaoportunities":
                case "tasaventasporasesor":
                    setTypeData("percentage");
                    setData(filterData.find((x) => x.report_name === reportname)?.report_configuration || defaultPercentageTableConfig);
                    break;
                case "conversations":
                case "completeconversations":
                case "quantityabandonos":
                case "quantityoportunities":
                case "quantityventas":
                case "asesorsatleastone":
                default:
                    setTypeData("number");
                    setData(filterData.find((x) => x.report_name === reportname)?.report_configuration || defaultNumberTableConfig);
            }
        }
    }, [filterData, reportname, openModal]);

    return (
        <>
            {typeData === "number" && (
                <ConfigurationModalNumber
                    openModal={openModal}
                    setOpenModal={setOpenModal}
                    reportname={reportname}
                    filterData={filterData}
                    SetFilterData={SetFilterData}
                    data={data}
                    setData={setData}
                />
            )}
            {typeData === "time" && (
                <ConfigurationModalTime
                    openModal={openModal}
                    setOpenModal={setOpenModal}
                    reportname={reportname}
                    filterData={filterData}
                    SetFilterData={SetFilterData}
                    data={data}
                    setData={setData}
                />
            )}
            {typeData === "percentage" && (
                <ConfigurationModalPercentage
                    openModal={openModal}
                    setOpenModal={setOpenModal}
                    reportname={reportname}
                    filterData={filterData}
                    SetFilterData={SetFilterData}
                    data={data}
                    setData={setData}
                />
            )}
        </>
    );
};
const Heatmap: FC = () => {
    const [pageSelected, setPageSelected] = useState(0);
    const [companydomain, setcompanydomain] = useState<Dictionary[]>([]);
    const [groupsdomain, setgroupsdomain] = useState<Dictionary[]>([]);
    const [dataChannels, setDataChannels] = useState<Dictionary[]>([]);
    const [dataTableConfig, setDataTableConfig] = useState<Dictionary[]>([]);
    const [openModalConfiguration, setOpenModalConfiguration] = useState(false);
    const [reportTableName, setReportTableName] = useState("");
    const multiDataAux = useSelector((state) => state.main.multiDataAux);
    const dispatch = useDispatch();
    useEffect(() => {
        if (!multiDataAux.loading) {
            setcompanydomain(multiDataAux.data[0]?.data || []);
            setgroupsdomain(multiDataAux.data[1]?.data || []);
            setDataChannels(multiDataAux.data[2]?.data || []);
            setDataTableConfig(multiDataAux.data[3]?.data || []);
        }
    }, [multiDataAux]);
    useEffect(() => {
        dispatch(
            getMultiCollectionAux([
                getValuesFromDomain("EMPRESA"),
                getValuesFromDomain("GRUPOS"),
                getCommChannelLstTypeDesc(),
                getHeatmapConfig(),
            ])
        );
        return () => {
            dispatch(resetMainAux());
            dispatch(resetMultiMain());
            dispatch(resetMultiMainAux());
            dispatch(resetMultiMainAux2());
        };
    }, []);
    const { t } = useTranslation();
    return (
        <Fragment>
            <Tabs
                value={pageSelected}
                indicatorColor="primary"
                variant="fullWidth"
                style={{ borderBottom: "1px solid #EBEAED", backgroundColor: "#FFF", marginTop: 8 }}
                textColor="primary"
                onChange={(_, value) => setPageSelected(value)}
            >
                <AntTab label={t(langKeys.heatmap)} />
                <AntTab label={t(langKeys.heatmapasesor)} />
                <AntTab label={t(langKeys.heatmapticket)} />
            </Tabs>
            {pageSelected === 0 && (
                <MainHeatMap
                    dataChannels={dataChannels}
                    setOpenModalConfiguration={setOpenModalConfiguration}
                    setTableName={setReportTableName}
                    dataTableConfig={dataTableConfig}
                />
            )}
            {pageSelected === 1 && (
                <HeatMapAsesor
                    dataChannels={dataChannels}
                    companydomain={companydomain}
                    groupsdomain={groupsdomain}
                    setOpenModalConfiguration={setOpenModalConfiguration}
                    setTableName={setReportTableName}
                    dataTableConfig={dataTableConfig}
                />
            )}
            {pageSelected === 2 && (
                <HeatMapTicket
                    dataChannels={dataChannels}
                    setOpenModalConfiguration={setOpenModalConfiguration}
                    setTableName={setReportTableName}
                    dataTableConfig={dataTableConfig}
                />
            )}
            <ConfigurationModal
                openModal={openModalConfiguration}
                setOpenModal={setOpenModalConfiguration}
                reportname={reportTableName}
                filterData={dataTableConfig}
                SetFilterData={setDataTableConfig}
            />
        </Fragment>
    );
};

export default Heatmap;
