import { useState } from "react";
import type { AppData, User } from "../types/domain";
import { isEmailUnique } from "../utils/validation";

type Props = {
  data: AppData;
  setData: React.Dispatch<React.SetStateAction<AppData>>;
};

const emptyUser: User = {
  id: "",
  name: "",
  email: "",
  isAdmin: false,
  isStaff: true,
};

export function UsersPage({ data, setData }: Props) {
  const [form, setForm] = useState<User>(emptyUser);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState("");

  function resetForm() {
    setForm(emptyUser);
    setEditingId(null);
    setError("");
  }

  function saveUser() {
    setError("");

    if (!form.name.trim()) {
      setError("Navn er påkrævet.");
      return;
    }

    if (!form.email.trim()) {
      setError("E-mail er påkrævet.");
      return;
    }

    if (!isEmailUnique(form.email, data.users, editingId ?? undefined)) {
      setError("E-mailen findes allerede på en anden bruger.");
      return;
    }

    if (editingId) {
      setData((prev) => ({
        ...prev,
        users: prev.users.map((user) =>
          user.id === editingId ? { ...form, id: editingId } : user
        ),
      }));
    } else {
      setData((prev) => ({
        ...prev,
        users: [...prev.users, { ...form, id: crypto.randomUUID() }],
      }));
    }

    resetForm();
  }

  function editUser(user: User) {
    setForm(user);
    setEditingId(user.id);
    setError("");
  }

  function deleteUser(id: string) {
    setError("");

    const employmentCount = data.employments.filter(
      (employment) => employment.userId === id
    ).length;

    const shouldDelete = window.confirm(
      employmentCount > 0
        ? `Brugeren har ${employmentCount} ansættelse(r). Ved sletning slettes disse også. Fortsæt?`
        : "Vil du slette denne bruger?"
    );

    if (!shouldDelete) return;

    setData((prev) => ({
      ...prev,
      users: prev.users.filter((user) => user.id !== id),
      employments: prev.employments.filter(
        (employment) => employment.userId !== id
      ),
    }));

    if (editingId === id) resetForm();
  }

  return (
    <section className="card">
      <div className="page-header">
        <div>
          <h1>Adgangsstyring</h1>
          <p>Opret, rediger og slet brugere og deres roller.</p>
        </div>
      </div>

      {error && <div className="error">{error}</div>}

      <div className="form-grid">
        <div className="form-field">
          <label>Navn</label>
          <input
            value={form.name}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, name: event.target.value }))
            }
            placeholder="Fx John Jensen"
          />
        </div>

        <div className="form-field">
          <label>E-mail</label>
          <input
            type="email"
            value={form.email}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, email: event.target.value }))
            }
            placeholder="Fx john@john.dk"
          />
        </div>

        <label className="checkbox-row">
          <input
            type="checkbox"
            checked={form.isAdmin}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, isAdmin: event.target.checked }))
            }
          />
          Admin
        </label>

        <label className="checkbox-row">
          <input
            type="checkbox"
            checked={form.isStaff}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, isStaff: event.target.checked }))
            }
          />
          Personale
        </label>
      </div>

      <div className="actions">
        <button className="btn primary" onClick={saveUser}>
          {editingId ? "Gem ændringer" : "Tilføj bruger"}
        </button>

        {editingId && (
          <button className="btn" onClick={resetForm}>
            Annuller
          </button>
        )}
      </div>

      <table className="table">
        <thead>
          <tr>
            <th>Navn</th>
            <th>E-mail</th>
            <th>Admin</th>
            <th>Personale</th>
            <th>Ansættelser</th>
            <th>Handlinger</th>
          </tr>
        </thead>

        <tbody>
          {data.users.map((user) => {
            const employmentCount = data.employments.filter(
              (employment) => employment.userId === user.id
            ).length;

            return (
              <tr key={user.id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.isAdmin ? "Ja" : "Nej"}</td>
                <td>{user.isStaff ? "Ja" : "Nej"}</td>
                <td>{employmentCount}</td>
                <td>
                  <div className="actions">
                    <button className="btn" onClick={() => editUser(user)}>
                      Rediger
                    </button>
                    <button
                      className="btn danger"
                      onClick={() => deleteUser(user.id)}
                    >
                      Slet
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </section>
  );
}