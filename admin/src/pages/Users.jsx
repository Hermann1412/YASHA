import { useEffect, useState } from 'react'
import axios from 'axios'

const API = import.meta.env.VITE_API_URL ?? 'http://localhost:4000'

export default function Users() {
  const [users, setUsers] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const t = setTimeout(() => fetch(), 300)
    return () => clearTimeout(t)
  }, [search])

  async function fetch() {
    setLoading(true)
    const { data } = await axios.get(`${API}/admin/users`, { params: { search } }).catch(() => ({ data: { users: [] } }))
    setUsers(data.users ?? [])
    setLoading(false)
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Users</h1>

      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search by email..."
        className="w-full max-w-sm bg-yasha-card border border-yasha-border rounded-lg px-4 py-2 text-sm text-white mb-6 focus:border-gold outline-none"
      />

      <div className="card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="border-b border-yasha-border">
            <tr className="text-gray-400 text-left">
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3">Joined</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={4} className="px-4 py-8 text-center text-gray-500">Loading...</td></tr>
            ) : users.length === 0 ? (
              <tr><td colSpan={4} className="px-4 py-8 text-center text-gray-500">No users found</td></tr>
            ) : users.map((u) => (
              <tr key={u.id} className="border-b border-yasha-border last:border-0 hover:bg-white/5">
                <td className="px-4 py-3">{u.email}</td>
                <td className="px-4 py-3 text-gray-400">{u.name ?? '—'}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${u.role === 'admin' ? 'bg-gold/10 text-gold' : 'bg-gray-500/10 text-gray-400'}`}>
                    {u.role}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-400 text-xs">
                  {new Date(u.created_at).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
