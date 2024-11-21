import { GameModel } from "./game.model";
import { knowledgeModel } from "./knowledge.model";
import { User } from "./user.model";

export interface preferenceModel {
    preferenceId: number;
    canBeMaster: boolean;
    userId: string;
    knowledgeId: number;
    gameId: number;
    isDeleted: boolean;
    user?: User;
    knowledge?: knowledgeModel;
    game?: GameModel
};
export interface preferenceInputModel {
    canBeMaster: boolean;
    userId: string;
    knowledgeId: number;
    gameId: number;
    game?: GameModel;
    knowledge?: knowledgeModel;
}