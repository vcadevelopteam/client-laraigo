import { Box } from "@material-ui/core";
import { FC } from "react";

interface TabPanelProps {
    value: string;
    index: string;
}

export const TabPanel: FC<TabPanelProps> = ({ children, value, index }) => {
    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`wrapped-tabpanel-${value}`}
            aria-labelledby={`wrapped-tab-${value}`}
            style={{ display: value === index ? 'block' : 'none', overflowY: 'auto' }}
        >
            <Box p={3}  style={{padding: "24px 0"}}>
                {children}
            </Box>
        </div>
    );
}