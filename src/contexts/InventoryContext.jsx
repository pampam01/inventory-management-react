import { createContext, useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabaseClient'
import toast from 'react-hot-toast'

export const InventoryContext = createContext()

export const InventoryProvider = ({ children }) => {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [backup, setBackup] = useState([])

  // Fetch all items
  const fetchItems = useCallback(async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('inventory_items')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setItems(data || [])
    } catch (error) {
      toast.error('Error loading data: ' + error.message)
    } finally {
      setLoading(false)
    }
  }, [])

  // Add new item
  const addItem = async (itemData) => {
    try {
      const { data, error } = await supabase
        .from('inventory_items')
        .insert([{
          nama_komponen: itemData.nama,
          deskripsi: itemData.deskripsi,
          jumlah_masuk: itemData.jumlah_masuk,
          jumlah_keluar: itemData.jumlah_keluar,
          lokasi_penyimpanan: itemData.lokasi,
          keterangan: itemData.keterangan
        }])
        .select()

      if (error) throw error
      
      await fetchItems()
      toast.success('Item berhasil ditambahkan!')
      return { success: true, data }
    } catch (error) {
      toast.error('Error adding item: ' + error.message)
      return { success: false, error }
    }
  }

  // Update item
  const updateItem = async (id, itemData) => {
    try {
      const { error } = await supabase
        .from('inventory_items')
        .update({
          nama_komponen: itemData.nama,
          deskripsi: itemData.deskripsi,
          jumlah_masuk: itemData.jumlah_masuk,
          jumlah_keluar: itemData.jumlah_keluar,
          lokasi_penyimpanan: itemData.lokasi,
          keterangan: itemData.keterangan
        })
        .eq('id', id)

      if (error) throw error
      
      await fetchItems()
      toast.success('Item berhasil diupdate!')
      return { success: true }
    } catch (error) {
      toast.error('Error updating item: ' + error.message)
      return { success: false, error }
    }
  }

  // Delete item
  const deleteItem = async (id) => {
    try {
      const { error } = await supabase
        .from('inventory_items')
        .delete()
        .eq('id', id)

      if (error) throw error
      
      await fetchItems()
      toast.success('Item berhasil dihapus!')
      return { success: true }
    } catch (error) {
      toast.error('Error deleting item: ' + error.message)
      return { success: false, error }
    }
  }

  // Create backup
  const createBackup = async () => {
    try {
      const { error } = await supabase
        .from('inventory_backup')
        .insert([{
          data: items
        }])

      if (error) throw error
      
      toast.success('Backup berhasil dibuat!')
      await fetchBackup()
      return { success: true }
    } catch (error) {
      toast.error('Error creating backup: ' + error.message)
      return { success: false, error }
    }
  }

  // Fetch backup
  const fetchBackup = async () => {
    try {
      const { data, error } = await supabase
        .from('inventory_backup')
        .select('*')
        .order('backup_date', { ascending: false })
        .limit(1)

      if (error) throw error
      
      if (data && data.length > 0) {
        setBackup(data.data || [])
      }
    } catch (error) {
      console.error('Error fetching backup:', error)
    }
  }

  // Restore from backup
  const restoreFromBackup = async () => {
    try {
      // Delete all current items
      const { error: deleteError } = await supabase
        .from('inventory_items')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000') // Delete all

      if (deleteError) throw deleteError

      // Insert backup items
      if (backup && backup.length > 0) {
        const itemsToInsert = backup.map(item => ({
          nama_komponen: item.nama_komponen,
          deskripsi: item.deskripsi,
          jumlah_masuk: item.jumlah_masuk,
          jumlah_keluar: item.jumlah_keluar,
          lokasi_penyimpanan: item.lokasi_penyimpanan,
          keterangan: item.keterangan
        }))

        const { error: insertError } = await supabase
          .from('inventory_items')
          .insert(itemsToInsert)

        if (insertError) throw insertError
      }

      await fetchItems()
      toast.success('Data berhasil dipulihkan dari backup!')
      return { success: true }
    } catch (error) {
      toast.error('Error restoring backup: ' + error.message)
      return { success: false, error }
    }
  }

  useEffect(() => {
    fetchItems()
    fetchBackup()
  }, [fetchItems])

  return (
    <InventoryContext.Provider
      value={{
        items,
        loading,
        backup,
        fetchItems,
        addItem,
        updateItem,
        deleteItem,
        createBackup,
        restoreFromBackup
      }}
    >
      {children}
    </InventoryContext.Provider>
  )
}
