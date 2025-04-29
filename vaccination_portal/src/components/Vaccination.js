import React, { useState, useEffect } from 'react';

const Vaccination = () => {
    const [drives, setDrives] = useState([]);
  const [form, setForm] = useState({ vaccine: '', date: '', doses: '', classes: '' });
  const [editIndex, setEditIndex] = useState(null);

  const isDateValid = (date) => {
    const selectedDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const minDate = new Date(today);
    minDate.setDate(minDate.getDate() + 15);
    return selectedDate >= minDate;
  };

  const isOverlap = (date) => drives.some((d, index) => index !== editIndex && d.date === date);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    if (!isDateValid(form.date)) {
      alert('Drive must be scheduled at least 15 days in advance.');
      return;
    }

    if (isOverlap(form.date)) {
      alert('Another drive is already scheduled for this date.');
      return;
    }

    if (editIndex !== null) {
      const updated = [...drives];
      updated[editIndex] = { ...form };
      setDrives(updated);
      setEditIndex(null);
    } else {
      setDrives([...drives, { ...form }]);
    }

    setForm({ vaccine: '', date: '', doses: '', classes: '' });
  };

  const handleEdit = (index) => {
    setForm(drives[index]);
    setEditIndex(index);
  };

  const isPast = (date) => new Date(date) < new Date();

  return (
    <div className="container my-4">
      <h3 className="mb-4">Vaccine Drive Manager</h3>
      <div className="card p-3 mb-4">
        <div className="row g-2">
          <div className="col-md-3">
            <input className="form-control" name="vaccine" value={form.vaccine} onChange={handleChange} placeholder="Vaccine Name" />
          </div>
          <div className="col-md-3">
            <input type="date" className="form-control" name="date" value={form.date} onChange={handleChange} />
          </div>
          <div className="col-md-3">
            <input type="number" className="form-control" name="doses" value={form.doses} onChange={handleChange} placeholder="Available Doses" />
          </div>
          <div className="col-md-3">
            <input className="form-control" name="classes" value={form.classes} onChange={handleChange} placeholder="Applicable Classes (e.g., 5-7)" />
          </div>
        </div>
        <button className="btn btn-primary mt-3" onClick={handleSubmit}>
          {editIndex !== null ? 'Update Drive' : 'Add Drive'}
        </button>
      </div>

      <table className="table table-bordered">
        <thead className="table-light">
          <tr>
            <th>Vaccine</th>
            <th>Date</th>
            <th>Doses</th>
            <th>Classes</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {drives.map((drive, index) => (
            <tr key={index}>
              <td>{drive.vaccine}</td>
              <td>{drive.date}</td>
              <td>{drive.doses}</td>
              <td>{drive.classes}</td>
              <td>
                {!isPast(drive.date) ? (
                  <button className="btn btn-sm btn-secondary" onClick={() => handleEdit(index)}>
                    Edit
                  </button>
                ) : (
                  <span className="text-muted">Expired</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
export default Vaccination;