import { useState } from "react";
import type { AppData, Employment } from "../types/domain";
import {
  hasOverlappingEmployment,
  isEndDateAfterStartDate,
  isValidWeeklyHours,
} from "../utils/validation";

type Props = {
  data: AppData;
  setData: React.Dispatch<React.SetStateAction<AppData>>;
};

const emptyEmployment: Employment = {
  id: "",
  userId: "",
  departmentId: "",
  staffGroupId: "",
  shiftLayerId: "",
  weeklyHours: 37,
  startDate: "",
  endDate: "",
};

export function EmploymentsPage({ data, setData }: Props) {
  const [form, setForm] = useState<Employment>(emptyEmployment);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState("");

  const staffUsers = data.users.filter((user) => user.isStaff);

  function resetForm() {
    setForm(emptyEmployment);
    setEditingId(null);
    setError("");
  }

  function getUserName(userId: string) {
    return data.users.find((user) => user.id === userId)?.name ?? "Ukendt";
  }

  function getDepartmentName(departmentId: string) {
    return (
      data.departments.find((department) => department.id === departmentId)
        ?.name ?? "Ukendt"
    );
  }

  function getStaffGroupName(staffGroupId: string) {
    return (
      data.staffGroups.find((group) => group.id === staffGroupId)?.name ??
      "Ukendt"
    );
  }

  function getShiftLayerName(shiftLayerId: string) {
    return (
      data.shiftLayers.find((layer) => layer.id === shiftLayerId)?.name ??
      "Ukendt"
    );
  }

  function saveEmployment() {
    setError("");

    if (!form.userId) {
      setError("Person er påkrævet.");
      return;
    }

    if (!form.departmentId) {
      setError("Afsnit er påkrævet.");
      return;
    }

    if (!form.staffGroupId) {
      setError("Personalegruppe er påkrævet.");
      return;
    }

    if (!form.shiftLayerId) {
      setError("Vagtlag er påkrævet.");
      return;
    }

    if (!isValidWeeklyHours(Number(form.weeklyHours))) {
      setError("Timer pr. uge skal være et heltal mellem 0 og 37.");
      return;
    }

    if (!form.startDate) {
      setError("Startdato er påkrævet.");
      return;
    }

    if (!form.endDate) {
      setError("Slutdato er påkrævet.");
      return;
    }

    if (!isEndDateAfterStartDate(form.startDate, form.endDate)) {
      setError("Slutdato skal være efter startdato.");
      return;
    }

    const employmentToSave: Employment = {
      ...form,
      id: editingId ?? crypto.randomUUID(),
      weeklyHours: Number(form.weeklyHours),
    };

    if (hasOverlappingEmployment(employmentToSave, data.employments)) {
      setError("Personen har allerede en ansættelse i den valgte periode.");
      return;
    }

    if (editingId) {
      setData((prev) => ({
        ...prev,
        employments: prev.employments.map((employment) =>
          employment.id === editingId ? employmentToSave : employment
        ),
      }));
    } else {
      setData((prev) => ({
        ...prev,
        employments: [...prev.employments, employmentToSave],
      }));
    }

    resetForm();
  }

  function editEmployment(employment: Employment) {
    setForm(employment);
    setEditingId(employment.id);
    setError("");
  }

  function deleteEmployment(id: string) {
    const shouldDelete = window.confirm("Vil du slette denne ansættelse?");

    if (!shouldDelete) return;

    setData((prev) => ({
      ...prev,
      employments: prev.employments.filter(
        (employment) => employment.id !== id
      ),
    }));

    if (editingId === id) resetForm();
  }

  return (
    <section className="card">
      <div className="page-header">
        <div>
          <h1>Ansættelser</h1>
          <p>Opret, rediger og slet ansættelser med relationer og datoregler.</p>
        </div>
      </div>

      {error && <div className="error">{error}</div>}

      <div className="form-grid">
        <div className="form-field">
          <label>Person</label>
          <select
            value={form.userId}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, userId: event.target.value }))
            }
          >
            <option value="">Vælg person</option>
            {staffUsers.map((user) => (
              <option key={user.id} value={user.id}>
                {user.name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-field">
          <label>Afsnit</label>
          <select
            value={form.departmentId}
            onChange={(event) =>
              setForm((prev) => ({
                ...prev,
                departmentId: event.target.value,
              }))
            }
          >
            <option value="">Vælg afsnit</option>
            {data.departments.map((department) => (
              <option key={department.id} value={department.id}>
                {department.name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-field">
          <label>Personalegruppe</label>
          <select
            value={form.staffGroupId}
            onChange={(event) =>
              setForm((prev) => ({
                ...prev,
                staffGroupId: event.target.value,
              }))
            }
          >
            <option value="">Vælg personalegruppe</option>
            {data.staffGroups.map((group) => (
              <option key={group.id} value={group.id}>
                {group.name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-field">
          <label>Vagtlag</label>
          <select
            value={form.shiftLayerId}
            onChange={(event) =>
              setForm((prev) => ({
                ...prev,
                shiftLayerId: event.target.value,
              }))
            }
          >
            <option value="">Vælg vagtlag</option>
            {data.shiftLayers.map((layer) => (
              <option key={layer.id} value={layer.id}>
                {layer.name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-field">
          <label>Timer pr. uge</label>
          <input
            type="number"
            min="0"
            max="37"
            value={form.weeklyHours}
            onChange={(event) =>
              setForm((prev) => ({
                ...prev,
                weeklyHours: Number(event.target.value),
              }))
            }
          />
        </div>

        <div className="form-field">
          <label>Startdato</label>
          <input
            type="date"
            value={form.startDate}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, startDate: event.target.value }))
            }
          />
        </div>

        <div className="form-field">
          <label>Slutdato</label>
          <input
            type="date"
            value={form.endDate}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, endDate: event.target.value }))
            }
          />
        </div>
      </div>

      <div className="actions">
        <button className="btn primary" onClick={saveEmployment}>
          {editingId ? "Gem ændringer" : "Tilføj ansættelse"}
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
            <th>Person</th>
            <th>Afsnit</th>
            <th>Personalegruppe</th>
            <th>Vagtlag</th>
            <th>Timer</th>
            <th>Start</th>
            <th>Slut</th>
            <th>Handlinger</th>
          </tr>
        </thead>

        <tbody>
          {data.employments.map((employment) => (
            <tr key={employment.id}>
              <td>{getUserName(employment.userId)}</td>
              <td>{getDepartmentName(employment.departmentId)}</td>
              <td>{getStaffGroupName(employment.staffGroupId)}</td>
              <td>{getShiftLayerName(employment.shiftLayerId)}</td>
              <td>{employment.weeklyHours}</td>
              <td>{employment.startDate}</td>
              <td>{employment.endDate}</td>
              <td>
                <div className="actions">
                  <button
                    className="btn"
                    onClick={() => editEmployment(employment)}
                  >
                    Rediger
                  </button>
                  <button
                    className="btn danger"
                    onClick={() => deleteEmployment(employment.id)}
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