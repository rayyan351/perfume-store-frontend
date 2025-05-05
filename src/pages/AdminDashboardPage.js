import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import "../styles/admin.css";
import { useNavigate } from "react-router-dom";

const AdminDashboardPage = () => {
  const { auth } = useAuth();
  const [orders, setOrders] = useState([]);
  const [ordersBackup, setOrdersBackup] = useState([]);
  const [stats, setStats] = useState({ totalUsers: 0, totalOrders: 0, totalSales: 0 });
  const [filterDates, setFilterDates] = useState({ start: "", end: "" });
  const [filteredStats, setFilteredStats] = useState(null);
  const [filterMode, setFilterMode] = useState("range"); 
  const [singleDate, setSingleDate] = useState("");
  const navigate = useNavigate(); 
   useEffect(() => {
    if (!auth || !auth.token) {
      navigate("/login");
    } else if (!auth.user?.isAdmin) {
      alert("❌ Access Denied. This page is only for admins.");
      navigate("/"); 
    }
  }, [auth, navigate]);

  useEffect(() => {
    if (!auth || !auth.token) return;

    const fetchOrders = async () => {
      try {
        const res = await fetch(`${process.env.REACT_APP_API_URL}/api/orders/all`, {
          headers: { Authorization: auth.token },
        });
        const data = await res.json();
        if (!res.ok) {
          alert(data.message || "Not authorized");
          return;
        }
        setOrders(data);
        setOrdersBackup(data);
      } catch (err) {
        alert("Failed to load orders");
      }
    };
    fetchOrders();
  }, [auth]);

  useEffect(() => {
    if (!auth || !auth.token) return;

    const fetchStats = async () => {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/admin/stats`, {
        headers: { Authorization: auth.token },
      });
      const data = await res.json();
      if (res.ok) setStats(data);
    };
    fetchStats();
  }, [auth]);

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setOrders(
      ordersBackup.filter((o) => o.email?.toLowerCase().includes(query))
    );
  };

  const handleDateFilter = async () => {
    let start, end;
  
    if (filterMode === "range") {
      if (!filterDates.start || !filterDates.end)
        return alert("Please select both dates");
      start = filterDates.start;
      end = filterDates.end;
    } else {
      if (!singleDate) return alert("Please select a date");
      start = singleDate;
      end = singleDate;
    }
  
    const resOrders = await fetch(
      `${process.env.REACT_APP_API_URL}/api/orders/filter?startDate=${start}&endDate=${end}`,
      {
        headers: { Authorization: auth.token },
      }
    );
    const ordersData = await resOrders.json();
    if (!resOrders.ok) return alert(ordersData.message);
    setOrders(ordersData);
  
    const resStats = await fetch(
      `${process.env.REACT_APP_API_URL}/api/admin/stats/date?startDate=${start}&endDate=${end}`,
      {
        headers: { Authorization: auth.token },
      }
    );
    const statsData = await resStats.json();
    if (resStats.ok) setFilteredStats(statsData);
  };
  

  return (
    <div className="admin-dashboard">
      <h2>Admin Panel – All Orders</h2>
      <div className="stats-panel filtered">
        <div><strong>Total Users:</strong> {stats.totalUsers || 0}</div>
        <div><strong>Total Orders:</strong> {stats.totalOrders || 0}</div>
        <div><strong>Total Sales:</strong> ${typeof stats.totalSales === "number" ? stats.totalSales.toFixed(2) : "0.00"}</div>
      </div>

    <div className="filter-panel">
<div className="filter-toggle">
  <input
    type="radio"
    id="mode-range"
    name="filterMode"
    value="range"
    checked={filterMode === "range"}
    onChange={() => setFilterMode("range")}
  />
  <label htmlFor="mode-range">Date Range</label>

  <input
    type="radio"
    id="mode-single"
    name="filterMode"
    value="single"
    checked={filterMode === "single"}
    onChange={() => setFilterMode("single")}
  />
  <label htmlFor="mode-single">Single Date</label>
</div>

<div className="filter-panel">
  {filterMode === "range" ? (
    <>
      <input
        type="date"
        value={filterDates.start}
        onChange={(e) =>
          setFilterDates((prev) => ({ ...prev, start: e.target.value }))
        }
      />
      <input
        type="date"
        value={filterDates.end}
        onChange={(e) =>
          setFilterDates((prev) => ({ ...prev, end: e.target.value }))
        }
      />
      </>
     ) : (
     <input
      type="date"
      value={singleDate}
      onChange={(e) => setSingleDate(e.target.value)}
      />
      )}

    <button  className="filter-btn" onClick={handleDateFilter}>Filter Orders</button>
    <button className="reset-btn" onClick={() => {
     setFilterDates({ start: "", end: "" });
     setSingleDate("");
     setFilterMode("range");
     setFilteredStats(null);
     setOrders(ordersBackup);
     }}
      >
     Reset Filters
     </button>
       </div>
       </div>

      {filteredStats && (
        <div className="stats-panel filtered" style={{ background: "#e0f7e0" }}>
          <div><strong>Filtered Users:</strong> {filteredStats.totalUsers || 0}</div>
          <div><strong>Filtered Orders:</strong> {filteredStats.totalOrders || 0}</div>
          <div><strong>Filtered Sales:</strong> ${typeof filteredStats.totalSales === "number" ? filteredStats.totalSales.toFixed(2) : "0.00"}</div>
        </div>
      )}

      <input
        type="text"
        placeholder="Search by email..."
        onChange={handleSearch}
        className="search-input"
      />

      {orders.length === 0 ? (
        <p>No orders yet.</p>
      ) : (
        <ul className="order-list">
          {orders.map((order) => (
            <li key={order._id} className="order-item">
              <div><strong>User:</strong> {order.name}</div>
              <div><strong>Email:</strong> {order.email}</div>
              <div><strong>Date:</strong> {order.createdAt ? new Date(order.createdAt).toLocaleString() : "N/A"}</div>
              <div><strong>Total:</strong> ${typeof order.total === "number" ? order.total.toFixed(2) : "0.00"}</div>
              <div><strong>Address:</strong> {order.address}</div>
              <div><strong>Status:</strong>
                <select
                  value={order.status}
                  onChange={async (e) => {
                    const newStatus = e.target.value;
                    const res = await fetch(`${process.env.REACT_APP_API_URL}/api/orders/status/${order._id}`, {
                      method: "PUT",
                      headers: {
                        "Content-Type": "application/json",
                        Authorization: auth.token,
                      },
                      body: JSON.stringify({ status: newStatus }),
                    });
                    const data = await res.json();
                    if (!res.ok) return alert(data.message);
                    alert("✅ Status updated!");
                    setOrders((prev) =>
                      prev.map((o) =>
                        o._id === order._id ? { ...o, status: newStatus } : o
                      )
                    );
                    setOrdersBackup((prev) =>
                      prev.map((o) =>
                        o._id === order._id ? { ...o, status: newStatus } : o
                      )
                    );
                  }}
                >
                  <option>Processing</option>
                  <option>Shipped</option>
                  <option>Delivered</option>
                  <option>Cancelled</option>
                </select>
              </div>
              <div><strong>Items:</strong></div>
              <ul>
                {order.items && order.items.length > 0 ? (
                  order.items.map((item, idx) => (
                    <li key={`${item.name}-${idx}`}>{item.name} × {item.quantity}</li>
                  ))
                ) : (
                  <li>No items</li>
                )}
              </ul>
              <button
                onClick={async () => {
                  const confirmDelete = window.confirm("Are you sure you want to delete this order?");
                  if (!confirmDelete) return;
                  const res = await fetch(`${process.env.REACT_APP_API_URL}/api/orders/${order._id}`, {
                    method: "DELETE",
                    headers: { Authorization: auth.token },
                  });
                  const data = await res.json();
                  if (!res.ok) return alert(data.message);
                  alert("🗑 Order deleted!");
                  setOrders(prev => prev.filter(o => o._id !== order._id));
                  setOrdersBackup(prev => prev.filter(o => o._id !== order._id));
                }}
                className="delete-btn"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AdminDashboardPage;
