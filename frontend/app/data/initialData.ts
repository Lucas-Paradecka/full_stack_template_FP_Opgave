import type { AppData } from "../types/domain";

export const initialData: AppData = {
  users: [
    {
      id: "u1",
      name: "John Jensen",
      email: "john@john.dk",
      isAdmin: false,
      isStaff: true,
    },
    {
      id: "u2",
      name: "Anna Hansen",
      email: "anna@hospital.dk",
      isAdmin: true,
      isStaff: true,
    },
    {
      id: "u3",
      name: "Mikkel Sørensen",
      email: "mikkel@hospital.dk",
      isAdmin: true,
      isStaff: false,
    },
  ],

  departments: [
    {
      id: "d1",
      name: "Skadestue",
      color: "Rød",
    },
    {
      id: "d2",
      name: "Sengeafsnit A",
      color: "Grøn",
    },
    {
      id: "d3",
      name: "Sengeafsnit B",
      color: "Blå",
    },
  ],

  staffGroups: [
    {
      id: "sg1",
      name: "Overlæge",
    },
    {
      id: "sg2",
      name: "Afdelingslæge",
    },
    {
      id: "sg3",
      name: "Introlæge",
    },
  ],

  shiftLayers: [
    {
      id: "sl1",
      name: "Forvagt",
    },
    {
      id: "sl2",
      name: "Mellemvagt",
    },
    {
      id: "sl3",
      name: "Bagvagt",
    },
  ],

  employments: [
    {
      id: "e1",
      userId: "u1",
      departmentId: "d1",
      staffGroupId: "sg1",
      shiftLayerId: "sl3",
      weeklyHours: 37,
      startDate: "2026-05-01",
      endDate: "2026-06-30",
    },
    {
      id: "e2",
      userId: "u2",
      departmentId: "d2",
      staffGroupId: "sg2",
      shiftLayerId: "sl2",
      weeklyHours: 32,
      startDate: "2026-05-15",
      endDate: "2026-08-01",
    },
  ],
};