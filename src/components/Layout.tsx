import { ReactNode } from "react"
import MenuList from "./Menu"

interface LayoutProps {
	children: ReactNode;
	isAuthenticated: boolean;
}

export const Layout = ({ children, isAuthenticated }: LayoutProps,) => {
	return (
		<div className="layout">
			{children}
			{isAuthenticated ? <MenuList /> : ''}
		</div>
	);
};