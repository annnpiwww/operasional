import express from 'express';
import cors from 'cors';
import { runSpreadsheetAutomation, runAllOutletsAutomation } from './automation.js';

const app = express();
const PORT = process.env.PORT || 3101;

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', uptime: process.uptime() });
});

app.post('/api/automate', async (req, res) => {
  const { location, date, income, shift, notes, spreadsheetUrl } = req.body;

  if (!location) {
    return res.status(400).json({
      success: false,
      message: 'Lokasi wajib diisi.',
    });
  }

  const logs = [];
  const logCallback = (msg) => {
    console.log(msg);
    logs.push(msg);
  };

  try {
    const result = await runSpreadsheetAutomation(
      { location, date, income, shift, notes, spreadsheetUrl },
      logCallback
    );
    res.json({ success: true, logs, data: result, item: result.item });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message || 'Automation error',
      logs,
    });
  }
});

app.post('/api/automate-all', async (req, res) => {
  const { date, spreadsheetUrl, outlets } = req.body;
  const logs = [];
  const logCallback = (msg) => {
    console.log(msg);
    logs.push(msg);
  };

  try {
    const result = await runAllOutletsAutomation({ date, spreadsheetUrl, outlets }, logCallback);
    res.json({ success: true, logs, incomes: result.incomes });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message || 'Batch automation error',
      logs,
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
