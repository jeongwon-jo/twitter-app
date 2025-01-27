import { useNavigate } from "react-router-dom"
import { GoHomeFill } from "react-icons/go";
import { IoPerson } from "react-icons/io5";
import { FiLogOut } from "react-icons/fi";
import { IoNotifications } from "react-icons/io5";
import { getAuth, signOut } from "firebase/auth";
import { IoSearch } from "react-icons/io5";
import { app } from "firebaseApp";
import { toast } from "react-toastify";
import useTranslation from "hooks/useTranslation";

export default function MenuList() {
	const t = useTranslation();
	const navigate = useNavigate();

	const onSignOut = async () => {
		try {
			const auth = getAuth(app);
			await signOut(auth);
			toast.success(t("TOAST_LOGOUT_COMPLETE"));
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
				<button type="button" onClick={() => navigate("/search")}>
					<IoSearch />
				</button>
				<button type="button" onClick={() => navigate("/profile")}>
					<IoPerson />
				</button>
				<button type="button" onClick={() => navigate("/notification")}>
					<IoNotifications />
				</button>
				<button type="button" onClick={onSignOut}>
					<FiLogOut />
				</button>
			</div>
		</div>
	);
}