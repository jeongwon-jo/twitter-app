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
import useTranslation from "hooks/useTranslation";

export default function LoginHomePage() {
	const t = useTranslation();
	const onClickSocialLogin = async (e: any) => {
		if (e.target.tagName.toLowerCase() === "span") {
			e.currentTarget.click();
			return false;
		}

		const { target: { name } } = e;
    let provider;
    const auth = getAuth(app);
    
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
				toast.success(t("TOAST_LOGIN_COMPLETE"));
			})
			.catch((error) => {
				const errorMessage = error.message;
				toast.error(errorMessage);
			});
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
					<h2 dangerouslySetInnerHTML={ {__html:t("LOGIN_HOME_TITLE")}}>
					</h2>
				</div>
				<div className="login-home__btns">
					<button
						type="button"
						name="google"
						className="login-btn__google"
						onClick={onClickSocialLogin}
					>
						<span>{t("LOGIN_GOOGLE")}</span>
					</button>
					<button
						type="button"
						name="github"
						className="login-btn__github"
						onClick={onClickSocialLogin}
					>
						<span>{t("LOGIN_GITHUB")}</span>
					</button>
					<div className="btn_bar">
						<span className="bar"></span>
						<p>{t("LOGIN_OR")}</p>
						<span className="bar"></span>
					</div>
					<Link to="/users/signup">
						<button type="button" className="login-btn__signup">
							{t("SIGNUP")}
						</button>
					</Link>
				</div>
				<div className="login-home__txts">
					<p>
						{t("SIGNUP_TXT1")}
						<Link to="" className="link">
							{t("SIGNUP_BTN1")}
						</Link>
						,
						<Link to="" className="link">
							{t("SIGNUP_BTN2")}
						</Link>
						,
						<Link to="" className="link">
							{t("SIGNUP_BTN3")}
						</Link>
						{t("SIGNUP_TXT2")}
					</p>
				</div>
				<div className="login-home__login">
					<span>{t("LOGIN_TXT")}</span>
					<Link to="/users/login" className="link">
					{t("LOGIN_BTN")}
					</Link>
				</div>
			</div>
		</>
	);
}
