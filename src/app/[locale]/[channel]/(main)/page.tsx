import { ProductListByCollectionDocument } from "@/gql/graphql";
import { executeGraphQL } from "@/lib/graphql";
import { ProductCard } from "@/components/ui/product-card";

export const metadata = {
	title: "Modern Ecommerce Store - Premium Shopping Experience",
	description:
		"Discover premium products with our modern ecommerce platform. Available in Arabic and English with advanced filtering and personalized recommendations.",
};

export default async function Page(props: { 
	params: Promise<{ locale: string; channel: string }> 
}) {
	const { locale, channel } = await props.params;
	
	const data = await executeGraphQL(ProductListByCollectionDocument, {
		variables: {
			slug: "featured-products",
			channel: channel,
		},
		revalidate: 60,
	});

	if (!data.collection?.products) {
		return (
			<section className="container mx-auto px-4 py-16">
				<div className="text-center">
					<h2 className="text-3xl font-bold text-foreground">
						{locale === 'ar' ? 'لا توجد منتجات متاحة حالياً' : 'No products available at the moment'}
					</h2>
					<p className="mt-4 text-lg text-muted-foreground">
						{locale === 'ar' ? 'يرجى المحاولة مرة أخرى لاحقاً' : 'Please try again later'}
					</p>
				</div>
			</section>
		);
	}

	const products = data.collection?.products.edges.map(({ node: product }) => product);

	return (
		<section className="container mx-auto px-4 py-16">
			<div className="mb-12 text-center">
				<h1 className="text-4xl font-bold text-foreground mb-4">
					{locale === 'ar' ? 'منتجات مميزة' : 'Featured Products'}
				</h1>
				<p className="text-lg text-muted-foreground max-w-2xl mx-auto">
					{locale === 'ar' 
						? 'اكتشف منتجاتنا المميزة المختارة بعناية لتجربة تسوق استثنائية'
						: 'Discover our carefully curated selection of premium products for an exceptional shopping experience'
					}
				</p>
			</div>
			
			<div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
				{products.map((product) => (
					<ProductCard
						key={product.id}
						id={product.id}
						name={product.name}
						slug={product.slug}
						price={{
							amount: product.pricing?.priceRange?.start?.gross?.amount || 0,
							currency: product.pricing?.priceRange?.start?.gross?.currency || 'USD',
						}}
						image={product.thumbnail ? {
							url: product.thumbnail.url,
							alt: product.thumbnail.alt || product.name,
						} : undefined}
						onAddToCart={(productId) => {
							console.log('Add to cart:', productId);
						}}
						onAddToWishlist={(productId) => {
							console.log('Add to wishlist:', productId);
						}}
						onQuickView={(productId) => {
							console.log('Quick view:', productId);
						}}
					/>
				))}
			</div>
		</section>
	);
}
