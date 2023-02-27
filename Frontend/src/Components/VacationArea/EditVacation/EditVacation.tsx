import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import VacationModel from "../../../Models/VacationModel";
import vacationsService from "../../../Services/VacationsService";
import "./EditVacation.css";

function EditVacation(): JSX.Element {
    const [vacation, setVacation] = useState<VacationModel>();
    const { register, handleSubmit, formState, setValue } = useForm<VacationModel>();
    const navigate = useNavigate();
    const params = useParams();

    useEffect(() => {
        vacationsService.getOneVacation(+params.id)
            .then(vacation => {
                setValue("vacationId", vacation.vacationId);
                setValue("destination", vacation.destination);
                setValue("description", vacation.description);
                const startDate = new Date(vacation.startDate);
                const nextStartDate = new Date(startDate.setDate(startDate.getDate() + 1)).toISOString().slice(0, -14);
                setValue("startDate", nextStartDate);
                const endDate = new Date(vacation.endDate);
                const nextEndDate = new Date(endDate.setDate(endDate.getDate() + 1)).toISOString().slice(0, -14);
                setValue("endDate", nextEndDate);
                setValue("price", vacation.price);
                setVacation(vacation);
            })
            .catch(err => alert(err.message));
    }, []);

    async function send(vacation: VacationModel) {
        try {
            vacation.image = (vacation.image as unknown as FileList)[0];
            await vacationsService.updateVacation(vacation);
            alert("Vacation has been updated.");

            // navigate("/vacations/details/" + vacation.id);

            navigate(-1); // Back
        }
        catch (err: any) {
            alert(err.message);
        }
    }
    return (
        <div className="EditVacation">
            <h2>Edit Vacation</h2>

            <div>
                <form onSubmit={handleSubmit(send)}>

                    {/* Hiding the id on the form in a Hidden input: */}
                    <input type="hidden" {...register("vacationId")} />

                    <label>Destination: </label>
                    <input type="text" {...register("destination",VacationModel.destinationValidation)} />
                    <span className="Err">{formState.errors.destination?.message}</span>

                    <label>Description: </label>
                    <input type="text" {...register("description",VacationModel.descriptionValidation)} />
                    <span className="Err">{formState.errors.description?.message}</span>

                    <label>StartDate: </label>
                    <input type="date" {...register("startDate",VacationModel.startDateValidation)} />
                    <span className="Err">{formState.errors.startDate?.message}</span>

                    <label>EndDate: </label>
                    <input type="date" {...register("endDate",VacationModel.endDateValidation)} />
                    <span className="Err">{formState.errors.endDate?.message}</span>

                    <label>Price: </label>
                    <input type="number" step="0.01" {...register("price",VacationModel.priceValidation)} />
                    <span className="Err">{formState.errors.price?.message}</span>

                    <label>Image: </label>
                    <input type="file" accept="image/*" {...register("image",VacationModel.imageValidation)} />

                    <img src={vacation?.imageFile} />

                    <button>Update</button>

                </form>
            </div>


        </div>
    );
}

export default EditVacation;
