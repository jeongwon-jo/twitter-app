import { PostProps } from "pages/home";
import { useContext, useEffect, useState } from "react";
import PostBox from "components/posts/PostBox";
import { collection, onSnapshot, orderBy, query, where } from "firebase/firestore";
import AuthContext from "context/AuthContext";
import { db } from "firebaseApp";
import { useNavigate } from "react-router-dom";
import { LogoHeader } from "components/LogoHeader";
import profileDefaultImg from "../../assets/images/common/user_img.png";

export default function ProfilePage() {
  const [posts, setPosts] = useState<PostProps[]>([]);
  const { user } = useContext(AuthContext);
  const navigate= useNavigate()
  
  useEffect(() => {
    if (user) {
      let postsRef = collection(db, "posts");
      let postsQuery = query(postsRef, where("uid", "==", user.uid), orderBy("createdAt", "desc"));

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
					<div className="home__tab home__tab--active">게시글</div>
					<div className="home__tab">마음에 들어요</div>
				</div>
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
