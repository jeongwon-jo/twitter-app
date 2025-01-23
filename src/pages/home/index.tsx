import PostForm from "components/posts/PostForm";
import PostBox from "components/posts/PostBox";
import { useContext, useEffect, useState } from "react";
import { collection, query, onSnapshot, orderBy } from "firebase/firestore";
import AuthContext from "context/AuthContext";
import { db } from "firebaseApp";
import { LogoHeader } from "components/LogoHeader";

export interface PostProps {
  id: string;
  email: string;
  content: string;
  createdAt: string;
  uid: string;
  profileUrl?: string;
  likes?: string[];
  likeCount?: number;
	comments?: any;
	hashTags?: string[];
	imageUrl?: string;
}

export default function HomePage() {
	const [posts, setPosts] = useState<PostProps[]>([]);
	const { user } = useContext(AuthContext);

	useEffect(() => {
		if (user) {
			let postsRef = collection(db, "posts");
			let postsQuery = query(postsRef, orderBy("createdAt", "desc"));

			onSnapshot(postsQuery, (snapShot) => {
				let dataObj = snapShot.docs.map((doc) => ({
					...doc.data(),
					id: doc?.id,
				}));
				setPosts(dataObj as PostProps[]);
			});
		}
	}, [user]);

  return (
		<div className="home">
			<LogoHeader />
			<div className="container">
				<div className="home__top">
					<div className="home__tabs">
						<div className="home__tab home__tab--active">추천</div>
						<div className="home__tab">팔로우 중</div>
					</div>
				</div>
				{/* Post Form */}
				<PostForm />
				{/* Tweet Posts */}
				<div className="post">
					{posts?.length > 0 ? (
						posts?.map((post) => <PostBox post={post} key={post.id} />)
					) : (
						<div className="post__no-posts">
							<div className="post__text">게시글이 없습니다.</div>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}