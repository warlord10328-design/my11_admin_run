"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./page.module.css";

export default function Main() {
  const router = useRouter();
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [adomClass, setAdomClass] = useState("adom2");

  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL_ONLINE;

  const setAdomfunt = () => {
    setAdomClass("adom");
    setTimeout(() => setAdomClass("adom2"), 1000);
  };

  useEffect(() => {
    async function check() {
      const token = localStorage.getItem("adminToken");

      if (!token) {
        router.push("/login");
        return;
      }

      try {
        const res = await fetch(`${BACKEND_URL}/admin/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          localStorage.removeItem("adminToken");
          router.push("/login");
          return;
        }

        const data = await res.json();
        setAdmin(data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        router.push("/login");
      }
    }

    check();
  }, []);

  if (loading) return <p>Checking authentication...</p>;

  return (
    <div>
      <h2 className={styles.title}>Welcome {admin.username}</h2>

      {[
        ["Dashboard", "/main/d"],
        ["User Management", "/main/um"],
        ["Game Control", "/main/gc"],
        ["Payment Management", "/main/pm"],
        ["KYC & User Verification", "/main/kyc"],
        ["Notification & Marketing", "/main/notify"],
        ["Settings", "/main/sc"],
        ["Fraud Alerts", "/main/fa"],
      ].map(([label, path]) => (
        <div
          key={path}
          className={styles.boot}
          onClick={() => {
            if (admin.role !== "admin") {
              setAdomfunt();
              return;
            }
            router.push(path);
          }}
        >
          {label}
        </div>
      ))}

      <div className={styles[adomClass]}>Admin access only</div>
    </div>
  );
}
