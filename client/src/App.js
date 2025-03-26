import { useEffect, useState } from "react";
import axios from "axios";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
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
// import "./App.css";
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
  }, [  ]);

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
            <Switch>
              {/* Admin Routes */}
              <Route path="/admin">
                <AdminNavBar />
                <Switch>
                  <Route exact path="/admin" component={Dashboard} />
                  <Route path="/admin/add-doctor/:id" component={AddDoctor} />
                  <Route path="/admin/view-doctor/:id" component={UpdateDoctor} />
                  <Route path="/admin/users" component={AdminAccount} />
                  <Route path="/admin/doctors" component={AdminDoctor} />
                  <Route path="/admin/admin/petDash/:petId" component={AdminPetDash} />
                  <Route path="/admin/appointment" component={AdminPanel} />
                </Switch>
              </Route>

              {/* User Routes */}
              <Route path="/">
                <NavBar />
                <Switch>
                  <Route path="/homePage" component={HomePage} />
                  <Route path="/book-appointment" component={AppointmentForm} />
                  <Route path="/view-appointment" component={AppointmentList} />
                  <Route exact path="/petDash" component={PetDash} />
                  <Route path="/login" component={Login} />
                  <Route path="/register" component={Register} />
                  <Route path="/confirm" component={Confirm} />
                  <Route path="/confirm_token/:token" component={Confirmed} />
                  <Route path="/forgot-password" component={ForgotPassword} />
                  <Route path="/reset-password/:token" component={ResetPassword} />
                  <Route path="/success" component={PayOSReturnHandler} />
                  <Route path="/cancel" component={CancelReturnHandler} />
                  <Route exact path="/" component={Home} />
                 
                </Switch>
                 <Footer /> 
              </Route>
            </Switch>
        
          </PetContext.Provider>
        </UserContext.Provider>
      </Router>
    </div>
  );
}

export default App;
