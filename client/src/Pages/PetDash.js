import React from "react";
import { useContext, useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import UserContext from "../Context/UserContext";
import VetVisits from "../Components/VetVisits";
import Medications from "../Components/Medications";
import Reminders from "../Components/Reminders";
import Moment from "react-moment";
import ChangePet from "../Components/Modals/ChangePet";
import PetContext from "../Context/PetContext";
import { getPetData } from "../Components/Helpers/PetFunctions";
import { Button } from "react-bootstrap";
const PetDash = () => {
    const { petId, setPetId } = useContext(PetContext);
    const { userData } = useContext(UserContext);
    const [data, setData] = useState();
    const [img] = useState();
    const history = useHistory();
    const location = useLocation();
    const { newPetData, setNewPetData } = useContext(PetContext);
    const [showModal, setShowModal] = useState(false);
    useEffect(() => {
        setNewPetData(false);
    }, [setNewPetData]);

    useEffect(() => {
        let isMounted = true;
        const fetchMyAPI = async () => {
            const data = await getPetData(petId);
            if (isMounted) {
                data && setData(data);
            }
        };
        fetchMyAPI();
        return () => {
            isMounted = false;
        };
    }, [newPetData, petId]);

    useEffect(() => { }, [img]);

    useEffect(() => {
        if (!userData.user) history.push("/");
    }, [userData.user, history]);

    return (
        <div className="container-fluid">
            <div className="container">
                <div className="row">
                    {data && (
                        <div className="col-sm-3 py-5">
                            <div className="card m-2 shadow rounded">
                                {data.PetImageLoc ? (
                                    <img
                                        src={data.PetImageLoc}
                                        className="card-img-top"
                                        alt="petImage"
                                    ></img>
                                ) : (
                                    <img src="./images/paw-print-small.png" alt="pet Image"></img>
                                )}

                                <div className="card-body text-center">
                                    <h1 className="card-title">{data.PetName}</h1>
                                    <h4 className="card-title">
                                        Birth Date: &nbsp;
                                        <Moment format="MM/DD/YYYY">{data.BirthDate}</Moment>
                                    </h4>
                                    <h4 className="card-title">{data.Gender}</h4>
                                    <h4 className="card-title">{data.Breed}</h4>

                                    <div className="edit-new-pet">
                                        <Button variant="primary" onClick={() => setShowModal(true)}>
                                            Edit
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    <ChangePet show={showModal} handleClose={() => setShowModal(false)} data={data} />
                    <div className="pet-dash-cards col-sm-9 py-5">
                        <div className="row">
                            {data && <Reminders petI={data._id} Reminders={data.Reminders} />}
                            {data && <VetVisits petI={data._id} VetVisits={data.VetVisits} />}
                            {data && <Medications petI={data._id} meds={data.Medications} />}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PetDash;