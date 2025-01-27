import PostForm from "components/posts/PostForm";
import PostBox from "components/posts/PostBox";
import { useCallback, useContext, useEffect, useState } from "react";
import { collection, query, onSnapshot, orderBy, doc, where } from "firebase/firestore";
import AuthContext from "context/AuthContext";
import { db } from "firebaseApp";
import { LogoHeader } from "components/LogoHeader";
import useTranslation from "hooks/useTranslation";

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

interface UserProps {
	id: string;
}

type tabType = "all" | "following"

export default function HomePage() {
	const t = useTranslation();
	const [allposts, setAllPosts] = useState<PostProps[]>([]);
	const [followingposts, setFollowingPosts] = useState<PostProps[]>([]);
	const [followingIds, setFollowingIds] = useState<string[]>([""]);
	const [activeTab, setActiveTab] = useState<tabType>("all")
	const { user } = useContext(AuthContext);

	// 실시간 동기화로 user의 팔로잉 id배열 가져오기
	const getFollowingIds = useCallback(async () => {
		if (user?.uid) {
			const ref = doc(db, "following", user.uid)
			onSnapshot(ref, (doc) => {
				setFollowingIds([])
				doc?.data()?.users?.map((user: UserProps) => setFollowingIds((prev: string[]) => prev ? [...prev, user.id] : []))
			} );
		}
	}, [user?.uid])

	useEffect(() => {
		if (user) {
			let postsRef = collection(db, "posts");
			let postsQuery = query(postsRef, orderBy("createdAt", "desc"));
			let followingPostsQuery = query(postsRef, where("uid", "in", followingIds), orderBy("createdAt", "desc"));

			onSnapshot(postsQuery, (snapShot) => {
				let dataObj = snapShot.docs.map((doc) => ({
					...doc.data(),
					id: doc?.id,
				}));
				setAllPosts(dataObj as PostProps[]);
			});

			onSnapshot(followingPostsQuery, (snapShot) => {
				let dataObj = snapShot.docs.map((doc) => ({
					...doc.data(),
					id: doc?.id,
				}));
				setFollowingPosts(dataObj as PostProps[]);
			});
		}
	}, [followingIds, user]);

	useEffect(() => {
		if(user?.uid) getFollowingIds();
	}, [user?.uid, getFollowingIds]);

  return (
		<div className="home">
			<LogoHeader />
			<div className="container">
				<div className="home__top">
					<div className="home__tabs">
						<div
							className={`home__tab ${
								activeTab === "all" && "home__tab--active"
							}`}
							onClick={() => setActiveTab("all")}
						>
							{t('TAB_ALL')}
						</div>
						<div
							className={`home__tab ${
								activeTab === "following" && "home__tab--active"
							}`}
							onClick={() => setActiveTab("following")}
						>
							{t('TAB_FOLLOWER')}
						</div>
					</div>
				</div>
				{/* Post Form */}
				<PostForm />
				{/* Tweet Posts */}
				{activeTab === "all" && (
					<div className="post">
						{allposts?.length > 0 ? (
							allposts?.map((post) => <PostBox post={post} key={post.id} />)
						) : (
							<div className="post__no-posts">
								<div className="post__text">{t("NO_POSTS")}</div>
							</div>
						)}
					</div>
				)}

				{activeTab === "following" && (
					<div className="post">
						{followingposts?.length > 0 ? (
							followingposts?.map((post) => (
								<PostBox post={post} key={post.id} />
							))
						) : (
							<div className="post__no-posts">
								<div className="post__text">{t("NO_POSTS")}</div>
							</div>
						)}
					</div>
				)}
			</div>
		</div>
	);
}