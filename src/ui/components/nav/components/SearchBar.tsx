import { redirect } from "next/navigation";
import { SearchIcon } from "lucide-react";

export const SearchBar = ({ 
	channel, 
	locale 
}: { 
	channel: string; 
	locale: string; 
}) => {
	async function onSubmit(formData: FormData) {
		"use server";
		const search = formData.get("search") as string;
		if (search && search.trim().length > 0) {
			redirect(`/${locale}/${encodeURIComponent(channel)}/search?query=${encodeURIComponent(search)}`);
		}
	}

	return (
		<form
			action={onSubmit}
			className="group relative flex w-full items-center"
		>
			<label className="w-full">
				<span className="sr-only">search for products</span>
				<input
					type="text"
					name="search"
					placeholder="Search for products..."
					autoComplete="on"
					required
					className="h-10 w-full rounded-lg border border-neutral-300 bg-white px-4 py-2 pr-10 text-sm text-neutral-900 placeholder:text-neutral-500 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 transition-all duration-200"
				/>
			</label>
			<div className="absolute inset-y-0 right-0 flex items-center pr-3">
				<button
					type="submit"
					className="inline-flex aspect-square w-6 items-center justify-center text-neutral-500 hover:text-primary-600 focus:text-primary-600 transition-colors duration-200"
				>
					<span className="sr-only">search</span>
					<SearchIcon aria-hidden className="h-5 w-5" />
				</button>
			</div>
		</form>
	);
};
