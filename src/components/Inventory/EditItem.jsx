import { useState, useEffect } from 'react'
import { useInventory } from '../../hooks/useInventory'
import { Button } from '../UI/Button'
import { Input, TextArea } from '../UI/Input'
import { Card } from '../UI/Card'
import { Edit, Save } from 'lucide-react'

export const EditItem = () => {
  const { items, updateItem } = useInventory()
  const [selectedItemId, setSelectedItemId] = useState('')
  const [formData, setFormData] = useState(null)

  useEffect(() => {
    if (selectedItemId) {
      const item = items.find(i => i.id === selectedItemId)
      if (item) {
        setFormData({
          nama: item.nama_komponen,
          deskripsi: item.deskripsi || '',
          jumlah_masuk: item.jumlah_masuk,
          jumlah_keluar: item.jumlah_keluar,
          lokasi: item.lokasi_penyimpanan || '',
          keterangan: item.keterangan || ''
        })
      }
    } else {
      setFormData(null)
    }
  }, [selectedItemId, items])

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!selectedItemId || !formData) return

    const result = await updateItem(selectedItemId, formData)
    if (result.success) {
      setSelectedItemId('')
      setFormData(null)
    }
  }

  const stokAkhir = formData ? formData.jumlah_masuk - formData.jumlah_keluar : 0

  return (
    <Card>
      <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
        <Edit className="w-6 h-6" />
        Edit Barang
      </h2>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Pilih komponen yang akan diedit
        </label>
        <select
          value={selectedItemId}
          onChange={(e) => setSelectedItemId(e.target.value)}
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

      {formData && (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-4">
              <Input
                label="Nama Komponen"
                value={formData.nama}
                onChange={(e) => handleChange('nama', e.target.value)}
                required
              />

              <TextArea
                label="Deskripsi"
                value={formData.deskripsi}
                onChange={(e) => handleChange('deskripsi', e.target.value)}
                rows={3}
              />

              <Input
                label="Jumlah Masuk"
                type="number"
                value={formData.jumlah_masuk}
                onChange={(e) => handleChange('jumlah_masuk', parseInt(e.target.value) || 0)}
                min="0"
                step="1"
                required
              />

              <Input
                label="Jumlah Keluar"
                type="number"
                value={formData.jumlah_keluar}
                onChange={(e) => handleChange('jumlah_keluar', parseInt(e.target.value) || 0)}
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
                value={formData.lokasi}
                onChange={(e) => handleChange('lokasi', e.target.value)}
              />

              <TextArea
                label="Keterangan"
                value={formData.keterangan}
                onChange={(e) => handleChange('keterangan', e.target.value)}
                rows={3}
              />
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <Button type="submit" variant="success" className="flex items-center gap-2">
              <Save className="w-4 h-4" />
              Simpan Perubahan
            </Button>
          </div>
        </form>
      )}
    </Card>
  )
}
