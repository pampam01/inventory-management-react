import { useState } from 'react'
import { Layout } from '../components/Layout/Layout'
import { InventoryList } from '../components/Inventory/InventoryList'
import { AddItem } from '../components/Inventory/AddItem'
import { EditItem } from '../components/Inventory/EditItem'
import { DeleteItem } from '../components/Inventory/DeleteItem'
import { ImportExport } from '../components/Inventory/ImportExport'
import { BackupData } from '../components/Inventory/BackupData'
import { Eye, Plus, Edit, Trash2, FileText, Database } from 'lucide-react'

export const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('view')

  const tabs = [
    { id: 'view', label: 'Lihat Inventory', icon: Eye, component: InventoryList },
    { id: 'add', label: 'Tambah Barang', icon: Plus, component: AddItem },
    { id: 'edit', label: 'Edit Barang', icon: Edit, component: EditItem },
    { id: 'delete', label: 'Hapus Barang', icon: Trash2, component: DeleteItem },
    { id: 'import', label: 'Import/Export', icon: FileText, component: ImportExport },
    { id: 'backup', label: 'Backup Data', icon: Database, component: BackupData }
  ]

  const ActiveComponent = tabs.find(tab => tab.id === activeTab)?.component || InventoryList

  return (
    <Layout>
      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-sm mb-6 overflow-x-auto">
        <div className="flex border-b">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-b-2 border-blue-600 text-blue-600'
                    : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* Tab Content */}
      <div className="animate-fadeIn">
        <ActiveComponent />
      </div>
    </Layout>
  )
}
