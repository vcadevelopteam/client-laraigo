export const columnsHideGraphic = {
    interaction: {
        interactiondatehour: true,
        channel: true,  
        agent: true,
        ticketgroup: true,
        person: true,
        originalname: true,
        clientnumber: true,
        email: true,
        personcommunicationchannel: true,
    },
    userproductivityhours: {
        busytimewithinwork: true,
        freetimewithinwork: true,  
        busytimeoutsidework: true,
        availabletime: true,
        idletime: true,
        idletimewithoutattention: true,
        qtydisconnection: true,   
    },   
    reportvoicecall: {
        ticketnum: true,
        tickettime: true,  
        finishtime: true,
        handoffdate: true,
        phone: true,
        totalduration: true,
        agentduration: true,  
        customerwaitingduration: true,
        holdingtime: true,  
        transferduration: true,
    },
    loginhistory: {
        datehour: true,
        motivedescription: true,         
    },
};

export interface ColumnsHideShowType {
    [key: string]: {
        [key: string]: boolean;
    };
}

export const columnsHideShow: ColumnsHideShowType = {
    productivity: {
        email: true,
        starttime: true,
        endtime: true,
        derivationdate: true,
        derivationtime: true, 
        firstinteractiondateagent: true,
        firstinteractiontime: true,
        tmo: true, 
        tmoagent: true,
        tmeagent: true,
        holdingholdtime: true,
        suspensiontime: true, 
        avgagentresponse: true,
        swingingtimes: true,
        tags: true,  
    },
    campaignreport: {
        executiontype: true,
        executionuser: true,
        executionuserprofile: true,
        total: true,
        success: true, 
        successp: true,
        fail: true,
        failp: true, 
        attended: true,
        locked: true,
        blacklisted: true,      
    },
    tipification: {       
        enddate: true,
        endtime: true,
        firstinteractiondate: true,
        firstinteractiontime: true, 
        person: true,
        phone: true,
        closedby: true, 
        agent: true,
        closetype: true,
        channel: true,  
    },
    interaction: {
        interactiondatehour: true,
        channel: true,  
        agent: true,
        ticketgroup: true,
        person: true,
        originalname: true,
        clientnumber: true,
        email: true,
        personcommunicationchannel: true,
    },
    userproductivityhours: {
        busytimewithinwork: true,
        freetimewithinwork: true,  
        busytimeoutsidework: true,
        availabletime: true,
        idletime: true,
        qtyconnection: true,
        qtydisconnection: true,   
    },
    reportrequestsd: {
        channel: true,
        resolution: true,  
        reportdate: true,
        dateofresolution: true,       
    },
    loginhistory: {
        username: true,
        type: true,  
        motivedescription: true,
    },     
}

export const columnGroupedBy = {
    productivity: {
        interactiondatehour: true,
        channel: true,  
        agent: true,
        ticketgroup: true,
        person: true,
        originalname: true,
        clientnumber: true,
        email: true,
        personcommunicationchannel: true,
    },
   
}