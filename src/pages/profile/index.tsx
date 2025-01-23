import { PostProps } from "pages/home";
import { useContext, useEffect, useState } from "react";
import PostBox from "components/posts/PostBox";
import { collection, onSnapshot, orderBy, query, where } from "firebase/firestore";
import AuthContext from "context/AuthContext";
import { db } from "firebaseApp";
import { useNavigate } from "react-router-dom";
import { LogoHeader } from "components/LogoHeader";
import profileDefaultImg from "../../assets/images/common/user_img.png";

type TabType = "my" | "like";

export default function ProfilePage() {
	const [activeTab, setActiveTab] = useState<TabType>("my");
  const [myPosts, setMyPosts] = useState<PostProps[]>([]);
  const [likePosts, setLikePosts] = useState<PostProps[]>([]);
  const { user } = useContext(AuthContext);
  const navigate= useNavigate()
  
  useEffect(() => {
    if (user) {
      let postsRef = collection(db, "posts");
      let myPostsQuery = query(postsRef, where("uid", "==", user.uid), orderBy("createdAt", "desc"));
      let likePostsQuery = query(postsRef, where("likes", "array-contains", user.uid), orderBy("updatedAt", "desc"));

      onSnapshot(myPostsQuery, (snapShot) => {
				let dataObj = snapShot.docs.map((doc) => ({
					...doc.data(),
					id: doc?.id,
				}));
				setMyPosts(dataObj as PostProps[]);
			});

			onSnapshot(likePostsQuery, (snapShot) => {
				let dataObj = snapShot.docs.map((doc) => ({
					...doc.data(),
					id: doc?.id,
				}));
				setLikePosts(dataObj as PostProps[]);
			});
    }
  }, [user]);
  
	return (
		<div className="home">
			<LogoHeader />
			<div className="container">
				<div className="profile">
					<div className="profile__img">
						<img
							src={user?.photoURL || profileDefaultImg}
							alt="프로필 이미지"
							className="profile__img"
						/>
					</div>
					<button
						type="button"
						className="profile__btn"
						onClick={() => navigate("/profile/edit")}
					>
						프로필 수정
					</button>
				</div>
				<div className="profile__text">
					<div className="profile__name">
						{user?.displayName || "사용자 님"}
					</div>
					<div className="profile__email">{user?.email || ""}</div>
				</div>
				<div className="home__tabs">
					<div
						className={`home__tab ${activeTab === "my" && "home__tab--active"}`}
						onClick={() => setActiveTab("my")}
					>
						게시글
					</div>
					<div
						className={`home__tab ${activeTab === "like" && "home__tab--active"}`}
						onClick={() => setActiveTab("like")}
					>
						마음에 들어요
					</div>
				</div>
				{activeTab === "my" && (
					<div className="post">
						{myPosts?.length > 0 ? (
							myPosts?.map((post) => <PostBox post={post} key={post.id} />)
						) : (
							<div className="post__no-posts">
								<div className="post__text">게시글이 없습니다.</div>
							</div>
						)}
					</div>
				)}
				{activeTab === "like" && (
					<div className="post">
						{likePosts?.length > 0 ? (
							likePosts?.map((post) => <PostBox post={post} key={post.id} />)
						) : (
							<div className="post__no-posts">
								<div className="post__text">게시글이 없습니다.</div>
							</div>
						)}
					</div>
				)}
			</div>
		</div>
	);
}
