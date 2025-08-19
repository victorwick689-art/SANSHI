import express from 'express';
import axios from 'axios';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
dotenv.config();
const app = express();
app.use(express.json());
app.use(morgan('dev'));
app.use(cors({ origin: process.env.ALLOWED_ORIGIN?.split(',') || '*'}));
const { DARAJA_CONSUMER_KEY, DARAJA_CONSUMER_SECRET, LNM_PASSKEY, BUSINESS_SHORT_CODE='0717753219', PORT=5000, CALLBACK_URL='https://your-backend-domain.com/mpesa/callback' } = process.env;
const MPESA_ENV = 'sandbox';
const BASE_URL = MPESA_ENV === 'sandbox' ? 'https://sandbox.safaricom.co.ke' : 'https://api.safaricom.co.ke';
async function generateToken() {
  const auth = Buffer.from(`${DARAJA_CONSUMER_KEY}:${DARAJA_CONSUMER_SECRET}`).toString('base64');
  const resp = await axios.get(`${BASE_URL}/oauth/v1/generate?grant_type=client_credentials`, { headers: { Authorization: `Basic ${auth}` } });
  return resp.data.access_token;
}
function timestamp14() {
  const d = new Date();
  const yyyy = d.getFullYear().toString();
  const MM = String(d.getMonth()+1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  const hh = String(d.getHours()).padStart(2, '0');
  const mm = String(d.getMinutes()).padStart(2, '0');
  const ss = String(d.getSeconds()).padStart(2, '0');
  return `${yyyy}${MM}${dd}${hh}${mm}${ss}`;
}
app.get('/health', (_req, res) => res.json({ ok: true, env: MPESA_ENV }));
app.post('/mpesa/stkpush', async (req, res) => {
  try {
    const { phone, amount, accountReference='SanShineDonation', description='Donation to SanShine Organisation' } = req.body;
    if (!phone || !amount) return res.status(400).json({ error: 'phone and amount are required' });
    const token = await generateToken();
    const Timestamp = timestamp14();
    const Password = Buffer.from(`${BUSINESS_SHORT_CODE}${LNM_PASSKEY}${Timestamp}`).toString('base64');
    const payload = { BusinessShortCode: BUSINESS_SHORT_CODE, Password, Timestamp, TransactionType: 'CustomerPayBillOnline', Amount: Number(amount), PartyA: phone, PartyB: BUSINESS_SHORT_CODE, PhoneNumber: phone, CallBackURL: CALLBACK_URL, AccountReference: accountReference, TransactionDesc: description };
    const resp = await axios.post(`${BASE_URL}/mpesa/stkpush/v1/processrequest`, payload, { headers: { Authorization: `Bearer ${token}` } });
    res.json({ ok: true, data: resp.data });
  } catch (err) {
    res.status(500).json({ ok: false, error: err?.response?.data || err.message });
  }
});
app.post('/mpesa/callback', (req, res) => { console.log('M-Pesa Callback:', JSON.stringify(req.body, null, 2)); res.json({ ResultCode: 0, ResultDesc: 'Received successfully' }); });
app.listen(PORT, () => { console.log(`Sanshine server running on http://localhost:${PORT}`); });
