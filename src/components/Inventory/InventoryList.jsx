import { useState, useMemo } from 'react'
import { useInventory } from '../../hooks/useInventory'
import { Card } from '../UI/Card'
import { Input } from '../UI/Input'
import { Button } from '../UI/Button'
import { Modal } from '../UI/Modal'
import { TextArea } from '../UI/Input'
import { 
  Search, 
  Filter, 
  TrendingUp, 
  Package, 
  AlertTriangle, 
  ArrowUpRight,
  Edit2,
  Trash2,
  ArrowUpDown,
  ArrowUp,
  ArrowDown
} from 'lucide-react'
import toast from 'react-hot-toast'

export const InventoryList = () => {
  const { items, loading, updateItem, deleteItem } = useInventory()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedLocation, setSelectedLocation] = useState('Semua')
  const [sortByName, setSortByName] = useState('none') // 'none', 'asc', 'desc'
  const [sortByDate, setSortByDate] = useState('desc') // 'none', 'asc', 'desc' - default desc (terbaru dulu)
  
  // Modal states
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState(null)
  
  // Form state for editing
  const [editFormData, setEditFormData] = useState({
    nama: '',
    deskripsi: '',
    jumlah_masuk: 0,
    jumlah_keluar: 0,
    lokasi: '',
    keterangan: ''
  })

  // Get unique locations
  const locations = useMemo(() => {
    const locs = items.map(item => item.lokasi_penyimpanan).filter(Boolean)
    return ['Semua', ...new Set(locs)]
  }, [items])

  // Filter and sort items
  const filteredAndSortedItems = useMemo(() => {
    let result = items.filter(item => {
      const matchesSearch = item.nama_komponen?.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesLocation = selectedLocation === 'Semua' || item.lokasi_penyimpanan === selectedLocation
      return matchesSearch && matchesLocation
    })

    // Apply sorting - Priority: Name > Date
    if (sortByName !== 'none') {
      // Sort by name first
      if (sortByName === 'asc') {
        result.sort((a, b) => a.nama_komponen.localeCompare(b.nama_komponen))
      } else if (sortByName === 'desc') {
        result.sort((a, b) => b.nama_komponen.localeCompare(a.nama_komponen))
      }
    } else if (sortByDate !== 'none') {
      // If name sorting is off, use date sorting
      if (sortByDate === 'asc') {
        result.sort((a, b) => new Date(a.created_at) - new Date(b.created_at))
      } else if (sortByDate === 'desc') {
        result.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      }
    }

    return result
  }, [items, searchTerm, selectedLocation, sortByName, sortByDate])

  // Calculate statistics
  const stats = useMemo(() => {
    const totalItems = items.length
    const totalStok = items.reduce((sum, item) => sum + (item.stok_akhir || 0), 0)
    const stokRendah = items.filter(item => (item.stok_akhir || 0) <= 10).length
    const totalMasuk = items.reduce((sum, item) => sum + (item.jumlah_masuk || 0), 0)

    return { totalItems, totalStok, stokRendah, totalMasuk }
  }, [items])

  // Toggle sort by name
  const toggleSortName = () => {
    if (sortByName === 'none') {
      setSortByName('asc')
      setSortByDate('none') // Reset date sort
    } else if (sortByName === 'asc') {
      setSortByName('desc')
    } else {
      setSortByName('none')
      setSortByDate('desc') // Back to default date sort
    }
  }

  // Toggle sort by date
  const toggleSortDate = () => {
    if (sortByDate === 'none') {
      setSortByDate('desc') // Start with newest first
      setSortByName('none') // Reset name sort
    } else if (sortByDate === 'desc') {
      setSortByDate('asc')
    } else {
      setSortByDate('desc') // Back to default
      setSortByName('none')
    }
  }

  // Open edit modal
  const handleEditClick = (item) => {
    setSelectedItem(item)
    setEditFormData({
      nama: item.nama_komponen,
      deskripsi: item.deskripsi || '',
      jumlah_masuk: item.jumlah_masuk,
      jumlah_keluar: item.jumlah_keluar,
      lokasi: item.lokasi_penyimpanan || '',
      keterangan: item.keterangan || ''
    })
    setEditModalOpen(true)
  }

  // Handle edit submit
  const handleEditSubmit = async (e) => {
    e.preventDefault()
    if (!selectedItem) return

    const result = await updateItem(selectedItem.id, editFormData)
    if (result.success) {
      setEditModalOpen(false)
      setSelectedItem(null)
    }
  }

  // Open delete modal
  const handleDeleteClick = (item) => {
    setSelectedItem(item)
    setDeleteModalOpen(true)
  }

  // Handle delete confirm
  const handleDeleteConfirm = async () => {
    if (!selectedItem) return

    const result = await deleteItem(selectedItem.id)
    if (result.success) {
      setDeleteModalOpen(false)
      setSelectedItem(null)
    }
  }

  // Get sort icon for name
  const getNameSortIcon = () => {
    if (sortByName === 'asc') return <ArrowUp className="w-4 h-4" />
    if (sortByName === 'desc') return <ArrowDown className="w-4 h-4" />
    return <ArrowUpDown className="w-4 h-4 opacity-50" />
  }

  // Get sort icon for date
  const getDateSortIcon = () => {
    if (sortByDate === 'asc') return <ArrowUp className="w-4 h-4" />
    if (sortByDate === 'desc') return <ArrowDown className="w-4 h-4" />
    return <ArrowUpDown className="w-4 h-4 opacity-50" />
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  const stokAkhir = editFormData.jumlah_masuk - editFormData.jumlah_keluar

  return (
    <div className="space-y-6">
      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Item</p>
              <p className="text-2xl font-bold text-gray-800">{stats.totalItems}</p>
            </div>
            <Package className="w-8 h-8 text-blue-500" />
          </div>
        </Card>

        <Card className="border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Stok Akhir</p>
              <p className="text-2xl font-bold text-gray-800">{stats.totalStok.toLocaleString()}</p>
            </div>
            <TrendingUp className="w-8 h-8 text-green-500" />
          </div>
        </Card>

        <Card className="border-l-4 border-red-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Stok Rendah (≤10)</p>
              <p className="text-2xl font-bold text-gray-800">{stats.stokRendah}</p>
            </div>
            <AlertTriangle className="w-8 h-8 text-red-500" />
          </div>
        </Card>

        <Card className="border-l-4 border-purple-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Masuk</p>
              <p className="text-2xl font-bold text-gray-800">{stats.totalMasuk.toLocaleString()}</p>
            </div>
            <ArrowUpRight className="w-8 h-8 text-purple-500" />
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Cari komponen..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white"
            >
              {locations.map(loc => (
                <option key={loc} value={loc}>{loc}</option>
              ))}
            </select>
          </div>
        </div>
      </Card>

      {/* Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left p-3 font-semibold text-gray-700">ID</th>
                <th className="text-left p-3 font-semibold text-gray-700">
                  <button
                    onClick={toggleSortDate}
                    className="flex items-center gap-2 hover:text-blue-600 transition-colors"
                    title={
                      sortByDate === 'desc' 
                        ? 'Klik untuk sort Terlama → Terbaru' 
                        : sortByDate === 'asc' 
                        ? 'Klik untuk reset' 
                        : 'Klik untuk sort Terbaru → Terlama'
                    }
                  >
                    Tanggal
                    {getDateSortIcon()}
                  </button>
                </th>
                <th className="text-left p-3 font-semibold text-gray-700">
                  <button
                    onClick={toggleSortName}
                    className="flex items-center gap-2 hover:text-blue-600 transition-colors"
                    title={
                      sortByName === 'none' 
                        ? 'Klik untuk sort A-Z' 
                        : sortByName === 'asc' 
                        ? 'Klik untuk sort Z-A' 
                        : 'Klik untuk reset sort'
                    }
                  >
                    Nama Komponen
                    {getNameSortIcon()}
                  </button>
                </th>
                <th className="text-left p-3 font-semibold text-gray-700">Deskripsi</th>
                <th className="text-right p-3 font-semibold text-gray-700">Masuk</th>
                <th className="text-right p-3 font-semibold text-gray-700">Keluar</th>
                <th className="text-right p-3 font-semibold text-gray-700">Stok</th>
                <th className="text-left p-3 font-semibold text-gray-700">Lokasi</th>
                <th className="text-center p-3 font-semibold text-gray-700">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredAndSortedItems.length === 0 ? (
                <tr>
                  <td colSpan="9" className="text-center p-8 text-gray-500">
                    Tidak ada data yang ditemukan
                  </td>
                </tr>
              ) : (
                filteredAndSortedItems.map((item) => (
                  <tr key={item.id} className="border-b hover:bg-gray-50 transition-colors">
                    <td className="p-3 text-sm text-gray-600">
                      {item.id?.substring(0, 8)}
                    </td>
                    <td className="p-3 text-sm text-gray-600">
                      <div>
                        <div className="font-medium">{new Date(item.created_at).toLocaleDateString('id-ID')}</div>
                        <div className="text-xs text-gray-400">{new Date(item.created_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}</div>
                      </div>
                    </td>
                    <td className="p-3 font-medium text-gray-800">
                      {item.nama_komponen}
                    </td>
                    <td className="p-3 text-sm text-gray-600 max-w-xs truncate">
                      {item.deskripsi || '-'}
                    </td>
                    <td className="p-3 text-right text-sm text-gray-800">
                      {item.jumlah_masuk}
                    </td>
                    <td className="p-3 text-right text-sm text-gray-800">
                      {item.jumlah_keluar}
                    </td>
                    <td className="p-3 text-right font-medium">
                      <span className={`${
                        item.stok_akhir <= 10 ? 'text-red-600' : 'text-green-600'
                      }`}>
                        {item.stok_akhir}
                      </span>
                    </td>
                    <td className="p-3 text-sm text-gray-600">
                      {item.lokasi_penyimpanan || '-'}
                    </td>
                    <td className="p-3">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleEditClick(item)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit item"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(item)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Hapus item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Sorting info */}
        {(sortByName !== 'none' || sortByDate !== 'none') && (
          <div className="mt-4 p-3 bg-blue-50 rounded-lg flex items-center justify-between">
            <p className="text-sm text-blue-800">
              {sortByName === 'asc' && '📊 Diurutkan berdasarkan Nama: A → Z'}
              {sortByName === 'desc' && '📊 Diurutkan berdasarkan Nama: Z → A'}
              {sortByDate === 'asc' && sortByName === 'none' && '📅 Diurutkan berdasarkan Tanggal: Terlama → Terbaru'}
              {sortByDate === 'desc' && sortByName === 'none' && '📅 Diurutkan berdasarkan Tanggal: Terbaru → Terlama'}
            </p>
            <button
              onClick={() => {
                setSortByName('none')
                setSortByDate('desc')
              }}
              className="text-sm text-blue-600 hover:text-blue-800 font-medium"
            >
              Reset
            </button>
          </div>
        )}
      </Card>

      {/* Edit Modal - same as before */}
      <Modal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        title="Edit Komponen"
      >
        <form onSubmit={handleEditSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-4">
              <Input
                label="Nama Komponen"
                value={editFormData.nama}
                onChange={(e) => setEditFormData(prev => ({ ...prev, nama: e.target.value }))}
                required
              />

              <TextArea
                label="Deskripsi"
                value={editFormData.deskripsi}
                onChange={(e) => setEditFormData(prev => ({ ...prev, deskripsi: e.target.value }))}
                rows={3}
              />

              <Input
                label="Jumlah Masuk"
                type="number"
                value={editFormData.jumlah_masuk}
                onChange={(e) => setEditFormData(prev => ({ ...prev, jumlah_masuk: parseInt(e.target.value) || 0 }))}
                min="0"
                step="1"
                required
              />

              <Input
                label="Jumlah Keluar"
                type="number"
                value={editFormData.jumlah_keluar}
                onChange={(e) => setEditFormData(prev => ({ ...prev, jumlah_keluar: parseInt(e.target.value) || 0 }))}
                min="0"
                step="1"
              />
            </div>

            <div className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Stok Akhir (Otomatis)</p>
                <p className="text-3xl font-bold text-blue-600">{stokAkhir}</p>
                <p className="text-xs text-gray-500 mt-1">= Jumlah Masuk - Jumlah Keluar</p>
              </div>

              <Input
                label="Lokasi Penyimpanan"
                value={editFormData.lokasi}
                onChange={(e) => setEditFormData(prev => ({ ...prev, lokasi: e.target.value }))}
              />

              <TextArea
                label="Keterangan"
                value={editFormData.keterangan}
                onChange={(e) => setEditFormData(prev => ({ ...prev, keterangan: e.target.value }))}
                rows={3}
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button
              type="button"
              onClick={() => setEditModalOpen(false)}
              variant="secondary"
            >
              Batal
            </Button>
            <Button type="submit" variant="success">
              Simpan Perubahan
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal - same as before */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Konfirmasi Hapus"
      >
        {selectedItem && (
          <div className="space-y-4">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-6 h-6 text-red-600 shrink-0 mt-1" />
                <div className="flex-1">
                  <h3 className="font-semibold text-red-800 mb-2">
                    Anda yakin ingin menghapus komponen ini?
                  </h3>
                  <p className="text-sm text-red-700 mb-3">
                    <strong>{selectedItem.nama_komponen}</strong>
                  </p>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">ID</p>
                      <p className="font-medium text-gray-800">{selectedItem.id?.substring(0, 8)}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Stok Akhir</p>
                      <p className="font-medium text-gray-800">{selectedItem.stok_akhir}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Lokasi</p>
                      <p className="font-medium text-gray-800">{selectedItem.lokasi_penyimpanan || '-'}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Tanggal</p>
                      <p className="font-medium text-gray-800">
                        {new Date(selectedItem.created_at).toLocaleDateString('id-ID')}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4 border-t">
              <Button
                onClick={() => setDeleteModalOpen(false)}
                variant="secondary"
              >
                Batal
              </Button>
              <Button
                onClick={handleDeleteConfirm}
                variant="danger"
                className="flex items-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Hapus
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
