import userEvent from "@testing-library/user-event";
import AuthContext from "context/AuthContext";
import { arrayUnion, doc, updateDoc } from "firebase/firestore";
import { db } from "firebaseApp";
import { PostProps } from "pages/home"
import { useContext, useState } from "react";
import { toast } from "react-toastify";

export interface CommentFormProps {
	post: PostProps | null;
}

export function CommentForm({ post }: CommentFormProps) {
  const [comment, setComment] = useState<string>("")
  const { user } = useContext(AuthContext);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		try {
			if (post) {
        const postRef = doc(db, "posts", post?.id);
        
        const commentObj = {
					comment: comment,
					uid: user?.uid,
					email: user?.email,
					createdAt: new Date()?.toLocaleDateString("ko", {
						hour: "2-digit",
						minute: "2-digit",
						second: "2-digit",
					}),
        };
        
        await updateDoc(postRef, {
					comments: arrayUnion(commentObj),
					updatedAt: new Date()?.toLocaleDateString("ko", {
						hour: "2-digit",
						minute: "2-digit",
						second: "2-digit",
					}),
        });
        
        setComment("")
				toast.success("댓글을 입력했습니다.");
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
			setComment(value);
		}
  };
  
  return (
		<form className="post-form" onSubmit={onSubmit}>
			<div className="post-form__input-area">
				<textarea
					name="content"
					id="content"
					className="post-form__textarea"
					placeholder="답글 게시하기"
					value={comment}
					onChange={onChange}
				></textarea>
			</div>
			<div className="post-form__submit-area">
				<div></div>
				<input
					type="submit"
					value="게시하기"
					className="post-form__submit-btn"
					disabled={!comment}
				/>
			</div>
		</form>
	);
}