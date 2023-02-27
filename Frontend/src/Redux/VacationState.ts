import { createStore } from "redux";
import VacationModel from "../Models/VacationModel";


// 1. App State - application level state:
export class VacationsState {
    public vacations: VacationModel[] = [];
}

// 2. Action Type - list of actions needed on the data:
export enum VacationsActionType {
    FetchVacations = "FetchVacations",
    AddVacation = "AddVacation",
    UpdateVacation = "UpdateVacation",
    DeleteVacation = "DeleteVacation",
    FollowVacation = "FollowVacation",
    UnFollowVacation = "UnFollowVacation",
    DeleteFollowers = "DeleteFollowers "
}

// 3. Action - a single object describing single operation on the data:
export interface VacationsAction {
    type: VacationsActionType; // What we need to do?
    payload: any; // What is the data needed?
}

// 4. Reducer - function performing the needed actions (the action object is the one sent via dispatch function):
export function VacationsReducer(currentState = new VacationsState(), action: VacationsAction): VacationsState {

    const newState: VacationsState = { ...currentState };

    switch (action.type) {

        case VacationsActionType.FetchVacations: // Here the payload is the vacation list fetch by the server
            newState.vacations = action.payload;
            break;

        case VacationsActionType.AddVacation: // Here the payload is the added vacation

            newState.vacations.push(action.payload);
            break;

        case VacationsActionType.UpdateVacation: // Here the payload is the updated vacation
            const indexToUpdate = newState.vacations.findIndex(v => v.vacationId === action.payload.id);
            if (indexToUpdate >= 0) {
                newState.vacations[indexToUpdate] = action.payload;
            }
            break;

        case VacationsActionType.DeleteVacation: // Here the payload is id to delete
            const indexToDelete = newState.vacations.findIndex(v => v.vacationId === action.payload);
            if (indexToDelete >= 0) {
                newState.vacations.splice(indexToDelete, 1);
            }
            break;

        case VacationsActionType.FollowVacation:

            console.log(action.payload);

            const followVacation = newState.vacations.find(v => v.vacationId === action.payload)

            if (followVacation.isFollowing === 0) {
                followVacation.isFollowing = 1;
                followVacation.followersCount = Number.isNaN(followVacation.followersCount) ? 0 : followVacation.followersCount + 1;
            }

            break;

        case VacationsActionType.UnFollowVacation:
            const UnFollowVacation = newState.vacations.find(v => v.vacationId === action.payload)
            if (UnFollowVacation.isFollowing === 1) {
                UnFollowVacation.isFollowing = 0;
                UnFollowVacation.followersCount = Number.isNaN(UnFollowVacation.followersCount) ? 0 : UnFollowVacation.followersCount - 1;
            }

    break;

    case VacationsActionType.DeleteFollowers:
        const deleteFollowers = newState.vacations.find(f => f.vacationId === action.payload)
        deleteFollowers.followers -=1;


  }
    return newState;

}


// 5. Store - Redux manager:
export const vacationsStore = createStore(VacationsReducer);
