import { useState } from 'react'
import { Navigation } from './components/Navigation'
import { SessionsTable } from './components/SessionsTable'
import { getWebsiteId } from './config/env'
import './App.css'

type TabType = 'dashboard' | 'websites' | 'reports' | 'settings'

function App() {
  const [activeTab, setActiveTab] = useState<TabType>('websites')

  // Date range for API requests (last 24 hours)
  const now = Date.now()
  const startDate = (now - 24 * 60 * 60 * 1000).toString() // 24 hours ago
  const endDate = now.toString() // now

  return (
    <div className="min-h-screen bg-gray-900">
      <Navigation 
        activeTab={activeTab} 
        onTabChange={setActiveTab} 
      />
      
      {activeTab === 'websites' && (
        <SessionsTable 
          websiteId={getWebsiteId()}
          startDate={startDate}
          endDate={endDate}
        />
      )}
      
      {activeTab === 'dashboard' && (
        <div className="p-6">
          <h2 className="text-2xl font-bold text-white mb-4">Dashboard</h2>
          <p className="text-gray-300">Dashboard content will go here</p>
        </div>
      )}
      
      {activeTab === 'reports' && (
        <div className="p-6">
          <h2 className="text-2xl font-bold text-white mb-4">Reports</h2>
          <p className="text-gray-300">Reports content will go here</p>
        </div>
      )}
      
      {activeTab === 'settings' && (
        <div className="p-6">
          <h2 className="text-2xl font-bold text-white mb-4">Settings</h2>
          <p className="text-gray-300">Settings content will go here</p>
        </div>
      )}
    </div>
  )
}

export default App
