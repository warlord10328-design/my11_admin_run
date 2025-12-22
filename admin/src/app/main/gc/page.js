"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Select from "react-select";
import Styles from "./page.module.css";

export default function GameControl() {
  const [tournaments, setTournaments] = useState([]);
  const [teams, setTeams] = useState([]);
  const [venues, setVenues] = useState([]);
  const [contests, setContests] = useState([]);
  const [isActive, setIsActive] = useState(false);
  const [activeTab, setActiveTab] = useState("upcoming");
  const router = useRouter();
  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL_ONLINE;

  const [form, setForm] = useState({
    tournament_id: "",
    teamA_id: "",
    teamB_id: "",
    venue_id: "",
    date: "",
    time: "",
  });

  const clearForm = () => {
    setForm({
      tournament_id: "",
      teamA_id: "",
      teamB_id: "",
      venue_id: "",
      date: "",
      time: "",
    });
  };

  const handleSubmit = async () => {
    if (
      !form.tournament_id ||
      !form.teamA_id ||
      !form.teamB_id ||
      !form.venue_id ||
      !form.date ||
      !form.time
    ) {
      alert("Please fill all required fields");
      return;
    }

    try {
      const res = await fetch(`${BACKEND_URL}/insert/contest`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (data.success) {
        alert("Contest created successfully!");
        clearForm();
        setIsActive(false);
        fetchContests();
      } else {
        alert("Error: " + data.error);
      }
    } catch (err) {
      console.error("Submit error:", err);
      alert("Something went wrong. Check console.");
    }
  };

  useEffect(() => {
    fetch(`${BACKEND_URL}/insert/data`)
      .then((res) => res.json())
      .then((json) => {
        if (json.success) {
          setTournaments(json.tournaments);
          setTeams(json.teams);
          setVenues(json.venues);
        }
      })
      .catch((err) => console.error("Fetch error:", err));

    fetchContests();
  }, []);

  const fetchContests = () => {
    fetch(`${BACKEND_URL}/insert/contest`)
      .then((res) => res.json())
      .then((json) => {
        if (json.success) setContests(json.data);
      })
      .catch((err) => console.error("Fetch contests error:", err));
  };

  const filteredContests = contests.filter((c) => c.status === activeTab);

  const goToSetup = (contest) => {
  router.push(
    `/main/gc/match?contest_id=${contest.id}&team1=${contest.team1}&team2=${contest.team2}`
  );
};


  return (
    <div>
      <div className={Styles.title}>Game Control Panel</div>

      <div className={Styles.flex}>
        <button className={Styles.buti} onClick={() => router.push("./gc/insert")}>
          Insert
        </button>
        <button className={Styles.but} onClick={() => setIsActive(!isActive)}>
          + Create
        </button>
      </div>

      {/* CREATE CONTEST CARD */}
      <div className={isActive ? Styles.card : Styles.blind}>
        <div className={Styles.flex}>
          <label className={Styles.toor}>Tournament:</label>
          <Select
            className={Styles.input}
            placeholder="Search Tournament..."
            options={tournaments.map((t) => ({ value: t.id, label: t.name }))}
            onChange={(opt) => setForm({ ...form, tournament_id: Number(opt.value) })}
          />
        </div>

        <div className={Styles.flex}>
          <label className={Styles.toor}>Team A:</label>
          <Select
            className={Styles.input}
            placeholder="Search Team A..."
            options={teams.map((team) => ({ value: team.id, label: team.name }))}
            onChange={(opt) => setForm({ ...form, teamA_id: Number(opt.value) })}
          />
        </div>

        <div className={Styles.flex}>
          <label className={Styles.toor}>Team B:</label>
          <Select
            className={Styles.input}
            placeholder="Search Team B..."
            options={teams.map((team) => ({ value: team.id, label: team.name }))}
            onChange={(opt) => setForm({ ...form, teamB_id: Number(opt.value) })}
          />
        </div>

        <div className={Styles.flex}>
          <label className={Styles.toor}>Venue:</label>
          <Select
            className={Styles.input}
            placeholder="Search Venue..."
            options={venues.map((v) => ({ value: v.id, label: v.name }))}
            onChange={(opt) => setForm({ ...form, venue_id: Number(opt.value) })}
          />
        </div>

        <div className={Styles.flex}>
          <label className={Styles.toor}>Date:</label>
          <input
            className={Styles.input}
            type="date"
            value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
          />
        </div>

        <div className={Styles.flex}>
          <label className={Styles.toor}>Time:</label>
          <input
            className={Styles.input}
            type="time"
            value={form.time}
            onChange={(e) => setForm({ ...form, time: e.target.value })}
          />
        </div>

        <div className={Styles.flex}>
          <button className={Styles.butc} onClick={() => { clearForm(); setIsActive(false); }}>
            Cancel
          </button>
          <button className={Styles.but} onClick={handleSubmit}>
            Create
          </button>
        </div>
      </div>

      {/* Tab Buttons */}
      <div className={Styles.flex}>
        {["upcoming", "live", "completed"].map((tab) => (
          <button
            key={tab}
            className={activeTab === tab ? Styles.opta2 : Styles.opta}
            onClick={() => setActiveTab(tab)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* MATCH LIST */}
      <div className={Styles.match_section}>
        {filteredContests.map((contest) => {
          // Format date YYYY-MM-DD → DD-MM-YYYY
          const formattedDate = contest.date
            ? contest.date.slice(8, 10) + "-" + contest.date.slice(5, 7) + "-" + contest.date.slice(0, 4)
            : "";

          // Format time HH:MM:SS → HH:MM
          const formattedTime = contest.time ? contest.time.slice(0, 5) : "";

          return (
            <div key={contest.id} onClick={() => goToSetup(contest)} className={Styles.first_container}>
              <div className={Styles.league}>{contest.tournament}</div>
              <div className={Styles.slip_bond}>
                <div className={Styles.first_team}>
                  <div className={Styles.flag}></div>
                  <div className={Styles.name}>{contest.team1}</div>
                </div>
                <div className={Styles.tournament}>
                  <div className={Styles.time}>{formattedDate}</div>
                  <div className={Styles.time}>{formattedTime}</div>
                  <div className={Styles.vanue}>{contest.venue}</div>
                </div>
                <div className={Styles.second_team}>
                  <div className={Styles.flag2}></div>
                  <div className={Styles.name2}>{contest.team2}</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
