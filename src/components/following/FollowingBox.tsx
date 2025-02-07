import AuthContext from "context/AuthContext";
import { addDoc, arrayRemove, arrayUnion, collection, doc, onSnapshot, setDoc, updateDoc } from "firebase/firestore";
import { db } from "firebaseApp";
import useTranslation from "hooks/useTranslation";
import { PostProps } from "pages/home";
import { useCallback, useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";

interface FollowingProps {
  post: PostProps
}

interface UserProps {
  id: string
}

export default function FollowingBox({ post }: FollowingProps) {
	const t = useTranslation();
	const [postFollowers, setPostFollowers] = useState<any>([]);
	const { user } = useContext(AuthContext);

	const onClickFollow = async (e: any) => {
		e.preventDefault();
		try {
			if (user?.uid) {
				// 내가 주체가 되어 "팔로잉" 컬렉션 생성 or 업데이트
				// user.uid가 post.uid를 팔로우
				const followingRef = doc(db, "following", user?.uid);

				await setDoc(
					followingRef,
					{
						users: arrayUnion({ id: post?.uid }),
					},
					{ merge: true }
				);

				// 팔로우 당하는 사람이 주체가 되어 "팔로우" 컬렉션 생성 or 업데이트
				const followerRef = doc(db, "follower", post?.uid);
				await setDoc(
					followerRef,
					{
						users: arrayUnion({ id: user?.uid }),
					},
					{ merge: true }
				);

				// 팔로잉 알림 만들기
				await addDoc(collection(db, "notifications"), {
					createdAt: new Date()?.toLocaleDateString("ko", {
						hour: "2-digit",
						minute: "2-digit",
						second: "2-digit",
					}),
					uid: post.uid,
					isRead: false,
					url: `#`,
					content: `${user?.displayName || user?.email}가 팔로우 했습니다.`
				})
			}

			toast.success(t("TOAST_FOLLOWING"));
		} catch (e) {
			console.log(e);
		}
	};

	const onClickDeleteFollow = async (e: any) => {
		e.preventDefault();

		try {
			if (user?.uid) {
				// 내가 주체가 되어 "팔로잉" 컬렉션에서 삭제
				// user.uid가 post.uid를 팔로우 취소
				const followingRef = doc(db, "following", user?.uid);
				await updateDoc(followingRef, {
					users: arrayRemove({ id: post.uid }),
				});

				// 팔로우 당하는 사람이 주체가 되어 "팔로우" 컬렉션에서 삭제
				const followerRef = doc(db, "follower", post?.uid);
				await updateDoc(followerRef, {
					users: arrayRemove({ id: user.uid }),
				});

				toast.success("팔로우취소 되었습니다.");
			}
		} catch (e) {
			console.log(e);
		}
	};

	//실시간으로 팔로우, 팔로잉버튼을 변경시키기위한 작업
	const getFollowers = useCallback(async () => {
		if (post.uid) {
			// 해당게시글을 쓴 유저의 팔로워들을 모두 뽑는 작업
			const ref = doc(db, "follower", post.uid);
			onSnapshot(ref, (doc) => {
				setPostFollowers([]);
				doc
					?.data()
					?.users?.map((user: UserProps) =>
						setPostFollowers((prev: UserProps[]) =>
							prev ? [...prev, user.id] : []
						)
					);
			});
		}
	}, [post.uid]);

	useEffect(() => {
		if (post.uid) getFollowers();
	}, [getFollowers, post.uid]);

	return (
		<>
			{postFollowers.includes(user?.uid) ? (
				<button
					type="button"
					className="post__follower-btn"
					onClick={onClickDeleteFollow}
				>
					{t("BTN_FOLLOWER")}
				</button>
			) : (
				<button
					type="button"
					className="post__follow-btn"
					onClick={onClickFollow}
				>
					{t("BTN_FOLLOWING")}
				</button>
			)}
		</>
	);
}