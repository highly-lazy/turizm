import { groupColor } from './utils';

export const groupById = (state, id) => state.groups.find((g) => g.id === id) ?? { id, name: '?', members: [] };
export const groupIndex = (state, id) => state.groups.findIndex((g) => g.id === id);
export const colorOfGroup = (state, id) => groupColor(groupIndex(state, id));
export const groupOfStudent = (state, name) => state.groups.find((g) => g.members.includes(name)) ?? null;
export const presentStudents = (state) => state.roster.filter((s) => s.present).map((s) => s.name);
export const absentStudents = (state) => state.roster.filter((s) => !s.present).map((s) => s.name);
