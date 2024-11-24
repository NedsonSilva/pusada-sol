import { IsActiveMatchOptions, Params, QueryParamsHandling } from '@angular/router';

export interface ZuziNavItem {
    id: string;
    title?: string;
    subtitle?: string;
    type: 'aside' | 'basic' | 'collapsable' | 'divider' | 'group' | 'spacer';
    hidden?: (item: ZuziNavItem) => boolean;
    active?: boolean;
    disabled?: boolean;
    tooltip?: string;
    link?: string;
    fragment?: string;
    preserveFragment?: boolean;
    queryParams?: Params | null;
    queryParamsHandling?: QueryParamsHandling | null;
    externalLink?: boolean;
    target?: '_blank' | '_self' | '_parent' | '_top' | string;
    exactMatch?: boolean;
    isActiveMatchOptions?: IsActiveMatchOptions;
    function?: (item: ZuziNavItem) => void;
    classes?: {
        title?: string;
        subtitle?: string;
        icon?: string;
        wrapper?: string;
    };
    icon?: string;
    badge?: {
        title?: string;
        classes?: string;
    };
    children?: ZuziNavItem[];
    meta?: any;
}

export type ZuziVerticalNavAppearance =
    | 'default'
    | 'compact'
    | 'dense'
    | 'thin';

export type ZuziVerticalNavMode = 'over' | 'side';

export type ZuziVerticalNavPosition = 'left' | 'right';
