import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { 
    Building2, Bell, Search, Users, Briefcase, GraduationCap, TrendingUp, ChevronRight 
} from 'lucide-react'
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend 
} from 'recharts'
import AdminSidebar from '../components/AdminSidebar'
import SkeletonLoader from '../components/SkeletonLoader'
import { adminApi } from '../services/api'

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

export default function AdminDashboard() {
    const { user } = useAuth()
    const navigate = useNavigate()
    const [stats, setStats] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await adminApi.getStats()
                setStats(response.data)
            } catch (error) {
                console.error("Error fetching admin stats:", error)
            } finally {
                setLoading(false)
            }
        }
        fetchStats()
    }, [])

    const placementData = stats ? [
        { name: 'Placed', value: stats.placed },
        { name: 'Seeking', value: stats.seeking }
    ] : []

    return (
        <div className="admin-layout" style={{ display: 'flex', minHeight: '100vh', background: '#f8fafc', fontFamily: "'Inter', sans-serif" }}>
            {/* Sidebar */}
            <AdminSidebar />

            {/* Main Content */}
            <main style={{ marginLeft: '260px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                
                {/* Content Header */}
                <header style={{ 
                    height: '70px', 
                    background: 'white', 
                    borderBottom: '1px solid #e2e8f0', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'space-between',
                    padding: '0 40px',
                    position: 'sticky',
                    top: 0,
                    zIndex: 10
                }}>
                    <div>
                        <h2 style={{ fontSize: '18px', fontWeight: 600, color: '#1e293b', margin: 0 }}>Administrative Overview</h2>
                    </div>
                    
                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                        <div style={{ position: 'relative' }}>
                            <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                            <input 
                                type="text" 
                                placeholder="Search analytics..." 
                                style={{ 
                                    padding: '8px 12px 8px 38px', 
                                    borderRadius: '8px', 
                                    border: '1px solid #e2e8f0', 
                                    fontSize: '14px',
                                    outline: 'none',
                                    width: '240px'
                                }}
                            />
                        </div>
                        <button style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer' }}>
                            <Bell size={20} />
                        </button>
                    </div>
                </header>

                <div style={{ padding: '32px 40px', maxWidth: '1400px' }}>
                    
                    {/* KPI Cards Row */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '24px', marginBottom: '32px' }}>
                        <StatCard 
                            title="Placed Students" 
                            value={stats?.placed} 
                            loading={loading} 
                            icon={<GraduationCap size={24} color="#6366f1" />}
                            trend="+4% from last month"
                            color="#eef2ff"
                        />
                        <StatCard 
                            title="Seeking Internship" 
                            value={stats?.seeking} 
                            loading={loading} 
                            icon={<Users size={24} color="#f59e0b" />}
                            trend="-2% from last month"
                            color="#fffbef"
                        />
                        <StatCard 
                            title="Total Industry Reach" 
                            value={stats?.industries?.length} 
                            loading={loading} 
                            icon={<Building2 size={24} color="#10b981" />}
                            trend="Global Coverage"
                            color="#ecfdf5"
                        />
                    </div>

                    {/* Charts Row */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '24px', marginBottom: '32px' }}>
                        {/* Placement Distribution */}
                        <div style={{ background: 'white', padding: '24px', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
                            <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#1e293b', marginBottom: '24px' }}>Placement Status</h3>
                            {loading ? (
                                <SkeletonLoader height="300px" />
                            ) : (
                                <div style={{ height: '300px' }}>
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={placementData}
                                                cx="50%"
                                                cy="50%"
                                                innerRadius={60}
                                                outerRadius={100}
                                                paddingAngle={5}
                                                dataKey="value"
                                            >
                                                {placementData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                ))}
                                            </Pie>
                                            <Tooltip />
                                            <Legend verticalAlign="bottom" height={36}/>
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                            )}
                        </div>

                        {/* Industry Breakdown */}
                        <div style={{ background: 'white', padding: '24px', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
                            <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#1e293b', marginBottom: '24px' }}>Industry Distribution</h3>
                            {loading ? (
                                <SkeletonLoader height="300px" />
                            ) : (
                                <div style={{ height: '300px' }}>
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={stats?.industries || []}>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                                            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                                            <Tooltip 
                                                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}
                                            />
                                            <Bar dataKey="count" fill="#6366f1" radius={[4, 4, 0, 0]} barSize={40} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Actions Row */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '24px' }}>
                        <button
                            onClick={() => navigate('/admin/companies')}
                            style={{
                                padding: '24px',
                                textAlign: 'left',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '20px',
                                transition: 'all 0.2s',
                                background: 'white',
                                borderRadius: '16px',
                                border: '1px solid #e2e8f0',
                                outline: 'none'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'translateY(-2px)';
                                e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0,0,0,0.05)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = 'none';
                            }}
                        >
                            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#eff6ff', display: 'flex', alignItems: 'center', justifyItems: 'center', justifyContent: 'center' }}>
                                <Building2 size={24} color="#3b82f6" />
                            </div>
                            <div style={{ flex: 1 }}>
                                <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#1e293b', margin: 0 }}>Company Approvals</h3>
                                <p style={{ fontSize: '13px', color: '#64748b', margin: '4px 0 0 0' }}>Review and verify business memberships</p>
                            </div>
                            <ChevronRight size={20} color="#94a3b8" />
                        </button>
                    </div>
                </div>
            </main>
        </div>
    )
}

function StatCard({ title, value, loading, icon, trend, color }) {
    return (
        <div style={{ 
            background: 'white', 
            padding: '24px', 
            borderRadius: '16px', 
            border: '1px solid #e2e8f0',
            boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px'
        }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ 
                    width: '44px', 
                    height: '44px', 
                    borderRadius: '10px', 
                    background: color, 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center' 
                }}>
                    {icon}
                </div>
                <TrendingUp size={16} color="#10b981" />
            </div>
            <div>
                <p style={{ fontSize: '14px', fontWeight: 500, color: '#64748b', margin: 0 }}>{title}</p>
                {loading ? (
                    <div style={{ marginTop: '8px' }}><SkeletonLoader width="60%" height="28px" /></div>
                ) : (
                    <h2 style={{ fontSize: '28px', fontWeight: 700, color: '#1e293b', margin: '4px 0 0 0' }}>{value || 0}</h2>
                )}
            </div>
            <p style={{ fontSize: '12px', color: '#10b981', fontWeight: 500, margin: 0 }}>{trend}</p>
        </div>
    );
}
