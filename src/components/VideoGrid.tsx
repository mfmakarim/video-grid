import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { collection, query, orderBy, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

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

const VideoGrid: React.FC = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const q = query(collection(db, 'videos'), orderBy('date', 'desc'));
        const querySnapshot = await getDocs(q);
        const fetchedVideos: Video[] = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          fetchedVideos.push({
            id: doc.id,
            ...data,
            date: data.date.toDate() // Convert Firestore Timestamp to JavaScript Date
          } as Video);
        });
        setVideos(fetchedVideos);
      } catch (err) {
        console.error('Error fetching videos:', err);
        setError('Failed to fetch videos. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  const groupVideosByDate = (videos: Video[]) => {
    const grouped: { [key: string]: Video[] } = {};
    videos.forEach((video) => {
      const dateKey = format(video.date, 'MMMM d, yyyy');
      if (!grouped[dateKey]) {
        grouped[dateKey] = [];
      }
      grouped[dateKey].push(video);
    });
    return grouped;
  };

  if (loading) {
    return <div className="text-center mt-8">Loading...</div>;
  }

  if (error) {
    return <div className="text-center mt-8 text-red-500">{error}</div>;
  }

  if (videos.length === 0) {
    return <div className="text-center mt-8">No videos found.</div>;
  }

  const groupedVideos = groupVideosByDate(videos);

  function getYouTubeThumbnail(url:string) {
    // Function to extract the YouTube video ID
    function extractVideoID(url:string) {
        const regExp = /^.*((youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)|(\?v=))([^#\&\?]*).*/;
        const match = url.match(regExp);
        return (match && match[4].length === 11) ? match[4] : null;
    }

    // Get video ID
    const videoID = extractVideoID(url);

    if (videoID) {
        // Construct the thumbnail URL
        const thumbnailUrl = `https://img.youtube.com/vi/${videoID}/hqdefault.jpg`;
        return thumbnailUrl;
    } else {
        return 'Invalid YouTube URL';
    }
}
  

  return (
    <div className="container mx-auto px-4 py-8">
      {Object.entries(groupedVideos).map(([date, dateVideos]) => (
        <div key={date} className="mb-8">
          <h2 className="text-2xl font-bold mb-4">{date}</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {dateVideos.map((video) => (
              <a
                key={video.id}
                href={video.url}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:scale-105"
              >
                <img
                  src={video.thumbnail || getYouTubeThumbnail(video.url)}
                  alt={video.name}
                  className="w-full h-40 object-cover"
                />
                <div className="p-4">
                  <h3 className="font-semibold text-lg mb-1">{video.name}</h3>
                  <p className="text-sm text-gray-600 mb-1">{video.category}</p>
                  <p className="text-sm text-gray-500 mb-1">{video.comment}</p>
                  <p className="text-xs text-gray-400">Recommended by: {video.recommendedBy}</p>
                </div>
              </a>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default VideoGrid;