import React, { useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { toast } from 'react-toastify';
const PayOSReturnHandler = () => {
    const history = useNavigate();

    useEffect(() => {
        const handlePayOSReturn = async () => {
            const queryParams = window.location.search.substring(1);

            try {
                const response = await axios.get(`${process.env.REACT_APP_BACKEND_API_URL}/appointment/payos-callback?${queryParams}`);
          

                if (response.data.message === 'Payment successful') {
                   toast.success('Payment successful!');
                    history('/view-appointment'); // Chuyển hướng đến trang xem lịch hẹn
                } else {
                    toast.error('Payment failed!');
                    history('/view-appointment'); // Chuyển hướng đến trang xem lịch hẹn
                }
            } catch (error) {
                console.error('Error handling PayOS return:', error);
                   toast.error(error?.response?.data?.message);
                history('/view-appointment'); // Chuyển hướng đến trang xem lịch hẹn
            }
        };

        handlePayOSReturn();
    }, [history]);

    return (
        <div>
            <h1>Processing payment...</h1>
            <p>Please wait while we process your payment...</p>
        </div>
    );
};

export default PayOSReturnHandler;