import AdminDashboard from "./AdminDashboard";
import CreateTest from "./CreateTest";
import Dashboard from "./Dashboard";
import ForgetPassword from "./ForgetPassword";
import RegisterForm from "./Form";
import LoginForm from "./Loginform";
import SolveProblem from "./SolveProblem";
import { BrowserRouter, Router,Routes, Route } from "react-router-dom";
import TestSolvePage from "./TestSolvePage";
import TestOverview from "./TestOverview";
export default function Formroutes(){
    return(
        <BrowserRouter>
        <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/register" element={<RegisterForm/>}/>
            <Route path="/login" element={<LoginForm/>}/>
            <Route path="/dashboard" element={<Dashboard/>}/>
            <Route path="/admin/dashboard" element={<AdminDashboard/>}/>
            <Route path="/forgot-password" element={<ForgetPassword/>}/>
            <Route path="/problem/:id" element={<SolveProblem />} />
            <Route path="/admin/create-test" element={<CreateTest/>}/>
            <Route path="/test/:testId" element={<TestOverview/>}/>
            <Route path="/solve/:questionId/:testId" element={<TestSolvePage/>}/>
        </Routes>
        </BrowserRouter>
    )
}
