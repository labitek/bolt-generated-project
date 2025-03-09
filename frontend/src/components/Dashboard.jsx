import React from 'react';

    function Dashboard({ user }) {
      return (
        <div className="container">
          <h2>Dashboard</h2>
          <p>Welcome, {user.firstName} {user.lastName}!</p>
          <p>Your role: {user.role}</p>
        </div>
      );
    }

    export default Dashboard;
