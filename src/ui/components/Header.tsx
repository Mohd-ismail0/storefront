import { Logo } from "./Logo";
import { Nav } from "./nav/Nav";
import { LocaleSwitcher } from "./LocaleSwitcher";

export function Header({ 
	channel, 
	locale 
}: { 
	channel: string; 
	locale: string; 
}) {
	return (
		<header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
			<div className="container flex h-16 items-center">
				<div className="mr-4 flex">
					<Logo />
				</div>
				
				<div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
					<div className="w-full flex-1 md:w-auto md:flex-none">
						<div className="hidden md:flex md:items-center md:space-x-6">
							<Nav channel={channel} locale={locale} />
						</div>
					</div>
					
					<nav className="flex items-center space-x-2">
						<LocaleSwitcher currentLocale={locale} />
						<div className="md:hidden">
							<Nav channel={channel} locale={locale} />
						</div>
					</nav>
				</div>
			</div>
		</header>
	);
}
