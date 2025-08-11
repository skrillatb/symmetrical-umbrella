import type { Category, CategoryById, Index, SeoIndex, ShowById } from "#/types/ss-api";

export class SSApiService {
    private readonly API_URL = import.meta.env.API_URL_SITES!;
    private readonly API_KEY = import.meta.env.API_KEY_SITES!;

    private async get<T>(endpoint: string): Promise<T> {
        const res = await fetch(`${this.API_URL}${endpoint}`, {
            headers: {
                Authorization: `Bearer ${this.API_KEY}`,
            },
        });
        if (!res.ok) throw new Error(`Request failed: ${res.status}`);
        return res.json() as Promise<T>;
    }

    index(): Promise<Index> {
        return this.get<Index>("/sites");
    }

    count(): Promise<{ count: number }> {
        return this.get<{ count: number }>("/sites/count");
    }

    show(id: string): Promise<ShowById> {
        return this.get(`/sites/${id}`);
    }

    categories(): Promise<Category[]> {
        return this.get<Category[]>("/categories");
    }

    category(id: string): Promise<CategoryById> {
        return this.get<CategoryById>(`/categories/${id}`);
    }

    seo(): Promise<SeoIndex> {
        return this.get("/sites/seo");
    }

    categorySeo(slug: string): Promise<SeoIndex> {
        return this.get(`/categories/seo/${slug}`);
    }
}
