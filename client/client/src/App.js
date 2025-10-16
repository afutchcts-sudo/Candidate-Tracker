import React, { useState, useEffect } from 'react';

const CLIENTS = [
  "Austal", "Bollinger", "Genesis", "Birdon", "Golden Nugget",
  "Silver Ships", "Global Connections", "R&P", "S&J", "Southern Linen"
];
const STATUSES = ["Submittal", "Testing", "Start"];

function App() {
  const [candidates, setCandidates] = useState([]);
  const [form, setForm] = useState({ name: '', client: CLIENTS[0], status: STATUSES[0], notes: '' });

  useEffect(() => {
    fetch('/api/candidates')
      .then(res => res.json())
      .then(setCandidates);
  }, []);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleAdd(e) {
    e.preventDefault();
    fetch('/api/candidates', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    })
      .then(res => res.json())
      .then(c => setCandidates([...candidates, c]));
  }

  function handleStatusChange(id, status) {
    fetch(`/api/candidates-status?id=${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    })
      .then(res => res.json())
      .then(updated => setCandidates(candidates.map(c => c._id === id ? updated : c)));
  }

  return (
    <div>
      <h1>Candidate Tracker</h1>
      <form onSubmit={handleAdd}>
        <input name="name" value={form.name} onChange={handleChange} placeholder="Candidate Name" required />
        <select name="client" value={form.client} onChange={handleChange}>
          {CLIENTS.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <select name="status" value={form.status} onChange={handleChange}>
          {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <input name="notes" value={form.notes} onChange={handleChange} placeholder="Notes" />
        <button type="submit">Add Candidate</button>
      </form>
      <table>
        <thead>
          <tr>
            <th>Name</th><th>Client</th><th>Status</th><th>Change Status</th><th>History</th><th>Notes</th>
          </tr>
        </thead>
        <tbody>
          {candidates.map(c => (
            <tr key={c._id}>
              <td>{c.name}</td>
              <td>{c.client}</td>
              <td>{c.status}</td>
              <td>
                <select value={c.status} onChange={e => handleStatusChange(c._id, e.target.value)}>
                  {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </td>
              <td>
                <ul>
                  {c.history && c.history.map((h, i) => (
                    <li key={i}>{h.status} ({new Date(h.date).toLocaleDateString()})</li>
                  ))}
                </ul>
              </td>
              <td>{c.notes}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
