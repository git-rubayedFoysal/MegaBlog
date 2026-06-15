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
    <div className="py-8">
      <PostForm post={post} />
    </div>
  ) : null;
}

export default EditPost;
