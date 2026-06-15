import { useCallback, useEffect, useState } from "react";
import { Button, Select, Input, RTE } from "../index";
import appwriteService from "../../appwrite/config";
import { useNavigate } from "react-router";
import { useSelector } from "react-redux";
import { useForm, useWatch } from "react-hook-form";

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

  const navigate = useNavigate();
  const userData = useSelector((state) => state.auth.userData);

  const {
    register,
    handleSubmit,
    setValue,
    control,
  } = useForm({
    defaultValues: {
      title: post?.title || "",
      slug: post?.$id || "",
      content: post?.content || "",
      status: post?.status || "active",
      image: null,
    },
  });

  const watchTitle = useWatch({ control, name: "title" });
  const watchContent = useWatch({ control, name: "content" });

  const titleCount = watchTitle?.length || 0;
  const contentWordCount = (watchContent || "")
    .replace(/<[^>]*>/g, "")
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;

  // Slug auto update
  const slugTransform = useCallback((value) => {
    if (typeof value !== "string") return "";

    return value
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }, []);

  useEffect(() => {
    setValue("slug", slugTransform(watchTitle || ""));
  }, [watchTitle, setValue, slugTransform]);

  const imageRegister = register("image", { required: !post });

  const handleImageChange = (e) => {
    // Call RHF's own onChange first so it captures the FileList
    imageRegister.onChange(e);
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => setImagePreview(event.target?.result);
      reader.readAsDataURL(file);
    }
  };

  // Drag handlers (UNCHANGED)
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
    if (files && files.length > 0) {
      // Manually set value since drag-drop bypasses the input onChange
      setValue("image", files, { shouldValidate: true });
      const file = files[0];
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = (event) => setImagePreview(event.target?.result);
        reader.readAsDataURL(file);
      }
    }
  };

  // Submit (UNCHANGED logic, safe)
  const submit = async (data) => {
    setSubmitError("");
    setIsSubmitting(true);

    try {
      const { title, content, slug, status } = data;

      console.log("[PostForm] submit data:", {
        title,
        slug,
        status,
        image: data.image,
        userId: userData?.$id,
      });

      const safeSlug = sanitizeSlug(slug);
      if (!safeSlug) throw new Error("Invalid slug — title may be empty");

      setValue("slug", safeSlug);

      if (!userData?.$id) throw new Error("Not logged in — userId is missing");

      // data.image can be FileList or Array depending on input method
      const imageFile =
        data.image instanceof FileList
          ? data.image[0]
          : Array.isArray(data.image)
            ? data.image[0]
            : null;

      console.log("[PostForm] imageFile:", imageFile);

      const file = imageFile
        ? await appwriteService.uploadFile(imageFile)
        : null;
      console.log("[PostForm] uploaded file:", file);

      if (post) {
        if (file) {
          await appwriteService.deleteFile(post.featuredImage);
        }

        const dbPost = await appwriteService.updatePost(post.$id, {
          title,
          content,
          status,
          featuredImage: file ? file.$id : post.featuredImage,
        });

        if (dbPost) navigate(`/post/${dbPost.$id}`);
      } else {
        if (!file) throw new Error("Image required");

        const dbPost = await appwriteService.createPost({
          title,
          content,
          slug: safeSlug,
          status,
          featuredImage: file.$id,
          userId: userData?.$id,
        });

        if (dbPost) navigate(`/post/${dbPost.$id}`);
      }
    } catch (error) {
      console.error(error);
      setSubmitError(error.message || "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  const isEditing = Boolean(post);

  return (
    <form onSubmit={handleSubmit(submit)} className="space-y-8">
      {submitError && (
        <div className="rounded-3xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-200">
          {submitError}
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-[1.8fr_1fr] gap-8">
        <section className="rounded-4xl border border-slate-800/80 bg-slate-950/80 p-8 shadow-2xl shadow-slate-950/20">
          <div className="mb-8 flex flex-col gap-3">
            <div>
              <p className="text-sm uppercase tracking-[0.24em] text-blue-400">
                Post details
              </p>
              <h2 className="mt-2 text-3xl font-semibold text-white">
                {isEditing ? "Edit post" : "Create a new post"}
              </h2>
            </div>
            <p className="max-w-2xl text-sm text-slate-400">
              Write a strong title, choose a memorable slug, and add rich
              content with the editor below.
            </p>
          </div>

          <div className="grid gap-6">
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-slate-200">
                Post title
              </label>
              <Input
                placeholder="Write a compelling title"
                {...register("title", { required: true })}
              />
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>{titleCount} / 70 characters</span>
                <span
                  className={
                    titleCount > 70 ? "text-red-400" : "text-slate-500"
                  }
                >
                  {titleCount > 70 ? "Too long" : "Keep it concise"}
                </span>
              </div>
            </div>

            <div className="space-y-3">
              <label className="block text-sm font-semibold text-slate-200">
                URL slug
              </label>
              <Input
                placeholder="your-post-slug"
                {...register("slug", { required: true })}
              />
              <p className="text-xs text-slate-500">
                This is used to create the post URL. It updates automatically
                from the title.
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="block text-sm font-semibold text-slate-200">
                  Post content
                </label>
                <span className="text-xs text-slate-500">
                  {contentWordCount} words
                </span>
              </div>
              <div className="rounded-3xl border border-slate-800/70 bg-slate-900/90 p-2">
                <RTE name="content" control={control} />
              </div>
            </div>
          </div>
        </section>

        <aside className="space-y-6">
          <section className="rounded-4xl border border-slate-800/80 bg-slate-950/80 p-6 shadow-2xl shadow-slate-950/20">
            <div className="mb-6 flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-blue-400">
                  Media
                </p>
                <h3 className="text-xl font-semibold text-white">
                  Featured image
                </h3>
              </div>
              <span className="rounded-full bg-blue-600/15 px-3 py-1 text-xs text-blue-200">
                {isEditing ? "Update" : "Upload"}
              </span>
            </div>

            <label
              htmlFor="post-image"
              className={`group block cursor-pointer rounded-3xl border-2 border-dashed p-6 text-center transition-all ${
                dragActive
                  ? "border-blue-400/80 bg-blue-500/10"
                  : "border-slate-700 bg-slate-900/80"
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <input
                id="post-image"
                type="file"
                accept="image/*"
                className="hidden"
                {...imageRegister}
                onChange={handleImageChange}
              />
              <div className="flex flex-col items-center justify-center gap-3">
                <span className="text-3xl text-blue-300">📷</span>
                <p className="text-sm font-semibold text-slate-100">
                  Drag & drop an image or click to browse
                </p>
                <p className="text-xs text-slate-500">
                  PNG, JPG, GIF, WEBP up to 10MB
                </p>
              </div>
            </label>

            {imagePreview && (
              <div className="mt-4 overflow-hidden rounded-3xl border border-slate-700 bg-slate-950">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="h-56 w-full object-cover"
                />
              </div>
            )}
          </section>

          <section className="rounded-4xl border border-slate-800/80 bg-slate-950/80 p-6 shadow-2xl shadow-slate-950/20">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-blue-400">
                  Settings
                </p>
                <h3 className="text-xl font-semibold text-white">
                  Publication
                </h3>
              </div>
              <span className="rounded-full bg-slate-800 px-3 py-1 text-xs text-slate-400">
                Status
              </span>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-200 mb-2">
                  Post status
                </label>
                <Select
                  options={["active", "inactive"]}
                  {...register("status")}
                />
              </div>

              <div className="rounded-3xl border border-slate-800/70 bg-slate-900/90 p-4">
                <p className="text-sm text-slate-400">Ready to publish?</p>
                <p className="text-xs text-slate-500 mt-2">
                  When published, your post will be visible to all users
                  immediately.
                </p>
              </div>
            </div>
          </section>

          <div className="rounded-4xl border border-slate-800/80 bg-slate-950/80 p-6 shadow-2xl shadow-slate-950/20">
            <Button
              type="submit"
              disabled={isSubmitting}
              bgColor={isSubmitting ? "bg-slate-600" : "bg-blue-600"}
              textColor="text-white"
              className="w-full py-4 text-base font-semibold"
            >
              {isSubmitting
                ? "Publishing..."
                : isEditing
                  ? "Update Post"
                  : "Publish Post"}
            </Button>
          </div>
        </aside>
      </div>
    </form>
  );
}

export default PostForm;
