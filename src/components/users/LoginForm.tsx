import { signInWithEmailAndPassword, getAuth, GoogleAuthProvider, GithubAuthProvider, signInWithPopup } from "firebase/auth";
import { app } from "firebaseApp";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function LoginForm() {
	const [error, setError] = useState<string>("");
	const [email, setEmail] = useState<string>("");
	const [password, setPassword] = useState<string>("");
	const navigate = useNavigate();

	const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		try {
			const auth = getAuth(app);
			await signInWithEmailAndPassword(auth, email, password);
			toast.success("로그인에 성공했습니다.");
			navigate("/");
		} catch (error: any) {
			toast.error(error.code);
			console.log(error);
		}
	};

	const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const {
			target: { name, value },
		} = e;

		if (name === "email") {
			setEmail(value);
			const validRegex = /^[a-zA-Z0-9+-\_.]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
			if (!value?.match(validRegex)) {
				setError("이메일 형식이 올바르지 않습니다.");
			} else {
				setError("");
			}
		} else if (name === "password") {
			setPassword(value);

			if (value?.length < 8) {
				setError("비밀번호는 8자리 이상으로 입력해 주세요.");
			} else {
				setError("");
			}
		}
  };
  
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
		<form className="form form--lg" onSubmit={onSubmit}>
			<div className="form__title">Login</div>
			<div className="form__block">
				<label htmlFor="email">이메일</label>
				<input
					type="text"
					name="email"
					id="email"
					value={email}
					required
					autoComplete="off"
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
					onChange={onChange}
				/>
			</div>
			{error && error?.length > 0 && (
				<div className="form__block">
					<div className="form__error">{error}</div>
				</div>
			)}
			<div className="form__block">
				계정이 없으신가요?
				<Link to="/users/signup" className="form__link">
					회원가입하기
				</Link>
			</div>
			<div className="form__block--lg">
				<button
					type="submit"
					className="form__btn-submit"
					disabled={error?.length > 0}
				>
					로그인
				</button>
			</div>
			<div className="form__block--lg">
				<button
					type="button"
					name="google"
					className="form__btn-google"
					onClick={onClickSocialLogin}
				>
					구글로 로그인
				</button>
			</div>
			<div className="form__block--lg">
				<button
					type="button"
					name="github"
					className="form__btn-github"
					onClick={onClickSocialLogin}
				>
					Github로 로그인
				</button>
			</div>
		</form>
	);
}
