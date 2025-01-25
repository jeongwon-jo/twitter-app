import Loader from "components/loader/Loader";
import logo from "../../assets/images/common/logo.png";
import PostBox from "components/posts/PostBox";
import { doc, getDoc, onSnapshot } from "firebase/firestore";
import { db } from "firebaseApp";
import { PostProps } from "pages/home";
import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { CommentForm } from "components/comments/CommentForm";
import CommentBox, { CommentProps } from "components/comments/CommentBox";

export default function PostDetailPage() {
  const params = useParams();
	const [post, setPost] = useState<PostProps | null>(null);
  const navigate = useNavigate();

  const getPost = useCallback(async () => {
    if (params.id) {
			const docRef = doc(db, "posts", params.id);
			// 전
			// const docSnap = await getDoc(docRef);
			// setPost({ ...(docSnap?.data() as PostProps), id: docSnap.id });
			
			// 후
			onSnapshot(docRef, (doc) => {
				setPost({ ...(doc?.data() as PostProps), id: doc.id });
			});
		}
  }, [params.id])
  
  useEffect(() => {
    if (params.id) {
      getPost();
    }
  }, [getPost, params.id]);
  
  return (
		<>
			<div className="logo_header">
				<button
					type="button"
					className="btn_back"
					onClick={() => {
						navigate(-1);
					}}
				></button>
				<div className="logo">
					<img src={logo} alt="로고" />
				</div>
			</div>
			<div className="container">
			{post ?
				<div className="post">
						<PostBox post={post} />
						<CommentForm post={post} />
						{post?.comments?.slice(0)?.reverse()?.map((data: CommentProps) => (
							<CommentBox key={data.createdAt} data={data} post={ post} />
						))}
						
				</div>
					: <Loader />}
			</div>
		</>
	);
}
