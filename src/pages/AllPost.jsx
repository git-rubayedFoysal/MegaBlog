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

export default AllPost;
