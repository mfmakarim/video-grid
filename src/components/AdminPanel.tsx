import React, { useState, useEffect } from 'react';
import { collection, addDoc, query, orderBy, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { db, auth } from '../firebase';
import { Trash2 } from 'lucide-react';
import AdminLogin from './AdminLogin';

interface Video {
  id: string;
  name: string;
  url: string;
  thumbnail: string;
  category: string;
  comment: string;
  recommendedBy: string;
  date: Date;
}

const AdminPanel: React.FC = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [newVideo, setNewVideo] = useState({
    name: '',
    url: '',
    thumbnail: '',
    category: '',
    comment: '',
    recommendedBy: '',
  });
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setIsAuthenticated(!!user);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchVideos();
    }
  }, [isAuthenticated]);

  const fetchVideos = async () => {
    const q = query(collection(db, 'videos'), orderBy('date', 'desc'));
    const querySnapshot = await getDocs(q);
    const fetchedVideos: Video[] = [];
    querySnapshot.forEach((doc) => {
      fetchedVideos.push({ id: doc.id, ...doc.data() } as Video);
    });
    setVideos(fetchedVideos);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewVideo((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'videos'), {
        ...newVideo,
        date: new Date(),
      });
      setNewVideo({
        name: '',
        url: '',
        thumbnail: '',
        category: '',
        comment: '',
        recommendedBy: '',
      });
      fetchVideos();
    } catch (error) {
      console.error('Error adding video: ', error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'videos', id));
      fetchVideos();
    } catch (error) {
      console.error('Error deleting video: ', error);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error signing out: ', error);
    }
  };

  if (!isAuthenticated) {
    return <AdminLogin onLogin={() => setIsAuthenticated(true)} />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Admin Panel</h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
        >
          Logout
        </button>
      </div>
      <form onSubmit={handleSubmit} className="mb-8 bg-white p-6 rounded-lg shadow-md">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            name="name"
            value={newVideo.name}
            onChange={handleInputChange}
            placeholder="Video Name"
            className="w-full p-2 border rounded"
            required
          />
          <input
            type="url"
            name="url"
            value={newVideo.url}
            onChange={handleInputChange}
            placeholder="Video URL"
            className="w-full p-2 border rounded"
            required
          />
          <input
            type="url"
            name="thumbnail"
            value={newVideo.thumbnail}
            onChange={handleInputChange}
            placeholder="Thumbnail URL (optional)"
            className="w-full p-2 border rounded"
          />
          <input
            type="text"
            name="category"
            value={newVideo.category}
            onChange={handleInputChange}
            placeholder="Category"
            className="w-full p-2 border rounded"
            required
          />
          <textarea
            name="comment"
            value={newVideo.comment}
            onChange={handleInputChange}
            placeholder="Comment"
            className="w-full p-2 border rounded"
            rows={3}
          />
          <input
            type="text"
            name="recommendedBy"
            value={newVideo.recommendedBy}
            onChange={handleInputChange}
            placeholder="Recommended By"
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <button
          type="submit"
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
        >
          Add Video
        </button>
      </form>

      <h2 className="text-2xl font-bold mb-4">Existing Videos</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {videos.map((video) => (
          <div key={video.id} className="bg-white p-4 rounded-lg shadow-md">
            <h3 className="font-semibold text-lg mb-2">{video.name}</h3>
            <p className="text-sm text-gray-600 mb-1">{video.category}</p>
            <p className="text-sm text-gray-500 mb-1">{video.comment}</p>
            <p className="text-xs text-gray-400 mb-2">Recommended by: {video.recommendedBy}</p>
            <button
              onClick={() => handleDelete(video.id)}
              className="text-red-500 hover:text-red-700 transition-colors"
            >
              <Trash2 size={20} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminPanel;