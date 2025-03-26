const { AppointmentModel } = require("../models/AppointmentModel");
require("dotenv").config();

const PayOS = require('@payos/node');
const payOS = new PayOS(
    process.env.PAYOS_CLIENT_ID,
    process.env.PAYOS_API_KEY,
    process.env.PAYOS_CHECKSUM_KEY
);

const AppointmentController = {
  async updateAppointmentPayOS(req, res) {
    try {
        const { appointmentId, paymentMethod, fee } = req.body;

        // Kiểm tra xem appointmentId có được cung cấp không
        if (!appointmentId) {
            return res.status(400).json({ error: "Appointment ID is required" });
        }

        // Tìm lịch hẹn đã được tạo trước
        const appointment = await AppointmentModel.findById(appointmentId);
        if (!appointment) {
            return res.status(404).json({ error: "Appointment not found" });
        }

        // Kiểm tra phương thức thanh toán
        if (!['Credit Card', 'PayPal', 'VnPay', 'Cash On Delivery', 'PayOS'].includes(paymentMethod)) {
            return res.status(400).json({ error: "Invalid payment method" });
        }
        if (!fee || isNaN(fee) || fee < 0.01 || fee > 10000000000) {
            return res.status(400).json({ error: "Số tiền không hợp lệ. Phải lớn hơn 0.01 và nhỏ hơn 10 tỷ." });
          }
        // Cập nhật thông tin thanh toán
        appointment.paymentMethod = paymentMethod;
        appointment.paymentStatus = 'Pending';

        if (paymentMethod === 'PayOS') {
            const YOUR_DOMAIN = `${process.env.HEROKU}`; // Cập nhật với domain thực tế
            const body = {
                orderCode: Number(String(Date.now()).slice(-6)),
                amount: parseFloat(fee) || 100000,
                description: "Deposit for Appointment",
                returnUrl: `${YOUR_DOMAIN}/success?AppointmentId=${appointment._id}`,
                cancelUrl: `${YOUR_DOMAIN}/cancel?AppointmentId=${appointment._id}`,
            };

            // Tạo liên kết thanh toán qua PayOS
            const paymentLinkResponse = await payOS.createPaymentLink(body);
            console.log('paymentLinkResponse', paymentLinkResponse);

            // Lưu thông tin chi tiết thanh toán
            appointment.paymentDetails = {
                transactionId: paymentLinkResponse.transactionId || null,
                orderCode: paymentLinkResponse.orderCode,
                paymentLinkId: paymentLinkResponse.paymentLinkId,
                paymentTime: new Date()
            };

            await appointment.save();

            return res.status(200).json({ paymentLink: paymentLinkResponse.checkoutUrl });
        }

        // Lưu lại thông tin nếu không sử dụng PayOS
        await appointment.save();
        return res.status(200).json({ appointment });
    } catch (error) {
        console.error('Error updating Appointment:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
  },

  async handlePayOSCallback(req, res) {
    const responseData = req.query;
    try {
      // Kiểm tra xem callback có hợp lệ không
        const appointment = await AppointmentModel.findById(responseData.AppointmentId);
        if (!appointment) {
            return res.status(404).json({ success: false, message: 'Appointment not found' });
        }
        console.log('Comparison details:');
        console.log('appointment.paymentDetails.orderCode:', appointment.paymentDetails.orderCode);
        console.log('responseData.orderCode:', responseData.orderCode);
        console.log('appointment.paymentDetails.paymentLinkId:', appointment.paymentDetails.paymentLinkId);
        console.log('responseData.paymentLinkId:', responseData.id);
        console.log('appointment.paymentStatus:', appointment.paymentStatus);
        console.log('Expected paymentStatus: Pending');
        if (
            appointment.paymentDetails.orderCode === responseData.orderCode &&
            appointment.paymentDetails.paymentLinkId === responseData.id &&
            appointment.paymentStatus !== 'Pending'
        ) {
           
            return res.status(400).json({ success: false, message: 'This transaction has already been completed.' });
        }
        // Cập nhật trạng thái thanh toán
        appointment.paymentStatus = responseData.cancel === 'false' ? 'Completed' : 'Failed';
        appointment.paymentDetails.paymentTime = new Date();
       
        await appointment.save();
         console.log('responseData.cancel', responseData.cancel);
        return res.status(200).json({
            message: responseData.cancel === 'false' ? 'Payment successful' : 'Payment failed',
            appointment
        });
    } catch (error) {
        console.error('Error handling PayOS callback:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
  }
};

module.exports = AppointmentController;