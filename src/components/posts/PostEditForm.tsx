import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "firebaseApp";
import { PostProps } from "pages/home";
import { useCallback, useContext, useEffect, useState } from "react";
import { FiImage } from "react-icons/fi";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

export default function PostEditForm() {
  const params = useParams()
  const [post, setPost] = useState<PostProps | null>(null);
	const [content, setContent] = useState<string>("");
	const handleFileUpload = () => {};
	const navigate = useNavigate();

  const getPost = useCallback(async () => {
    if (params.id) {
      const docRef = doc(db, "posts", params.id)
      const docSnap = await getDoc(docRef);
      setPost({ ...(docSnap?.data() as PostProps), id: docSnap.id })
      setContent(docSnap?.data()?.content)
    }
  }, [params.id])
  
	const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

    try {
      if (post) {
        const postRef = doc(db, "posts", post?.id)
        await updateDoc(postRef, {
					content: content,
					updatedAt: new Date()?.toLocaleDateString("ko", {
						hour: "2-digit",
						minute: "2-digit",
						second: "2-digit",
					}),
				});

        toast.success("게시글을 수정했습니다.");
				navigate(`/posts/${post.id}`);
      }
		} catch (e: any) {
			console.log(e);
		}
	};

	const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		const {
			target: { name, value },
		} = e;

		if (name === "content") {
			setContent(value);
		}
	};

  useEffect(() => {
		if (params.id) {
			getPost();
		}
	}, [getPost, params.id]);
  
	return (
		<form action="" className="post-form" onSubmit={onSubmit}>
			<textarea
				name="content"
				id="content"
				className="post-form__textarea"
				placeholder="무슨 일이 일어나고 있나요?"
				onChange={onChange}
				value={content}
			></textarea>
			<div className="post-form__submit-area">
				<label htmlFor="file-input" className="post-form__file">
					<FiImage className="post-form__file-icon" />
				</label>
				<input
					type="file"
					name="file-input"
					accept="image/*"
					onChange={handleFileUpload}
					className="hidden"
				/>
				<input
					type="submit"
					value="게시하기"
					className="post-form__submit-btn"
				/>
			</div>
		</form>
	);
}
