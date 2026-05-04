export type User = {
    id: string;
    name: string;
    email: string;
    isAdmin: boolean;
    isStaff: boolean;
};

export type Department = {
    id: string;
    name: string;
    color: string;
};

export type StaffGroup = {
    id: string;
    name: string;
};

export type ShiftLayer = {
    id: string;
    name: string;
};

export type Employment = {
    id: string;
    userId: string;
    departmentId: string;
    staffGroupId: string;
    shiftLayerId: string;
    weeklyHours: number;
    startDate: string;
    endDate: string;
};

export type AppData = {
    users: User[];
    departments: Department[];
    staffGroups: StaffGroup[];
    shiftLayers: ShiftLayer[];
    employments: Employment[];
};