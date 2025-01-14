import { useNavigate } from "react-router-dom";
import logo from "../../assets/images/common/logo.png";

interface LoginStep2Props {
	error: string;
	email: string;
	password: string;
	onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
	onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
	setStep: (e: number) => void;
}

export default function LoginStep2({ error, email, password, onChange, onSubmit, setStep }: LoginStep2Props) {
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
					<div className="form__title">비밀번호를 입력하세요.</div>
					<div className="form__block">
						<label htmlFor="email">이메일</label>
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
					<div className="account-footer">
						<div className="footer_btns between">
							<button
								type="button"
								className="btn_prev"
								onClick={() => {
									setStep(1);
								}}
							>
								이전
							</button>
							<button
								type="submit"
								className="btn_signup"
								disabled={error.length > 0}
							>
								로그인
							</button>
						</div>
					</div>
				</form>
			</div>
		</>
	);
}