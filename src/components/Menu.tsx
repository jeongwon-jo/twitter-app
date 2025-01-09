import { useNavigate } from "react-router-dom"
import { GoHomeFill } from "react-icons/go";
import { IoPerson } from "react-icons/io5";
import { FiLogIn } from "react-icons/fi";
import { FiLogOut } from "react-icons/fi";
import { useContext } from "react";
import { getAuth, signOut } from "firebase/auth";
import AuthContext from "context/AuthContext";
import { app } from "firebaseApp";
import { toast } from "react-toastify";

export default function MenuList() {
	const {user} = useContext(AuthContext)
	const navigate = useNavigate();

	const onSignOut = async () => {
		try {
			const auth = getAuth(app);
			await signOut(auth);
			toast.success("로그아웃 되었습니다.");
		} catch (error: any) {
			toast.error(error.code);
			console.log(error);
		}
	};
	
  return (
		<div className="footer">
			<div className="footer__grid">
				<button type="button" onClick={() => navigate("/")}>
					<GoHomeFill />
				</button>
				<button type="button" onClick={() => navigate("/profile")}>
					<IoPerson />
				</button>
				{user === null ? (
					<button type="button" onClick={() => navigate("/users/login")}>
						<FiLogIn />
					</button>
				) : (
					<button type="button" onClick={onSignOut}>
						<FiLogOut />
					</button>
				)}
			</div>
		</div>
	);
}