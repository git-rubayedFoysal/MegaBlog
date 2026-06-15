import { PostCard } from "../components";
import appwriteService from "../appwrite/config";
import { useState, useEffect } from "react";

function AllPost() {
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

  return (
    <div className="w-full py-8">
      <h1 className="text-3xl font-bold text-white mb-8">All Posts</h1>
      {posts.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-gray-400 text-lg">No posts available.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {posts.map((post) => (
            <PostCard key={post.$id} {...post} />
          ))}
        </div>
      )}
    </div>
  );
}

export default AllPost;
