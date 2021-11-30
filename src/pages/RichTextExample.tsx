import { makeStyles } from "@material-ui/styles";
import { RichText } from "components";
import { renderToString, toElement } from "components/fields/RichText";
import { FC, useEffect, useMemo, useState } from "react";
import { Descendant } from "slate";

const useStyles = makeStyles(theme => ({
    richText: {
        width: 300,
        height: 500,
    }
}));

const initialValue2: Descendant[] = [{ "type": "paragraph", "children": [{ "text": "aaaa" }] }];
const initialValue: Descendant[] = [
    {
        type: "paragraph",
        children: [
            {
                text: "A line of text in a "
            },
            {
                text: "paragraph",
                bold: true
            },
            {
                text: "."
            }
        ]
    },
    {
        type: "paragraph",
        children: [
            {
                text: "sdsd",
                underline: true
            }
        ]
    },
    {
        type: "numbered-list",
        children: [
            {
                type: "list-item",
                children: [
                    {
                        underline: true,
                        text: "qqqq",
                        bold: true
                    }
                ]
            },
            {
                type: "list-item",
                children: [
                    {
                        underline: true,
                        bold: true,
                        text: "sddf"
                    }
                ]
            },
            {
                type: "list-item",
                children: [
                    {
                        underline: true,
                        bold: true,
                        text: "dfdf"
                    }
                ]
            }
        ]
    },
    {
        type: "image-src",
        url: "https://th.bing.com/th/id/OIP.gvv_i9XbYFxfWwacHe-VLAHaHa?w=180&h=180&c=7&r=0&o=5&dpr=1.5&pid=1.7",
        children: [
            {
                text: ""
            }
        ]
    },
    {
        type: "paragraph",
        children: [
            {
                text: "asdsdsdfcsv",
                code: true
            },
            {
                code: true,
                text: "svs",
                bold: true
            },
            {
                code: true,
                text: "vsd"
            }
        ]
    },
    {
        type: "bulleted-list",
        children: [
            {
                type: "list-item",
                children: [
                    {
                        text: "sd"
                    }
                ]
            },
            {
                type: "list-item",
                children: [
                    {
                        text: "dfdf"
                    }
                ]
            },
            {
                type: "list-item",
                children: [
                    {
                        text: "asd"
                    }
                ]
            }
        ]
    }
];

const RichTextExample: FC = () => {
    // const classes = useStyles();
    const [value, setValue] = useState<Descendant[]>(initialValue2);
    const ele = useMemo(() => toElement(value), [value]);

    useEffect(() => {
        console.log(renderToString(ele));
    }, []);

    return (
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
            <RichText
                value={value}
                onChange={e => {
                    setValue(e);
                    console.log(e);
                }}
                placeholder="Escribe algo"
                // className={classes.richText}
                spellCheck
            />
            <br />
            <h2>valor inicial estatico</h2>
            {ele}
        </div>
    );
}

export default RichTextExample;
