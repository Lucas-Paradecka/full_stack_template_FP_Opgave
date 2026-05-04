import { useState } from "react";
import type { AppData, Department } from "../types/domain";

type Props = {
  data: AppData;
  setData: React.Dispatch<React.SetStateAction<AppData>>;
};

const emptyDepartment: Department = {
  id: "",
  name: "",
  color: "",
};

export function DepartmentsPage({ data, setData }: Props) {
  const [form, setForm] = useState<Department>(emptyDepartment);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState("");

  function resetForm() {
    setForm(emptyDepartment);
    setEditingId(null);
    setError("");
  }

  function saveDepartment() {
    setError("");

    if (!form.name.trim()) {
      setError("Navn er påkrævet.");
      return;
    }

    if (!form.color.trim()) {
      setError("Farve er påkrævet.");
      return;
    }

    if (editingId) {
      setData((prev) => ({
        ...prev,
        departments: prev.departments.map((department) =>
          department.id === editingId
            ? { ...form, id: editingId }
            : department
        ),
      }));
    } else {
      setData((prev) => ({
        ...prev,
        departments: [
          ...prev.departments,
          { ...form, id: crypto.randomUUID() },
        ],
      }));
    }

    resetForm();
  }

  function editDepartment(department: Department) {
    setForm(department);
    setEditingId(department.id);
    setError("");
  }

  function deleteDepartment(id: string) {
    setError("");

    const isUsed = data.employments.some(
      (employment) => employment.departmentId === id
    );

    if (isUsed) {
      setError("Afsnittet kan ikke slettes, fordi det bruges i en ansættelse.");
      return;
    }

    setData((prev) => ({
      ...prev,
      departments: prev.departments.filter((department) => department.id !== id),
    }));

    if (editingId === id) resetForm();
  }

  return (
    <section className="card">
      <div className="page-header">
        <div>
          <h1>Afsnit</h1>
          <p>Opret, rediger og slet hospitalsafsnit.</p>
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
            placeholder="Fx Skadestue"
          />
        </div>

        <div className="form-field">
          <label>Farve</label>
          <input
            value={form.color}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, color: event.target.value }))
            }
            placeholder="Fx Rød"
          />
        </div>
      </div>

      <div className="actions">
        <button className="btn primary" onClick={saveDepartment}>
          {editingId ? "Gem ændringer" : "Tilføj afsnit"}
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
            <th>Farve</th>
            <th>Handlinger</th>
          </tr>
        </thead>

        <tbody>
          {data.departments.map((department) => (
            <tr key={department.id}>
              <td>{department.name}</td>
              <td>
                <span className="badge">{department.color}</span>
              </td>
              <td>
                <div className="actions">
                  <button
                    className="btn"
                    onClick={() => editDepartment(department)}
                  >
                    Rediger
                  </button>
                  <button
                    className="btn danger"
                    onClick={() => deleteDepartment(department.id)}
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