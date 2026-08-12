import {
  Clock3,
  CheckCircle2,
  Trophy,
  XCircle
} from "lucide-react";

const statusData = {
  PENDING: {
    label: "Pending",
    className: "pending",
    icon: Clock3
  },

  SHORTLISTED: {
    label: "Shortlisted",
    className: "shortlisted",
    icon: CheckCircle2
  },

  SELECTED: {
    label: "Selected",
    className: "selected",
    icon: Trophy
  },

  REJECTED: {
    label: "Rejected",
    className: "rejected",
    icon: XCircle
  }
};

export default function StatusBadge({ status }) {
  const data = statusData[status];
  const Icon = data.icon;

  return (
    <span className={`status-badge ${data.className}`}>
      <Icon size={14} />
      {data.label}
    </span>
  );
}