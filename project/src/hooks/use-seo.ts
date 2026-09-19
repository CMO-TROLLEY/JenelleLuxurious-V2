import { useEffect } from 'react';

interface SEOOptions {
  title: string;
  description?: string;
  canonical?: string;
  noindex?: boolean;
  ogImage?: string;
}

export function useSEO({ title, description, canonical, noindex, ogImage }: SEOOptions) {
  useEffect(() => {
    document.title = title;

    const ensureMeta = (name: string, content: string, attr: 'name' | 'property' = 'name') => {
      let el = document.querySelector(`meta[${attr}="${name}"]`) as HTMLMetaElement | null;
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attr, name);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    };

    if (description) {
      ensureMeta('description', description);
      ensureMeta('og:description', description, 'property');
    }
    ensureMeta('og:title', title, 'property');

    if (canonical) {
      let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
      if (!link) {
        link = document.createElement('link');
        link.setAttribute('rel', 'canonical');
        document.head.appendChild(link);
      }
      link.setAttribute('href', canonical);
    }

    if (noindex) {
      let robot = document.querySelector('meta[name="robots"]') as HTMLMetaElement | null;
      if (!robot) {
        robot = document.createElement('meta');
        robot.setAttribute('name', 'robots');
        document.head.appendChild(robot);
      }
      robot.setAttribute('content', 'noindex, nofollow');
    } else {
      const robot = document.querySelector('meta[name="robots"]');
      if (robot) robot.remove();
    }

    if (ogImage) ensureMeta('og:image', ogImage, 'property');
  }, [title, description, canonical, noindex, ogImage]);
}
