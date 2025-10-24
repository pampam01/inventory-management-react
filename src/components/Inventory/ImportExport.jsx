import { useRef, useState } from 'react'
import { useInventory } from '../../hooks/useInventory'
import { Button } from '../UI/Button'
import { Card } from '../UI/Card'
import { Download, Upload, FileText, FileSpreadsheet } from 'lucide-react'
import { exportToCSV, exportToExcel, importFromCSV } from '../../utils/exportHelpers'
import { supabase } from '../../lib/supabaseClient'
import toast from 'react-hot-toast'

export const ImportExport = () => {
  const { items, fetchItems } = useInventory()
  const fileInputRef = useRef(null)
  const [isImporting, setIsImporting] = useState(false)

  const handleExportCSV = () => {
    if (items.length === 0) {
      toast.error('Tidak ada data untuk diexport!')
      return
    }

    exportToCSV(items.map(item => ({
      nama_komponen: item.nama_komponen,
      deskripsi: item.deskripsi || '',
      jumlah_masuk: item.jumlah_masuk,
      jumlah_keluar: item.jumlah_keluar,
      stok_akhir: item.stok_akhir,
      lokasi_penyimpanan: item.lokasi_penyimpanan || '',
      keterangan: item.keterangan || ''
    })))
    toast.success('Data berhasil diexport ke CSV!')
  }

  const handleExportExcel = () => {
    if (items.length === 0) {
      toast.error('Tidak ada data untuk diexport!')
      return
    }

    exportToExcel(items.map(item => ({
      'Nama Komponen': item.nama_komponen,
      'Deskripsi': item.deskripsi || '',
      'Jumlah Masuk': item.jumlah_masuk,
      'Jumlah Keluar': item.jumlah_keluar,
      'Stok Akhir': item.stok_akhir,
      'Lokasi': item.lokasi_penyimpanan || '',
      'Keterangan': item.keterangan || ''
    })))
    toast.success('Data berhasil diexport ke Excel!')
  }

  // Trigger file input click
  const handleImportClick = () => {
    if (fileInputRef.current && !isImporting) {
      fileInputRef.current.value = '' // Clear previous selection
      fileInputRef.current.click()
    }
  }

  // const handleImportCSV = async (event) => {
  //   const file = event.target.files
    
  //   if (!file) {
  //     console.log('No file selected')
  //     return
  //   }

  //   console.log('File selected:', file.name, file.size, file.type)

  //   // Validate file type
  //   if (!file.name.toLowerCase().endsWith('.csv')) {
  //     toast.error('File harus berformat CSV!')
  //     // Reset file input
  //     if (fileInputRef.current) {
  //       fileInputRef.current.value = ''
  //     }
  //     return
  //   }

  //   setIsImporting(true)
  //   toast.loading('Sedang memproses file CSV...', { id: 'import' })

  //   try {
  //     // Manual CSV parsing using FileReader
  //     const text = await readFileAsText(file)
  //     console.log('File content:', text.substring(0, 200) + '...')

  //     if (!text.trim()) {
  //       toast.error('File CSV kosong!', { id: 'import' })
  //       return
  //     }

  //     // Parse CSV manually
  //     const lines = text.trim().split('\n')
  //     if (lines.length < 2) {
  //       toast.error('File CSV harus memiliki header dan minimal 1 baris data!', { id: 'import' })
  //       return
  //     }

  //     // Get headers
  //     const headers = lines.split(',').map(h => h.trim().replace(/"/g, ''))
  //     console.log('Headers:', headers)

  //     // Parse data rows
  //     const rows = []
  //     for (let i = 1; i < lines.length; i++) {
  //       const values = parseCSVLine(lines[i])
  //       if (values.length > 0) {
  //         const row = {}
  //         headers.forEach((header, index) => {
  //           row[header] = values[index] || ''
  //         })
  //         rows.push(row)
  //       }
  //     }

  //     console.log('Parsed rows:', rows)

  //     if (rows.length === 0) {
  //       toast.error('Tidak ada data valid untuk diimport!', { id: 'import' })
  //       return
  //     }

  //     // Transform and validate data
  //     const itemsToInsert = rows
  //       .filter(row => {
  //         const nama = row.nama_komponen || row['Nama Komponen'] || row['nama_komponen']
  //         return nama && nama.trim() !== ''
  //       })
  //       .map(row => {
  //         const nama = row.nama_komponen || row['Nama Komponen'] || row['nama_komponen'] || ''
  //         const deskripsi = row.deskripsi || row['Deskripsi'] || row['deskripsi'] || ''
  //         const masuk = parseInt(row.jumlah_masuk || row['Jumlah Masuk'] || row['jumlah_masuk'] || '0') || 0
  //         const keluar = parseInt(row.jumlah_keluar || row['Jumlah Keluar'] || row['jumlah_keluar'] || '0') || 0
  //         const lokasi = row.lokasi_penyimpanan || row['Lokasi'] || row['lokasi_penyimpanan'] || ''
  //         const keterangan = row.keterangan || row['Keterangan'] || row['keterangan'] || ''

  //         return {
  //           nama_komponen: nama.trim(),
  //           deskripsi: deskripsi.trim(),
  //           jumlah_masuk: masuk,
  //           jumlah_keluar: keluar,
  //           lokasi_penyimpanan: lokasi.trim(),
  //           keterangan: keterangan.trim()
  //         }
  //       })

  //     console.log('Items to insert:', itemsToInsert)

  //     if (itemsToInsert.length === 0) {
  //       toast.error('Tidak ada data valid dengan nama_komponen yang terisi!', { id: 'import' })
  //       return
  //     }

  //     toast.loading(`Menyimpan ${itemsToInsert.length} item ke database...`, { id: 'import' })

  //     // Insert to database in batches (Supabase has limit)
  //     const batchSize = 10
  //     let totalInserted = 0

  //     for (let i = 0; i < itemsToInsert.length; i += batchSize) {
  //       const batch = itemsToInsert.slice(i, i + batchSize)
        
  //       const { data, error } = await supabase
  //         .from('inventory_items')
  //         .insert(batch)
  //         .select()

  //       if (error) {
  //         console.error('Supabase insert error:', error)
  //         throw new Error(`Database error: ${error.message}`)
  //       }

  //       totalInserted += batch.length
  //       console.log(`Batch ${Math.floor(i/batchSize) + 1} inserted:`, data)
  //     }

  //     // Refresh data
  //     await fetchItems()
      
  //     toast.success(`${totalInserted} item berhasil diimport ke database!`, { id: 'import' })

  //   } catch (error) {
  //     console.error('Import error:', error)
  //     toast.error(`Error importing data: ${error.message}`, { id: 'import' })
  //   } finally {
  //     setIsImporting(false)
  //     // Reset file input
  //     if (fileInputRef.current) {
  //       fileInputRef.current.value = ''
  //     }
  //   }
  // }

  // Helper function to read file as text


const handleImportCSV = async (event) => {
    // --- FIX 1: Ambil file pertama dari FileList ---
    const file = event.target.files[0] 
    
    // Pengecekan ini sekarang akan berfungsi dengan benar
    if (!file) {
      console.log('No file selected')
      // Reset file input jika pengguna membatalkan
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
      return
    }

    console.log('File selected:', file.name, file.size, file.type)

    // Validate file type
    if (!file.name.toLowerCase().endsWith('.csv')) {
      toast.error('File harus berformat CSV!')
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
      return
    }

    setIsImporting(true)
    toast.loading('Sedang memproses file CSV...', { id: 'import' })

    try {
      // Manual CSV parsing using FileReader
      // 'file' di sini sekarang sudah benar (objek File, bukan FileList)
      const text = await readFileAsText(file) 
      console.log('File content:', text.substring(0, 200) + '...')

      if (!text.trim()) {
        toast.error('File CSV kosong!', { id: 'import' })
        return
      }

      // Parse CSV manually
      const lines = text.trim().split('\n')
      if (lines.length < 2) {
        toast.error('File CSV harus memiliki header dan minimal 1 baris data!', { id: 'import' })
        return
      }

      // --- FIX 2: Ambil baris pertama (lines[0]) untuk header ---
      const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''))
      console.log('Headers:', headers)

      // Parse data rows
      const rows = []
      for (let i = 1; i < lines.length; i++) {
        // Pastikan baris tidak kosong (sering terjadi jika ada baris kosong di akhir file)
        if (lines[i].trim() === '') continue 

        const values = parseCSVLine(lines[i])
        if (values.length > 0) {
          const row = {}
          headers.forEach((header, index) => {
            row[header] = values[index] || ''
          })
          rows.push(row)
        }
      }

      console.log('Parsed rows:', rows)

      if (rows.length === 0) {
        toast.error('Tidak ada data valid untuk diimport!', { id: 'import' })
        return
      }

      // Transform and validate data
      const itemsToInsert = rows
        .filter(row => {
          const nama = row.nama_komponen || row['Nama Komponen'] || row['nama_komponen']
          return nama && nama.trim() !== ''
        })
        .map(row => {
          const nama = row.nama_komponen || row['Nama Komponen'] || row['nama_komponen'] || ''
          const deskripsi = row.deskripsi || row['Deskripsi'] || row['deskripsi'] || ''
          const masuk = parseInt(row.jumlah_masuk || row['Jumlah Masuk'] || row['jumlah_masuk'] || '0') || 0
          const keluar = parseInt(row.jumlah_keluar || row['Jumlah Keluar'] || row['jumlah_keluar'] || '0') || 0
          const lokasi = row.lokasi_penyimpanan || row['Lokasi'] || row['lokasi_penyimpanan'] || ''
          const keterangan = row.keterangan || row['Keterangan'] || row['keterangan'] || ''

          return {
            nama_komponen: nama.trim(),
            deskripsi: deskripsi.trim(),
            jumlah_masuk: masuk,
            jumlah_keluar: keluar,
            lokasi_penyimpanan: lokasi.trim(),
            keterangan: keterangan.trim()
          }
        })

      console.log('Items to insert:', itemsToInsert)

      if (itemsToInsert.length === 0) {
        toast.error('Tidak ada data valid dengan nama_komponen yang terisi!', { id: 'import' })
        return
      }

      toast.loading(`Menyimpan ${itemsToInsert.length} item ke database...`, { id: 'import' })

      // Insert to database in batches (Supabase has limit)
      const batchSize = 10
      let totalInserted = 0

      for (let i = 0; i < itemsToInsert.length; i += batchSize) {
        const batch = itemsToInsert.slice(i, i + batchSize)
        
        const { data, error } = await supabase
          .from('inventory_items')
          .insert(batch)
          .select()

        if (error) {
          console.error('Supabase insert error:', error)
          throw new Error(`Database error: ${error.message}`)
        }

        totalInserted += batch.length
        console.log(`Batch ${Math.floor(i/batchSize) + 1} inserted:`, data)
      }

      // Refresh data
      await fetchItems()
      
      toast.success(`${totalInserted} item berhasil diimport ke database!`, { id: 'import' })

    } catch (error) {
      console.error('Import error:', error)
      toast.error(`Error importing data: ${error.message}`, { id: 'import' })
    } finally {
      setIsImporting(false)
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }
  const readFileAsText = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = (e) => resolve(e.target.result)
      reader.onerror = (e) => reject(new Error('Failed to read file'))
      reader.readAsText(file, 'UTF-8')
    })
  }

  // Helper function to parse CSV line (handles quotes)
  const parseCSVLine = (line) => {
    const values = []
    let current = ''
    let inQuotes = false
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i]
      
      if (char === '"') {
        inQuotes = !inQuotes
      } else if (char === ',' && !inQuotes) {
        values.push(current.trim())
        current = ''
      } else {
        current += char
      }
    }
    
    values.push(current.trim())
    return values.map(v => v.replace(/"/g, ''))
  }

  // Download sample CSV template
  const handleDownloadTemplate = () => {
    const template = [
      {
        nama_komponen: 'Motherboard ASUS B450M',
        deskripsi: 'Motherboard untuk gaming PC',
        jumlah_masuk: 10,
        jumlah_keluar: 2,
        lokasi_penyimpanan: 'Gudang A - Rak 1',
        keterangan: 'Komponen PC untuk produksi'
      },
      {
        nama_komponen: 'Monitor LG 24 inch',
        deskripsi: 'Monitor LED 1920x1080',
        jumlah_masuk: 5,
        jumlah_keluar: 0,
        lokasi_penyimpanan: 'Gudang B - Rak 3',
        keterangan: 'Monitor untuk workstation'
      },
      {
        nama_komponen: 'Mouse Logitech Wireless',
        deskripsi: 'Mouse wireless dengan battery',
        jumlah_masuk: 20,
        jumlah_keluar: 5,
        lokasi_penyimpanan: 'Gudang A - Rak 2',
        keterangan: 'Aksesoris komputer'
      }
    ]

    exportToCSV(template, 'template_import_inventory')
    toast.success('Template CSV berhasil didownload!')
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Export Section */}
      <Card>
        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <Download className="w-5 h-5" />
          Export Data
        </h2>
        <p className="text-sm text-gray-600 mb-6">
          Download data inventory dalam berbagai format
        </p>

        <div className="space-y-3">
          <Button
            onClick={handleExportCSV}
            variant="primary"
            className="w-full flex items-center justify-center gap-2"
            disabled={items.length === 0}
          >
            <FileText className="w-4 h-4" />
            Download CSV ({items.length} items)
          </Button>

          <Button
            onClick={handleExportExcel}
            variant="success"
            className="w-full flex items-center justify-center gap-2"
            disabled={items.length === 0}
          >
            <FileSpreadsheet className="w-4 h-4" />
            Download Excel ({items.length} items)
          </Button>
        </div>

        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <p className="text-sm font-medium text-blue-900 mb-2">
            📋 Google Sheets Integration
          </p>
          <ol className="text-xs text-blue-800 space-y-1 list-decimal list-inside">
            <li>Download CSV dari tombol di atas</li>
            <li>Buka Google Sheets</li>
            <li>File → Import → Upload CSV</li>
            <li>Pilih "Replace spreadsheet"</li>
            <li>Share spreadsheet dengan tim</li>
          </ol>
        </div>
      </Card>

      {/* Import Section */}
      <Card>
        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <Upload className="w-5 h-5" />
          Import Data
        </h2>
        <p className="text-sm text-gray-600 mb-6">
          Upload file CSV untuk menambah data inventory
        </p>

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv"
          onChange={handleImportCSV}
          className="hidden"
        />

        {/* Upload Area */}
        <div 
          onClick={handleImportClick}
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-all cursor-pointer ${
            isImporting 
              ? 'border-blue-300 bg-blue-50 cursor-not-allowed' 
              : 'border-gray-300 hover:border-blue-500 hover:bg-blue-50'
          }`}
        >
          <Upload className={`w-12 h-12 mx-auto mb-4 ${
            isImporting ? 'text-blue-500 animate-pulse' : 'text-gray-400'
          }`} />
          <p className="text-sm text-gray-600 mb-4">
            {isImporting ? 'Sedang memproses...' : 'Klik di area ini untuk upload file CSV'}
          </p>
          <Button 
            onClick={(e) => {
              e.stopPropagation()
              handleImportClick()
            }}
            variant="outline" 
            disabled={isImporting}
            className="pointer-events-none"
          >
            {isImporting ? 'Processing...' : 'Pilih File CSV'}
          </Button>
        </div>

        {/* Download Template Button */}
        <div className="mt-4">
          <Button
            onClick={handleDownloadTemplate}
            variant="secondary"
            className="w-full flex items-center justify-center gap-2"
            disabled={isImporting}
          >
            <Download className="w-4 h-4" />
            Download Template CSV
          </Button>
        </div>

        {/* Format Info */}
        <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
          <p className="text-sm font-medium text-yellow-900 mb-2">
            📋 Format CSV yang BENAR
          </p>
          <div className="text-xs text-yellow-800 space-y-2">
            <div className="bg-yellow-100 p-2 rounded font-mono text-xs">
nama_komponen,deskripsi,jumlah_masuk,jumlah_keluar,lokasi_penyimpanan,keterangan<br/>
Motherboard ASUS,Motherboard gaming,10,2,Gudang A,PC gaming<br/>
Monitor LG,Monitor 24 inch,5,0,Gudang B,Display unit
            </div>
            <p className="mt-2 text-yellow-700">
              💡 <strong>Tips:</strong>
            </p>
            <ul className="list-disc list-inside space-y-1">
              <li>Header row (baris pertama) WAJIB ada</li>
              <li>nama_komponen TIDAK BOLEH kosong</li>
              <li>Gunakan comma (,) sebagai separator</li>
              <li>Save as CSV UTF-8, bukan Excel</li>
            </ul>
          </div>
        </div>

        {/* Debug Info */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mt-4 p-3 bg-gray-50 rounded text-xs">
            <p className="font-medium mb-1">🔍 Debug Info:</p>
            <p>Total items in database: {items.length}</p>
            <p>Is importing: {isImporting ? 'Yes' : 'No'}</p>
          </div>
        )}
      </Card>
    </div>
  )
}
