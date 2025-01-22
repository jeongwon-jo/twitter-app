import AuthContext from "context/AuthContext";
import { addDoc, collection } from "firebase/firestore";
import { db, storage } from "firebaseApp";
import { useContext, useState } from "react";
import { FiImage } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { IoIosClose } from "react-icons/io";
import { v4 as uuidv4 } from "uuid";
import { getDownloadURL, ref, uploadString } from "firebase/storage";

export default function PostForm() {
	const [content, setContent] = useState<string>("")
	const [tags, setTags] = useState<string[]>([]);
	const [hashTag, setHashTag] = useState<string>("");
	const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
	const [imageFile, setImageFile] = useState<string | null>(null)
	const { user } = useContext(AuthContext);

	const handleFileUpload = (e: any) => {
		const {
			target: { files }
		} = e;

		const file = files?.[0];
		// 파일 리더 선언
		const fileReader = new FileReader();
		// 리더가 파일을 읽음
		fileReader?.readAsDataURL(file);
		fileReader.onloadend = (e: any) => {
			// 구조분해할당
			const { result } = e?.currentTarget;
			setImageFile(result)
		}
	};

	const handleDeleteImage = () => { 
		setImageFile(null)
	}
	
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
		setIsSubmitting(true)
		// 이미지 이름 만들기
		const key = `${user?.uid}/${uuidv4()}`
		// firestore 참조 걸기
		const storageRef = ref(storage, key)
		e.preventDefault();

		try {

			// 이미지 먼저 업로드
			let imageUrl = "";
			if (imageFile) {
				const data = await uploadString(storageRef, imageFile, "data_url");
				imageUrl = await getDownloadURL(data?.ref);
			}

			// 업로드된 이미지의 download url 업데이트

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
				imageUrl: imageUrl,
			});

			setTags([])
			setHashTag("")
			setContent("")
			setImageFile(null)
			
			toast.success("게시글을 생성했습니다.");
			setIsSubmitting(false);
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
			<div className="post-form__input-area">
				<textarea
					name="content"
					id="content"
					className="post-form__textarea"
					placeholder="무슨 일이 일어나고 있나요?"
					onChange={onChange}
					value={content}
				></textarea>
				{imageFile && (
					<div className="post-form__attach-area">
						<div className="attachment_img">
							<img src={imageFile} alt="이미지파일" />
							<button
								type="button"
								className="btn_clear"
								onClick={handleDeleteImage}
							>
								<IoIosClose />
							</button>
						</div>
					</div>
				)}
			</div>
			<div className="post-form__hashtags">
				{tags.length > 0 && (
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
				)}
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
				<div className="post-form__image-area">
					<label htmlFor="file-input" className="post-form__file">
						<FiImage className="post-form__file-icon" />
					</label>
					<input
						type="file"
						name="file-input"
						accept="image/*"
						id="file-input"
						onChange={handleFileUpload}
						className="hidden"
					/>
				</div>
				<input
					type="submit"
					value="게시하기"
					className="post-form__submit-btn"
					disabled={isSubmitting}
				/>
			</div>
		</form>
	);
}