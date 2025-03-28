import React, { useState, useEffect } from "react";
import Moment from "moment";

const AddMeds = (props) => {
	const [medId] = useState(props.data._id);

	const [form, setForm] = useState({
		MedicationName: props.data.MedicationName,
		DueDate: Moment.utc(props.data.DueDate).format("YYYY-MM-DD"),
		Dose: props.data.Dose,
	});

	const [medName, setName] = useState("");
	const [due, setDueDate] = useState("");
	const [dose, setDose] = useState("");

	useEffect(() => {
		if (medId !== 0) {
			setName(props.data.MedicationName);
			setDueDate(props.data.DueDate);
			setDose(props.data.Dose);
		}
	}, [medId, props.data.MedicationName, props.data.DueDate, props.data.Dose]);

	const onChange = (e) => {
		setForm({ ...form, [e.target.name]: e.target.value });
	};

	const submit = (e) => {
		e.preventDefault();
	};

	return (
		<div className="card-body">
			<form name="addMedForm" onSubmit={submit}>
				<input type="hidden" id="medId" name="medId" value={medId} />
				<div className="form-group">
					<label>Medication Name</label>
					<input
						onChange={onChange}
						name="medication"
						type="text"
						className="form-control"
						placeholder="Enter Medication Name"
						defaultValue={medName}
					/>
				</div>
				{/* /////// IF WE DECIDE TO CALCULATE DOSES NEED THIS 
		    <div className="form-group">
			<label>Number of Doses</label>
			<input
				onChange={onChange}
				type="number"
				name="numDoses"
				className="form-control"
				placeholder="Number of Doses"
      			min={1} 
				max={90}
			/>
		</div>
		<div className="form-group">
			<label>Frequency in Days</label>
			<input
				onChange={onChange}
				type="number"
				name="frequency"
				className="form-control"
				placeholder="Interval in days"
      			min={1}
				max={365}  
			/>
			<small id="emailHelp" className="form-text text-muted">
				Maximum is 365 days (1 year)
			</small>
		</div>
		 */}
				<div className="form-group">
					<label>Start Date</label>
					<input
						onChange={onChange}
						type="date"
						name="startDate"
						className="form-control"
						placeholder="Start Date"
						defaultValue={Moment.utc(due).format("YYYY-MM-DD")}
						// value={form.DueDate}
					/>
				</div>
				<div className="form-group">
					<label>Doseage</label>
					<input
						onChange={onChange}
						type="text"
						name="dose"
						className="form-control"
						placeholder="Ener Dosage"
						defaultValue={dose}
						// value={form.Dose}
					/>
				</div>
			</form>
		</div>
	);
};

export default AddMeds;
