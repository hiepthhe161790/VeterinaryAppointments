import axios from "axios";
import { useEffect } from "react";


async function getAllDoctors() {
    try {
        const { data } = await axios.get(`${process.env.REACT_APP_BACKEND_API_URL}/doctor/getall`, {
            headers: { "x-auth-token": localStorage.getItem("auth-token") },
            });
        return data;
    } catch (error) {
        console.log(error);
    }
}
const loadUserPets = async (user) => {

    let url = `${process.env.REACT_APP_BACKEND_API_URL}/getpetbyuser/${user}`;
    try {
        const { data } = await axios.get(url, {
            headers: { "x-auth-token": localStorage.getItem("auth-token") },
        });
        return data;
    } catch (error) {
        console.log(error);
    }
}
const useEffectOnlyOnce = (func) => useEffect(func, [func]);

export { getAllDoctors, useEffectOnlyOnce, loadUserPets };