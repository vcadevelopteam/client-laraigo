/* eslint-disable react-hooks/exhaustive-deps */
import React, { FC, Fragment, useMemo, useState } from "react";
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';

import { Avatar, Button, Tabs } from "@material-ui/core";
import { langKeys } from "lang/keys";
import { makeStyles } from '@material-ui/core/styles';
import { useDispatch } from "react-redux";
import { useSelector } from 'hooks';
import { useTranslation } from "react-i18next";
import { AntTab, FieldView, FieldEditAdvanced, FieldSelect, FieldEdit, FieldMultiSelect, DateRangePicker } from 'components';
import { FacebookColor, InstagramColor, TwitterColor, YouTubeColor, LinkedInColor, TikTokColor, CalendarIcon } from "icons";
import { Edit, Delete, CameraAlt, PlayCircleOutlineSharp, Facebook, Instagram, YouTube, LinkedIn, Twitter, MusicNote, Timelapse, Save, Send, ThumbUp, ChatBubble, Reply, Replay, AccountCircle } from '@material-ui/icons';
import TableZyx from "components/fields/table-simple";
import { Dictionary } from "@types";
import { useQueryParams } from "components/fields/table-paginated";
import { Range } from 'react-date-range';
import { getDateCleaned } from "common/helpers/functions";


const useStyles = makeStyles((theme) => ({
    button: {
        fontSize: '14px',
        fontWeight: 500,
        padding: 12,
        textTransform: 'initial',
        width: 'auto',
        marginLeft: '4px',
        marginRight: '4px',
    },
    containerLeft: {
        [theme.breakpoints.down('xs')]: {
            minWidth: '100vw',
            height: '100vh',
        },
        flex: 1,
        overflowY: 'auto',
        margin: 4,
        border: '1px solid #762AA9',
        borderRadius: '4px',
        marginBottom: '28px',
    },
    itemDate: {
        minHeight: 40,
        height: 40,
        border: '1px solid #bfbfc0',
        borderRadius: 4,
        color: 'rgb(143, 146, 161)'
    },
    root: {
        backgroundColor: 'white',
        flex: 1,
        height: '100%',
        overflowX: 'hidden',
        overflowY: 'auto',
        padding: 16,
        width: '100%',
    },
}));
const selectionKey = 'historyid';
const PostCreatorHistory: FC = () => {
    const { t } = useTranslation();

    const dispatch = useDispatch();

    const classes = useStyles();
    const mainResult = useSelector(state => state.main.mainData);
    const multiResult = useSelector(state => state.main.multiData);

    const [pageSelected, setPageSelected] = useState(0);

    return (
        <React.Fragment>
            <div style={{ width: '100%' }}>
                <Tabs
                    value={pageSelected}
                    indicatorColor="primary"
                    variant="fullWidth"
                    style={{ border: '1px solid #EBEAED', backgroundColor: '#FFF', marginTop: 8 }}
                    textColor="primary"
                    onChange={(_, value) => setPageSelected(value)}
                >
                    <AntTab label={t(langKeys.published)} />
                    <AntTab label={t(langKeys.history_scheduled)} />
                    <AntTab label={t(langKeys.drafts)} />
                </Tabs>
                {pageSelected === 0 &&
                    <div style={{ marginTop: 4 }}>
                        <PublishedHistory dataChannel={null} publishType={'TEXT'} />
                    </div>
                }
                {pageSelected === 1 &&
                    <div style={{ marginTop: 4 }}>
                        <PublishedHistory dataChannel={null} publishType={'IMAGE'} />
                    </div>
                }
                {pageSelected === 2 &&
                    <div style={{ marginTop: 4 }}>
                        <PublishedHistory dataChannel={null} publishType={'VIDEO'} />
                    </div>
                }
            </div>
        </React.Fragment>
    )
}
const initialRange = {
    startDate: new Date(new Date().setDate(1)),
    endDate: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0),
    key: 'selection'
}

const formatDate = (strDate: string) => {
    if (!strDate || strDate === '') return '';

    const date = new Date(strDate);
    const day = date.toLocaleDateString("en-US", { day: '2-digit' });
    const month = date.toLocaleDateString("en-US", { month: '2-digit' });
    const year = date.toLocaleDateString("en-US", { year: 'numeric' });

    return `${day}/${month}/${year}`;
}
const PublishedHistory: React.FC<{ dataChannel: any, publishType: string }> = ({ dataChannel, publishType }) => {
    const classes = useStyles();

    const { t } = useTranslation();
    const [selectedRows, setSelectedRows] = useState<Dictionary>({});
    const [cleanSelected, setCleanSelected] = useState(false)
    const [openDateRangeCreateDateModal, setOpenDateRangeCreateDateModal] = useState(false);
    const [dateRangeCreateDate, setDateRangeCreateDate] = useState<Range>(initialRange);
    const [filters, setfilters] = useState<any>({
        type: ""
    });


    const [customizeType, setCustomizeType] = useState('Facebook');
    const [checkBox, setCheckBox] = useState(false);
    const [previewType, setPreviewType] = useState('FACEBOOKPREVIEW');
    const [openModal, setOpenModal] = useState(false);

    const data=[
        {historyid: 1,title: "title1", pageofc:"pagina oficial 1",publicationdate: "2021-9-6", scope: 100, interactions: 0, likesandreactions: 50, imgurl:"https://upload.wikimedia.org/wikipedia/commons/thumb/b/b6/Image_created_with_a_mobile_phone.png/640px-Image_created_with_a_mobile_phone.png"},
        {historyid: 2,title: "title2", pageofc:"pagina oficial 2",publicationdate: "2021-9-7", scope: 140, interactions: 0, likesandreactions: 70, imgurl:"https://upload.wikimedia.org/wikipedia/commons/thumb/b/b6/Image_created_with_a_mobile_phone.png/640px-Image_created_with_a_mobile_phone.png"},
        {historyid: 3,title: "title3", pageofc:"pagina oficial 3",publicationdate: "2021-9-8", scope: 200, interactions: 0, likesandreactions: 85, imgurl:"https://upload.wikimedia.org/wikipedia/commons/thumb/b/b6/Image_created_with_a_mobile_phone.png/640px-Image_created_with_a_mobile_phone.png"},
        {historyid: 4,title: "title4", pageofc:"pagina oficial 4",publicationdate: "2021-9-9", scope: 240, interactions: 0, likesandreactions: 90, imgurl:"https://upload.wikimedia.org/wikipedia/commons/thumb/b/b6/Image_created_with_a_mobile_phone.png/640px-Image_created_with_a_mobile_phone.png"},
    ]
    const columns = React.useMemo(() => [
            {
                Header: t(langKeys.title),
                accessor: 'historyid',
                width: "auto",
                isComponent: true,
                NoFilter: true,
                Cell: (props: any) => {
                    const { title,pageofc,imgurl } = props.cell.row.original;
                    return (
                    <div style={{display:"flex"}}>
                        <div><img width={50} height={50} src={imgurl}></img></div>
                        <div>
                            <div style={{display:"flex", fontSize: "1.1em"}}>{title}</div>
                            <div style={{display:"flex", fontSize: "1em"}}><Avatar style={{width:20,height:20}}/>{pageofc}</div>
                        </div>
                    </div>
                )}
            },
            {
                Header: t(langKeys.publicationdate),
                accessor: 'publicationdate',
                width: "auto",
                NoFilter: true,
                Cell: (props: any) => {
                    const { publicationdate } = props.cell.row.original;
                    return (new Date(publicationdate)).toDateString()
                }
            },
            {
                Header: t(langKeys.scope),
                accessor: 'scope',
                width: "auto",
                NoFilter: true,
                Cell: (props: any) => {
                    const { scope } = props.cell.row.original;
                    return <>{scope} {t(langKeys.peoplereached)}</>
                }
            },
            {
                Header: t(langKeys.interaction_plural),
                accessor: 'interactions',
                width: "auto",
                NoFilter: true,
            },
            {
                Header: t(langKeys.likesandreactions),
                accessor: 'likesandreactions',
                width: "auto",
                NoFilter: true,
                Cell: (props: any) => {
                    const { likesandreactions } = props.cell.row.original;
                    return <>{likesandreactions} {t(langKeys.like)}</>
                }
            },
        ],
        []
    );

    return (
        
        <div style={{ height: '100%', width: 'inherit' }}>
            <TableZyx
                columns={columns}
                data={data}
                loading={false}
                useSelection={true}
                selectionKey={selectionKey}
                setSelectedRows={setSelectedRows}
                initialSelectedRows={selectedRows}
                onClickRow={()=>{}}
                cleanSelection={cleanSelected}
                setCleanSelection={setCleanSelected}
                register={false}
                download={false}
                filterGeneral={false}
                ButtonsElement={() => (
                    <div style={{display:"flex", width: "100%", justifyContent: "space-between", paddingTop: 10}}>
                        <div style={{display:"flex", gap: 8}}>
                            <FieldMultiSelect
                                onChange={(value) => {}}
                                size="small"
                                label={t(langKeys.posttype)}
                                style={{ maxWidth: 300, minWidth: 200 }}
                                variant="outlined"
                                loading={false}
                                data={[]}
                                optionValue="type"
                                optionDesc="communicationchanneldesc"
                                valueDefault={filters.type}
                            />
                            <FieldMultiSelect
                                onChange={(value) => {}}
                                size="small"
                                label={t(langKeys.filter)}
                                style={{ maxWidth: 300, minWidth: 200 }}
                                variant="outlined"
                                loading={false}
                                data={[]}
                                optionValue="type"
                                optionDesc="communicationchanneldesc"
                                valueDefault={filters.type}
                            />

                        </div>
                        <div style={{display:"flex"}}>
                            <DateRangePicker
                                open={openDateRangeCreateDateModal}
                                setOpen={setOpenDateRangeCreateDateModal}
                                range={dateRangeCreateDate}
                                onSelect={setDateRangeCreateDate}
                            >
                                <Button
                                    className={classes.itemDate}
                                    startIcon={<CalendarIcon />}
                                    onClick={() => setOpenDateRangeCreateDateModal(!openDateRangeCreateDateModal)}
                                >
                                    {getDateCleaned(dateRangeCreateDate.startDate!) + " - " + getDateCleaned(dateRangeCreateDate.endDate!)}
                                </Button>
                            </DateRangePicker>
                        </div>
                    </div>
                )}
            />
        </div>
    )
}


export default PostCreatorHistory;