import React, { useEffect, useState } from 'react'

const Reports = () => {
  const [vaccines, setVaccines] = useState([{"name":"Covaxin"},{"name":"Covidshield"}]);
  const [selectedVaccine, setSelectedVaccine] = useState('');
  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch available vaccines for dropdown
  useEffect(() => {
    // axios.get('/api/vaccines')  // Adjust endpoint as needed
    //   .then(res => setVaccines(res.data))
    //   .catch(err => console.error('Error fetching vaccines:', err));
  }, []);

  const handleGenerateReport =async () => {
    setLoading(true);
    try {
      debugger;
      const response = await fetch(`http://127.0.0.1:5000/api/reports/vaccinations?vaccine_name=${encodeURIComponent(selectedVaccine)}`, {
        method: 'GET'
      });
      const json = await response.json();

      console.log((JSON.stringify(json, null, 2)));
      if(json.length===0){
        return  alert("No data found");
      }
      setReportData(json)
      downloadCSV(json)
      setLoading(false);
    } catch (error) {
      alert(error.toString());
    }
  };

  const downloadCSV = (data) => {
    if (!data.length) return;
  
    const header = ['Student Name', 'Vaccinated', 'Date of Vaccination', 'Vaccine Name'];
    const rows = data.map(entry => [
      entry.student_name,
      entry.vaccinated ? 'Yes' : 'No',
      entry.vaccination_date || 'N/A',
      entry.vaccine_name || 'N/A'
    ]);
  
    const csvContent = [
      header.join(','),
      ...rows.map(row => row.map(item => `"${item}"`).join(','))
    ].join('\n');
  
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'vaccination_report.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  return (
    <div className="container mt-4">
    <h2 className="mb-4">Generate Vaccination Report</h2>

    <div className="row mb-3">
      <div className="col-md-4">
        <label htmlFor="vaccineFilter" className="form-label">Filter by Vaccine:</label>
        <select
          id="vaccineFilter"
          className="form-select"
          value={selectedVaccine}
          onChange={(e) => setSelectedVaccine(e.target.value)}
        >
          <option value="">All Vaccines</option>
          {vaccines.map(vaccine => (
            <option key={vaccine.id} value={vaccine.name}>
              {vaccine.name}
            </option>
          ))}
        </select>
      </div>
      <div className="col-md-2 d-flex align-items-end">
        <button
          onClick={handleGenerateReport}
          className="btn btn-primary w-100"
        >
          Generate Report
        </button>
      </div>
    </div>

    {loading ? (
      <div className="alert alert-info">Loading report...</div>
    ) : (
      reportData.length > 0 ? (
        <div className="table-responsive">
          <table className="table table-bordered table-striped">
            <thead className="table-light">
              <tr>
                <th>Student Name</th>
                <th>Vaccinated</th>
                <th>Date of Vaccination</th>
                <th>Vaccine Name</th>
              </tr>
            </thead>
            <tbody>
              {reportData.map((entry, index) => (
                <tr key={index}>
                  <td>{entry.student_name}</td>
                  <td>{entry.vaccinated ? 'Yes' : 'No'}</td>
                  <td>{entry.vaccination_date || 'N/A'}</td>
                  <td>{entry.vaccine_name || 'N/A'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="alert alert-warning">No data to display.</div>
      )
    )}
  </div>
  );
}
export default Reports;