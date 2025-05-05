import React, { useContext } from 'react';
import {
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";

import Home from './pages/Home';

import Login from './pages/Auth/Login';
import SignUp from './pages/Auth/SignUp';

import Dashboard from './pages/User/Dashboard';
import ManageTask from './pages/User/ManageTask';
import CreateTask from './pages/User/CreateTask';
import TaskWork from './pages/User/TaskWork';

import ProfileEdit from './pages/User/ProfileEdit';

import PrivateRoute from "./routes/PrivateRoute";
import { UserProvider, UserContext } from './context/userContext';
import { Toaster } from 'react-hot-toast';

const App = () => {
  return (
    <UserProvider>
      <Routes>
        {/* Public Routes */}
        <Route path='/login' element={<Login />} />
        <Route path='/signUp' element={<SignUp />} />

        {/* Private Routes */}
        <Route element={<PrivateRoute />}>
          <Route path='/user/dashboard' element={<Dashboard />} />
          <Route path='/user/tasks' element={<ManageTask />} />
          <Route path='/user/create-task' element={<CreateTask />} />
          <Route path='/user/edit-task/:taskId' element={<CreateTask />} />
          <Route path="/user/work/:taskId" element={<TaskWork />} />
          <Route path='/user/profile/edit' element={<ProfileEdit />} />
        </Route>

        {/* Root redirect */}
        <Route path='/' element={<Home />} />
      </Routes>

      <Toaster
        toastOptions={{
          className: "",
          style: { fontSize: "13px" },
        }}
      />
    </UserProvider>
  );
};

export default App;

// Redirect based on auth
const Root = () => {
  const { user } = useContext(UserContext);
  return user ? <Navigate to="/user/dashboard" /> : <Navigate to="/login" />;
};
