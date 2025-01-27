import { useNavigate } from "react-router-dom";
import logo from "../../assets/images/common/logo.png";
import useTranslation from "hooks/useTranslation";

interface LoginStep2Props {
	error: string;
	email: string;
	password: string;
	onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
	onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
	setStep: (e: number) => void;
}

export default function LoginStep2({ error, email, password, onChange, onSubmit, setStep }: LoginStep2Props) {
	const t = useTranslation();
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
			<div className="account-page">
				<form className="form form--lg" onSubmit={onSubmit}>
					<div className="form__title">{t("LOGIN_TITLE2")}</div>
					<div className="form__block">
						<label htmlFor="email">{t("SIGNUP_EMAIL")}</label>
						<input
							type="text"
							name="email"
							id="email"
							value={email}
							required
							readOnly
							autoComplete="off"
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
							onChange={onChange}
						/>
					</div>
					{error && error?.length > 0 && (
						<div className="form__block">
							<div className="form__error">{error}</div>
						</div>
					)}
					<div className="account-footer">
						<div className="footer_btns between">
							<button
								type="button"
								className="btn_prev"
								onClick={() => {
									setStep(1);
								}}
							>
								{t("BTN_PREV")}
							</button>
							<button
								type="submit"
								className="btn_signup"
								disabled={error.length > 0}
							>
								{t("LOGIN_BTN2")}
							</button>
						</div>
					</div>
				</form>
			</div>
		</>
	);
}