import { useEffect, useState } from "react";
import axios from "axios";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"; // Replace Switch with Routes
import Home from "./Pages/Home";
import Register from "./Pages/Register";
import Login from "./Pages/Login";
import PetDash from "./Pages/PetDash";
import NavBar from "./Components/NavBar";
import { ToastContainer } from "react-toastify";
import PetContext from "./Context/PetContext";
import UserContext from "./Context/UserContext";
import Confirmed from "./Pages/Confirmed";
import Confirm from "./Pages/Confirm";
import HomePage from "./Pages/HomePage";
import AppointmentForm from "./Pages/AppointmentForm";
import AppointmentList from "./Pages/AppointmentList";
import AdminPanel from "./Pages/Admin/AdminPanel";
import AdminNavBar from "./Pages/Admin/AdminNavBar";
import AdminAccount from "./Pages/Admin/AdminAccount";
import AddDoctor from "./Pages/Admin/AddDoctor";
import UpdateDoctor from "./Pages/Admin/UpdateDoctor";
import AdminDoctor from "./Pages/Admin/AdminDoctor";
import AdminPetDash from "./Pages/Admin/AdminPetDash";
import { loadUserPets } from "./Components/Helpers/PetFunctions";
import Footer from "./Components/Footer";
import ForgotPassword from "./Pages/ForgotPassword";
import ResetPassword from "./Pages/ResetPassword";
import Dashboard from "./Pages/Dashboard/Dashboard";
import PayOSReturnHandler from "./Pages/Thank/PayOSReturnHandler";
import CancelReturnHandler from "./Pages/Thank/CancelReturnHandler";

function App() {
  const [userData, setUserData] = useState({
    user: undefined,
    token: undefined,
  });

  const [pets, setPets] = useState([]);
  const [newPetData, setNewPetData] = useState("pet babies");
  const [petId, setPetId] = useState("");
  const [appt, setAppt] = useState(0);

  useEffect(() => {
    const checkLoggedIn = async () => {
      let token = localStorage.getItem("auth-token");
      if (!token) {
        localStorage.setItem("auth-token", "");
        return;
      }

      try {
        const userRes = await axios.get(`${process.env.REACT_APP_BACKEND_API_URL}/users`, {
          headers: { "x-auth-token": token },
        });

        if (userRes.data) {
          setUserData({ token, user: userRes.data });
        }
      } catch (err) {
        console.log("User must login");
      }
    };

    checkLoggedIn();
  }, []);

  useEffect(() => {
    if (userData.user?.id) {
      const fetchedPets = loadUserPets(userData.user.id);
      setPets(fetchedPets);
      setNewPetData(false);
    }
  }, [newPetData, userData.user]);

  return (
    <div className="App">
      <Router>
        <ToastContainer />

        <UserContext.Provider value={{ userData, setUserData }}>
          <PetContext.Provider value={{ newPetData, setNewPetData, petId, setPetId, appt, setAppt, pets, setPets }}>
            <Routes>
              {/* Admin Routes */}
              <Route path="/admin" element={<AdminNavBar />}>
                <Route index element={<Dashboard />} />
                <Route path="add-doctor/:id" element={<AddDoctor />} />
                <Route path="view-doctor/:id" element={<UpdateDoctor />} />
                <Route path="users" element={<AdminAccount />} />
                <Route path="doctors" element={<AdminDoctor />} />
                <Route path="admin/petDash/:petId" element={<AdminPetDash />} />
                <Route path="appointment" element={<AdminPanel />} />
              </Route>

              {/* User Routes */}
              <Route path="/" element={<NavBar />}>
                <Route path="homePage" element={<HomePage />} />
                <Route path="book-appointment" element={<AppointmentForm />} />
                <Route path="view-appointment" element={<AppointmentList />} />
                <Route path="petDash" element={<PetDash />} />
                <Route path="login" element={<Login />} />
                <Route path="register" element={<Register />} />
                <Route path="confirm" element={<Confirm />} />
                <Route path="confirm_token/:token" element={<Confirmed />} />
                <Route path="forgot-password" element={<ForgotPassword />} />
                <Route path="reset-password/:token" element={<ResetPassword />} />
                <Route path="success" element={<PayOSReturnHandler />} />
                <Route path="cancel" element={<CancelReturnHandler />} />
                <Route index element={<Home />} />
              </Route>
              <Route path="/" element={<Footer />} />
            </Routes>
        
          </PetContext.Provider>
        </UserContext.Provider>
      </Router>
    </div>
  );
}

export default App;