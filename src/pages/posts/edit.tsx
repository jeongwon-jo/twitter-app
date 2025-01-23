import PostEditForm from "components/posts/PostEditForm";
import logo from "../../assets/images/common/logo.png";
import { useNavigate } from "react-router-dom";

export default function PostEditPage() {
  const navigate = useNavigate();
  
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
				<PostEditForm />
			</div>
		</>
	);
}