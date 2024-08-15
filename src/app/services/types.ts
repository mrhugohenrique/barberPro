export type Product = {
	id: number;
	name: string | null | undefined | number;
	price: string | null | undefined | number;
};

export type ProductsResponse = {
	response: Product[];
};

export type httpClientResponse = {
	response: {
		success: boolean;
		message: string;
	};
};
