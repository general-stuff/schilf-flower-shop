import CssBaseline from "@mui/material/CssBaseline";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import type { Metadata } from "next";
import "@fortawesome/fontawesome-svg-core/styles.css";
import { config } from "@fortawesome/fontawesome-svg-core";
import "./layout.css";

config.autoAddCss = false;

export const metadata: Metadata = {
	title: "Flower Shop",
	description: "A flower shop application",
};

const navLinks = [
	{ href: "/", label: "Home" },
	{ href: "/chat", label: "Chat" },
	{ href: "/orders", label: "Orders" },
];

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en">
			<body>
				<AppRouterCacheProvider>
					<CssBaseline />
					<header className="site-header">
						<h1 className="site-header__title">Flower Shop</h1>
						<nav className="site-nav">
							{navLinks.map((link) => (
								<a key={link.href} href={link.href} className="site-nav__link">
									{link.label}
								</a>
							))}
						</nav>
					</header>
					<main>{children}</main>
				</AppRouterCacheProvider>
			</body>
		</html>
	);
}
