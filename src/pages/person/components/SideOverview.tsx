import { FC } from "react";
import { Photo } from "./Photo";
import { Property } from "./Property";
import { DocNumberIcon, DocTypeIcon, EMailInboxIcon, GenderIcon, TelephoneIcon } from "icons";
import { Trans } from "react-i18next";
import { langKeys } from "lang/keys";
import { Grid } from "@material-ui/core";
import RoomOutlinedIcon from '@material-ui/icons/RoomOutlined';
import AccountBalanceWalletOutlinedIcon from '@material-ui/icons/AccountBalanceWalletOutlined';
import TollIcon from '@material-ui/icons/Toll';

interface SideOverviewProps {
    classes: any;
    person: any;
}

export const SideOverview: FC<SideOverviewProps> = ({ classes, person }) => {

    return <div className={classes.profile}>
        <h2 style={{ display: "flex", justifyContent: "center" }}>{person.name}</h2>
        <div style={{ display: "flex", justifyContent: "center" }}>
            <Photo src={person.imageurldef} radius={50} />
        </div>
        <Property
            icon={<TelephoneIcon fill="inherit" stroke="inherit" width={20} height={20} style={{fill: "#c5c7c6"}} />}
            title={<Trans i18nKey={langKeys.phone} />}
            subtitle={person.phone}
            mt={1}
            mb={1}
        />
        <Property
            icon={<EMailInboxIcon />}
            title={<Trans i18nKey={langKeys.email} />}
            subtitle={person.email}
            mt={1}
            mb={1} />
        <Property
            icon={<RoomOutlinedIcon fill="inherit" stroke="inherit" width={20} height={20} style={{fill: "#c5c7c6"}} />}
            title={<Trans i18nKey={langKeys.address} />}
            subtitle={person.address}
            mt={1}
            mb={1}
        />
        <Grid container direction="row" >
            <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                <Grid container direction="column">
                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                        <Property
                            icon={<DocTypeIcon fill="inherit" stroke="inherit" width={20} height={20} style={{fill: "#c5c7c6"}} />}
                            title={<Trans i18nKey={langKeys.docType} />}
                            subtitle={person.docType}
                            mt={1}
                            mb={1}
                        />
                    </Grid>
                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                        <Property
                            icon={<GenderIcon />}
                            title={<Trans i18nKey={langKeys.gender} />}
                            subtitle={person.gender}
                            mt={1}
                            mb={1}
                        />
                    </Grid>
                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                        <Property
                            icon={<TollIcon fill="inherit" stroke="inherit" width={20} height={20} style={{fill: "#c5c7c6"}}/>}
                            title={<Trans i18nKey={langKeys.birthday} />}
                            subtitle={person.birthday}
                            mt={1}
                            mb={1}
                        />
                    </Grid>
                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                        <Property
                            icon={<DocNumberIcon fill="inherit" stroke="inherit" width={20} height={20} style={{fill: "#c5c7c6"}} />}
                            title={<Trans i18nKey={langKeys.personType} />}
                            subtitle={person.type}
                            mt={1}
                            mb={1}
                        />
                    </Grid>
                </Grid>
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                <Grid container direction="column">
                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                        <Property
                            icon={<DocNumberIcon fill="inherit" stroke="inherit" width={20} height={20} style={{fill: "#c5c7c6"}} />}
                            title={<Trans i18nKey={langKeys.docNumber} />}
                            subtitle={person.docNumber}
                            mt={1}
                            mb={1}
                        />
                    </Grid>
                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                        <Property
                            icon={<DocNumberIcon fill="inherit" stroke="inherit" width={20} height={20}  style={{fill: "#c5c7c6"}}/>}
                            title={<Trans i18nKey={langKeys.occupation} />}
                            subtitle={person.occupationdesc}
                            mt={1}
                            mb={1}
                        />
                    </Grid>
                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                        <Property
                            icon={<TollIcon fill="inherit" stroke="inherit" width={20} height={20} style={{fill: "#c5c7c6"}}/>}
                            title={<Trans i18nKey={langKeys.civilStatus} />}
                            subtitle={person.civilstatus}
                            mt={1}
                            mb={1}
                        />
                    </Grid>
                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                        <Property
                            icon={<AccountBalanceWalletOutlinedIcon fill="inherit" stroke="inherit" width={20} height={20} style={{fill: "#c5c7c6"}} />}
                            title={"Salario"}
                            subtitle={person.salary}
                            mt={1}
                            mb={1}
                        />
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    </div>
}
