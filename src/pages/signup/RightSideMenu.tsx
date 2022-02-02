/* eslint-disable react-hooks/exhaustive-deps */
import { FC, useContext } from "react";
import {FirstStep} from './FirstStep';
import {SecondStep} from './SecondStep';
import {Step2_5} from './Step2_5';
import {ThirdStep} from './ThirdStep';
import {LastStep} from './LastStep';
import {ChannelAddFacebook} from './ChannelAddFacebook'
import {ChannelAddInstagram} from './ChannelAddInstagram'
import {ChannelAddInstagramDM} from './ChannelAddInstagramDM'
import {ChannelAddMessenger} from './ChannelAddMessenger'
import {ChannelAddWhatsapp} from './ChannelAddWhatsapp'
import {ChannelAddTelegram} from './ChannelAddTelegram'
import {ChannelAddTwitter} from './ChannelAddTwitter'
import {ChannelAddTwitterDM} from './ChannelAddTwitterDM'
import {ChannelAddChatWeb} from './ChannelAddChatWeb'
import {ChannelAddAndroid} from './ChannelAddAndroid'
import {ChannelAddIos} from './ChannelAddIos'
import { SubscriptionContext } from "./context";
import { RateExperience } from "./Rating";

interface RightSideMenuProps {
    setSnackbar:(param:any)=>void,
    setBackdrop:(param:any)=>void,
    setOpenWarning:(param:any)=>void,
    sendchannels:any,
    setsendchannels:(param:any)=>void,
}

export const RightSideMenu: FC<RightSideMenuProps> = ({
    setSnackbar,
    setBackdrop,
    setOpenWarning,
    sendchannels,
    setsendchannels,
}) => {
    const { listchannels, step, setStep } = useContext(SubscriptionContext);

    if(step===1){
        return(
            <FirstStep
                setSnackbar={setSnackbar}
            />
        )
    }else if(step===2){
        return (
            <SecondStep
                setOpenWarning={setOpenWarning}
            />
        )
    }else if(step===2.5){
        return (
            <Step2_5
                setOpenWarning={setOpenWarning}
            />
        )
    }
    else if (step === 2.6) {
        return (
            <LastStep
                setSnackbar={setSnackbar}
                setBackdrop={setBackdrop}
                setsendchannels={setsendchannels}
                setOpenWarning={setOpenWarning}
            />
        );
    }
    else if(step===3&&!sendchannels){
        return (
            <ThirdStep
                setsendchannels={setsendchannels}
                setOpenWarning={setOpenWarning}
            />
        )
    }
    else if(step===3&&sendchannels){
        if(listchannels.facebook) return <ChannelAddFacebook setOpenWarning={setOpenWarning}/>
        if(listchannels.instagram) return <ChannelAddInstagram setOpenWarning={setOpenWarning}/>
        if(listchannels.instagram) return <ChannelAddInstagramDM setOpenWarning={setOpenWarning}/>
        if(listchannels.messenger) return <ChannelAddMessenger setOpenWarning={setOpenWarning}/>
        if(listchannels.whatsapp) return <ChannelAddWhatsapp setOpenWarning={setOpenWarning}/>
        if(listchannels.telegram) return <ChannelAddTelegram setOpenWarning={setOpenWarning}/>
        if(listchannels.twitter) return <ChannelAddTwitter setOpenWarning={setOpenWarning}/>
        if(listchannels.twitterDM) return <ChannelAddTwitterDM setOpenWarning={setOpenWarning}/>
        if(listchannels.chatWeb) return <ChannelAddChatWeb setOpenWarning={setOpenWarning}/>
        if(listchannels.email) return <div>email</div>
        if(listchannels.phone) return <div>phone</div>
        if(listchannels.sms) return <div>sms</div>
        if(listchannels.android) return <ChannelAddAndroid setOpenWarning={setOpenWarning}/>
        if(listchannels.apple) return <ChannelAddIos setOpenWarning={setOpenWarning}/>
        else {
            setStep(4)
            return(<div>error no more channels</div>)
        }
    }

    return <RateExperience />;
}
export default RightSideMenu