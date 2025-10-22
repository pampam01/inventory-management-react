import Papa from 'papaparse'
import * as XLSX from 'xlsx'

// Export to CSV
export const exportToCSV = (data) => {
  const csv = Papa.unparse(data)
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)
  
  link.setAttribute('href', url)
  link.setAttribute('download', `inventory_${new Date().toISOString().split('T')}.csv`)
  link.style.visibility = 'hidden'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

// Export to Excel
export const exportToExcel = (data) => {
  const worksheet = XLSX.utils.json_to_sheet(data)
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Inventory')
  XLSX.writeFile(workbook, `inventory_${new Date().toISOString().split('T')}.xlsx`)
}

// Import from CSV
export const importFromCSV = (file, callback) => {
  Papa.parse(file, {
    header: true,
    skipEmptyLines: true,
    complete: (results) => {
      callback(results.data)
    },
    error: (error) => {
      console.error('Error parsing CSV:', error)
    }
  })
}

// Format data for table display
export const formatTableData = (items) => {
  return items.map(item => ({
    ID: item.id?.substring(0, 8),
    'Tanggal': new Date(item.created_at).toLocaleString('id-ID'),
    'Nama Komponen': item.nama_komponen,
    'Deskripsi': item.deskripsi || '-',
    'Jumlah Masuk': item.jumlah_masuk,
    'Jumlah Keluar': item.jumlah_keluar,
    'Stok Akhir': item.stok_akhir,
    'Lokasi': item.lokasi_penyimpanan || '-',
    'Keterangan': item.keterangan || '-'
  }))
}
