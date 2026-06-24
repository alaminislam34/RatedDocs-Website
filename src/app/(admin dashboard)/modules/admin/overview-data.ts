// ─── Types ──────────────────────────────────────────────────────────────────

export interface StatCard {
  id: string;
  label: string;
  value: string;
  trend: string;
  trendUp: boolean;
  comparison: string;
  iconColor: string;
  iconBg: string;
  icon: "stethoscope" | "users" | "calendar" | "dollar";
}

export interface ChartPoint {
  date: string;
  bookings: number;
  revenue: number;
}

export interface QueueDoctor {
  id: string;
  initials: string;
  avatarBg: string;
  name: string;
  specialty: string;
  timeAgo: string;
  phases: string[];
}

export interface TopDentist {
  id: string;
  initials: string;
  avatarBg: string;
  name: string;
  specialty: string;
  location: string;
  bookings: number;
}

export interface ActivityItem {
  id: string;
  type: "verified" | "signup" | "flagged" | "payout" | "failed";
  title: string;
  description: string;
  timeAgo: string;
}

// ─── Stats ───────────────────────────────────────────────────────────────────

export const statCards: StatCard[] = [
  {
    id: "active-dentists",
    label: "Active dentists",
    value: "1,284",
    trend: "+8.2%",
    trendUp: true,
    comparison: "vs last week",
    icon: "stethoscope",
    iconBg: "bg-sky-50",
    iconColor: "text-sky-500",
  },
  {
    id: "total-patients",
    label: "Total patients",
    value: "28,491",
    trend: "+12.5%",
    trendUp: true,
    comparison: "vs last week",
    icon: "users",
    iconBg: "bg-emerald-50",
    iconColor: "text-emerald-500",
  },
  {
    id: "bookings-today",
    label: "Bookings today",
    value: "312",
    trend: "-2.1%",
    trendUp: false,
    comparison: "vs yesterday",
    icon: "calendar",
    iconBg: "bg-orange-50",
    iconColor: "text-orange-500",
  },
  {
    id: "revenue-mtd",
    label: "Revenue (MTD)",
    value: "$184,210",
    trend: "+18.4%",
    trendUp: true,
    comparison: "vs last month",
    icon: "dollar",
    iconBg: "bg-amber-50",
    iconColor: "text-amber-500",
  },
];

// ─── Chart ───────────────────────────────────────────────────────────────────

export const chartData: ChartPoint[] = [
  { date: "Apr 16", bookings: 215, revenue: 22000 },
  { date: "Apr 17", bookings: 238, revenue: 24000 },
  { date: "Apr 18", bookings: 262, revenue: 26500 },
  { date: "Apr 19", bookings: 244, revenue: 25000 },
  { date: "Apr 20", bookings: 282, revenue: 28500 },
  { date: "Apr 21", bookings: 308, revenue: 31000 },
  { date: "Apr 22", bookings: 335, revenue: 33500 },
  { date: "Apr 23", bookings: 318, revenue: 32000 },
  { date: "Apr 24", bookings: 358, revenue: 36000 },
  { date: "Apr 25", bookings: 382, revenue: 38500 },
  { date: "Apr 26", bookings: 402, revenue: 41000 },
  { date: "Apr 27", bookings: 424, revenue: 43500 },
  { date: "Apr 28", bookings: 412, revenue: 44000 },
  { date: "Apr 29", bookings: 435, revenue: 46000 },
];

export const verificationQueue: QueueDoctor[] = [
  {
    id: "1",
    initials: "DA",
    avatarBg: "bg-indigo-500",
    name: "Dr. Amelia Garcia",
    specialty: "Pediatric",
    timeAgo: "2h ago",
    phases: ["Ph.1", "Ph.2", "Ph.3"],
  },
  {
    id: "2",
    initials: "DS",
    avatarBg: "bg-teal-600",
    name: "Dr. Sara Chen",
    specialty: "General",
    timeAgo: "5h ago",
    phases: ["Ph.1", "Ph.2", "Ph.3"],
  },
  {
    id: "3",
    initials: "DR",
    avatarBg: "bg-violet-600",
    name: "Dr. Ravi Verma",
    specialty: "Endodontics",
    timeAgo: "1d ago",
    phases: ["Ph.1", "Ph.2", "Ph.3"],
  },
  {
    id: "4",
    initials: "DN",
    avatarBg: "bg-cyan-600",
    name: "Dr. Nadia Saleh",
    specialty: "Orthodontics",
    timeAgo: "3d ago",
    phases: ["Ph.1", "Ph.2", "Ph.3"],
  },
];

export const verificationQueueTotal = 6;

// ─── Top Dentists ─────────────────────────────────────────────────────────────

export const topDentists: TopDentist[] = [
  {
    id: "1",
    initials: "LO",
    avatarBg: "bg-slate-700",
    name: "Dr. Liam O'Connor",
    specialty: "Oral Surgery",
    location: "Chicago, IL",
    bookings: 402,
  },
  {
    id: "2",
    initials: "MP",
    avatarBg: "bg-[#1E3A5F]",
    name: "Dr. Maya Patel",
    specialty: "Orthodontics",
    location: "San Francisco",
    bookings: 312,
  },
  {
    id: "3",
    initials: "BL",
    avatarBg: "bg-[#0D2B3E]",
    name: "Dr. Brian Lee",
    specialty: "Endodontics",
    location: "New York",
    bookings: 268,
  },
  {
    id: "4",
    initials: "NK",
    avatarBg: "bg-slate-600",
    name: "Dr. Noah Kim",
    specialty: "Cosmetic",
    location: "Seattle",
    bookings: 198,
  },
  {
    id: "5",
    initials: "PS",
    avatarBg: "bg-emerald-700",
    name: "Dr. Priya Shah",
    specialty: "General",
    location: "Houston, TX",
    bookings: 175,
  },
  {
    id: "6",
    initials: "JW",
    avatarBg: "bg-rose-700",
    name: "Dr. James Wong",
    specialty: "Implants",
    location: "Los Angeles",
    bookings: 154,
  },
];

// ─── Recent Activity ──────────────────────────────────────────────────────────

export const recentActivity: ActivityItem[] = [
  {
    id: "1",
    type: "verified",
    title: "Dr. Maya Patel verified",
    description: "Approved by Jordan Smith",
    timeAgo: "2m",
  },
  {
    id: "2",
    type: "signup",
    title: "5 new patient signups",
    description: "From SF, NYC and Austin",
    timeAgo: "18m",
  },
  {
    id: "3",
    type: "flagged",
    title: "Review flagged for moderation",
    description: "RV-503 · Dr. Priya Shah",
    timeAgo: "1h",
  },
  {
    id: "4",
    type: "payout",
    title: "Payout processed",
    description: "$2,480 → Dr. Brian Lee",
    timeAgo: "3h",
  },
  {
    id: "5",
    type: "failed",
    title: "Payment failed",
    description: "TXN-9006 · Mia Thompson",
    timeAgo: "4h",
  },
];
