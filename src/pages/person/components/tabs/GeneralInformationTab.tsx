import { AppBar, Tab, Tabs } from "@material-ui/core";
import { langKeys } from "lang/keys";
import { Trans } from "react-i18next";
import { FC, useEffect, useState } from "react";
import clsx from 'clsx';
import { useDispatch } from "react-redux";
import { getReferrerListByPerson, resetGetReferrerListByPerson } from "store/person/actions";
import { getReferrerByPersonBody } from "common/helpers";
import { ExtraDataTab, LocationTab, PersonalDataTab } from "../index";
import { useGeneralInformationTabStyles } from "pages/person/styles";
import { GeneralInformationTabProps } from "pages/person/model";

const GeneralInformationTab: FC<GeneralInformationTabProps> = ({ person,addressbook, getValues, trigger, setValue, domains, errors, control, extraTriggers, watch, setExtraTriggers }) => {

    const [tabIndex, setTabIndex] = useState('0');
    const classes = useGeneralInformationTabStyles();
    const dispatch = useDispatch();
    useEffect(() => {
        if (person.referringpersonid) {
            dispatch(getReferrerListByPerson(getReferrerByPersonBody(person.referringpersonid)));
            return () => {
                dispatch(resetGetReferrerListByPerson());
            };
        }
    }, [dispatch, person]);

    return <>
        <AppBar position="static" elevation={0} style={{width: "100%"}}>
            <Tabs
                value={tabIndex}
                onChange={(x, i: string) => { setTabIndex(i) }}
                className={classes.tabs}
                TabIndicatorProps={{ style: { display: 'none' } }}
            >
                <Tab
                    className={clsx(classes.tab, classes.label, tabIndex === "0" && classes.activetab)}
                    label={<div><Trans i18nKey={langKeys.personaldata} /></div>}
                    value="0"
                />
                <Tab
                    className={clsx(classes.tab, classes.label, tabIndex === "1" && classes.activetab)}
                    label={<div><Trans i18nKey={langKeys.addressbook} /></div>}
                    value="1"
                />
                <Tab
                    className={clsx(classes.tab, classes.label, tabIndex === "2" && classes.activetab)}
                    label={<Trans i18nKey={langKeys.extradata} count={2} />}
                    value="2"
                />
            </Tabs>
        </AppBar>
        {tabIndex === "0" && <div style={{ height: 'calc(97% - 5px)', overflowY: 'auto' }}>
            <PersonalDataTab
                getValues={getValues}
                setValue={setValue}
                trigger={trigger}
                domains={domains}
                errors={errors}
                control={control}
                extraTriggers={extraTriggers}
                setExtraTriggers={setExtraTriggers}
            />
        </div>
        }
        {tabIndex === "1" && <div style={{  overflowY: 'auto' }}>
            <LocationTab
                setValue={setValue}
                watch={watch}
                addressbook={addressbook}
            />
        </div>}
        {tabIndex === "2" && <div style={{ height: 'calc(97% - 5px)', overflowY: 'auto' }}>
            <ExtraDataTab
                getValues={getValues}
                setValue={setValue}
                trigger={trigger}
            />
        </div>}
    </>
}

export default GeneralInformationTab;