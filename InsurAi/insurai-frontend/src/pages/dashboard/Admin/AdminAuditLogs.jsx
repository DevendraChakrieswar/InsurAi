import React, { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CSVLink } from "react-csv";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, CartesianGrid, AreaChart, Area } from "recharts";

const AdminAuditLogs = ({ themeColors }) => {
  const [logs, setLogs] = useState([]);
  const [filteredLogs, setFilteredLogs] = useState([]);
  const [filterRole, setFilterRole] = useState("");
  const [filterAction, setFilterAction] = useState("");
  const [dateRange, setDateRange] = useState("30");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedLog, setSelectedLog] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [logsPerPage] = useState(15);
  const [viewMode, setViewMode] = useState("table");
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [error, setError] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: 'timestamp', direction: 'desc' });

  const token = localStorage.getItem("token");

  // Fetch logs from real API
  const fetchLogs = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await fetch("http://localhost:8080/admin/audit/logs", {
        headers: { 
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch logs: ${response.status}`);
      }

      const data = await response.json();
      setLogs(data);
      setFilteredLogs(data);
    } catch (err) {
      console.error("Error fetching audit logs:", err);
      setError("Failed to load audit logs. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [token]);

  // Auto-refresh functionality
  useEffect(() => {
    let interval;
    if (autoRefresh) {
      interval = setInterval(fetchLogs, 30000);
    }
    return () => clearInterval(interval);
  }, [autoRefresh, token]);

  // Enhanced analytics calculations
  const analytics = useMemo(() => {
    if (!filteredLogs.length) {
      return {
        totalLogs: 0,
        actionsCount: {},
        rolesCount: {},
        hourlyActivity: [],
        dailyActivity: [],
        topUsers: [],
        uniqueUsers: 0,
        mostActiveHour: { hour: '0:00', count: 0 },
        mostActiveAction: { action: '', count: 0 },
        activityTrend: []
      };
    }

    const totalLogs = filteredLogs.length;
    
    const actionsCount = filteredLogs.reduce((acc, log) => {
      acc[log.action] = (acc[log.action] || 0) + 1;
      return acc;
    }, {});

    const rolesCount = filteredLogs.reduce((acc, log) => {
      acc[log.role] = (acc[log.role] || 0) + 1;
      return acc;
    }, {});

    const hourlyActivity = Array.from({ length: 24 }, (_, hour) => {
      const hourLogs = filteredLogs.filter(log => {
        try {
          const logHour = new Date(log.timestamp).getHours();
          return logHour === hour;
        } catch {
          return false;
        }
      });
      return { hour: `${hour}:00`, count: hourLogs.length };
    });

    const dailyActivity = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      const dateStr = date.toISOString().split('T')[0];
      const dayLogs = filteredLogs.filter(log => {
        try {
          return new Date(log.timestamp).toISOString().split('T')[0] === dateStr;
        } catch {
          return false;
        }
      });
      return { 
        date: date.toLocaleDateString('en-US', { weekday: 'short' }), 
        count: dayLogs.length,
        fullDate: dateStr
      };
    });

    const topUsers = Object.entries(
      filteredLogs.reduce((acc, log) => {
        acc[log.user_name] = (acc[log.user_name] || 0) + 1;
        return acc;
      }, {})
    )
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([user, count]) => ({ user, count }));

 return {
  totalLogs,
  actionsCount,
  rolesCount,
  hourlyActivity,
  dailyActivity,
  topUsers,
  uniqueUsers: new Set(
    filteredLogs
      .filter(log => log.user_name && typeof log.user_name === 'string' && log.user_name.trim() !== '')
      .map(log => log.user_name.trim())
  ).size,
  mostActiveHour: hourlyActivity.reduce((max, hour) => hour.count > max.count ? hour : max, { hour: '0:00', count: 0 }),
  mostActiveAction: Object.entries(actionsCount).reduce((max, [action, count]) => count > max.count ? { action, count } : max, { action: '', count: 0 })
};
}, [filteredLogs]);
  // Enhanced filtering with search optimization
  const applyFilters = () => {
    let filtered = [...logs];

    if (filterRole) {
      filtered = filtered.filter((log) => log.role === filterRole);
    }

    if (filterAction) {
      filtered = filtered.filter((log) =>
        log.action.toLowerCase().includes(filterAction.toLowerCase())
      );
    }

    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (log) =>
          log.user_name?.toLowerCase().includes(searchLower) ||
          log.details?.toLowerCase().includes(searchLower) ||
          log.action?.toLowerCase().includes(searchLower)
      );
    }

    if (dateRange && dateRange !== "all") {
      const days = parseInt(dateRange);
      const cutoff = new Date();
      cutoff.setDate(cutoff.getDate() - days);
      filtered = filtered.filter((log) => {
        try {
          return new Date(log.timestamp) >= cutoff;
        } catch {
          return false;
        }
      });
    }

    // Apply sorting
    filtered.sort((a, b) => {
      if (sortConfig.key === 'timestamp') {
        return sortConfig.direction === 'desc' 
          ? new Date(b.timestamp) - new Date(a.timestamp)
          : new Date(a.timestamp) - new Date(b.timestamp);
      }
      return 0;
    });

    setFilteredLogs(filtered);
    setCurrentPage(1);
  };

  // Reset all filters
  const resetFilters = () => {
    setFilterRole("");
    setFilterAction("");
    setSearchTerm("");
    setDateRange("30");
    setFilteredLogs(logs);
    setCurrentPage(1);
  };

  // Handle sort
  const handleSort = (key) => {
    setSortConfig({
      key,
      direction: sortConfig.key === key && sortConfig.direction === 'desc' ? 'asc' : 'desc'
    });
  };

  // Apply filters when sort changes
  useEffect(() => {
    applyFilters();
  }, [sortConfig]);

  // Pagination
  const indexOfLastLog = currentPage * logsPerPage;
  const indexOfFirstLog = indexOfLastLog - logsPerPage;
  const currentLogs = filteredLogs.slice(indexOfFirstLog, indexOfLastLog);
  const totalPages = Math.ceil(filteredLogs.length / logsPerPage);

  // Chart data preparation with better colors
  const roleChartData = Object.entries(analytics.rolesCount).map(([role, count]) => ({
    name: role,
    value: count
  }));

  const actionChartData = Object.entries(analytics.actionsCount)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 8)
    .map(([action, count]) => ({
      action,
      count
    }));

  // Enhanced color scheme
  const CHART_COLORS = {
    primary: themeColors.primary,
    secondary: themeColors.secondary,
    success: '#10b981',
    warning: '#f59e0b',
    info: '#3b82f6',
    danger: '#ef4444'
  };

  const ROLE_COLORS = {
    'ADMIN': CHART_COLORS.primary,
    'HR': CHART_COLORS.secondary,
    'AGENT': CHART_COLORS.success,
    'EMPLOYEE': CHART_COLORS.info
  };

  const ACTION_COLORS = {
    'LOGIN': CHART_COLORS.success,
    'LOGOUT': '#6b7280',
    'VIEW_CLAIMS': CHART_COLORS.info,
    'UPDATE_CLAIM': CHART_COLORS.warning,
    'RESPOND_QUERY': CHART_COLORS.secondary,
    'CREATE_POLICY': CHART_COLORS.danger,
    'SYSTEM_BACKUP': CHART_COLORS.primary,
    'USER_CREATED': '#8b5cf6'
  };

  // Export CSV headers
  const csvHeaders = [
    { label: "Timestamp", key: "timestamp" },
    { label: "User Name", key: "user_name" },
    { label: "Role", key: "role" },
    { label: "Action", key: "action" },
    { label: "Details", key: "details" },
  ];

  const getActionColor = (action) => ACTION_COLORS[action] || CHART_COLORS.primary;
  const getRoleColor = (role) => ROLE_COLORS[role] || CHART_COLORS.primary;

  // Format timestamp for display
  const formatTimestamp = (timestamp) => {
    if (!timestamp) return '-';
    const date = new Date(timestamp);
    return {
      date: date.toLocaleDateString(),
      time: date.toLocaleTimeString()
    };
  };

  return (
    <motion.div
      className="w-100"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Header Section */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="fw-bold mb-2" style={{ color: themeColors.primary, fontSize: '1.5rem' }}>
            <i className="bi bi-list-check me-2"></i>
            Audit Logs & System Activity
          </h4>
          <p className="text-muted mb-0" style={{ fontSize: '0.95rem' }}>
            Comprehensive monitoring of system activities and user actions
          </p>
        </div>
        <div className="d-flex align-items-center gap-3">
          <div className="form-check form-switch">
            <input
              className="form-check-input"
              type="checkbox"
              checked={autoRefresh}
              onChange={(e) => setAutoRefresh(e.target.checked)}
              style={{ 
                backgroundColor: autoRefresh ? themeColors.primary : '#dee2e6',
                borderColor: autoRefresh ? themeColors.primary : '#dee2e6'
              }}
            />
            <label className="form-check-label small text-muted">Auto Refresh</label>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="alert alert-danger alert-dismissible fade show d-flex align-items-center mb-4" role="alert">
          <i className="bi bi-exclamation-triangle-fill me-2"></i>
          <div className="flex-grow-1">{error}</div>
          <button type="button" className="btn-close" onClick={() => setError("")}></button>
        </div>
      )}

      {/* Analytics Overview Cards */}
      <div className="row g-3 mb-4">
        <div className="col-xl-3 col-md-6">
          <motion.div 
            className="card border-0 h-100"
            whileHover={{ y: -2, transition: { duration: 0.2 } }}
            style={{ 
              background: `linear-gradient(135deg, ${themeColors.primary}15, ${themeColors.secondary}10)`,
              border: `1px solid ${themeColors.primary}20`
            }}
          >
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <h6 className="card-subtitle text-muted mb-2" style={{ fontSize: '0.85rem' }}>Total Activities</h6>
                  <h2 className="fw-bold mb-0" style={{ color: themeColors.primary, fontSize: '1.8rem' }}>
                    {analytics.totalLogs.toLocaleString()}
                  </h2>
                  <small className="text-muted" style={{ fontSize: '0.8rem' }}>
                    <i className="bi bi-activity me-1"></i>
                    Real-time tracking
                  </small>
                </div>
                <div className="p-2 rounded" style={{ backgroundColor: `${themeColors.primary}15` }}>
                  <i className="bi bi-list-check fs-5" style={{ color: themeColors.primary }}></i>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="col-xl-3 col-md-6">
          <motion.div 
            className="card border-0 h-100"
            whileHover={{ y: -2, transition: { duration: 0.2 } }}
            style={{ 
              background: `linear-gradient(135deg, ${themeColors.secondary}15, ${themeColors.primary}10)`,
              border: `1px solid ${themeColors.secondary}20`
            }}
          >
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <h6 className="card-subtitle text-muted mb-2" style={{ fontSize: '0.85rem' }}>Unique Users</h6>
                  <h2 className="fw-bold mb-0" style={{ color: themeColors.secondary, fontSize: '1.8rem' }}>
                    {analytics.uniqueUsers}
                  </h2>
                  <small className="text-muted" style={{ fontSize: '0.8rem' }}>
                    <i className="bi bi-people me-1"></i>
                    Active in system
                  </small>
                </div>
                <div className="p-2 rounded" style={{ backgroundColor: `${themeColors.secondary}15` }}>
                  <i className="bi bi-people fs-5" style={{ color: themeColors.secondary }}></i>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="col-xl-3 col-md-6">
          <motion.div 
            className="card border-0 h-100"
            whileHover={{ y: -2, transition: { duration: 0.2 } }}
            style={{ 
              background: 'linear-gradient(135deg, #10b98115, #3b82f610)',
              border: '1px solid #10b98120'
            }}
          >
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <h6 className="card-subtitle text-muted mb-2" style={{ fontSize: '0.85rem' }}>Most Active Hour</h6>
                  <h2 className="fw-bold mb-0" style={{ color: '#10b981', fontSize: '1.8rem' }}>
                    {analytics.mostActiveHour.hour}
                  </h2>
                  <small className="text-muted" style={{ fontSize: '0.8rem' }}>
                    <i className="bi bi-clock me-1"></i>
                    {analytics.mostActiveHour.count} activities
                  </small>
                </div>
                <div className="p-2 rounded" style={{ backgroundColor: '#10b98115' }}>
                  <i className="bi bi-graph-up fs-5" style={{ color: '#10b981' }}></i>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="col-xl-3 col-md-6">
          <motion.div 
            className="card border-0 h-100"
            whileHover={{ y: -2, transition: { duration: 0.2 } }}
            style={{ 
              background: 'linear-gradient(135deg, #3b82f615, #8b5cf610)',
              border: '1px solid #3b82f620'
            }}
          >
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <h6 className="card-subtitle text-muted mb-2" style={{ fontSize: '0.85rem' }}>Top Action</h6>
                  <h2 className="fw-bold mb-0 text-truncate" style={{ color: '#3b82f6', fontSize: '1.3rem' }}>
                    {analytics.mostActiveAction.action || 'N/A'}
                  </h2>
                  <small className="text-muted" style={{ fontSize: '0.8rem' }}>
                    <i className="bi bi-activity me-1"></i>
                    {analytics.mostActiveAction.count} times
                  </small>
                </div>
                <div className="p-2 rounded" style={{ backgroundColor: '#3b82f615' }}>
                  <i className="bi bi-shield-check fs-5" style={{ color: '#3b82f6' }}></i>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* View Mode Toggle */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div className="btn-group" role="group">
          <button
            type="button"
            className={`btn ${viewMode === 'table' ? 'active' : ''}`}
            style={{ 
              backgroundColor: viewMode === 'table' ? themeColors.primary : 'transparent',
              color: viewMode === 'table' ? 'white' : themeColors.primary,
              border: `1px solid ${themeColors.primary}`,
              fontSize: '0.9rem',
              fontWeight: '500'
            }}
            onClick={() => setViewMode('table')}
          >
            <i className="bi bi-table me-2"></i>Table View
          </button>
          <button
            type="button"
            className={`btn ${viewMode === 'analytics' ? 'active' : ''}`}
            style={{ 
              backgroundColor: viewMode === 'analytics' ? themeColors.primary : 'transparent',
              color: viewMode === 'analytics' ? 'white' : themeColors.primary,
              border: `1px solid ${themeColors.primary}`,
              fontSize: '0.9rem',
              fontWeight: '500'
            }}
            onClick={() => setViewMode('analytics')}
          >
            <i className="bi bi-graph-up me-2"></i>Analytics
          </button>
        </div>

        <div className="d-flex gap-2">
          <button
            className="btn d-flex align-items-center"
            style={{
              backgroundColor: themeColors.secondary,
              color: 'white',
              fontSize: '0.9rem',
              fontWeight: '500'
            }}
            onClick={fetchLogs}
            disabled={loading}
          >
            <i className={`bi ${loading ? 'bi-arrow-repeat' : 'bi-arrow-clockwise'} me-2 ${loading ? 'spin' : ''}`}></i>
            {loading ? 'Refreshing...' : 'Refresh Data'}
          </button>
          <CSVLink
            data={filteredLogs}
            headers={csvHeaders}
            filename={`audit_logs_${new Date().toISOString().split('T')[0]}.csv`}
            className="btn d-flex align-items-center"
            style={{
              backgroundColor: themeColors.primary,
              color: 'white',
              fontSize: '0.9rem',
              fontWeight: '500'
            }}
          >
            <i className="bi bi-download me-2"></i> Export CSV
          </CSVLink>
        </div>
      </div>

      {/* Enhanced Filter Section */}
      <motion.div
        className="card mb-4 border-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        style={{ 
          background: 'linear-gradient(135deg, #f8f9fa, #ffffff)',
          border: `1px solid ${themeColors.primary}20`,
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
        }}
      >
        <div
          className="card-header border-0 d-flex justify-content-between align-items-center"
          style={{ 
            background: `linear-gradient(135deg, ${themeColors.primary}, ${themeColors.secondary})`,
            color: 'white'
          }}
        >
          <h5 className="mb-0" style={{ fontSize: '1.1rem', fontWeight: '600' }}>
            <i className="bi bi-funnel me-2"></i>Filter & Search Logs
          </h5>
          <button
            className="btn btn-sm btn-light"
            onClick={resetFilters}
            style={{ fontSize: '0.8rem', fontWeight: '500' }}
          >
            <i className="bi bi-arrow-clockwise me-1"></i>Reset All
          </button>
        </div>
        <div className="card-body">
          <div className="row g-3">
            <div className="col-lg-3 col-md-6">
              <label className="form-label fw-semibold" style={{ fontSize: '0.9rem', color: themeColors.primary }}>User Role</label>
              <select
                className="form-select"
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
                style={{ fontSize: '0.9rem', borderColor: themeColors.primary + '40' }}
              >
                <option value="">All Roles</option>
                <option value="ADMIN">Admin</option>
                <option value="HR">HR</option>
                <option value="AGENT">Agent</option>
                <option value="EMPLOYEE">Employee</option>
              </select>
            </div>

            <div className="col-lg-3 col-md-6">
              <label className="form-label fw-semibold" style={{ fontSize: '0.9rem', color: themeColors.primary }}>Action Type</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g., LOGIN, CLAIM"
                value={filterAction}
                onChange={(e) => setFilterAction(e.target.value)}
                style={{ fontSize: '0.9rem', borderColor: themeColors.primary + '40' }}
              />
            </div>

            <div className="col-lg-3 col-md-6">
              <label className="form-label fw-semibold" style={{ fontSize: '0.9rem', color: themeColors.primary }}>Date Range</label>
              <select
                className="form-select"
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                style={{ fontSize: '0.9rem', borderColor: themeColors.primary + '40' }}
              >
                <option value="1">Last 24 Hours</option>
                <option value="7">Last 7 Days</option>
                <option value="30">Last 30 Days</option>
                <option value="90">Last 90 Days</option>
                <option value="all">All Time</option>
              </select>
            </div>

            <div className="col-lg-3 col-md-6">
              <label className="form-label fw-semibold" style={{ fontSize: '0.9rem', color: themeColors.primary }}>Search</label>
              <input
                type="text"
                className="form-control"
                placeholder="Search users, actions, details..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ fontSize: '0.9rem', borderColor: themeColors.primary + '40' }}
              />
            </div>
          </div>

          <div className="d-flex gap-2 mt-3">
            <button
              className="btn px-4 d-flex align-items-center"
              style={{
                background: `linear-gradient(135deg, ${themeColors.secondary}, ${themeColors.primary})`,
                color: "white",
                fontSize: '0.9rem',
                fontWeight: '500',
                border: 'none'
              }}
              onClick={applyFilters}
            >
              <i className="bi bi-funnel me-2"></i>Apply Filters
            </button>
            <button
              className="btn btn-outline-secondary d-flex align-items-center"
              onClick={resetFilters}
              style={{ fontSize: '0.9rem', fontWeight: '500' }}
            >
              <i className="bi bi-x-circle me-2"></i>Clear All
            </button>
          </div>
        </div>
      </motion.div>

      {/* Content Area */}
      <AnimatePresence mode="wait">
        {viewMode === 'table' && (
          <motion.div
            key="table"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {/* Enhanced Logs Table */}
            <div className="card border-0" style={{ 
              background: 'linear-gradient(135deg, #f8f9fa, #ffffff)',
              border: `1px solid ${themeColors.primary}20`,
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
            }}>
              <div
                className="card-header border-0 d-flex justify-content-between align-items-center"
                style={{ 
                  background: `linear-gradient(135deg, ${themeColors.primary}, ${themeColors.secondary})`,
                  color: 'white'
                }}
              >
                <h5 className="mb-0" style={{ fontSize: '1.1rem', fontWeight: '600' }}>
                  <i className="bi bi-list-ul me-2"></i>Activity Log ({filteredLogs.length} records)
                </h5>
                <div className="d-flex align-items-center gap-3">
                  <span className="text-light" style={{ fontSize: '0.8rem', fontWeight: '500' }}>
                    Page {currentPage} of {totalPages}
                  </span>
                </div>
              </div>

              <div className="card-body">
                {loading ? (
                  <div className="text-center py-5">
                    <div className="spinner-border" style={{ color: themeColors.primary, width: '3rem', height: '3rem' }} role="status"></div>
                    <p className="mt-3 text-muted" style={{ fontSize: '0.9rem' }}>Loading real-time audit logs...</p>
                  </div>
                ) : filteredLogs.length > 0 ? (
                  <>
                    <div className="table-responsive">
                      <table className="table table-hover align-middle mb-0">
                        <thead>
                          <tr style={{ backgroundColor: themeColors.primary + '10' }}>
                            <th 
                              style={{ fontSize: '0.9rem', fontWeight: '600', color: themeColors.primary, cursor: 'pointer', minWidth: '160px' }}
                              onClick={() => handleSort('timestamp')}
                            >
                              Timestamp {sortConfig.key === 'timestamp' && (
                                <i className={`bi bi-chevron-${sortConfig.direction === 'asc' ? 'up' : 'down'} ms-1`}></i>
                              )}
                            </th>
                            <th style={{ fontSize: '0.9rem', fontWeight: '600', color: themeColors.primary, minWidth: '140px' }}>User Name</th>
                            <th style={{ fontSize: '0.9rem', fontWeight: '600', color: themeColors.primary, minWidth: '120px' }}>Role</th>
                            <th style={{ fontSize: '0.9rem', fontWeight: '600', color: themeColors.primary, minWidth: '140px' }}>Action</th>
                            <th style={{ fontSize: '0.9rem', fontWeight: '600', color: themeColors.primary }}>Details</th>
                          </tr>
                        </thead>
                        <tbody>
                          {currentLogs.map((log) => {
                            const formattedTime = formatTimestamp(log.timestamp);
                            return (
                              <motion.tr
                                key={log.id}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.2 }}
                                className="cursor-pointer"
                                onClick={() => setSelectedLog(log)}
                                style={{ 
                                  cursor: 'pointer',
                                  borderLeft: `3px solid ${getActionColor(log.action)}30`,
                                  transition: 'all 0.2s ease'
                                }}
                                whileHover={{ 
                                  backgroundColor: themeColors.primary + '08',
                                  borderLeftColor: getActionColor(log.action)
                                }}
                              >
                                <td style={{ fontSize: '0.85rem' }}>
                                  <div className="fw-medium">{formattedTime.date}</div>
                                  <small className="text-muted">{formattedTime.time}</small>
                                </td>
                                <td style={{ fontSize: '0.9rem', fontWeight: '500' }}>
                                  {log.userName || 'Unknown User'}
                                </td>
                                <td>
                                  <span
                                    className="badge px-2 py-1"
                                    style={{
                                      backgroundColor: getRoleColor(log.role) + '20',
                                      color: getRoleColor(log.role),
                                      fontSize: '0.75rem',
                                      fontWeight: '500',
                                      border: `1px solid ${getRoleColor(log.role)}30`
                                    }}
                                  >
                                    {log.role || 'UNKNOWN'}
                                  </span>
                                </td>
                                <td>
                                  <span
                                    className="badge px-2 py-1"
                                    style={{
                                      backgroundColor: getActionColor(log.action) + '20',
                                      color: getActionColor(log.action),
                                      fontSize: '0.75rem',
                                      fontWeight: '500',
                                      border: `1px solid ${getActionColor(log.action)}30`
                                    }}
                                  >
                                    {log.action ? log.action.replace(/_/g, ' ') : 'UNKNOWN'}
                                  </span>
                                </td>
                                <td style={{ fontSize: '0.85rem', lineHeight: '1.4' }}>
                                  {log.details || 'No details available'}
                                </td>
                              </motion.tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>

                    {/* Enhanced Pagination */}
                    {totalPages > 1 && (
                      <div className="d-flex justify-content-between align-items-center mt-4 pt-3 border-top">
                        <small className="text-muted" style={{ fontSize: '0.8rem', fontWeight: '500' }}>
                          Showing {indexOfFirstLog + 1}-{Math.min(indexOfLastLog, filteredLogs.length)} of {filteredLogs.length} records
                        </small>
                        <nav>
                          <ul className="pagination pagination-sm mb-0">
                            <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                              <button 
                                className="page-link" 
                                onClick={() => setCurrentPage(1)}
                                style={{ 
                                  fontSize: '0.8rem',
                                  color: themeColors.primary,
                                  borderColor: themeColors.primary + '40'
                                }}
                                disabled={currentPage === 1}
                              >
                                <i className="bi bi-chevron-double-left"></i>
                              </button>
                            </li>
                            <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                              <button 
                                className="page-link" 
                                onClick={() => setCurrentPage(currentPage - 1)}
                                style={{ 
                                  fontSize: '0.8rem',
                                  color: themeColors.primary,
                                  borderColor: themeColors.primary + '40'
                                }}
                                disabled={currentPage === 1}
                              >
                                <i className="bi bi-chevron-left"></i>
                              </button>
                            </li>
                            
                            {/* Dynamic page numbers */}
                            {(() => {
                              const pages = [];
                              const startPage = Math.max(1, currentPage - 2);
                              const endPage = Math.min(totalPages, currentPage + 2);
                              
                              for (let i = startPage; i <= endPage; i++) {
                                pages.push(
                                  <li key={i} className={`page-item ${currentPage === i ? 'active' : ''}`}>
                                    <button 
                                      className="page-link" 
                                      onClick={() => setCurrentPage(i)}
                                      style={{ 
                                        fontSize: '0.8rem',
                                        backgroundColor: currentPage === i ? themeColors.primary : 'transparent',
                                        color: currentPage === i ? 'white' : themeColors.primary,
                                        borderColor: themeColors.primary + '40'
                                      }}
                                    >
                                      {i}
                                    </button>
                                  </li>
                                );
                              }
                              return pages;
                            })()}

                            <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                              <button 
                                className="page-link" 
                                onClick={() => setCurrentPage(currentPage + 1)}
                                style={{ 
                                  fontSize: '0.8rem',
                                  color: themeColors.primary,
                                  borderColor: themeColors.primary + '40'
                                }}
                                disabled={currentPage === totalPages}
                              >
                                <i className="bi bi-chevron-right"></i>
                              </button>
                            </li>
                            <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                              <button 
                                className="page-link" 
                                onClick={() => setCurrentPage(totalPages)}
                                style={{ 
                                  fontSize: '0.8rem',
                                  color: themeColors.primary,
                                  borderColor: themeColors.primary + '40'
                                }}
                                disabled={currentPage === totalPages}
                              >
                                <i className="bi bi-chevron-double-right"></i>
                              </button>
                            </li>
                          </ul>
                        </nav>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-center py-5">
                    <div className="mb-3">
                      <i className="bi bi-inbox fs-1" style={{ color: themeColors.primary + '60' }}></i>
                    </div>
                    <h6 style={{ color: themeColors.primary, fontSize: '1rem' }}>No Audit Logs Found</h6>
                    <p className="text-muted mb-3" style={{ fontSize: '0.9rem' }}>
                      No logs match your current filter criteria.
                    </p>
                    <button
                      className="btn"
                      style={{ 
                        background: `linear-gradient(135deg, ${themeColors.primary}, ${themeColors.secondary})`,
                        color: 'white',
                        fontSize: '0.85rem',
                        fontWeight: '500'
                      }}
                      onClick={resetFilters}
                    >
                      <i className="bi bi-arrow-clockwise me-2"></i>
                      Reset Filters to Show All Logs
                    </button>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {viewMode === 'analytics' && (
          <motion.div
            key="analytics"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="row g-4">
              {/* Role Distribution */}
              <div className="col-lg-6">
                <div className="card border-0 h-100" style={{ 
                  background: 'linear-gradient(135deg, #f8f9fa, #ffffff)',
                  border: `1px solid ${themeColors.primary}20`
                }}>
                  <div className="card-header bg-transparent border-0">
                    <h6 className="fw-bold mb-0" style={{ color: themeColors.primary, fontSize: '1rem' }}>
                      <i className="bi bi-pie-chart me-2"></i>Activity Distribution by Role
                    </h6>
                  </div>
                  <div className="card-body">
                    <div style={{ height: '300px' }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={roleChartData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, percent }) => `${name}\n${(percent * 100).toFixed(1)}%`}
                            outerRadius={100}
                            innerRadius={40}
                            dataKey="value"
                          >
                            {roleChartData.map((entry, index) => (
                              <Cell 
                                key={`cell-${index}`} 
                                fill={getRoleColor(entry.name)}
                                stroke="#ffffff"
                                strokeWidth={2}
                              />
                            ))}
                          </Pie>
                          <Tooltip 
                            formatter={(value) => [`${value} activities`, 'Count']}
                            contentStyle={{ 
                              borderRadius: '8px',
                              border: `1px solid ${themeColors.primary}20`
                            }}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              </div>

              {/* Top Actions */}
              <div className="col-lg-6">
                <div className="card border-0 h-100" style={{ 
                  background: 'linear-gradient(135deg, #f8f9fa, #ffffff)',
                  border: `1px solid ${themeColors.primary}20`
                }}>
                  <div className="card-header bg-transparent border-0">
                    <h6 className="fw-bold mb-0" style={{ color: themeColors.primary, fontSize: '1rem' }}>
                      <i className="bi bi-bar-chart me-2"></i>Most Frequent Actions
                    </h6>
                  </div>
                  <div className="card-body">
                    <div style={{ height: '300px' }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={actionChartData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                          <XAxis 
                            dataKey="action" 
                            angle={-45} 
                            textAnchor="end" 
                            height={80}
                            tick={{ fontSize: 12 }}
                          />
                          <YAxis tick={{ fontSize: 12 }} />
                          <Tooltip 
                            formatter={(value) => [`${value} times`, 'Frequency']}
                            contentStyle={{ 
                              borderRadius: '8px',
                              border: `1px solid ${themeColors.primary}20`
                            }}
                          />
                          <Bar 
                            dataKey="count" 
                            radius={[4, 4, 0, 0]}
                          >
                            {actionChartData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={getActionColor(entry.action)} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              </div>

              {/* Hourly Activity Trend */}
              <div className="col-12">
                <div className="card border-0" style={{ 
                  background: 'linear-gradient(135deg, #f8f9fa, #ffffff)',
                  border: `1px solid ${themeColors.primary}20`
                }}>
                  <div className="card-header bg-transparent border-0">
                    <h6 className="fw-bold mb-0" style={{ color: themeColors.primary, fontSize: '1rem' }}>
                      <i className="bi bi-clock me-2"></i>Activity Trend (24 Hours)
                    </h6>
                  </div>
                  <div className="card-body">
                    <div style={{ height: '250px' }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={analytics.hourlyActivity} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                          <XAxis dataKey="hour" tick={{ fontSize: 12 }} />
                          <YAxis tick={{ fontSize: 12 }} />
                          <Tooltip 
                            contentStyle={{ 
                              borderRadius: '8px',
                              border: `1px solid ${themeColors.primary}20`
                            }}
                          />
                          <Area 
                            type="monotone" 
                            dataKey="count" 
                            stroke={themeColors.primary}
                            fill={`url(#colorUv)`}
                            strokeWidth={2}
                          />
                          <defs>
                            <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor={themeColors.primary} stopOpacity={0.8}/>
                              <stop offset="95%" stopColor={themeColors.primary} stopOpacity={0.1}/>
                            </linearGradient>
                          </defs>
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Enhanced Log Detail Modal */}
      <AnimatePresence>
        {selectedLog && (
          <motion.div
            className="modal fade show d-block"
            style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="modal-dialog modal-dialog-centered modal-lg"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <div className="modal-content border-0" style={{ 
                background: 'linear-gradient(135deg, #f8f9fa, #ffffff)',
                boxShadow: '0 10px 40px rgba(0,0,0,0.2)'
              }}>
                <div className="modal-header border-0" style={{ 
                  background: `linear-gradient(135deg, ${themeColors.primary}, ${themeColors.secondary})`,
                  color: 'white'
                }}>
                  <h5 className="modal-title" style={{ fontSize: '1.1rem', fontWeight: '600' }}>
                    <i className="bi bi-info-circle me-2"></i>Audit Log Details
                  </h5>
                  <button
                    type="button"
                    className="btn-close btn-close-white"
                    onClick={() => setSelectedLog(null)}
                  ></button>
                </div>
                <div className="modal-body">
                  <div className="row g-3">
                    <div className="col-md-6">
                      <div className="p-3 rounded" style={{ backgroundColor: themeColors.primary + '10', border: `1px solid ${themeColors.primary}20` }}>
                        <label className="form-label fw-semibold mb-1" style={{ fontSize: '0.8rem', color: themeColors.primary }}>LOG ID</label>
                        <p style={{ fontSize: '0.9rem', fontFamily: 'monospace', margin: 0 }}>#{selectedLog.id}</p>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="p-3 rounded" style={{ backgroundColor: themeColors.primary + '10', border: `1px solid ${themeColors.primary}20` }}>
                        <label className="form-label fw-semibold mb-1" style={{ fontSize: '0.8rem', color: themeColors.primary }}>TIMESTAMP</label>
                        <p style={{ fontSize: '0.9rem', margin: 0 }}>{formatTimestamp(selectedLog.timestamp).date} at {formatTimestamp(selectedLog.timestamp).time}</p>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="p-3 rounded" style={{ backgroundColor: themeColors.secondary + '10', border: `1px solid ${themeColors.secondary}20` }}>
                        <label className="form-label fw-semibold mb-1" style={{ fontSize: '0.8rem', color: themeColors.secondary }}>USER NAME</label>
                        <p style={{ fontSize: '0.9rem', fontWeight: '500', margin: 0 }}>{selectedLog.user_name}</p>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="p-3 rounded" style={{ backgroundColor: getRoleColor(selectedLog.role) + '10', border: `1px solid ${getRoleColor(selectedLog.role)}20` }}>
                        <label className="form-label fw-semibold mb-1" style={{ fontSize: '0.8rem', color: getRoleColor(selectedLog.role) }}>ROLE</label>
                        <p style={{ fontSize: '0.9rem', margin: 0 }}>
                          <span
                            className="badge px-2 py-1"
                            style={{
                              backgroundColor: getRoleColor(selectedLog.role) + '20',
                              color: getRoleColor(selectedLog.role),
                              fontSize: '0.75rem',
                              fontWeight: '500'
                            }}
                          >
                            {selectedLog.role}
                          </span>
                        </p>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="p-3 rounded" style={{ backgroundColor: getActionColor(selectedLog.action) + '10', border: `1px solid ${getActionColor(selectedLog.action)}20` }}>
                        <label className="form-label fw-semibold mb-1" style={{ fontSize: '0.8rem', color: getActionColor(selectedLog.action) }}>ACTION</label>
                        <p style={{ fontSize: '0.9rem', margin: 0 }}>
                          <span
                            className="badge px-2 py-1"
                            style={{
                              backgroundColor: getActionColor(selectedLog.action) + '20',
                              color: getActionColor(selectedLog.action),
                              fontSize: '0.75rem',
                              fontWeight: '500'
                            }}
                          >
                            {selectedLog.action.replace(/_/g, ' ')}
                          </span>
                        </p>
                      </div>
                    </div>
                    <div className="col-12">
                      <div className="p-3 rounded" style={{ backgroundColor: '#f8f9fa', border: '1px solid #dee2e6' }}>
                        <label className="form-label fw-semibold mb-2" style={{ fontSize: '0.9rem', color: themeColors.primary }}>DETAILS</label>
                        <p style={{ fontSize: '0.9rem', lineHeight: '1.5', margin: 0, color: '#495057' }}>
                          {selectedLog.details || 'No additional details available for this activity.'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="modal-footer border-0">
                  <button
                    type="button"
                    className="btn"
                    style={{ 
                      background: `linear-gradient(135deg, ${themeColors.primary}, ${themeColors.secondary})`,
                      color: 'white',
                      fontSize: '0.9rem',
                      fontWeight: '500',
                      border: 'none'
                    }}
                    onClick={() => setSelectedLog(null)}
                  >
                    <i className="bi bi-x-circle me-2"></i>Close Details
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Custom Styles */}
      <style jsx>{`
        .spin {
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .table-hover tbody tr:hover {
          transform: translateY(-1px);
          transition: all 0.2s ease;
        }
      `}</style>
    </motion.div>
  );
};

export default AdminAuditLogs;