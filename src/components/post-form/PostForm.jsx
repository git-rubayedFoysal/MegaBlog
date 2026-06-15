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

  const navigate = useNavigate();
  const userData = useSelector((state) => state.auth.userData);

  const { register, handleSubmit, watch, setValue, control } = useForm({
    defaultValues: {
      title: post?.title || "",
      slug: post?.$id || "",
      content: post?.content || "",
      status: post?.status || "active",
      image: null,
    },
  });

  const watchTitle = watch("title");
  const watchContent = watch("content");

  // Title count
  useEffect(() => {
    setTitleCount(watchTitle?.length || 0);
  }, [watchTitle]);

  // Word count (SAFE)
  useEffect(() => {
    const plainText = (watchContent || "").replace(/<[^>]*>/g, "");

    const wordCount = plainText.trim().split(/\s+/).filter(Boolean).length;

    setContentWordCount(wordCount);
  }, [watchContent]);

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
    const subscription = watch((value, { name }) => {
      if (name === "title") {
        setValue("slug", slugTransform(value.title || ""));
      }
    });

    return () => subscription.unsubscribe();
  }, [watch, setValue, slugTransform]);

  // ✅ IMAGE CHANGE FIXED
  const handleImageChange = (e) => {
    const fileList = e.target.files;

    if (fileList && fileList.length > 0) {
      const files = Array.from(fileList); // FIX

      setValue("image", files);

      const file = files[0];

      const reader = new FileReader();
      reader.onload = (event) => {
        setImagePreview(event.target?.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Drag handlers
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  // ✅ DROP FIXED
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = e.dataTransfer.files;

    if (files && files.length > 0) {
      const fileArray = Array.from(files); // FIX

      setValue("image", fileArray);

      const file = fileArray[0];

      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = (event) => {
          setImagePreview(event.target?.result);
        };
        reader.readAsDataURL(file);
      }
    }
  };

  // Submit
  const submit = async (data) => {
    setSubmitError("");
    setIsSubmitting(true);

    try {
      const { title, content, slug, status } = data;

      const safeSlug = sanitizeSlug(slug);

      if (!safeSlug) throw new Error("Invalid slug");

      setValue("slug", safeSlug);

      const file = data.image?.[0]
        ? await appwriteService.uploadFile(data.image[0])
        : null;

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

  return (
    <form
      onSubmit={handleSubmit(submit)}
      className="grid grid-cols-1 lg:grid-cols-3 gap-8"
    >
      {/* ERROR */}
      {submitError && (
        <div className="col-span-full p-4 bg-red-500/10 border border-red-500/50 rounded">
          {submitError}
        </div>
      )}

      {/* LEFT SIDE */}
      <div className="lg:col-span-2 space-y-6">
        <Input placeholder="Title" {...register("title", { required: true })} />

        <Input placeholder="Slug" {...register("slug", { required: true })} />

        {/* RTE */}
        <RTE name="content" control={control} />

        <p className="text-sm text-gray-400">{contentWordCount} words</p>
      </div>

      {/* RIGHT SIDE */}
      <div className="space-y-4">
        {/* IMAGE UPLOAD */}
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          className="border p-4 rounded"
        >
          <input
            type="file"
            accept="image/*"
            {...register("image", { required: !post })}
            onChange={handleImageChange}
          />

          {imagePreview && (
            <img src={imagePreview} className="mt-2 rounded" alt="preview" />
          )}
        </div>

        <Select options={["active", "inactive"]} {...register("status")} />

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Publishing..." : "Publish"}
        </Button>
      </div>
    </form>
  );
}

export default PostForm;
