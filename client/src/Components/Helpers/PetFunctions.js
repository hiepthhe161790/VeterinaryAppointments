//Function to get the petdata

import axios from "axios";
import { useEffect } from "react";

async function getPetData(petid) {
	console.log(petid);
	try {
		const { data } = await axios.get(`${process.env.REACT_APP_BACKEND_API_URL}/api/pet/${petid}`, {
			headers: { "x-auth-token": localStorage.getItem("auth-token") },
		});
		return data;
	} catch (error) {
		console.log(error);
	}
}

const loadUserPets = async (user) => {
	let url = `${process.env.REACT_APP_BACKEND_API_URL}/api/getpetbyuser/${user}`;
	try {
		const { data } = await axios.get(url, {
			headers: { "x-auth-token": localStorage.getItem("auth-token") },
		});
		return data;
	} catch (error) {
		console.log(error);
	}
};

const useEffectOnlyOnce = (func) => useEffect(func, [func]);

export { getPetData, loadUserPets, useEffectOnlyOnce };
