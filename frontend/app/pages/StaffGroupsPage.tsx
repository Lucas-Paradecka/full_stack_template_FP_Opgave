import { useState } from "react";
import type { AppData, StaffGroup } from "../types/domain";

type Props = {
  data: AppData;
  setData: React.Dispatch<React.SetStateAction<AppData>>;
};

const emptyStaffGroup: StaffGroup = {
  id: "",
  name: "",
};

export function StaffGroupsPage({ data, setData }: Props) {
  const [form, setForm] = useState<StaffGroup>(emptyStaffGroup);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState("");

  function resetForm() {
    setForm(emptyStaffGroup);
    setEditingId(null);
    setError("");
  }

  function saveStaffGroup() {
    setError("");

    if (!form.name.trim()) {
      setError("Navn er påkrævet.");
      return;
    }

    if (editingId) {
      setData((prev) => ({
        ...prev,
        staffGroups: prev.staffGroups.map((group) =>
          group.id === editingId ? { ...form, id: editingId } : group
        ),
      }));
    } else {
      setData((prev) => ({
        ...prev,
        staffGroups: [
          ...prev.staffGroups,
          { ...form, id: crypto.randomUUID() },
        ],
      }));
    }

    resetForm();
  }

  function editStaffGroup(group: StaffGroup) {
    setForm(group);
    setEditingId(group.id);
    setError("");
  }

  function deleteStaffGroup(id: string) {
    setError("");

    const isUsed = data.employments.some(
      (employment) => employment.staffGroupId === id
    );

    if (isUsed) {
      setError(
        "Personalegruppen kan ikke slettes, fordi den bruges i en ansættelse."
      );
      return;
    }

    setData((prev) => ({
      ...prev,
      staffGroups: prev.staffGroups.filter((group) => group.id !== id),
    }));

    if (editingId === id) resetForm();
  }

  return (
    <section className="card">
      <div className="page-header">
        <div>
          <h1>Personalegrupper</h1>
          <p>Opret, rediger og slet personalegrupper.</p>
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
            placeholder="Fx Overlæge"
          />
        </div>
      </div>

      <div className="actions">
        <button className="btn primary" onClick={saveStaffGroup}>
          {editingId ? "Gem ændringer" : "Tilføj personalegruppe"}
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
            <th>Handlinger</th>
          </tr>
        </thead>

        <tbody>
          {data.staffGroups.map((group) => (
            <tr key={group.id}>
              <td>{group.name}</td>
              <td>
                <div className="actions">
                  <button className="btn" onClick={() => editStaffGroup(group)}>
                    Rediger
                  </button>
                  <button
                    className="btn danger"
                    onClick={() => deleteStaffGroup(group.id)}
                  >
                    Slet
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}