import { useInventory } from '../../hooks/useInventory'
import { Button } from '../UI/Button'
import { Card } from '../UI/Card'
import { Database, RotateCcw, Save, Download } from 'lucide-react'
import { exportToCSV, exportToExcel } from '../../utils/exportHelpers'
import toast from 'react-hot-toast'

export const BackupData = () => {
  const { items, backup, createBackup, restoreFromBackup } = useInventory()

  const handleCreateBackup = async () => {
    await createBackup()
  }

  const handleRestore = async () => {
    if (window.confirm('Apakah Anda yakin ingin restore dari backup? Ini akan mengganti semua data saat ini!')) {
      await restoreFromBackup()
    }
  }

  // Download backup as CSV
  const handleDownloadBackupCSV = () => {
    if (backup.length === 0) {
      toast.error('Tidak ada data backup untuk didownload!')
      return
    }

    const backupData = backup.map(item => ({
      nama_komponen: item.nama_komponen,
      deskripsi: item.deskripsi || '',
      jumlah_masuk: item.jumlah_masuk,
      jumlah_keluar: item.jumlah_keluar,
      stok_akhir: item.stok_akhir,
      lokasi_penyimpanan: item.lokasi_penyimpanan || '',
      keterangan: item.keterangan || '',
      tanggal_backup: new Date().toISOString()
    }))

    exportToCSV(backupData, `backup_inventory_${new Date().toISOString().split('T')}`)
    toast.success('Backup berhasil didownload sebagai CSV!')
  }

  // Download backup as Excel
  const handleDownloadBackupExcel = () => {
    if (backup.length === 0) {
      toast.error('Tidak ada data backup untuk didownload!')
      return
    }

    const backupData = backup.map(item => ({
      'Nama Komponen': item.nama_komponen,
      'Deskripsi': item.deskripsi || '',
      'Jumlah Masuk': item.jumlah_masuk,
      'Jumlah Keluar': item.jumlah_keluar,
      'Stok Akhir': item.stok_akhir,
      'Lokasi': item.lokasi_penyimpanan || '',
      'Keterangan': item.keterangan || '',
      'Tanggal Backup': new Date().toLocaleString('id-ID')
    }))

    exportToExcel(backupData, `backup_inventory_${new Date().toISOString().split('T')}`)
    toast.success('Backup berhasil didownload sebagai Excel!')
  }

  // Download current data as backup
  const handleDownloadCurrentCSV = () => {
    if (items.length === 0) {
      toast.error('Tidak ada data untuk didownload!')
      return
    }

    const currentData = items.map(item => ({
      nama_komponen: item.nama_komponen,
      deskripsi: item.deskripsi || '',
      jumlah_masuk: item.jumlah_masuk,
      jumlah_keluar: item.jumlah_keluar,
      stok_akhir: item.stok_akhir,
      lokasi_penyimpanan: item.lokasi_penyimpanan || '',
      keterangan: item.keterangan || '',
      created_at: new Date(item.created_at).toLocaleString('id-ID')
    }))

    exportToCSV(currentData, `current_inventory_${new Date().toISOString().split('T')}`)
    toast.success('Data saat ini berhasil didownload sebagai CSV!')
  }

  const handleDownloadCurrentExcel = () => {
    if (items.length === 0) {
      toast.error('Tidak ada data untuk didownload!')
      return
    }

    const currentData = items.map(item => ({
      'Nama Komponen': item.nama_komponen,
      'Deskripsi': item.deskripsi || '',
      'Jumlah Masuk': item.jumlah_masuk,
      'Jumlah Keluar': item.jumlah_keluar,
      'Stok Akhir': item.stok_akhir,
      'Lokasi': item.lokasi_penyimpanan || '',
      'Keterangan': item.keterangan || '',
      'Tanggal Dibuat': new Date(item.created_at).toLocaleString('id-ID')
    }))

    exportToExcel(currentData, `current_inventory_${new Date().toISOString().split('T')}`)
    toast.success('Data saat ini berhasil didownload sebagai Excel!')
  }

  return (
    <div className="space-y-6">
      {/* Current Data Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Current Data Card */}
        <Card>
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Database className="w-5 h-5" />
            Data Saat Ini
          </h2>

          <div className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Total Item</p>
              <p className="text-3xl font-bold text-blue-600">{items.length}</p>
            </div>

            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Total Stok</p>
              <p className="text-3xl font-bold text-green-600">
                {items.reduce((sum, item) => sum + (item.stok_akhir || 0), 0).toLocaleString()}
              </p>
            </div>

            <div className="space-y-2">
              <Button
                onClick={handleCreateBackup}
                variant="primary"
                className="w-full flex items-center justify-center gap-2"
              >
                <Save className="w-4 h-4" />
                Buat Backup Sekarang
              </Button>

              <div className="grid grid-cols-2 gap-2">
                <Button
                  onClick={handleDownloadCurrentCSV}
                  variant="outline"
                  className="w-full flex items-center justify-center gap-2 text-sm"
                >
                  <Download className="w-4 h-4" />
                  CSV
                </Button>
                <Button
                  onClick={handleDownloadCurrentExcel}
                  variant="outline"
                  className="w-full flex items-center justify-center gap-2 text-sm"
                >
                  <Download className="w-4 h-4" />
                  Excel
                </Button>
              </div>
            </div>
          </div>
        </Card>

        {/* Backup Data Card */}
        <Card>
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <RotateCcw className="w-5 h-5" />
            Data Backup
          </h2>

          {backup.length > 0 ? (
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">Total Item Backup</p>
                <p className="text-3xl font-bold text-gray-800">{backup.length}</p>
              </div>

              <div className="bg-purple-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">Total Stok Backup</p>
                <p className="text-3xl font-bold text-purple-600">
                  {backup.reduce((sum, item) => sum + (item.stok_akhir || 0), 0).toLocaleString()}
                </p>
              </div>

              <div className="space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    onClick={handleDownloadBackupCSV}
                    variant="success"
                    className="w-full flex items-center justify-center gap-2 text-sm"
                  >
                    <Download className="w-4 h-4" />
                    CSV
                  </Button>
                  <Button
                    onClick={handleDownloadBackupExcel}
                    variant="success"
                    className="w-full flex items-center justify-center gap-2 text-sm"
                  >
                    <Download className="w-4 h-4" />
                    Excel
                  </Button>
                </div>

                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-800 mb-3">
                    ⚠️ <strong>Peringatan:</strong> Restore akan mengganti semua data saat ini!
                  </p>
                  <Button
                    onClick={handleRestore}
                    variant="danger"
                    className="w-full flex items-center justify-center gap-2"
                  >
                    <RotateCcw className="w-4 h-4" />
                    Restore dari Backup
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <Database className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 mb-4">Belum ada data backup</p>
              <p className="text-sm text-gray-400">
                Klik "Buat Backup Sekarang" untuk membuat backup pertama
              </p>
            </div>
          )}
        </Card>
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Download Info */}
        <Card className="bg-linear-to-br from-blue-50 to-indigo-50 border border-blue-200">
          <h3 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
            <Download className="w-5 h-5" />
            Download Data Backup
          </h3>
          <div className="space-y-2 text-sm text-blue-800">
            <p>✅ Download backup sebagai CSV atau Excel</p>
            <p>✅ File otomatis diberi nama dengan tanggal</p>
            <p>✅ Simpan di komputer sebagai arsip</p>
            <p>✅ Dapat diimport kembali kapan saja</p>
          </div>
        </Card>

        {/* Backup Strategy */}
        <Card className="bg-linear-to-br from-green-50 to-emerald-50 border border-green-200">
          <h3 className="font-semibold text-green-900 mb-3 flex items-center gap-2">
            <Save className="w-5 h-5" />
            Strategi Backup
          </h3>
          <div className="space-y-2 text-sm text-green-800">
            <p>📅 Backup rutin setiap akhir hari</p>
            <p>📁 Simpan backup mingguan di cloud storage</p>
            <p>🔄 Test restore backup secara berkala</p>
            <p>💾 Keep multiple backup versions</p>
          </div>
        </Card>
      </div>

      {/* Usage Guide */}
      <Card className="bg-linear-to-br from-yellow-50 to-orange-50 border border-yellow-200">
        <h3 className="font-semibold text-yellow-900 mb-3">
          📖 Panduan Penggunaan Backup
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-yellow-800">
          <div>
            <p className="font-medium mb-2">1️⃣ Membuat Backup</p>
            <p className="text-xs">Klik "Buat Backup Sekarang" untuk menyimpan snapshot data saat ini ke database</p>
          </div>
          <div>
            <p className="font-medium mb-2">2️⃣ Download Backup</p>
            <p className="text-xs">Klik tombol "CSV" atau "Excel" untuk download backup ke komputer Anda</p>
          </div>
          <div>
            <p className="font-medium mb-2">3️⃣ Restore Backup</p>
            <p className="text-xs">Gunakan tombol "Restore" untuk mengembalikan data dari backup terakhir</p>
          </div>
        </div>
      </Card>
    </div>
  )
}
