import { createUserWithEmailAndPassword, getAuth, signInWithPopup, GoogleAuthProvider, GithubAuthProvider } from "firebase/auth";
import logo from "../../assets/images/common/logo.png";
import { app } from "firebaseApp";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function SignupForm() {
  const [error, setError] = useState<string>("")
  const [email, setEmail] = useState<string>("")
  const [password, setPassword] = useState<string>("")
  const [passwordConfirm, setPasswordConfirm] = useState<string>("")
  const navigate = useNavigate();

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		try {
			const auth = getAuth(app);
			await createUserWithEmailAndPassword(auth, email, password);
			toast.success("회원가입에 성공했습니다.");
			navigate("/");
		} catch (error: any) {
			toast.error(error.code);
			console.log(error);
		}
	};

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { target: { name, value } } = e;

    if (name === "email") {
      setEmail(value)
      const validRegex = /^[a-zA-Z0-9+-\_.]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
      if (!value?.match(validRegex)) {
				setError("이메일 형식이 올바르지 않습니다.");
			} else {
				setError("");
			}

    } else if (name === "password") {
      setPassword(value)

      if (value?.length < 8) {
				setError("비밀번호는 8자리 이상으로 입력해 주세요.");
			} else if (passwordConfirm?.length > 0 && value !== passwordConfirm) {
				setError("비밀번호와 비밀번호 확인값이 다릅니다. 다시 확인해주세요.");
			} else {
				setError("");
			}
    } else {
      setPasswordConfirm(value)

      if (value?.length < 8) {
				setError("비밀번호는 8자리 이상으로 입력해주세요.");
			} else if (value !== password) {
				setError("비밀번호와 값이 다릅니다. 다시 확인해주세요.");
			} else {
				setError("");
			}
    }
	}
	
	const onClickSocialLogin = async (e: any) => {
		const { target: { name } } = e;
		
		let provider;
		const auth = getAuth(app);
		
		if (name === "google") {
			provider = new GoogleAuthProvider();
		}

		if (name === "github") { 
			provider = new GithubAuthProvider();
		}

		await signInWithPopup(auth, provider as GoogleAuthProvider | GithubAuthProvider)
			.then((result) => {
				// const credential = GoogleAuthProvider.credentialFromResult(result);
				// const token = credential?.accessToken;
				// const user = result.user;
				toast.success("로그인 되었습니다.")
			})
			.catch((error) => {
				// const errorCode = error.code;
				const errorMessage = error.message;
				// const email = error.customData.email;
				// const credential = GoogleAuthProvider.credentialFromError(error);
				toast.error(errorMessage);
			});
		
	}

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
			<div className="account-page">
				<form className="form form--lg" onSubmit={onSubmit}>
					<div className="form__title">계정을 생성하세요</div>
					<div className="form__block">
						<label htmlFor="email">이메일</label>
						<input
							type="text"
							name="email"
							id="email"
							value={email}
							required
							autoComplete="off"
							placeholder="이메일을 입력하세요."
							onChange={onChange}
						/>
					</div>
					<div className="form__block">
						<label htmlFor="password">비밀번호</label>
						<input
							type="password"
							name="password"
							id="password"
							value={password}
							required
							autoComplete="off"
							placeholder="비밀번호를 입력하세요."
							onChange={onChange}
						/>
					</div>
					<div className="form__block">
						<label htmlFor="password_confirm">비밀번호 확인</label>
						<input
							type="password"
							name="password_confirm"
							id="password_confirm"
							value={passwordConfirm}
							required
							autoComplete="off"
							placeholder="비밀번호 확인을 입력하세요."
							onChange={onChange}
						/>
					</div>
					{error && error?.length > 0 && (
						<div className="form__block">
							<div className="form__error">{error}</div>
						</div>
					)}
					<div className="login-home__btns mt40">
						<button
							type="button"
							name="google"
							className="login-btn__google"
							onClick={onClickSocialLogin}
						>
							<span>Google로 회원가입</span>
						</button>
						<button
							type="button"
							name="github"
							className="login-btn__github"
							onClick={onClickSocialLogin}
						>
							<span>Github로 회원가입</span>
						</button>
						<div className="btn_bar">
							<span className="bar"></span>
							<p>또는</p>
							<span className="bar"></span>
						</div>
						<Link to="/users/login">
							<button type="button" className="login-btn__signup">
								로그인 하러 가기
							</button>
						</Link>
					</div>
					<div className="account-footer">
						<div className="footer_btns right">
							<button
								type="submit"
								className="btn_signup"
							>
								회원가입
							</button>
						</div>
					</div>
				</form>
			</div>
		</>
	);
}