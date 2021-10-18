/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react'
import { FieldMultiSelect, FieldEdit, DateRangePicker } from 'components';
import { CalendarIcon } from 'icons';
import { useDispatch } from 'react-redux';
import { useSelector } from 'hooks';
import { filterTickets, setIsFiltering } from 'store/inbox/actions';
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
    const dispatch = useDispatch();
    const isFiltering = useSelector(state => state.inbox.isFiltering);
    const ticketFilteredList = useSelector(state => state.inbox.ticketFilteredList);

    const multiData = useSelector(state => state.main.multiData);
    const [filterCheckBox, setFilterCheckBox] = useState({
        ASIGNADO: false,
        CERRADO: false,
        PAUSADO: false
    })

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
        const conversationstatus = [
            ...(filterCheckBox.ASIGNADO ? ["ASIGNADO"] : []),
            ...(filterCheckBox.CERRADO ? ["CERRADO"] : []),
            ...(filterCheckBox.PAUSADO ? ["PAUSADO"] : []),
        ].join(',');

        setFilters({
            ...filters,
            conversationstatus
        })
    }, [filterCheckBox])

    useEffect(() => {
        if (!isFiltering) {
            setFilters({
                channels: '',
                lastmessage: '',
                createticket: '',
                conversationstatus: '',
                displayname: '',
                phone: '',
            })
        }
    }, [isFiltering])

    const handlerFilter = (e: any) => {
        e.preventDefault()
        const filtersOK = {
            ...filters,
            start_createticket: dateRange.startDate ? new Date(dateRange.startDate.setHours(10)).toISOString().substring(0, 10) : null,
            end_createticket: dateRange.endDate ? new Date(dateRange.endDate.setHours(10)).toISOString().substring(0, 10) : null
        }
        dispatch(filterTickets(
            filtersOK.lastmessage,
            filtersOK.start_createticket!!,
            filtersOK.end_createticket!!,
            filtersOK.channels,
            filtersOK.conversationstatus,
            filtersOK.displayname,
            filtersOK.phone
        ));
    }

    const handleClean = () => {
        dispatch(setIsFiltering(false));
        setFilterCheckBox({
            ASIGNADO: false,
            CERRADO: false,
            PAUSADO: false
        })
        setFilters({
            channels: '',
            lastmessage: '',
            createticket: '',
            conversationstatus: '',
            displayname: '',
            phone: '',
        })
    }

    return (
        <SwipeableDrawer
            anchor='right'
            open={drawerOpen}
            onClose={() => setDrawerOpen(false)}
            onOpen={() => setDrawerOpen(true)}
        >
            <form onSubmit={handlerFilter} style={{ height: '100%' }}>
                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%' }}>
                    <div className={classes.containerDrawer}>
                        <div className={classes.titleFilter}>{t(langKeys.advance_search)}</div>
                        <FieldMultiSelect
                            label={t(langKeys.channel_plural)}
                            variant="outlined"
                            className={classes.itemFilter}
                            valueDefault={filters.channels}
                            onChange={(value) => setFilters(p => ({ ...p, channels: value.map((o: any) => o.communicationchannelid).join() }))}
                            data={multiData?.data[6]?.data}
                            optionDesc="communicationchanneldesc"
                            optionValue="communicationchannelid"
                        />
                        <div>
                            <div style={{ fontWeight: 500 }}>{t(langKeys.conversation) + " " + t(langKeys.status)}</div>
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <FormControlLabel
                                    control={<Checkbox checked={filterCheckBox.ASIGNADO} onChange={(e) => setFilterCheckBox({ ...filterCheckBox, ASIGNADO: e.target.checked })} name="checkedA" />}
                                    label={t(langKeys.assigned)}
                                />
                                <FormControlLabel
                                    control={<Checkbox checked={filterCheckBox.CERRADO} onChange={(e) => setFilterCheckBox({ ...filterCheckBox, CERRADO: e.target.checked })} name="checkedA" />}
                                    label={t(langKeys.closed)}
                                />
                                <FormControlLabel
                                    control={<Checkbox checked={filterCheckBox.PAUSADO} onChange={(e) => setFilterCheckBox({ ...filterCheckBox, PAUSADO: e.target.checked })} name="checkedA" />}
                                    label={t(langKeys.paused)}
                                />
                            </div>
                        </div>
                        <FieldEdit
                            label={t(langKeys.name)}
                            className="col-6"
                            valueDefault={filters.displayname}
                            variant="outlined"
                            size="small"
                            onChange={(value) => setFilters(p => ({ ...p, displayname: value }))}
                        />
                        <FieldEdit
                            label={t(langKeys.phone)}
                            className="col-6"
                            onChange={(value) => setFilters(p => ({ ...p, phone: value }))}
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
                            type="submit"
                            startIcon={<SearchIcon color="primary" />}
                            disabled={ticketFilteredList.loading}
                        // onClick={() => handlerFilter()}
                        >
                            {t(langKeys.search)}
                        </Button>
                        <Button
                            variant="outlined"
                            color="default"
                            startIcon={<ClearIcon />}
                            onClick={() => handleClean()}
                        >
                            {t(langKeys.clean)}
                        </Button>
                    </div>
                </div>
            </form>
        </SwipeableDrawer>
    )
}
export default DrawerFilter;