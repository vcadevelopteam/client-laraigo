import React, { useState, useEffect } from 'react'; // we need this to make JSX compile
import { useSelector } from 'hooks';
import { useDispatch } from 'react-redux';
import { getCollection } from 'store/main/actions';

import { langKeys } from 'lang/keys';
import { useTranslation } from 'react-i18next';
import { DialogZyx } from 'components';
import { Dictionary, IAgent } from "@types";
import { Accordion, AccordionDetails, AccordionSummary, Typography } from '@material-ui/core';
import { ExpandMore } from '@material-ui/icons';
import { getTicketsByGroups } from 'common/helpers';

const DialogViewGroups: React.FC<{ setOpenModal: (param: boolean) => void, openModal: boolean }> = ({ setOpenModal, openModal }) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const result = useSelector(state => state.main.mainData);
    const multi = useSelector(state => state.main.multiData);
    const [dataGroups, setDataGroups] = useState<Dictionary[]>([]);
    const [groups, setGroups] = useState<Dictionary[]>([])
    const [groupsTemp, setGroupsTemp] = useState<Dictionary[]>([])
    const [totalUser, setTotalUser] = useState<{ holding: number, bot: number }>({ holding: 0, bot: 0 });
    const agentList = useSelector(state => state.inbox.agentList);

    useEffect(() => {
        
        if (!multi.error && !multi.loading) {
            const groups = multi.data.find(x => x.key === "UFN_DOMAIN_BY_DOMAINNAME_GRUPOS")
            if (groups) {
                setGroupsTemp([...groups.data, { domainvalue: "", agents: [] }]);
            }
        }
    }, [multi])

    useEffect(() => {
        const agents = (agentList.data || []).filter(x => x.status === "ACTIVO" && x.userid !== 2 && x.userid !== 3);
        setGroups(
            [
                ...groupsTemp.map(x => ({
                    ...x,
                    agents: agents.filter(y => y.status === "ACTIVO" && (y.groups || "").split(",").includes(x.domainvalue)),
                })),
            ]
        );
    }, [agentList, groupsTemp])

    useEffect(() => {
        if (!result.error && !result.loading && result.key === "UFN_GROUPSBYBOT_SEL") {
            setDataGroups(result.data);
            setTotalUser({
                holding: result.data.filter(x => x.userid === 3).reduce((acc, item) => acc + item.total, 0),
                bot: result.data.filter(x => x.userid === 2).reduce((acc, item) => acc + item.total, 0)
            })
        }
    }, [result])

    useEffect(() => {
        if (openModal) {
            dispatch(getCollection(getTicketsByGroups()))
        }
    }, [openModal])
    
    return (
        <DialogZyx
            open={openModal}
            title={t(langKeys.information_group_agent)}
            buttonText1={t(langKeys.cancel)}
            handleClickButton1={() => setOpenModal(false)}
        >
            <div>
                <Accordion>
                    <AccordionSummary
                        expandIcon={<ExpandMore />}
                        aria-controls="panel1a-content"
                        id="panel1a-header"
                    >
                        <Typography>{t(langKeys.tickets_bot)} ({totalUser.bot})</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <div>
                            {dataGroups.filter(x => x.userid === 2).map((group) => (
                                <div key={`${group.userid}${group.usergroup}`} style={{ display: "flex", gap: 4 }}>
                                    <div>{group.usergroup || "Sin grupo"}</div>
                                    <div>({group.total})</div>
                                </div>
                            ))}
                        </div>
                    </AccordionDetails>
                </Accordion>
                <Accordion>
                    <AccordionSummary
                        expandIcon={<ExpandMore />}
                        aria-controls="panel1a-content"
                        id="panel1a-header"
                    >
                        <Typography >{t(langKeys.tickets_holding)} ({totalUser.holding})</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <div>
                            {dataGroups.filter(x => x.userid === 3).map((group) => (
                                <div key={`${group.userid}${group.usergroup}`} style={{ display: "flex", gap: 4 }}>
                                    <div>{group.usergroup || "Sin grupo"}</div>
                                    <div>({group.total})</div>
                                </div>
                            ))}
                        </div>
                    </AccordionDetails>
                </Accordion>
                <Accordion>
                    <AccordionSummary
                        expandIcon={<ExpandMore />}
                        aria-controls="panel1a-content"
                        id="panel1a-header"
                    >
                        <Typography >{t(langKeys.agents_connected_by_group)} ({agentList.data.filter(x => x.status === 'ACTIVO' && x.userid !== 2 && x.userid !== 3).length})</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <div style={{ width: '100%' }}>
                            {groups.filter(x => x.agents?.length).map((group, index) => (
                                <Accordion key={index}>
                                    <AccordionSummary
                                        expandIcon={<ExpandMore />}
                                        aria-controls={`panel-${group.domainvalue}-content`}
                                        id={`panel-${group.domainvalue}-header`}
                                    >
                                        <div style={{ display: "flex", gap: 4 }}>
                                            <div>{group.domainvalue || t(langKeys.without_group)}</div>
                                            <div>({group.agents?.length || 0})</div>
                                        </div>
                                    </AccordionSummary>
                                    <AccordionDetails>
                                        {/* List of agents for this group */}
                                        {group.agents?.length > 0 ? (
                                            <div style={{ marginLeft: "16px" }}>
                                                {group.agents.map((agent: IAgent) => (
                                                    <div key={agent.userid} style={{ display: "flex", gap: 8 }}>
                                                        <Typography>{agent.name}</Typography>
                                                        <Typography>- {agent.status}</Typography>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <Typography style={{ marginLeft: "16px" }}>{t(langKeys.no_agent_available)}</Typography>
                                        )}
                                    </AccordionDetails>
                                </Accordion>
                            ))}
                        </div>
                    </AccordionDetails>
                </Accordion>
            </div>
        </DialogZyx>
    )
}

export default DialogViewGroups;