import { Navigate, Route, Routes } from "react-router-dom";
import Login from "../../AuthArea/Login/Login";
import Register from "../../AuthArea/Register/Register";
import Home from "../../HomeArea/Home/Home";
import AddVacation from "../../VacationArea/AddVacation/AddVacation";
import EditVacation from "../../VacationArea/EditVacation/EditVacation";
import FollowersGraph from "../../VacationArea/FollowersGraph/FollowersGraph";
import VacationList from "../../VacationArea/VacationList/VacationList";
import PageNotFound from "../PageNotFound/PageNotFound";

function Routing(): JSX.Element {
    return (
        <Routes>
        <Route path="/home" element={<Home />} />
        <Route path="/vacations" element={<VacationList />} />
        <Route path="/addvacation" element={<AddVacation />} />
        <Route path="/FollowersGraph" element={<FollowersGraph />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin/edit/:id" element={<EditVacation />} />
        <Route path="/" element={<Navigate to="/home" />} />
        <Route path="*" element={<PageNotFound />} />
    </Routes>
);
}

export default Routing;
