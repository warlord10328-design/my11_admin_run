"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./page.module.css";

export default function Login() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL_ONLINE;

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("http://localhost:5000/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // important for cookies
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Login failed");
        return;
      }

      router.push("/main");
    } catch (err) {
      console.error(err);
      setError("Something went wrong");
    }
  };

  return (
    <div className={styles.container}>
      <form className={styles.box} onSubmit={handleLogin}>
        <h2 className={styles.title}>Admin Login</h2>

        {error && <p className={styles.error}>{error}</p>}

        <input
          type="text"
          placeholder="Username"
          className={styles.input}
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className={styles.input}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button type="submit" className={styles.button}>Login</button>
      </form>
    </div>
  );
}
