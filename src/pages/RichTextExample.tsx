import { makeStyles } from "@material-ui/styles";
import { RichText, renderToString, toElement } from "components/fields/RichText";
import { FC, useEffect, useMemo, useState } from "react";
import { Descendant } from "slate";

const useStyles = makeStyles(theme => ({
    richText: {
        width: 300,
        height: 500,
    }
}));

const initialValue2: Descendant[] = [{ "type": "paragraph", "children": [{ "text": "aaaa" }], align: "left" }];
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
        ], align: "left"
    },
    {
        type: "paragraph",
        children: [
            {
                text: "sdsd",
                underline: true
            }
        ], 
        align: "left"
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
                ], align: "left",
            },
            {
                type: "list-item",
                children: [
                    {
                        underline: true,
                        bold: true,
                        text: "sddf"
                    }
                ], align: "left",
            },
            {
                type: "list-item",
                children: [
                    {
                        underline: true,
                        bold: true,
                        text: "dfdf"
                    }
                ], align: "left",
            }
        ], align: "left",
    },
    {
        type: "image-src",
        url: "https://th.bing.com/th/id/OIP.gvv_i9XbYFxfWwacHe-VLAHaHa?w=180&h=180&c=7&r=0&o=5&dpr=1.5&pid=1.7",
        children: [
            {
                text: ""
            }
        ], align: "left"
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
        ], align: "left"
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
                ], align: "left",
            },
            {
                type: "list-item",
                children: [
                    {
                        text: "dfdf"
                    }
                ], align: "left",
            },
            {
                type: "list-item",
                children: [
                    {
                        text: "asd"
                    }
                ], align: "left",
            }
        ], 
        align: "left"
    }
];

const RichTextExample: FC = () => {
    // const classes = useStyles();
    const [value, setValue] = useState<Descendant[]>(initialValue2);
    const ele = useMemo(() => toElement(value), [value]);

    return (
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
            <RichText
                value={value}
                onChange={e => {
                    setValue(e);
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
