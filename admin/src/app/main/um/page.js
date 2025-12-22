"use client";

import { useState } from "react";
import styles from "./page.module.css";

export default function UserManagement() {
  const [search, setSearch] = useState("");

  const users = [
    { id: 1, name: "Rahul Singh", email: "rahul@gmail.com", coins: 1200, status: "active" },
    { id: 2, name: "Aniket", email: "aniket@gmail.com", coins: 800, status: "banned" },
  ];

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>User Management</h1>

      {/* Search and Filter */}
      <div className={styles.searchBox}>
        <input
          type="text"
          placeholder="Search by name, email or ID..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={styles.input}
        />
        <button className={styles.button}>Filter</button>
      </div>

      {/* Users Table */}
      <table className={styles.table}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Coins</th>
            <th>Status</th>
            <th>Actions</th>
            <th>More</th>
          </tr>
        </thead>

        <tbody>
          {users
            .filter(
              (u) =>
                u.name.toLowerCase().includes(search.toLowerCase()) ||
                u.email.toLowerCase().includes(search.toLowerCase()) ||
                String(u.id).includes(search)
            )
            .map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.coins}</td>
                <td>
                  <span
                    className={
                      user.status === "active"
                        ? styles.active
                        : styles.banned
                    }
                  >
                    {user.status}
                  </span>
                </td>

                <td>
                  <button className={styles.actionBtn}>Ban</button>
                  <button className={styles.actionBtn}>Unban</button>
                  <button className={styles.actionBtn}>Reset Password</button>
                </td>

                <td>
                  <button className={styles.viewBtn}>Add Coins</button>
                  <button className={styles.viewBtn}>Deduct Coins</button>
                  <button className={styles.viewBtn}>Block Device</button>
                  <button className={styles.viewBtn}>View Transactions</button>
                  <button className={styles.viewBtn}>Gameplay</button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}
