import dynamic from 'next/dynamic'

const NoSSRDashboard = dynamic(() => import('@/app/dashboard/dashboard'), { ssr: false })

export default function ClientDashboard() {
  return <NoSSRDashboard />
}

