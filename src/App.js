import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/NavBar";
import Home from "./pages/Home";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import JobList from "./pages/JobList";
import JobDetails from "./pages/JobDetails";
import Profile from "./pages/Profile";
import RecruiterDashboard from "./pages/RecruiterDashboard";
import JobRecommendations from "./pages/JobRecommendation";
import Chat from "./pages/chat";
import { useParams } from "react-router-dom";
import React,{useState} from 'react';
import Alert from './components/Alert';
function App() {
  const [alert, setAlert] = useState(null);
  const showAlert = (message, type)=>{
    setAlert({
      msg: message,
      type: type
    })
    setTimeout(() => {
        setAlert(null);
    }, 1500);
}
  return (
    <BrowserRouter>
      <Navbar  showAlert={showAlert}/>
       {alert && <Alert msg={alert.msg} type={alert.type} />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/joblist" element={<JobList />} />
        <Route path="/job/:id" element={<JobDetails />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/recommended-jobs" element={<JobRecommendations />} />
        <Route path="/recruiterdashboard" element={<RecruiterDashboard />} />
        <Route path="/chat/:senderId/:receiverId" element={<ChatWrapper />} />
      </Routes>
    </BrowserRouter>
  );
}

const ChatWrapper = () => {
  const { senderId, receiverId } = useParams();
  return <Chat senderId={senderId} receiverId={receiverId} />;
};

export default App;
