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
    <div className="py-8">
      <div className="w-full flex justify-center mb-4 relative border rounded-xl p-2">
        <img
          src={appwriteService.getFilePreview(post.featuredImage)}
          alt={post.title}
          className="rounded-xl"
        />

        {isAuthor && (
          <div className="absolute right-6 top-6">
            <Link to={`/edit-post/${post.$id}`}>
              <Button bgColor="bg-green-500" className="mr-3">
                Edit
              </Button>
            </Link>
            <Button bgColor="bg-red-500" onClick={deletePost}>
              Delete
            </Button>
          </div>
        )}
      </div>
      <div className="w-full mb-6">
        <h1 className="text-2xl font-bold">{post.title}</h1>
      </div>
      <div className="browser-css">{parse(post.content)}</div>
    </div>
  ) : null;
}
export default Post;
