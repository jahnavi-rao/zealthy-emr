"use client";

import { useEffect, useState } from "react";

type Patient = {
  id: number;
  name: string;
  email: string;
};

export default function AdminPage() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function fetchPatients() {
    const res = await fetch("/api/patients");
    const data = await res.json();
    setPatients(data);
    setLoading(false);
  }

  useEffect(() => {
    fetchPatients();
  }, []);

  async function handleCreatePatient(e: React.FormEvent) {
    e.preventDefault();

    await fetch("/api/patients", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        email,
        password,
      }),
    });

    setName("");
    setEmail("");
    setPassword("");

    fetchPatients(); // refresh list
  }

  if (loading) {
    return <p className="p-8">Loading patients...</p>;
  }

  return (
    <main className="p-8 space-y-8">
      <h1 className="text-2xl font-bold">Admin – Patient Management</h1>

      {/* Create Patient Form */}
      <form
        onSubmit={handleCreatePatient}
        className="border p-4 rounded space-y-4 max-w-md"
      >
        <h2 className="text-lg font-semibold">Create Patient</h2>

        <input
          className="border p-2 w-full"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <input
          className="border p-2 w-full"
          placeholder="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          className="border p-2 w-full"
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button
          type="submit"
          className="bg-black text-white px-4 py-2 rounded"
        >
          Create Patient
        </button>
      </form>

      {/* Patient Table */}
      {patients.length === 0 ? (
        <p>No patients found.</p>
      ) : (
        <table className="border border-gray-300 w-full max-w-2xl">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2 text-left">ID</th>
              <th className="border p-2 text-left">Name</th>
              <th className="border p-2 text-left">Email</th>
            </tr>
          </thead>
          <tbody>
            {patients.map((patient) => (
              <tr key={patient.id}>
                <td className="border p-2">{patient.id}</td>
                <td className="border p-2">{patient.name}</td>
                <td className="border p-2">{patient.email}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </main>
  );
}