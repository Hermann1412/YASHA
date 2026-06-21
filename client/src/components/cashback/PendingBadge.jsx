import Badge from '../ui/Badge'

const statusMap = {
  pending: { color: 'yellow', label: 'Pending' },
  confirmed: { color: 'green', label: 'Confirmed' },
  paid: { color: 'gold', label: 'Paid' },
  rejected: { color: 'red', label: 'Rejected' },
}

export default function PendingBadge({ status }) {
  const { color, label } = statusMap[status] ?? { color: 'gray', label: status }
  return <Badge color={color}>{label}</Badge>
}
