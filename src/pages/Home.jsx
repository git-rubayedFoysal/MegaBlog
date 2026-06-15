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
    <div className="w-full py-8 text-center">
      <div className="flex flex-wrap">
        <div className="w-full p-2">
          <h1 className="text-2xl font-bold hover:text-gray-500">
            Login to see posts or create a new one.
          </h1>
        </div>
      </div>
    </div>
  ) : (
    <div className="w-full py-8">
      <div className="flex flex-wrap">
        {posts.map((post) => (
          <div key={post.$id} className="p-2 w-1/4">
            <PostCard {...post} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;
