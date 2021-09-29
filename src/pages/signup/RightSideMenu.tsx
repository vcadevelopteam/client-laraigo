/* eslint-disable react-hooks/exhaustive-deps */
import { FC, useState } from "react";
import { Dictionary } from "@types";
import {FirstStep} from './FirstStep';
import {SecondStep} from './SecondStep';
import {ThirdStep} from './ThirdStep';
import {LastStep} from './LastStep';
import {ChannelAddFacebook} from './ChannelAddFacebook'
import {ChannelAddInstagram} from './ChannelAddInstagram'
import {ChannelAddMessenger} from './ChannelAddMessenger'
import {ChannelAddWhatsapp} from './ChannelAddWhatsapp'
import {ChannelAddTelegram} from './ChannelAddTelegram'
import {ChannelAddTwitter} from './ChannelAddTwitter'
import {ChannelAddTwitterDM} from './ChannelAddTwitterDM'
import {ChannelAddChatWeb} from './ChannelAddChatWeb'


export const RightSideMenu: FC<{setSnackbar:(param:any)=>void,setBackdrop:(param:any)=>void,setStep:(param:any)=>void,step:any}> = ({setSnackbar,setBackdrop,setStep,step}) => {
    const [mainData, setMainData] = useState<Dictionary>({
        email: "",
        password: "",
        confirmpassword: "",
        firstandlastname: "",
        companybusinessname: "",
        mobilephone: "",
        facebookid: "",
        googleid: "",
        sales: false,
        customerservice: false,
        marketing: false,
    });
    const [requestchannels, setrequestchannels] = useState([]);
    const [sendchannels, setsendchannels] = useState(false);

    const [listchannels, setlistchannels] = useState<Dictionary>({
        facebook:false,
        instagram: false,
        messenger: false,
        whatsapp: false,
        telegram: false,
        twitter: false,
        twitterDM: false,
        chatWeb: false,
        email: false,
        phone: false,
        sms: false,
    });

    if(step===1){
        return(
            <FirstStep
                setMainData={setMainData}
                mainData={mainData}
                setStep={setStep}
                setSnackbar={setSnackbar}
            ></FirstStep>
        )
    }else if(step===2){
        return (
            <SecondStep
                setMainData={setMainData}
                mainData={mainData}
                setStep={setStep}
            >
            </SecondStep>
        )
    }else if(step===3&&!sendchannels){
        return (
            <ThirdStep
                setlistchannels={setlistchannels}
                listchannels={listchannels}
                setStep={setStep}
                setsendchannels={setsendchannels}
            >
            </ThirdStep>
        )
    }
    else if(step===3&&sendchannels){
        if(listchannels.facebook) return <ChannelAddFacebook  setrequestchannels={setrequestchannels} setlistchannels={setlistchannels}/>
        if(listchannels.instagram) return <ChannelAddInstagram  setrequestchannels={setrequestchannels} setlistchannels={setlistchannels}/>
        if(listchannels.messenger) return <ChannelAddMessenger setrequestchannels={setrequestchannels} setlistchannels={setlistchannels}/>
        if(listchannels.whatsapp) return <ChannelAddWhatsapp setrequestchannels={setrequestchannels} setlistchannels={setlistchannels}/>
        if(listchannels.telegram) return <ChannelAddTelegram setrequestchannels={setrequestchannels} setlistchannels={setlistchannels}/>
        if(listchannels.twitter) return <ChannelAddTwitter setrequestchannels={setrequestchannels} setlistchannels={setlistchannels}/>
        if(listchannels.twitterDM) return <ChannelAddTwitterDM setrequestchannels={setrequestchannels} setlistchannels={setlistchannels}/>
        if(listchannels.chatWeb) return <ChannelAddChatWeb setrequestchannels={setrequestchannels} setlistchannels={setlistchannels}/>
        if(listchannels.email) return <div>email</div>
        if(listchannels.phone) return <div>phone</div>
        if(listchannels.sms) return <div>sms</div>
        else {
            setStep(4)
            console.log(requestchannels)
            return(<div>error no more channels</div>)
        }
    }
    else {
        return(
            <LastStep
                mainData={mainData}
                requestchannels={requestchannels}
                setSnackbar={setSnackbar}
                setBackdrop={setBackdrop}
            ></LastStep>
        )
    }
}
export default RightSideMenu