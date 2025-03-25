import { TConfig } from './types';
export type BodyplotDataEntry = Record<string, string | number>;
type TCreateHumanBody = (c: TConfig) => void;
export declare const createHumanBody: TCreateHumanBody;
export {};
