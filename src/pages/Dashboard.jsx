import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import Modals from '../components/layout/Modals';

const Dashboard = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // data
  const fetchData = async () => {
    setIsLoading(true);
    try {
      const { data: records, error } = await supabase
        .from('jurnal_saku')
        .select('*');
      // kalau datanya dapet, masukan ke state
      if (records) {
        setData(records);
      }
      if (error) {
        throw error;
      }
    } catch (error) {
      console.error('ada masalah', error.massage);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Variabel dummy
  const totalPemasukan = data
    .filter((item) => item.jenis === 'Pemasukan')
    .reduce((acc, curr) => acc + curr.nominal, 0);
  const totalPengeluaran = data
    .filter((item) => item.jenis === 'Pengeluaran')
    .reduce((acc, curr) => acc + curr.nominal, 0);
  const saldo = totalPemasukan - totalPengeluaran;

  let persenPengeluaran = 0;

  if (totalPemasukan > 0) {
    persenPengeluaran = (totalPengeluaran / totalPemasukan) * 100;
  }

  if (persenPengeluaran > 100) {
    persenPengeluaran = 100;
  }

  // Fungsi mengubah angka biasa jadi format rupiah
  const formatRupiah = (angka) =>
    new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(angka);

  if (isLoading) {
    return (
      <div className="p-5 pb-24 min-h-screen flex flex-col justify-center items-center bg-gray-50">
        <div className="animate-spin text">🪙</div>
        <p className=" text-gray-500 font-bold animate-pulse">
          membuka berangkas...
        </p>
      </div>
    );
  }

  return (
    <div className="p-5 pb-24">
      {/* JUDUL */}
      <h1 className="text-2xl font-extrabold text-gray-800 mb-6">Halo, Bos!</h1>

      {/* Card Saldo Utama */}
      <div className="bg-emerald-500 rounded-2xl p-6 text-white shadow-lg mb-6 relative">
        <p className="text-emerald-100 text-sm font-medium"> Sisa Saldo Saku</p>
        <h2 className="text-4xl font-black mt-1">{formatRupiah(saldo)}</h2>
        <div className="absolute -right-4 bottom-0 opacity-40 text-8xl">💸</div>
      </div>

      <div className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100 mb-6">
        {/* judulnya */}
        <div className="flex justify-between items-end mb-3">
          <div>
            <h3 className="font-bold text-gray-800">Rasio pengeluaran</h3>
            <p className="text-xs text-gray-400 mt-1">
              {persenPengeluaran >= 80
                ? 'Hati-hati, boros'
                : 'keuangan aman bang'}
            </p>
          </div>
          <p
            className={`text-xl font-black ${persenPengeluaran >= 80 ? 'text-rose-500' : 'text-yellow-500'}`}
          >
            {persenPengeluaran.toFixed(1)}%
          </p>
        </div>
        {/* gambarnya */}
        <div className="w-full bg-gray-100 rounded-full h-3.5 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-100 ${persenPengeluaran >= 80 ? 'bg-rose-600' : 'bg-yellow-400'}`}
            style={{ width: `${persenPengeluaran}%` }}
          ></div>
        </div>
      </div>

      {/* Statistik Mini (Uang Masuk dan Keluar) */}
      <div className="flex gap-4 mb-8">
        {/* Kotak Kiri */}
        <div className="flex-1 bg-white p-4 rounded-2xl shadow-sm border border-gray-300">
          <p className="text-xs text-gray-500">Uang Masuk</p>
          <p className="text-lg font-bold text-green-600">
            {formatRupiah(totalPemasukan)}
          </p>
        </div>

        {/* Kotak Kanan */}
        <div className="flex-1 bg-white p-4 rounded-2xl shadow-sm border border-gray-300">
          <p className="text-xs text-gray-500">Uang Keluar</p>
          <p className="text-lg font-bold text-rose-500">
            {formatRupiah(totalPengeluaran)}
          </p>
        </div>
      </div>

      {/* Tombol Catat */}
      <button
        className="w-full bg-slate-800 text-white font-bold text-lg py-4 rounded-2xl shadow-lg hover:bg-slate-700 transition active:scale-95"
        onClick={() => setIsModalOpen(true)}
      >
        + Catat Transaksi
      </button>

      <Modals
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        fetchData={fetchData}
      />
    </div>
  );
};

export default Dashboard;
