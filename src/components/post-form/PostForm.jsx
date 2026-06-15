import { useCallback, useEffect, useState } from "react";
import { Button, Select, Input, RTE } from "../index";
import appwriteService from "../../appwrite/config";
import { useNavigate } from "react-router";
import { useSelector } from "react-redux";
import { useForm } from "react-hook-form";

function PostForm({ post }) {
  const sanitizeSlug = useCallback((value) => {
    if (typeof value !== "string") return "";

    return value
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }, []);

  const [submitError, setSubmitError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [titleCount, setTitleCount] = useState(post?.title?.length || 0);
  const [contentWordCount, setContentWordCount] = useState(0);

  const { register, handleSubmit, watch, setValue, getValues, control } =
    useForm({
      defaultValues: {
        title: post?.title || "",
        slug: post?.$id || "",
        content: post?.content || "",
        status: post?.status || "active",
      },
    });
  const navigate = useNavigate();
  const userData = useSelector((state) => state.auth.userData);
  const watchTitle = watch("title");
  const watchContent = watch("content");

  // Update character count
  useEffect(() => {
    setTitleCount(watchTitle?.length || 0);
  }, [watchTitle]);

  // Update word count
  useEffect(() => {
    const plainText = watchContent?.replace(/<[^>]*>/g, "") || "";
    const wordCount = plainText
      .trim()
      .split(/\s+/)
      .filter((word) => word.length > 0).length;
    setContentWordCount(wordCount);
  }, [watchContent]);

  const submit = async (data) => {
    setSubmitError("");
    setIsSubmitting(true);
    try {
      const { title, content, slug, status } = data;
      const safeSlug = sanitizeSlug(slug);
      if (!safeSlug) {
        throw new Error("Invalid slug. Use only letters, numbers, and dashes.");
      }
      setValue("slug", safeSlug, { shouldValidate: true });

      if (post) {
        const file = data.image[0]
          ? await appwriteService.uploadFile(data.image[0])
          : null;

        if (file) {
          await appwriteService.deleteFile(post.featuredImage);
        }

        const dbPost = await appwriteService.updatePost(post.$id, {
          title,
          content,
          status,
          featuredImage: file ? file.$id : post.featuredImage,
        });

        if (dbPost) {
          navigate(`/post/${dbPost.$id}`);
        } else {
          throw new Error("Post update failed — updatePost returned falsy");
        }
      } else {
        if (!data.image[0]) {
          throw new Error("No image selected");
        }
        const file = await appwriteService.uploadFile(data.image[0]);
        const imageId = file?.$id || file?.id;
        if (!imageId) {
          throw new Error(
            "File upload failed — unable to resolve uploaded file ID.",
          );
        }
        const dbPost = await appwriteService.createPost({
          title,
          content,
          slug: safeSlug,
          status,
          featuredImage: imageId,
          userId: userData?.$id,
        });

        if (dbPost) {
          navigate(`/post/${dbPost.$id}`);
        } else {
          throw new Error("Post update failed — updatePost returned falsy");
        }
      }
    } catch (error) {
      console.error("PostForm submit error:", error);
      setSubmitError(
        error?.message || "Something went wrong. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const slugTransform = useCallback((value) => {
    if (value && typeof value === "string") {
      return value
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
    }

    return "";
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/incompatible-library
    const subscription = watch((value, { name }) => {
      if (name === "title") {
        setValue("slug", slugTransform(value.title), {
          shouldValidate: true,
        });
      }
    });

    return () => subscription.unsubscribe();
  }, [watch, slugTransform, setValue]);

  // Handle file input change
  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImagePreview(event.target?.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle drag and drop
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = e.dataTransfer.files;
    if (files && files[0]) {
      const file = files[0];
      if (file.type.startsWith("image/")) {
        // Manually trigger change event
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(file);
        const input = document.querySelector('input[type="file"]');
        if (input) {
          input.files = dataTransfer.files;
          handleImageChange({ target: { files: dataTransfer.files } });
        }
      }
    }
  };

  return (
    <form
      onSubmit={handleSubmit(submit)}
      className="grid grid-cols-1 lg:grid-cols-3 gap-8"
    >
      {submitError && (
        <div className="col-span-full">
          <div className="p-4 bg-red-500/10 border border-red-500/50 rounded-lg flex gap-3">
            <span className="text-xl">⚠️</span>
            <p className="text-red-400">{submitError}</p>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="lg:col-span-2 space-y-6">
        {/* Title Section */}
        <div className="bg-dark-700/30 rounded-xl p-6 border border-dark-600">
          <div className="flex justify-between items-start mb-2">
            <label className="text-sm font-semibold text-gray-300">
              Post Title
            </label>
            <span
              className={`text-xs font-medium ${
                titleCount > 60
                  ? "text-yellow-400"
                  : titleCount > 70
                    ? "text-red-400"
                    : "text-gray-500"
              }`}
            >
              {titleCount}/70
            </span>
          </div>
          <Input
            placeholder="Write a compelling title that captures attention..."
            maxLength="70"
            {...register("title", { required: true })}
          />
          <p className="text-xs text-gray-500 mt-2">
            💡 A good title is clear, specific, and makes readers want to learn
            more
          </p>
        </div>

        {/* Slug Section */}
        <div className="bg-dark-700/30 rounded-xl p-6 border border-dark-600">
          <div className="flex items-center gap-2 mb-2">
            <label className="text-sm font-semibold text-gray-300">
              URL Slug
            </label>
            <span className="text-xs bg-primary-500/20 text-primary-300 px-2 py-1 rounded">
              Auto-generated
            </span>
          </div>
          <Input
            placeholder="url-slug-from-title"
            {...register("slug", { required: true })}
          />
          <p className="text-xs text-gray-500 mt-2">
            📎 Automatically created from your title. Keep it short and
            SEO-friendly
          </p>
        </div>

        {/* Content Section */}
        <div className="bg-dark-700/30 rounded-xl p-6 border border-dark-600">
          <div className="flex justify-between items-start mb-3">
            <label className="text-sm font-semibold text-gray-300">
              Post Content
            </label>
            <span className="text-xs text-gray-500">
              {contentWordCount} words
            </span>
          </div>
          <RTE
            name="content"
            control={control}
            defaultValue={getValues("content")}
          />
          <p className="text-xs text-gray-500 mt-2">
            ✨ Use formatting, headings, and lists to make your content more
            readable
          </p>
        </div>
      </div>

      {/* Sidebar */}
      <div className="lg:col-span-1 space-y-6">
        {/* Featured Image Card */}
        <div className="bg-dark-700/30 rounded-xl p-6 border border-dark-600">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <span>🖼️</span> Featured Image
          </h3>

          {/* Image Preview or Upload Area */}
          {imagePreview || (post && post.featuredImage) ? (
            <div className="mb-4">
              <img
                src={
                  imagePreview ||
                  appwriteService.getFilePreview(post.featuredImage)
                }
                alt="Preview"
                className="w-full h-40 object-cover rounded-lg mb-3"
              />
              <Button
                type="button"
                onClick={() => setImagePreview(null)}
                bgColor="bg-transparent"
                textColor="text-red-400"
                className="text-sm p-0 hover:text-red-300 transition-colors"
              >
                Change Image
              </Button>
            </div>
          ) : null}

          {/* Drag and Drop Area */}
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-all ${
              dragActive
                ? "border-primary-400 bg-primary-500/10"
                : "border-dark-500 hover:border-dark-400"
            }`}
          >
            <input
              type="file"
              accept="image/png, image/jpg, image/jpeg, image/gif, image/webp"
              {...register("image", { required: !post })}
              onChange={handleImageChange}
              className="hidden"
              id="image-input"
            />
            <label htmlFor="image-input" className="cursor-pointer block">
              <div className="text-3xl mb-2">⬆️</div>
              <p className="text-sm font-medium text-gray-300">
                {dragActive ? "Drop your image here" : "Drag & drop your image"}
              </p>
              <p className="text-xs text-gray-500 mt-1">or click to browse</p>
              <p className="text-xs text-gray-600 mt-2">
                PNG, JPG, GIF, WebP up to 10MB
              </p>
            </label>
          </div>
        </div>

        {/* Settings Card */}
        <div className="bg-dark-700/30 rounded-xl p-6 border border-dark-600">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <span>⚙️</span> Settings
          </h3>
          <div>
            <label className="text-sm font-semibold text-gray-300 mb-2 block">
              Post Status
            </label>
            <Select
              options={["active", "inactive"]}
              {...register("status", { required: true })}
            />
            <p className="text-xs text-gray-500 mt-2">
              Active posts are visible to everyone
            </p>
          </div>
        </div>

        {/* Stats Card */}
        <div className="bg-linear-to-br from-primary-500/10 to-secondary-500/10 rounded-xl p-6 border border-primary-500/20">
          <h3 className="text-sm font-semibold text-gray-300 mb-3">
            Content Stats
          </h3>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-400">Title Length</span>
              <span className="text-sm font-medium text-primary-400">
                {titleCount}/70
              </span>
            </div>
            <div className="w-full bg-dark-600 rounded-full h-1">
              <div
                className={`h-1 rounded-full transition-all ${
                  titleCount > 70 ? "bg-red-500" : "bg-primary-500"
                }`}
                style={{ width: `${Math.min((titleCount / 70) * 100, 100)}%` }}
              ></div>
            </div>
            <div className="flex justify-between items-center pt-2">
              <span className="text-xs text-gray-400">Word Count</span>
              <span className="text-sm font-medium text-secondary-400">
                {contentWordCount}
              </span>
            </div>
          </div>
        </div>

        {/* Publish Button */}
        <Button
          type="submit"
          disabled={isSubmitting}
          bgColor={isSubmitting ? "bg-gray-600" : "bg-blue-600"}
          className={`w-full cursor-pointer py-3 font-semibold transition-all ${
            isSubmitting ? "opacity-70" : "hover:shadow-glow"
          }`}
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center gap-2">
              <span className="animate-spin">⏳</span>
              Publishing...
            </span>
          ) : (
            <span className="flex items-center justify-center gap-2">
              <span>🚀</span>
              {post ? "Update Post" : "Publish Post"}
            </span>
          )}
        </Button>

        {/* Helpful Tip */}
        <div className="bg-blue-500/5 border border-blue-500/20 rounded-lg p-4">
          <p className="text-xs text-blue-300">
            💡 <strong>Tip:</strong> Posts with good titles, engaging images,
            and 300+ words perform better!
          </p>
        </div>
      </div>
    </form>
  );
}

export default PostForm;
