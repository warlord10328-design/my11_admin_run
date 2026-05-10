"use client";

import { useEffect, useState } from "react";
import { processImage } from "./BgRemove";
import styles from "./page.module.css";

export default function Insert() {
  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL_ONLINE;

  // ---------- Loaded Data ----------
  const [contestsList, setContestsList] = useState([]); // contests for prize dropdown
  const [teamsList, setTeamsList] = useState([]);
  const [playerExists, setPlayerExists] = useState(null);

  // ---------- Form States ----------
  const [tournament, setTournament] = useState({ name: "" });
  const [team, setTeam] = useState({ name: "", name_short: "", image: null });
  const [player, setPlayer] = useState({
    name: "",
    image: null,
    team_id: "",
    role: "",
    dob: "",
  });
  const [venue, setVenue] = useState({ name: "", city: "", country: "" });
  const [contest, setContest] = useState({
    capacity: "",
    single_capacity: "",
    entry_fee: "",
    prize_pool: "",
    type: "",
  });
  const [prizeBrakup, setPrizeBrakup] = useState({
    contest_id: "",
    prize_range: "",
    amount: "",
  });

  // ---------- Load Contests & Teams ----------
  useEffect(() => {
    async function loadData() {
      try {
        const cRes = await fetch(`${BACKEND_URL}/insert/contests`);
        const cData = await cRes.json();
        setContestsList(cData.data || []);

        const teamRes = await fetch(`${BACKEND_URL}/insert/team`);
        const teamData = await teamRes.json();
        setTeamsList(teamData.data || []);
      } catch (err) {
        console.log("Error loading data:", err);
      }
    }
    loadData();
  }, []);

  async function checkPlayerExists() {
    try {
      if (!player.name.trim()) {
        return alert("Enter player name first");
      }

      const res = await fetch(
        `${BACKEND_URL}/insert/player/check?name=${encodeURIComponent(player.name)}`,
      );

      const data = await res.json();

      if (data.exists) {
        setPlayerExists(true);
        alert("Player already exists");
      } else {
        setPlayerExists(false);
        alert("Player not found");
      }
    } catch (err) {
      alert("Error: " + err.message);
    }
  }

  // ---------- Generic Form Sender ----------
  async function sendFormData(url, dataObj, resetFunc) {
    try {
      const formData = new FormData();
      for (const key in dataObj) {
        if (dataObj[key] !== undefined && dataObj[key] !== null)
          formData.append(key, dataObj[key]);
      }

      const res = await fetch(url, { method: "POST", body: formData });
      const out = await res.json();
      alert(out.message);
      resetFunc();

      // reload contests & teams if needed
      if (url.includes("contests") || url.includes("team")) {
        const cRes = await fetch(`${BACKEND_URL}/insert/contests`);
        setContestsList((await cRes.json()).data || []);

        const teamRes = await fetch(`${BACKEND_URL}/insert/team`);
        setTeamsList((await teamRes.json()).data || []);
      }
    } catch (err) {
      alert("Error: " + err.message);
    }
  }

  // ---------- Tournament Sender ----------
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

  // ---------- Venue Sender ----------
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
      <h1>Manual Data Insert Panel</h1>

      {/* ---------- Tournament ---------- */}
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

      {/* ---------- Team ---------- */}
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

        {/* Select Image */}
        <input
          type="file"
          accept="image/png, image/jpeg"
          onChange={(e) => {
            const file = e.target.files[0];

            if (!file) return;

            setTeam({
              ...team,
              image: file,
            });
          }}
        />

        {/* Preview */}
        {team.image && (
          <div
            style={{
              background:
                "linear-gradient(45deg,#ccc 25%,transparent 25%), linear-gradient(-45deg,#ccc 25%,transparent 25%), linear-gradient(45deg,transparent 75%,#ccc 75%), linear-gradient(-45deg,transparent 75%,#ccc 75%)",
              backgroundSize: "5px 5px",
              backgroundPosition: "0 0, 0 10px, 10px -10px, -10px 0px",
              padding: "10px",
              display: "inline-block",
              marginTop: "10px",
              borderRadius: "8px",
            }}
          >
            <img
              src={URL.createObjectURL(team.image)}
              alt="Team Preview"
              style={{
                width: "120px",
                borderRadius: "8px",
              }}
            />
          </div>
        )}

        {/* Remove BG + Resize */}
        <button
          onClick={async () => {
            setTeam({
              ...team,
              loading: true,
            });

            const processed = await processImage(team.image, 100, 67, true);

            setTeam({
              ...team,
              image: processed,
              loading: false,
              processed: true,
            });
          }}
        >
          {team.loading ? "Processing..." : "Remove BG + Resize"}
        </button>

        {/* Success */}
        {team.processed && (
          <p
            style={{
              color: "green",
              fontWeight: "bold",
              marginTop: "8px",
            }}
          >
            ✓ Image Ready (100 × 67)
          </p>
        )}

        {/* Upload */}
        <button
          onClick={() =>
            sendFormData(`${BACKEND_URL}/insert/team`, team, () =>
              setTeam({
                name: "",
                name_short: "",
                image: null,
                loading: false,
                processed: false,
              }),
            )
          }
        >
          Insert Team
        </button>
      </section>

      {/* ---------- Player ---------- */}
      <section className={styles.section}>
        <h2>Player</h2>

        <input
          type="text"
          placeholder="Player Name"
          value={player.name}
          onChange={(e) => setPlayer({ ...player, name: e.target.value })}
        />

        {/* Front Image */}
        <label>Front Image:</label>

        <input
          type="file"
          accept="image/png, image/jpeg"
          onChange={(e) => {
            const file = e.target.files[0];

            if (!file) return;

            setPlayer({
              ...player,
              image_front: file,
            });
          }}
        />

        {/* Front Preview */}
        {player.image_front && (
          <div
            style={{
              background:
                "linear-gradient(45deg,#ccc 25%,transparent 25%), linear-gradient(-45deg,#ccc 25%,transparent 25%), linear-gradient(45deg,transparent 75%,#ccc 75%), linear-gradient(-45deg,transparent 75%,#ccc 75%)",
              backgroundSize: "5px 5px",
              backgroundPosition: "0 0, 0 10px, 10px -10px, -10px 0px",
              padding: "10px",
              display: "inline-block",
              marginTop: "10px",
              borderRadius: "8px",
            }}
          >
            <img
              src={URL.createObjectURL(player.image_front)}
              alt="Front Preview"
              style={{
                width: "120px",
                borderRadius: "8px",
              }}
            />
          </div>
        )}

        {/* Front Button */}
        <button
          onClick={async () => {
            setPlayer({
              ...player,
              front_loading: true,
            });

            const processed = await processImage(
              player.image_front,
              500,
              500,
              true,
            );

            setPlayer({
              ...player,
              image_front: processed,
              front_loading: false,
              front_processed: true,
            });
          }}
        >
          {player.front_loading
            ? "Processing Front..."
            : "Remove BG + Resize Front"}
        </button>

        {player.front_processed && (
          <p
            style={{
              color: "green",
              fontWeight: "bold",
            }}
          >
            ✓ Front Ready (500 × 500)
          </p>
        )}

        {/* Side Image */}
        <label>Side Image:</label>

        <input
          type="file"
          accept="image/png, image/jpeg"
          onChange={(e) => {
            const file = e.target.files[0];

            if (!file) return;

            setPlayer({
              ...player,
              image_side: file,
            });
          }}
        />

        {/* Side Preview */}
        {player.image_side && (
          <div
            style={{
              background:
                "linear-gradient(45deg,#ccc 25%,transparent 25%), linear-gradient(-45deg,#ccc 25%,transparent 25%), linear-gradient(45deg,transparent 75%,#ccc 75%), linear-gradient(-45deg,transparent 75%,#ccc 75%)",
              backgroundSize: "5px 5px",
              backgroundPosition: "0 0, 0 10px, 10px -10px, -10px 0px",
              padding: "10px",
              display: "inline-block",
              marginTop: "10px",
              borderRadius: "8px",
            }}
          >
            <img
              src={URL.createObjectURL(player.image_side)}
              alt="Side Preview"
              style={{
                width: "120px",
                borderRadius: "8px",
              }}
            />
          </div>
        )}

        {/* Side Button */}
        <button
          onClick={async () => {
            setPlayer({
              ...player,
              side_loading: true,
            });

            const processed = await processImage(
              player.image_side,
              500,
              500,
              true,
            );

            setPlayer({
              ...player,
              image_side: processed,
              side_loading: false,
              side_processed: true,
            });
          }}
        >
          {player.side_loading
            ? "Processing Side..."
            : "Remove BG + Resize Side"}
        </button>

        {player.side_processed && (
          <p
            style={{
              color: "green",
              fontWeight: "bold",
            }}
          >
            ✓ Side Ready (500 × 500)
          </p>
        )}

        <select
          className={styles.drpdown}
          value={player.team_id}
          onChange={(e) =>
            setPlayer({
              ...player,
              team_id: e.target.value,
            })
          }
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
          placeholder="Role"
          value={player.role}
          onChange={(e) =>
            setPlayer({
              ...player,
              role: e.target.value,
            })
          }
        />

        <input
          type="date"
          value={player.dob}
          onChange={(e) =>
            setPlayer({
              ...player,
              dob: e.target.value,
            })
          }
        />

        <button onClick={checkPlayerExists}>Check Player</button>

        <button
          onClick={async () => {
            try {
              const checkRes = await fetch(
                `${BACKEND_URL}/insert/player/check?name=${encodeURIComponent(player.name)}`,
              );

              const checkData = await checkRes.json();

              let shouldContinue = true;

              if (checkData.exists) {
                shouldContinue = window.confirm(
                  "Same name player already exists. Do you want to add again?",
                );
              }

              if (!shouldContinue) return;

              await sendFormData(`${BACKEND_URL}/insert/player`, player, () =>
                setPlayer({
                  name: "",
                  image_front: null,
                  image_side: null,
                  team_id: "",
                  role: "",
                  dob: "",
                  front_loading: false,
                  side_loading: false,
                  front_processed: false,
                  side_processed: false,
                }),
              );
            } catch (err) {
              alert("Error: " + err.message);
            }
          }}
        >
          Insert Player
        </button>
      </section>

      {/* ---------- Venue ---------- */}
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

      {/* ---------- Contest ---------- */}
      <section className={styles.section}>
        <h2>Contest</h2>
        <input
          type="number"
          placeholder="Capacity"
          value={contest.capacity}
          onChange={(e) => setContest({ ...contest, capacity: e.target.value })}
        />
        <input
          type="number"
          placeholder="Single-Capacity"
          value={contest.single_capacity}
          onChange={(e) =>
            setContest({ ...contest, single_capacity: e.target.value })
          }
        />
        <input
          type="number"
          placeholder="Entry Fee"
          value={contest.entry_fee}
          onChange={(e) =>
            setContest({ ...contest, entry_fee: e.target.value })
          }
        />
        <input
          type="number"
          placeholder="Prize Pool"
          value={contest.prize_pool}
          onChange={(e) =>
            setContest({ ...contest, prize_pool: e.target.value })
          }
        />
        <input
          type="text"
          placeholder="Type"
          value={contest.type}
          onChange={(e) => setContest({ ...contest, type: e.target.value })}
        />
        <button
          onClick={async () => {
            try {
              const res = await fetch(`${BACKEND_URL}/insert/contests`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(contest), // send as JSON
              });
              const out = await res.json();
              alert(out.message);
              setContest({
                capacity: "",
                entry_fee: "",
                prize_pool: "",
                single_capacity: "",
              });
            } catch (err) {
              alert("Error: " + err.message);
            }
          }}
        >
          Insert Contest
        </button>
      </section>

      {/* ---------- Prize Breakup ---------- */}
      <section className={styles.section}>
        <h2>Prize Breakup</h2>
        <select
          className={styles.drpdown}
          value={prizeBrakup.contest_id}
          onChange={(e) =>
            setPrizeBrakup({ ...prizeBrakup, contest_id: e.target.value })
          }
        >
          <option value="">Select Contest</option>
          {contestsList.map((ct) => (
            <option key={ct.contest_id} value={ct.contest_id}>
              {ct.contest_id} - {ct.capacity} Players
            </option>
          ))}
        </select>
        <input
          type="text"
          placeholder="Prize Range"
          value={prizeBrakup.prize_range}
          onChange={(e) =>
            setPrizeBrakup({ ...prizeBrakup, prize_range: e.target.value })
          }
        />
        <input
          type="number"
          placeholder="Amount"
          value={prizeBrakup.amount}
          onChange={(e) =>
            setPrizeBrakup({ ...prizeBrakup, amount: e.target.value })
          }
        />
        <button
          onClick={async () => {
            try {
              const res = await fetch(`${BACKEND_URL}/insert/prize`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(prizeBrakup), // send as JSON
              });
              const out = await res.json();
              alert(out.message);
              setPrizeBrakup({ contest_id: "", prize_range: "", amount: "" });
            } catch (err) {
              alert("Error: " + err.message);
            }
          }}
        >
          Insert Prize Breakup
        </button>
      </section>
    </div>
  );
}
