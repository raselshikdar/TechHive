import { Users, FileText, MessageSquare, Eye } from 'lucide-react'
import { StatsCard } from '@/components/stats-card'
import { createServerClient } from '@/lib/supabase/server'

export async function AdminStats() {
  const supabase = await createServerClient()

  // Get total users
  const { count: totalUsers } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true })

  // Get total posts
  const { count: totalPosts } = await supabase
    .from('posts')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'published')

  // Get total comments
  const { count: totalComments } = await supabase
    .from('comments')
    .select('*', { count: 'exact', head: true })

  // Get total views
  const { data: viewsData } = await supabase
    .from('posts')
    .select('view_count')

  const totalViews = viewsData?.reduce((sum, post) => sum + post.view_count, 0) || 0

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatsCard
        title="Total Users"
        value={totalUsers || 0}
        icon={Users}
        description="Registered members"
      />
      <StatsCard
        title="Published Posts"
        value={totalPosts || 0}
        icon={FileText}
        description="Live content"
      />
      <StatsCard
        title="Total Comments"
        value={totalComments || 0}
        icon={MessageSquare}
        description="User engagement"
      />
      <StatsCard
        title="Total Views"
        value={totalViews.toLocaleString()}
        icon={Eye}
        description="Content reach"
      />
    </div>
  )
}
