import React, { useEffect, useState } from 'react';
import api from './api';
import TeamPage from './TeamPage';

export default function Dashboard() {
  const [teams, setTeams] = useState([]);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    api.get('/teams').then(r => setTeams(r.data));
  }, []);

  const create = async () => {
    const name = prompt('Team name');
    if (!name) return;
    const r = await api.post('/teams', { name });
    setTeams([...teams, r.data]);
  };

  return (
    <div className="app">
      <div className="header">
        <h1>TaskFlow</h1>
        <div>
          <button className="button" onClick={create}>
            Create team
          </button>
        </div>
      </div>
      {!selected ? (
        <div>
          <h3>Your teams</h3>
          <ul>
            {teams.map(t => (
              <li key={t._id}>
                <button onClick={() => setSelected(t)}>{t.name}</button>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <TeamPage team={selected} back={() => setSelected(null)} />
      )}
    </div>
  );
}
