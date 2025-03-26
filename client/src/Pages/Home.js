import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AddPet from "../Components/Modals/AddPet";
import UserContext from "../Context/UserContext";
import PetContext from "../Context/PetContext";
import ConfirmDelete from "../Components/Modals/ConfirmDelete";
import { Button, Spinner } from "react-bootstrap";

const Home = () => {
    const { userData } = useContext(UserContext);
    const { setPetId, pets } = useContext(PetContext);
    const history = useNavigate();
    const displayName = userData.user?.displayName;
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const timeout = setTimeout(() => {
            if (userData.user === undefined) {
                history("/login"); 
            }
        }, 3000); 
    
        if (userData.user === undefined) return; 
        if (!userData.user) {
            clearTimeout(timeout); // Hủy timeout nếu userData.user đã được cập nhật
            history("/login"); // Redirect nếu chưa đăng nhập
        }
        setLoading(false); // Dữ liệu đã tải xong
    
        return () => clearTimeout(timeout); // Dọn dẹp timeout khi component unmount
    }, [userData.user, history]);

    // Chuyển hướng đến trang chi tiết thú cưng
    const routePet = async (e, id) => {
        e.preventDefault();
        try {
            setPetId(id);
            let thisPet = pets.filter((pet) => pet._id === id);
            history({
                pathname: "/petDash",
                state: { info: thisPet },
            });
        } catch {
            console.log("Something went wrong");
        }
    };

    // Nếu đang tải dữ liệu, hiển thị hiệu ứng loading
    if (loading) {
        return (
            <div className="d-flex flex-column justify-content-center align-items-center vh-100">
                <Spinner animation="border" variant="primary" />
                <h5 className="mt-3">Đang tải dữ liệu...</h5>
            </div>
        );
    }

    return (
        <>
            <div className="container pets-container">
                <div className="row">
                    <div className="col-xs-12 py-5">
                        <div className="header-styles">
                            <h2 className="myPet-header">{displayName}'s Pets</h2>
                        </div>
                    </div>
                </div>

                <div className="rounded col-12 home-card">
                    <div className="row">
                        <div className="col-12 py-5 pets-list">
                            <div>
                                {pets.length > 0 &&
                                    pets.map((pet, i) => (
                                        <div key={i} className="row">
                                            <div className="user-saved-pets py-1">
                                                <button
                                                    data-bs-toggle="modal"
                                                    data-bs-target="#confirmDelete"
                                                    onClick={(e) => setPetId(pet._id)}
                                                    type="button"
                                                    className="delete-pet-btn btn"
                                                >
                                                    <i className="fa fa-minus-circle"></i>
                                                </button>
                                                <button
                                                    onClick={(e) => routePet(e, pet._id)}
                                                    key={pet._id}
                                                    value={pet._id}
                                                    type="button"
                                                    className="saved-pet-btn btn btn-floating"
                                                >
                                                    {pet.PetImageLoc ? (
                                                        <img
                                                            style={{
                                                                height: "30px",
                                                                width: "30px",
                                                                borderRadius: "100%",
                                                            }}
                                                            src={pet.PetImageLoc}
                                                            alt="pet"
                                                        />
                                                    ) : (
                                                        <img
                                                            style={{
                                                                height: "30px",
                                                                width: "30px",
                                                                borderRadius: "100%",
                                                            }}
                                                            src="/images/paw-print-small.png"
                                                            alt="pet"
                                                        />
                                                    )}
                                                    &nbsp;&nbsp;&nbsp;&nbsp;
                                                    <span>{pet.PetName}</span>
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                            </div>

                            {pets.length === 0 && (
                                <h2 className="click-plus-instructions">
                                    Click the "+" to add your pets!
                                </h2>
                            )}
                        </div>
                    </div>

                    <div className="add-new-pet">
                        <Button variant="primary" onClick={() => setShowModal(true)}>
                            <i className="fa fa-plus"></i>
                        </Button>
                    </div>
                </div>
            </div>

            <ConfirmDelete />
            <AddPet show={showModal} handleClose={() => setShowModal(false)} />
        </>
    );
};

export default Home;
