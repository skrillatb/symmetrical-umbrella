import type { APIRoute } from "astro";

export const GET: APIRoute = async ({ params, request }) => {
    const url = new URL(request.url);
    const title = url.searchParams.get("title")

    const data = await fetch(`${import.meta.env.API_SEARCH_URL}/search/${title}`)

    const results = await data.json();

    return new Response(JSON.stringify(results), {
        headers: {
            "Content-Type": "application/json",
            "Cache-Control": "public, max-age=3600, s-maxage=3600",
        },
    });

};