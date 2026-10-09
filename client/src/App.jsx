import { useState } from 'react';
import axios from 'axios';

const initial = {
  driverName: '',
  vehicleNumber: '',
  offenseDescription: '',
  fineAmount: '',
  issueDate: new Date().toISOString().split('T')[0],
  location: '',
};

export default function App() {
  const [form, setForm] = useState(initial);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await axios.post('/api/challan/generate', form, { responseType: 'blob' });
      const url = URL.createObjectURL(new Blob([res.data], { type: 'application/pdf' }));
      const a = document.createElement('a');
      a.href = url;
      a.download = 'challan.pdf';
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch {
      setError('Could not generate the PDF. Check that the server is running on port 5000.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="wrap">
      <h1>Challan generator</h1>
      <p className="note">Demo project. PDFs are marked as samples.</p>
      {error && <p className="error" role="alert">{error}</p>}
      <form onSubmit={handleSubmit}>
        <label>Driver name<input name="driverName" value={form.driverName} onChange={handleChange} required /></label>
        <label>Vehicle number<input name="vehicleNumber" value={form.vehicleNumber} onChange={handleChange} placeholder="KA09AB1234" required /></label>
        <label>Offense<textarea name="offenseDescription" value={form.offenseDescription} onChange={handleChange} rows="3" required /></label>
        <div className="row">
          <label>Fine (Rs.)<input type="number" min="0" step="0.01" name="fineAmount" value={form.fineAmount} onChange={handleChange} required /></label>
          <label>Date<input type="date" name="issueDate" value={form.issueDate} onChange={handleChange} required /></label>
        </div>
        <label>Location<input name="location" value={form.location} onChange={handleChange} required /></label>
        <button type="submit" disabled={loading}>{loading ? 'Generating…' : 'Download PDF'}</button>
      </form>
    </main>
  );
}
