import { useState } from 'react';
import { supabase } from '../../lib/supabase';
import Swal from 'sweetalert2';

const Modals = ({ isOpen, onClose, fetchData, editData }) => {
  //State untuk menangkap isian form
  const [formData, setFormData] = useState({
    jenis: 'Pengeluaran',
    nominal: '',
    kategori: '',
    catatan: '',
  });

  const [isLoading, setIsLoading] = useState(false);

  // Fungsi saat user mengetik di input
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  //Fungsi saat tombol simpan diklik
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const cekNominal = parseInt(formData.nominal)

    if(!cekNominal  || cekNominal <=0){
      Swal.fire({
        title: 'tunggu dulu!',
        text: 'nominal tidak bisa kosong bang, 0, atau minus',
        icon: 'warning',
        confirmButtonColor: '#10b981'

      })
      return
    }

    try {
      if (editData) {
        await supabase
          .from('jurnal_saku')
          .update({
            jenis: formData.jenis,
            nominal: parseInt(formData.nominal),
            kategori: formData.kategori,
            catatan: formData.catatan,
          })
          .eq('id', editData.id);
      } else {
        await supabase.from('jurnal_saku').insert([
          {
            jenis: formData.jenis,
            nominal: parseInt(formData.nominal),
            kategori: formData.kategori,
            catatan: formData.catatan,
          },
        ]);
      }

      Swal.fire({
        title: 'Berhasil',
        text: editData
          ? 'Data berhasil diubah!'
          : 'Data baru berhasil dicatat!',
        icon: 'success',
        timer: 1500,
        showConfirmButton: false,
      });

      fetchData();
      onClose();
    } catch (error) {
      alert('terjadi kesalahan pada meniyimpan data');
    } finally {
      setIsLoading(false);
    }
  };

  //Kalau isOpen false jangan tampilkan apa apa
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl w-full max-w-sm p-6">
        <h2 className="text-xl font-bold mb-4">Catat Baru</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Jenis */}
          <div>
            <label className="text-sm text-gray-500">Jenis</label>
            <select
              name="jenis"
              value={formData.jenis}
              onChange={handleChange}
              className="w-full border rounded-lg p-2 mt-1 outline-emerald-500"
            >
              <option value="Pengeluaran">🔴 Pengeluaran</option>
              <option value="Pemasukan">🟢 Pemasukan</option>
            </select>
          </div>

          {/* Nominal */}
          <div>
            <label className="text-sm text-gray-500">Nominal (Rp)</label>
            <input
              type="number"
              name="nominal"
              required
              value={formData.nominal}
              onChange={handleChange}
              className="w-full border rounded-lg p-2 mt-1 outline-emerald-500"
              placeholder="Contoh: 15000"
            />
          </div>

          {/* Kategori */}
          <div>
            <label className="text-sm text-gray-500">Kategori</label>
            <input
              type="text"
              name="kategori"
              required
              value={formData.kategori}
              onChange={handleChange}
              className="w-full border rounded-lg p-2 mt-1 outline-emerald-500"
              placeholder="Makan, Kuota, dll"
            />
          </div>

          {/* Catatan */}
          <div>
            <label className="text-sm text-gray-500">Catatan</label>
            <input
              type="text"
              name="catatan"
              value={formData.catatan}
              onChange={handleChange}
              className="w-full border rounded-lg p-2 mt-1 outline-emerald-500"
              placeholder="Beli apa?"
            />
          </div>

          {/* Button */}
          <div className="flex gap-3 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-lg font-bold"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 bg-emerald-500 text-white py-2 rounded-lg font-bold"
            >
              {isLoading ? 'menyimpan' : 'simpan jajan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Modals;
