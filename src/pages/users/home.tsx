import { Link } from "react-router-dom";
import logo from "../../assets/images/common/logo.png";
import {
	getAuth,
	GoogleAuthProvider,
	GithubAuthProvider,
	signInWithPopup,
} from "firebase/auth";
import { app } from "firebaseApp";
import { toast } from "react-toastify";

export default function LoginHomePage() {
  const onClickSocialLogin = async (e: any) => {
    const { target: { name } } = e;
    
    let provider;
    const auth = getAuth(app);
    
    if (name) {
      if (name === "google") {
				provider = new GoogleAuthProvider();
			}

			if (name === "github") {
				provider = new GithubAuthProvider();
			}

			await signInWithPopup(
				auth,
				provider as GoogleAuthProvider | GithubAuthProvider
			)
				.then((result) => {
					toast.success("로그인 되었습니다.");
				})
				.catch((error) => {
					const errorMessage = error.message;
					toast.error(errorMessage);
				});
    }
  }

	return (
		<>
			<div className="logo_header">
				<div className="logo">
					<img src={logo} alt="로고" />
				</div>
			</div>
			<div className="account-page">
				<div className="account_title">
					<h2>
						지금 세계에서 무슨 일이
						<br />
						일어나고 있는지 알아보세요.
					</h2>
				</div>
				<div className="login-home__btns">
					<button
						type="button"
						name="google"
						className="login-btn__google"
						onClick={onClickSocialLogin}
					>
						<span>Google로 계속하기</span>
					</button>
					<button
						type="button"
						name="github"
						className="login-btn__github"
						onClick={onClickSocialLogin}
					>
						<span>Github로 계속하기</span>
					</button>
					<div className="btn_bar">
						<span className="bar"></span>
						<p>또는</p>
						<span className="bar"></span>
					</div>
					<Link to="/users/signup">
						<button type="button" className="login-btn__signup">
							계정만들기
						</button>
					</Link>
				</div>
				<div className="login-home__txts">
					<p>
						가입하면 트위터의
						<Link to="" className="link">
							이용약관
						</Link>
						,
						<Link to="" className="link">
							개인정보 처리방침
						</Link>
						,
						<Link to="" className="link">
							쿠키 사용
						</Link>
						에 동의하게 됩니다.
					</p>
				</div>
				<div className="login-home__login">
					<span>이미 계정이 있으세요?</span>
					<Link to="/users/login" className="link">
						로그인하기
					</Link>
				</div>
			</div>
		</>
	);
}
