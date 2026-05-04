import type { Employment, User } from "../types/domain";

export function isEmailUnique(
  email: string,
  users: User[],
  currentUserId?: string
): boolean {
  return !users.some(
    (user) =>
      user.email.toLowerCase() === email.toLowerCase() &&
      user.id !== currentUserId
  );
}

export function isEndDateAfterStartDate(
  startDate: string,
  endDate: string
): boolean {
  return new Date(endDate) > new Date(startDate);
}

export function isValidWeeklyHours(hours: number): boolean {
  return Number.isInteger(hours) && hours >= 0 && hours <= 37;
}

export function hasOverlappingEmployment(
  employment: Employment,
  existingEmployments: Employment[]
): boolean {
  return existingEmployments.some((existing) => {
    if (existing.id === employment.id) return false;
    if (existing.userId !== employment.userId) return false;

    const newStart = new Date(employment.startDate);
    const newEnd = new Date(employment.endDate);
    const existingStart = new Date(existing.startDate);
    const existingEnd = new Date(existing.endDate);

    return newStart < existingEnd && newEnd > existingStart;
  });
}

export function isEmploymentActiveInPeriod(
  employment: Employment,
  periodStart: string,
  periodEnd: string
): boolean {
  const employmentStart = new Date(employment.startDate);
  const employmentEnd = new Date(employment.endDate);
  const selectedStart = new Date(periodStart);
  const selectedEnd = new Date(periodEnd);

  return employmentStart <= selectedEnd && employmentEnd >= selectedStart;
}