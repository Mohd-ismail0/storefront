import Link from "next/link";
import Image from "next/image";
import { LinkWithChannel } from "../atoms/LinkWithChannel";
import { ChannelSelect } from "./ChannelSelect";
import { ChannelsListDocument, MenuGetBySlugDocument } from "@/gql/graphql";
import { executeGraphQL } from "@/lib/graphql";

export async function Footer({ 
	channel, 
	locale: _locale 
}: { 
	channel: string; 
	locale: string; 
}) {
	const footerLinks = await executeGraphQL(MenuGetBySlugDocument, {
		variables: { slug: "footer", channel },
		revalidate: 60 * 60 * 24,
	});
	const channels = process.env.SALEOR_APP_TOKEN
		? await executeGraphQL(ChannelsListDocument, {
				withAuth: false, // disable cookie-based auth for this call
				headers: {
					// and use app token instead
					Authorization: `Bearer ${process.env.SALEOR_APP_TOKEN}`,
				},
		  })
		: null;
	const currentYear = new Date().getFullYear();

	return (
		<footer className="border-t bg-background">
			<div className="container py-8 md:py-12">
				<div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
					{footerLinks.menu?.items?.map((item) => {
						return (
							<div key={item.id} className="space-y-4">
								<h3 className="text-lg font-semibold">{item.name}</h3>
								<ul className="space-y-3">
									{item.children?.map((child) => {
										if (child.category) {
											return (
												<li key={child.id}>
													<LinkWithChannel 
														href={`/categories/${child.category.slug}`}
														className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200"
													>
														{child.category.name}
													</LinkWithChannel>
												</li>
											);
										}
										if (child.collection) {
											return (
												<li key={child.id}>
													<LinkWithChannel 
														href={`/collections/${child.collection.slug}`}
														className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200"
													>
														{child.collection.name}
													</LinkWithChannel>
												</li>
											);
										}
										if (child.page) {
											return (
												<li key={child.id}>
													<LinkWithChannel 
														href={`/pages/${child.page.slug}`}
														className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200"
													>
														{child.page.title}
													</LinkWithChannel>
												</li>
											);
										}
										if (child.url) {
											return (
												<li key={child.id}>
													<LinkWithChannel 
														href={child.url}
														className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200"
													>
														{child.name}
													</LinkWithChannel>
												</li>
											);
										}
										return null;
									})}
								</ul>
							</div>
						);
					})}
				</div>

				{channels?.channels && (
					<div className="mt-8 border-t pt-8">
						<div className="flex items-center gap-2 text-sm text-muted-foreground">
							<span>Change currency:</span> 
							<ChannelSelect channels={channels.channels} />
						</div>
					</div>
				)}

				<div className="mt-8 flex flex-col justify-between border-t pt-8 sm:flex-row sm:items-center">
					<p className="text-sm text-muted-foreground">
						Copyright &copy; {currentYear} Modern Ecommerce Store. All rights reserved.
					</p>
					<div className="flex items-center gap-4 mt-4 sm:mt-0">
						<p className="flex items-center gap-2 text-sm text-muted-foreground">
							Powered by{" "}
							<Link 
								target="_blank" 
								href="https://saleor.io/"
								className="text-primary hover:text-primary/80 transition-colors duration-200"
							>
								Saleor
							</Link>
						</p>
						<Link 
							href="https://github.com/saleor/saleor" 
							target="_blank" 
							className="opacity-60 hover:opacity-100 transition-opacity duration-200"
						>
							<Image 
								alt="Saleor github repository" 
								height={20} 
								width={20} 
								src="/github-mark.svg" 
								className="invert"
							/>
						</Link>
					</div>
				</div>
			</div>
		</footer>
	);
}
