import { useState } from 'react'
import { useInventory } from '../../hooks/useInventory'
import { Button } from '../UI/Button'
import { Card } from '../UI/Card'
import { Trash2, AlertTriangle } from 'lucide-react'

export const DeleteItem = () => {
  const { items, deleteItem } = useInventory()
  const [selectedItemId, setSelectedItemId] = useState('')
  const [confirmed, setConfirmed] = useState(false)

  const selectedItem = items.find(i => i.id === selectedItemId)

  const handleDelete = async () => {
    if (!confirmed || !selectedItemId) return

    const result = await deleteItem(selectedItemId)
    if (result.success) {
      setSelectedItemId('')
      setConfirmed(false)
    }
  }

  return (
    <Card>
      <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
        <Trash2 className="w-6 h-6" />
        Hapus Barang
      </h2>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Pilih komponen yang akan dihapus
        </label>
        <select
          value={selectedItemId}
          onChange={(e) => {
            setSelectedItemId(e.target.value)
            setConfirmed(false)
          }}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Pilih komponen...</option>
          {items.map(item => (
            <option key={item.id} value={item.id}>
              {item.nama_komponen} (Stok: {item.stok_akhir})
            </option>
          ))}
        </select>
      </div>

      {selectedItem && (
        <div className="space-y-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-6 h-6 text-red-600 shrink-0" />
              <div className="flex-1">
                <h3 className="font-semibold text-red-800 mb-2">Konfirmasi Penghapusan</h3>
                <p className="text-sm text-red-700 mb-3">
                  Anda akan menghapus: <strong>{selectedItem.nama_komponen}</strong>
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
                    <p className="text-gray-600">Jumlah Masuk</p>
                    <p className="font-medium text-gray-800">{selectedItem.jumlah_masuk}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Jumlah Keluar</p>
                    <p className="font-medium text-gray-800">{selectedItem.jumlah_keluar}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-gray-600">Lokasi</p>
                    <p className="font-medium text-gray-800">{selectedItem.lokasi_penyimpanan || '-'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="confirm"
              checked={confirmed}
              onChange={(e) => setConfirmed(e.target.checked)}
              className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
            />
            <label htmlFor="confirm" className="text-sm text-gray-700">
              Saya yakin ingin menghapus komponen ini
            </label>
          </div>

          <div className="flex justify-end">
            <Button
              onClick={handleDelete}
              variant="danger"
              disabled={!confirmed}
              className="flex items-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              Hapus Komponen
            </Button>
          </div>
        </div>
      )}
    </Card>
  )
}
