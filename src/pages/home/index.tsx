import { FiImage } from "react-icons/fi";
import { FaUserCircle } from "react-icons/fa";
import { Link } from "react-router-dom";
import { AiFillHeart } from "react-icons/ai";
import { FaRegComment } from "react-icons/fa";
import logo from "../../assets/images/common/logo.png"

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
}

const posts: PostProps[] = [
  {
    id: '1',
    email: 'test@test.com',
    content: "테스트",
    createdAt: "2023-05-23",
    uid: "123123",
  },
  {
    id: '2',
    email: 'test@test.com',
    content: "테스트",
    createdAt: "2023-05-23",
    uid: "123123",
  },
  {
    id: '3',
    email: 'test@test.com',
    content: "테스트",
    createdAt: "2023-05-23",
    uid: "123123",
  },
  {
    id: '4',
    email: 'test@test.com',
    content: "테스트",
    createdAt: "2023-05-23",
    uid: "123123",
  },
  {
    id: '5',
    email: 'test@test.com',
    content: "테스트",
    createdAt: "2023-05-23",
    uid: "123123",
  },
]

export default function HomePage() {
  const handleFileUpload = () => {}
  const handleDelete = () => {}

  return (
    <div className="home">
      <div className="home__title">
        <img src={logo} alt="로고" />
      </div>
      <div className="home__tabs">
        <div className="home__tab home__tab--active">추천</div>
        <div className="home__tab">팔로우 중</div>
      </div>
      {/* Post Form */}
      <form action="" className="post-form">
        <textarea name="content" id="content" className="post-form__textarea" placeholder="무슨 일이 일어나고 있나요?"></textarea>
        <div className="post-form__submit-area">
          <label htmlFor="file-input" className="post-form__file">
            <FiImage className="post-form__file-icon"/>
          </label>
          <input type="file" name="file-input" accept="image/*" onChange={handleFileUpload} className="hidden"/>
          <input type="submit" value="게시하기" className="post-form__submit-btn" />
        </div>
      </form>
      {/* Tweet Posts */}
      <div className="post">
        {posts?.map((post) => (
          <div className="post__box" key={post?.id}>
            <Link to={`/posts/${post?.id}`}>
              <div className="post__box-profile">
                <div className="post__flex">
                  {post?.profileUrl ? <img src={post.profileUrl} alt="프로필 이미지" className="post__box-profile-img"/> : <FaUserCircle className="post__box-profile-icon"/>}
                  <div className="post__email">{post?.email}</div>
                  <div className="post__createdAt">{post?.createdAt}</div>
                </div>
              </div>
              <div className="post__box-content">{post?.content}</div>
            </Link>
            <div className="post__box-footer">
              {/* post.uid === user.uid 일때 */}
              <>
                <button type="button" className="post__delete" onClick={handleDelete}>Delete</button>
                <button type="button" className="post__edit"><Link to={`/posts/edit/${post?.id}`}>Edit</Link></button>
              </>
              <button type="button" className="post__likes" onClick={handleDelete}><AiFillHeart />{post?.likeCount || 0}</button>
              <button type="button" className="post__comments"><FaRegComment />{post?.comments?.length || 0}</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}