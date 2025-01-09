import { useNavigate } from "react-router-dom";
import logo from "../../assets/images/common/logo.png";

interface LoginStep1Props {
	error: string;
	email: string;
	onChange: any;
	setStep: any;
}

export default function LoginStep1({ error, email, onChange, setStep }: LoginStep1Props) {
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
				<form className="form form--lg">
					<div className="form__title">
						시작하려면 먼저 이메일을 입력하세요.
					</div>
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
					{error && error?.length > 0 && (
						<div className="form__block">
							<div className="form__error">{error}</div>
						</div>
					)}
					<div className="account-footer">
						<div className="footer_btns right">
							<button type="button" className="btn_signup" onClick={() => { setStep(2) }} disabled={error.length > 0}>
								다음
							</button>
						</div>
					</div>
				</form>
			</div>
		</>
	);
}
