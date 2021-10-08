import React from "react";

export interface RouteConfig {
    key: string;
    description: React.ReactNode;
    tooltip: React.ReactChild;
    path?: string;
    /** default false */
    subroute?: boolean;
    /** used when subroute prop is true */
    initialSubroute?: string;
    icon?: (className: string) => React.ReactNode;
    show?: () => boolean;
}
