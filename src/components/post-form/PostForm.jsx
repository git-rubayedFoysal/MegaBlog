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

  const submit = async (data) => {
    setSubmitError("");
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

  return (
    <form onSubmit={handleSubmit(submit)} className="flex flex-wrap">
      {submitError && (
        <div className="w-full px-2 mb-4">
          <p className="text-red-500 bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-2 text-sm">
            {submitError}
          </p>
        </div>
      )}
      <div className="w-2/3 px-2">
        <Input
          label="Title: "
          placeholder="Enter title."
          {...register("title", { required: true })}
          className="mb-4"
        />
        <Input
          label="Slug: "
          placeholder="Slug."
          {...register("slug", { required: true })}
        />

        <RTE
          name="content"
          label="Content"
          control={control}
          defaultValue={getValues("content")}
        />
      </div>
      <div className="w-1/3 px-2">
        <Input
          label="Featured Image"
          type="file"
          className="mb-4 text-sm text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-lg  file:border-0 file:bg-[#333] file:text-white file:hover:bg-[#444] file:cursor-pointer cursor-pointer"
          accept="image/png, image/jpg, image/jpeg, image/gif"
          {...register("image", { required: !post })}
        />

        {post && (
          <div className="w-full mb-4">
            <img
              src={appwriteService.getFilePreview(post.featuredImage)}
              alt={post.title}
              className="rounded-lg object-cover h-30"
            />
          </div>
        )}

        <Select
          label="Status: "
          className="mb-4"
          options={["active", "inactive"]}
          {...register("status", { required: true })}
        />

        <Button
          type="submit"
          bgColor={post ? "bg-green-500" : undefined}
          className="w-full cursor-pointer"
        >
          {post ? "Update" : "Submit"}
        </Button>
      </div>
    </form>
  );
}

export default PostForm;
