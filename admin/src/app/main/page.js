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

  setTimeout(() => {
    setAdomClass("adom2");
  }, 1000);
};


  useEffect(() => {
    async function check() {
      try {
        const res = await fetch(`${BACKEND_URL}/admin/me`, {
          method: "GET",
          credentials: "include",
        });

        if (!res.ok) {
          return router.push("/login");
        }

        const data = await res.json();
        setAdmin(data);
        setLoading(false);
      } catch (err) {
        console.log(err);
        router.push("/login");
      }
    }

    check();
  }, []);

  if (loading) return <p>Checking authentication...</p>;

  return (
    <div>
      <h2 className={styles.title}>Welcome {admin.username}</h2>

      <div className={styles.boot} onClick={() => {
        if (admin.role !== "admin")
            {setAdomfunt();
            return;}
            router.push("/main/d");
        }}>
        Dashboard
      </div>

      <div className={styles.boot} onClick={() => {
        if (admin.role !== "admin")
            {setAdomfunt();
            return;}
            router.push("/main/um");
      }}>
        User Management
      </div>

      <div className={styles.boot} onClick={() => {
            if (admin.role !== "admin")
            {setAdomfunt();
            return;}
            router.push("/main/gc");
        }}>
        Game Control
      </div>

      <div className={styles.boot} onClick={() => {
        if (admin.role !== "admin")
            {setAdomfunt();
            return;}
            router.push("/main/pm");
      }}>
        Payment Management
      </div>

      <div className={styles.boot} onClick={() => {
        if (admin.role !== "admin")
            {setAdomfunt();
            return;}
            router.push("/main/kyc");
        }}>
        KYC & User Verification
      </div>

      <div className={styles.boot} onClick={() => {
        if (admin.role !== "admin")
            {setAdomfunt();
            return;}
            router.push("/main/notify");
        }}>
        Notification & Marketing
      </div>

      <div className={styles.boot} onClick={() => {
        if (admin.role !== "admin")
            {setAdomfunt();
            return;}
            router.push("/main/sc");
        }}>
        Settings
      </div>

      <div className={styles.boot} onClick={() => {
        if (admin.role !== "admin")
            {setAdomfunt();
            return;}
            router.push("/main/fa");
        }}>
        Fraud Alerts
      </div>

      <div className={styles[adomClass]}>Admin access only</div>
    </div>
  );
}
