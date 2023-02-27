import { useEffect, useRef, useState } from "react";
import VacationModel from "../../../Models/VacationModel";
import "./FollowersGraph.css";
import vacationsService from "../../../Services/VacationsService";
import Chart from "react-apexcharts";


function FollowersGraph(): JSX.Element {
    const [vacations, setVacations] = useState<VacationModel[]>([]);
    const [followersData, setFollowersData] = useState<{ name: string; followers: number }[]>([]);
    const chartRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        vacationsService.getAllVacations()
            .then(vacations => setVacations(vacations))
            .catch(err => alert(err.message));

        const followersCountData = vacations.map((vacation) => ({
            name: vacation.destination,
            followers: vacation.followersCount
        }));

        setFollowersData(followersCountData);
    }, [vacations]);

    
    const state = {
        options: {
          chart: {
            id: "basic-bar"
          },
          title: {
            display: true,
            text: 'No. of Followers per Destination'
        },
          xaxis: {
            categories: followersData.map((v) => v.name),
          }
        },
        series: [
          {
            name: "No. of Followers",
            data: followersData.map((v) => v.followers)
          }
        ]
      };
    

    return (
        <div className="FollowerGraph">
            <div id="chart">
                <div className="row">
                    <div className="mixed-chart">
                        <Chart
                            options={state.options}
                            series={state.series}
                            type="bar"
                            width="700"
                        />
                    </div>
                </div>
            </div>

            <canvas ref={chartRef}></canvas>
        </div>
    )

}

export default FollowersGraph;

