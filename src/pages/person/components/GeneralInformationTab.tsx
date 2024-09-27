import { AppBar, makeStyles, Tab, Tabs } from "@material-ui/core";
import { langKeys } from "lang/keys";
import { Trans } from "react-i18next";
import { IObjectState, IPerson, IPersonDomains } from "@types";
import { UseFormGetValues } from "react-hook-form";
import { FC, useEffect, useState } from "react";
import clsx from 'clsx';
import { PersonalDataTab } from "./PersonalDataTab";
import { useDispatch } from "react-redux";
import { getReferrerListByPerson, resetGetReferrerListByPerson } from "store/person/actions";
import { getReferrerByPersonBody } from "common/helpers";
import { ExtraDataTab } from "./ExtraDataTab";

interface GeneralInformationTabProps {
    person: IPerson;
    getValues: UseFormGetValues<IPerson>;
    setValue: any;
    trigger: any;
    domains: IObjectState<IPersonDomains>;
    errors: any;
    control: any;
    extraTriggers: any;
    setExtraTriggers: (trig: any) => void;
}

const useStyles = makeStyles(theme => ({
    tabs: {
        backgroundColor: '#EBEAED',
        color: '#989898',
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        width: 'inherit',
    },
    tab: {
        color: theme.palette.text.primary,
        backgroundColor: '#EBEAED',
        flexGrow: 1,
        maxWidth: 'unset',
    },
    activetab: {
        backgroundColor: 'white',
    },
    label: {
        fontSize: 14,
        fontWeight: 500,
    },
}));

export const GeneralInformationTab: FC<GeneralInformationTabProps> = ({ person, getValues, trigger, setValue, domains, errors, control, extraTriggers, setExtraTriggers }) => {

    const [tabIndex, setTabIndex] = useState('0');
    const classes = useStyles();
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
        <AppBar position="static" elevation={0}>
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
                /><Tab
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
        <div style={{ height: 'calc(97% - 5px)', overflowY: 'auto' }}>
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
        <div style={{ height: 'calc(97% - 5px)', overflowY: 'auto' }}>
            <ExtraDataTab
                getValues={getValues}
                setValue={setValue}
                trigger={trigger}
            />
        </div>
    </>
}