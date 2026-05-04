import { useState } from "react";
import type { AppData, ShiftLayer } from "../types/domain";

type Props = {
  data: AppData;
  setData: React.Dispatch<React.SetStateAction<AppData>>;
};

const emptyShiftLayer: ShiftLayer = {
  id: "",
  name: "",
};

export function ShiftLayersPage({ data, setData }: Props) {
  const [form, setForm] = useState<ShiftLayer>(emptyShiftLayer);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState("");

  function resetForm() {
    setForm(emptyShiftLayer);
    setEditingId(null);
    setError("");
  }

  function saveShiftLayer() {
    setError("");

    if (!form.name.trim()) {
      setError("Navn er påkrævet.");
      return;
    }

    if (editingId) {
      setData((prev) => ({
        ...prev,
        shiftLayers: prev.shiftLayers.map((layer) =>
          layer.id === editingId ? { ...form, id: editingId } : layer
        ),
      }));
    } else {
      setData((prev) => ({
        ...prev,
        shiftLayers: [
          ...prev.shiftLayers,
          { ...form, id: crypto.randomUUID() },
        ],
      }));
    }

    resetForm();
  }

  function editShiftLayer(layer: ShiftLayer) {
    setForm(layer);
    setEditingId(layer.id);
    setError("");
  }

  function deleteShiftLayer(id: string) {
    setError("");

    const isUsed = data.employments.some(
      (employment) => employment.shiftLayerId === id
    );

    if (isUsed) {
      setError("Vagtlaget kan ikke slettes, fordi det bruges i en ansættelse.");
      return;
    }

    setData((prev) => ({
      ...prev,
      shiftLayers: prev.shiftLayers.filter((layer) => layer.id !== id),
    }));

    if (editingId === id) resetForm();
  }

  return (
    <section className="card">
      <div className="page-header">
        <div>
          <h1>Vagtlag</h1>
          <p>Opret, rediger og slet vagtlag.</p>
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
            placeholder="Fx Forvagt"
          />
        </div>
      </div>

      <div className="actions">
        <button className="btn primary" onClick={saveShiftLayer}>
          {editingId ? "Gem ændringer" : "Tilføj vagtlag"}
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
          {data.shiftLayers.map((layer) => (
            <tr key={layer.id}>
              <td>{layer.name}</td>
              <td>
                <div className="actions">
                  <button className="btn" onClick={() => editShiftLayer(layer)}>
                    Rediger
                  </button>
                  <button
                    className="btn danger"
                    onClick={() => deleteShiftLayer(layer.id)}
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