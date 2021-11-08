/* eslint-disable react-hooks/exhaustive-deps */
import { FC } from "react";
import {FirstStep} from './FirstStep';
import {SecondStep} from './SecondStep';
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


export const RightSideMenu: FC<{
    setSnackbar:(param:any)=>void,
    setBackdrop:(param:any)=>void,
    setStep:(param:any)=>void,
    step:any,
    setMainData:(param:any)=>void,
    mainData:any,
    setOpenWarning:(param:any)=>void,
    requestchannels:any,
    setrequestchannels:(param:any)=>void,
    sendchannels:any,
    setsendchannels:(param:any)=>void,
    listchannels:any,
    setlistchannels:(param:any)=>void,
}> = 
    ({setSnackbar,setBackdrop,setStep,step,setMainData,mainData,setOpenWarning,requestchannels,setrequestchannels,sendchannels,setsendchannels,listchannels,setlistchannels}) => {

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
                setOpenWarning={setOpenWarning}
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
                setrequestchannels={setrequestchannels}
                setOpenWarning={setOpenWarning}
            >
            </ThirdStep>
        )
    }
    else if(step===3&&sendchannels){
        if(listchannels.facebook) return <ChannelAddFacebook  setrequestchannels={setrequestchannels} setlistchannels={setlistchannels} setOpenWarning={setOpenWarning}/>
        if(listchannels.instagram) return <ChannelAddInstagram  setrequestchannels={setrequestchannels} setlistchannels={setlistchannels} setOpenWarning={setOpenWarning}/>
        if(listchannels.instagram) return <ChannelAddInstagramDM  setrequestchannels={setrequestchannels} setlistchannels={setlistchannels} setOpenWarning={setOpenWarning}/>
        if(listchannels.messenger) return <ChannelAddMessenger setrequestchannels={setrequestchannels} setlistchannels={setlistchannels} setOpenWarning={setOpenWarning}/>
        if(listchannels.whatsapp) return <ChannelAddWhatsapp setrequestchannels={setrequestchannels} setlistchannels={setlistchannels} setOpenWarning={setOpenWarning}/>
        if(listchannels.telegram) return <ChannelAddTelegram setrequestchannels={setrequestchannels} setlistchannels={setlistchannels} setOpenWarning={setOpenWarning}/>
        if(listchannels.twitter) return <ChannelAddTwitter setrequestchannels={setrequestchannels} setlistchannels={setlistchannels} setOpenWarning={setOpenWarning}/>
        if(listchannels.twitterDM) return <ChannelAddTwitterDM setrequestchannels={setrequestchannels} setlistchannels={setlistchannels} setOpenWarning={setOpenWarning}/>
        if(listchannels.chatWeb) return <ChannelAddChatWeb setrequestchannels={setrequestchannels} setlistchannels={setlistchannels} setOpenWarning={setOpenWarning}/>
        if(listchannels.email) return <div>email</div>
        if(listchannels.phone) return <div>phone</div>
        if(listchannels.sms) return <div>sms</div>
        if(listchannels.android) return <ChannelAddAndroid setrequestchannels={setrequestchannels} setlistchannels={setlistchannels} setOpenWarning={setOpenWarning}/>
        if(listchannels.apple) return <ChannelAddIos setrequestchannels={setrequestchannels} setlistchannels={setlistchannels} setOpenWarning={setOpenWarning}/>
        else {
            setStep(4)
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
                setStep={setStep}
                setsendchannels={setsendchannels}
                setOpenWarning={setOpenWarning}
            ></LastStep>
        )
    }
}
export default RightSideMenu