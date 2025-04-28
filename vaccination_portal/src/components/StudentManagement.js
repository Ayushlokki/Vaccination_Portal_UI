import React, { useEffect, useState } from 'react';
import Papa from 'papaparse';

const StudentManagement = () => {
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState('');
  const [formData, setFormData] = useState({ name: '', class: '', id: '', vaccination_status: '', vaccine_name: '', vaccination_date: '' });
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false)

  const fetchStudentData = async () => {
    setLoading(true)
    try {
      const response = await fetch("http://127.0.0.1:5000/api/students");
      const data = await response.json();
      setStudents(data);
    } catch (err) {
      console.error("Failed to fetch metrics", err);
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = async() => {
    debugger
    try{
    const response = await fetch("http://127.0.0.1:5000/api/studentdata", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(
        formData
      )
    
    }); 
    if (!response.ok) {
      throw new Error(`Server error: ${response.status}`);
    }
  debugger;
    const data = await response.json();
    console.log("Response:", data);
    fetchStudentData()
 
  } catch (error) {
    console.error("Fetch failed:", error);
  }

  };

  const handleCSVUpload = async(e) => {
    const file = e.target.files[0];
    const data = new FormData();
    data.append('file', file);
    // Papa.parse(file, {
    //   header: true,
    //   complete: (results) => {
    //     setStudents((prev) => [...prev, ...results.data]);
    //   },
    // });
    try {
      const response = await fetch('http://127.0.0.1:5000/api/vaccination_upload', {
        method: 'POST',
        body: data
        // Note: fetch automatically sets the correct Content-Type boundary
      });
      const json = await response.json();
      console.log((JSON.stringify(json, null, 2)));
    } catch (error) {
      alert(error.toString());
    }
  };

  const handleVaccinate = (student) => {
    debugger;
    if (student.vaccinated == "Yes") {
      alert('Already vaccinated with this vaccine!');
      return;
    }
    const updated = students.map((s) =>
      s.id === student.id ? { ...s, vaccinated: student.vaccinated, vaccineName: student.vaccineName } : s
    );
    setStudents(updated);
  };

  const filteredStudents = students.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.class.toLowerCase().includes(search.toLowerCase()) ||
      s.id.toString().includes(search) ||
      (s.vaccinated ? 'vaccinated' : 'not vaccinated').includes(search.toLowerCase())
  );


  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Logic to calculate the current page's data
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredStudents.slice(indexOfFirstItem, indexOfLastItem);

  // Total number of pages
  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);

  // Function to change the page
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

const checkFields = () => {
  return !formData.name || !formData.class  || !formData.vaccination_status || (formData.vaccination_status === "Yes" && (!formData.vaccine_name || !formData.vaccination_date));
};

useEffect(() => {
  

  fetchStudentData();
 
}, [])
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
    <div className="container mt-4">
      <h3>Student Management</h3>

      <div className="d-flex justify-content-between mb-3">
        <button className="btn btn-primary" onClick={() => setShowForm(true)}>
          Add/Edit Student
        </button>
        <input type="file" accept=".csv" onChange={handleCSVUpload} style={{ maxWidth: 200 }} />
        <input
          type="text"
          className="form-control"
          placeholder="Search by name, class, ID, status"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ maxWidth: 250 }}
        />
      </div>

      <table className="table table-striped table-bordered table-hover">
        <thead>
          <tr>
            <th>Name</th>
            <th>Class</th>
            <th>ID</th>
            <th>Vaccinated</th>
            <th>Vaccine</th>
            <th>Vaccinated Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.map((s, idx) => (
            <tr key={idx}>
              <td>{s.name}</td>
              <td>{s.class}</td>
              <td>{s.id}</td>
              <td>{(s.vaccine_name !== null && s.vaccine_date !== null) ?"Yes" :"No"  }</td>
              <td>{s.vaccine_name || '-'}</td>
              <td>{s.vaccine_date || '-'}</td>
              <td>
                <button className={`btn ${(s.vaccine_name !== null && s.vaccine_date !==null) ? "btn-success" : "btn-danger"} btn-sm `} onClick={() => handleVaccinate(s)}>
                  {(s.vaccine_name !== null && s.vaccine_date !==null) ? 'Vaccinated' : 'Vaccinate'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="pagination">
        <button
          className="pagination-btn"
          disabled={currentPage === 1}
          onClick={() => handlePageChange(currentPage - 1)}
        >
          Previous
        </button>
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index + 1}
            className={`pagination-btn ${currentPage === index + 1 ? "active" : ""}`}
            onClick={() => handlePageChange(index + 1)}
          >
            {index + 1}
          </button>
        ))}
        <button
          className="pagination-btn"
          disabled={currentPage === totalPages || totalPages === 0}
          onClick={() => handlePageChange(currentPage + 1)}
        >
          Next
        </button>
      </div>

      {showForm && (
        <div className="modal show" style={{ display: 'block' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header" style={{justifyContent: 'space-between'}}>
                <h5 className="modal-title">Add/Edit Student</h5>
                <button type="button" className="close" onClick={() => setShowForm(false)}>
                  <span>&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <form onSubmit={handleFormSubmit} >
                  <div className="form-group">
                    <label>Name</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label>Class</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.class}
                      onChange={(e) => setFormData({ ...formData, class: e.target.value })}
                    />
                  </div>
                  {/* <div className="form-group">
                    <label>ID</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.id}
                      onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                    />
                  </div> */}
                  <div className="form-group">
                    <label>Vaccination Status</label>
                    <select
                      className="form-control"
                      value={formData.vaccination_status}
                      onChange={(e) =>
                        setFormData({ ...formData, vaccination_status: e.target.value  })
                      }
                    >
                      <option value="">Select</option>
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </select>
                  </div>
                  
                  {formData.vaccination_status === "Yes" && (
                    <><div className="form-group">
                      <label>Vaccination Date</label>
                      <input
                        type="date"
                        className="form-control"
                        value={formData.vaccination_date}
                        onChange={(e) => setFormData({ ...formData, vaccination_date: e.target.value })} />
                    </div><div className="form-group">
                        <label>Vaccine Name</label>
                        <input
                          type="text"
                          className="form-control"
                          value={formData.vaccine_name}
                          onChange={(e) => setFormData({ ...formData, vaccine_name: e.target.value })} />
                      </div></>
                  )}
                  {/* <div className="form-group">
                    <label>Vaccination Date</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.vaccinatedDate}
                      onChange={(e) => setFormData({ ...formData, vaccinatedDate: e.target.value })}
                    />
                  </div> */}
                  <button className="btn btn-primary mt-3" type="submit" disabled={checkFields()}>
                    Save Student
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentManagement;
