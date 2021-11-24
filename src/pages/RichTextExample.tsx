import { makeStyles } from "@material-ui/styles";
import { RichText } from "components";
import { FC, useState } from "react";
import { Descendant } from "slate";

const useStyles = makeStyles(thee => ({
    richText: {
        width: 300,
        height: 500,
    }
}));

const initialValue: Descendant[] = [
    {
        type: 'paragraph',
        children: [{ text: 'A line of text in a paragraph.' }],
    },
];

const RichTextExample: FC = () => {
    const classes = useStyles();
    const [value, setValue] = useState<Descendant[]>(initialValue);

    return (
        <RichText
            value={value}
            onChange={setValue}
            placeholder="Escribe algo"
            // className={classes.richText}
            spellCheck
        />
    );
}

export default RichTextExample;
