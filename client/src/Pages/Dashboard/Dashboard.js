import React, { useState, useEffect } from "react";
import { Card, Container, Row, Col } from "react-bootstrap";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";
import AdminSideBar from "../Admin/AdminSideBar";
import { getAllDoctors } from "../../Components/Helpers/DoctorFuntion";
import "../../styles/dashboard.css"; // Import CSS file

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalAppointments: 0,
    completedAppointments: 0,
    pendingAppointments: 0,
    rejectedAppointments: 0,
    revenue: 0,
    chartData: [],
    categoryStats: [],
    doctorStats: [],
  });
  const [doctors, setDoctors] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await getAllDoctors();
      setDoctors(response);
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_API_URL}/appointment/dashboard`);
      const data = await response.json();

      // Map doctor names to doctorStats
      const doctorStatsWithNames = data.doctorStats.map((stat) => {
        const doctor = doctors.find((doc) => doc._id === stat._id);
        return {
          ...stat,
          name: doctor ? doctor.name : "Unknown",
        };
      });

      setStats({
        totalAppointments: data.totalAppointments,
        completedAppointments: data.completedAppointments,
        pendingAppointments: data.pendingAppointments,
        rejectedAppointments: data.rejectedAppointments,
        revenue: data.revenue,
        chartData: data.chartData,
        categoryStats: data.categoryStats,
        doctorStats: doctorStatsWithNames,
      });
    };

    fetchData();
  }, [doctors]);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  return (
    <div>
      <div id="after-nav">
        <AdminSideBar />
        <Container className="mt-4 dashboard-container">
          <h2 className="text-center mb-4">Pet Appointment Dashboard</h2>

          {/* Tổng quan số liệu */}
          <Row className="mb-4">
            <Col md={3}>
              <Card className="shadow-sm text-center p-3 overview-card">
                <h4>Total Appointments</h4>
                <h2>{stats.totalAppointments}</h2>
              </Card>
            </Col>
            <Col md={3}>
              <Card className="shadow-sm text-center p-3 overview-card">
                <h4>Finish Appointments</h4>
                <h2>{stats.completedAppointments}</h2>
              </Card>
            </Col>
            <Col md={3}>
              <Card className="shadow-sm text-center p-3 overview-card">
                <h4>Pending Appointments</h4>
                <h2>{stats.pendingAppointments}</h2>
              </Card>
            </Col>
            <Col md={3}>
              <Card className="shadow-sm text-center p-3 overview-card">
                <h4>Rejected Appointments</h4>
                <h2>{stats.rejectedAppointments}</h2>
              </Card>
            </Col>
          </Row>

          {/* Biểu đồ doanh thu */}
          <Row>
            <Col md={6}>
              <Card className="shadow-sm p-3">
                <h5>Revenue Overview</h5>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={stats.chartData}>
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="revenue" stroke="#8884d8" strokeWidth={3} />
                  </LineChart>
                </ResponsiveContainer>
              </Card>
            </Col>

            {/* Biểu đồ cuộc hẹn */}
            <Col md={6}>
              <Card className="shadow-sm p-3">
                <h5>Appointment Statistics</h5>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={stats.chartData}>
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="appointments" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              </Card>
            </Col>
          </Row>

          {/* Biểu đồ loại dịch vụ */}
          <Row className="mt-4">
            <Col md={6}>
              <Card className="shadow-sm p-3">
                <h5>Appointments by Service Category</h5>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={stats.categoryStats}
                      dataKey="count"
                      nameKey="_id"
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      fill="#8884d8"
                      label={({ name, count }) => `${name}: ${count}`}
                    >
                      {stats.categoryStats.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </Card>
            </Col>

            {/* Biểu đồ bác sĩ */}
            <Col md={6}>
              <Card className="shadow-sm p-3">
                <h5>Appointments by Doctor</h5>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={stats.doctorStats}>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="appointments" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  );
};

export default Dashboard;