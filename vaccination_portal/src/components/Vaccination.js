import React, { useState, useEffect } from 'react';

const Vaccination = () => {
    const [drives, setDrives] = useState([]);
  const [form, setForm] = useState({ vaccine_name: '', drive_date: '', available_doses: '', applicable_classes: '' });
  const [loading, setLoading] = useState(true)
  const fecthData =async ()=>{
    try {

      const response = await fetch('http://127.0.0.1:5000/api/drives', {
        method: 'GET',
     
       
      });
      const json = await response.json();

      console.log((JSON.stringify(json, null, 2)));
      setDrives(json)
      setLoading (false)
    } catch (error) {
      alert(error.toString());
    }
  }
  const isDateValid = (date) => {
    const selectedDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const minDate = new Date(today);
    minDate.setDate(minDate.getDate() + 15);
    return selectedDate >= minDate;
  };



  const handleChange =  (e) => {

    const { name, value } = e.target;
  
      setForm({ ...form, [name]: value });
    
  };

  const handleTabeDataChange =  (e,id) => {
    const { name, value } = e.target;
    setDrives(prevDrives => {
      return prevDrives.map(drive => {
        if (drive.id === id) {
          return {
            ...drive,
            [name]: name === 'applicable_classes'
              ? value
              : value
          };
        }
        return drive;
      });
    });
  };

  const handleSubmit = async () => {
    if (!isDateValid(form.drive_date)) {
      alert('Drive must be scheduled at least 15 days in advance.');
      return;
    }

    try {
      setLoading(true)
      const response = await fetch('http://127.0.0.1:5000/api/adddrives', {
        method: 'POST',
        body: JSON.stringify(form),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const json = await response.json();
      if (json.message === "Drive created"){
        fecthData()
        setForm({ vaccine_name: '', drive_date: '', available_doses: '', applicable_classes: '' })
        }
    } catch (error) {
      alert(error.toString());
    }

  };
  const getDriveById = (id) => {
    return drives.find((drive) => drive.id === id);
  };

  const handleEdit = async (id) => {
    const selectedDrive =getDriveById(id);
    console.log("selected",selectedDrive)
    try {
      const response = await fetch(`http://127.0.0.1:5000/api/drives/${id}`, {
        method: 'PUT',
        body: JSON.stringify(selectedDrive),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const json = await response.json();
      if (json.message === "Drive updated"){
        fecthData()
        alert("Drive has been updated")
        }
      
    } catch (error) {
      alert(error.toString());
    }
  };

  const isPast = (date) => new Date(date) < new Date();

  useEffect(() => {
    fecthData()
  }, [])
console.log("drives",drives)
if(loading){
  return(
    <div className="d-flex justify-content-center align-items-center" style={{ height: '200px' }}>
    <div className="spinner-border text-primary" role="status">
      <span className="visually-hidden">Loading...</span>
    </div>
  </div>
  )
}
  return (
    <div className="container my-4">
      <h3 className="mb-4">Vaccine Drive Manager</h3>
      <div className="card p-3 mb-4">
        <div className="row g-2">
          <div className="col-md-3">
            <input className="form-control" name="vaccine_name" value={form.vaccine_name} onChange={handleChange} placeholder="Vaccine Name" />
          </div>
          <div className="col-md-3">
            <input type="date" className="form-control" name="drive_date" value={form.drive_date} onChange={handleChange} />
          </div>
          <div className="col-md-3">
            <input type="number" className="form-control" name="available_doses" value={form.available_doses} onChange={handleChange} placeholder="Available Doses" />
          </div>
          <div className="col-md-3">
            <input className="form-control" name="applicable_classes" value={form.applicable_classes} onChange={handleChange} placeholder="Applicable Classes (e.g., 5-7)" />
          </div>
        </div>
        <button className="btn btn-primary mt-3" onClick={handleSubmit}>
          {'Add Drive'}
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
              <td>
                <input
                  type="text"
                  value={drive.vaccine_name}
                  onChange={(e) => handleTabeDataChange(e,drive.id)}
                  name="vaccine_name"

                />
              </td>
              <td>
                <input
                  type="date"
                  value={drive.drive_date}
                  onChange={(e) => handleTabeDataChange(e,drive.id)}
                  name="drive_date"

                />
              </td>
              <td>
                <input
                  type="number"
                  value={drive.available_doses}
                  onChange={(e) => handleTabeDataChange(e,drive.id)}
                  name="available_doses"

                />
              </td>
              <td>
                <input
                  type="text"
                  value={drive.applicable_classes}
                  onChange={(e) => handleTabeDataChange(e,drive.id)}
                  name="applicable_classes"

                />
              </td>
              <td>
                {!isPast(drive.date) ? (
                  <button className="btn btn-sm btn-secondary" onClick={() => handleEdit(drive.id)}>
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