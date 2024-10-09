
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState } from 'react';
import { DialogZyx, FieldSelect } from 'components';
import { useTranslation } from 'react-i18next';
import { langKeys } from 'lang/keys';
import { makeStyles } from '@material-ui/core';
import { useSelector } from 'hooks';


interface DetailProps {
    openModal: any;
    setOpenModal: (view: any) => void;
    addtoTable: (view: any) => void;
    setNewEntity: (view: string) => void;
    createdEntities: any;
}
const useStyles = makeStyles((theme) => ({
    containerFields: {
        paddingRight: "16px"
    },
}));

export const DialogAddEntity: React.FC<DetailProps> = ({ openModal, setOpenModal, addtoTable, setNewEntity, createdEntities }) => {
    const { t } = useTranslation();
    const classes = useStyles();
    const mainResultWatson = useSelector(state => state.watson.items);
    const [entity, setEntity] = useState("");


    return (
        <DialogZyx
            open={openModal}
            title={t(langKeys.entities)}
            buttonText1={t(langKeys.cancel)}
            buttonText2={t(langKeys.save)}
            handleClickButton1={() => { setOpenModal(false); setNewEntity("") }}
            handleClickButton2={addtoTable}
        >
            <div className="row-zyx">
                <FieldSelect
                    freeSolo={true}
                    className={classes.containerFields}
                    valueDefault={entity}
                    helperText2={t(langKeys.entitydesctooltop)}
                    onChange={(value) => {
                        setNewEntity(value?.item_name || "")
                        setEntity(value?.item_name || "")
                    }}
                    data={[...(mainResultWatson?.data || []).filter(x => x.type === "entity"), ...createdEntities]}
                    optionDesc="item_name"
                    optionValue="item_name"
                />
            </div>
        </DialogZyx>
    );
}
