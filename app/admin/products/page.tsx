'use client';
import { useEffect, useState } from 'react';
import { db, storage } from '@/lib/firebase';
import { collection, addDoc, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      const snapshot = await getDocs(collection(db, 'products'));
      setProducts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };
    fetchProducts();
  }, []);

  const handleAddProduct = async (e) => {
    e.preventDefault();
    if (!image) return alert('Pilih gambar produk.');

    const imageRef = ref(storage, `products/${uuidv4()}`);
    await uploadBytes(imageRef, image);
    const imageUrl = await getDownloadURL(imageRef);

    await addDoc(collection(db, 'products'), {
      name,
      price,
      imageUrl,
    });

    setName('');
    setPrice('');
    setImage(null);
    window.location.reload();
  };

  const handleDelete = async (id) => {
    await deleteDoc(doc(db, 'products', id));
    setProducts(products.filter(p => p.id !== id));
  };

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Kelola Produk</h1>
      <form onSubmit={handleAddProduct} className="space-y-4 mb-8">
        <input type="text" placeholder="Nama Produk" value={name} onChange={(e) => setName(e.target.value)} className="w-full border px-4 py-2 rounded-xl" required />
        <input type="text" placeholder="Harga" value={price} onChange={(e) => setPrice(e.target.value)} className="w-full border px-4 py-2 rounded-xl" required />
        <input type="file" onChange={(e) => setImage(e.target.files[0])} className="w-full" required />
        <button type="submit" className="bg-black text-white px-4 py-2 rounded-xl">Tambah Produk</button>
      </form>

      <div className="grid grid-cols-2 gap-4">
        {products.map((product) => (
          <div key={product.id} className="border rounded-xl p-4">
            <img src={product.imageUrl} alt={product.name} className="w-full h-48 object-cover rounded-xl mb-2" />
            <h2 className="text-lg font-bold">{product.name}</h2>
            <p className="text-gray-700">Rp {product.price}</p>
            <a href={`/ar-viewer?model=${encodeURIComponent(product.imageUrl)}`} target="_blank" className="block mt-2 text-blue-600 underline">Lihat dalam AR</a>
            <button onClick={() => handleDelete(product.id)} className="mt-2 text-red-500">Hapus</button>
          </div>
        ))}
      </div>
    </div>
  );
}