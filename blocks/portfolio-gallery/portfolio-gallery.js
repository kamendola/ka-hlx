// Your exact gallery functionality adapted for AEM.live
export default function decorate(block) {
  // Fetch projects from AEM.live's query index
  fetch('/projects-index.json')
    .then(response => response.json())
    .then(data => {
      // Convert AEM.live table data to your project format
      const projects = data.data.map(row => ({
        mediaUrl: row.mediaUrl,
        mediaType: row.mediaType,
        tooltip: row.tooltip,
        alt: row.tooltip // tooltip = alt text
      }));
      
      // Your existing generateGallery() logic
      generateGalleryFromProjects(projects);
      
      // Your existing interaction setup
      setupInteractions();
      setupEndlessScroll();
      configureVideos();
      autoScroll();
    });
}

// Your SETTINGS object
const SETTINGS = {
  normalScrollSpeed: 1,
  slowScrollSpeed: 0.5,
  mobileScrollSpeed: 1.5,
  scrollThreshold: 120,
  tapDistanceThreshold: 10,
  tapTimeThreshold: 200,
  tooltipOffsetX: 15,
  tooltipOffsetY: -10
};

// Your exact existing functions
let loadedItems = 0;
let totalItems = 0;
let isManualScrolling = false;
let scrollTimeout;
let scrollAccumulator = 0;
let isPaused = false;
let isSlowMode = false;
let isHovering = false;

function generateGalleryFromProjects(projects) {
  const galleryContent = document.getElementById('gallery-content');
  totalItems = projects.filter(p => p.mediaUrl).length;
  
  projects.forEach((project) => {
    const item = document.createElement('div');
    item.className = 'gallery-item';
    
    if (project.mediaUrl && project.mediaType === 'video') {
      const video = document.createElement('video');
      video.src = project.mediaUrl;
      video.addEventListener('loadeddata', () => {
        loadedItems++;
        updateProgress();
      });
      video.addEventListener('error', () => {
        loadedItems++;
        updateProgress();
      });
      item.appendChild(video);
    } else if (project.mediaUrl && project.mediaType === 'image') {
      const img = document.createElement('img');
      img.src = project.mediaUrl;
      img.alt = project.alt || 'Gallery item';
      img.addEventListener('load', () => {
        loadedItems++;
        updateProgress();
      });
      img.addEventListener('error', () => {
        loadedItems++;
        updateProgress();
      });
      item.appendChild(img);
    }
    
    galleryContent.appendChild(item);
  });
  
  if (totalItems === 0) {
    const loadingScreen = document.getElementById('loading-screen');
    if (loadingScreen) loadingScreen.classList.add('hidden');
  }
}

// All your other functions exactly as they are...
function updateProgress() {
  const loadingScreen = document.getElementById('loading-screen');
  const loadingPercentage = document.getElementById('loading-percentage');
  
  if (!loadingPercentage) return;
  
  const progress = totalItems > 0 ? Math.round((loadedItems / totalItems) * 100) : 100;
  loadingPercentage.textContent = progress.toString().padStart(3, '0') + '%';
  
  if (loadedItems === totalItems) {
    setTimeout(() => {
      document.querySelectorAll('.content-hidden').forEach(el => {
        el.classList.remove('content-hidden');
      });
      
      if (loadingScreen) {
        loadingScreen.classList.add('hidden');
        setTimeout(() => {
          loadingScreen.style.display = 'none';
        }, 500);
      }
    }, 200);
  }
}

function setupEndlessScroll() {
  const container = document.querySelector('section');
  const original = container.querySelector('article');
  const cloned = original.cloneNode(true);
  container.appendChild(cloned);
}

function autoScroll() {
  if (isPaused || isManualScrolling) {
    requestAnimationFrame(autoScroll);
    return;
  }
  
  const isMobile = 'ontouchstart' in window;
  let currentSpeed;
  
  if (isMobile) {
    currentSpeed = isSlowMode ? SETTINGS.slowScrollSpeed : SETTINGS.mobileScrollSpeed;
  } else {
    currentSpeed = isHovering ? SETTINGS.slowScrollSpeed : SETTINGS.normalScrollSpeed;
  }
  
  scrollAccumulator += currentSpeed;
  
  if (scrollAccumulator >= 1) {
    const pixelsToScroll = Math.floor(scrollAccumulator);
    window.scrollBy(0, pixelsToScroll);
    scrollAccumulator -= pixelsToScroll;
  }
  
  requestAnimationFrame(autoScroll);
}

function setupInteractions() {
  // Setup endless scroll first
  setupEndlessScroll();
  
  // Initialize scroll position
  window.scrollTo(0, SETTINGS.scrollThreshold);
  
  // Setup scroll listener
  const original = document.querySelector('article');
  window.addEventListener('scroll', () => {
    const halfHeight = original.clientHeight;

    if (window.scrollY > halfHeight + SETTINGS.scrollThreshold) {
      window.scrollTo(0, window.scrollY - halfHeight);
    } else if (window.scrollY < SETTINGS.scrollThreshold) {
      window.scrollTo(0, halfHeight + window.scrollY);
    }
  });

  // Mobile touch detection
  if ('ontouchstart' in window) {
    let touchStartTime = 0;
    
    document.addEventListener('touchstart', () => {
      touchStartTime = Date.now();
    }, { passive: true });
    
    document.addEventListener('touchmove', () => {
      if (Date.now() - touchStartTime > 50) {
        isManualScrolling = true;
        clearTimeout(scrollTimeout);
      }
    }, { passive: true });
    
    document.addEventListener('touchend', () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        isManualScrolling = false;
      }, 200);
    }, { passive: true });
  }

  // Setup tooltips
  setTimeout(() => {
    const tooltip = document.getElementById('tooltip');
    const allItems = document.querySelectorAll('.gallery-item');
    
    allItems.forEach((item, index) => {
      const projectIndex = index % totalItems;
      
      // Desktop hover
      if (!('ontouchstart' in window)) {
        item.addEventListener('mouseenter', () => {
          isHovering = true;
          const project = projects[projectIndex];
          if (tooltip && project) {
            tooltip.textContent = project.tooltip || 'PROJECT NAME\nDETAILS HERE';
            tooltip.classList.add('visible');
          }
        });
        
        item.addEventListener('mouseleave', () => {
          isHovering = false;
          if (tooltip) tooltip.classList.remove('visible');
        });
        
        item.addEventListener('mousemove', (e) => {
          if (tooltip) {
            tooltip.style.left = e.clientX + SETTINGS.tooltipOffsetX + 'px';
            tooltip.style.top = e.clientY + SETTINGS.tooltipOffsetY + 'px';
          }
        });
      }
      
      // Mobile tap
      if ('ontouchstart' in window) {
        let tapStartY = 0;
        let tapStartTime = 0;
        let hasMoved = false;
        
        item.addEventListener('touchstart', (e) => {
          tapStartY = e.touches[0].clientY;
          tapStartTime = Date.now();
          hasMoved = false;
        }, { passive: true });
        
        item.addEventListener('touchmove', (e) => {
          const currentY = e.touches[0].clientY;
          if (Math.abs(currentY - tapStartY) > SETTINGS.tapDistanceThreshold) {
            hasMoved = true;
          }
        }, { passive: true });
        
        item.addEventListener('touchend', (e) => {
          const tapEndTime = Date.now();
          const tapDuration = tapEndTime - tapStartTime;
          
          if (!hasMoved && tapDuration < SETTINGS.tapTimeThreshold) {
            e.preventDefault();
            const project = projects[projectIndex];
            
            if (isSlowMode && tooltip && tooltip.classList.contains('visible')) {
              tooltip.classList.remove('visible');
              isSlowMode = false;
            } else {
              isSlowMode = true;
              if (tooltip && project && project.tooltip) {
                tooltip.textContent = project.tooltip;
                tooltip.style.left = e.changedTouches[0].clientX + 'px';
                tooltip.style.top = (e.changedTouches[0].clientY - 60) + 'px';
                tooltip.classList.add('visible');
              }
            }
          }
        });
      }
    });
  }, 100);
}

function configureVideos() {
  document.querySelectorAll('video').forEach(video => {
    video.autoplay = true;
    video.muted = true;
    video.loop = true;
    video.playsInline = true;
  });
}

// Start everything
configureVideos();
const observer = new MutationObserver(configureVideos);
observer.observe(document.body, { childList: true, subtree: true });
