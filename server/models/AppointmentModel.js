const mongoose=require("mongoose")

const appointmentSchema= mongoose.Schema({
    userID:{type:mongoose.Schema.Types.ObjectId,ref:"user"},
    name:String,
    email:String,
    contact:String,
    doctorId:{type:mongoose.Schema.Types.ObjectId,ref:"DoctorDetail"},
    date: {
        type: String,
        validate: {
            validator: function (value) {
                const appointmentDate = new Date(value);
                const currentDate = new Date();
                return appointmentDate >= currentDate;
            },
            message: "Appointment date cannot be in the past"
        }
    },
    time:String,
    symptoms:String,
    category:String,
    roomId:Number,
    petId:{type:mongoose.Schema.Types.ObjectId,ref:"pet"}, 
    fee: { type: Number, default: 100000 },
    status:{ type: String, default: "pending"},
    paymentStatus: {
        type: String,
        enum: ['Pending', 'Completed', 'Failed', 'Refunded'],
        default: 'Pending',
    
    },
    paymentMethod: {
        type: String,
        enum: ['Credit Card', 'PayPal', 'VnPay', 'Cash On Delivery', 'PayOS'],
        
    },
    paymentDetails: {
        transactionId: String,
        orderCode: String,
        paymentLinkId: String,
        paymentTime: Date
    },
},{
    versionKey:false
})

const AppointmentModel=mongoose.model("Appointment",appointmentSchema)

module.exports={AppointmentModel};