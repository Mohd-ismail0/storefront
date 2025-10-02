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
		<header className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-neutral-200 shadow-sm">
			<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
				<div className="flex h-16 items-center justify-between">
					<div className="flex items-center">
						<Logo />
					</div>
					
					<div className="hidden md:flex md:items-center md:space-x-8">
						<Nav channel={channel} locale={locale} />
					</div>
					
					<div className="flex items-center space-x-4">
						<LocaleSwitcher currentLocale={locale} />
						<div className="md:hidden">
							<Nav channel={channel} locale={locale} />
						</div>
					</div>
				</div>
			</div>
		</header>
	);
}
