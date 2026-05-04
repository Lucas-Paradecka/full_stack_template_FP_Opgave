import { useState } from "react";
import { Sidebar } from "../components/Sidebar";
import { initialData } from "../data/initialData";
import { DepartmentsPage } from "../pages/DepartmentsPage";
import { EmploymentsPage } from "../pages/EmploymentsPage";
import { PeriodsPage } from "../pages/PeriodsPage";
import { PersonnelPage } from "../pages/PersonnelPage";
import { ShiftLayersPage } from "../pages/ShiftLayersPage";
import { StaffGroupsPage } from "../pages/StaffGroupsPage";
import { UsersPage } from "../pages/UsersPage";
import type { AppData } from "../types/domain";

export function meta() {
  return [
    { title: "Fairplan Demo" },
    { name: "description", content: "Fairplan frontend MVP" },
  ];
}

export default function Home() {
  const [data, setData] = useState<AppData>(initialData);
  const [activePage, setActivePage] = useState("adgangsstyring");

  function resetDemoData() {
    const shouldReset = window.confirm(
      "Vil du nulstille demo-data? Alle ændringer i denne session bliver fjernet."
    );

    if (!shouldReset) return;

    setData(initialData);
  }

  function renderPage() {
    switch (activePage) {
      case "perioder":
        return <PeriodsPage />;

      case "adgangsstyring":
        return <UsersPage data={data} setData={setData} />;

      case "afsnit":
        return <DepartmentsPage data={data} setData={setData} />;

      case "personalegrupper":
        return <StaffGroupsPage data={data} setData={setData} />;

      case "vagtlag":
        return <ShiftLayersPage data={data} setData={setData} />;

      case "ansaettelser":
        return <EmploymentsPage data={data} setData={setData} />;

      case "personale":
        return <PersonnelPage data={data} />;

      default:
        return <UsersPage data={data} setData={setData} />;
    }
  }

  return (
    <div className="app-shell">
      <Sidebar activePage={activePage} onPageChange={setActivePage} />

      <main className="content">
        <div className="topbar">
          <button className="btn" onClick={resetDemoData}>
            Nulstil demo-data
          </button>
        </div>

        {renderPage()}
      </main>
    </div>
  );
}