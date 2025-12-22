"use client";

import { useEffect, useState } from "react";
import styles from "./page.module.css";

export default function Insert() {
  // ---------- Loaded Data from DB ----------
  const [teamsList, setTeamsList] = useState([]);
  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL_ONLINE;

  // ---------- Form States ----------
  const [tournament, setTournament] = useState({ name: "" });

  const [team, setTeam] = useState({
    name: "",
    name_short: "",
    image: null,
  });

  const [player, setPlayer] = useState({
    name: "",
    image: null,
    team_id: "",
    role: "",
    dob: "",
  });

  const [venue, setVenue] = useState({
    name: "",
    city: "",
    country: "",
  });

  // ---------- Fetch Tournaments & Teams on Load ----------
  useEffect(() => {
    async function loadIDs() {
      try {
        const tRes = await fetch(`${BACKEND_URL}/insert/tournament`);
        const tData = await tRes.json();
        setTournamentsList(tData.data || []);

        const teamRes = await fetch(`${BACKEND_URL}/insert/team`);
        const teamData = await teamRes.json();
        setTeamsList(teamData.data || []);
      } catch (err) {
        console.log("Error loading IDs:", err);
      }
    }
    loadIDs();
  }, []);

  // ---------- Generic Upload Function ----------
  async function sendFormData(url, dataObj, resetFunc) {
    try {
      const formData = new FormData();
      for (const key in dataObj) {
        if (dataObj[key]) formData.append(key, dataObj[key]);
      }

      const res = await fetch(url, {
        method: "POST",
        body: formData,
      });

      const out = await res.json();
      alert(out.message);
      resetFunc();

      // reload dropdown data
      if (url.includes("tournament") || url.includes("team")) {
        const tRes = await fetch(`${BACKEND_URL}/insert/tournament`);
        setTournamentsList((await tRes.json()).data || []);

        const teamRes = await fetch(`${BACKEND_URL}/insert/team`);
        setTeamsList((await teamRes.json()).data || []);
      }
    } catch (err) {
      alert("Error: " + err.message);
    }
  }

  async function sendTournament(tournament, resetFunc) {
    try {
      const res = await fetch(`${BACKEND_URL}/insert/tournament`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(tournament),
      });

      const out = await res.json();
      alert(out.message);
      resetFunc();
    } catch (err) {
      alert("Error: " + err.message);
    }
  }
  async function sendVenueData() {
    try {
      const res = await fetch(`${BACKEND_URL}/insert/venue`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(venue),
      });
      const out = await res.json();
      alert(out.message);
      setVenue({ name: "", city: "", country: "" });
    } catch (err) {
      alert("Error: " + err.message);
    }
  }

  return (
    <div className={styles.boot}>
      <h1>Data Insert Panel</h1>

      {/* ----------------- Tournament ----------------- */}
      <section className={styles.section}>
        <h2>Tournament</h2>

        <input
          type="text"
          placeholder="Tournament Name"
          value={tournament.name}
          onChange={(e) =>
            setTournament({ ...tournament, name: e.target.value })
          }
        />

        <button
          onClick={() =>
            sendTournament(tournament, () => setTournament({ name: "" }))
          }
        >
          Insert Tournament
        </button>
      </section>

      {/* ----------------- Team ----------------- */}
      <section className={styles.section}>
        <h2>Team</h2>

        <input
          type="text"
          placeholder="Team Name"
          value={team.name}
          onChange={(e) => setTeam({ ...team, name: e.target.value })}
        />

        <input
          type="text"
          placeholder="Short Form"
          value={team.name_short}
          onChange={(e) => setTeam({ ...team, name_short: e.target.value })}
        />

        <input
          type="file"
          accept="image/png, image/jpeg"
          onChange={(e) => setTeam({ ...team, image: e.target.files[0] })}
        />

        {team.image && (
          <img
            src={URL.createObjectURL(team.image)}
            alt="Team Preview"
            style={{ width: "120px", marginTop: "10px", borderRadius: "8px" }}
          />
        )}

        <button
          onClick={() =>
            sendFormData(`${BACKEND_URL}/insert/team`, team, () =>
              setTeam({
                name: "",
                name_short: "",
                image: null,
                tournament_id: "",
              })
            )
          }
        >
          Insert Team
        </button>
      </section>

      {/* ----------------- Player ----------------- */}
      <section className={styles.section}>
        <h2>Player</h2>

        <input
          type="text"
          placeholder="Player Name"
          value={player.name}
          onChange={(e) => setPlayer({ ...player, name: e.target.value })}
        />

        <input
          type="file"
          accept="image/png, image/jpeg"
          onChange={(e) => setPlayer({ ...player, image: e.target.files[0] })}
        />

        {player.image && (
    <img
      src={URL.createObjectURL(player.image)}
      alt="Player Preview"
      style={{ width: "120px", marginTop: "10px", borderRadius: "8px" }}
    />
  )}

        {/* -------- Team ID Dropdown -------- */}
        <select
          value={player.team_id}
          onChange={(e) => setPlayer({ ...player, team_id: e.target.value })}
        >
          <option value="">Select Team</option>
          {teamsList.map((tm) => (
            <option key={tm.id} value={tm.id}>
              {tm.name}
            </option>
          ))}
        </select>

        <input
          type="text"
          placeholder="Role (Batsman, Bowler...)"
          value={player.role}
          onChange={(e) => setPlayer({ ...player, role: e.target.value })}
        />

        <input
          type="date"
          value={player.dob}
          onChange={(e) => setPlayer({ ...player, dob: e.target.value })}
        />

        <button
          onClick={() =>
            sendFormData(`${BACKEND_URL}/insert/player`, player, () =>
              setPlayer({
                name: "",
                image: null,
                team_id: "",
                role: "",
                dob: "",
              })
            )
          }
        >
          Insert Player
        </button>
      </section>

      {/* ----------------- Venue ----------------- */}
      <section className={styles.section}>
        <h2>Venue</h2>

        <input
          type="text"
          placeholder="Venue Name"
          value={venue.name}
          onChange={(e) => setVenue({ ...venue, name: e.target.value })}
        />

        <input
          type="text"
          placeholder="City"
          value={venue.city}
          onChange={(e) => setVenue({ ...venue, city: e.target.value })}
        />

        <input
          type="text"
          placeholder="Country"
          value={venue.country}
          onChange={(e) => setVenue({ ...venue, country: e.target.value })}
        />

        <button onClick={sendVenueData}>Insert Venue</button>
      </section>
    </div>
  );
}
