import moment from "moment";
import { useEffect, useState } from "react";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import UserModel from "../../../Models/UserModel";
import VacationModel from "../../../Models/VacationModel";
import { authStore } from "../../../Redux/AuthState";
import vacationsService from "../../../Services/VacationsService";
import "./VacationCard.css";

import { Button, Card, CardActions, CardContent, CardHeader, CardMedia, IconButton, Typography } from "@mui/material";
import FavoriteIcon from '@mui/icons-material/Favorite';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

interface VacationCardProps {
    vacation: VacationModel;
}

function VacationCard(props: VacationCardProps): JSX.Element {

    const [vacation, setVacation] = useState<VacationModel>();
    const [user, setUser] = useState<UserModel>();
    const [isFollowing] = useState<boolean>(props.vacation.isFollowing === 1);
    const [followersCount] = useState<number>(props.vacation.followersCount);
    const navigate = useNavigate();

    useEffect(() => {
        vacationsService.getOneVacation(+props.vacation.vacationId)
            .then(vacation => setVacation(vacation))
            .catch(err => alert(err.message));

        setUser(authStore.getState().user);

        // Listen to AuthState changes:
        authStore.subscribe(() => {
            setUser(authStore.getState().user);
        });
    }, [followersCount]);

    async function deleteVacation() {
        try {
            const sure = window.confirm("Are you sure?");
            if (!sure) return;

            await vacationsService.deleteVacation(vacation.vacationId);
            alert("vacation has been deleted");
        }
        catch (err: any) {
            alert(err.message);
        }
    }

    async function editVacation() {
        try {
            navigate("/admin/edit/" + props.vacation.vacationId);
        }
        catch (err: any) {
            alert(err.message);
        }
    }


    // user follows a specific vacation - call service in order to reach the backend and update the database
    async function Follow(vacationId: number): Promise<void> {
        try {
            await vacationsService.follow(props.vacation.vacationId);
        }
        catch (err) {
            console.error(err)
        }
    }

    // user unfollows a specific vacation - call service in order to reach the backend and update the database
    async function unFollow(vacationId: number): Promise<void> {
        try {
            await vacationsService.unfollow(props.vacation.vacationId);
        }
        catch (err) {
            console.error(err)
        }

    }

    function formatTime(time: string): string {
        return moment(time).format('MMMM D, YYYY')
    }

    const stringSubHeader = formatTime(props.vacation.startDate).concat(" - ",
        formatTime(props.vacation.endDate));

    return (
        <Card className="VacationCard">


            <div>
                {/* HEADER FOR ADMIN - EDIT , DELETE */}
                {user && user.role === "Admin" && <>
                    <CardHeader
                        title={props.vacation.destination}
                    />
                    <CardActions>
                        <Button size="small" startIcon={<EditIcon />} onClick={editVacation}>Edit</Button>
                        <Button size="small" startIcon={<DeleteIcon />} onClick={deleteVacation}>Delete</Button>
                    </CardActions>
                </>}

                {/* HEADER FOR USER - FOLLOW , UNFOLLOW */}
                {user && user.role === "User" && <>
                    <CardHeader
                        action={
                            <IconButton aria-label="follow" color={isFollowing ? "error"  : "default" }
                            onClick={isFollowing ? () => unFollow(props.vacation.vacationId) : () => Follow(props.vacation.vacationId)}>
                                {followersCount}
                                <FavoriteIcon />
                            </IconButton>
                        }
                        title={props.vacation.destination}
                    />
                </>}

                {/* IMAGE */}
                <CardMedia
                    component="img"
                    height="194"
                    image={props.vacation.imageFile}
                    alt={props.vacation.destination}
                />


                {/* CONTENT - TIME, DESCRIPTION, PRICE */}
                <CardContent>
                    <Typography variant="body2" color="text.preliminary">
                        {formatTime(props.vacation.startDate)} - <br></br>
                        {formatTime(props.vacation.endDate)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        {props.vacation.description}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        {props.vacation.price}$
                    </Typography>

                </CardContent>
            </div>
        </Card >
    );
}
export default VacationCard;


