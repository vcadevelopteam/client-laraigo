/* eslint-disable no-eval */
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
        "description": "agrees",
        "value": "1267092843327003"
    },
    {
        "description": "attends",
        "value": "668012816568345"
    },
    {
        "description": "bikes",
        "value": "642337999135827"
    },
    {
        "description": "boxes",
        "value": "681781771858116"
    },
    {
        "description": "calls",
        "value": "1226135157422772"
    },
    {
        "description": "celebrates",
        "value": "742120442490915"
    },
    {
        "description": "climbs",
        "value": "681782675191359"
    },
    {
        "description": "contacts",
        "value": "1294635240572763"
    },
    {
        "description": "dances",
        "value": "701721669864126"
    },
    {
        "description": "disagrees",
        "value": "1270648612971426"
    },
    {
        "description": "drinks",
        "value": "383634741672822"
    },
    {
        "description": "eats",
        "value": "383634705006159"
    },
    {
        "description": "exercises",
        "value": "678359018867058"
    },
    {
        "description": "fake_exercising_type",
        "value": "718343998201893"
    },
    {
        "description": "feels",
        "value": "383634835006146"
    },
    {
        "description": "gets",
        "value": "809472139089078"
    },
    {
        "description": "goes_to",
        "value": "556187044417590"
    },
    {
        "description": "golfs",
        "value": "681783365191290"
    },
    {
        "description": "hikes",
        "value": "680527725316854"
    },
    {
        "description": "listens",
        "value": "383634868339476"
    },
    {
        "description": "looks_for",
        "value": "601369976565963"
    },
    {
        "description": "makes",
        "value": "809472309089061"
    },
    {
        "description": "meets",
        "value": "809471075755851"
    },
    {
        "description": "other",
        "value": "637142219655405"
    },
    {
        "description": "plays",
        "value": "520095228026772"
    },
    {
        "description": "practices_yoga",
        "value": "701743366528623"
    },
    {
        "description": "prepares_to_vote",
        "value": "1500689486634003"
    },
    {
        "description": "races",
        "value": "681783721857921"
    },
    {
        "description": "rafts",
        "value": "681784405191186"
    },
    {
        "description": "reads",
        "value": "383635058339457"
    },
    {
        "description": "registers_to_vote",
        "value": "1503898576313094"
    },
    {
        "description": "remembers",
        "value": "902228273146797"
    },
    {
        "description": "responds_to",
        "value": "1443817305654555"
    },
    {
        "description": "runs",
        "value": "642340799135547"
    },
    {
        "description": "scuba_dives",
        "value": "701743106528649"
    },
    {
        "description": "selects_verb",
        "value": "806115869424705"
    },
    {
        "description": "skateboards",
        "value": "701743266528633"
    },
    {
        "description": "skates",
        "value": "681784615191165"
    },
    {
        "description": "skis",
        "value": "681784731857820"
    },
    {
        "description": "skydives",
        "value": "681784815191145"
    },
    {
        "description": "snowboards",
        "value": "681785285191098"
    },
    {
        "description": "streams",
        "value": "1136670953035860"
    },
    {
        "description": "supports",
        "value": "721170054585954"
    },
    {
        "description": "surfs",
        "value": "681785361857757"
    },
    {
        "description": "swims",
        "value": "681785451857748"
    },
    {
        "description": "thinks_about",
        "value": "809473052422320"
    },
    {
        "description": "travels",
        "value": "580961725273455"
    },
    {
        "description": "votes",
        "value": "532534113449550"
    },
    {
        "description": "walks",
        "value": "681794311856862"
    },
    {
        "description": "watches",
        "value": "383634671672829"
    },
    {
        "description": "weight_trains",
        "value": "701743316528628"
    },
    {
        "description": "writes_a_novel_about",
        "value": "906305289405762"
    }
];

export const dataFeelings = [
    {
        "description": "accomplished",
        "value": "136050896551329"
    },
    {
        "description": "adventurous",
        "value": "224113357712800"
    },
    {
        "description": "afraid",
        "value": "477377185634506"
    },
    {
        "description": "aggravated",
        "value": "496880480349772"
    },
    {
        "description": "alive",
        "value": "293001494136243"
    },
    {
        "description": "alone",
        "value": "467368809976558"
    },
    {
        "description": "amazed",
        "value": "480134215368252"
    },
    {
        "description": "amazing",
        "value": "387919524627259"
    },
    {
        "description": "amused",
        "value": "134212056751013"
    },
    {
        "description": "angry",
        "value": "474440915941169"
    },
    {
        "description": "annoyed",
        "value": "297656947028236"
    },
    {
        "description": "anxious",
        "value": "383436105075371"
    },
    {
        "description": "appreciated",
        "value": "306190182814450"
    },
    {
        "description": "ashamed",
        "value": "318310054951137"
    },
    {
        "description": "asleep",
        "value": "303442589773009"
    },
    {
        "description": "awake",
        "value": "583994558322574"
    },
    {
        "description": "awesome",
        "value": "212888755520954"
    },
    {
        "description": "awful",
        "value": "188581634613319"
    },
    {
        "description": "awkward",
        "value": "177928135686600"
    },
    {
        "description": "bad",
        "value": "146684115480015"
    },
    {
        "description": "beautiful",
        "value": "112706382231213"
    },
    {
        "description": "betrayed",
        "value": "404280269648178"
    },
    {
        "description": "better",
        "value": "182865315188048"
    },
    {
        "description": "bitter",
        "value": "446022422113486"
    },
    {
        "description": "blah",
        "value": "140035382814582"
    },
    {
        "description": "blessed",
        "value": "525497104142297"
    },
    {
        "description": "blissful",
        "value": "387086391386101"
    },
    {
        "description": "blue",
        "value": "419290478143195"
    },
    {
        "description": "bored",
        "value": "319023651545197"
    },
    {
        "description": "brave",
        "value": "458789517502771"
    },
    {
        "description": "broke",
        "value": "175661129243188"
    },
    {
        "description": "broken",
        "value": "523276417697246"
    },
    {
        "description": "bummed",
        "value": "1378774059036900"
    },
    {
        "description": "busy",
        "value": "542241122475897"
    },
    {
        "description": "butterflies",
        "value": "323850287719041"
    },
    {
        "description": "calm",
        "value": "398469726900244"
    },
    {
        "description": "challenged",
        "value": "315111361928320"
    },
    {
        "description": "cheated",
        "value": "572770509406697"
    },
    {
        "description": "chill",
        "value": "435107453233854"
    },
    {
        "description": "clean",
        "value": "448222258560574"
    },
    {
        "description": "cold",
        "value": "474696702568524"
    },
    {
        "description": "comfortable",
        "value": "310743825703427"
    },
    {
        "description": "complete",
        "value": "185781948291090"
    },
    {
        "description": "concerned",
        "value": "763383973675043"
    },
    {
        "description": "confident",
        "value": "304503342999403"
    },
    {
        "description": "conflicted",
        "value": "1415854281982190"
    },
    {
        "description": "confused",
        "value": "454085554651356"
    },
    {
        "description": "connected",
        "value": "254652897997221"
    },
    {
        "description": "content",
        "value": "175500129263221"
    },
    {
        "description": "cool",
        "value": "522810741064609"
    },
    {
        "description": "cozy",
        "value": "677416365623414"
    },
    {
        "description": "crafty",
        "value": "185043488351934"
    },
    {
        "description": "crappy",
        "value": "448720711855088"
    },
    {
        "description": "crazy",
        "value": "261120550681093"
    },
    {
        "description": "creative",
        "value": "723514731011973"
    },
    {
        "description": "curious",
        "value": "439395256134907"
    },
    {
        "description": "cute",
        "value": "1423895511173360"
    },
    {
        "description": "deep",
        "value": "232156420251730"
    },
    {
        "description": "defeated",
        "value": "173049629485438"
    },
    {
        "description": "delighted",
        "value": "241047402726961"
    },
    {
        "description": "depressed",
        "value": "304415886341920"
    },
    {
        "description": "desperate",
        "value": "495987653841807"
    },
    {
        "description": "determined",
        "value": "481524978563580"
    },
    {
        "description": "devastated",
        "value": "1436894813190430"
    },
    {
        "description": "different",
        "value": "362967447132618"
    },
    {
        "description": "dirty",
        "value": "176346375845361"
    },
    {
        "description": "disappointed",
        "value": "452141451511412"
    },
    {
        "description": "discouraged",
        "value": "312593595513522"
    },
    {
        "description": "disgusted",
        "value": "196306397222496"
    },
    {
        "description": "dizzy",
        "value": "454203404634531"
    },
    {
        "description": "done",
        "value": "1425570984404220"
    },
    {
        "description": "down",
        "value": "530630090295653"
    },
    {
        "description": "drained",
        "value": "103045573200429"
    },
    {
        "description": "drunk",
        "value": "523630957654812"
    },
    {
        "description": "dumb",
        "value": "456698301033363"
    },
    {
        "description": "ecstatic",
        "value": "440061956059003"
    },
    {
        "description": "embarrassed",
        "value": "141310729353005"
    },
    {
        "description": "emotional",
        "value": "397384367005610"
    },
    {
        "description": "empowered",
        "value": "461450543913513"
    },
    {
        "description": "energized",
        "value": "384499584968015"
    },
    {
        "description": "enraged",
        "value": "447161205364401"
    },
    {
        "description": "entertained",
        "value": "213741785474768"
    },
    {
        "description": "evil",
        "value": "424719750948543"
    },
    {
        "description": "excited",
        "value": "308167675961412"
    },
    {
        "description": "exhausted",
        "value": "175848009223562"
    },
    {
        "description": "fabulous",
        "value": "225844924256849"
    },
    {
        "description": "fantastic",
        "value": "380040505422122"
    },
    {
        "description": "fat",
        "value": "518208571552601"
    },
    {
        "description": "fed_up",
        "value": "657281157637033"
    },
    {
        "description": "festive",
        "value": "460758320708708"
    },
    {
        "description": "fine",
        "value": "503105606387726"
    },
    {
        "description": "flirty",
        "value": "336850836424731"
    },
    {
        "description": "focused",
        "value": "565795223489339"
    },
    {
        "description": "fortunate",
        "value": "260039780790007"
    },
    {
        "description": "free",
        "value": "402497769831045"
    },
    {
        "description": "freezing",
        "value": "1422663388031100"
    },
    {
        "description": "fresh",
        "value": "380152055410929"
    },
    {
        "description": "frozen",
        "value": "545125512294980"
    },
    {
        "description": "frustrated",
        "value": "134525380036694"
    },
    {
        "description": "full",
        "value": "221700014640844"
    },
    {
        "description": "funky",
        "value": "440473466019047"
    },
    {
        "description": "funny",
        "value": "481480165224794"
    },
    {
        "description": "furious",
        "value": "680290595328899"
    },
    {
        "description": "generous",
        "value": "479384852111869"
    },
    {
        "description": "giddy",
        "value": "235901389908205"
    },
    {
        "description": "glad",
        "value": "405846839495020"
    },
    {
        "description": "good",
        "value": "102834939889560"
    },
    {
        "description": "goofy",
        "value": "222141467963402"
    },
    {
        "description": "grateful",
        "value": "118365354995398"
    },
    {
        "description": "great",
        "value": "478653915517976"
    },
    {
        "description": "gross",
        "value": "499965416702234"
    },
    {
        "description": "grumpy",
        "value": "234279653398171"
    },
    {
        "description": "guilty",
        "value": "137611796392379"
    },
    {
        "description": "happy",
        "value": "528297480516636"
    },
    {
        "description": "healthy",
        "value": "121929377969929"
    },
    {
        "description": "heartbroken",
        "value": "173736256107087"
    },
    {
        "description": "helpless",
        "value": "524624334228920"
    },
    {
        "description": "homesick",
        "value": "379102322179939"
    },
    {
        "description": "honored",
        "value": "393785000701594"
    },
    {
        "description": "hopeful",
        "value": "125401434308511"
    },
    {
        "description": "hopeless",
        "value": "296496940471115"
    },
    {
        "description": "horrible",
        "value": "572307689451923"
    },
    {
        "description": "hot",
        "value": "481464001906476"
    },
    {
        "description": "human",
        "value": "464539273604104"
    },
    {
        "description": "hungover",
        "value": "380553855372818"
    },
    {
        "description": "hungry",
        "value": "182008128606193"
    },
    {
        "description": "hurt",
        "value": "519942028024389"
    },
    {
        "description": "hyper",
        "value": "246661122137353"
    },
    {
        "description": "ignored",
        "value": "102806669892467"
    },
    {
        "description": "ill",
        "value": "1437827213104290"
    },
    {
        "description": "impatient",
        "value": "601002259913609"
    },
    {
        "description": "important",
        "value": "231313840334791"
    },
    {
        "description": "impressed",
        "value": "492615107512006"
    },
    {
        "description": "in_love",
        "value": "494709810570459"
    },
    {
        "description": "inadequate",
        "value": "455437077825793"
    },
    {
        "description": "incomplete",
        "value": "460019124035757"
    },
    {
        "description": "insecure",
        "value": "316682001780104"
    },
    {
        "description": "inspired",
        "value": "539354326075059"
    },
    {
        "description": "insulted",
        "value": "521323164558116"
    },
    {
        "description": "invisible",
        "value": "140842299401114"
    },
    {
        "description": "irritated",
        "value": "111894762331662"
    },
    {
        "description": "jealous",
        "value": "310567035720031"
    },
    {
        "description": "jolly",
        "value": "590889874293829"
    },
    {
        "description": "joyful",
        "value": "477906418922117"
    },
    {
        "description": "kind",
        "value": "121854771312324"
    },
    {
        "description": "lame",
        "value": "128593617299805"
    },
    {
        "description": "lazy",
        "value": "482688958436815"
    },
    {
        "description": "light",
        "value": "473714049334527"
    },
    {
        "description": "lonely",
        "value": "230944533704180"
    },
    {
        "description": "lost",
        "value": "142029502613380"
    },
    {
        "description": "lousy",
        "value": "110822459087083"
    },
    {
        "description": "loved",
        "value": "123103951186111"
    },
    {
        "description": "lovely",
        "value": "446998542016581"
    },
    {
        "description": "low",
        "value": "237303323067212"
    },
    {
        "description": "lucky",
        "value": "385225238232619"
    },
    {
        "description": "mad",
        "value": "313728008732470"
    },
    {
        "description": "meh",
        "value": "483614251682491"
    },
    {
        "description": "mighty",
        "value": "568128836535281"
    },
    {
        "description": "mischievous",
        "value": "264992546982295"
    },
    {
        "description": "miserable",
        "value": "571661296183476"
    },
    {
        "description": "missing",
        "value": "285090421614547"
    },
    {
        "description": "motivated",
        "value": "361889323906463"
    },
    {
        "description": "naked",
        "value": "298451920275666"
    },
    {
        "description": "naughty",
        "value": "715784015098322"
    },
    {
        "description": "nauseous",
        "value": "183806708425669"
    },
    {
        "description": "needed",
        "value": "424263620973748"
    },
    {
        "description": "neglected",
        "value": "300338820078019"
    },
    {
        "description": "nerdy",
        "value": "1444736239087160"
    },
    {
        "description": "nervous",
        "value": "427487540649756"
    },
    {
        "description": "nice",
        "value": "302627039854817"
    },
    {
        "description": "normal",
        "value": "517127961654365"
    },
    {
        "description": "nostalgic",
        "value": "122644777898046"
    },
    {
        "description": "numb",
        "value": "562921890391638"
    },
    {
        "description": "offended",
        "value": "412837252120513"
    },
    {
        "description": "ok",
        "value": "355798581182727"
    },
    {
        "description": "okay",
        "value": "387278094708554"
    },
    {
        "description": "old",
        "value": "460679043988968"
    },
    {
        "description": "optimistic",
        "value": "336949906406031"
    },
    {
        "description": "overwhelmed",
        "value": "558247830856788"
    },
    {
        "description": "pained",
        "value": "398041520273122"
    },
    {
        "description": "peaceful",
        "value": "112626832239338"
    },
    {
        "description": "perfect",
        "value": "570387776308771"
    },
    {
        "description": "perplexed",
        "value": "579070352142516"
    },
    {
        "description": "pissed",
        "value": "451402584920300"
    },
    {
        "description": "pissed_off",
        "value": "111792392342530"
    },
    {
        "description": "positive",
        "value": "479820725401749"
    },
    {
        "description": "pretty",
        "value": "239721439491727"
    },
    {
        "description": "pride",
        "value": "424758317631906"
    },
    {
        "description": "privileged",
        "value": "574719705877314"
    },
    {
        "description": "productive",
        "value": "419908098077570"
    },
    {
        "description": "professional",
        "value": "508746172492084"
    },
    {
        "description": "proud",
        "value": "379355252154431"
    },
    {
        "description": "pumped",
        "value": "489032947800743"
    },
    {
        "description": "puzzled",
        "value": "236162099884421"
    },
    {
        "description": "qualified",
        "value": "418307201573307"
    },
    {
        "description": "ready",
        "value": "119368284895535"
    },
    {
        "description": "refreshed",
        "value": "223179361150272"
    },
    {
        "description": "regret",
        "value": "134375570053258"
    },
    {
        "description": "relaxed",
        "value": "257237487735977"
    },
    {
        "description": "relieved",
        "value": "144326115717748"
    },
    {
        "description": "renewed",
        "value": "262215447237902"
    },
    {
        "description": "rested",
        "value": "446177835443534"
    },
    {
        "description": "restless",
        "value": "115150618652191"
    },
    {
        "description": "rich",
        "value": "529731510371705"
    },
    {
        "description": "romantic",
        "value": "426598624132585"
    },
    {
        "description": "rough",
        "value": "285541821549499"
    },
    {
        "description": "sad",
        "value": "175710752574432"
    },
    {
        "description": "safe",
        "value": "501513576535666"
    },
    {
        "description": "sarcastic",
        "value": "430043350410361"
    },
    {
        "description": "satisfied",
        "value": "235625646568477"
    },
    {
        "description": "scared",
        "value": "312496145517583"
    },
    {
        "description": "secure",
        "value": "394357883978959"
    },
    {
        "description": "sexy",
        "value": "377645925661276"
    },
    {
        "description": "shame",
        "value": "173748716082652"
    },
    {
        "description": "shattered",
        "value": "572226156127232"
    },
    {
        "description": "shocked",
        "value": "321467047972614"
    },
    {
        "description": "shy",
        "value": "364338266994675"
    },
    {
        "description": "sick",
        "value": "476550682397236"
    },
    {
        "description": "silly",
        "value": "383853628365632"
    },
    {
        "description": "sleepy",
        "value": "447011778694338"
    },
    {
        "description": "small",
        "value": "202833099854068"
    },
    {
        "description": "smart",
        "value": "273544029435160"
    },
    {
        "description": "sneaky",
        "value": "1417990221767680"
    },
    {
        "description": "sore",
        "value": "505758512791686"
    },
    {
        "description": "sorry",
        "value": "134199530067829"
    },
    {
        "description": "special",
        "value": "458612287529287"
    },
    {
        "description": "spoiled",
        "value": "555806244488510"
    },
    {
        "description": "spooky",
        "value": "178149542386140"
    },
    {
        "description": "stoked",
        "value": "228847670625498"
    },
    {
        "description": "strange",
        "value": "314827511960085"
    },
    {
        "description": "stressed",
        "value": "317729321673351"
    },
    {
        "description": "strong",
        "value": "379034115519395"
    },
    {
        "description": "stuck",
        "value": "361696270593406"
    },
    {
        "description": "stuffed",
        "value": "362434367185234"
    },
    {
        "description": "stupid",
        "value": "108452055991606"
    },
    {
        "description": "super",
        "value": "490506127661127"
    },
    {
        "description": "surprised",
        "value": "123408067820719"
    },
    {
        "description": "terrible",
        "value": "302564446527376"
    },
    {
        "description": "thankful",
        "value": "443609379021593"
    },
    {
        "description": "thirsty",
        "value": "336824293085938"
    },
    {
        "description": "thoughtful",
        "value": "1376863072561420"
    },
    {
        "description": "threatened",
        "value": "459581634101438"
    },
    {
        "description": "tipsy",
        "value": "432506746872402"
    },
    {
        "description": "tired",
        "value": "457215007658974"
    },
    {
        "description": "trapped",
        "value": "203005859835975"
    },
    {
        "description": "ugly",
        "value": "182045508666558"
    },
    {
        "description": "unappreciated",
        "value": "528783467139337"
    },
    {
        "description": "uncomfortable",
        "value": "510737378958941"
    },
    {
        "description": "undecided",
        "value": "705949909416373"
    },
    {
        "description": "uneasy",
        "value": "129223110569301"
    },
    {
        "description": "unhappy",
        "value": "141533259331712"
    },
    {
        "description": "unimportant",
        "value": "213398135463020"
    },
    {
        "description": "unloved",
        "value": "322898331158888"
    },
    {
        "description": "unsure",
        "value": "199894526861510"
    },
    {
        "description": "unwanted",
        "value": "102812219891392"
    },
    {
        "description": "unwell",
        "value": "122931521203254"
    },
    {
        "description": "upset",
        "value": "305456379574177"
    },
    {
        "description": "useless",
        "value": "222075591260352"
    },
    {
        "description": "wanted",
        "value": "343592532414827"
    },
    {
        "description": "warm",
        "value": "122332771262500"
    },
    {
        "description": "weak",
        "value": "472717649445600"
    },
    {
        "description": "weird",
        "value": "305794379521525"
    },
    {
        "description": "welcome",
        "value": "133724320118050"
    },
    {
        "description": "welcomed",
        "value": "441356962596309"
    },
    {
        "description": "well",
        "value": "133598250129553"
    },
    {
        "description": "wet",
        "value": "591501134250204"
    },
    {
        "description": "whole",
        "value": "508892355811724"
    },
    {
        "description": "wonderful",
        "value": "502842009736003"
    },
    {
        "description": "worried",
        "value": "169789739868247"
    },
    {
        "description": "worse",
        "value": "310182259086056"
    },
    {
        "description": "worthless",
        "value": "398377870242717"
    },
    {
        "description": "young",
        "value": "123868331108076"
    },
    {
        "description": "yucky",
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
                if (text.charAt(i) === text.charAt(j)) {
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

export function secondsToHourTime(sec_num: any) {
    sec_num = parseInt(sec_num)
    let days = Math.floor(sec_num / 86400);
    let hours: any = Math.floor((sec_num - (days * 86400)) / 3600);
    let minutes: any = Math.floor((sec_num - (days * 86400) - (hours * 3600)) / 60);
    let seconds: any = sec_num - (days * 86400) - (hours * 3600) - (minutes * 60);
    if (hours < 10 && days === 0) { hours = "0" + hours; } else { hours = days * 24 + hours }
    if (minutes < 10) { minutes = "0" + minutes; }
    if (seconds < 10) { seconds = "0" + seconds; }
    return hours + ':' + minutes + ':' + seconds;
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
    let rex = new RegExp(/{{[\?\w\s\u00C0-\u00FF]+?}}/, 'g');
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

export const getFormattedDate = (date: Date) => {
    const offset = date.getTimezoneOffset();
    date = new Date(date.getTime() - (offset * 60 * 1000));
    return date.toISOString().split('T')[0];
}

const transDayLocal = (day: Date) => day.getDay() - 1 < 0 ? 6 : day.getDay() - 1;

export const calculateDateFromWeek = (datex: Date) => {
    const currentDate = new Date(datex.getFullYear(), datex.getMonth(), datex.getDate())

    const dayCurrent = transDayLocal(currentDate);

    const firstDayWeek = new Date(currentDate.setDate(currentDate.getDate() - dayCurrent));

    return Array.from(Array(7).keys()).map(x => {
        const date = new Date(new Date(firstDayWeek).setDate(firstDayWeek.getDate() + x));
        return {
            date: date,
            dateString: date.toISOString().substring(0, 10),
            dow: date.getDay(),
            dom: date.getDate(),
            isToday: currentDate.getTime() === date.getTime(),
        }
    })
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

export const dayNames2 = [
    'monday',
    'tuesday',
    'wednesday',
    'thursday',
    'friday',
    'saturday',
    'sunday',
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