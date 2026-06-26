import React from 'react';

export default function Dashboard({ enquiries }) {
  return (
    <section className="dashboard">
      <h2 className="thin-italic-display">Management Dashboard</h2>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Name</th>
              <th>Phone</th>
              <th>Course Interest</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {enquiries.map(enq => (
              <tr key={enq.id}>
                <td>{enq.date}</td>
                <td>{enq.name}</td>
                <td>{enq.phone}</td>
                <td className="course-badge">{enq.course.toUpperCase()}</td>
                <td><button className="action-btn">Follow Up</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}