"use client";

import styles from "./page.module.css";

export default function Dashboard() {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Admin Dashboard</h1>

      {/* Top Stats */}
      <div className={styles.statsContainer}>
        <div className={styles.card}>
          <h3>Total Users</h3>
          <p>12,450</p>
        </div>

        <div className={styles.card}>
          <h3>Active Users</h3>
          <p>1,320</p>
        </div>

        <div className={styles.card}>
          <h3>Revenue</h3>
          <p>₹ 4,52,000</p>
        </div>

        <div className={styles.card}>
          <h3>Reports</h3>
          <p>89</p>
        </div>
      </div>

      {/* Monthly Graph Section */}
      <div className={styles.section}>
        <h2>Monthly Graphs</h2>
        <div className={styles.graphBox}>Graph Placeholder</div>
      </div>

      {/* Server Health */}
      <div className={styles.section}>
        <h2>Server Health</h2>
        <div className={styles.serverBox}>
          <p>Status: <span className={styles.green}>Healthy</span></p>
          <p>CPU Usage: 27%</p>
          <p>RAM: 62%</p>
        </div>
      </div>

      {/* Version Info */}
      <div className={styles.section}>
        <h2>Version Info</h2>
        <p>Admin Panel: v1.0.0</p>
        <p>Backend API: v1.2.4</p>
        <p>Last Update: Jan 2025</p>
      </div>
    </div>
  );
}
