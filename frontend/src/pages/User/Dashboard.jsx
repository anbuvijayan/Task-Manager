import React, { useContext, useEffect, useState } from "react";
import { useUserAuth } from "../../hooks/useUserAuth";
import { UserContext } from "../../context/userContext";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import moment from "moment";
import { addThousandsSeparator } from "../../utils/helper";
import InfoCard from "../../components/Cards/InfoCard";
import { LuArrowRight } from "react-icons/lu";
import TaskListTable from "../../components/TaskListTable";
import CustomPieChart from "../../components/Charts/CustomPieChart";
import CustomBarChart from "../../components/Charts/CustomBarChart";


const COLORS = ["#8D51FF", "#00B8DB", "#7BCE00"];

const Dashboard = () => {
    useUserAuth();

    const { user } = useContext(UserContext);
    const navigate = useNavigate();

    const [dashboardData, setDashboardData] = useState(null);
    const [pieChartData, setPieChartData] = useState([]);
    const [barChartData, setBarChartData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const getGreeting = () => {
        const hour = moment().hour();
        if (hour < 12) return "Good Morning";
        if (hour < 18) return "Good Afternoon";
        return "Good Evening";
    };

    const prepareChartData = (data = {}) => {
        const taskDistribution = data.taskDistribution || {
            Pending: 0,
            InProgress: 0,
            Completed: 0,
        };

        const taskPriorityLevels = data.taskPriorityLevels || data.taskPrioritiesLevels || {
            Low: 0,
            Medium: 0,
            High: 0,
        };

        setPieChartData([
            { status: "Pending", count: taskDistribution.Pending },
            { status: "In Progress", count: taskDistribution.InProgress },
            { status: "Completed", count: taskDistribution.Completed },
        ]);

        setBarChartData([
            { priority: "Low", count: taskPriorityLevels.Low },
            { priority: "Medium", count: taskPriorityLevels.Medium },
            { priority: "High", count: taskPriorityLevels.High },
        ]);
    };



    const getDashboardData = async () => {
        try {
            const response = await axiosInstance.get(API_PATHS.TASKS.GET_DASHBOARD);
            console.log("API Response:", response.data); // 🔍 Debug this

            if (response.data) {
                setDashboardData(response.data);
                prepareChartData(response.data?.charts || {});
                setLoading(false);
            }
        } catch (error) {
            setError("Error fetching dashboard data");
            setLoading(false);
            console.error("Error fetching dashboard data:", error);
        }
    };


    const onSeeMore = () => {
        navigate('/user/tasks');
    };

    useEffect(() => {
        getDashboardData();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <p className="text-red-500">{error}</p>
            </div>
        );
    }

    return (
        <DashboardLayout activeMenu="Dashboard">
            <div className="card my-5 bg-white p-6 rounded-2xl shadow-md shadow-gray-200 border border-gray-200/50">
                <div>
                    <div className="col-span-3">
                        <h2 className="text-xl md:text-2xl font-semibold">
                            {getGreeting()}, {user?.name}
                        </h2>
                        <p className="text-sm text-gray-500">
                            {moment().format("dddd, Do MMM YYYY")}
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 md:gap-3 mt-5">
                    <InfoCard
                        label="Total Tasks"
                        value={addThousandsSeparator(
                            dashboardData?.charts?.taskDistribution?.All || 0
                        )}
                        color="bg-blue-500"
                    />

                    <InfoCard
                        label="Pending Tasks"
                        value={addThousandsSeparator(
                            dashboardData?.charts?.taskDistribution?.Pending || 0
                        )}
                        color="bg-violet-500"
                    />
                    <InfoCard
                        label="In Progress Tasks"
                        value={addThousandsSeparator(
                            dashboardData?.charts?.taskDistribution?.InProgress || 0
                        )}
                        color="bg-cyan-600"
                    />

                    <InfoCard
                        label="Completed Tasks"
                        value={addThousandsSeparator(
                            dashboardData?.charts?.taskDistribution?.Completed || 0
                        )}
                        color="bg-lime-500"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
                <div className="">
                    <div className="card">
                        <div className="flex items-center justify-center">
                            <h5 className="font-medium">Task Distribution</h5>
                        </div>

                        <CustomPieChart
                            data={pieChartData}
                            colors={COLORS}
                        />
                    </div>
                </div>

                <div className="card">
                    <div className="flex items-center justify-center">
                        <h5 className="font-medium">Task Priority Levels</h5>
                    </div>

                    <CustomBarChart
                        data={barChartData}
                    />
                </div>

                <div className="md:col-span-2">
                    <div className="md:col-span-2">
                        <div className="card">
                            <div className="flex items-center justify-between">
                                <h5 className="text-lg">Recent Tasks</h5>

                                <button className="flex items-center gap-3 text-[12px] font-medium text-gray-700 hover:text-[color:var(--color-blue-bg-sky-500)] bg-gray-50 hover:bg-blue-50 px-4 py-1.5 rounded-lg border border-gray-200/50 cursor-pointer" onClick={onSeeMore}>
                                    See All <LuArrowRight className="text-base" />
                                </button>
                            </div>

                            <TaskListTable tableData={dashboardData?.recentTasks || dashboardData?.recentTask || []} />

                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default Dashboard;
