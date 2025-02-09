import PostBox from "components/posts/PostBox";
import logo from "../../assets/images/common/logo.png";
import { useContext, useEffect, useState } from "react";
import { PostProps } from "pages/home";
import { collection, onSnapshot, orderBy, query, where } from "firebase/firestore";  
import AuthContext from "context/AuthContext";
import { db } from "firebaseApp";
import { LogoHeader } from "components/LogoHeader";
import useTranslation from "hooks/useTranslation";

export default function SearchPage() {
	const t = useTranslation();
  const [posts, setPosts] = useState<PostProps[]>([]);
  const [tagQuery, setTagQuery] = useState<string>("");
  const { user } = useContext(AuthContext);
  
  const onChange = (e:any) => {
    setTagQuery(e?.target?.value?.trim())
  }

  useEffect(() => {
    if (user) {
      let postsRef = collection(db, "posts");
      let postsQuery = query(postsRef, where("hashTags", "array-contains-any", [tagQuery]), orderBy("createdAt", "desc"));
      
      onSnapshot(postsQuery, (snapShot) => {
        let dataObj = snapShot.docs.map((doc) => ({
          ...doc.data(),
          id: doc?.id,
        }));
        setPosts(dataObj as PostProps[]);
      });
    }
  }, [tagQuery, user])

	return (
		<div className="home">
			<LogoHeader />
			<div className="container">
				<div className="home__search-div">
					<input
						type="text"
						className="home__search"
						placeholder={t("SEARCH_PLACEHOLDER")}
						value={tagQuery}
						onChange={onChange}
					></input>
				</div>
				{/* Tweet Posts */}
				<div className="post">
					{posts?.length > 0 ? (
						posts?.map((post) => <PostBox post={post} key={post.id} />)
					) : (
						<div className="post__no-posts">
							<div className="post__text">{t("SEARCH_NO_RESULTS")}</div>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
