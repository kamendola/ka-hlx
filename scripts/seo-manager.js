// Dynamic SEO management from Google Docs
export async function loadSEOConfig() {
  try {
    const response = await fetch('/config-index.json');
    const config = await response.json();
    const seoData = config.data[0]; // First config document
    
    if (seoData) {
      updatePageTitle(seoData.pageTitle);
      updateMetaTags(seoData);
      updateFavicon(seoData.favicon);
    }
  } catch (error) {
    console.warn('Could not load SEO config:', error);
  }
}

function updatePageTitle(title) {
  if (title) {
    document.title = title;
  }
}

function updateMetaTags(seoData) {
  const metaTags = {
    'description': seoData.metaDescription,
    'keywords': seoData.metaKeywords,
    'og:title': seoData.ogTitle,
    'og:description': seoData.ogDescription,
    'og:image': seoData.ogImage,
    'og:url': seoData.ogUrl
  };
  
  Object.entries(metaTags).forEach(([name, content]) => {
    if (content) {
      let meta = document.querySelector(`meta[name="${name}"], meta[property="${name}"]`);
      if (!meta) {
        meta = document.createElement('meta');
        if (name.startsWith('og:')) {
          meta.setAttribute('property', name);
        } else {
          meta.setAttribute('name', name);
        }
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', content);
    }
  });
}

function updateFavicon(faviconUrl) {
  if (faviconUrl) {
    let favicon = document.querySelector('link[rel="icon"]');
    if (!favicon) {
      favicon = document.createElement('link');
      favicon.rel = 'icon';
      document.head.appendChild(favicon);
    }
    favicon.href = faviconUrl;
  }
}
