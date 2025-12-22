"use client";

import Image from "next/image";
import styles from "./page.module.css";
import {useRouter} from "next/navigation";

export default function Home() {
  const rout = useRouter();
  return (
    <div className={styles.page} onClick={() => rout.push("./login")}>Click Here to Login</div>
  );
}