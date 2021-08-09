import React from "react";

export interface RouteConfig {
    key: string;
    description: React.ReactNode;
    path?: string;
    icon?: (className: string) => React.ReactNode;
    show?: () => boolean;
}
