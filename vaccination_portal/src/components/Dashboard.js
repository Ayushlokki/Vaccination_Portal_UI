import React, { useEffect, useState } from "react";

const Dashboard = () => {
  const [metrics, setMetrics] = useState({
    total_students: 0,
    vaccinated_count: 0,
    vaccinated_percent:0,
    upcoming_drives: [],


  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const response = await fetch("http://127.0.0.1:5000/api/metrics");
        const data = await response.json();
        setMetrics(data);
      } catch (err) {
        console.error("Failed to fetch metrics", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
  }, []);

  const vaccinatedPercentage = metrics.total_students
    ? ((metrics.vaccinated_count / metrics.total_students) * 100).toFixed(2)
    : 0;

  return (
    <div className="container mt-4">

      <div className="row">
        <div className="col-md-4 mb-4">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Total Students</h5>
              <p className="card-text display-6">{metrics.total_students}</p>
            </div>
          </div>
        </div>

        <div className="col-md-4 mb-4">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Vaccinated Students</h5>
              <p className="card-text display-6">{metrics.vaccinated_count}</p>
              <p className="text-muted">({metrics.vaccinated_percent}% vaccinated)</p>
            </div>
          </div>
        </div>

        <div className="col-md-4 mb-4">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Upcoming Drives</h5>
              {loading ? (
                <p>Loading...</p>
              ) : metrics.upcoming_drives.length === 0 ? (
                <p className="text-muted">No drives scheduled in next 30 days.</p>
              ) : (
                <ul className="list-group list-group-flush">
                  {metrics.upcoming_drives.map((drive, index) => (
                    <li key={index} className="list-group-item">
                      {drive.name} - {new Date(drive.date).toLocaleDateString()}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Dashboard;
