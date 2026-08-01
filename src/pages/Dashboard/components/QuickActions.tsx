import { useNavigate } from 'react-router-dom'
import { UserPlus, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function QuickActions() {
  const navigate = useNavigate()
  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="sm"
        className="hidden sm:flex items-center gap-2 text-xs"
        onClick={() => navigate('/employees?new=true')}
      >
        <UserPlus className="h-3.5 w-3.5" />
        Add Employee
      </Button>
      <Button
        size="sm"
        className="bg-gradient-to-r from-blue-600 to-violet-600 text-white text-xs hover:from-blue-500 hover:to-violet-500 shadow-lg"
      >
        <Sparkles className="h-3.5 w-3.5 mr-1.5" />
        AI Insights
      </Button>
    </div>
  )
}
