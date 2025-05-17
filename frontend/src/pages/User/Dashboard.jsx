import React, { useContext, useEffect, useState, useMemo } from "react";
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

  const greeting = useMemo(() => {
    const hour = moment().hour();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  }, []);

  const prepareChartData = (data = {}) => {
    const taskDistribution = data.taskDistribution || {
      Pending: 0,
      InProgress: 0,
      Completed: 0,
      All: 0,
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

      if (response.data) {
        setDashboardData(response.data);
        prepareChartData(response.data?.charts || {});
        setLoading(false);
      }
    } catch (error) {
      setError(error.response?.data?.message || "Error fetching dashboard data");
      setLoading(false);
      console.error("Error fetching dashboard data:", error);
    }
  };

  useEffect(() => {
    getDashboardData();
  }, []);

  const onSeeMore = () => {
    navigate("/user/tasks");
  };

  if (loading) {
    return (
      <DashboardLayout activeMenu="Dashboard">
        <div className="flex justify-center items-center min-h-screen text-gray-700 dark:text-gray-300 text-lg">
          Loading dashboard...
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout activeMenu="Dashboard">
        <div className="flex justify-center items-center min-h-screen text-red-500 text-center p-4">
          {error}
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout activeMenu="Dashboard">
      <div className="card my-5 bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md shadow-gray-200 dark:shadow-gray-900 border border-gray-200/50 dark:border-gray-700">
        <h2 className="text-xl md:text-2xl font-semibold text-gray-900 dark:text-white">
          {greeting}, {user?.name}
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {moment().format("dddd, Do MMM YYYY")}
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 md:gap-3 mt-5">
          <InfoCard
            label="Total Tasks"
            value={addThousandsSeparator(dashboardData?.charts?.taskDistribution?.All || 0)}
            color="bg-blue-500"
          />
          <InfoCard
            label="Pending Tasks"
            value={addThousandsSeparator(dashboardData?.charts?.taskDistribution?.Pending || 0)}
            color="bg-violet-500"
          />
          <InfoCard
            label="In Progress Tasks"
            value={addThousandsSeparator(dashboardData?.charts?.taskDistribution?.InProgress || 0)}
            color="bg-cyan-600"
          />
          <InfoCard
            label="Completed Tasks"
            value={addThousandsSeparator(dashboardData?.charts?.taskDistribution?.Completed || 0)}
            color="bg-lime-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
        <div className="card bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6 border border-gray-200 dark:border-gray-700">
          <h5 className="font-medium text-gray-900 dark:text-white text-center mb-4">Task Distribution</h5>
          <CustomPieChart data={pieChartData} colors={COLORS} />
        </div>

        <div className="card bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6 border border-gray-200 dark:border-gray-700">
          <h5 className="font-medium text-gray-900 dark:text-white text-center mb-4">Task Priority Levels</h5>
          <CustomBarChart data={barChartData} />
        </div>

        <div className="md:col-span-2">
          <div className="card bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h5 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Tasks</h5>
              <button
                className="flex items-center gap-3 text-[12px] font-medium text-gray-700 dark:text-gray-300 hover:text-[color:var(--color-blue-bg-sky-500)] bg-gray-50 dark:bg-gray-700 hover:bg-blue-50 dark:hover:bg-blue-900 px-4 py-1.5 rounded-lg border border-gray-200/50 cursor-pointer"
                onClick={onSeeMore}
              >
                See All <LuArrowRight className="text-base" />
              </button>
            </div>

            <TaskListTable
              tableData={dashboardData?.recentTasks || dashboardData?.recentTask || []}
            />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
