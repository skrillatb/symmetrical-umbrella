export interface BaseResponseSite {
  cdn: string;
  sites: Site[];
}

type Site = {
  created_at: Date;
  featured: boolean;
  id: string;
  image_id: string;
  name: string;
  note: number;
  updated_at: Date;
  url: string;
  description: string;
};

type Category = {
  count: number;
  id: string;
  slug: string;
  title: string;
};

type Index = BaseResponseSite & {
  count: number;
  sites: Site[];
};

type CategoryById = BaseResponseSite & {
  sites: Site[];
};

type SeoIndex = {
  seo_description: string;
  seo_image: string;
  seo_title: string;
  site_description: string;
  site_name: string;
  site_url: string;
};

type ShowById = {
  categories: Category[];
  site: Site;
  cdn: string;
  status: {
    checked_at: Date;
    http_code: number;
    status_text: string;
  };
};

export type { Category, CategoryById, Index, SeoIndex, ShowById, Site };
