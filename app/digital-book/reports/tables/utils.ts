// Fungsi untuk memformat angka menjadi format Rupiah tanpa 'Rp'
export const formatRupiah = (value: number) => {
  if (value === 0) {
    return '-'; // Jika nilai 0, tampilkan "-"
  }
  // Pisahkan Rp dan nominal agar bisa diberikan style yang berbeda
  const formattedValue = new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(value);
  return formattedValue.replace('Rp', ''); // Hilangkan 'Rp' agar bisa ditangani terpisah di JSX
};
