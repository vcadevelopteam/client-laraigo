/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react'
import { makeStyles } from '@material-ui/core/styles';
import { useSelector } from 'hooks';
import { ITicket } from "@types";
import { AntTab, FieldMultiSelect, FieldEdit } from 'components';
import Tabs from '@material-ui/core/Tabs';
import TextField from '@material-ui/core/TextField';
import { SearchIcon } from 'icons';
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import ItemTicket from 'components/inbox/Ticket'
import ChatPanel from 'components/inbox/ChatPanel'
import InfoPanel from 'components/inbox/InfoPanel'
import { resetGetTickets, getTickets, selectTicket, getDataTicket } from 'store/inbox/actions';
import { useDispatch } from 'react-redux';
import { ListItemSkeleton } from 'components'
import { langKeys } from 'lang/keys';
import { useTranslation } from 'react-i18next';
import FilterListIcon from '@material-ui/icons/FilterList';
import Tooltip from '@material-ui/core/Tooltip';
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';


const DrawerFilter: React.FC<{ classes: any, drawerOpen: boolean, setDrawerOpen: (param: boolean) => void }> = ({ drawerOpen, setDrawerOpen, classes }) => {
    const { t } = useTranslation();

    const multiData = useSelector(state => state.main.multiData);

    return (
        <SwipeableDrawer
            anchor='right'
            open={drawerOpen}
            onClose={() => setDrawerOpen(false)}
            onOpen={() => setDrawerOpen(true)}
        >
            <div className={classes.containerDrawer}>
                <div className={classes.titleFilter}>{t(langKeys.advance_search)}</div>
                <FieldMultiSelect
                    label={t(langKeys.channel_plural)}
                    variant="outlined"
                    className={classes.itemFilter}
                    // onChange={(value) => setFilters(p => ({ ...p, communicationchannelid: value.map((o: Dictionary) => o.communicationchannelid).join() }))}
                    data={multiData?.data[6]?.data}
                    optionDesc="communicationchanneldesc"
                    optionValue="communicationchannelid"
                />
                <div>
                    <div>{t(langKeys.conversation) + " " + t(langKeys.status)}</div>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <FormControlLabel
                            control={<Checkbox onChange={() => console.log('dsadsa')} name="checkedA" />}
                            label={t(langKeys.assigned)}
                        />
                        <FormControlLabel
                            control={<Checkbox onChange={() => console.log('dsadsa')} name="checkedA" />}
                            label={t(langKeys.closed)}
                        />
                        <FormControlLabel
                            control={<Checkbox onChange={() => console.log('dsadsa')} name="checkedA" />}
                            label={t(langKeys.paused)}
                        />
                    </div>
                </div>
                <FieldEdit
                    label={t(langKeys.name)} // "Corporation"
                    className="col-6"
                    valueDefault=''
                    variant="outlined"
                />
                <FieldEdit
                    label={t(langKeys.phone)} // "Corporation"
                    className="col-6"
                    valueDefault=''
                    variant="outlined"
                />
            </div>
        </SwipeableDrawer>
    )
}
export default DrawerFilter;