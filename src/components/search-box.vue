<script setup lang="ts">
import { ref, watch, reactive, onMounted } from "vue";
import { config } from "#/config";

export type Item = {
    title: string;
    link: string;
    image: string;
    provider: string;
    lang: string;
};

const props = defineProps<{
    initialQuery?: string;
    initialData?: Item[];
    endpoint?: string;
    param?: string;
}>();

const endpoint = props.endpoint ?? "/api/search.json";
const param = props.param ?? "title";

const query = ref(props.initialQuery ?? "");
const items = ref<Item[]>(Array.isArray(props.initialData) ? props.initialData : []);
const loading = ref(false);
const error = ref<string | null>(null);

const broken = reactive(new Set<number>());
const gridRef = ref<HTMLElement | null>(null);

// simple cache
const cache = new Map<string, Item[]>();

let debounceId: number | undefined;
let ctrl: AbortController | null = null;

onMounted(() => {
    const imgs = gridRef.value?.querySelectorAll<HTMLImageElement>('img[data-idx]') ?? [];
    imgs.forEach(img => {
        const idx = Number(img.dataset.idx);
        if (img.complete && img.naturalWidth === 0) broken.add(idx);
    });

    window.addEventListener("popstate", () => {
        const u = new URL(window.location.href);
        query.value = u.searchParams.get(param) ?? "";
    });
});

function syncUrl(q: string, push = false) {
    const u = new URL(window.location.href);
    if (q) u.searchParams.set(param, q);
    else u.searchParams.delete(param);
    if (push) history.pushState(null, "", u);
    else history.replaceState(null, "", u);
}

async function searchNow(q: string) {
    const trimmed = q.trim();
    if (!trimmed) {
        items.value = [];
        syncUrl("");
        return;
    }

    if (cache.has(trimmed)) {
        items.value = cache.get(trimmed)!;
        syncUrl(trimmed);
        return;
    }

    if (ctrl) ctrl.abort();
    ctrl = new AbortController();

    loading.value = true;
    error.value = null;

    try {
        const res = await fetch(
            `${endpoint}?${param}=${encodeURIComponent(trimmed)}`,
            { signal: ctrl.signal }
        );
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json() as { results?: Item[] };
        const list = Array.isArray(json?.results) ? json.results : [];
        cache.set(trimmed, list);
        items.value = list;
        syncUrl(trimmed);
    } catch (e: any) {
        if (e?.name === "AbortError") return;
        error.value = e?.message || "Erreur inconnue";
    } finally {
        loading.value = false;
    }
}

// debounce leger
watch(query, (q) => {
    if (debounceId) window.clearTimeout(debounceId);
    debounceId = window.setTimeout(() => { searchNow(q); }, 400);
});

function search() {
    syncUrl(query.value, true);
    searchNow(query.value);
}
</script>

<template>
    <div class="max-w-[570px] !mx-auto ">

        <input v-model="query" @keyup.enter="search()" type="text" :placeholder="config.search_placeholder"
            class="mb-4 rounded-full w-full px-5 py-3.5 outline-none border border-border shadow-2xs" />
        <div class="w-full mb-8">
            <ul class="flex flex-wrap justify-center gap-2">
                <li v-for="(s, i) in config.suggestions" :key="i">
                    <button @click="query = s"
                        class="!cursor-pointer rounded-full hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50 h-9 px-4 py-2 flex items-center justify-center">
                        {{ s }}
                    </button>
                </li>
            </ul>
        </div>
    </div>

    <div ref="gridRef" class="grid gap-3 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
        v-if="items.length">
        <a v-for="(it, i) in items" :key="i" :href="it.link" target="_blank" rel="noopener noreferrer" :title="it.title"
            class="bg-secondary group min-w-0 rounded text-secondary-foreground duration-300 hover:duration-100 hover:bg-secondary/50 transition-colors flex flex-col">
            <div class="flex justify-between gap-4 p-4">
                <p class="text-sm line-clamp-1">Disponible sur {{ it.provider }}</p>
                <p class="text-sm">{{ it.lang.toUpperCase() }}</p>
            </div>

            <div class="flex flex-1 items-center justify-center">
                <div class="h-full flex justify-center items-center max-h-64 p-4">
                    <div class="h-full max-h-64 2xl:max-h-80 overflow-hidden">
                        <img v-if="!broken.has(i)" :data-idx="i" :src="it.image" :alt="it.title"
                            class="w-full h-full object-cover rounded" loading="lazy" @error="broken.add(i)" />
                        <div v-else class="flex justify-center items-center h-64 p-4">
                            <div class="h-full 2xl:max-h-80 flex justify-center items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32"
                                    class="fill-muted-foreground size-[100px]" viewBox="0 0 256 256">
                                    <path
                                        d="M112,164a12,12,0,1,1-12-12A12,12,0,0,1,112,164Zm44-12a12,12,0,1,0,12,12A12,12,0,0,0,156,152Zm60,36a52,52,0,0,1-88,37.52A52,52,0,1,1,56.72,149.8,71.58,71.58,0,0,1,63,129C44,91.1,32.53,40.76,45.64,19.08A22,22,0,0,1,65.06,8c14.12,0,26,11.89,36.44,36.36,6.22,14.62,10.85,31.32,14,44.74a71.8,71.8,0,0,1,25,0c3.13-13.42,7.76-30.12,14-44.74C164.9,19.89,176.82,8,190.94,8a22,22,0,0,1,19.42,11.08C223.47,40.76,212,91.1,193,129a71.58,71.58,0,0,1,6.26,20.76A51.77,51.77,0,0,1,216,188ZM155.89,93.63a71.72,71.72,0,0,1,26.88,19.64A218.45,218.45,0,0,0,197.6,67.08c3.49-18.13,3.15-33-.93-39.72A6,6,0,0,0,190.94,24c-6.61,0-14.52,9.7-21.72,26.62C163.29,64.56,158.87,80.74,155.89,93.63ZM73.23,113.27a71.72,71.72,0,0,1,26.88-19.64c-3-12.89-7.4-29.07-13.33-43C79.58,33.7,71.67,24,65.06,24a6,6,0,0,0-5.73,3.36C55.25,34.1,54.91,49,58.4,67.08A218.45,218.45,0,0,0,73.23,113.27ZM200,188a35.87,35.87,0,0,0-13.34-28,8,8,0,0,1-2.92-5.45,56,56,0,0,0-111.48,0A8,8,0,0,1,69.34,160a36,36,0,1,0,47.28,54.21l-9.74-8.09a8,8,0,1,1,10.24-12.3L128,202.9l10.88-9.05a8,8,0,0,1,10.24,12.3l-9.74,8.09A36,36,0,0,0,200,188Z" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="flex justify-between gap-2 p-4">
                <p class="text-sm line-clamp-1">{{ it.title }}</p>
            </div>
        </a>
    </div>
</template>
