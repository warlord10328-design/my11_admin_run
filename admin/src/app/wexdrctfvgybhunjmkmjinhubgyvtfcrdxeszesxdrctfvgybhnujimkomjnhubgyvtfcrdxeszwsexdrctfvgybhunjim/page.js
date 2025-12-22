"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./page.module.css";

export default function Signup() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL_ONLINE;

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const res = await fetch(`${BACKEND_URL}/admin/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
        credentials: "include"
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Signup failed");
        return;
      }

      setSuccess("Signup successful! Redirecting...");
      setTimeout(() => router.push("/main"), 1500);
    } catch (err) {
      console.error(err);
      setError("Something went wrong");
    }
  };

  return (
    <div className={styles.container}>
      <form className={styles.box} onSubmit={handleSignup}>
        <h2 className={styles.title}>Admin Signup</h2>
        {error && <p className={styles.error}>{error}</p>}
        {success && <p className={styles.success}>{success}</p>}
        <input type="text" placeholder="Username" className={styles.input} value={username} onChange={(e) => setUsername(e.target.value)} />
        <input type="password" placeholder="Password" className={styles.input} value={password} onChange={(e) => setPassword(e.target.value)} />
        <button className={styles.button} type="submit">Signup</button>
      </form>
    </div>
  );
}
