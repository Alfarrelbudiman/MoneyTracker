// src/pages/Logs.jsx
import { useState, useEffect } from 'react';
import { Trash2, Edit } from 'lucide-react';
import { supabase } from '../lib/supabase.js';
import Swal from 'sweetalert2';
import Modals from '../components/layout/Modals.jsx';

const Logs = () => {
  // membuat state untuk menyimpan data
  const [data, setData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  // TUGAS 1: DATA DUMMY & FORMAT RUPIAH
  const [isLoading, setIsLoading] = useState(true);
  const formatRupiah = (angka) =>
    new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(angka);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const { data: records, error } = await supabase
        .from('jurnal_saku')
        .select('*')
        .order('created_at', { ascending: false });

      // kalau datanya dapet, masukan ke state
      if (records) {
        setData(records);
      }
    } catch (error) {
      console.log('error bang!', error);
    } finally {
      setIsLoading(false);
    }
  };

  // di jalankan pada awal saja
  useEffect(() => {
    fetchData();
  }, []);

  // FUNGSI DELETE
  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'pastikan anda ingin menghapus',
      text: 'Data yang di hapus tidak dapat dikembalikan!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#10b981',
      cancelButtonColor: '#DC143C',
      confirmButtonText: 'Yap, Hapus!',
      cancelButtonText: 'Batal',
    });

    if (result.isConfirmed) {
      setIsLoading(true);
      try {
        await supabase.from('jurnal_saku').delete().eq('id', id);

        Swal.fire('terhapus!', 'catatan berhasil di buang!', 'success');

        fetchData();
      } catch {
        Swal.fire('Error!', 'gagal menghapus', 'error');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleEdit = (item) => {
    setEditData(item);
    setIsModalOpen(true);
  };

  return (
    // TUGAS 2: DESAIN PEMBUNGKUS
    <div className="p-5 pb-24">
      <h1 className="text-2xl font-extrabold text-gray-900 mb-6">
        Riwayat Jajan 📝
      </h1>

      {/* TUGAS 3: MAPPING DATA */}
      <div>
        {data.map((item) => (
          // Desain Kartu & Flexbox
          <div
            key={item.id}
            className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 mb-3 flex justify-between items-center"
          >
            {/* Bagian Kiri: Catatan dan Kategori */}
            <div>
              <p className="font-bold text-gray-800">{item.catatan}</p>
              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-md mt-1 inline-block">
                {item.kategori}
              </span>
            </div>

            {/* Bagian Kanan: Nominal & Logika Warna (Ternary) */}
            <div className="flex flex-col items-end gap-2">
              <span
                className={`font-black ${item.jenis === 'Pemasukan' ? 'text-green-500' : 'text-red-500'}`}
              >
                {item.jenis === 'Pemasukan' ? '+' : '-'}
                {formatRupiah(item.nominal)}
              </span>

              <div className="flex gap-3 text-gray-400">
                <button
                  onClick={() => handleEdit(item)}
                  className="hover:text-blue-500"
                >
                  <Edit size={16} />
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="hover:text-red-500"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}

        {data.length === 0 && (
          <div className="flex flex-col items-center justify-center mt-20 mb-4 text-gray-400">
            <div className="text-6xl mb-4">😃</div>
            <p className="font-medium texte-lg">belum ada Riwayat</p>
            <p className="text-sm">mulai catat keuangan</p>
          </div>
        )}
      </div>
      <Modals
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditData(null);
        }}
        fetchData={fetchData}
        editData={editData}
      />
    </div>
  );
};

export default Logs;
