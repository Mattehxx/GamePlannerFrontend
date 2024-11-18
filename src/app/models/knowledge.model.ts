import { preferenceModel } from "./preference.model";

export interface knowledgeModel {
    knowledgeId : number;
    name: string;
    isDeleted: boolean;
    preferences: Array<preferenceModel>
}