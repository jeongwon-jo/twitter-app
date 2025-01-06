import logo from "../../assets/images/common/logo.png"
import PostForm from "components/posts/PostForm";
import PostBox from "components/posts/PostBox";

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
      <PostForm />
      {/* Tweet Posts */}
      <div className="post">
        {posts?.map((post) => (
          <PostBox post={post} key={post.id}/>
        ))}
      </div>
    </div>
  )
}