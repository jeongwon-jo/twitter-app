import { spawn } from "child_process";
import AuthContext from "context/AuthContext";
import { addDoc, collection } from "firebase/firestore";
import { db } from "firebaseApp";
import { useContext, useState } from "react";
import { FiImage } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function PostForm() {
	const [content, setContent] = useState<string>("")
	const [tags, setTags] = useState<string[]>([]);
	const [hashTag, setHashTag] = useState<string>("");
	const { user } = useContext(AuthContext);
  const handleFileUpload = () => { };
	const navigate = useNavigate();
	
	const handleKeyUp = (e: any) => {
		// 스페이스바를 누르고 값이 있으면
		if (e.keyCode === 32 && e.target.value.trim() !== '') {
			// 만약 같은 태그가 있다면 에러를 띄운다
			if (tags?.includes(e.target.value?.trim())) {
				toast.error("같은 태그가 있습니다.")
			} else {
				// 아니라면 태그를 생성해 준다.
				setTags((prev) => (prev?.length > 0 ? [...prev, hashTag] : [hashTag]))
				setHashTag("")
			}
		}
	};

	const onchangeHashTag = (e: any) => {
		setHashTag(e?.target?.value?.trim())
	};

	const removeTag = (tag: string) => {
		setTags(tags?.filter((val) => val !== tag));
	};
	
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
				hashTags: tags,
			});

			setTags([])
			setHashTag("")
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
			<div className="post-form__hashtags">
				<div className="post-form__hashtags-outputs">
					{tags?.map((tag, index) => (
						<span
							className="post-form__hashtags-tag"
							key={index}
							onClick={() => removeTag(tag)}
						>
							#{tag}
						</span>
					))}
				</div>
				<input
					type="text"
					className="post-form__input"
					name="hashtag"
					id="hashtag"
					placeholder="해시태그 + 스페이스바 입력"
					onChange={onchangeHashTag}
					onKeyUp={handleKeyUp}
					value={hashTag}
				/>
			</div>
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