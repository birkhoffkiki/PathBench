interface Window {
  sapien?: {
    createHumanBody: (config: {
      title: string;
      selector: HTMLElement;
      width: number;
      height: number;
      data: Array<{ key: string; fileCount: number; caseCount: number }>;
      labelSize: string;
      primarySiteKey: string;
      fileCountKey: string;
      caseCountKey: string;
      tickInterval: number;
      offsetLeft: number;
      offsetTop: number;
      clickHandler: (e: { key: string }) => void;
      mouseOverHandler: () => void;
      mouseOutHandler: () => void;
      keyDownHandler: () => void;
      keyUpHandler: () => void;
      skipLinkId: string;
      ariaLabel: (d: { key?: string; caseCount?: number; fileCount?: number }) => string;
    }) => void;
  };
}