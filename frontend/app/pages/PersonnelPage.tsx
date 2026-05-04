import { useMemo, useState } from "react";
import type { AppData } from "../types/domain";
import { isEmploymentActiveInPeriod } from "../utils/validation";

type Props = {
  data: AppData;
};

type SortKey = "name" | "department" | "staffGroup" | "shiftLayer" | "weeklyHours";

export function PersonnelPage({ data }: Props) {
  const [periodStart, setPeriodStart] = useState("2026-05-01");
  const [periodEnd, setPeriodEnd] = useState("2026-08-31");
  const [search, setSearch] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("");
  const [staffGroupFilter, setStaffGroupFilter] = useState("");
  const [shiftLayerFilter, setShiftLayerFilter] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("name");

  const rows = useMemo(() => {
    return data.employments
      .filter((employment) =>
        isEmploymentActiveInPeriod(employment, periodStart, periodEnd)
      )
      .map((employment) => {
        const user = data.users.find((u) => u.id === employment.userId);
        const department = data.departments.find(
          (d) => d.id === employment.departmentId
        );
        const staffGroup = data.staffGroups.find(
          (g) => g.id === employment.staffGroupId
        );
        const shiftLayer = data.shiftLayers.find(
          (s) => s.id === employment.shiftLayerId
        );

        return {
          id: employment.id,
          name: user?.name ?? "Ukendt",
          department: department?.name ?? "Ukendt",
          staffGroup: staffGroup?.name ?? "Ukendt",
          shiftLayer: shiftLayer?.name ?? "Ukendt",
          weeklyHours: employment.weeklyHours,
          startDate: employment.startDate,
          endDate: employment.endDate,
        };
      })
      .filter((row) =>
        row.name.toLowerCase().includes(search.toLowerCase().trim())
      )
      .filter((row) =>
        departmentFilter ? row.department === departmentFilter : true
      )
      .filter((row) =>
        staffGroupFilter ? row.staffGroup === staffGroupFilter : true
      )
      .filter((row) =>
        shiftLayerFilter ? row.shiftLayer === shiftLayerFilter : true
      )
      .sort((a, b) => {
        if (sortKey === "weeklyHours") {
          return b.weeklyHours - a.weeklyHours;
        }

        return String(a[sortKey]).localeCompare(String(b[sortKey]));
      });
  }, [
    data,
    periodStart,
    periodEnd,
    search,
    departmentFilter,
    staffGroupFilter,
    shiftLayerFilter,
    sortKey,
  ]);

  return (
    <section className="card">
      <div className="page-header">
        <div>
          <h1>Personale</h1>
          <p>
            Read-only visning baseret på aktive ansættelser i den valgte periode.
          </p>
        </div>
      </div>

      <div className="toolbar">
        <input
          type="date"
          value={periodStart}
          onChange={(event) => setPeriodStart(event.target.value)}
          title="Startdato"
        />

        <input
          type="date"
          value={periodEnd}
          onChange={(event) => setPeriodEnd(event.target.value)}
          title="Slutdato"
        />

        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Søg på navn"
        />

        <select
          value={departmentFilter}
          onChange={(event) => setDepartmentFilter(event.target.value)}
        >
          <option value="">Alle afsnit</option>
          {data.departments.map((department) => (
            <option key={department.id} value={department.name}>
              {department.name}
            </option>
          ))}
        </select>

        <select
          value={staffGroupFilter}
          onChange={(event) => setStaffGroupFilter(event.target.value)}
        >
          <option value="">Alle personalegrupper</option>
          {data.staffGroups.map((group) => (
            <option key={group.id} value={group.name}>
              {group.name}
            </option>
          ))}
        </select>

        <select
          value={shiftLayerFilter}
          onChange={(event) => setShiftLayerFilter(event.target.value)}
        >
          <option value="">Alle vagtlag</option>
          {data.shiftLayers.map((layer) => (
            <option key={layer.id} value={layer.name}>
              {layer.name}
            </option>
          ))}
        </select>

        <select
          value={sortKey}
          onChange={(event) => setSortKey(event.target.value as SortKey)}
        >
          <option value="name">Sorter: Navn</option>
          <option value="department">Sorter: Afsnit</option>
          <option value="staffGroup">Sorter: Personalegruppe</option>
          <option value="shiftLayer">Sorter: Vagtlag</option>
          <option value="weeklyHours">Sorter: Timer</option>
        </select>
      </div>

      <table className="table">
        <thead>
          <tr>
            <th>Navn</th>
            <th>Afsnit</th>
            <th>Personalegruppe</th>
            <th>Vagtlag</th>
            <th>Timer pr. uge</th>
            <th>Aktiv fra</th>
            <th>Aktiv til</th>
          </tr>
        </thead>

        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td colSpan={7}>Ingen personale fundet i den valgte periode.</td>
            </tr>
          ) : (
            rows.map((row) => (
              <tr key={row.id}>
                <td>{row.name}</td>
                <td>{row.department}</td>
                <td>{row.staffGroup}</td>
                <td>{row.shiftLayer}</td>
                <td>{row.weeklyHours}</td>
                <td>{row.startDate}</td>
                <td>{row.endDate}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </section>
  );
}