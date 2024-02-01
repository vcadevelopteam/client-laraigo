import React, { FC, useCallback, useEffect, useRef, useState } from "react";
import clsx from "clsx";
import { Box, BoxProps, Button, IconButton, makeStyles, Popover, TextField, Typography } from "@material-ui/core";
import { Add, MoreVert as MoreVertIcon, Traffic, Add as AddIcon } from "@material-ui/icons";
import CloseIcon from "@material-ui/icons/Close";
import { DraggableProvided, DraggableStateSnapshot, DroppableStateSnapshot } from "react-beautiful-dnd";
import { langKeys } from "lang/keys";
import { Trans, useTranslation } from "react-i18next";
import { Rating } from "@material-ui/lab";
import { useHistory } from "react-router";
import paths from "common/constants/paths";
import { Dictionary, ICrmLead } from "@types";
import { FieldEdit, FieldSelect } from "components";
import { useSelector } from "hooks";
import { getSecondsUntelNow, secondsToTime, selOrderConfig } from "common/helpers";
import { TrafficIndividualConfigurationModal, TrafficLightConfigurationModal } from "./Modals";
import { getCollection } from "store/main/actions";
import { useDispatch } from "react-redux";
const isIncremental = window.location.href.includes("incremental");

const columnWidth = 275;
const columnMinHeight = 500;
const cardBorderRadius = 12;
const inputTitleHeight = 50;

interface LeadCardContentProps extends Omit<BoxProps, "onClick"> {
    lead: ICrmLead;
    snapshot: DraggableStateSnapshot;
    onDelete?: (value: ICrmLead) => void;
    onClick?: (lead: ICrmLead) => void;
    onCloseLead?: (lead: ICrmLead) => void;
    configuration: Dictionary
}

const useLeadCardStyles = makeStyles((theme) => ({
    root: {
        padding: 16,
        minHeight: "50px",
        backgroundColor: "white",
        color: theme.palette.text.primary,
        display: "flex",
        flexDirection: "column",
        position: "relative",
        borderRadius: cardBorderRadius,

        "-webkit-touch-callout": "none" /* iOS Safari */,
        "-webkit-user-select": "none" /* Safari */,
        "-khtml-user-select": "none" /* Konqueror HTML */,
        "-moz-user-select": "none" /* Old versions of Firefox */,
        "-ms-user-select": "none" /* Internet Explorer/Edge */,
        userSelect: "none",
    },
    rootDragging: {
        opacity: 0.9,
    },
    floatingMenuIcon: {
        position: "absolute",
        top: 8,
        right: 8,
        width: 22,
        height: 22,
        maxHeight: 22,
        maxWidth: 22,
    },
    title: {
        fontSize: 16,
        fontWeight: 700,
        marginBottom: theme.spacing(1),
    },
    info: {
        fontSize: 14,
        fontWeight: 400,
        marginBottom: theme.spacing(0.5),
    },
    tagsRow: {
        display: "flex",
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "flex-start",
    },
    tag: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        marginRight: theme.spacing(1),
        marginBottom: 4,
        minHeight: 16.67,
    },
    tagCircle: {
        width: 8,
        height: 8,
        borderRadius: 4,
    },
    tagBox: {
        width: 8,
        height: 8,
        borderRadius: 1,
    },
    tagtext: {
        fontSize: 12,
        fontWeight: 400,
        textTransform: "capitalize",
    },
    popoverPaper: {
        maxWidth: 100,
    },
    footer: {
        display: "flex",
        flexDirection: "row",
        width: "100%",
        alignItems: "center",
    },
    greenLight: {
        backgroundColor: 'green',
        color: 'white',
        borderRadius: 10
    },
    redLight: {
        backgroundColor: '#7721AD',
        color: 'white',
        borderRadius: 10
    },
    yellowLight: {
        backgroundColor: 'yellow',
        color: 'black',
        borderRadius: 10
    },
}));

export const DraggableLeadCardContent: FC<LeadCardContentProps> = ({
    lead,
    snapshot,
    onDelete,
    onClick,
    onCloseLead,
    configuration,
    ...boxProps
}) => {
    const classes = useLeadCardStyles();
    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
    const tags = lead.tags?.split(",")?.filter((e) => e !== "") || [];
    const products = (lead.leadproduct || null)?.split(",") || [];
    const urgencyLevels = [null, "LOW", "MEDIUM", "HIGH"];
    const colors = ["", "cyan", "red", "violet", "blue", "blueviolet"];
    const history = useHistory();
    const user = useSelector((state) => state.login.validateToken.user);

    const [openModal, setOpenModal] = useState(false);

    const getWeekDay = (date: Date) => {
        const days = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
        return days[date.getDay()];
    };

    const calculateTotalInactiveTime = (start: Date): number => {
        let totalInactiveTime = 0;
        const currentDate = new Date(start);

        const startTime = start.getHours() * 60 * 60 + start.getMinutes() * 60 + start.getSeconds();
        const dayEndTime = 86400;

        const nowDate = new Date();
        const nowDateWithoutTime = new Date(nowDate);
        nowDateWithoutTime.setHours(0,0,0,0)
        currentDate.setHours(0,0,0,0)

        while (currentDate <= nowDateWithoutTime) {
            const now = new Date();
            const nowTime = now.getHours() * 60 * 60 + now.getMinutes() * 60 + now.getSeconds();
            const dayOfWeek = getWeekDay(currentDate);
            const [beginHours, beginMinutes] = configuration?.[`${dayOfWeek.toLowerCase()}begin`]?.split(':') || [null, null];
            const beginSeconds = parseInt(beginHours) * 3600 + parseInt(beginMinutes) * 60;
            const [endHours, endMinutes] = configuration?.[`${dayOfWeek.toLowerCase()}end`]?.split(':') || [null, null];
            const endSeconds = parseInt(endHours) * 3600 + parseInt(endMinutes) * 60;

            if(currentDate.getDate() === now.getDate() && currentDate.getMonth() === now.getMonth() && currentDate.getFullYear() === now.getFullYear() && 
            now.getDate() === start.getDate() && now.getMonth() === start.getMonth() && now.getFullYear() === start.getFullYear()) {
                if(beginSeconds && endSeconds){
                    if(startTime < beginSeconds) {
                        if(nowTime < beginSeconds){
                            totalInactiveTime += (nowTime - startTime)
                        } else if(beginSeconds <= nowTime && nowTime < endSeconds){
                            totalInactiveTime += (beginSeconds - startTime)
                        } else if(endSeconds <= nowTime){
                            totalInactiveTime += (beginSeconds - startTime)
                            totalInactiveTime += (nowTime - endSeconds)
                        }
                    } else if(beginSeconds <= startTime && startTime < endSeconds) {
                        if(nowTime <= endSeconds){
                            totalInactiveTime += 0
                        } else if(endSeconds < nowTime){
                            totalInactiveTime += (nowTime - endSeconds)
                        }
                    } else if(endSeconds <= startTime) {
                        totalInactiveTime += (nowTime - startTime)
                    }
                }
                else {
                    totalInactiveTime += (nowTime - startTime)
                }
            } else {
                if(currentDate.getDate() === now.getDate() && currentDate.getMonth() === now.getMonth() && currentDate.getFullYear() === now.getFullYear()){
                    if(beginSeconds && endSeconds) {
                        if(nowTime < beginSeconds) {
                            totalInactiveTime += nowTime
                        } else if(beginSeconds <= nowTime && nowTime < endSeconds) {
                            totalInactiveTime += beginSeconds
                        } else if(endSeconds <= nowTime) {
                            totalInactiveTime += (nowTime - endSeconds)
                            totalInactiveTime += beginSeconds
                        }
                    } else {
                        totalInactiveTime += nowTime
                    }
                } else if(currentDate.getDate() === start.getDate() && currentDate.getMonth() === start.getMonth() && currentDate.getFullYear() === start.getFullYear()) {
                    if(beginSeconds && endSeconds){
                        if(startTime < beginSeconds) {
                            totalInactiveTime += (beginSeconds - startTime)
                            totalInactiveTime += (dayEndTime - endSeconds)
                        } else if(beginSeconds <= startTime && startTime < endSeconds) {
                            totalInactiveTime += (dayEndTime - endSeconds)
                        } else if(endSeconds <= startTime) {
                            totalInactiveTime += (dayEndTime - startTime)
                        }
                    }
                    else {
                        totalInactiveTime += (dayEndTime - startTime)
                    }
                } else{
                    if(beginSeconds && endSeconds){
                        totalInactiveTime += beginSeconds
                        totalInactiveTime += (dayEndTime - endSeconds)
                    }
                    else {
                        totalInactiveTime += dayEndTime
                    }
                }
            }

            currentDate.setDate(currentDate.getDate() + 1); // Move to the next day
        }

        return totalInactiveTime;
    };

	const phasechangedate = lead.lastchangestatusdate || '';
    const dateInUTC = new Date(phasechangedate.replace('Z', ''));
    const dateWithSubtractedHours = new Date(dateInUTC.getTime() - (new Date().getTimezoneOffset()/60 * 3600 * 1000));

    const [inactiveTime, setInactiveTime] = useState<number>(() => {
        return calculateTotalInactiveTime(dateWithSubtractedHours);
    });
    const [time, settime] = useState(getSecondsUntelNow(dateWithSubtractedHours) - inactiveTime);

	React.useEffect(() => {
        const timer = setInterval(() => {
            const totalInactiveTime = calculateTotalInactiveTime(dateWithSubtractedHours);
            setInactiveTime(totalInactiveTime);

            const timeSeconds = getSecondsUntelNow(dateWithSubtractedHours);
            settime(timeSeconds - totalInactiveTime);
        }, 1000);

        return () => {
            timer && clearInterval(timer);
        };
    }, [configuration, time, inactiveTime]);

    const handleMoreVertClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleClick = useCallback(() => {
        history.push({
            pathname: paths.CRM_EDIT_LEAD.resolve(lead.leadid),
        });
    }, [lead, history]);

    const handleDelete = () => {
        setAnchorEl(null);
        onDelete?.(lead);
    };

    const handleOpenModal = () => {
        setAnchorEl(null);
        setOpenModal(true)
    }

    const open = Boolean(anchorEl);
    const id = open ? `lead-card-popover-${String(lead)}` : undefined;

    const getDynamicColorClass = (maxGreen: string, maxYellow: string, configuration: Dictionary) => {
        if (maxGreen !== null && maxYellow !== null) {
            if (0 <= time && time <= parseInt(maxGreen) * 60) {
                return classes.greenLight;
            } else if (parseInt(maxGreen) * 60 + 1 <= time && time <= parseInt(maxGreen) * 60 + parseInt(maxYellow) * 60) {
                return classes.yellowLight;
            } else {
                return classes.redLight;
            }
        } else if (configuration?.maxgreen !== null && configuration?.maxyellow !== null) {
            if (0 <= time && time <= parseInt(configuration?.maxgreen) * 60) {
                return classes.greenLight;
            } else if (parseInt(configuration?.maxgreen) * 60 + 1 <= time && time <= parseInt(configuration?.maxgreen) * 60 + parseInt(configuration?.maxyellow) * 60) {
                return classes.yellowLight;
            } else {
                return classes.redLight;
            }
        } else {
            if (0 <= time && time <= 18000) {
                return classes.greenLight;
            } else if (18001 <= time && time <= 36000) {
                return classes.yellowLight;
            } else {
                return classes.redLight;
            }
        }
    };
    
    const dynamicColorClass = getDynamicColorClass(lead.maxgreen, lead.maxyellow, configuration);

    return (
        <Box {...boxProps} style={{ position: "relative" }} pb={1}>
            
            <div    style={{ background: '#F9F9FA'}} className={clsx(classes.root, snapshot.isDragging && classes.rootDragging)} onClick={handleClick}>
                <span className={classes.title}>{lead.description}</span>
                {lead.campaign && (
                    <span className={classes.info}>
                        <Trans i18nKey={langKeys.campaign} />
                        {": "}
                        {lead.campaign}
                    </span>
                )}
                <span className={classes.info}>
                    {user?.currencysymbol || "S/."} {Number(lead.expected_revenue).toLocaleString("en-US")}
                </span>
                <span className={classes.info}>{lead.displayname}</span>
                {!!lead?.persontype && lead?.persontype !== null && (
                    <span style={{ fontWeight: "bold" }} className={classes.info}>
                        {lead.persontype}
                    </span>
                )}
                <div className={classes.tagsRow}>
                    {tags.map((tag: String, index: number) => (
                        <div className={classes.tag} key={index}>
                            <div className={classes.tagCircle} style={{ backgroundColor: colors[1] }} />
                            <div style={{ width: 6 }} />
                            <div className={classes.tagtext}>{tag}</div>
                        </div>
                    ))}
                </div>
                {products.length !== 0 && <div style={{ height: "0.25em" }} />}
                <div className={classes.tagsRow}>
                    {products.map((tag: String, index: number) => (
                        <div className={classes.tag} key={index}>
                            <div className={classes.tagCircle} style={{ backgroundColor: colors[2] }} />
                            <div style={{ width: 6 }} />
                            <div className={classes.tagtext}>{tag}</div>
                        </div>
                    ))}
                </div>
                <div className={classes.footer}>
                    <Rating
                        name="hover-feedback"
                        value={urgencyLevels.findIndex((x) => x === lead.priority)}
                        max={3}
                        readOnly
                    />
                    <div style={{ flexGrow: 1 }} />
                    <div className={clsx(dynamicColorClass)}>
                        <Box p={1}>
                            <Typography variant="body2">{parseInt(secondsToTime(time)) >= 0 ? secondsToTime(time) : secondsToTime(0)}</Typography>
                        </Box>
                    </div>
                </div>
            </div>

            <div className={classes.floatingMenuIcon}>
                {!isIncremental && (
                    <IconButton size="small" aria-describedby={id} onClick={handleMoreVertClick}>
                        <MoreVertIcon style={{ height: "inherit", width: "inherit" }} />
                    </IconButton>
                )}
                <Popover
                    id={id}
                    open={open}
                    anchorEl={anchorEl}
                    onClose={handleClose}
                    anchorOrigin={{
                        vertical: "bottom",
                        horizontal: "left",
                    }}
                    PaperProps={{
                        className: classes.popoverPaper,
                    }}
                >
                    {/* <Button
                        variant="text"
                        color="inherit"
                        fullWidth
                        type="button"
                        onClick={handleCloseLead}
                        style={{ fontWeight: "normal", textTransform: "uppercase" }}
                    >
                        <Trans i18nKey={langKeys.close} />
                    </Button> */}
                    <Button
                        variant="text"
                        color="inherit"
                        fullWidth
                        type="button"
                        onClick={handleDelete}
                        style={{ fontWeight: "normal", textTransform: "uppercase" }}
                    >
                        <Trans i18nKey={langKeys.delete} />
                    </Button>
                    <Button
                        variant="text"
                        color="inherit"
                        fullWidth
                        type="button"
                        onClick={handleOpenModal}
                        style={{ fontWeight: "normal", textTransform: "uppercase" }}
                    >
                        <Trans i18nKey={langKeys.trafficlight} />
                    </Button>
                </Popover>
                <TrafficIndividualConfigurationModal
                    openModal={openModal}
                    setOpenModal={setOpenModal}
                    lead={lead}
                />
            </div>
        </Box>
    );
};

interface InputTitleProps {
    defaultValue: string;
    edit: boolean;
    onChange?: (value: string) => void;
    onBlur?: (value: string) => void;
    className?: string;
    inputClasses?: string;
}

const useInputTitleStyles = makeStyles((theme) => ({
    root: {
        maxHeight: inputTitleHeight,
        height: inputTitleHeight,
        width: "inherit",
        alignItems: "center",
        display: "flex",
        justifyContent: "center",
    },
    title: {
        fontSize: "1.5em",
        fontWeight: 500,
        width: "inherit",
    },
    titleInput: {
        fontSize: "1.35em",
        fontWeight: 500,
    },
}));

const InputTitle: FC<InputTitleProps> = ({
    defaultValue,
    edit: enableEdit,
    onChange,
    onBlur,
    className,
    inputClasses,
}) => {
    const classes = useInputTitleStyles();
    const [edit, setEdit] = useState(false);
    const [value, setValue] = useState(defaultValue);

    useEffect(() => {
        setEdit(enableEdit);
    }, [enableEdit]);

    const handleValueChange = useCallback(
        (newValue: string) => {
            setValue(newValue);
            onChange?.(newValue);
        },
        [onChange]
    );

    const handleOnBlur = useCallback(() => {
        setEdit(false);
        onBlur?.(value);
    }, [value, onBlur]);

    if (!edit) {
        return (
            <div className={classes.root}>
                <h2
                    className={classes.title}
                    style={{fontSize:'18px', fontWeight:'bolder'}}
                    // onClick={() => setEdit(true)}
                >
                    {value}
                </h2>
            </div>
        );
    }

    return (
        <div className={classes.root}>
            <TextField
                autoFocus
                value={value}
                size="small"
                className={clsx(classes.title, className)}
                onBlur={handleOnBlur}
                InputProps={{
                    classes: {
                        input: clsx(classes.titleInput, inputClasses),
                    },
                    disableUnderline: false,
                }}
                onChange={(e) => handleValueChange(e.target.value)}
            />
        </div>
    );
};

interface LeadColumnProps extends Omit<BoxProps, "title"> {
    /**default title value */
    title: string;
    snapshot: DraggableStateSnapshot | null;
    titleOnChange?: (value: string) => void;
    onDelete?: (value: string) => void;
    onAddCard?: () => void;
    provided?: DraggableProvided;
    columnid: string;
    total_revenue: number;
    total_cards: number;
    deletable: boolean;
}

const useLeadColumnStyles = makeStyles((theme) => ({
    root: {
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        alignItems: "flex-start",
        margin: `0 ${theme.spacing(1)}px`,
        maxHeight: "100%",
        overflow: "hidden", // overflowY
        width: columnWidth,
        maxWidth: columnWidth,

        "-webkit-touch-callout": "none" /* iOS Safari */,
        "-webkit-user-select": "none" /* Safari */,
        "-khtml-user-select": "none" /* Konqueror HTML */,
        "-moz-user-select": "none" /* Old versions of Firefox */,
        "-ms-user-select": "none" /* Internet Explorer/Edge */,
        userSelect: "none",
    },
    header: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
    },
    textField: {
        "&:hover": {
            cursor: "grab",
        },
    },
    popoverPaper: {
        maxWidth: 150,
    },
    currency: {
        marginBottom: "0.63em",
        fontWeight: "bold",
    },
}));

export const DraggableLeadColumn: FC<LeadColumnProps> = ({
    children,
    title,
    provided,
    columnid,
    total_revenue,
    titleOnChange,
    onDelete,
    onAddCard,
    deletable,
    total_cards,
    ...boxProps
}) => {
    const classes = useLeadColumnStyles();
    const edit = useRef(false);

    const handleOnBlur = useCallback(
        (value: string) => {
            edit.current = false;
            titleOnChange?.(value);
        },
        [titleOnChange]
    );

    const handleDelete = useCallback(() => {
        onDelete?.(columnid);
    }, []);
    const user = useSelector((state) => state.login.validateToken.user);
    return (
        <Box {...boxProps}>
            <div className={classes.root}>
                <div className={classes.header} {...(provided?.dragHandleProps || {})}>
                    <InputTitle defaultValue={title} edit={edit.current} onBlur={handleOnBlur} />
                    {deletable && (
                        <IconButton size="small" onClick={handleDelete}>
                            <CloseIcon style={{ height: 22, width: 22 }} />
                        </IconButton>
                    )}
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
                    <span className={classes.currency}>
                        {user?.currencysymbol || "S/."} {total_revenue?.toLocaleString("en-US") || 0}
                    </span>
                    <span className={classes.currency} style={{ paddingRight: 8 }}>
                        {total_cards}
                    </span>
                </div>
                {children}
            </div>
        </Box>
    );
};

interface LeadColumnListProps extends BoxProps {
    snapshot: DroppableStateSnapshot;
    itemCount: number;
}

const useLeadColumnListStyles = makeStyles(() => ({
    root: {
        width: 275,
        maxWidth: 275,
        minHeight: columnMinHeight,
        borderRadius: cardBorderRadius,
    },
    draggOver: {
        background: "rgb(211,211,211, 0.2)", 
    },
}));

export const DroppableLeadColumnList: FC<LeadColumnListProps> = ({ children, snapshot, itemCount, ...boxProps }) => {
    const classes = useLeadColumnListStyles();

    return (
        <Box {...boxProps}>
            <div className={clsx(classes.root, snapshot.isDraggingOver && itemCount === 0 && classes.draggOver)}>
                {children}
            </div>
        </Box>
    );
};

interface AddColumnTemplatePops extends Omit<BoxProps, "onSubmit"> {
    onSubmit: (data: any) => void;
    updateSortParams: (value: any) => void;
    passConfiguration: (value: Dictionary) => void;
    ordertype: Dictionary;
    orderby: Dictionary;
}

const useAddColumnTemplateStyles = makeStyles((theme) => ({
    root: {
        width: "100%",
        maxWidth: "100%",
        display: "flex",
        flexDirection: "row",
        fontSize: 14,
        fontWeight: 500,
        color: theme.palette.primary.main,
        padding: `calc(0.83em + ${inputTitleHeight * 0.1}px) 6px 0 6px`,
    },
    addBtnContainer: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-start",
        backgroundColor: "inherit",
        position: "relative",
        height: 35,
        width: "fit-content",
    },
    addBtn: {
        width: 35,
        height: 35,
        backgroundColor: '#7721AD',
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 3,     
    },
	configBtn: {
		marginLeft: '1rem'       
	},
    popoverRoot: {
        width: columnWidth,
        height: columnMinHeight,
    },
	filterComponent: {
		width: '220px',
		marginLeft: '15px'
	},
    filterComponent2: {
		width: '220px',
		marginLeft: '15px',
        marginRight: '2rem'
	},
	text: {
		alignSelf: "center",
		marginLeft: '25px',
		fontSize: 16
	}
}));

export const AddColumnTemplate: FC<AddColumnTemplatePops> = ({ onSubmit, updateSortParams, passConfiguration, ordertype, orderby, ...boxProps }) => {
    const classes = useAddColumnTemplateStyles();
    const dispatch = useDispatch();
    const main = useSelector((state) => state.main.mainData);
    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
    const { t } = useTranslation();
    const user = useSelector((state) => state.login.validateToken.user);
	const [openModal, setOpenModal] = useState(false);
    const mainMulti = useSelector(state => state.main.multiData);
    const history = useHistory();

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);
    const id = open ? "crm-add-new-column-popover" : undefined;

    const handleSubmit = (data: any) => {
        onSubmit(data);
        handleClose();
    };

    const [sortParams, setSortParams] = useState({
        type: '',
        order: ''
    })

    useEffect(() => {
        updateSortParams(sortParams)
    }, [sortParams])

    const fetchConfiguration = () => dispatch(getCollection(selOrderConfig()))

    useEffect(() => {
        fetchConfiguration()
    }, []);

    const configuration = main.data.find(item => 
        item.corpid === user?.corpid && item.orgid === user?.orgid
    )?.orderconfig

    useEffect(() => {
        passConfiguration(configuration)
    }, [configuration, sortParams])

    const goToAddLead = useCallback(() => {
        history.push(paths.CRM_ADD_LEAD);
      }, [history]);

    return (
        <Box>
            <div className={classes.root} >

				<div className={classes.text} style={{marginLeft:4}}>
					<Typography/>{t(langKeys.orderby)}
				</div>

				<FieldSelect
					variant="outlined"
					label={t(langKeys.type)}
                    valueDefault={sortParams.type}
					data={ordertype || []}
					className={classes.filterComponent}
					optionDesc="domaindesc"
					optionValue="domainvalue"
                    onChange={(value) => {
                        if(value?.domainvalue) {
                            setSortParams({...sortParams, type: value.domainvalue})
                        } else {
                            setSortParams({...sortParams, type: ""})
                        }
                    }}
				/>

				<FieldSelect                  
                    variant="outlined"
                    label={t(langKeys.order)}
                    valueDefault={sortParams.order}
                    data={orderby || []}
                    className={classes.filterComponent2}
                    optionDesc="domaindesc"
                    optionValue="domainvalue"
                    onChange={(value) => {
                        if (value?.domainvalue) {
                            setSortParams({ ...sortParams, order: value.domainvalue });
                        } else {
                            setSortParams({ ...sortParams, order: '' });
                        }
                    }}
                />

                <Button
					variant="outlined"
					color="primary"
                    aria-describedby={id}
					startIcon={<AddIcon color="primary" />}					
					onClick={handleClick}
				>                    
					<Trans i18nKey={langKeys.addacolumn} />
				</Button>

				<Button
					variant="outlined"
					color="primary"
					className={classes.configBtn}
					startIcon={<Traffic color="primary" />}					
					onClick={() => setOpenModal(true)}
                    style={{ marginLeft: 'auto'  }}
				>
					<Trans i18nKey={langKeys.configuration} />
				</Button>

                {!isIncremental &&            
                    <Button
                        variant="contained"
                        color="primary"
                        className={classes.configBtn}
                        disabled={mainMulti.loading}
                        startIcon={<AddIcon color="secondary" />}
                        onClick={goToAddLead}
                        style={{ backgroundColor: "#55BD84" }}
                       
                    >
                        <Trans i18nKey={langKeys.register} />
                    </Button>
                }

                <Popover
                    id={id}
                    open={open}
                    anchorEl={anchorEl}
                    onClose={handleClose}
                    anchorOrigin={{
                        vertical: "top",
                        horizontal: "left",
                    }}
                >
                    <ColumnTemplate onSubmit={handleSubmit} />
                </Popover>
            </div>
            
			<TrafficLightConfigurationModal
				openModal={openModal}
				setOpenModal={setOpenModal}
                fetchData={fetchConfiguration}
                configuration={configuration}
			/>
        </Box>
    );
};

interface ColumnTemplateProps {
    onSubmit: (title: any) => void;
}

const useColumnTemplateStyles = makeStyles((theme) => ({
    root: {
        overflow: "hidden",
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        padding: theme.spacing(2),
    },
    titleSection: {
        width: "inherit",
    },
    btn: {
        width: "100%",
    },
}));

const ColumnTemplate: FC<ColumnTemplateProps> = ({ onSubmit }) => {
    const classes = useColumnTemplateStyles();
    const [title, setTitle] = useState("");
    const [type, settype] = useState("");
    const [disabled, setdisabled] = useState(true);
    const { t } = useTranslation();

    return (
        <div className={classes.root}>
            <div className={classes.titleSection}>
                <div style={{ padding: "10px 0" }}>
                    <FieldEdit
                        label={t(langKeys.columntitle)}
                        valueDefault={title}
                        onChange={(value) => {
                            setdisabled(value.trim().length === 0 || !type);
                            setTitle(value);
                        }}
                    />
                </div>

                <div style={{ padding: "10px 0" }}>
                    <FieldSelect
                        label={`${t(langKeys.type)}`}
                        size="small"
                        valueDefault={type}
                        onChange={(e) => {
                            setdisabled(!e?.type || title.trim().length === 0);
                            settype(e?.type || "");
                        }}
                        data={[
                            { type: "QUALIFIED", desc: t(langKeys.qualified) },
                            { type: "PROPOSITION", desc: t(langKeys.proposition) },
                            { type: "WON", desc: t(langKeys.won) },
                        ]}
                        optionDesc="desc"
                        optionValue="type"
                    />
                </div>

                <div style={{ padding: "10px 0", width: "100%" }}>
                    <Button
                        variant="contained"
                        color="primary"
                        size="small"
                        className={classes.btn}
                        onClick={() => onSubmit({ title: title, type: type })}
                        disabled={disabled}
                    >
                        <Trans i18nKey={langKeys.add} />
                    </Button>
                </div>
            </div>
        </div>
    );
};

const useTabPanelStyles = makeStyles((theme) => ({
    root: {
        border: "#A59F9F 1px solid",
        borderRadius: 6,
    },
}));

interface TabPanelProps {
    value: string;
    index: string;
}

export const TabPanel: FC<TabPanelProps> = ({ children, value, index }) => {
    const classes = useTabPanelStyles();

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            className={classes.root}
            id={`wrapped-tabpanel-${index}`}
            aria-labelledby={`wrapped-tab-${index}`}
            style={{ display: value === index ? "block" : "none" }}
        >
            <Box p={3}>{children}</Box>
        </div>
    );
};
