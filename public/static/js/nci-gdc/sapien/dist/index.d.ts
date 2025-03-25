interface TConfig {
    caseCountKey?: string;
    clickHandler?: (e: any) => void;
    mouseOverHandler?: (e: any) => void;
    mouseOutHandler?: (e: any) => void;
    keyDownHandler?: ({ elem, data }: { elem: HTMLElement; data: any }) => void;
    keyUpHandler?: () => void;
    skipLinkId?: string;
    ariaLabel?: (d: any) => string;
    data?: any;
    fileCountKey?: string;
    height?: number;
    labelSize?: string;
    offsetLeft?: number;
    offsetTop?: number;
    primarySiteKey?: string;
    selector?: any;
    width?: number;
    tickInterval?: number;
    title?: string;
    xAxisLabel?: string;
}

type TCreateHumanBody = (c: TConfig) => void;
declare const createHumanBody: TCreateHumanBody;

declare const _default: Record<string, string>;

export { type TConfig, _default as colorCodes, createHumanBody };
