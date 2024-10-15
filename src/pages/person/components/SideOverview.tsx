import { FC, useEffect, useState } from "react";
import { IconButton } from "@material-ui/core";
import CreateIcon from '@material-ui/icons/Create';
import { EditInfoOverview, InfoOverview, Photo } from "./index";
import { SideOverviewProps } from "../model";
import SaveIcon from '@material-ui/icons/Save';
import { useSelector } from "hooks";
import { DocNumberIcon, DocTypeIcon, EMailInboxIcon, GenderIcon, TelephoneIcon } from "icons";
import RoomOutlinedIcon from '@material-ui/icons/RoomOutlined';
import AccountBalanceWalletOutlinedIcon from '@material-ui/icons/AccountBalanceWalletOutlined';
import TollIcon from '@material-ui/icons/Toll';
import { useDispatch } from "react-redux";
import { execute } from "store/main/actions";
import { updateSidePersonView } from "common/helpers";
import { showBackdrop, showSnackbar } from "store/popus/actions";
import { langKeys } from "lang/keys";
import { useTranslation } from "react-i18next";
import { updateUserInformation } from "store/login/actions";

const availableFields = [
    { id: "1", size: 2, field: "phone", icon: <TelephoneIcon fill="inherit" stroke="inherit" width={20} height={20} style={{ fill: "#c5c7c6" }} /> },
    { id: "2", size: 2, field: "email", icon: <EMailInboxIcon fill="inherit" stroke="inherit" width={20} height={20} style={{ fill: "#c5c7c6" }} /> },
    { id: "3", size: 2, field: "address", icon: <RoomOutlinedIcon fill="inherit" stroke="inherit" width={20} height={20} style={{ fill: "#c5c7c6" }} /> },
    { id: "4", size: 1, field: "documenttype", icon: <DocTypeIcon fill="inherit" stroke="inherit" width={20} height={20} style={{ fill: "#c5c7c6" }} /> },
    { id: "5", size: 1, field: "gender", icon: <GenderIcon fill="inherit" stroke="inherit" width={20} height={20} style={{ fill: "#c5c7c6" }} /> },
    { id: "6", size: 1, field: "birthday", icon: <TollIcon fill="inherit" stroke="inherit" width={20} height={20} style={{ fill: "#c5c7c6" }} /> },
    { id: "7", size: 1, field: "type", icon: <DocNumberIcon fill="inherit" stroke="inherit" width={20} height={20} style={{ fill: "#c5c7c6" }} /> },
    { id: "8", size: 1, field: "documentnumber", icon: <DocNumberIcon fill="inherit" stroke="inherit" width={20} height={20} style={{ fill: "#c5c7c6" }} /> },
    { id: "9", size: 1, field: "occupationdesc", icon: <DocNumberIcon fill="inherit" stroke="inherit" width={20} height={20} style={{ fill: "#c5c7c6" }} /> },
    { id: "10", size: 1, field: "civilstatus", icon: <TollIcon fill="inherit" stroke="inherit" width={20} height={20} style={{ fill: "#c5c7c6" }} /> },
    { id: "11", size: 1, field: "salary", icon: <AccountBalanceWalletOutlinedIcon fill="inherit" stroke="inherit" width={20} height={20} style={{ fill: "#c5c7c6" }} /> },
];

export const transformPersonToItemsFormat = (person: any) => {
    const sortedPerson = [...person].sort((a, b) => a.order - b.order);

    return sortedPerson.map((p) => {
        const matchedField = availableFields.find((field) => field.field === p.field);

        if (matchedField) {
            return {
                id: matchedField.id,
                size: parseInt(p.size),
                field: p.field,
                icon: matchedField.icon,
            };
        }
        return null;
    }).filter(Boolean);
};
const SideOverview: FC<SideOverviewProps> = ({ classes, person, setValue }) => {
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const user = useSelector(state => state.login.validateToken.user);
    const executeResult = useSelector(state => state.main.execute);
    const [items, setItems] = useState<any[]>(transformPersonToItemsFormat(user?.uiconfig?.person || []));
    const [editFields, setEditFields] = useState(false);
    const [waitEdit, setWaitEdit] = useState(false);


    useEffect(() => {
        if(waitEdit){
            if (!executeResult.loading && !executeResult.error) {
                dispatch(showSnackbar({ show: true, severity: "success", message: t(langKeys.success) }));
                dispatch(showBackdrop(false));
                setWaitEdit(false);
                setEditFields(!editFields) 
            } else if (executeResult.error) {
                dispatch(showSnackbar({ show: true, severity: "error", message: "error"}));
                dispatch(showBackdrop(false));
                setWaitEdit(false);
            }

        }
    }, [executeResult, waitEdit])

    function changeTab(){
        if(editFields){
            const config = JSON.stringify(items.map((item: any, index: number) => ({ size: item.size.toString(), field: item.field, order: index + 1 })))
            if(user){
                dispatch(updateUserInformation(user.firstname, user.lastname, user?.image||"", {...user.uiconfig,person: JSON.parse(config)}));
            }
            dispatch(execute(updateSidePersonView(config)))
            dispatch(showBackdrop(true));
            setWaitEdit(true)
        }else{
           setEditFields(!editFields) 
        }
    }
    return <div className={classes.profile}>
        <h2 style={{ display: "flex", justifyContent: "center" }}>{person.firstname + " " + person.lastname}</h2>
        <div style={{ display: "flex", justifyContent: "center" }}>
            <Photo src={person.imageurldef} radius={50} setValue={setValue} />
        </div>
        <div style={{ display: "flex", justifyContent: "end" }}>
            <IconButton onClick={changeTab} style={{ backgroundColor: editFields ? "#7721ad" : "#dadada", color: "white" }}>
                {editFields ? <SaveIcon /> : <CreateIcon />}
            </IconButton>
        </div>
        {!editFields ?
            <InfoOverview person={person} items={items} /> :
            <EditInfoOverview items={items} setItems={setItems} availableFields={availableFields} />
        }
    </div>
}

export default SideOverview;
