const express = require("express");
require('dotenv').config();
const axios = require('axios');

const VietQrRouter = express.Router();
VietQrRouter.post('/generate-qr', async (req, res) => {
    try {
        const { accountNo, accountName, acqId, amount, addInfo, format, template } = req.body;

        const quickLink = `https://img.vietqr.io/image/${acqId}-${accountNo}-${template || "compact"}.png?amount=${amount}&addInfo=${encodeURIComponent(addInfo)}&accountName=${encodeURIComponent(accountName)}`;

        const response = await axios.get(quickLink, {
            responseType: 'arraybuffer',
            timeout: 10000 // Tăng thời gian chờ lên 10 giây
        });

        const qrImage = Buffer.from(response.data, 'binary').toString('base64');

        return res.json({ qrImage });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});

module.exports = { VietQrRouter };