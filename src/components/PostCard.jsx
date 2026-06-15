import appwriteService from "../appwrite/config";
import { Link } from "react-router";

function PostCard({ $id, title, featuredImage }) {
  return (
    <Link to={`/post/${$id}`}>
      <div className="card group cursor-pointer overflow-hidden h-full">
        <div className="relative mb-4 overflow-hidden rounded-lg">
          <img
            src={appwriteService.getFilePreview(featuredImage)}
            alt={title}
            className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
          />
        </div>
        <h2 className="text-lg font-bold text-white group-hover:text-primary-400 transition-colors duration-200 line-clamp-2">
          {title}
        </h2>
      </div>
    </Link>
  );
}

export default PostCard;
