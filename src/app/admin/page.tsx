"use client";

import { useEffect, useState } from "react";

/* ===================== TYPES ===================== */
type Patient = {
  id: number;
  name: string;
  email: string;
};

type Appointment = {
  id: number;
  provider: string;
  startDateTime: string;
  repeat: string;
};

type Prescription = {
  id: number;
  medication: string;
  dosage: string;
  quantity: number;
  refillDate: string;
  refillSchedule: string;
};

/* ===================== COMPONENT ===================== */
export default function AdminPage() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [selectedPatientId, setSelectedPatientId] = useState<number | null>(null);

  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);

  /* Patient form */
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  /* Appointment form */
  const [provider, setProvider] = useState("");
  const [startDateTime, setStartDateTime] = useState("");
  const [repeat, setRepeat] = useState("none");

  /* Prescription form */
  const [medication, setMedication] = useState("");
  const [dosage, setDosage] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [refillDate, setRefillDate] = useState("");
  const [refillSchedule, setRefillSchedule] = useState("monthly");

  /* ===================== FETCH ===================== */
  async function fetchPatients() {
    const res = await fetch("/api/patients");
    setPatients(await res.json());
  }

  async function fetchAppointments(patientId: number) {
    const res = await fetch(`/api/appointments?patientId=${patientId}`);
    setAppointments(await res.json());
  }

  async function fetchPrescriptions(patientId: number) {
    const res = await fetch(`/api/prescriptions?patientId=${patientId}`);
    setPrescriptions(await res.json());
  }

  useEffect(() => {
    fetchPatients();
  }, []);

  /* ===================== HANDLERS ===================== */
  async function createPatient(e: React.FormEvent) {
    e.preventDefault();

    await fetch("/api/patients", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    setName("");
    setEmail("");
    setPassword("");
    fetchPatients();
  }

  async function createAppointment(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedPatientId) return;

    await fetch("/api/appointments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        provider,
        startDateTime,
        repeat,
        patientId: selectedPatientId,
      }),
    });

    setProvider("");
    setStartDateTime("");
    setRepeat("none");
    fetchAppointments(selectedPatientId);
  }

  async function createPrescription(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedPatientId) return;

    await fetch("/api/prescriptions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        medication,
        dosage,
        quantity,
        refillDate,
        refillSchedule,
        patientId: selectedPatientId,
      }),
    });

    setMedication("");
    setDosage("");
    setQuantity(1);
    setRefillDate("");
    setRefillSchedule("monthly");
    fetchPrescriptions(selectedPatientId);
  }

  async function endPrescription(id: number) {
    await fetch("/api/prescriptions", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });

    if (selectedPatientId) fetchPrescriptions(selectedPatientId);
  }

  function selectPatient(patientId: number) {
    setSelectedPatientId(patientId);
    fetchAppointments(patientId);
    fetchPrescriptions(patientId);
  }

  /* ===================== UI ===================== */
  return (
    <main className="p-8 space-y-10">
      <h1 className="text-2xl font-bold">Admin – Patient Management</h1>

      {/* CREATE PATIENT */}
      <form onSubmit={createPatient} className="border p-4 rounded max-w-md space-y-3">
        <h2 className="font-semibold">Create Patient</h2>
        <input className="border p-2 w-full" placeholder="Name" value={name} onChange={e => setName(e.target.value)} required />
        <input className="border p-2 w-full" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
        <input className="border p-2 w-full" placeholder="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} required />
        <button className="bg-black text-white px-4 py-2 rounded">Create</button>
      </form>

      {/* PATIENT LIST */}
      <table className="border w-full max-w-3xl">
        <thead className="bg-gray-100">
          <tr>
            <th className="border p-2">ID</th>
            <th className="border p-2">Name</th>
            <th className="border p-2">Email</th>
          </tr>
        </thead>
        <tbody>
          {patients.map(p => (
            <tr key={p.id} onClick={() => selectPatient(p.id)} className="cursor-pointer hover:bg-gray-50">
              <td className="border p-2">{p.id}</td>
              <td className="border p-2">{p.name}</td>
              <td className="border p-2">{p.email}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* APPOINTMENTS */}
      {selectedPatientId && (
        <>
          <h2 className="text-xl font-semibold">Appointments</h2>

          <form onSubmit={createAppointment} className="border p-4 rounded max-w-md space-y-2">
            <input className="border p-2 w-full" placeholder="Provider" value={provider} onChange={e => setProvider(e.target.value)} required />
            <input className="border p-2 w-full" type="datetime-local" value={startDateTime} onChange={e => setStartDateTime(e.target.value)} required />
            <select className="border p-2 w-full" value={repeat} onChange={e => setRepeat(e.target.value)}>
              <option value="none">None</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
            <button className="bg-black text-white px-4 py-2 rounded">Add Appointment</button>
          </form>

          <ul className="list-disc pl-6">
            {appointments.map(a => (
              <li key={a.id}>{a.provider} — {new Date(a.startDateTime).toLocaleString()} ({a.repeat})</li>
            ))}
          </ul>

          {/* PRESCRIPTIONS */}
          <h2 className="text-xl font-semibold">Prescriptions</h2>

          <form onSubmit={createPrescription} className="border p-4 rounded max-w-md space-y-2">
            <input className="border p-2 w-full" placeholder="Medication" value={medication} onChange={e => setMedication(e.target.value)} required />
            <input className="border p-2 w-full" placeholder="Dosage" value={dosage} onChange={e => setDosage(e.target.value)} required />
            <input className="border p-2 w-full" type="number" value={quantity} onChange={e => setQuantity(Number(e.target.value))} />
            <input className="border p-2 w-full" type="date" value={refillDate} onChange={e => setRefillDate(e.target.value)} required />
            <select className="border p-2 w-full" value={refillSchedule} onChange={e => setRefillSchedule(e.target.value)}>
              <option value="monthly">Monthly</option>
              <option value="quarterly">Quarterly</option>
            </select>
            <button className="bg-black text-white px-4 py-2 rounded">Add Prescription</button>
          </form>

          <ul className="list-disc pl-6">
            {prescriptions.map(p => (
              <li key={p.id}>
                {p.medication} ({p.dosage}) — refill {new Date(p.refillDate).toLocaleDateString()}
                <button onClick={() => endPrescription(p.id)} className="ml-4 text-red-600 underline">
                  End
                </button>
              </li>
            ))}
          </ul>
        </>
      )}
    </main>
  );
}
