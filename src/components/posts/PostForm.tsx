import AuthContext from "context/AuthContext";
import { addDoc, collection } from "firebase/firestore";
import { db } from "firebaseApp";
import { useContext, useState } from "react";
import { FiImage } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function PostForm() {
	const [content, setContent] = useState<string>("")
	const { user } = useContext(AuthContext);
  const handleFileUpload = () => { };
	const navigate = useNavigate();
	
	const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		try {
			await addDoc(collection(db, "posts"), {
				content: content,
				createdAt: new Date()?.toLocaleDateString("ko", {
					hour: "2-digit",
					minute: "2-digit",
					second: "2-digit",
				}),
				email: user?.email,
				uid: user?.uid,
			});

			setContent("")

			toast.success("게시글을 생성했습니다.");
			navigate("/");	
		} catch (e:any) {
			console.log(e)
		}
	};

	const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		const { target: { name, value }, } = e;

		if (name === "content") {
			setContent(value)
		}
	}
	
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