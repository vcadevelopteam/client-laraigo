/* eslint-disable no-useless-escape */
import { Dictionary } from "@types";
// import * as XLSX from 'xlsx';

export const dataYears = Array.from(Array(21).keys()).map(x => ({ value: `${new Date().getFullYear() + x - 10}` }));

export const dataMonths = [
    {
        val: "01"
    },
    {
        val: "02"
    },
    {
        val: "03"
    },
    {
        val: "04"
    },
    {
        val: "05"
    },
    {
        val: "06"
    },
    {
        val: "07"
    },
    {
        val: "08"
    },
    {
        val: "09"
    },
    {
        val: "10"
    },
    {
        val: "11"
    },
    {
        val: "12"
    }
];

export const dataActivities = [
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
];

export const dataFeelings = [
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
];

export function formatNumber(num: number) {
    if (num)
        return parseFloat(num.toString()).toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
    return "0.00"
}

export function formatNumberFourDecimals(num: number) {
    if (num)
        return parseFloat(num.toString()).toFixed(4).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1')
    return "0.0000"
}

export function formatNumberNoDecimals(num: number) {
    if (num)
        return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
    return "0"
}



export function formattime(cc: any) {
    if (!cc)
        return "0";
    let hh = Math.floor(cc / 3600) > 0 ? `${Math.floor(cc / 3600)}h ` : ""
    let mm = Math.floor((cc % 3600) / 60) > 0 ? `${Math.floor((cc % 3600) / 60)}m ` : ""
    let ss = `${cc % 60}s`
    return `${hh}${mm}${ss}`
}

export function validateNumbersEqualsConsecutive(text: string, limit: number) {
    let canxx = 1;
    for (var i = 0; i < text.length; i++) {
        if (/^\d+$/.test(text.charAt(i))) {
            canxx = 1;
            for (var j = i + 1; j < text.length; j++) {
                if (text.charAt(i) == text.charAt(j)) {
                    canxx++;
                }
            }
            if (canxx > limit) {
                return false;
            }
        }
    }
    return true;
}

export function validateDomainCharacters(text: string, regex: any, option: string) {
    switch (option) {
        case "01": //comienza
            return (eval(`/^[${regex}]/`).test(text));
        case "05": //termina
            return (eval(`/[${regex}]/g`).test(text.substring(text.length - 1)));
        case "02": //incluye
            return (eval(`/[${regex}]/`).test(text));
        case "03": //mas de 1
            return text.replace(eval(`/[^${regex}]/g`), "").length > 1 ? true : false;
        default:
            return true;
    }
}

export function validateDomainCharactersSpecials(text: string, option: string) {
    let charactersallowed = `! " # $ % & ' ( ) * + , - . / : ; < = > ? @ [ \ ] ^ _ { | } ~`
    switch (option) {
        case "01": //comienza
            return charactersallowed.includes(text.substring(0, 1));
        case "05": //termina
            return charactersallowed.includes(text.substring(text.length - 1));
        case "02": //incluye
            let isok = false;
            charactersallowed.split(" ").forEach(c => {
                if (text.includes(c))
                    isok = true;
            });
            return isok;
        case "03": //mas de 1

            let count = 0;
            charactersallowed.split(" ").forEach(c => {
                count += text.split('').reduce((t, l) => t = t + (l === c ? 1 : 0), 0);
            });


            return count > 1;
        default:
            return true;
    }
}

export function timetoseconds(cc: any) {
    if (!cc)
        return 0;
    const times = cc.split(":");

    const hour = parseInt(times[0]);
    const minutes = parseInt(times[1]);
    const seconds = times[2] ? parseInt(times[2]) : 0;
    return (hour * 60 * 60) + (minutes * 60) + seconds;
}
export function timetomin(cc: any) {
    if (!cc)
        return 0;
    const times = cc.split(":");
    const hour = parseInt(times[0]);
    const minutes = parseInt(times[1]);
    const seconds = parseInt(times[2]);
    return hour * 60 + minutes + (seconds >= 30 ? 1 : 0);
}
export function formatname(cc: any) {
    if (cc) {
        let newname = cc.toLowerCase();
        let names = newname.split(" ");
        for (let i = 0; i < names.length; i++) {
            names[i] = (names[i] ? names[i][0].toUpperCase() : "") + names[i].substr(1);
        }
        return names.join(" ")
    }
    else {
        return ''
    }
}

export function secondsToDayTime(sec_num: any) {
    sec_num = parseInt(sec_num)
    let days = Math.floor(sec_num / 86400);
    let hours: any = Math.floor((sec_num - (days * 86400)) / 3600);
    let minutes: any = Math.floor((sec_num - (days * 86400) - (hours * 3600)) / 60);
    let seconds: any = sec_num - (days * 86400) - (hours * 3600) - (minutes * 60);
    if (hours < 10) { hours = "0" + hours; }
    if (minutes < 10) { minutes = "0" + minutes; }
    if (seconds < 10) { seconds = "0" + seconds; }
    const stringdays = days === 0 ? "" : (days > 1 ? days + " days " : days + " day ");
    return stringdays + hours + ':' + minutes + ':' + seconds;
}

export function uuidv4(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c === 'x' ? r : ((r & 0x3) | 0x8);
        return v.toString(16);
    });
}

export function isJson(s: string): boolean {
    try {
        JSON.parse(s);
    } catch (e) {
        return false;
    }
    return true;
}

export function extractVariables(text: string, array: string[] = []): string[] {
    let rex = new RegExp(/{{[\w\s\u00C0-\u00FF]+?}}/, 'g');
    return Array.from(new Set([...array, ...Array.from(text.matchAll(rex), (m: any[]) => m[0].replace(/[{]{2}/, '').replace(/[}]{2}/, ''))]));
}

export function extractVariablesFromArray(data: any[], key: string, array: string[] = []): string[] {
    return data.reduce((a: any[], d: any) => {
        a = Array.from(new Set([...a, ...extractVariables(d[key], array)]))
        return a;
    }, []);
}

export function dictToArrayKV(dict: Dictionary, key: string = 'key', value: string = 'value') {
    return Object.entries(dict).reduce((a: any[], [k, v]) => {
        a.push({ [key]: k, [value]: v });
        return a;
    }, []);
}

export function richTextToString(data: Dictionary[]) {
    try {
        return data.reduce((ac: Dictionary[], c: Dictionary) => (
            [...ac, ...c?.children?.map((m: Dictionary) => (
                m?.children ? `- ${m?.children[0]?.text}` : m?.text
            ))]
        ), []).join('\n')
    } catch (error) {
        return JSON.stringify(data)
    }
}

export function filterPipe(items: Dictionary[], field: string, value: any, inv?: string) {
    // If there are not items return empty//
    if (!items) return [];
    // If '%' contains wildcard and value is empty return items//
    if (inv === '%' && (!value || value === '')) return items;
    // If filter === '' return empty//
    if (value === '') return [];
    // If there are not filter value return all items//
    if (!value || value.length === 0) return [];
    // If the filter value is a number//
    if (items.length > 0 && typeof items[0][field] === 'number') {
        return items.filter(it => it[field].toString() === value.toString());
    }
    // If '%' contains wildcard is a string contains//
    else if (inv === '%') {
        return items.filter(it => it[field]?.toLowerCase().includes(value.toLowerCase()));
    }
    // If '!' inverter filter is a string not equals//
    else if (inv === '!') {
        return items.filter(it => it[field]?.toLowerCase().indexOf(value.toLowerCase()) === -1);
    }
    // If the filter value is a string is a string equals//
    else {
        return items.filter(it => it[field]?.toLowerCase().indexOf(value.toLowerCase()) !== -1);
    }
}

export function filterIf(data: Dictionary[], rif?: string, rifvalue?: string) {
    return data.filter(d => [null, undefined].includes(d.rif) || (d.rif === rif && d.rifvalue === rifvalue));
}

interface DownloadCSVOptions {
    headers?: string[] | ((header: string, index: number) => string);
}

export function downloadCSV(filename: string, data: Dictionary[], options: DownloadCSVOptions = {}) {
    const columns = Object.keys(data[0]);
    let headers = "";
    if (options.headers) {
        if (options.headers.length !== columns.length) {
            console.warn('La cantidad de columnas de data[0] no coinciden con el de header de las opciones');
        }

        if (typeof options.headers === "function") {
            // Se ejecuta una funcion para cada key de columns
            for (let i = 0; i < columns.length; i++) {
                const result = options.headers(columns[i], i);
                if (i < columns.length - 1) {
                    headers += `${result};`;
                } else {
                    headers += result;
                }
            }
        } else if (Array.isArray(options.headers)) {
            // Se coloca el header en el mismo orden y cantidad
            headers = options.headers.join(';');
        } else {
            // eslint-disable-next-line no-throw-literal
            throw 'El tipo de options.header no es valido';
        }

    } else {
        headers = columns.join(';');
    }

    let csv = headers;
    data.forEach(dt => {
        csv += '\r\n';
        csv += Object.values(dt).join(';');
    });
    let BOM = "\uFEFF";
    var blob = new Blob([BOM + csv], { type: 'text/csv;charset=utf-8;' });
    var link = document.createElement('a');
    if (link.download !== undefined) {
        var url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', filename);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
}

export const downloadJson = (filename: string, data: any) => {
    const blob = new Blob([JSON.stringify(data, null, 4)], { type: 'application/json;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
        var url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', filename);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
}

export function uploadCSV(file: any, owner: any = {}) {
    var reader = new FileReader();
    reader.readAsText(file);
    return new Promise((res, rej) => {
        reader.onload = (event: any) => {
            let csv = event.target.result.toString();
            if (csv !== null) {
                let allTextLines = csv.split(/\r\n|\n/);
                let headers = allTextLines[0].split(';');
                let lines = [];
                for (let i = 1; i < allTextLines.length; i++) {
                    if (allTextLines[i].split(';').length === headers.length) {
                        const line = allTextLines[i].split(';')
                        const data = {
                            ...headers.reduce((ad: any, key: any, j: number) => ({
                                ...ad,
                                [key]: line[j]
                            }), {}),
                            ...owner
                        }
                        lines.push(data)
                    }
                }
                res(lines);
            }
            res(null);
        };
    });
}

export function uploadExcel(file: any, owner: any = {}) {
    return new Promise((res, rej) => {
        import('xlsx').then(XLSX => {
            var reader = new FileReader();
            reader.readAsBinaryString(file);
            reader.onload = (event: any) => {
                var data = event.target.result;
                let workbook = XLSX.read(data, { type: 'binary' });
                const wsname = workbook.SheetNames[0];
                // const ws = workbook.Sheets[wsname];
                // sheet_to_row_object_array
                let rowsx = XLSX.utils.sheet_to_json(workbook.Sheets[wsname])
                    .map((row: any) =>
                        Object.keys(row).reduce((obj: any, key: any) => {
                            obj[key.trim()] = row[key];
                            return obj;
                        }, {})
                    );
                res(rowsx)
            };
        });
    });
}

export const dateToLocalDate = (date: string, returnType = 'string'): string | Date => {
    if (!date) return new Date().toLocaleDateString();
    const nn = new Date(date)
    const dateCleaned = new Date(nn.getTime() + (nn.getTimezoneOffset() * 60 * 1000));
    if (returnType === 'string')
        return dateCleaned.toLocaleDateString(undefined, { year: "numeric", month: "2-digit", day: "2-digit" });
    else
        return dateCleaned;
}

export const todayDate = (): Date => {
    return new Date(new Date(new Date().getTime() - new Date().getTimezoneOffset() * 60 * 1000).toISOString().substring(0, 10) + "T00:00:00");
}

export const convertLocalDate = (date: string | null | undefined, validateWithToday: boolean = false, subtractHours: boolean = true): Date => {
    if (!date) return new Date()
    const dateCleaned = new Date(date)
    // const dateCleaned = new Date(nn.getTime() + (subtractHours ? (nn.getTimezoneOffset() * 60 * 1000 * -1) : 0));
    return validateWithToday ? (dateCleaned > new Date() ? new Date() : dateCleaned) : dateCleaned;
}

export const toTime12HR = (time: string): string => {
    const [h, m] = time.split(':');
    const hint = parseInt(h)
    return `${(hint > 12 ? 24 - hint : hint).toString().padStart(2, "0")}:${m}:${hint > 11 ? "PM" : "AM"}`
}

export const toTime24HR = (time: string): string => {
    const [h, m] = time.split(':');
    const hint = parseInt(h)
    return `${hint.toString().padStart(2, "0")}:${m}`
}

export const secondsToTime = (seconds: number): string => {
    const hh = Math.floor(seconds / 3600);
    const mm = Math.floor((seconds / 60) % 60);
    const ss = Math.floor(seconds % 60);
    return `${hh.toString().padStart(2, "0")}:${mm.toString().padStart(2, "0")}:${ss.toString().padStart(2, "0")}`;
}

export function formatCurrency(num: number) {
    if (num)
        return num.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
    return "0.00"
}

export function formatCurrencyNoDecimals(num: number) {
    if (num)
        return num.toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
    return "0"
}

export const getSecondsUntelNow = (date: Date, regressive: boolean = false): number => !regressive ? Math.floor((new Date().getTime() - date.getTime()) / 1000) : Math.floor((date.getTime() - new Date().getTime()) / 1000);

export const getTimeBetweenDates = (date1: Date, date2: Date): string => secondsToTime(Math.floor((date2.getTime() - date1.getTime()) / 1000));

export const getDateCleaned = (date: Date): string => new Date(date.setHours(10)).toISOString().substring(0, 10)

export const cleanedRichResponse = (data: Dictionary[], variablesContext: Dictionary = {}): Dictionary[] => {
    return data.filter((x: Dictionary) => ["content", "structured message", "action"].includes(x.plugincategory) && !["closestlocation"].includes(x.pluginid)).map((y: Dictionary) => {
        let content = y.stringsmooch;
        if (y.config.randomlist) {
            if (y.config.multiple) {
                const rn = Math.floor(Math.random() * (y.config.randomlist.Count));
                content = y.config.randomlist[rn].value;
            }
            else
                content = y.config.randomlist[0].value;
        }
        const variableToReplace = y.variablereplace ? y.variablereplace : [];

        variableToReplace.forEach((varr: any) => {
            const varrtmp = varr.split("&&&")[0];
            const valueFound = variablesContext!![varrtmp]?.value || "";
            content = content.replace('{{' + varrtmp + '}}', valueFound);
        });

        return {
            type: y.pluginid === "url" ? "text" : y.pluginid,
            content,
        }
    });
}

export const capitalize = (text: string) => {
    const lower = text.toLowerCase();
    return text.charAt(0).toUpperCase() + lower.slice(1);
}

export const object_trimmer = (data: any) => {
    if (!data) {
        return Object.keys(data).reduce((k, v) => (
            {
                ...k,
                [v]: typeof data[v] === 'string' ? data[v]?.trim() : data[v]
            }
        ), {})
    }
    else {
        return {};
    }
}

export const array_trimmer = (data: any[]) => {
    if (Array.isArray(data)) {
        return data.reduce((a: any[], e: any) => (
            [
                ...a,
                Object.keys(e).reduce((k, v) => (
                    {
                        ...k,
                        [v]: typeof e[v] === 'string' ? e[v]?.trim() : e[v]
                    }
                ), {})
            ]
        ), []);
    }
    else {
        return [];
    }
}

export const randomInterval = (min: number, max: number) => { // min and max included 
    return Math.floor(Math.random() * (max - min + 1) + min)
}

export const randomText = (length = 8, use_upper = false, use_number = false, use_especial = false) => {
    const lower = 'abcdefghijklmnopqrstuvwxyz';
    const upper = 'ABCDEFGHIJkLMNOPQRSTUVWXYZ';
    const number = '0123456789';
    const especial = String.raw`!"#$%&'()*+,-./\\:;<=>?@[]\`^_{|}~`;
    let chars = lower.split('');
    if (use_upper)
        chars = [...chars, ...upper.split('')];
    if (use_number)
        chars = [...chars, ...number.split('')];
    if (use_especial)
        chars = [...chars, ...especial.split('')];
    return Array(length).fill(null).reduce((r, e, i) => {
        let c = '';
        if (i > 0)
            c = chars.filter(c => c !== r[i - 1])[randomInterval(0, chars.filter(c => c !== r[i - 1]).length - 1)]
        else
            c = chars[randomInterval(0, chars.length - 1)]
        r.push(c);
        return r;
    }, []).join('');
}

export const templateMaker = (data: any[], header: string[]) => {
    const max = (Math.max(...data.map((d: Dictionary) => Object.keys(d).length)) || 1);
    let temp: any[] = new Array(max).fill(0).map(() => ({}));
    for (let i = 0; i < max; i++) {
        header.forEach((d, j) => {
            let datakey = Object.keys(data[j] || {})[i];
            if (datakey === data[j][datakey])
                temp[i][d] = Object.keys(data[j] || {})[i]
            else
                temp[i][d] = `${datakey} - ${data[j][datakey]}`
        })
    }
    return temp;
}

export const getDateToday = () => new Date(new Date().setHours(10));

export const getFirstDayMonth = () => new Date(new Date(new Date().setHours(10)).setDate(1));

export const getLastDayMonth = () => new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0);

export const getLocaleDateString = () => {
    const formats: any = {
        "af-ZA": "yyyy/MM/dd",
        "am-ET": "d/M/yyyy",
        "ar-AE": "dd/MM/yyyy",
        "ar-BH": "dd/MM/yyyy",
        "ar-DZ": "dd-MM-yyyy",
        "ar-EG": "dd/MM/yyyy",
        "ar-IQ": "dd/MM/yyyy",
        "ar-JO": "dd/MM/yyyy",
        "ar-KW": "dd/MM/yyyy",
        "ar-LB": "dd/MM/yyyy",
        "ar-LY": "dd/MM/yyyy",
        "ar-MA": "dd-MM-yyyy",
        "ar-OM": "dd/MM/yyyy",
        "ar-QA": "dd/MM/yyyy",
        "ar-SA": "dd/MM/yy",
        "ar-SY": "dd/MM/yyyy",
        "ar-TN": "dd-MM-yyyy",
        "ar-YE": "dd/MM/yyyy",
        "arn-CL": "dd-MM-yyyy",
        "as-IN": "dd-MM-yyyy",
        "az-Cyrl-AZ": "dd.MM.yyyy",
        "az-Latn-AZ": "dd.MM.yyyy",
        "ba-RU": "dd.MM.yy",
        "be-BY": "dd.MM.yyyy",
        "bg-BG": "dd.M.yyyy",
        "bn-BD": "dd-MM-yy",
        "bn-IN": "dd-MM-yy",
        "bo-CN": "yyyy/M/d",
        "br-FR": "dd/MM/yyyy",
        "bs-Cyrl-BA": "d.M.yyyy",
        "bs-Latn-BA": "d.M.yyyy",
        "ca-ES": "dd/MM/yyyy",
        "co-FR": "dd/MM/yyyy",
        "cs-CZ": "d.M.yyyy",
        "cy-GB": "dd/MM/yyyy",
        "da-DK": "dd-MM-yyyy",
        "de-AT": "dd.MM.yyyy",
        "de-CH": "dd.MM.yyyy",
        "de-DE": "dd.MM.yyyy",
        "de-LI": "dd.MM.yyyy",
        "de-LU": "dd.MM.yyyy",
        "dsb-DE": "d. M. yyyy",
        "dv-MV": "dd/MM/yy",
        "el-GR": "d/M/yyyy",
        "en": "MM/dd/yyyy",
        "en-029": "MM/dd/yyyy",
        "en-AU": "d/MM/yyyy",
        "en-BZ": "dd/MM/yyyy",
        "en-CA": "dd/MM/yyyy",
        "en-GB": "dd/MM/yyyy",
        "en-IE": "dd/MM/yyyy",
        "en-IN": "dd-MM-yyyy",
        "en-JM": "dd/MM/yyyy",
        "en-MY": "d/M/yyyy",
        "en-NZ": "d/MM/yyyy",
        "en-PH": "M/d/yyyy",
        "en-SG": "d/M/yyyy",
        "en-TT": "dd/MM/yyyy",
        "en-US": "M/d/yyyy",
        "en-ZA": "yyyy/MM/dd",
        "en-ZW": "M/d/yyyy",
        "es": "dd/MM/yyyy",
        "es-419": "dd/MM/yyyy",
        "es-AR": "dd/MM/yyyy",
        "es-BO": "dd/MM/yyyy",
        "es-CL": "dd-MM-yyyy",
        "es-CO": "dd/MM/yyyy",
        "es-CR": "dd/MM/yyyy",
        "es-DO": "dd/MM/yyyy",
        "es-EC": "dd/MM/yyyy",
        "es-ES": "dd/MM/yyyy",
        "es-GT": "dd/MM/yyyy",
        "es-HN": "dd/MM/yyyy",
        "es-MX": "dd/MM/yyyy",
        "es-NI": "dd/MM/yyyy",
        "es-PA": "MM/dd/yyyy",
        "es-PE": "dd/MM/yyyy",
        "es-PR": "dd/MM/yyyy",
        "es-PY": "dd/MM/yyyy",
        "es-SV": "dd/MM/yyyy",
        "es-US": "M/d/yyyy",
        "es-UY": "dd/MM/yyyy",
        "es-VE": "dd/MM/yyyy",
        "et-EE": "d.MM.yyyy",
        "eu-ES": "yyyy/MM/dd",
        "fa-IR": "MM/dd/yyyy",
        "fi-FI": "d.M.yyyy",
        "fil-PH": "M/d/yyyy",
        "fo-FO": "dd-MM-yyyy",
        "fr-BE": "d/MM/yyyy",
        "fr-CA": "yyyy-MM-dd",
        "fr-CH": "dd.MM.yyyy",
        "fr-FR": "dd/MM/yyyy",
        "fr-LU": "dd/MM/yyyy",
        "fr-MC": "dd/MM/yyyy",
        "fy-NL": "d-M-yyyy",
        "ga-IE": "dd/MM/yyyy",
        "gd-GB": "dd/MM/yyyy",
        "gl-ES": "dd/MM/yy",
        "gsw-FR": "dd/MM/yyyy",
        "gu-IN": "dd-MM-yy",
        "ha-Latn-NG": "d/M/yyyy",
        "he-IL": "dd/MM/yyyy",
        "hi-IN": "dd-MM-yyyy",
        "hr-BA": "d.M.yyyy.",
        "hr-HR": "d.M.yyyy",
        "hsb-DE": "d. M. yyyy",
        "hu-HU": "yyyy. MM. dd.",
        "hy-AM": "dd.MM.yyyy",
        "id-ID": "dd/MM/yyyy",
        "ig-NG": "d/M/yyyy",
        "ii-CN": "yyyy/M/d",
        "is-IS": "d.M.yyyy",
        "it-CH": "dd.MM.yyyy",
        "it-IT": "dd/MM/yyyy",
        "iu-Cans-CA": "d/M/yyyy",
        "iu-Latn-CA": "d/MM/yyyy",
        "ja-JP": "yyyy/MM/dd",
        "ka-GE": "dd.MM.yyyy",
        "kk-KZ": "dd.MM.yyyy",
        "kl-GL": "dd-MM-yyyy",
        "km-KH": "yyyy-MM-dd",
        "kn-IN": "dd-MM-yy",
        "ko-KR": "yyyy. MM. dd",
        "kok-IN": "dd-MM-yyyy",
        "ky-KG": "dd.MM.yy",
        "lb-LU": "dd/MM/yyyy",
        "lo-LA": "dd/MM/yyyy",
        "lt-LT": "yyyy.MM.dd",
        "lv-LV": "yyyy.MM.dd.",
        "mi-NZ": "dd/MM/yyyy",
        "mk-MK": "dd.MM.yyyy",
        "ml-IN": "dd-MM-yy",
        "mn-MN": "yy.MM.dd",
        "mn-Mong-CN": "yyyy/M/d",
        "moh-CA": "M/d/yyyy",
        "mr-IN": "dd-MM-yyyy",
        "ms-BN": "dd/MM/yyyy",
        "ms-MY": "dd/MM/yyyy",
        "mt-MT": "dd/MM/yyyy",
        "nb-NO": "dd.MM.yyyy",
        "ne-NP": "M/d/yyyy",
        "nl-BE": "d/MM/yyyy",
        "nl-NL": "d-M-yyyy",
        "nn-NO": "dd.MM.yyyy",
        "nso-ZA": "yyyy/MM/dd",
        "oc-FR": "dd/MM/yyyy",
        "or-IN": "dd-MM-yy",
        "pa-IN": "dd-MM-yy",
        "pl-PL": "dd.MM.yyyy",
        "prs-AF": "dd/MM/yy",
        "ps-AF": "dd/MM/yy",
        "pt-BR": "d/M/yyyy",
        "pt-PT": "dd-MM-yyyy",
        "qut-GT": "dd/MM/yyyy",
        "quz-BO": "dd/MM/yyyy",
        "quz-EC": "dd/MM/yyyy",
        "quz-PE": "dd/MM/yyyy",
        "rm-CH": "dd/MM/yyyy",
        "ro-RO": "dd.MM.yyyy",
        "ru-RU": "dd.MM.yyyy",
        "rw-RW": "M/d/yyyy",
        "sa-IN": "dd-MM-yyyy",
        "sah-RU": "MM.dd.yyyy",
        "se-FI": "d.M.yyyy",
        "se-NO": "dd.MM.yyyy",
        "se-SE": "yyyy-MM-dd",
        "si-LK": "yyyy-MM-dd",
        "sk-SK": "d. M. yyyy",
        "sl-SI": "d.M.yyyy",
        "sma-NO": "dd.MM.yyyy",
        "sma-SE": "yyyy-MM-dd",
        "smj-NO": "dd.MM.yyyy",
        "smj-SE": "yyyy-MM-dd",
        "smn-FI": "d.M.yyyy",
        "sms-FI": "d.M.yyyy",
        "sq-AL": "yyyy-MM-dd",
        "sr-Cyrl-BA": "d.M.yyyy",
        "sr-Cyrl-CS": "d.M.yyyy",
        "sr-Cyrl-ME": "d.M.yyyy",
        "sr-Cyrl-RS": "d.M.yyyy",
        "sr-Latn-BA": "d.M.yyyy",
        "sr-Latn-CS": "d.M.yyyy",
        "sr-Latn-ME": "d.M.yyyy",
        "sr-Latn-RS": "d.M.yyyy",
        "sv-FI": "d.M.yyyy",
        "sv-SE": "yyyy-MM-dd",
        "sw-KE": "M/d/yyyy",
        "syr-SY": "dd/MM/yyyy",
        "ta-IN": "dd-MM-yyyy",
        "te-IN": "dd-MM-yy",
        "tg-Cyrl-TJ": "dd.MM.yy",
        "th-TH": "d/M/yyyy",
        "tk-TM": "dd.MM.yy",
        "tn-ZA": "yyyy/MM/dd",
        "tr-TR": "dd.MM.yyyy",
        "tt-RU": "dd.MM.yyyy",
        "tzm-Latn-DZ": "dd-MM-yyyy",
        "ug-CN": "yyyy-M-d",
        "uk-UA": "dd.MM.yyyy",
        "ur-PK": "dd/MM/yyyy",
        "uz-Cyrl-UZ": "dd.MM.yyyy",
        "uz-Latn-UZ": "dd/MM yyyy",
        "vi-VN": "dd/MM/yyyy",
        "wo-SN": "dd/MM/yyyy",
        "xh-ZA": "yyyy/MM/dd",
        "yo-NG": "d/M/yyyy",
        "zh-CN": "yyyy/M/d",
        "zh-HK": "d/M/yyyy",
        "zh-MO": "d/M/yyyy",
        "zh-SG": "d/M/yyyy",
        "zh-TW": "yyyy/M/d",
        "zu-ZA": "yyyy/MM/dd",
    };

    return formats[navigator.language] || "dd/MM/yyyy";
}

export const calculateDateFromMonth = (year: number, month: number) => {
    const currentDate = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate())
    const countDays = new Date(year, month + 1, 0).getDate();
    const dayLastDay = new Date(year, month + 1, 0).getDay();
    const dayPreviewMonth = new Date(year, month, 1).getDay();

    const daysMonth = Array.from(Array(countDays).keys()).map(x => {
        const date = new Date(year, month, x + 1);
        return {
            date: date,
            dateString: date.toISOString().substring(0, 10),
            dow: date.getDay(),
            dom: date.getDate(),
            isToday: currentDate.getTime() === date.getTime(),
            isDayPreview: date < currentDate
        }
    })

    const daysPreviewMonth = Array.from(Array(dayPreviewMonth).keys()).map(x => {
        const date = new Date(year, month, - x);
        return {
            date: date,
            dateString: date.toISOString().substring(0, 10),
            dow: date.getDay(),
            dom: date.getDate(),
            isDayPreview: date < currentDate
        }
    }).reverse()

    const daysNextMonth = Array.from(Array(6 - dayLastDay).keys()).map(x => {
        const date = new Date(year, month + 1, x + 1);
        return {
            date: date,
            dateString: date.toISOString().substring(0, 10),
            dow: date.getDay(),
            dom: date.getDate(),
            isDayPreview: date < currentDate
        }
    })

    return [...daysPreviewMonth, ...daysMonth, ...daysNextMonth];
}

export const hours = [
    { desc: "00:00", value: "00:00:00" },
    { desc: "00:30", value: "00:30:00" },
    { desc: "01:00", value: "01:00:00" },
    { desc: "01:30", value: "01:30:00" },
    { desc: "02:00", value: "02:00:00" },
    { desc: "02:30", value: "02:30:00" },
    { desc: "03:00", value: "03:00:00" },
    { desc: "03:30", value: "03:30:00" },
    { desc: "04:00", value: "04:00:00" },
    { desc: "04:30", value: "04:30:00" },
    { desc: "05:00", value: "05:00:00" },
    { desc: "05:30", value: "05:30:00" },
    { desc: "06:00", value: "06:00:00" },
    { desc: "06:30", value: "06:30:00" },
    { desc: "07:00", value: "07:00:00" },
    { desc: "07:30", value: "07:30:00" },
    { desc: "08:00", value: "08:00:00" },
    { desc: "08:30", value: "08:30:00" },
    { desc: "09:00", value: "09:00:00" },
    { desc: "09:30", value: "09:30:00" },
    { desc: "10:00", value: "10:00:00" },
    { desc: "10:30", value: "10:30:00" },
    { desc: "11:00", value: "11:00:00" },
    { desc: "11:30", value: "11:30:00" },
    { desc: "12:00", value: "12:00:00" },
    { desc: "12:30", value: "12:30:00" },
    { desc: "13:00", value: "13:00:00" },
    { desc: "13:30", value: "13:30:00" },
    { desc: "14:00", value: "14:00:00" },
    { desc: "14:30", value: "14:30:00" },
    { desc: "15:00", value: "15:00:00" },
    { desc: "15:30", value: "15:30:00" },
    { desc: "16:00", value: "16:00:00" },
    { desc: "16:30", value: "16:30:00" },
    { desc: "17:00", value: "17:00:00" },
    { desc: "17:30", value: "17:30:00" },
    { desc: "18:00", value: "18:00:00" },
    { desc: "18:30", value: "18:30:00" },
    { desc: "19:00", value: "19:00:00" },
    { desc: "19:30", value: "19:30:00" },
    { desc: "20:00", value: "20:00:00" },
    { desc: "20:30", value: "20:30:00" },
    { desc: "21:00", value: "21:00:00" },
    { desc: "21:30", value: "21:30:00" },
    { desc: "22:00", value: "22:00:00" },
    { desc: "22:30", value: "22:30:00" },
    { desc: "23:00", value: "23:00:00" },
    { desc: "23:30", value: "23:30:00" },
]

export const dayNames = [
    'sunday',
    'monday',
    'tuesday',
    'wednesday',
    'thursday',
    'friday',
    'saturday',
]

export const validateIsUrl = (text: string) => {
    if (!text)
        return text;
    const regx = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
    const matches = text.match(regx);
    if (!matches || matches.length === 0)
        return text;
    const replaces = matches?.reduce((acc, item, index) => acc.replace(item, `<a href="###${index}###" target="_BLANK">###${index}###</a>`), text) || text
    return matches?.reduce((acc, item, index) => acc.replace(new RegExp(`###${index}###`, 'g'), item), replaces) || text
}