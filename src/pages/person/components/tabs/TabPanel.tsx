import { Box } from "@material-ui/core";
import { FC } from "react";
import { TabPanelProps } from "pages/person/model";

const TabPanel: FC<TabPanelProps> = ({ children, value, index }) => {
    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`wrapped-tabpanel-${value}`}
            aria-labelledby={`wrapped-tab-${value}`}
            style={{ display: value === index ? 'flex' : 'none', overflowY: 'auto' }}
        >
            <Box p={3}  style={{padding: "24px 0", width: "100%"}}>
                {children}
            </Box>
        </div>
    );
}

export default TabPanel;