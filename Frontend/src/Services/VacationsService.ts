import axios from 'axios';
import VacationModel from '../Models/VacationModel';
import { VacationsAction, VacationsActionType, VacationsState, vacationsStore } from '../Redux/VacationState';
import appConfig from '../Utils/AppConfig';


class VacationsService {

    public async getAllVacations(): Promise<VacationModel[]> {

        // Take Vacations from global state:
        let vacations = vacationsStore.getState().vacations;

        // If we don't have Vacations: 
        if (vacations.length === 0) {

            // Fetch Vacations from backend: 
            const response = await axios.get<VacationModel[]>(appConfig.vacationsUrl);
            vacations = response.data;

            // Send all Vacations into redux global state (which will call the reducer):
            const action: VacationsAction = { type: VacationsActionType.FetchVacations, payload: vacations };
            vacationsStore.dispatch(action);
        }

        // Return Vacations: 
        return vacations;
    }

    public async getOneVacation(id: number): Promise<VacationModel> {

        // Take vacations from global state:
        let vacations = vacationsStore.getState().vacations;

        // Find needed vacation from global state: 
        let vacation = vacations.find(v => v.vacationId === id);

        // If vacation not found:
        if (!vacation) {

            // Get vacation form server: 
            const response = await axios.get<VacationModel>(appConfig.adminVacationsUrl + id);
            vacation = response.data;
        }

        // Return vacation: 
        return vacation;
    }

    public async addVacation(vacation: VacationModel): Promise<void> {
        const headers = { "Content-Type": "multipart/form-data" }; // Tell axios that we're sending text and file to backend:

        const response = await axios.post<VacationModel>(appConfig.adminVacationsUrl, vacation, { headers });

        const addedVacation = response.data;

        // Send added vacation into redux global state (which will call the reducer):
        vacationsStore.dispatch({ type: VacationsActionType.AddVacation, payload: addedVacation });
    }

    public async updateVacation(vacation: VacationModel): Promise<void> {
        const headers = { "Content-Type": "multipart/form-data" }; // Tell axios that we're sending text and file to backend:
        const response = await axios.put<VacationModel>(appConfig.adminVacationsUrl + vacation.vacationId, vacation, { headers });
        const updatedVacation = response.data;

        // Send update vacation into redux global state (which will call the reducer):
        vacationsStore.dispatch({ type: VacationsActionType.UpdateVacation, payload: updatedVacation });
    }

    public async deleteVacation(id: number): Promise<void> {
        await axios.delete(appConfig.adminVacationsUrl + id);

        // Send delete id into redux global state (which will call the reducer):
        vacationsStore.dispatch({ type: VacationsActionType.DeleteVacation, payload: id });
    }

  
    public async follow(vacationId: number):Promise<void> {
        try{
            const response = await axios.post (appConfig.followUrl+vacationId);
            vacationsStore.dispatch({
                type: VacationsActionType.FollowVacation,payload: vacationId})
            }
            catch (err:any){
                console.log(err);
            }
    }
    public async unfollow(vacationId: number):Promise<void>{
        try{
            axios.delete(appConfig.followUrl + vacationId)
            vacationsStore.dispatch({type:VacationsActionType.UnFollowVacation,payload: vacationId})
            vacationsStore.dispatch({type:VacationsActionType.DeleteFollowers, payload:vacationId})
        }
        catch (err:any){
            alert(err)
        }
    }
}

const vacationsService = new VacationsService();

export default vacationsService;
