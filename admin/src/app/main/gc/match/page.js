"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import styles from "./page.module.css";

export default function MatchSetup() {
  const searchParams = useSearchParams();
  const initialTeamA = searchParams.get("team1") || "";
  const initialTeamB = searchParams.get("team2") || "";

  const [url, setUrl] = useState("");
  const [teamA, setTeamA] = useState(initialTeamA);
  const [teamB, setTeamB] = useState(initialTeamB);
  const [teamAPlayers, setTeamAPlayers] = useState([]);
  const [teamBPlayers, setTeamBPlayers] = useState([]);
  const [missingA, setMissingA] = useState([]);
  const [missingB, setMissingB] = useState([]);
  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL_ONLINE;

  async function handleGetData() {
    try {
      const res = await fetch(`${BACKEND_URL}/scrape/scrape-squad`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });

      const data = await res.json();
      if (!data.success) {
        alert("Scraper failed: " + (data.message || ""));
        return;
      }

      const s = data.squads || { playersA: [], playersB: [] };

      setTeamAPlayers(s.playersA || []);
      setTeamBPlayers(s.playersB || []);

      // check in DB
      await checkPlayersInDB(s.playersA || [], s.playersB || []);
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    }
  }

  async function checkPlayersInDB(playersA, playersB) {
    try {
      const res = await fetch(`${BACKEND_URL}/insert/check`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ teamA: playersA, teamB: playersB }),
      });

      const data = await res.json();
      if (!data.success) {
        console.error("players/check error:", data);
        setMissingA([]);
        setMissingB([]);
        return;
      }

      setMissingA(data.missingA || []);
      setMissingB(data.missingB || []);
    } catch (err) {
      console.error("DB check failed:", err);
      setMissingA([]);
      setMissingB([]);
    }
  }

  // helper lowercased sets for fast lookup
  const missingALower = new Set((missingA || []).map((m) => (m || "").toLowerCase()));
  const missingBLower = new Set((missingB || []).map((m) => (m || "").toLowerCase()));

  return (
    <div>
      <div className={styles.title}>Match Edit</div>

      <input
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="Paste webpage URL"
      />

      <button onClick={handleGetData} className={styles.but}>GET</button>

      <div className={styles.filter}>Bowler , Batsman , Allrounder</div>

      <div className={styles.flex}>

        {/* TEAM A */}
        <div className={styles.teamA}>
          <div className={styles.naam}>{teamA || "Team A"}</div>
          <div className={styles.selector}>
            {teamAPlayers.map((p, i) => {
              const lower = (p || "").toLowerCase();
              const isMissing = missingALower.has(lower);
              return (
                <div key={i} className={styles.playerRow} style={{ color: isMissing ? "red" : "black" }}>
                  <input type="checkbox" /> {p}
                </div>
              );
            })}
          </div>
        </div>

        {/* TEAM B */}
        <div className={styles.teamB}>
          <div className={styles.naam}>{teamB || "Team B"}</div>
          <div className={styles.selector}>
            {teamBPlayers.map((p, i) => {
              const lower = (p || "").toLowerCase();
              const isMissing = missingBLower.has(lower);
              return (
                <div key={i} className={styles.playerRow} style={{ color: isMissing ? "red" : "black" }}>
                  <input type="checkbox" /> {p}
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}


