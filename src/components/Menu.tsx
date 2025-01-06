import { useNavigate } from "react-router-dom"
import { GoHomeFill } from "react-icons/go";
import { IoPerson } from "react-icons/io5";
import { FiLogOut } from "react-icons/fi";

export default function MenuList() {
  const navigate = useNavigate();

  return (
		<div className="footer">
			<div className="footer__grid">
				<button type="button" onClick={() => navigate("/")}>
					<GoHomeFill />
				</button>
				<button type="button" onClick={() => navigate("/profile")}>
					<IoPerson />
				</button>
				<button type="button" onClick={() => navigate("/")}>
					<FiLogOut />
				</button>
			</div>
		</div>
	);
}