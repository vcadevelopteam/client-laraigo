/* eslint-disable react-hooks/exhaustive-deps */
import React, { FC, Fragment, useEffect, useState } from "react";
import TableZyx from "components/fields/table-simple";
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import SaveIcon from '@material-ui/icons/Save';
import DateFnsUtils from '@date-io/date-fns';

import { Button, Tabs, TextField } from "@material-ui/core";
import { getCollection, getMultiCollection, resetMultiMain } from "store/main/actions";
import { langKeys } from "lang/keys";
import { makeStyles } from '@material-ui/core/styles';
import { useDispatch } from "react-redux";
import { useSelector } from 'hooks';
import { useTranslation } from "react-i18next";
import { AntTab, FieldView, FieldEditAdvanced, FieldSelect, DialogZyx, FieldEdit } from 'components';
import { FacebookColor, InstagramColor, TwitterColor, YouTubeColor, LinkedInColor, TikTokColor } from "icons";
import { Edit, Delete, CameraAlt, PlayCircleOutlineSharp, Facebook, Instagram, YouTube, LinkedIn, Twitter, MusicNote, Timelapse, Save, Send, ThumbUp, ChatBubble, Reply, Replay, AccountCircle } from '@material-ui/icons';
import { getLocaleDateString, localesLaraigo } from 'common/helpers';
import { MuiPickersUtilsProvider, KeyboardDatePicker, KeyboardTimePicker } from '@material-ui/pickers';

const dataActivities = [
    {
        "description": "AGREES",
        "value": "1267092843327003"
    },
    {
        "description": "ATTENDS",
        "value": "668012816568345"
    },
    {
        "description": "BIKES",
        "value": "642337999135827"
    },
    {
        "description": "BOXES",
        "value": "681781771858116"
    },
    {
        "description": "CALLS",
        "value": "1226135157422772"
    },
    {
        "description": "CELEBRATES",
        "value": "742120442490915"
    },
    {
        "description": "CLIMBS",
        "value": "681782675191359"
    },
    {
        "description": "CONTACTS",
        "value": "1294635240572763"
    },
    {
        "description": "DANCES",
        "value": "701721669864126"
    },
    {
        "description": "DISAGREES",
        "value": "1270648612971426"
    },
    {
        "description": "DRINKS",
        "value": "383634741672822"
    },
    {
        "description": "EATS",
        "value": "383634705006159"
    },
    {
        "description": "EXERCISES",
        "value": "678359018867058"
    },
    {
        "description": "FAKE_EXERCISING_TYPE",
        "value": "718343998201893"
    },
    {
        "description": "FEELS",
        "value": "383634835006146"
    },
    {
        "description": "GETS",
        "value": "809472139089078"
    },
    {
        "description": "GOES_TO",
        "value": "556187044417590"
    },
    {
        "description": "GOLFS",
        "value": "681783365191290"
    },
    {
        "description": "HIKES",
        "value": "680527725316854"
    },
    {
        "description": "LISTENS",
        "value": "383634868339476"
    },
    {
        "description": "LOOKS_FOR",
        "value": "601369976565963"
    },
    {
        "description": "MAKES",
        "value": "809472309089061"
    },
    {
        "description": "MEETS",
        "value": "809471075755851"
    },
    {
        "description": "OTHER",
        "value": "637142219655405"
    },
    {
        "description": "PLAYS",
        "value": "520095228026772"
    },
    {
        "description": "PRACTICES_YOGA",
        "value": "701743366528623"
    },
    {
        "description": "PREPARES_TO_VOTE",
        "value": "1500689486634003"
    },
    {
        "description": "RACES",
        "value": "681783721857921"
    },
    {
        "description": "RAFTS",
        "value": "681784405191186"
    },
    {
        "description": "READS",
        "value": "383635058339457"
    },
    {
        "description": "REGISTERS_TO_VOTE",
        "value": "1503898576313094"
    },
    {
        "description": "REMEMBERS",
        "value": "902228273146797"
    },
    {
        "description": "RESPONDS_TO",
        "value": "1443817305654555"
    },
    {
        "description": "RUNS",
        "value": "642340799135547"
    },
    {
        "description": "SCUBA_DIVES",
        "value": "701743106528649"
    },
    {
        "description": "SELECTS_VERB",
        "value": "806115869424705"
    },
    {
        "description": "SKATEBOARDS",
        "value": "701743266528633"
    },
    {
        "description": "SKATES",
        "value": "681784615191165"
    },
    {
        "description": "SKIS",
        "value": "681784731857820"
    },
    {
        "description": "SKYDIVES",
        "value": "681784815191145"
    },
    {
        "description": "SNOWBOARDS",
        "value": "681785285191098"
    },
    {
        "description": "STREAMS",
        "value": "1136670953035860"
    },
    {
        "description": "SUPPORTS",
        "value": "721170054585954"
    },
    {
        "description": "SURFS",
        "value": "681785361857757"
    },
    {
        "description": "SWIMS",
        "value": "681785451857748"
    },
    {
        "description": "THINKS_ABOUT",
        "value": "809473052422320"
    },
    {
        "description": "TRAVELS",
        "value": "580961725273455"
    },
    {
        "description": "VOTES",
        "value": "532534113449550"
    },
    {
        "description": "WALKS",
        "value": "681794311856862"
    },
    {
        "description": "WATCHES",
        "value": "383634671672829"
    },
    {
        "description": "WEIGHT_TRAINS",
        "value": "701743316528628"
    },
    {
        "description": "WRITES_A_NOVEL_ABOUT",
        "value": "906305289405762"
    }
]

const dataFeelings = [
    {
        "description": "ACCOMPLISHED",
        "value": "136050896551329"
    },
    {
        "description": "ADVENTUROUS",
        "value": "224113357712800"
    },
    {
        "description": "AFRAID",
        "value": "477377185634506"
    },
    {
        "description": "AGGRAVATED",
        "value": "496880480349772"
    },
    {
        "description": "ALIVE",
        "value": "293001494136243"
    },
    {
        "description": "ALONE",
        "value": "467368809976558"
    },
    {
        "description": "AMAZED",
        "value": "480134215368252"
    },
    {
        "description": "AMAZING",
        "value": "387919524627259"
    },
    {
        "description": "AMUSED",
        "value": "134212056751013"
    },
    {
        "description": "ANGRY",
        "value": "474440915941169"
    },
    {
        "description": "ANNOYED",
        "value": "297656947028236"
    },
    {
        "description": "ANXIOUS",
        "value": "383436105075371"
    },
    {
        "description": "APPRECIATED",
        "value": "306190182814450"
    },
    {
        "description": "ASHAMED",
        "value": "318310054951137"
    },
    {
        "description": "ASLEEP",
        "value": "303442589773009"
    },
    {
        "description": "AWAKE",
        "value": "583994558322574"
    },
    {
        "description": "AWESOME",
        "value": "212888755520954"
    },
    {
        "description": "AWFUL",
        "value": "188581634613319"
    },
    {
        "description": "AWKWARD",
        "value": "177928135686600"
    },
    {
        "description": "BAD",
        "value": "146684115480015"
    },
    {
        "description": "BEAUTIFUL",
        "value": "112706382231213"
    },
    {
        "description": "BETRAYED",
        "value": "404280269648178"
    },
    {
        "description": "BETTER",
        "value": "182865315188048"
    },
    {
        "description": "BITTER",
        "value": "446022422113486"
    },
    {
        "description": "BLAH",
        "value": "140035382814582"
    },
    {
        "description": "BLESSED",
        "value": "525497104142297"
    },
    {
        "description": "BLISSFUL",
        "value": "387086391386101"
    },
    {
        "description": "BLUE",
        "value": "419290478143195"
    },
    {
        "description": "BORED",
        "value": "319023651545197"
    },
    {
        "description": "BRAVE",
        "value": "458789517502771"
    },
    {
        "description": "BROKE",
        "value": "175661129243188"
    },
    {
        "description": "BROKEN",
        "value": "523276417697246"
    },
    {
        "description": "BUMMED",
        "value": "1378774059036900"
    },
    {
        "description": "BUSY",
        "value": "542241122475897"
    },
    {
        "description": "BUTTERFLIES",
        "value": "323850287719041"
    },
    {
        "description": "CALM",
        "value": "398469726900244"
    },
    {
        "description": "CHALLENGED",
        "value": "315111361928320"
    },
    {
        "description": "CHEATED",
        "value": "572770509406697"
    },
    {
        "description": "CHILL",
        "value": "435107453233854"
    },
    {
        "description": "CLEAN",
        "value": "448222258560574"
    },
    {
        "description": "COLD",
        "value": "474696702568524"
    },
    {
        "description": "COMFORTABLE",
        "value": "310743825703427"
    },
    {
        "description": "COMPLETE",
        "value": "185781948291090"
    },
    {
        "description": "CONCERNED",
        "value": "763383973675043"
    },
    {
        "description": "CONFIDENT",
        "value": "304503342999403"
    },
    {
        "description": "CONFLICTED",
        "value": "1415854281982190"
    },
    {
        "description": "CONFUSED",
        "value": "454085554651356"
    },
    {
        "description": "CONNECTED",
        "value": "254652897997221"
    },
    {
        "description": "CONTENT",
        "value": "175500129263221"
    },
    {
        "description": "COOL",
        "value": "522810741064609"
    },
    {
        "description": "COZY",
        "value": "677416365623414"
    },
    {
        "description": "CRAFTY",
        "value": "185043488351934"
    },
    {
        "description": "CRAPPY",
        "value": "448720711855088"
    },
    {
        "description": "CRAZY",
        "value": "261120550681093"
    },
    {
        "description": "CREATIVE",
        "value": "723514731011973"
    },
    {
        "description": "CURIOUS",
        "value": "439395256134907"
    },
    {
        "description": "CUTE",
        "value": "1423895511173360"
    },
    {
        "description": "DEEP",
        "value": "232156420251730"
    },
    {
        "description": "DEFEATED",
        "value": "173049629485438"
    },
    {
        "description": "DELIGHTED",
        "value": "241047402726961"
    },
    {
        "description": "DEPRESSED",
        "value": "304415886341920"
    },
    {
        "description": "DESPERATE",
        "value": "495987653841807"
    },
    {
        "description": "DETERMINED",
        "value": "481524978563580"
    },
    {
        "description": "DEVASTATED",
        "value": "1436894813190430"
    },
    {
        "description": "DIFFERENT",
        "value": "362967447132618"
    },
    {
        "description": "DIRTY",
        "value": "176346375845361"
    },
    {
        "description": "DISAPPOINTED",
        "value": "452141451511412"
    },
    {
        "description": "DISCOURAGED",
        "value": "312593595513522"
    },
    {
        "description": "DISGUSTED",
        "value": "196306397222496"
    },
    {
        "description": "DIZZY",
        "value": "454203404634531"
    },
    {
        "description": "DONE",
        "value": "1425570984404220"
    },
    {
        "description": "DOWN",
        "value": "530630090295653"
    },
    {
        "description": "DRAINED",
        "value": "103045573200429"
    },
    {
        "description": "DRUNK",
        "value": "523630957654812"
    },
    {
        "description": "DUMB",
        "value": "456698301033363"
    },
    {
        "description": "ECSTATIC",
        "value": "440061956059003"
    },
    {
        "description": "EMBARRASSED",
        "value": "141310729353005"
    },
    {
        "description": "EMOTIONAL",
        "value": "397384367005610"
    },
    {
        "description": "EMPOWERED",
        "value": "461450543913513"
    },
    {
        "description": "ENERGIZED",
        "value": "384499584968015"
    },
    {
        "description": "ENRAGED",
        "value": "447161205364401"
    },
    {
        "description": "ENTERTAINED",
        "value": "213741785474768"
    },
    {
        "description": "EVIL",
        "value": "424719750948543"
    },
    {
        "description": "EXCITED",
        "value": "308167675961412"
    },
    {
        "description": "EXHAUSTED",
        "value": "175848009223562"
    },
    {
        "description": "FABULOUS",
        "value": "225844924256849"
    },
    {
        "description": "FANTASTIC",
        "value": "380040505422122"
    },
    {
        "description": "FAT",
        "value": "518208571552601"
    },
    {
        "description": "FED_UP",
        "value": "657281157637033"
    },
    {
        "description": "FESTIVE",
        "value": "460758320708708"
    },
    {
        "description": "FINE",
        "value": "503105606387726"
    },
    {
        "description": "FLIRTY",
        "value": "336850836424731"
    },
    {
        "description": "FOCUSED",
        "value": "565795223489339"
    },
    {
        "description": "FORTUNATE",
        "value": "260039780790007"
    },
    {
        "description": "FREE",
        "value": "402497769831045"
    },
    {
        "description": "FREEZING",
        "value": "1422663388031100"
    },
    {
        "description": "FRESH",
        "value": "380152055410929"
    },
    {
        "description": "FROZEN",
        "value": "545125512294980"
    },
    {
        "description": "FRUSTRATED",
        "value": "134525380036694"
    },
    {
        "description": "FULL",
        "value": "221700014640844"
    },
    {
        "description": "FUNKY",
        "value": "440473466019047"
    },
    {
        "description": "FUNNY",
        "value": "481480165224794"
    },
    {
        "description": "FURIOUS",
        "value": "680290595328899"
    },
    {
        "description": "GENEROUS",
        "value": "479384852111869"
    },
    {
        "description": "GIDDY",
        "value": "235901389908205"
    },
    {
        "description": "GLAD",
        "value": "405846839495020"
    },
    {
        "description": "GOOD",
        "value": "102834939889560"
    },
    {
        "description": "GOOFY",
        "value": "222141467963402"
    },
    {
        "description": "GRATEFUL",
        "value": "118365354995398"
    },
    {
        "description": "GREAT",
        "value": "478653915517976"
    },
    {
        "description": "GROSS",
        "value": "499965416702234"
    },
    {
        "description": "GRUMPY",
        "value": "234279653398171"
    },
    {
        "description": "GUILTY",
        "value": "137611796392379"
    },
    {
        "description": "HAPPY",
        "value": "528297480516636"
    },
    {
        "description": "HEALTHY",
        "value": "121929377969929"
    },
    {
        "description": "HEARTBROKEN",
        "value": "173736256107087"
    },
    {
        "description": "HELPLESS",
        "value": "524624334228920"
    },
    {
        "description": "HOMESICK",
        "value": "379102322179939"
    },
    {
        "description": "HONORED",
        "value": "393785000701594"
    },
    {
        "description": "HOPEFUL",
        "value": "125401434308511"
    },
    {
        "description": "HOPELESS",
        "value": "296496940471115"
    },
    {
        "description": "HORRIBLE",
        "value": "572307689451923"
    },
    {
        "description": "HOT",
        "value": "481464001906476"
    },
    {
        "description": "HUMAN",
        "value": "464539273604104"
    },
    {
        "description": "HUNGOVER",
        "value": "380553855372818"
    },
    {
        "description": "HUNGRY",
        "value": "182008128606193"
    },
    {
        "description": "HURT",
        "value": "519942028024389"
    },
    {
        "description": "HYPER",
        "value": "246661122137353"
    },
    {
        "description": "IGNORED",
        "value": "102806669892467"
    },
    {
        "description": "ILL",
        "value": "1437827213104290"
    },
    {
        "description": "IMPATIENT",
        "value": "601002259913609"
    },
    {
        "description": "IMPORTANT",
        "value": "231313840334791"
    },
    {
        "description": "IMPRESSED",
        "value": "492615107512006"
    },
    {
        "description": "IN_LOVE",
        "value": "494709810570459"
    },
    {
        "description": "INADEQUATE",
        "value": "455437077825793"
    },
    {
        "description": "INCOMPLETE",
        "value": "460019124035757"
    },
    {
        "description": "INSECURE",
        "value": "316682001780104"
    },
    {
        "description": "INSPIRED",
        "value": "539354326075059"
    },
    {
        "description": "INSULTED",
        "value": "521323164558116"
    },
    {
        "description": "INVISIBLE",
        "value": "140842299401114"
    },
    {
        "description": "IRRITATED",
        "value": "111894762331662"
    },
    {
        "description": "JEALOUS",
        "value": "310567035720031"
    },
    {
        "description": "JOLLY",
        "value": "590889874293829"
    },
    {
        "description": "JOYFUL",
        "value": "477906418922117"
    },
    {
        "description": "KIND",
        "value": "121854771312324"
    },
    {
        "description": "LAME",
        "value": "128593617299805"
    },
    {
        "description": "LAZY",
        "value": "482688958436815"
    },
    {
        "description": "LIGHT",
        "value": "473714049334527"
    },
    {
        "description": "LONELY",
        "value": "230944533704180"
    },
    {
        "description": "LOST",
        "value": "142029502613380"
    },
    {
        "description": "LOUSY",
        "value": "110822459087083"
    },
    {
        "description": "LOVED",
        "value": "123103951186111"
    },
    {
        "description": "LOVELY",
        "value": "446998542016581"
    },
    {
        "description": "LOW",
        "value": "237303323067212"
    },
    {
        "description": "LUCKY",
        "value": "385225238232619"
    },
    {
        "description": "MAD",
        "value": "313728008732470"
    },
    {
        "description": "MEH",
        "value": "483614251682491"
    },
    {
        "description": "MIGHTY",
        "value": "568128836535281"
    },
    {
        "description": "MISCHIEVOUS",
        "value": "264992546982295"
    },
    {
        "description": "MISERABLE",
        "value": "571661296183476"
    },
    {
        "description": "MISSING",
        "value": "285090421614547"
    },
    {
        "description": "MOTIVATED",
        "value": "361889323906463"
    },
    {
        "description": "NAKED",
        "value": "298451920275666"
    },
    {
        "description": "NAUGHTY",
        "value": "715784015098322"
    },
    {
        "description": "NAUSEOUS",
        "value": "183806708425669"
    },
    {
        "description": "NEEDED",
        "value": "424263620973748"
    },
    {
        "description": "NEGLECTED",
        "value": "300338820078019"
    },
    {
        "description": "NERDY",
        "value": "1444736239087160"
    },
    {
        "description": "NERVOUS",
        "value": "427487540649756"
    },
    {
        "description": "NICE",
        "value": "302627039854817"
    },
    {
        "description": "NORMAL",
        "value": "517127961654365"
    },
    {
        "description": "NOSTALGIC",
        "value": "122644777898046"
    },
    {
        "description": "NUMB",
        "value": "562921890391638"
    },
    {
        "description": "OFFENDED",
        "value": "412837252120513"
    },
    {
        "description": "OK",
        "value": "355798581182727"
    },
    {
        "description": "OKAY",
        "value": "387278094708554"
    },
    {
        "description": "OLD",
        "value": "460679043988968"
    },
    {
        "description": "OPTIMISTIC",
        "value": "336949906406031"
    },
    {
        "description": "OVERWHELMED",
        "value": "558247830856788"
    },
    {
        "description": "PAINED",
        "value": "398041520273122"
    },
    {
        "description": "PEACEFUL",
        "value": "112626832239338"
    },
    {
        "description": "PERFECT",
        "value": "570387776308771"
    },
    {
        "description": "PERPLEXED",
        "value": "579070352142516"
    },
    {
        "description": "PISSED",
        "value": "451402584920300"
    },
    {
        "description": "PISSED_OFF",
        "value": "111792392342530"
    },
    {
        "description": "POSITIVE",
        "value": "479820725401749"
    },
    {
        "description": "PRETTY",
        "value": "239721439491727"
    },
    {
        "description": "PRIDE",
        "value": "424758317631906"
    },
    {
        "description": "PRIVILEGED",
        "value": "574719705877314"
    },
    {
        "description": "PRODUCTIVE",
        "value": "419908098077570"
    },
    {
        "description": "PROFESSIONAL",
        "value": "508746172492084"
    },
    {
        "description": "PROUD",
        "value": "379355252154431"
    },
    {
        "description": "PUMPED",
        "value": "489032947800743"
    },
    {
        "description": "PUZZLED",
        "value": "236162099884421"
    },
    {
        "description": "QUALIFIED",
        "value": "418307201573307"
    },
    {
        "description": "READY",
        "value": "119368284895535"
    },
    {
        "description": "REFRESHED",
        "value": "223179361150272"
    },
    {
        "description": "REGRET",
        "value": "134375570053258"
    },
    {
        "description": "RELAXED",
        "value": "257237487735977"
    },
    {
        "description": "RELIEVED",
        "value": "144326115717748"
    },
    {
        "description": "RENEWED",
        "value": "262215447237902"
    },
    {
        "description": "RESTED",
        "value": "446177835443534"
    },
    {
        "description": "RESTLESS",
        "value": "115150618652191"
    },
    {
        "description": "RICH",
        "value": "529731510371705"
    },
    {
        "description": "ROMANTIC",
        "value": "426598624132585"
    },
    {
        "description": "ROUGH",
        "value": "285541821549499"
    },
    {
        "description": "SAD",
        "value": "175710752574432"
    },
    {
        "description": "SAFE",
        "value": "501513576535666"
    },
    {
        "description": "SARCASTIC",
        "value": "430043350410361"
    },
    {
        "description": "SATISFIED",
        "value": "235625646568477"
    },
    {
        "description": "SCARED",
        "value": "312496145517583"
    },
    {
        "description": "SECURE",
        "value": "394357883978959"
    },
    {
        "description": "SEXY",
        "value": "377645925661276"
    },
    {
        "description": "SHAME",
        "value": "173748716082652"
    },
    {
        "description": "SHATTERED",
        "value": "572226156127232"
    },
    {
        "description": "SHOCKED",
        "value": "321467047972614"
    },
    {
        "description": "SHY",
        "value": "364338266994675"
    },
    {
        "description": "SICK",
        "value": "476550682397236"
    },
    {
        "description": "SILLY",
        "value": "383853628365632"
    },
    {
        "description": "SLEEPY",
        "value": "447011778694338"
    },
    {
        "description": "SMALL",
        "value": "202833099854068"
    },
    {
        "description": "SMART",
        "value": "273544029435160"
    },
    {
        "description": "SNEAKY",
        "value": "1417990221767680"
    },
    {
        "description": "SORE",
        "value": "505758512791686"
    },
    {
        "description": "SORRY",
        "value": "134199530067829"
    },
    {
        "description": "SPECIAL",
        "value": "458612287529287"
    },
    {
        "description": "SPOILED",
        "value": "555806244488510"
    },
    {
        "description": "SPOOKY",
        "value": "178149542386140"
    },
    {
        "description": "STOKED",
        "value": "228847670625498"
    },
    {
        "description": "STRANGE",
        "value": "314827511960085"
    },
    {
        "description": "STRESSED",
        "value": "317729321673351"
    },
    {
        "description": "STRONG",
        "value": "379034115519395"
    },
    {
        "description": "STUCK",
        "value": "361696270593406"
    },
    {
        "description": "STUFFED",
        "value": "362434367185234"
    },
    {
        "description": "STUPID",
        "value": "108452055991606"
    },
    {
        "description": "SUPER",
        "value": "490506127661127"
    },
    {
        "description": "SURPRISED",
        "value": "123408067820719"
    },
    {
        "description": "TERRIBLE",
        "value": "302564446527376"
    },
    {
        "description": "THANKFUL",
        "value": "443609379021593"
    },
    {
        "description": "THIRSTY",
        "value": "336824293085938"
    },
    {
        "description": "THOUGHTFUL",
        "value": "1376863072561420"
    },
    {
        "description": "THREATENED",
        "value": "459581634101438"
    },
    {
        "description": "TIPSY",
        "value": "432506746872402"
    },
    {
        "description": "TIRED",
        "value": "457215007658974"
    },
    {
        "description": "TRAPPED",
        "value": "203005859835975"
    },
    {
        "description": "UGLY",
        "value": "182045508666558"
    },
    {
        "description": "UNAPPRECIATED",
        "value": "528783467139337"
    },
    {
        "description": "UNCOMFORTABLE",
        "value": "510737378958941"
    },
    {
        "description": "UNDECIDED",
        "value": "705949909416373"
    },
    {
        "description": "UNEASY",
        "value": "129223110569301"
    },
    {
        "description": "UNHAPPY",
        "value": "141533259331712"
    },
    {
        "description": "UNIMPORTANT",
        "value": "213398135463020"
    },
    {
        "description": "UNLOVED",
        "value": "322898331158888"
    },
    {
        "description": "UNSURE",
        "value": "199894526861510"
    },
    {
        "description": "UNWANTED",
        "value": "102812219891392"
    },
    {
        "description": "UNWELL",
        "value": "122931521203254"
    },
    {
        "description": "UPSET",
        "value": "305456379574177"
    },
    {
        "description": "USELESS",
        "value": "222075591260352"
    },
    {
        "description": "WANTED",
        "value": "343592532414827"
    },
    {
        "description": "WARM",
        "value": "122332771262500"
    },
    {
        "description": "WEAK",
        "value": "472717649445600"
    },
    {
        "description": "WEIRD",
        "value": "305794379521525"
    },
    {
        "description": "WELCOME",
        "value": "133724320118050"
    },
    {
        "description": "WELCOMED",
        "value": "441356962596309"
    },
    {
        "description": "WELL",
        "value": "133598250129553"
    },
    {
        "description": "WET",
        "value": "591501134250204"
    },
    {
        "description": "WHOLE",
        "value": "508892355811724"
    },
    {
        "description": "WONDERFUL",
        "value": "502842009736003"
    },
    {
        "description": "WORRIED",
        "value": "169789739868247"
    },
    {
        "description": "WORSE",
        "value": "310182259086056"
    },
    {
        "description": "WORTHLESS",
        "value": "398377870242717"
    },
    {
        "description": "YOUNG",
        "value": "123868331108076"
    },
    {
        "description": "YUCKY",
        "value": "304257933025750"
    }
]

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

export const PostCreatorPublish: FC = () => {
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
                    <AntTab label={t(langKeys.postcreator_publish_text)} />
                    <AntTab label={t(langKeys.postcreator_publish_textimage)} />
                    <AntTab label={t(langKeys.postcreator_publish_textvideo)} />
                </Tabs>
                {pageSelected === 0 &&
                    <div style={{ marginTop: 4 }}>
                        <PublishPostGeneric dataChannel={null} publishType={'TEXT'} />
                    </div>
                }
                {pageSelected === 1 &&
                    <div style={{ marginTop: 4 }}>
                        <PublishPostGeneric dataChannel={null} publishType={'IMAGE'} />
                    </div>
                }
                {pageSelected === 2 &&
                    <div style={{ marginTop: 4 }}>
                        <PublishPostGeneric dataChannel={null} publishType={'VIDEO'} />
                    </div>
                }
            </div>
        </React.Fragment>
    )
}

const PublishPostGeneric: React.FC<{ dataChannel: any, publishType: string }> = ({ dataChannel, publishType }) => {
    const classes = useStyles();

    const { t } = useTranslation();

    const [customizeType, setCustomizeType] = useState('Facebook');
    const [checkBox, setCheckBox] = useState(false);
    const [previewType, setPreviewType] = useState('FACEBOOKPREVIEW');
    const [openModal, setOpenModal] = useState(false);

    return (
        <div style={{ width: '100%' }}>
            <SavePostModalGeneric
                data={null}
                openModal={openModal}
                setOpenModal={setOpenModal}
                onTrigger={() => { }}
            />
            <Fragment>
                <div style={{ display: "flex", flexDirection: 'row', height: '100%', overflow: 'overlay', flexWrap: 'wrap' }}>
                    <div className={classes.containerLeft}>
                        <div className={classes.root}>
                            <div className="row-zyx" style={{ marginBottom: '0px' }}>
                                <FieldView
                                    className="col-12"
                                    label={''}
                                    value={t(langKeys.postcreator_publish_pages)}
                                    styles={{ fontWeight: 'bold', color: '#762AA9' }}
                                />
                            </div>
                            <div className="row-zyx">
                                <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                                    <div style={{ width: '100%', flex: '50%' }}>
                                        <FormControlLabel
                                            control={(
                                                <Checkbox
                                                    checked={checkBox}
                                                    color="primary"
                                                    onChange={(e) => setCheckBox(e.target.checked)}
                                                    name="Facebook" />
                                            )}
                                            label={
                                                <div style={{ display: 'inline-flex', alignItems: 'center' }}>
                                                    <FacebookColor style={{ width: '28px', height: '28px', marginRight: '6px' }} />
                                                    <span>Facebook</span>
                                                </div>
                                            }
                                        />
                                    </div>
                                    <div style={{ width: '100%', flex: '50%' }}>
                                        <FormControlLabel
                                            control={(
                                                <Checkbox
                                                    checked={checkBox}
                                                    color="primary"
                                                    onChange={(e) => setCheckBox(e.target.checked)}
                                                    name="Intagram" />
                                            )}
                                            label={
                                                <div style={{ display: 'inline-flex', alignItems: 'center' }}>
                                                    <InstagramColor style={{ width: '28px', height: '28px', marginRight: '6px' }} />
                                                    <span>Intagram</span>
                                                </div>
                                            }
                                        />
                                    </div>
                                    <div style={{ width: '100%', flex: '50%' }}>
                                        <FormControlLabel
                                            control={(
                                                <Checkbox
                                                    checked={checkBox}
                                                    color="primary"
                                                    onChange={(e) => setCheckBox(e.target.checked)}
                                                    name="LinkedIn" />
                                            )}
                                            label={
                                                <div style={{ display: 'inline-flex', alignItems: 'center' }}>
                                                    <LinkedInColor style={{ width: '28px', height: '28px', marginRight: '6px' }} />
                                                    <span>LinkedIn</span>
                                                </div>
                                            }
                                        />
                                    </div>
                                    <div style={{ width: '100%', flex: '50%' }}>
                                        <FormControlLabel
                                            control={(
                                                <Checkbox
                                                    checked={checkBox}
                                                    color="primary"
                                                    onChange={(e) => setCheckBox(e.target.checked)}
                                                    name="TikTok" />
                                            )}
                                            label={
                                                <div style={{ display: 'inline-flex', alignItems: 'center' }}>
                                                    <TikTokColor style={{ width: '28px', height: '28px', marginRight: '6px' }} />
                                                    <span>TikTok</span>
                                                </div>
                                            }
                                        />
                                    </div>
                                    <div style={{ width: '100%', flex: '50%' }}>
                                        <FormControlLabel
                                            control={(
                                                <Checkbox
                                                    checked={checkBox}
                                                    color="primary"
                                                    onChange={(e) => setCheckBox(e.target.checked)}
                                                    name="Twitter" />
                                            )}
                                            label={
                                                <div style={{ display: 'inline-flex', alignItems: 'center' }}>
                                                    <TwitterColor style={{ width: '28px', height: '28px', marginRight: '6px' }} />
                                                    <span>Twitter</span>
                                                </div>
                                            }
                                        />
                                    </div>
                                    <div style={{ width: '100%', flex: '50%' }}>
                                        <FormControlLabel
                                            control={(
                                                <Checkbox
                                                    checked={checkBox}
                                                    color="primary"
                                                    onChange={(e) => setCheckBox(e.target.checked)}
                                                    name="YouTube" />
                                            )}
                                            label={
                                                <div style={{ display: 'inline-flex', alignItems: 'center' }}>
                                                    <YouTubeColor style={{ width: '28px', height: '28px', marginRight: '6px' }} />
                                                    <span>YouTube</span>
                                                </div>
                                            }
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="row-zyx" style={{ marginBottom: '0px', paddingLeft: '6px' }}>
                                <FieldEdit
                                    label={t(langKeys.title)}
                                    className="col-12"
                                    valueDefault={''}
                                    onChange={(value) => { }}
                                    error={''}
                                />
                            </div>
                            <div className="row-zyx" style={{ marginBottom: '0px', height: '10px', paddingLeft: '2px' }}>
                                <FieldView
                                    className="col-12"
                                    label={''}
                                    value={t(langKeys.text)}
                                    styles={{ fontWeight: 'bold', color: '#762AA9' }}
                                />
                            </div>
                            <div className="row-zyx" style={{ marginBottom: '0px' }}>
                                <FieldEditAdvanced
                                    className="col-12"
                                    error={''}
                                    label={''}
                                    maxLength={2200}
                                    onChange={(value) => { }}
                                    rows={(publishType === 'TEXT' ? 12 : 6)}
                                    valueDefault={''}
                                    disabled={false}
                                    style={{ border: '1px solid #959595', borderRadius: '4px', marginLeft: '6px', padding: '8px' }}
                                    emoji={true}
                                    hashtag={true}
                                />
                            </div>
                            <div className="row-zyx" style={{ marginTop: '0px', marginLeft: '6px' }}>
                                <span>
                                    {t(langKeys.postcreator_publish_textrecommendation)}
                                </span>
                                <span>
                                    {t(langKeys.postcreator_publish_textrecommendation01)}
                                </span>
                            </div>
                            {publishType === 'IMAGE' && <>
                                <div className="row-zyx" style={{ marginBottom: '0px' }}>
                                    <FieldView
                                        className="col-12"
                                        label={''}
                                        value={t(langKeys.postcreator_publish_image)}
                                        styles={{ fontWeight: 'bold', color: '#762AA9' }}
                                    />
                                </div>
                                <div className="row-zyx" style={{ marginBottom: '0px' }}>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', marginBottom: '10px' }}>
                                        <div style={{ display: 'inline-flex', verticalAlign: 'center' }}>
                                            <div style={{ height: '100%', display: 'flex', alignItems: 'center' }}>
                                                <img alt="" style={{ maxHeight: '60px' }} src="https://1.bp.blogspot.com/-YLDLu1GApmQ/Tm-cKFIKE1I/AAAAAAAAEvQ/bp1zLkKJ6Cg/w1200-h630-p-k-no-nu/Purple+solid+color+backgrounds+1.png"></img>
                                            </div>
                                            <div style={{ height: '100%', paddingLeft: '10px', display: 'flex', alignItems: 'center' }}>
                                                Imagen.jpg<br />480 x 240
                                            </div>
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', marginBottom: '10px' }}>
                                        <div style={{ display: 'inline-flex', verticalAlign: 'center' }}>
                                            <div style={{ height: '100%', display: 'flex', alignItems: 'center' }}>
                                                <img alt="" style={{ maxHeight: '60px' }} src="https://1.bp.blogspot.com/-YLDLu1GApmQ/Tm-cKFIKE1I/AAAAAAAAEvQ/bp1zLkKJ6Cg/w1200-h630-p-k-no-nu/Purple+solid+color+backgrounds+1.png"></img>
                                            </div>
                                            <div style={{ height: '100%', paddingLeft: '10px', display: 'flex', alignItems: 'center' }}>
                                                Imagen.jpg<br />480 x 240
                                            </div>
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', marginBottom: '10px' }}>
                                        <div style={{ display: 'inline-flex', verticalAlign: 'center' }}>
                                            <div style={{ height: '100%', display: 'flex', alignItems: 'center' }}>
                                                <img alt="" style={{ maxHeight: '60px' }} src="https://1.bp.blogspot.com/-YLDLu1GApmQ/Tm-cKFIKE1I/AAAAAAAAEvQ/bp1zLkKJ6Cg/w1200-h630-p-k-no-nu/Purple+solid+color+backgrounds+1.png"></img>
                                            </div>
                                            <div style={{ height: '100%', paddingLeft: '10px', display: 'flex', alignItems: 'center' }}>
                                                Imagen.jpg<br />480 x 240
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="row-zyx" style={{ marginTop: '18px', alignItems: 'center', display: 'flex', justifyContent: 'center' }}>
                                    <Button
                                        className={classes.button}
                                        variant="contained"
                                        color="primary"
                                        type="submit"
                                        startIcon={<Edit color="secondary" />}
                                        style={{ backgroundColor: "#762AA9", display: 'flex', alignItems: 'center' }}
                                    >{t(langKeys.postcreator_publish_edit)}
                                    </Button>
                                    <Button
                                        className={classes.button}
                                        variant="contained"
                                        color="primary"
                                        type="submit"
                                        startIcon={<Delete color="secondary" />}
                                        style={{ backgroundColor: "#762AA9", display: 'flex', alignItems: 'center' }}
                                    >{t(langKeys.postcreator_publish_delete)}
                                    </Button>
                                    <Button
                                        className={classes.button}
                                        variant="contained"
                                        color="primary"
                                        type="submit"
                                        startIcon={<CameraAlt color="secondary" />}
                                        style={{ backgroundColor: "#762AA9", display: 'flex', alignItems: 'center' }}
                                    >{t(langKeys.postcreator_publish_addimage)}
                                    </Button>
                                </div>
                            </>}
                            {publishType === 'VIDEO' && <>
                                <div className="row-zyx" style={{ marginBottom: '0px' }}>
                                    <FieldView
                                        className="col-12"
                                        label={''}
                                        value={t(langKeys.postcreator_publish_video)}
                                        styles={{ fontWeight: 'bold', color: '#762AA9' }}
                                    />
                                </div>
                                <div className="row-zyx" style={{ marginBottom: '0px' }}>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', marginBottom: '10px' }}>
                                        <div style={{ display: 'inline-flex', verticalAlign: 'center' }}>
                                            <div style={{ height: '100%', display: 'flex', alignItems: 'center' }}>
                                                <img alt="" style={{ maxHeight: '60px' }} src="https://1.bp.blogspot.com/-YLDLu1GApmQ/Tm-cKFIKE1I/AAAAAAAAEvQ/bp1zLkKJ6Cg/w1200-h630-p-k-no-nu/Purple+solid+color+backgrounds+1.png"></img>
                                            </div>
                                            <div style={{ height: '100%', paddingLeft: '10px', display: 'flex', alignItems: 'center' }}>
                                                Video.mp4<br />480 x 240
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="row-zyx" style={{ marginTop: '18px', alignItems: 'center', display: 'flex', justifyContent: 'center' }}>
                                    <Button
                                        className={classes.button}
                                        variant="contained"
                                        color="primary"
                                        type="submit"
                                        startIcon={<Edit color="secondary" />}
                                        style={{ backgroundColor: "#762AA9", display: 'flex', alignItems: 'center' }}
                                    >{t(langKeys.postcreator_publish_edit)}
                                    </Button>
                                    <Button
                                        className={classes.button}
                                        variant="contained"
                                        color="primary"
                                        type="submit"
                                        startIcon={<Delete color="secondary" />}
                                        style={{ backgroundColor: "#762AA9", display: 'flex', alignItems: 'center' }}
                                    >{t(langKeys.postcreator_publish_delete)}
                                    </Button>
                                    <Button
                                        className={classes.button}
                                        variant="contained"
                                        color="primary"
                                        type="submit"
                                        startIcon={<PlayCircleOutlineSharp color="secondary" />}
                                        style={{ backgroundColor: "#762AA9", display: 'flex', alignItems: 'center' }}
                                    >{t(langKeys.postcreator_publish_addvideo)}
                                    </Button>
                                </div>
                            </>}
                        </div>
                    </div>
                    <div className={classes.containerLeft}>
                        <div className={classes.root}>
                            <div className="row-zyx" style={{ alignItems: 'center', display: 'flex', justifyContent: 'center' }}>
                                <Button
                                    className={classes.button}
                                    variant="contained"
                                    color="primary"
                                    onClick={() => { setCustomizeType('Facebook') }}
                                    startIcon={<Facebook color="secondary" />}
                                    style={{ backgroundColor: "#762AA9", display: 'flex', alignItems: 'center', marginBottom: '10px' }}
                                    disabled={customizeType === 'Facebook'}
                                >{t(langKeys.postcreator_publish_facebook)}
                                </Button>
                                <Button
                                    className={classes.button}
                                    variant="contained"
                                    color="primary"
                                    onClick={() => { setCustomizeType('Instagram') }}
                                    startIcon={<Instagram color="secondary" />}
                                    style={{ backgroundColor: "#762AA9", display: 'flex', alignItems: 'center', marginBottom: '10px' }}
                                    disabled={customizeType === 'Instagram'}
                                >{t(langKeys.postcreator_publish_instagram)}
                                </Button>
                                <Button
                                    className={classes.button}
                                    variant="contained"
                                    color="primary"
                                    onClick={() => { setCustomizeType('Twitter') }}
                                    startIcon={<Twitter color="secondary" />}
                                    style={{ backgroundColor: "#762AA9", display: 'flex', alignItems: 'center', marginBottom: '10px' }}
                                    disabled={customizeType === 'Twitter'}
                                >{t(langKeys.postcreator_publish_twitter)}
                                </Button>
                                <Button
                                    className={classes.button}
                                    variant="contained"
                                    color="primary"
                                    onClick={() => { setCustomizeType('LinkedIn') }}
                                    startIcon={<LinkedIn color="secondary" />}
                                    style={{ backgroundColor: "#762AA9", display: 'flex', alignItems: 'center', marginBottom: '10px' }}
                                    disabled={customizeType === 'LinkedIn'}
                                >{t(langKeys.postcreator_publish_linkedin)}
                                </Button>
                                <Button
                                    className={classes.button}
                                    variant="contained"
                                    color="primary"
                                    onClick={() => { setCustomizeType('YouTube') }}
                                    startIcon={<YouTube color="secondary" />}
                                    style={{ backgroundColor: "#762AA9", display: 'flex', alignItems: 'center', marginBottom: '10px' }}
                                    disabled={customizeType === 'YouTube'}
                                >{t(langKeys.postcreator_publish_youtube)}
                                </Button>
                                <Button
                                    className={classes.button}
                                    variant="contained"
                                    color="primary"
                                    onClick={() => { setCustomizeType('TikTok') }}
                                    startIcon={<MusicNote color="secondary" />}
                                    style={{ backgroundColor: "#762AA9", display: 'flex', alignItems: 'center', marginBottom: '10px' }}
                                    disabled={customizeType === 'TikTok'}
                                >{t(langKeys.postcreator_publish_tiktok)}
                                </Button>
                            </div>
                            <div className="row-zyx" style={{ marginBottom: '0px', height: '10px' }}>
                                <FieldView
                                    className="col-12"
                                    label={''}
                                    value={t(langKeys.postcreator_publish_customizepost).replace('#CHANNELTYPE#', customizeType)}
                                    styles={{ fontWeight: 'bold', color: '#762AA9' }}
                                />
                            </div>
                            <div className="row-zyx" style={{ marginBottom: '0px' }}>
                                <FieldEditAdvanced
                                    className="col-12"
                                    error={''}
                                    label={''}
                                    maxLength={2200}
                                    onChange={(value) => { }}
                                    rows={18}
                                    valueDefault={''}
                                    disabled={false}
                                    style={{ border: '1px solid #959595', borderRadius: '4px', marginLeft: '6px', padding: '8px' }}
                                    emoji={true}
                                    hashtag={true}
                                />
                            </div>
                            {customizeType === 'Facebook' && <div className="row-zyx">
                                <FieldSelect
                                    label={t(langKeys.postcreator_publish_activity)}
                                    style={{ width: '100%', paddingLeft: '6px', paddingRight: '6px' }}
                                    valueDefault={''}
                                    variant="outlined"
                                    onChange={(value) => { }}
                                    data={dataActivities}
                                    optionDesc="description"
                                    optionValue="value"
                                />
                            </div>}
                            {customizeType === 'Facebook' && <div className="row-zyx">
                                <FieldSelect
                                    label={t(langKeys.postcreator_publish_sentiment)}
                                    style={{ width: '100%', paddingLeft: '6px', paddingRight: '6px' }}
                                    valueDefault={''}
                                    variant="outlined"
                                    onChange={(value) => { }}
                                    data={dataFeelings}
                                    optionDesc="description"
                                    optionValue="value"
                                />
                            </div>}
                        </div>
                    </div>
                    <div className={classes.containerLeft}>
                        <div className={classes.root} style={{ backgroundColor: '#EBEBEB' }}>
                            <div className="row-zyx">
                                <FieldSelect
                                    label={t(langKeys.postcreator_publish_previewmode)}
                                    style={{ width: '100%', backgroundColor: 'white' }}
                                    valueDefault={previewType}
                                    variant="outlined"
                                    onChange={(value) => { setPreviewType(value?.value) }}
                                    data={[
                                        {
                                            description: t(langKeys.postcreator_publish_mockupfacebook),
                                            value: "FACEBOOKPREVIEW",
                                        },
                                        {
                                            description: t(langKeys.postcreator_publish_mockupinstagram),
                                            value: "INSTAGRAMPREVIEW",
                                        },
                                        {
                                            description: t(langKeys.postcreator_publish_mockuptwitter),
                                            value: "TWITTERPREVIEW",
                                        },
                                        {
                                            description: t(langKeys.postcreator_publish_mockuplinkedin),
                                            value: "LINKEDINPREVIEW",
                                        },
                                        {
                                            description: t(langKeys.postcreator_publish_mockupyoutube),
                                            value: "YOUTUBEPREVIEW",
                                        },
                                        {
                                            description: t(langKeys.postcreator_publish_mockuptiktok),
                                            value: "TIKTOKPREVIEW",
                                        },
                                    ]}
                                    optionDesc="description"
                                    optionValue="value"
                                />
                            </div>
                            <div className="row-zyx">
                                <FieldView
                                    className="col-12"
                                    label={''}
                                    value={t(langKeys.postcreator_publish_preview)}
                                    styles={{ fontWeight: 'bold', color: '#762AA9' }}
                                />
                            </div>
                            {previewType === 'FACEBOOKPREVIEW' && <div className="row-zyx">
                                <div style={{ width: '90%', marginLeft: 'auto', marginRight: 'auto', marginBottom: '18px', backgroundColor: 'white', borderRadius: '6px', border: '1px solid #959595' }}>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', marginBottom: '10px', paddingLeft: '18px', paddingTop: '18px' }}>
                                        <div style={{ display: 'inline-flex', verticalAlign: 'center' }}>
                                            <div style={{ height: '100%', display: 'flex', alignItems: 'center' }}>
                                                <img alt="" style={{ height: '40px', width: '40px', borderRadius: '50%' }} src="https://1.bp.blogspot.com/-YLDLu1GApmQ/Tm-cKFIKE1I/AAAAAAAAEvQ/bp1zLkKJ6Cg/w1200-h630-p-k-no-nu/Purple+solid+color+backgrounds+1.png"></img>
                                            </div>
                                            <div style={{ height: '100%', paddingLeft: '10px', display: 'flex', flexDirection: 'column', alignItems: 'center', whiteSpace: 'pre-line' }}>
                                                <div style={{ display: 'flex', width: '100%', paddingRight: 'auto' }}><b>{t(langKeys.postcreator_publish_officialpage)}</b></div>
                                                <div style={{ display: 'flex', width: '100%', paddingRight: 'auto' }}>{t(langKeys.postcreator_publish_facebookmockup_time)}<button
                                                    style={{ border: 'none', marginLeft: '4px', width: '20px', height: '20px', backgroundImage: 'url(https://staticfileszyxme.s3.us-east.cloud-object-storage.appdomain.cloud/VCA%20PERU/e08a19e1-7653-4cb2-9523-68fed2d48217/FacebookWorld.png)', backgroundSize: '20px 20px' }}
                                                >
                                                </button></div>
                                            </div>
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', marginBottom: '10px', paddingLeft: '10px', paddingRight: '20px', paddingTop: '10px' }}>
                                        <div style={{ height: '100%', paddingLeft: '10px', display: 'flex', flexDirection: 'column', alignItems: 'center', whiteSpace: 'pre-line' }}>
                                            <div style={{ display: 'flex', width: '100%', paddingRight: 'auto', textAlign: 'justify', textJustify: 'inter-word' }}>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.</div>
                                        </div>
                                    </div>
                                    {(publishType === 'IMAGE' || publishType === 'VIDEO') && <div style={{ maxWidth: '100%' }}>
                                        <img alt="" style={{ maxWidth: '100%', width: '100%', maxHeight: '300px', paddingLeft: 'auto', paddingRight: 'auto' }} src="https://1.bp.blogspot.com/-YLDLu1GApmQ/Tm-cKFIKE1I/AAAAAAAAEvQ/bp1zLkKJ6Cg/w1200-h630-p-k-no-nu/Purple+solid+color+backgrounds+1.png"></img>
                                    </div>}
                                    <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', width: '100%', marginLeft: 'auto', marginRight: 'auto', marginBottom: '10px', marginTop: '6px' }}>
                                        <div style={{ width: '33%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}><ThumbUp style={{ marginRight: '6px' }} /><b>{t(langKeys.postcreator_publish_facebookmockup_like)}</b></div>
                                        <div style={{ width: '34%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}><ChatBubble style={{ marginRight: '6px' }} /><b>{t(langKeys.postcreator_publish_facebookmockup_comment)}</b></div>
                                        <div style={{ width: '33%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}><Reply style={{ marginRight: '6px' }} /><b>{t(langKeys.postcreator_publish_facebookmockup_share)}</b></div>
                                    </div>
                                </div>
                            </div>}
                            {previewType === 'INSTAGRAMPREVIEW' && <div className="row-zyx">
                                <div style={{ width: '70%', marginLeft: 'auto', marginRight: 'auto', marginBottom: '18px', backgroundColor: 'white', borderRadius: '6px', border: '1px solid #959595' }}>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', marginBottom: '10px', paddingLeft: '18px', paddingTop: '18px' }}>
                                        <div style={{ display: 'inline-flex', verticalAlign: 'center' }}>
                                            <div style={{ height: '100%', display: 'flex', alignItems: 'center' }}>
                                                <img alt="" style={{ height: '36px', width: '36px', borderRadius: '50%', border: '2px solid #F43C9E', padding: '2px' }} src="https://1.bp.blogspot.com/-YLDLu1GApmQ/Tm-cKFIKE1I/AAAAAAAAEvQ/bp1zLkKJ6Cg/w1200-h630-p-k-no-nu/Purple+solid+color+backgrounds+1.png"></img>
                                            </div>
                                            <div style={{ height: '100%', paddingLeft: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                <b>{t(langKeys.postcreator_publish_officialpage)}</b>
                                            </div>
                                        </div>
                                    </div>
                                    {(publishType === 'IMAGE' || publishType === 'VIDEO') && <div style={{ maxWidth: '100%' }}>
                                        <img alt="" style={{ maxWidth: '100%', width: '100%', maxHeight: '300px', paddingLeft: 'auto', paddingRight: 'auto' }} src="https://1.bp.blogspot.com/-YLDLu1GApmQ/Tm-cKFIKE1I/AAAAAAAAEvQ/bp1zLkKJ6Cg/w1200-h630-p-k-no-nu/Purple+solid+color+backgrounds+1.png"></img>
                                    </div>}
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <img alt="" style={{ maxWidth: '100%', margin: 6 }} src="https://staticfileszyxme.s3.us-east.cloud-object-storage.appdomain.cloud/VCA%20PERU/334a434c-c07c-4904-8c49-9e425c7b3f8d/InstagramButton1.png"></img>
                                        <img alt="" style={{ maxWidth: '100%', margin: 6 }} src="https://staticfileszyxme.s3.us-east.cloud-object-storage.appdomain.cloud/VCA%20PERU/9a5d369c-3ffc-4f2e-84e9-bb10a4072a16/InstagramButton2.png"></img>
                                    </div>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', marginBottom: '20px', paddingLeft: '5px', paddingRight: '10px', paddingTop: '6px' }}>
                                        <div style={{ height: '100%', paddingLeft: '5px', display: 'flex', flexDirection: 'column', alignItems: 'center', whiteSpace: 'pre-line' }}>
                                            <div style={{ width: '100%', paddingRight: 'auto', textAlign: 'justify', textJustify: 'inter-word' }}><b>{t(langKeys.postcreator_publish_officialpage)}</b> Lorem Ipsum is simply dummy text of the printing and typesetting industry.</div>
                                        </div>
                                    </div>
                                </div>
                            </div>}
                            {previewType === 'TWITTERPREVIEW' && <div className="row-zyx">
                                <div style={{ width: '90%', marginLeft: 'auto', marginRight: 'auto', marginBottom: '18px', backgroundColor: 'white', border: '1px solid #959595' }}>
                                    <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'stretch', flexBasis: 'auto', flexShrink: 0, margin: 12 }}>
                                        <div style={{ flexBasis: '48px', flexGrow: 0, marginRight: '12px', alignItems: 'center', display: 'flex', flexDirection: 'column', flexShrink: 0, position: 'relative' }}>
                                            <div style={{ height: '100%', display: 'flex' }}>
                                                <img alt="" style={{ height: '40px', width: '40px', borderRadius: '50%' }} src="https://1.bp.blogspot.com/-YLDLu1GApmQ/Tm-cKFIKE1I/AAAAAAAAEvQ/bp1zLkKJ6Cg/w1200-h630-p-k-no-nu/Purple+solid+color+backgrounds+1.png"></img>
                                            </div>
                                        </div>
                                        <div style={{ flexBasis: '0px', flexGrow: 1, alignItems: 'stretch', display: 'flex', flexDirection: 'column', position: 'relative', paddingRight: '6px' }}>
                                            <div style={{ display: 'flex', alignItems: 'start', justifyContent: 'space-between', flexDirection: 'row', flexBasis: 'auto', flexShrink: 0 }}>
                                                <b>{t(langKeys.postcreator_publish_officialpage)}</b> @{t(langKeys.postcreator_publish_officialpage)} · 24h
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'start', justifyContent: 'space-between', flexDirection: 'row', flexBasis: 'auto', flexShrink: 0 }}>
                                                <div style={{ height: '100%', paddingTop: '4px', display: 'flex', flexDirection: 'column', alignItems: 'center', whiteSpace: 'pre-line' }}>
                                                    <div style={{ display: 'flex', width: '100%', paddingRight: 'auto', textAlign: 'justify', textJustify: 'inter-word' }}>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.</div>
                                                </div>
                                            </div>
                                            {(publishType === 'IMAGE' || publishType === 'VIDEO') && <div style={{ display: 'flex', justifyContent: 'center', marginTop: '10px' }}>
                                                <img alt="" style={{ maxWidth: '100%', width: '100%', maxHeight: '200px', borderRadius: '8px' }} src="https://1.bp.blogspot.com/-YLDLu1GApmQ/Tm-cKFIKE1I/AAAAAAAAEvQ/bp1zLkKJ6Cg/w1200-h630-p-k-no-nu/Purple+solid+color+backgrounds+1.png"></img>
                                            </div>}
                                            <div style={{ display: 'flex', justifyContent: 'center' }}>
                                                <img alt="" style={{ maxWidth: '100%', marginTop: 6, marginLeft: 6, marginRight: 6 }} src="https://staticfileszyxme.s3.us-east.cloud-object-storage.appdomain.cloud/VCA%20PERU/6c942c26-3778-47fc-9284-7814a7981b1a/TwitterButton1.png"></img>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>}
                            {previewType === 'LINKEDINPREVIEW' && <div className="row-zyx">
                                <div style={{ width: '90%', marginLeft: 'auto', marginRight: 'auto', marginBottom: '18px', backgroundColor: 'white', borderRadius: '6px', border: '1px solid #959595' }}>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', marginBottom: '4px', paddingLeft: '18px', paddingTop: '18px' }}>
                                        <div style={{ display: 'inline-flex', verticalAlign: 'center' }}>
                                            <div style={{ height: '100%', display: 'flex', alignItems: 'center' }}>
                                                <img alt="" style={{ height: '40px', width: '40px', borderRadius: '50%' }} src="https://1.bp.blogspot.com/-YLDLu1GApmQ/Tm-cKFIKE1I/AAAAAAAAEvQ/bp1zLkKJ6Cg/w1200-h630-p-k-no-nu/Purple+solid+color+backgrounds+1.png"></img>
                                            </div>
                                            <div style={{ height: '100%', paddingLeft: '10px', display: 'flex', flexDirection: 'column', alignItems: 'center', whiteSpace: 'pre-line' }}>
                                                <div style={{ display: 'flex', width: '100%', paddingRight: 'auto' }}><b>{t(langKeys.postcreator_publish_officialpage)}</b></div>
                                                <div style={{ display: 'flex', width: '100%', paddingRight: 'auto' }}>{t(langKeys.postcreator_publish_linkedin_time)}</div>
                                            </div>
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', marginBottom: '12px', paddingLeft: '10px', paddingRight: '20px', paddingTop: '10px' }}>
                                        <div style={{ height: '100%', paddingLeft: '10px', display: 'flex', flexDirection: 'column', alignItems: 'center', whiteSpace: 'pre-line' }}>
                                            <div style={{ display: 'flex', width: '100%', paddingRight: 'auto', textAlign: 'justify', textJustify: 'inter-word' }}>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.</div>
                                        </div>
                                    </div>
                                    {(publishType === 'IMAGE' || publishType === 'VIDEO') && <div style={{ maxWidth: '100%' }}>
                                        <img alt="" style={{ maxWidth: '100%', width: '100%', maxHeight: '300px', paddingLeft: 'auto', paddingRight: 'auto' }} src="https://1.bp.blogspot.com/-YLDLu1GApmQ/Tm-cKFIKE1I/AAAAAAAAEvQ/bp1zLkKJ6Cg/w1200-h630-p-k-no-nu/Purple+solid+color+backgrounds+1.png"></img>
                                    </div>}
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <img alt="" style={{ maxWidth: '100%', marginLeft: 16, marginBottom: 6 }} src="https://staticfileszyxme.s3.us-east.cloud-object-storage.appdomain.cloud/VCA%20PERU/60b26115-5c3a-4097-a29c-0db8f0967240/LinkedInButton1.png"></img>
                                        <img alt="" style={{ maxWidth: '100%', marginRight: 16, marginBottom: 6 }} src="https://staticfileszyxme.s3.us-east.cloud-object-storage.appdomain.cloud/VCA%20PERU/b9c67f51-5291-4fb6-a76a-d295ad8dac98/LinkedInButton2.png"></img>
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', width: '100%', marginLeft: 'auto', marginRight: 'auto', marginBottom: '14px', marginTop: '6px', fontSize: '12px' }}>
                                        <div style={{ width: '12%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}><AccountCircle style={{ height: '16px', width: '16px' }} /></div>
                                        <div style={{ width: '22%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}><ThumbUp style={{ height: '16px', width: '16px', marginRight: '2px' }} /><b>{t(langKeys.postcreator_publish_linkedin_like)}</b></div>
                                        <div style={{ width: '22%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}><ChatBubble style={{ height: '16px', width: '16px', marginRight: '2px' }} /><b>{t(langKeys.postcreator_publish_linkedin_comment)}</b></div>
                                        <div style={{ width: '22%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}><Replay style={{ height: '16px', width: '16px', marginRight: '2px' }} /><b>{t(langKeys.postcreator_publish_linkedin_repost)}</b></div>
                                        <div style={{ width: '22%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}><Send style={{ height: '16px', width: '16px', marginRight: '2px' }} /><b>{t(langKeys.postcreator_publish_linkedin_send)}</b></div>
                                    </div>
                                </div>
                            </div>}
                            {previewType === 'YOUTUBEPREVIEW' && <div className="row-zyx">
                                <div style={{ width: '90%', marginLeft: 'auto', marginRight: 'auto', marginBottom: '18px', backgroundColor: 'white', border: '1px solid #959595' }}>
                                    {(publishType === 'IMAGE' || publishType === 'VIDEO') && <div style={{ maxWidth: '100%' }}>
                                        <img alt="" style={{ maxWidth: '100%', width: '100%', maxHeight: '300px', paddingLeft: 'auto', paddingRight: 'auto' }} src="https://1.bp.blogspot.com/-YLDLu1GApmQ/Tm-cKFIKE1I/AAAAAAAAEvQ/bp1zLkKJ6Cg/w1200-h630-p-k-no-nu/Purple+solid+color+backgrounds+1.png"></img>
                                    </div>}
                                    <div style={{ display: 'flex', flexWrap: 'wrap', marginBottom: '10px', paddingLeft: '10px', paddingRight: '20px', paddingTop: '10px' }}>
                                        <div style={{ width: '100%', textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden', paddingLeft: '6px' }}>
                                            <b>Lorem Ipsum is simply dummy text of the printing and typesetting industry.</b>
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', marginBottom: '10px', paddingLeft: '18px', paddingTop: '6px' }}>
                                        <div style={{ display: 'inline-flex', verticalAlign: 'center' }}>
                                            <div style={{ height: '100%', display: 'flex', alignItems: 'center' }}>
                                                <img alt="" style={{ height: '40px', width: '40px', borderRadius: '50%' }} src="https://1.bp.blogspot.com/-YLDLu1GApmQ/Tm-cKFIKE1I/AAAAAAAAEvQ/bp1zLkKJ6Cg/w1200-h630-p-k-no-nu/Purple+solid+color+backgrounds+1.png"></img>
                                            </div>
                                            <div style={{ height: '100%', paddingLeft: '10px', display: 'flex', flexDirection: 'column', alignItems: 'center', whiteSpace: 'pre-line', marginBottom: '10px' }}>
                                                <div style={{ display: 'flex', width: '100%', paddingRight: 'auto' }}><b>{t(langKeys.postcreator_publish_officialpage)}</b></div>
                                                <div style={{ display: 'flex', width: '100%', paddingRight: 'auto' }}>16k {t(langKeys.postcreator_publish_youtube_subscribers)}</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>}
                            {previewType === 'TIKTOKPREVIEW' && <div className="row-zyx">
                                <div style={{ width: '70%', marginLeft: 'auto', marginRight: 'auto', marginBottom: '18px', paddingBottom: '16px', backgroundColor: 'white', borderRadius: '6px', border: '1px solid #959595' }}>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', marginBottom: '10px', paddingLeft: '18px', paddingTop: '6px' }}>
                                        <div style={{ display: 'inline-flex', verticalAlign: 'center' }}>
                                            <div style={{ height: '100%', display: 'flex', alignItems: 'center' }}>
                                                <img alt="" style={{ height: '40px', width: '40px', borderRadius: '50%' }} src="https://1.bp.blogspot.com/-YLDLu1GApmQ/Tm-cKFIKE1I/AAAAAAAAEvQ/bp1zLkKJ6Cg/w1200-h630-p-k-no-nu/Purple+solid+color+backgrounds+1.png"></img>
                                            </div>
                                            <div style={{ height: '100%', paddingLeft: '10px', display: 'flex', flexDirection: 'column', alignItems: 'center', whiteSpace: 'pre-line', marginBottom: '10px' }}>
                                                <div style={{ display: 'flex', width: '100%', paddingRight: 'auto' }}><b>{t(langKeys.postcreator_publish_officialpage)}</b></div>
                                                <div style={{ display: 'flex', width: '100%', paddingRight: 'auto' }}>Lorem Ipsum is simply dummy text of the printing and typesetting industry.</div>
                                            </div>
                                        </div>
                                    </div>
                                    {(publishType === 'IMAGE' || publishType === 'VIDEO') && <div style={{ maxWidth: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', }}>
                                        <img alt="" style={{ maxWidth: '80%', display: 'flex', width: '80%', maxHeight: '340px', paddingLeft: 'auto', paddingRight: 'auto', borderRadius: '8px' }} src="https://1.bp.blogspot.com/-YLDLu1GApmQ/Tm-cKFIKE1I/AAAAAAAAEvQ/bp1zLkKJ6Cg/w1200-h630-p-k-no-nu/Purple+solid+color+backgrounds+1.png"></img>
                                    </div>}
                                </div>
                            </div>}
                            <div className="row-zyx" style={{ marginTop: '18px', alignItems: 'center', display: 'flex', justifyContent: 'center' }}>
                                <Button
                                    className={classes.button}
                                    variant="contained"
                                    color="primary"
                                    startIcon={<Save color="secondary" />}
                                    style={{ backgroundColor: "#762AA9", display: 'flex', alignItems: 'center' }}
                                    onClick={() => { setOpenModal(true); }}
                                >{t(langKeys.postcreator_publish_draft)}
                                </Button>
                                <Button
                                    className={classes.button}
                                    variant="contained"
                                    color="primary"
                                    startIcon={<Timelapse color="secondary" />}
                                    style={{ backgroundColor: "#762AA9", display: 'flex', alignItems: 'center' }}
                                    onClick={() => { setOpenModal(true); }}
                                >{t(langKeys.postcreator_publish_program)}
                                </Button>
                                <Button
                                    className={classes.button}
                                    variant="contained"
                                    color="primary"
                                    startIcon={<Send color="secondary" />}
                                    style={{ backgroundColor: "#11ABF1", display: 'flex', alignItems: 'center' }}
                                    onClick={() => { setOpenModal(true); }}
                                >{t(langKeys.postcreator_publish_publish)}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </Fragment >
        </div>
    )
}

const SavePostModalGeneric: FC<{ data: any, openModal: boolean, setOpenModal: (param: any) => void, onTrigger: () => void }> = ({ data, openModal, setOpenModal, onTrigger }) => {
    const dispatch = useDispatch();

    const { t } = useTranslation();

    return (
        <DialogZyx
            open={openModal}
            title={t(langKeys.regulatepayment)}
            buttonText1={t(langKeys.cancel)}
            handleClickButton1={() => setOpenModal(false)}
            buttonText2={t(langKeys.save)}
            handleClickButton2={() => { }}
            button2Type="submit"
        >
            <React.Fragment>
                <MuiPickersUtilsProvider utils={DateFnsUtils} locale={(localesLaraigo() as any)[navigator.language.split('-')[0]]}>
                    <KeyboardDatePicker
                        invalidDateMessage={t(langKeys.invalid_date_format)}
                        format={getLocaleDateString()}
                        value={null}
                        onChange={(e: any) => {
                        }}
                        style={{ minWidth: '150px' }}
                    />
                </MuiPickersUtilsProvider>
                <MuiPickersUtilsProvider utils={DateFnsUtils} locale={(localesLaraigo())[navigator.language.split('-')[0]]}>
                    <KeyboardTimePicker
                        ampm={false}
                        views={['hours', 'minutes', 'seconds']}
                        format="HH:mm:ss"
                        error={false}
                        helperText={''}
                        value={null}
                        onChange={(e: any) => { }}
                        style={{ minWidth: '150px' }}
                    />
                </MuiPickersUtilsProvider>
            </React.Fragment>
        </DialogZyx>
    )
}

export default PostCreatorPublish;