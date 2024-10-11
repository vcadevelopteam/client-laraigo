import React from 'react'; 
import { FieldView, FieldEdit, FieldSelect } from 'components';
import { useTranslation } from 'react-i18next';
import { langKeys } from 'lang/keys';
import { FormControl } from '@material-ui/core';
import TemplatePreview from '../extra/TemplatePreview';
import { campaignsGeneralStyles} from 'pages/campaign/styles';
import { DetailPropsGeneral } from 'pages/campaign/model';
import { Dictionary } from '@types';

export const CampaignGeneral: React.FC<DetailPropsGeneral> = ({ row, edit, multiData }) => {
    const classes = campaignsGeneralStyles();
    const { t } = useTranslation();
    const dataMessageTemplate = [...multiData[3] && multiData[3].success ? multiData[3].data : []];
    const selectedTemplate = dataMessageTemplate.find(template => template.id === 5843) || {};

    const dataExecutionType: Dictionary = {
        MANUAL: 'manual',
        SCHEDULED: 'scheduled',
    };
    
    const dataSource: Dictionary = {
        INTERNAL: 'datasource_internal',
        EXTERNAL: 'datasource_external',
        PERSON: 'datasource_person',
        LEAD: 'datasource_lead'
    };

    return (
        <React.Fragment>
            
            <div className={classes.generalContainer}>

                <div className={classes.fieldsContainer}>

                    <div className="row-zyx">
                        {edit ?
                            <FormControl className="col-12">                          
                                <div style={{ fontSize: '1rem', color: 'black' }}> {t(langKeys.title)} </div>
                                <div className={classes.subtitle}> {t(langKeys.campaign_title_desc)} </div>                        
                                <FieldEdit                      
                                    variant="outlined"
                                    className="col-12"
                                    valueDefault={''}
                                />                   
                            </FormControl>                                          
                            :
                            <FieldView
                                label={t(langKeys.title)}
                                value={row?.title || ""}
                                className="col-12"
                            />
                        }
                        {edit ?
                        
                        <FormControl className="col-12" >                     
                            <div style={{ fontSize: '1rem', color: 'black' }}> {t(langKeys.description)} </div>
                            <div className={classes.subtitle}> {t(langKeys.campaign_description_desc)} </div>                    
                            <FieldEdit   
                                variant="outlined"                 
                                className="col-12"
                                valueDefault={''} 
                            />               
                        </FormControl>  
                            :
                            <FieldView
                                label={t(langKeys.description)}
                                value={row?.description || ""}
                                className="col-12"
                            />
                        }
                    </div>

                    <div className="row-zyx">
                        {edit ?                            
                            <FormControl className="col-6">                          
                                <div style={{ fontSize: '1rem', color: 'black' }}> {t(langKeys.startdate)} </div>
                                <div className={classes.subtitle}> {t(langKeys.campaign_startdate_desc)} </div>
                                <FieldEdit   
                                    variant="outlined"                 
                                    type="date"                               
                                    className="col-6"
                                    valueDefault={''} 
                                />      
                            </FormControl>                         
                            :
                            <FieldView
                                label={t(langKeys.startdate)}
                                value={row?.startdate || ""}
                                className="col-6"
                            />
                        }
                        {edit ?
                            <FormControl className="col-6">                          
                                <div className={classes.title}> {t(langKeys.enddate)} </div>
                                <div className={classes.subtitle}> {t(langKeys.campaign_enddate_desc)} </div>
                                <FieldEdit   
                                    variant="outlined"                 
                                    type="date"                            
                                    className="col-6"
                                    valueDefault={''} 
                                />         
                            </FormControl>                          
                            :
                            <FieldView
                                label={t(langKeys.enddate)}
                                value={row?.enddate || ""}
                                className="col-6"
                            />
                        }
                        {edit ?
                            <FormControl className="col-12" >                      
                                <div style={{ fontSize: '1rem', color: 'black' }}> {t(langKeys.source)} </div>
                                <div className={classes.subtitle}> {t(langKeys.campaign_origin_desc)} </div>                          
                                <FieldSelect
                                    variant="outlined"       
                                    uset={true}                            
                                    className="col-12"
                                    valueDefault={''} 
                                    data={[]}
                                    optionDesc="value"
                                    optionValue="key"
                                />
                            </FormControl>                       
                            :
                            <FieldView
                                label={t(langKeys.source)}
                                value={t(dataSource[row?.source]) || ""}
                                className="col-12"
                            />
                        }
                        {edit ?
                            <>
                                <div className="row-zyx" style={{ display: 'flex', marginBottom: '0', padding:'1rem 1rem 0 0' }}>
                                    <FormControl className="col-6" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                                        <div>
                                            <div style={{ fontSize: '1rem', color: 'black' }}> {t(langKeys.executiontype)} </div>
                                            <div className={classes.subtitle}> {t(langKeys.campaign_executiontype_desc)} </div>
                                        </div>
                                        <div style={{ marginTop: 'auto' }}>
                                            <FieldSelect
                                                variant="outlined"
                                                uset={true}
                                                className={classes.flexgrow1}
                                                valueDefault={''} 
                                                data={[]}
                                                optionDesc="value"
                                                optionValue="key"
                                            />
                                        </div>
                                    </FormControl>
                                    {edit &&
                                        <>
                                            <FormControl className="col-3" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                                                <div>
                                                    <div style={{ fontSize: '1rem', color: 'black' }}> {t(langKeys.date)} </div>
                                                    <div className={classes.subtitle}> {t(langKeys.campaign_execution_date)} </div>
                                                </div>
                                                <div style={{ marginTop: 'auto' }}>
                                                    <FieldEdit
                                                        variant="outlined"
                                                        type="date"
                                                        className="col-6"
                                                        valueDefault={''}
                                                    />
                                                </div>
                                            </FormControl>

                                            <FormControl className="col-3" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                                                <div>
                                                    <div className={classes.title}> {t(langKeys.hour)} </div>
                                                    <div className={classes.subtitle}> {t(langKeys.campaign_execution_time)} </div>
                                                </div>
                                                <div style={{ marginTop: 'auto' }}>
                                                    <FieldEdit
                                                        variant="outlined"
                                                        type="time"
                                                        className="col-6"                                            
                                                        valueDefault={''}
                                                    />
                                                </div>
                                            </FormControl>
                                        </>
                                    }
                                    {edit ?
                                        <FormControl style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                                            <div>
                                                <div style={{ fontSize: '1rem', color: 'black' }}>{t(langKeys.group)}</div>
                                                <div className={classes.subtitle}>{t(langKeys.campaign_group_desc)}</div>
                                            </div>
                                            <div style={{ marginTop: 'auto' }}>
                                                <FieldSelect
                                                    variant="outlined"
                                                    valueDefault={''}
                                                    data={[]}
                                                    optionDesc="domaindesc"
                                                    optionValue="domainvalue"
                                                />
                                            </div>
                                        </FormControl>
                                        :
                                        <FieldView
                                            label={t(langKeys.group)}
                                        />
                                    }
                                </div>
                            </>
                            :
                            <FieldView
                                label={t(langKeys.executiontype)}
                                value={t(dataExecutionType[row?.executiontype]) || ""}
                                className="col-6"
                            />
                        }
                    </div>

                    <div className="row-zyx">
                        {edit ?
                            <FormControl className="col-12" >                      
                                <div style={{ fontSize: '1rem', color: 'black' }}> {t(langKeys.channel)} </div>
                                <div className={classes.subtitle}> {t(langKeys.campaign_channel_desc)} </div>
                                <FieldSelect
                                    variant="outlined"      
                                    className="col-12"
                                    valueDefault={''}
                                    data={[]}
                                    optionDesc="communicationchanneldesc"
                                    optionValue="communicationchannelid"
                                />
                            </FormControl>                       
                            :
                            <FieldView
                                label={t(langKeys.type)}
                                className="col-12"
                            />
                        }                 
                    </div>    

                    <div className="row-zyx" style={{ display: 'flex', padding:'0rem 1rem 0 0'  }}>
                        {edit ?
                            <FormControl className="col-6" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                                <div>
                                    <div style={{ fontSize: '1rem', color: 'black' }}> {t(langKeys.status)} </div>
                                    <div className={classes.subtitle}> {t(langKeys.campaign_status_desc)} </div>
                                </div>
                                <div style={{ marginTop: 'auto' }}>
                                    <FieldSelect
                                        variant="outlined"
                                        valueDefault={''}
                                        data={[]}
                                        optionDesc="domaindesc"
                                        optionValue="domainvalue"
                                    />
                                </div>
                            </FormControl>
                            :
                            <FieldView
                                label={t(langKeys.status)}
                                className="col-6"
                            />
                        }

                        {edit ?
                            <FormControl className="col-6" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                                <div>
                                    <div style={{ fontSize: '1rem', color: 'black' }}> {t(langKeys.messagetype)} </div>
                                    <div className={classes.subtitle}> {t(langKeys.campaign_messagetype_desc)} </div>
                                </div>
                                <div style={{ marginTop: 'auto' }}>
                                    <FieldSelect
                                        variant="outlined"
                                        uset={true}
                                        className="col-6"    
                                        valueDefault={''}                               
                                        data={[]}
                                        optionDesc="value"
                                        optionValue="key"
                                    />
                                </div>
                            </FormControl>
                            :
                            <FieldView
                                label={t(langKeys.messagetype)}
                                //value={t(filterDataCampaignType().filter(d => d.key === row?.type)[0]?.value) || ""}
                                className="col-6"
                            />
                        }
                    </div> 

                    {['HSM'].includes(('type')) ?
                        <div className="row-zyx">
                            {edit ?
                                <FormControl className="col-12" >                     
                                    <div style={{ fontSize: '1rem', color: 'black' }}> {t(langKeys.messagetemplate)} </div>
                                    <div className={classes.subtitle}> {t(langKeys.campaign_comunicationtemplate_desc)} </div>
                                    <FieldSelect                                   
                                        variant="outlined"                                       
                                        valueDefault={''}
                                        data={[]}
                                        optionDesc="name"
                                        optionValue="id"
                                    />
                                </FormControl>                              
                                :
                                <FieldView
                                    label={t(langKeys.messagetemplate)}
                                    //value={dataMessageTemplate.filter(d => d.id === row?.messagetemplateid)[0].name || ""}
                                    className="col-12"
                                />
                            }
                        
                        </div>
                    : null}

                    {['SMS', 'MAIL', 'HTML'].includes(('type')) ?
                        <div className="row-zyx">
                            {edit ?
                                <FormControl className="col-6" >                     
                                    <div style={{ fontSize: '1rem', color: 'black' }}> {t(langKeys.messagetemplate)} </div>
                                    <div className={classes.subtitle}> {t(langKeys.campaign_comunicationtemplate_desc)} </div>
                                    <FieldSelect
                                        variant="outlined"                                       
                                        valueDefault={''}
                                        data={[]}
                                        optionDesc="name"
                                        optionValue="id"
                                    />
                                </FormControl>                                
                                :
                                <FieldView
                                    label={t(langKeys.messagetemplate)}
                                    className="col-6"
                                />
                            }
                        </div>
                    : null}

                </div>
                
                <div className={classes.templateContainer}>
                    <div className={classes.templateTitle}>{t(langKeys.templatePreview)}</div> 
                    <TemplatePreview 
                        selectedTemplate={selectedTemplate} 
                    />
                </div>           
            </div>           
        </React.Fragment>
    )
}