import { createUserWithEmailAndPassword, getAuth, signInWithPopup, GoogleAuthProvider, GithubAuthProvider } from "firebase/auth";
import logo from "../../assets/images/common/logo.png";
import { app } from "firebaseApp";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import useTranslation from "hooks/useTranslation";

export default function SignupForm() {
	const t = useTranslation();
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
			toast.success(t("TOAST_SIGNUP_COMPLETE"));
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
				setError(t("VALIDATION_EMAIL1"));
			} else {
				setError("");
			}

    } else if (name === "password") {
      setPassword(value)

      if (value?.length < 8) {
				setError(t("VALIDATION_PWD1"));
			} else if (passwordConfirm?.length > 0 && value !== passwordConfirm) {
				setError(t("VALIDATION_PWD2"));
			} else {
				setError("");
			}
    } else {
      setPasswordConfirm(value)

      if (value?.length < 8) {
				setError(t("VALIDATION_PWD1"));
			} else if (value !== password) {
				setError(t("VALIDATION_PWD3"));
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
				toast.success(t("TOAST_LOGIN_COMPLETE"))
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
					<div className="form__title">{t("SIGNUP_TITLE")}</div>
					<div className="form__block">
						<label htmlFor="email">{t("SIGNUP_EMAIL")}</label>
						<input
							type="text"
							name="email"
							id="email"
							value={email}
							required
							autoComplete="off"
							placeholder={t("SIGNUP_EMAIL_PLACEHOLDER")}
							onChange={onChange}
						/>
					</div>
					<div className="form__block">
						<label htmlFor="password">{t("SIGNUP_PWD")}</label>
						<input
							type="password"
							name="password"
							id="password"
							value={password}
							required
							autoComplete="off"
							placeholder={t("SIGNUP_PWD_PLACEHOLDER")}
							onChange={onChange}
						/>
					</div>
					<div className="form__block">
						<label htmlFor="password_confirm">{t("SIGNUP_PWD_CONFIRM")}</label>
						<input
							type="password"
							name="password_confirm"
							id="password_confirm"
							value={passwordConfirm}
							required
							autoComplete="off"
							placeholder={t("SIGNUP_PWD_CONFIRM_PLACEHOLDER")}
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
							<span>{t("SIGNUP_WITH_GOOGLE")}</span>
						</button>
						<button
							type="button"
							name="github"
							className="login-btn__github"
							onClick={onClickSocialLogin}
						>
							<span>{t("SIGNUP_WITH_GITHUB")}</span>
						</button>
						<div className="btn_bar">
							<span className="bar"></span>
							<p>{t("LOGIN_OR")}</p>
							<span className="bar"></span>
						</div>
						<Link to="/users/login">
							<button type="button" className="login-btn__signup">
								{t("GO_LOGIN")}
							</button>
						</Link>
					</div>
					<div className="account-footer">
						<div className="footer_btns right">
							<button
								type="submit"
								className="btn_signup"
							>
								{t("BTN_SIGNUP")}
							</button>
						</div>
					</div>
				</form>
			</div>
		</>
	);
}