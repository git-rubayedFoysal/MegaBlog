import { PostForm } from "../components";

function AddPost() {
  return (
    <div className="min-h-screen bg-linear-to-b from-dark-950 to-dark-900 py-12">
      {/* Hero Section */}
      <div className="mb-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">✍️</div>
            <h1 className="text-5xl font-bold bg-linear-to-r from-primary-400 to-secondary-400 bg-clip-text text-transparent mb-3">
              Create New Post
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Share your ideas, experiences, and knowledge with the world. Craft
              engaging content that resonates with your audience.
            </p>
          </div>

          {/* Quick Tips */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
            <div className="bg-primary-500/10 border border-primary-500/20 rounded-lg p-4">
              <div className="text-2xl mb-2">💡</div>
              <h3 className="font-semibold text-white mb-1">Catchy Title</h3>
              <p className="text-sm text-gray-400">
                Keep it clear and compelling
              </p>
            </div>
            <div className="bg-secondary-500/10 border border-secondary-500/20 rounded-lg p-4">
              <div className="text-2xl mb-2">🖼️</div>
              <h3 className="font-semibold text-white mb-1">Great Image</h3>
              <p className="text-sm text-gray-400">First impression matters</p>
            </div>
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
              <div className="text-2xl mb-2">📝</div>
              <h3 className="font-semibold text-white mb-1">Rich Content</h3>
              <p className="text-sm text-gray-400">Tell your story in detail</p>
            </div>
          </div>
        </div>
      </div>

      {/* Form Section */}
      <div className="max-w-6xl mx-auto px-4">
        <div className="bg-dark-800/50 border border-dark-700 rounded-2xl p-8">
          <PostForm />
        </div>
      </div>
    </div>
  );
}

export default AddPost;
