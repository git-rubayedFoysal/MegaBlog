import { useState, useEffect } from "react";
import { PostForm } from "../components";
import appwriteService from "../appwrite/config";
import { useNavigate, useParams } from "react-router";

function EditPost() {
  const [post, setPost] = useState(null);
  const { slug } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPost = async () => {
      if (slug) {
        const data = await appwriteService.getPost(slug);

        if (data) {
          setPost(data);
        } else {
          navigate("/");
        }
      }
    };

    fetchPost();
  }, [navigate, slug]);

  return post ? (
    <div className="py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white">Edit Post</h1>
        <p className="text-gray-400 mt-2">Update your post content</p>
      </div>
      <PostForm post={post} />
    </div>
  ) : (
    <div className="text-center py-16">
      <p className="text-gray-400">Loading...</p>
    </div>
  );
}

export default EditPost;
