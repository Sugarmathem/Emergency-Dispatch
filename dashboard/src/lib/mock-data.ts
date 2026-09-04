// ─────────────────────────────────────────────────────────────────────────────
// Pulse Response — ER:LC mock data
// Deterministic seed data so every render is identical. Replace with live
// queries (prisma + ERLC API) once wired; types match the Prisma schema where
// applicable.
// ─────────────────────────────────────────────────────────────────────────────

export type UnitStatus =
  | "10-8"
  | "10-6"
  | "10-7"
  | "10-11"
  | "10-97"
  | "10-23"
  | "10-5";

export type CallStatus = "ACTIVE" | "PENDING" | "CLOSED";
export type CallPriority = 1 | 2 | 3;
export type PcrStatus = "PENDING" | "APPROVED" | "REJECTED";
export type WarrantStatus = "ACTIVE" | "EXECUTED" | "EXPIRED";
export type ActivityKind =
  | "PCR_SUBMITTED"
  | "PCR_APPROVED"
  | "PCR_REJECTED"
  | "WARRANT_FILED"
  | "WARRANT_EXECUTED"
  | "UNIT_10-8"
  | "UNIT_STATUS"
  | "PROMOTION"
  | "MEMBER_JOINED";

export interface Unit {
  id: string;
  callsign: string;
  officer: string;
  agency:
    | "RCPD"
    | "LCSO"
    | "GSP"
    | "STPD"
    | "RFD"
    | "LCEMS"
    | "DOT"
    | "FIRE"
    | "CIV";
  vehicle: string;
  status: UnitStatus;
  detail?: string;
  postal: string;
  updated: string; // relative, e.g. "2m"
  beep: boolean;
}

export interface Call {
  id: string;
  number: number;
  time: string;
  status: CallStatus;
  priority: CallPriority;
  type: string;
  location: string;
  postal: string;
  caller: string;
  narrative: string;
  assigned: string[];
}

export interface Pcr {
  id: string;
  number: number;
  callsign: string;
  officer: string;
  callType: string;
  disposition: string;
  commandTeam?: string;
  status: PcrStatus;
  reviewedBy?: string;
  words: number;
  createdAt: string;
}

export interface Warrant {
  id: string;
  number: number;
  targetName: string;
  targetId: string;
  type: string;
  reason: string;
  status: WarrantStatus;
  filedBy: string;
  expires: string;
  createdAt: string;
}

export interface Member {
  id: string;
  name: string;
  discordId: string;
  robloxUsername: string;
  rank: string;
  callsign?: string;
  division: string;
  callsToday: number;
  hours: number;
  lastSeen: string;
}

export interface ActivityItem {
  id: string;
  kind: ActivityKind;
  actor: string;
  detail: string;
  time: string;
}

// ── Units ────────────────────────────────────────────────────────────────────

export const units: Unit[] = [
  { id: "u01", callsign: "1-PAUL-1", officer: "K. Marrow",  agency: "RCPD", vehicle: "2023 Charger",      status: "10-8",  detail: "Traffic stop, Main St",        postal: "2491", updated: "0m",  beep: true },
  { id: "u02", callsign: "1-PAUL-2", officer: "D. Voss",    agency: "RCPD", vehicle: "2021 Explorer",     status: "10-97", detail: "On scene, 911-C0042",          postal: "2210", updated: "4m",  beep: true },
  { id: "u03", callsign: "1-ADAM-3", officer: "R. Okafor",  agency: "RCPD", vehicle: "2023 Interceptor",  status: "10-6",  detail: "1-PAUL-2",                     postal: "2210", updated: "4m",  beep: false },
  { id: "u04", callsign: "1-DAVID-1", officer: "S. Ibarra", agency: "LCSO", vehicle: "2022 F-150",        status: "10-8",  detail: "Patrol, Great Rd",             postal: "2279", updated: "1m",  beep: false },
  { id: "u05", callsign: "2-DAVID-2", officer: "T. Nguyen", agency: "LCSO", vehicle: "2021 Tahoe",        status: "10-7",  detail: "Out of service",               postal: "2352", updated: "12m", beep: false },
  { id: "u06", callsign: "2-CHARLIE-1", officer: "L. Petrov", agency: "GSP", vehicle: "2024 Charger",     status: "10-11", detail: "Traffic detail, I-980 N",      postal: "2297", updated: "9m",  beep: false },
  { id: "u07", callsign: "2-FRANK-2", officer: "J. Whitlock", agency: "STPD", vehicle: "2022 Silverado",   status: "10-8",  detail: "Area check, Great Crossing",   postal: "2353", updated: "2m",  beep: false },
  { id: "u08", callsign: "FD-3",      officer: "M. Castellanos", agency: "RFD", vehicle: "Engine 3",      status: "10-8",  detail: "Available, Sta. 2",            postal: "2262", updated: "6m",  beep: false },
  { id: "u09", callsign: "FD-1",      officer: "P. Adeyemi", agency: "RFD", vehicle: "Engine 1",         status: "10-97", detail: "On scene, 911-C0040",          postal: "2238", updated: "11m", beep: true },
  { id: "u10", callsign: "FD-RES2",   officer: "A. Lindqvist", agency: "RFD", vehicle: "Rescue 2",       status: "10-23", detail: "Mechanical",                   postal: "2262", updated: "18m", beep: false },
  { id: "u11", callsign: "M-4",       officer: "R. Duval",   agency: "LCEMS", vehicle: "Ambulance 4",    status: "10-6",  detail: "1-PAUL-2",                     postal: "2210", updated: "4m",  beep: true },
  { id: "u12", callsign: "M-1",       officer: "H. Sorensen", agency: "LCEMS", vehicle: "Ambulance 1",   status: "10-8",  detail: "Available, RC Med",            postal: "2287", updated: "3m",  beep: false },
  { id: "u13", callsign: "M-7",       officer: "C. Beaumont", agency: "LCEMS", vehicle: "Ambulance 7",   status: "10-5",  detail: "Meal, Brick & Barrel",         postal: "2493", updated: "22m", beep: false },
  { id: "u14", callsign: "DOT-2",     officer: "E. Graves",  agency: "DOT", vehicle: "Bucket Truck",      status: "10-8",  detail: "Signal fault, I-980 Exit 4",   postal: "2302", updated: "15m", beep: false },
  { id: "u15", callsign: "2-EDWARD-4", officer: "N. Cabrera", agency: "LCSO", vehicle: "2020 Explorer",   status: "10-8",  detail: "Patrol, High Rock",            postal: "2498", updated: "5m",  beep: false },
  { id: "u16", callsign: "1-CHARLES-2", officer: "F. Okonkwo", agency: "RCPD", vehicle: "2023 Malibu",    status: "10-8",  detail: "Patrol, Chinatown",            postal: "2492", updated: "7m",  beep: false },
];

export const unitCounts = {
  total: units.length,
  available: units.filter((u) => u.status === "10-8").length,
  onScene: units.filter((u) => u.status === "10-97" || u.status === "10-23").length,
  oos: units.filter((u) => u.status === "10-7" || u.status === "10-11" || u.status === "10-5").length,
};

// ── 911 calls ────────────────────────────────────────────────────────────────

export const calls: Call[] = [
  {
    id: "c0042", number: 42, time: "21:14:07", status: "ACTIVE", priority: 2,
    type: "WEAPON COMPLAINT",
    location: "Great Rd, Great Crossing", postal: "2279",
    caller: "ANON",
    narrative: "Caller reports two males exchanging a handgun near the parking lot behind the gas station. One wearing gray hoodie, last seen on foot toward the laundromat.",
    assigned: ["1-DAVID-1", "2-FRANK-2", "M-4"],
  },
  {
    id: "c0041", number: 41, time: "21:11:52", status: "ACTIVE", priority: 3,
    type: "TRAFFIC STOP",
    location: "Main St @ 3rd Ave, River City", postal: "2491",
    caller: "1-PAUL-1",
    narrative: "Unit-initiated. Dark motorcycle, no plate illumination, speed 38 in a 25. Registration via dispatch pending.",
    assigned: ["1-PAUL-1"],
  },
  {
    id: "c0040", number: 40, time: "21:06:31", status: "ACTIVE", priority: 1,
    type: "STRUCTURE FIRE",
    location: "Ashwood Ln, River City", postal: "2238",
    caller: "MULTIPLE",
    narrative: "Working fire, single-story residence, heavy smoke from A-side. Two occupants confirmed out. Utilities ID'd, gas secured. Second alarm not requested at this time.",
    assigned: ["FD-1", "FD-3", "M-1", "1-CHARLES-2"],
  },
  {
    id: "c0039", number: 39, time: "21:02:44", status: "PENDING", priority: 3,
    type: "NOISE COMPLAINT",
    location: "Vulture Cliffs, Great Crossing", postal: "2353",
    caller: "ANON",
    narrative: "Loud music from single residence, ongoing ~40 min. Third complaint this evening for same address.",
    assigned: [],
  },
  {
    id: "c0038", number: 38, time: "20:58:19", status: "CLOSED", priority: 2,
    type: "MVC WITH INJURIES",
    location: "I-980 N @ Exit 4, River City", postal: "2302",
    caller: "DOT-2",
    narrative: "Two-vehicle, T-bone, left lane blocked. Fire on scene for fluid control. Two refusals, one transport priority 2. Roadway cleared, DOT handling signal fault.",
    assigned: ["M-4", "FD-3", "DOT-2"],
  },
  {
    id: "c0037", number: 37, time: "20:51:03", status: "CLOSED", priority: 3,
    type: "WELFARE CHECK",
    location: "Riverside, River City", postal: "2210",
    caller: "PHONE",
    narrative: "Out-of-state relative unable to reach mother since morning. Unit made contact, all clear, no services required.",
    assigned: ["1-ADAM-3"],
  },
  {
    id: "c0036", number: 36, time: "20:47:38", status: "CLOSED", priority: 2,
    type: "RECKLESS DRIVER",
    location: "I-980 N, County Line", postal: "2297",
    caller: "ANON",
    narrative: "Black sports bike, wheelies, speeds estimated 90+. Units checked area — negative contact.",
    assigned: ["2-CHARLIE-1"],
  },
];

export const callCounts = {
  active: calls.filter((c) => c.status === "ACTIVE").length,
  pending: calls.filter((c) => c.status === "PENDING").length,
  closed: calls.filter((c) => c.status === "CLOSED").length,
};

// ── PCRs (patrol check reports) ──────────────────────────────────────────────

export const pcrs: Pcr[] = [
  { id: "p001", number: 487, callsign: "1-PAUL-1", officer: "K. Marrow",   callType: "TRAFFIC STOP",      disposition: "Citation, released",         commandTeam: "COMMAND-1", status: "PENDING",  words: 214, createdAt: "21:15" },
  { id: "p002", number: 486, callsign: "1-PAUL-2", officer: "D. Voss",     callType: "WEAPON COMPLAINT",  disposition: "Pending",                    status: "PENDING",         words: 96,  createdAt: "21:20" },
  { id: "p003", number: 485, callsign: "M-4",      officer: "R. Duval",    callType: "MVC W/ INJURIES",   disposition: "1 transport",                commandTeam: "COMMAND-2",  status: "PENDING",  words: 141, createdAt: "21:04" },
  { id: "p004", number: 484, callsign: "FD-1",     officer: "P. Adeyemi",  callType: "STRUCTURE FIRE",    disposition: "Fire knocked, overhaul",     status: "APPROVED", reviewedBy: "CPT. ELLIS", words: 402, createdAt: "20:31" },
  { id: "p005", number: 483, callsign: "1-ADAM-3", officer: "R. Okafor",   callType: "WELFARE CHECK",     disposition: "All clear",                  status: "APPROVED", reviewedBy: "CPT. ELLIS", words: 118, createdAt: "20:59" },
  { id: "p006", number: 482, callsign: "2-CHARLIE-1", officer: "L. Petrov", callType: "RECKLESS DRIVER",  disposition: "Negative contact",           status: "APPROVED", reviewedBy: "SGT. HAYES", words: 87,  createdAt: "20:58" },
  { id: "p007", number: 481, callsign: "1-CHARLES-2", officer: "F. Okonkwo", callType: "ASSIST MOTORIST", disposition: "Assisted, cleared",         status: "APPROVED", reviewedBy: "SGT. HAYES", words: 102, createdAt: "20:12" },
  { id: "p008", number: 480, callsign: "FD-RES2",  officer: "A. Lindqvist", callType: "ALARM DROP",       disposition: "Faulty panel",              status: "REJECTED", reviewedBy: "CPT. ELLIS", words: 31,  createdAt: "19:47" },
];

export const pcrCounts = {
  pending: pcrs.filter((p) => p.status === "PENDING").length,
  approved: pcrs.filter((p) => p.status === "APPROVED").length,
  rejected: pcrs.filter((p) => p.status === "REJECTED").length,
};

// ── Warrants ─────────────────────────────────────────────────────────────────

export const warrants: Warrant[] = [
  { id: "w001", number: 129, targetName: "xX_Dr1ftKing_Xx",  targetId: "48213907", type: "FELONY EVASION",      reason: "Failed to yield after visible siren, I-980, 20:47",             status: "ACTIVE",   filedBy: "2-CHARLIE-1", expires: "72h",  createdAt: "20:52" },
  { id: "w002", number: 128, targetName: "nott_jaylen",       targetId: "37194052", type: "RECKLESS ENDANGERMENT", reason: "Discharged firearm into occupied structure, Ashwood Ln",       status: "ACTIVE",   filedBy: "1-PAUL-2",    expires: "30d",  createdAt: "21:09" },
  { id: "w003", number: 127, targetName: "GhostPlates99",     targetId: "55601188", type: "FRAUD",               reason: "Vehicle registration altered, multiple stops",                  status: "ACTIVE",   filedBy: "2-EDWARD-4",  expires: "14d",  createdAt: "19:40" },
  { id: "w004", number: 126, targetName: "LilBankRoll",       targetId: "60221844", type: "ROBBERY",             reason: "Strong-arm robbery, Brick & Barrel parking lot",                status: "EXECUTED", filedBy: "1-PAUL-1",    expires: "—",    createdAt: "18:22" },
  { id: "w005", number: 125, targetName: "mason.builds",      targetId: "44710863", type: "TRESPASSING",         reason: "Refused leave after warning, DOT staging yard",                 status: "EXPIRED",  filedBy: "DOT-2",       expires: "—",    createdAt: "17:55" },
  { id: "w006", number: 124, targetName: "VQ_Carl",           targetId: "39227740", type: "JOYRIDE",             reason: "Took vehicle without consent, returned damaged",                status: "EXECUTED", filedBy: "2-DAVID-2",   expires: "—",    createdAt: "16:03" },
  { id: "w007", number: 123, targetName: "TysOnDaMic",        targetId: "51889926", type: "DISORDERLY CONDUCT",  reason: "Incited crowd during traffic stop, Main St",                    status: "ACTIVE",   filedBy: "1-ADAM-3",    expires: "48h",  createdAt: "20:11" },
];

export const warrantCounts = {
  active: warrants.filter((w) => w.status === "ACTIVE").length,
  executed: warrants.filter((w) => w.status === "EXECUTED").length,
  expired: warrants.filter((w) => w.status === "EXPIRED").length,
};

// ── Members ──────────────────────────────────────────────────────────────────

export const members: Member[] = [
  { id: "m01", name: "K. Marrow",     discordId: "marrow_actual",   robloxUsername: "MarrowK",       rank: "Sergeant",        callsign: "1-PAUL-1",   division: "RCPD Patrol",      callsToday: 14, hours: 212.5, lastSeen: "10-8, on air" },
  { id: "m02", name: "D. Voss",       discordId: "voss.d",          robloxUsername: "DVoss_RCPD",    rank: "Officer",         callsign: "1-PAUL-2",   division: "RCPD Patrol",      callsToday: 11, hours: 96.0,  lastSeen: "10-97, 911-C0042" },
  { id: "m03", name: "R. Okafor",     discordId: "okaforr",         robloxUsername: "ROkafor",       rank: "Officer",         callsign: "1-ADAM-3",   division: "RCPD Patrol",      callsToday: 9,  hours: 88.5,  lastSeen: "10-6, backing" },
  { id: "m04", name: "S. Ibarra",     discordId: "ibarra_s",        robloxUsername: "IbarraLSO",     rank: "Corporal",        callsign: "1-DAVID-1",  division: "LCSO County",      callsToday: 12, hours: 145.0, lastSeen: "10-8, on air" },
  { id: "m05", name: "T. Nguyen",     discordId: "tnguyen_dev",     robloxUsername: "TNguyenLSO",    rank: "Officer",         callsign: "2-DAVID-2",  division: "LCSO County",      callsToday: 3,  hours: 51.5,  lastSeen: "10-7, 12m ago" },
  { id: "m06", name: "L. Petrov",     discordId: "petrov.l",        robloxUsername: "LPetrovGSP",    rank: "Trooper",         callsign: "2-CHARLIE-1", division: "GSP Interstate",  callsToday: 8,  hours: 132.0, lastSeen: "10-11, traffic" },
  { id: "m07", name: "P. Adeyemi",    discordId: "adeyemi.p",       robloxUsername: "PAdeyemiRFD",   rank: "Captain",         callsign: "FD-1",       division: "RFD Suppression",  callsToday: 5,  hours: 310.0, lastSeen: "10-97, 911-C0040" },
  { id: "m08", name: "M. Castellanos",discordId: "cast.fire",       robloxUsername: "MCastRFD",      rank: "Engineer",        callsign: "FD-3",       division: "RFD Suppression",  callsToday: 5,  hours: 178.5, lastSeen: "10-8, on air" },
  { id: "m09", name: "R. Duval",      discordId: "duval_r",         robloxUsername: "RDuvalEMS",     rank: "Paramedic",       callsign: "M-4",        division: "LCEMS Transport",  callsToday: 7,  hours: 124.0, lastSeen: "10-6, 1-PAUL-2" },
  { id: "m10", name: "H. Sorensen",   discordId: "sorensh",         robloxUsername: "HSorenEMS",     rank: "EMT-B",           callsign: "M-1",        division: "LCEMS Transport",  callsToday: 4,  hours: 44.5,  lastSeen: "10-8, on air" },
  { id: "m11", name: "E. Graves",     discordId: "graves.e",        robloxUsername: "EGravesDOT",    rank: "Tech II",         callsign: "DOT-2",      division: "DOT Highway Ops",  callsToday: 2,  hours: 67.0,  lastSeen: "10-8, signal fault" },
  { id: "m12", name: "F. Okonkwo",    discordId: "okonkwo.f",       robloxUsername: "FOkonkwoRCPD",  rank: "Officer",         callsign: "1-CHARLES-2", division: "RCPD Patrol",     callsToday: 6,  hours: 73.5,  lastSeen: "10-8, on air" },
  { id: "m13", name: "N. Cabrera",    discordId: "ncabrera",        robloxUsername: "NCabreraLSO",   rank: "Deputy",          callsign: "2-EDWARD-4", division: "LCSO County",      callsToday: 10, hours: 89.0,  lastSeen: "10-8, on air" },
  { id: "m14", name: "A. Lindqvist",  discordId: "lindq.a",         robloxUsername: "ALindRFD",      rank: "Firefighter",     callsign: "FD-RES2",    division: "RFD Rescue",       callsToday: 1,  hours: 29.0,  lastSeen: "10-23, 18m ago" },
];

export const memberCounts = {
  total: members.length,
  onDuty: members.filter((m) => m.lastSeen.includes("10-8") || m.lastSeen.includes("10-97") || m.lastSeen.includes("10-6") || m.lastSeen.includes("10-11")).length,
};

// ── Activity feed ────────────────────────────────────────────────────────────

export const activity: ActivityItem[] = [
  { id: "a01", kind: "PCR_SUBMITTED",   actor: "1-PAUL-1",    detail: "PCR #487 filed — traffic stop, citation",            time: "21:15:31" },
  { id: "a02", kind: "WARRANT_FILED",   actor: "1-PAUL-2",    detail: "Warrant #128 — nott_jaylen, reckless endangerment",   time: "21:09:44" },
  { id: "a03", kind: "PCR_SUBMITTED",   actor: "M-4",         detail: "PCR #485 filed — MVC transport",                      time: "21:04:10" },
  { id: "a04", kind: "PCR_APPROVED",    actor: "CPT. ELLIS",  detail: "Approved PCR #484 — FD-1 structure fire",             time: "20:44:57" },
  { id: "a05", kind: "UNIT_STATUS",     actor: "FD-RES2",     detail: "Status 10-23 — mechanical, out at Sta. 2",            time: "20:39:02" },
  { id: "a06", kind: "WARRANT_EXECUTED",actor: "1-PAUL-1",    detail: "Warrant #126 executed — LilBankRoll in custody",      time: "20:31:19" },
  { id: "a07", kind: "UNIT_10-8",       actor: "1-CHARLES-2", detail: "Went 10-8 — patrol, Chinatown beat",                  time: "20:26:40" },
  { id: "a08", kind: "PROMOTION",       actor: "CHIEF LANG",  detail: "S. Ibarra promoted to Corporal — LCSO",               time: "20:02:15" },
  { id: "a09", kind: "MEMBER_JOINED",   actor: "H. Sorensen", detail: "Transferred in — LCEMS Transport",                    time: "19:48:33" },
  { id: "a10", kind: "PCR_REJECTED", actor: "CPT. ELLIS", detail: "Rejected PCR #480 — FD-RES2, insufficient narrative", time: "19:52:08" },
];
