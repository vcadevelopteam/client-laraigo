import { Box, Grid, makeStyles } from "@material-ui/core";
import { IPerson, IPersonConversation } from "@types";
import { getTicketListByPersonBody } from "common/helpers";
import { useSelector } from "hooks";
import { langKeys } from "lang/keys";
import { FC, useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { getTicketListByPerson, resetGetTicketListByPerson } from "store/person/actions";
import { showSnackbar } from "store/popus/actions";
import { ConversationItem } from "./ConversationItem";
import { FieldEdit, FieldSelect } from "components";

const useConversationsTabStyles = makeStyles(theme => ({
    root: {
        height: '100%',
    },
    root2: {
        padding: '2px 4px',
        display: 'flex',
        alignItems: 'center',
        height: 35,
        border: '1px solid #EBEAED',
        backgroundColor: '#F9F9FA',
    },
    containerFilterGeneral: {
        display: 'flex',
        justifyContent: 'space-between',
        backgroundColor: '#f9f9fa',
        padding: `${theme.spacing(2)}px`,
    },
    containerSearch: {
        width: '100%',
        [theme.breakpoints.up('sm')]: {
            width: '50%',
        },
    },
    iconButton: {
        padding: 4,
    },
    input: {
        marginLeft: theme.spacing(1),
        flex: 1,
    },
    inputPlaceholder: {
        '&::placeholder': {
            fontSize: 14,
            fontWeight: 500,
            color: '#84818A',
        },
    },
}));

interface ConversationsTabProps {
    person: IPerson;
}

export const ConversationsTab: FC<ConversationsTabProps> = ({ person }) => {
    const { t } = useTranslation();
    const classes = useConversationsTabStyles();
    const dispatch = useDispatch();
    const firstCall = useRef(true);
    const [page, setPage] = useState(0);
    const [channelTypeList, setChannelTypeList] = useState<any>([]);
    const [filters, setFilters] = useState({
        channeltype: "all",
        ticketnum: "",
        asesorfinal: "",
        fechainicio: null,
        fechafin: null,
    });
    const [list, setList] = useState<IPersonConversation[]>([]);
    const [filteredlist, setfilteredList] = useState<IPersonConversation[]>([]);
    const conversations = useSelector(state => state.person.personTicketList);

    const fetchTickets = useCallback(() => {
        if (person.personid && person.personid !== 0) {
            const params = {
                filters: {},
                sorts: {},
                take: 20,
                skip: 20 * page,
                offset: 0,
            };
            dispatch(getTicketListByPerson(getTicketListByPersonBody(person.personid, params)))
        }
    }, [page, person, dispatch]);

    useEffect(() => {
        const uniqueChannelTypes = [...new Set(list.map(item => item.channeltype))];

        const newList = uniqueChannelTypes.map(channel => ({
            val: channel,
            name: channel
        }));
        setChannelTypeList([
            { name: t(langKeys.all), val: "all" },
            ...newList
        ])
    }, [list]);

    useEffect(() => {
        return () => {
            dispatch(resetGetTicketListByPerson());
        };
    }, [dispatch]);

    useEffect(() => {
        const myDiv = document.getElementById("wrapped-tabpanel-2");
        if (myDiv) {
            myDiv.onscroll = () => {
                if (!firstCall.current && list.length >= conversations.count) return;
                if (conversations.loading) return;
                if (myDiv.offsetHeight + myDiv.scrollTop + 1 >= myDiv.scrollHeight) {
                    setPage(prevPage => prevPage + 1);
                }
            };
        }
    }, [list, conversations, setPage]);

    useEffect(() => {
        fetchTickets();
    }, [fetchTickets]);

    useEffect(() => {
        if (firstCall.current) firstCall.current = false;
        if (conversations.loading) return;
        if (conversations.error === true) {
            dispatch(showSnackbar({
                message: conversations.message || 'Error',
                show: true,
                severity: "error"
            }));
        } else {
            setList(prevList => [...prevList, ...conversations.data]);
            setfilteredList(prevList => [...prevList, ...conversations.data]);
        }
    }, [conversations, setList, dispatch]);

    useEffect(() => {
        var newArray = list.filter(function (el) {
            return el.ticketnum.includes(filters.ticketnum) &&
                el.asesorfinal.toLowerCase().includes(filters.asesorfinal.toLowerCase()) &&
                (filters.channeltype === "all" || el.channeldesc.toLowerCase().includes(filters.channeltype.toLowerCase())) &&
                el.fechainicio.includes(filters?.fechainicio||"") &&
                el.fechafin.includes(filters?.fechafin||"")
        });
        setfilteredList(newArray)
    }, [filters]);

    return (
        <div className={classes.root}>
            {list.length > 0 &&
                <Box className={classes.containerFilterGeneral}>
                </Box>
            }
            <Grid container direction="row">

                <Grid item xs={12} sm={12} md={3} lg={3} xl={3} style={{ justifyContent: "center", alignItems: "center", display: "flex" }}>
                    <FieldSelect style={{ minWidth: 110 }} label={t(langKeys.channel)} data={channelTypeList}
                        onChange={(e) => {
                            setFilters((prev) => ({
                                ...prev,
                                channeltype: e.val
                            }))
                        }}
                        valueDefault={filters.channeltype}
                        optionValue={"val"}
                        optionDesc={"name"}
                    />
                </Grid>
                <Grid item xs={12} sm={12} md={2} lg={2} xl={2} style={{ justifyContent: "start", alignItems: "center", display: "flex" }}>
                    <FieldEdit 
                        label="Ticket #"
                        style={{paddingRight: 20}}
                        valueDefault={filters.ticketnum}
                        onChange={(e) => {
                            setFilters((prev) => ({
                                ...prev,
                                ticketnum: e
                            }))
                        }}
                    />
                </Grid>
                <Grid item xs={12} sm={12} md={2} lg={2} xl={2} style={{ justifyContent: "start", alignItems: "center", display: "flex" }}>
                    <FieldEdit 
                        label={t(langKeys.agent)}
                        style={{paddingRight: 20}}
                        valueDefault={filters.asesorfinal}
                        onChange={(e) => {
                            setFilters((prev) => ({
                                ...prev,
                                asesorfinal: e
                            }))
                        }}
                    />
                </Grid>
                <Grid item xs={12} sm={12} md={2} lg={2} xl={2} style={{ justifyContent: "start", alignItems: "center", display: "flex" }}>
                    <FieldEdit 
                        label={t(langKeys.startdate)}
                        style={{paddingRight: 20}}
                        type="date"
                        valueDefault={filters.fechainicio}
                        onChange={(e) => {
                            setFilters((prev) => ({
                                ...prev,
                                fechainicio: e
                            }))
                        }}
                    />
                </Grid>
                <Grid item xs={12} sm={12} md={2} lg={2} xl={2} style={{ justifyContent: "start", alignItems: "center", display: "flex" }}>
                    <FieldEdit 
                        label={t(langKeys.enddate)}
                        style={{paddingRight: 20}}
                        type="date"
                        valueDefault={filters.fechafin}
                        onChange={(e) => {
                            setFilters((prev) => ({
                                ...prev,
                                fechafin: e
                            }))
                        }}
                    />
                </Grid>
                <Grid item xs={12} sm={12} md={1} lg={1} xl={1}>
                </Grid>
            </Grid>
            {filteredlist.map((e, i) => {
                if (filteredlist.length < conversations.count && i === filteredlist.length - 1) {
                    return [
                        <ConversationItem conversation={e} key={`conversation_item_${i}`} person={person} />,
                        <div
                            style={{ width: 'inherit', display: 'flex', justifyContent: 'center' }}
                            key={`conversation_item_${i}_loader`}
                        >
                        </div>
                    ];
                }
                return <ConversationItem conversation={e} key={`conversation_item_${i}`} person={person} />;
            })}
        </div>
    );
}