import AuthContext from "context/AuthContext";
import { arrayRemove, arrayUnion, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "firebaseApp";
import { PostProps } from "pages/home";
import { useContext } from "react";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { FaRegComment, FaUserCircle } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { storage } from "firebaseApp";
import { ref, deleteObject } from "firebase/storage";

interface PostBoxProps {
  post: PostProps;
}
export default function PostBox({ post }: PostBoxProps) {
	const { user } = useContext(AuthContext)
	const navigate = useNavigate();
	const imageRef = ref(storage, post?.imageUrl);

	const handleDelete = async (id: string) => {
		const confirm = window.confirm("해당 게시글을 삭제하시겠습니까?");

		if (confirm && id) {
			// 스토리지 이미지 삭제
			if (post?.imageUrl) {
				deleteObject(imageRef).catch((error) => {
					console.log(error);
				});
			}

			await deleteDoc(doc(db, "posts", id));
			toast.success("게시글을 삭제했습니다.");
			navigate("/")
		}
	};

	const toggleLike = async () => {
		const postRef = doc(db, "posts", post.id)

		if (user?.uid) {
			// 사용자가 좋아요를 미리 한 경우 좋아요 취소
			if (post?.likes?.includes(user?.uid)) {
				await updateDoc(postRef, {
					likes: arrayRemove(user.uid),
					likeCount: post.likeCount ? post?.likeCount - 1 : 0,
					updatedAt: new Date()?.toLocaleDateString("ko", {
						hour: "2-digit",
						minute: "2-digit",
						second: "2-digit",
					}),
				});
			}
			// 사용자가 좋아요 하지않은 경우 좋아요 추가
			else {
				await updateDoc(postRef, {
					likes: arrayUnion(user.uid),
					likeCount: post.likeCount ? post?.likeCount + 1 : 1,
					updatedAt: new Date()?.toLocaleDateString("ko", {
						hour: "2-digit",
						minute: "2-digit",
						second: "2-digit",
					}),
				});
			}
		}
	}
	
	return (
		<div className="post__box" key={post?.id}>
			<Link to={`/posts/${post?.id}`} className="post__box-item">
				<div className="post__box-profile">
					{post?.profileUrl ? (
						<img
							src={post.profileUrl}
							alt="프로필 이미지"
							className="post__box-profile-img"
						/>
					) : (
						<FaUserCircle className="post__box-profile-icon" />
					)}
				</div>
				<div className="post__box-content">
					<div className="post-profile__info">
						<div className="post__email">{post?.email}</div>
						<div className="post__createdAt">{post?.createdAt}</div>
					</div>
					{post?.content}
					{post?.imageUrl && (
						<div className="post__box-image">
							<img src={post?.imageUrl} alt="게시물 이미지" />
						</div>
					)}
					<div className="post-form__hashtags-outputs">
						{post?.hashTags?.map((tag, index) => (
							<span className="post-form__hashtags-tag" key={index}>
								#{tag}
							</span>
						))}
					</div>
				</div>
			</Link>
			<div className="post__box-footer">
				{user?.uid === post?.uid && (
					<>
						<button
							type="button"
							className="post__delete"
							onClick={() => handleDelete(post?.id as string)}
						>
							Delete
						</button>
						<button type="button" className="post__edit">
							<Link to={`/posts/edit/${post?.id}`}>Edit</Link>
						</button>
					</>
				)}
				<button type="button" className="post__likes" onClick={toggleLike}>
					{user && post.likes?.includes(user?.uid) ? (
						<AiFillHeart className="fill_heart"/>
					) : (
						<AiOutlineHeart />
					)}

					{post?.likeCount || 0}
				</button>
				<button type="button" className="post__comments">
					<FaRegComment />
					{post?.comments?.length || 0}
				</button>
			</div>
		</div>
	);
}