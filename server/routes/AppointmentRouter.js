const express = require("express");
const nodemailer = require('nodemailer')
const { AppointmentModel } = require("../models/AppointmentModel");
const AppointmentController = require("../controllers/AppointmentController");

const AppointmentRouter = express.Router();
// Route tạo lịch hẹn với PayOS
AppointmentRouter.post("/update-payos", AppointmentController.updateAppointmentPayOS);

// Route xử lý callback từ PayOS
AppointmentRouter.get("/payos-callback", AppointmentController.handlePayOSCallback);

AppointmentRouter.get("/getall", async (req, res) => {
    try {
        let Data = await AppointmentModel.find({})
            .populate("userID")
            .populate({
                path: "doctorId",
                populate: {
                    path: "userID",
                    model: "user"
                }
            })
            .populate(
                {
                    path: "petId",
                    populate: {
                        path: "ParentID",
                        model: "user"
                    }
                }
            );
        res.send(Data);
    } catch (error) {
        res.send({ "Error": error.message });
    }
});

AppointmentRouter.get("/get", async (req, res) => {
    let ID = req.headers.id
    try {
        let Data = await AppointmentModel.find({ userID: ID }).populate("doctorId").populate("petId");
        res.send(Data);
    } catch (error) {
        res.send({ "Error": error.message });
    }
})

AppointmentRouter.post("/create", async (req, res) => {
    try {
        let date = req.body.date
        let time = req.body.time
        let email = req.body.email
        let doctorId = req.body.doctorId
        let Data = await AppointmentModel.findOne({ date, time, doctorId });
        if (Data) {
            res.send({ "Error": "Slot Not Available" })
        } else {
            try {
                let appointment = new AppointmentModel(req.body);
                await appointment.save()
                res.send(JSON.stringify("Appointment Created"));
                
                let vetCareEmail= process.env.VetcareEmail
                let password= process.env.password
                const msg = {
                    to: email,
                    from: "Vetcare",
                    subject: "Appointment",
                    text: "Thanks for booking an appointment you will be notified whenever your appointment will be approved."
                }
                const transporter = nodemailer.createTransport({
                    service: 'gmail',
                    auth: {
                        user: vetCareEmail,
                        pass: password
                    },
                    port: 425,
                    host: 'smtp.gmail.com'
                }).sendMail(msg,(err)=>{
                    if(err){
                        console.log("Error",err)
                    }
                    else{
                        console.log('Email sent')
                    }
                })
                
            } catch (error) {
                res.send({ "Error": error.message })
            }
        }

    } catch (error) {
        res.send({ "Error": error.message });
    }
})


AppointmentRouter.patch("/update/:id", async (req, res) => {
    let num=Math.floor(Math.random()*(9999-1000)+1000)
    let payload = req.body;
    let {status,name} = req.body;
    req.body.roomId=num;

    // console.log(name,req.body);
    let email = req.headers.email
    let paramid = req.params.id;
    if (status !== "rejected") {
        req.body.roomId = num;
    } else {
        delete req.body.roomId; 
    }
    try {
        let updated = await AppointmentModel.findByIdAndUpdate({ _id: paramid }, payload)
        if (!updated) {
            return res.status(404).send({ mess: "Appointment not found" });
        }
        if (status === "approved") {
        let vetCareEmail= process.env.VetcareEmail
        let password= process.env.password
        const msg = {
            to: email,
            from: "Vetcare",
            subject: "Appointment",
            text: `Hello ${name}, your appointment has been ${status}, Put ${num} room id to connect with your veterinarian, You can proceed with the CONNECT section of the website`
        }
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: vetCareEmail,
                pass: password
            },
            port: 425,
            host: 'smtp.gmail.com'
        }).sendMail(msg,(err)=>{
            if(err){
                console.log("Error",err)
            }
            else{
                console.log('Email sent')
            }
        })
    } else if (status === "rejected") {
        let vetCareEmail= process.env.VetcareEmail
        let password= process.env.password
        const msg = {
            to: email,
            from: "Vetcare",
            subject: "Appointment",
            text: `Hello ${name}, your appointment has been ${status}`
        }
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: vetCareEmail,
                pass: password
            },
            port: 425,
            host: 'smtp.gmail.com'
        }).sendMail(msg,(err)=>{
            if(err){
                console.log("Error",err)
            }
            else{
                console.log('Email sent')
            }
        })
    }
        res.send({ "mess": "Status Updated" })
    } catch (error) {
        // console.log(error);
        res.send({ "Error": error.message })
    }
    

})

AppointmentRouter.get("/dashboard", async (req, res) => {
    try {
        const totalAppointments = await AppointmentModel.countDocuments();

        const completedAppointments = await AppointmentModel.countDocuments({
            status: "approved",
        });

        const pendingAppointments = await AppointmentModel.countDocuments({
            status: "pending",
        });

        const rejectedAppointments = await AppointmentModel.countDocuments({
            status: "rejected",
        });

        const revenueData = await AppointmentModel.aggregate([
            { $match: { status: "approved" } },
            { $group: { _id: null, totalRevenue: { $sum: "$fee" } } },
        ]);
        const totalRevenue = revenueData.length > 0 ? revenueData[0].totalRevenue : 0;

        const chartData = await AppointmentModel.aggregate([
            {
                $match: { status: "approved" },
            },
            {
                $group: {
                    _id: { $month: { $dateFromString: { dateString: "$date" } } },
                    appointments: { $sum: 1 },
                    revenue: { $sum: "$fee" },
                },
            },
            { $sort: { "_id": 1 } },
            {
                $project: {
                    month: "$_id",
                    appointments: 1,
                    revenue: 1,
                    _id: 0
                }
            }
        ]);

        const categoryStats = await AppointmentModel.aggregate([
            {
                $group: {
                    _id: "$category",
                    count: { $sum: 1 },
                },
            },
            { $sort: { count: -1 } },
        ]);

        const doctorStats = await AppointmentModel.aggregate([
            {
                $group: {
                    _id: "$doctorId",
                    appointments: { $sum: 1 },
                    revenue: { $sum: "$fee" },
                },
            },
            { $sort: { appointments: -1 } },
        ]);

        res.json({
            totalAppointments,
            completedAppointments,
            pendingAppointments,
            rejectedAppointments,
            revenue: totalRevenue,
            chartData,
            categoryStats,
            doctorStats,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
AppointmentRouter.put("/update-paymentStatus/:id", async (req, res) => {
    let paramid = req.params.id;
    try {
        let updated = await AppointmentModel.findByIdAndUpdate({ _id: paramid }, { paymentStatus: true });
        if (!updated) {
            return res.status(404).json({ mess: "Appointment not found" });
        }
        res.json({ "mess": "Payment Status Updated" })
    } catch
    (error) {
        res.json({ "Error": error.message })
    }
}

)

module.exports = { AppointmentRouter }