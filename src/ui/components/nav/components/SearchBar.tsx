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
					className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 pr-9"
				/>
			</label>
			<div className="absolute inset-y-0 right-0 flex items-center pr-3">
				<button
					type="submit"
					className="inline-flex aspect-square w-6 items-center justify-center text-muted-foreground hover:text-foreground focus:text-foreground transition-colors duration-200"
				>
					<span className="sr-only">search</span>
					<SearchIcon aria-hidden className="h-4 w-4" />
				</button>
			</div>
		</form>
	);
};
