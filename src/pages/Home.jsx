import { useState, useEffect } from "react";
import appwriteService from "../appwrite/config";
import { PostCard } from "../components";

function Home() {
  const [posts, setPosts] = useState([]);
  useEffect(() => {
    const fetchPosts = async () => {
      const data = await appwriteService.listPosts([]);

      if (data) {
        setPosts(data.documents);
      }
    };
    fetchPosts();
  }, []);

  return posts.length === 0 ? (
    <div className="w-full py-16 text-center">
      <div className="flex justify-center mb-6">
        <div className="text-6xl">📝</div>
      </div>
      <h1 className="text-3xl font-bold text-white mb-2">No Posts Yet</h1>
      <p className="text-gray-400 text-lg">
        Login to see posts or create a new one.
      </p>
    </div>
  ) : (
    <div className="w-full py-8">
      <h1 className="text-3xl font-bold text-white mb-8">Recent Posts</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {posts.map((post) => (
          <PostCard key={post.$id} {...post} />
        ))}
      </div>
    </div>
  );
}

export default Home;
