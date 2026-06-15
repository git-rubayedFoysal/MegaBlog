import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { useSelector } from "react-redux";
import { Button } from "../components";
import appwriteService from "../appwrite/config";
import parse from "html-react-parser";

function Post() {
  const [post, setPost] = useState(null);
  const navigate = useNavigate();
  const { slug } = useParams();
  const userData = useSelector((state) => state.auth.userData);
  const isAuthor = post && userData ? post.userId === userData.$id : false;
  useEffect(() => {
    if (slug) {
      const fetchPost = async () => {
        const data = await appwriteService.getPost(slug);
        if (data) {
          setPost(data);
        } else navigate("/");
      };

      fetchPost();
    } else navigate("/");
  }, [slug, navigate]);

  const deletePost = () => {
    const fetchDelete = async () => {
      const status = await appwriteService.deletePost(post.$id);
      if (status) {
        await appwriteService.deleteFile(post.featuredImage);
        navigate("/");
      }
    };

    fetchDelete();
  };

  return post ? (
    <div className="py-12">
      <div className="w-full mb-8 relative">
        <div className="overflow-hidden rounded-2xl shadow-2xl mb-6">
          <img
            src={appwriteService.getFilePreview(post.featuredImage)}
            alt={post.title}
            className="w-full h-96 object-cover"
          />
        </div>

        {isAuthor && (
          <div className="flex justify-end gap-4 mb-6">
            <Link to={`/edit-post/${post.$id}`}>
              <Button bgColor="bg-primary-600" className="hover:bg-primary-700">
                ✏️ Edit
              </Button>
            </Link>
            <Button
              bgColor="bg-red-600"
              onClick={deletePost}
              className="hover:bg-red-700"
            >
              🗑️ Delete
            </Button>
          </div>
        )}
      </div>
      <div className="w-full mb-8">
        <h1 className="text-4xl font-bold text-white mb-4">{post.title}</h1>
        <p className="text-gray-400">By {userData?.name || "Anonymous"}</p>
      </div>
      <div className="prose prose-invert max-w-none">{parse(post.content)}</div>
    </div>
  ) : (
    <div className="text-center py-16">
      <p className="text-gray-400">Loading...</p>
    </div>
  );
}
export default Post;
