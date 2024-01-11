export const periods = ["Today", "This Week", "This Month"] as const; // as const will make the array immutable

export type Period = typeof periods[number]; // create Period type which is bind to periods array by index number
