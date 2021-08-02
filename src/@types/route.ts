export interface RouteConfig {
    description: string;
    path?: string;
    icon?: (className?: string) => React.ReactNode;
    show?: () => boolean;
}
