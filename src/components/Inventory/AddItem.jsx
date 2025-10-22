import { useState } from 'react'
import { useInventory } from '../../hooks/useInventory'
import { Button } from '../UI/Button'
import { Input, TextArea } from '../UI/Input'
import { Card } from '../UI/Card'
import { Plus } from 'lucide-react'

export const AddItem = () => {
  const { addItem } = useInventory()
  const [formData, setFormData] = useState({
    nama: '',
    deskripsi: '',
    jumlah_masuk: 0,
    jumlah_keluar: 0,
    lokasi: '',
    keterangan: ''
  })

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const result = await addItem(formData)
    
    if (result.success) {
      setFormData({
        nama: '',
        deskripsi: '',
        jumlah_masuk: 0,
        jumlah_keluar: 0,
        lokasi: '',
        keterangan: ''
      })
    }
  }

  const stokAkhir = formData.jumlah_masuk - formData.jumlah_keluar

  return (
    <Card>
      <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
        <Plus className="w-6 h-6" />
        Tambah Komponen Baru
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-4">
            <Input
              label="Nama Komponen"
              value={formData.nama}
              onChange={(e) => handleChange('nama', e.target.value)}
              placeholder="Contoh: Motherboard ASUS"
              required
            />

            <TextArea
              label="Deskripsi"
              value={formData.deskripsi}
              onChange={(e) => handleChange('deskripsi', e.target.value)}
              placeholder="Deskripsi detail komponen"
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
              placeholder="Contoh: Gudang A - Rak 1"
            />

            <TextArea
              label="Keterangan"
              value={formData.keterangan}
              onChange={(e) => handleChange('keterangan', e.target.value)}
              placeholder="Catatan tambahan"
              rows={3}
            />
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <Button type="submit" variant="primary" className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Tambah Komponen
          </Button>
        </div>
      </form>
    </Card>
  )
}
