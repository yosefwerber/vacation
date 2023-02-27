import { useEffect, useState } from "react";
import UserModel from "../../../Models/UserModel";
import VacationModel from "../../../Models/VacationModel";
import { authStore } from "../../../Redux/AuthState";
import vacationsService from "../../../Services/VacationsService";
import VacationCard from "../VacationCard/VacationCard";
import "./VacationList.css";


import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import React from "react";

function VacationList(): JSX.Element {

    const [vacations, setVacations] = useState<VacationModel[]>([]);
    const [filteredVacations, setFilteredVacations] = useState<VacationModel[]>([]);
    const [page, setPage] = useState(1);
    const [pageSize] = useState(4)
    const [user, setUser] = useState<UserModel>();

    useEffect(() => {
        // Get vacations:
        vacationsService.getAllVacations()
            .then(vacations => {
                setVacations(vacations);
                setFilteredVacations(vacations);
            })
            .catch(err => alert(err.message));

        // Get user - listen to AuthState changes:
        setUser(authStore.getState().user);

        authStore.subscribe(() => {
            setUser(authStore.getState().user);
        });
    }, []);


    // PAGE HANDLING:
    function handlePreviousPage() {
        setPage(page => page - 1);
    }

    function handleNextPage() {
        setPage(page => page + 1);
    }

    function handlePageChange(event: React.ChangeEvent<HTMLSelectElement>) {
        setPage(Number(event.target.value));
    }

    const pageCount = Math.ceil(filteredVacations.length / pageSize);


    // FILTER HANDLING:
    function filterByAll() {
        setFilteredVacations(vacations);
        setPage(1);
    }

    function filterByFollowed() {
        setFilteredVacations(vacations.filter(v => { return v.isFollowing === 1 }))
        setPage(1);
    }

    function filterByFutureDate() {
        const now = new Date();
        let filtered = vacations.filter((v) => {
            let vacationDate = new Date(v.startDate);
            return (vacationDate >= now);
        })

        setFilteredVacations(filtered);
        setPage(1);
    }

    function filterByActiveDate() {
        const now = new Date();
        let filtered = vacations.filter((v) => {
            let startDate = new Date(v.startDate);
            let endDate = new Date(v.endDate);

            return (startDate <= now &&
                endDate >= now);
        })

        setFilteredVacations(filtered);
        setPage(1);
    }


    // VACATIONS LIST
    // Return the div containing the list of the current page (filtered if needed)
    return (
        <div className="VacationList">
            {user && user.role === "User" && <>
                <div>
                    <Box sx={{ minWidth: 120 }}>
                        <FormControl  >
                            <InputLabel variant="filled" id="demo-simple-select-label" color="primary"></InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                            >
                                <MenuItem value={"All"} onClick={filterByAll}>Show All</MenuItem>
                                <MenuItem value={"Followed"} onClick={filterByFollowed}>Followed</MenuItem>
                                <MenuItem value={"Future"} onClick={filterByFutureDate}>Future Vacations</MenuItem>
                                <MenuItem value={"Active"}  onClick={filterByActiveDate}>Active Vacations</MenuItem>
                            </Select>
                        </FormControl>
                    </Box>
                </div>
            </>}

            <div>
                {filteredVacations.slice((page - 1) * pageSize, page * pageSize).map(v => (
                    <VacationCard key={v.vacationId} vacation={v} />
                ))}


                <div className="pagination-controls">

                    <button className="prev-btn" disabled={page === 1} onClick={handlePreviousPage}>
                        <i className="fas fa-chevron-left"></i> Prev
                    </button>

                    <div className="page-select">
                        <span>Page</span>
                        <div className="select-wrap">
                            <select value={page} onChange={handlePageChange}>
                                {Array(pageCount).fill(null).map((_, i) => (
                                    <option key={i} value={i + 1}>{i + 1}</option>
                                ))}
                            </select>
                            <i className="fas fa-chevron-down"></i>
                        </div>
                        <span>of {pageCount}</span>
                    </div>

                    <button className="next-btn" disabled={page >= pageCount} onClick={handleNextPage}>
                        Next <i className="fas fa-chevron-right"></i>
                    </button>

                </div>
            </div>
        </div>

    );
}

export default VacationList;
