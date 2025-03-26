import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
const CancelReturnHandler = () => {
    const history = useHistory();

    useEffect(() => {
        const handlePayOSReturn = async () => {
            const queryParams = window.location.search.substring(1); 

            try {
                const response = await axios.get(`${process.env.REACT_APP_BACKEND_API_URL}/appointment/payos-callback?${queryParams}`);

                if (response.data.message === 'Payment failed') {
                    toast.error('Payment failed!');
                    history.push('/view-appointment'); // Chuyển hướng đến trang xem lịch hẹn
                } else if (response.data.message === 'Payment successful') {
                    toast.success('Payment successful!');
                    history.push('/view-appointment'); // Chuyển hướng đến trang xem lịch hẹn
                }
            } catch (error) {
                console.error('Error handling PayOS return:', error);
               toast.error(error?.response?.data?.message);
                history.push('/view-appointment'); 
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

export default CancelReturnHandler;