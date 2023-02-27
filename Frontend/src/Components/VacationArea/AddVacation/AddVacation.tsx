import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import VacationModel from "../../../Models/VacationModel";
import vacationsService from "../../../Services/VacationsService";
import "./AddVacation.css";

function AddVacation(): JSX.Element {
    const { register, handleSubmit, formState } = useForm<VacationModel>();
    const navigate = useNavigate();

    async function send(vacation: VacationModel) {
        try {
            vacation.image = (vacation.image as unknown as FileList)[0];

            await vacationsService.addVacation(vacation);
            alert("vacation has been added.");
            navigate("/vacations");
        }
        catch (err: any) {
            alert(err.message);
        }
    }
    return (
        <div className="AddVacation">
		           <h2>Add Vacation</h2>

<form onSubmit={handleSubmit(send)}>

    <label>Destination: </label>
    <input type="text" {...register("destination",VacationModel.destinationValidation)} />
    <span className="Err">{formState.errors.destination?.message}</span>

    <label>Description: </label>
    <input type="text" step="0.01" {...register("description",VacationModel.descriptionValidation)} />
    <span className="Err">{formState.errors.description?.message}</span>

    <label>StartDate: </label>
    <input type="date" {...register("startDate",VacationModel.startDateValidation)} />
    <span className="Err">{formState.errors.startDate?.message}</span>

    <label>endDate: </label>
    <input type="date" {...register("endDate",VacationModel.endDateValidation)} />
    <span className="Err">{formState.errors.endDate?.message}</span>

    <label>Price: </label>
    <input type="number" {...register("price",VacationModel.priceValidation)} />
    <span className="Err">{formState.errors.price?.message}</span>

    <label>Image: </label>
    <input type="file" accept="image/*" {...register("image",VacationModel.imageValidation)} />
    <span className="Err">{formState.errors.image?.message}</span>
    <br></br>

    <button>Add</button>

</form>

</div>
    );
}

export default AddVacation;
