import logo from "../assets/images/common/logo.png";

export function LogoHeader() {
	return (
		<div className="logo_header">
			<div className="logo">
				<img src={logo} alt="로고" />
			</div>
		</div>
	);
}
