// lightweight service layer using fetch; supports signal and query
const BASE = process.env.REACT_APP_API_URL || "http://localhost:4000/api";

function checkStatus(res) {
  if (!res.ok) {
    return res.json().then((err) => {
      const message = err?.error || err?.message || res.statusText || "Request failed";
      const e = new Error(message);
      e.status = res.status;
      throw e;
    });
  }
  return res.json();
}

export async function fetchExperiences({ q = "", signal, delay = 0 } = {}) {
  const url = new URL(`${BASE}/experiences`);
  if (q) url.searchParams.set("q", q);
  if (delay) url.searchParams.set("delay", delay);
  const res = await fetch(url.toString(), { signal });
  return checkStatus(res);
}

export async function fetchExperienceById(id) {
  const res = await fetch(`${BASE}/experiences/${id}`);
  return checkStatus(res);
}

export async function addExperience(payload) {
  const res = await fetch(`${BASE}/experiences`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return checkStatus(res);
}

export async function updateExperience(id, payload) {
  const res = await fetch(`${BASE}/experiences/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return checkStatus(res);
}

export async function deleteExperience(id) {
  const res = await fetch(`${BASE}/experiences/${id}`, { method: "DELETE" });
  return checkStatus(res);
}
