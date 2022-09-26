/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react'
import { DialogZyx, SkeletonInteraction } from 'components'
import { makeStyles } from '@material-ui/core/styles';
import { useSelector } from 'hooks';
import { useDispatch } from 'react-redux';
import { getInteractions } from 'store/inbox/actions'
import { Dictionary, IGroupInteraction, IPerson } from '@types';
import { useTranslation } from 'react-i18next';
import { langKeys } from 'lang/keys';
import ItemGroupInteraction from './Interaction';
import Button from '@material-ui/core/Button';
import { Trans } from 'react-i18next';
import { DownloadIcon } from 'icons';
import DomToImage from 'dom-to-image';
import IOSSwitch from "components/fields/IOSSwitch";
import Tooltip from '@material-ui/core/Tooltip';
import { Avatar } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
    label: {
        overflowWrap: 'anywhere',
        fontSize: 12,
        color: '#B6B4BA',
    },
    value: {
        height: 22,
        maxWidth: 180,
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        textOverflow: 'ellipsis'
    },
    image: {
        alignItems: "center",
        marginTop: "auto",
        marginBottom: "auto"
    }
}));

const DialogLinkPerson: React.FC<{
    openModal: boolean,
    setOpenModal: (param: any) => void,
    person?: IPerson | undefined | null
}> = ({ openModal, setOpenModal, person }) => {
    const { t } = useTranslation();
    const classes = useStyles();
    const dispatch = useDispatch();

    return (
        <DialogZyx
            open={openModal}
            title={"Vincular"}
            buttonText1={t(langKeys.cancel)}
            handleClickButton1={() => setOpenModal(false)}
            maxWidth="md"
        >
            <div style={{ display: "flex", gap: 10 }}>
                <Avatar className={classes.image} alt="" style={{ width: 120, height: 120 }} src={person?.imageurldef} />
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', width: '100%', gap: "10px" }}>
                    <div>
                        <div className={classes.label}>{t(langKeys.firstname)}</div>
                        <div className={classes.value}>{person?.firstname}</div>
                    </div>
                    <div>
                        <div className={classes.label}>{t(langKeys.lastname)}</div>
                        <div className={classes.value}>{person?.lastname}</div>
                    </div>
                    <div>
                        <div className={classes.label}>{t(langKeys.documenttype)}</div>
                        <div className={classes.value}>{person?.documenttype}</div>
                    </div>
                    <div>
                        <div className={classes.label}>{t(langKeys.documentnumber)}</div>
                        <div className={classes.value}>{person?.documentnumber}</div>
                    </div>
                    <div>
                        <div className={classes.label}>{t(langKeys.email)}</div>
                        <div className={classes.value}>{person?.email}</div>
                    </div>
                    <div>
                        <div className={classes.label}>{t(langKeys.phone)}</div>
                        <div className={classes.value}>{person?.phone}</div>
                    </div>
                    <div>
                        <div className={classes.label}>{t(langKeys.alternativeEmail)}</div>
                        <div className={classes.value}>{person?.alternativeemail}</div>
                    </div>
                    <div>
                        <div className={classes.label}>{t(langKeys.alternativePhone)}</div>
                        <div className={classes.value}>{person?.alternativephone}</div>
                    </div>
                    <div>
                        <div className={classes.label}>{t(langKeys.birthday)}</div>
                        <div className={classes.value}>{person?.birthday}</div>
                    </div>
                    <div>
                        <div className={classes.label}>{t(langKeys.gender)}</div>
                        <div className={classes.value}>{person?.gender}</div>
                    </div>
                    <div>
                        <div className={classes.label}>{t(langKeys.occupation)}</div>
                        <div className={classes.value}>{person?.occupationdesc}</div>
                    </div>
                    <div>
                        <div className={classes.label}>{t(langKeys.civilStatus)}</div>
                        <div className={classes.value}>{person?.civilstatusdesc}</div>
                    </div>
                    <div>
                        <div className={classes.label}>{t(langKeys.educationLevel)}</div>
                        <div className={classes.value}>{person?.educationleveldesc}</div>
                    </div>
                    <div>
                        <div className={classes.label}>{t(langKeys.observation)}</div>
                        <div className={classes.value}>{person?.observation}</div>
                    </div>
                </div>
            </div>
            <div>
                *Al realizar la vinculación, los tickets y canales de esta persona se trasladaran a la persona seleccionada
            </div>
        </DialogZyx>
    )
}

export default DialogLinkPerson;