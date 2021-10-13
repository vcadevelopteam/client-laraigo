/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react'
import { useSelector } from 'hooks';
import { FieldMultiSelect, FieldEdit, DateRangePicker } from 'components';
import { CalendarIcon } from 'icons';

import { langKeys } from 'lang/keys';
import { useTranslation } from 'react-i18next';
import Button from '@material-ui/core/Button';
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import { Range } from 'react-date-range';
import SearchIcon from '@material-ui/icons/Search';
import ClearIcon from '@material-ui/icons/Clear';
const format = (date: Date) => date.toISOString().split('T')[0];


const DrawerFilter: React.FC<{ classes: any, drawerOpen: boolean, setDrawerOpen: (param: boolean) => void }> = ({ drawerOpen, setDrawerOpen, classes }) => {
    const { t } = useTranslation();
    const [openDateRangeModal, setOpenDateRangeModal] = useState(false);

    const multiData = useSelector(state => state.main.multiData);
    const [filters, setFilters] = useState({
        channels: '',
        lastmessage: '',
        createticket: '',
        conversationstatus: '',
        displayname: '',
        phone: '',
    })

    const [dateRange, setdateRange] = useState<Range>({
        startDate: new Date(new Date().setDate(0)),
        endDate: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0),
        key: 'selection'
    });

    useEffect(() => {
        setFilters({
            channels: '',
            lastmessage: '',
            createticket: '',
            conversationstatus: '',
            displayname: '',
            phone: '',
        })
    }, [drawerOpen])


    return (
        <SwipeableDrawer
            anchor='right'
            open={drawerOpen}
            onClose={() => setDrawerOpen(false)}
            onOpen={() => setDrawerOpen(true)}
        >
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%' }}>
                <div className={classes.containerDrawer}>
                    <div className={classes.titleFilter}>{t(langKeys.advance_search)}</div>
                    <FieldMultiSelect
                        label={t(langKeys.channel_plural)}
                        variant="outlined"
                        className={classes.itemFilter}
                        onChange={(value) => setFilters(p => ({ ...p, channels: value.map((o: any) => o.communicationchannelid).join() }))}
                        data={multiData?.data[6]?.data}
                        optionDesc="communicationchanneldesc"
                        optionValue="communicationchannelid"
                    />
                    <div>
                        <div style={{ fontWeight: 500 }}>{t(langKeys.conversation) + " " + t(langKeys.status)}</div>
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
                        size="small"
                    />
                    <FieldEdit
                        label={t(langKeys.phone)} // "Corporation"
                        className="col-6"
                        valueDefault=''
                        variant="outlined"
                        size="small"
                    />
                    <div>
                        <div style={{ fontWeight: 500, marginBottom: 8 }}>{t(langKeys.creationDate)}</div>
                        <DateRangePicker
                            open={openDateRangeModal}
                            setOpen={setOpenDateRangeModal}
                            range={dateRange}
                            onSelect={setdateRange}
                        >
                            <Button
                                fullWidth
                                style={{ border: '1px solid #bfbfc0', borderRadius: 4, color: 'rgb(143, 146, 161)' }}
                                startIcon={<CalendarIcon />}
                                onClick={() => setOpenDateRangeModal(!openDateRangeModal)}
                            >
                                {format(dateRange.startDate!) + " - " + format(dateRange.endDate!)}
                            </Button>
                        </DateRangePicker>
                    </div>
                </div>
                <div style={{ padding: 16, display: 'flex', justifyContent: 'space-between' }}>
                    <Button
                        variant="outlined"
                        color="primary"
                        startIcon={<SearchIcon color="primary" />}
                        onClick={() => setOpenDateRangeModal(!openDateRangeModal)}
                    >
                        {t(langKeys.search)}
                    </Button>
                    <Button
                        variant="outlined"
                        color="default"
                        startIcon={<ClearIcon />}
                        onClick={() => setOpenDateRangeModal(!openDateRangeModal)}
                    >
                        {t(langKeys.clean)}
                    </Button>
                </div>
            </div>
        </SwipeableDrawer>
    )
}
export default DrawerFilter;