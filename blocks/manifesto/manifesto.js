export default function decorate(block) {
  // Fetch manifesto content from Google Docs
  loadManifestoContent();
  setupMobileMenu();
}

async function loadManifestoContent() {
  try {
    const response = await fetch('/manifesto-content.plain.html');
    const html = await response.text();
    
    // Update both desktop and mobile manifesto with Google Docs content
    const desktopManifesto = document.querySelector('.text-content');
    const mobileManifesto = document.querySelector('.mobile-manifesto .text-content');
    
    if (desktopManifesto) {
      desktopManifesto.innerHTML = html;
    }
    
    if (mobileManifesto) {
      mobileManifesto.innerHTML = html;
    }
  } catch (error) {
    console.warn('Could not load manifesto content:', error);
  }
}

function setupMobileMenu() {
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileManifesto = document.getElementById('mobile-manifesto');
  
  if (mobileMenuBtn && mobileManifesto) {
    mobileMenuBtn.addEventListener('click', () => {
      const isActive = mobileManifesto.classList.contains('active');
      
      if (isActive) {
        mobileManifesto.classList.remove('active');
        window.isPaused = false;
      } else {
        mobileManifesto.classList.add('active');
        window.isPaused = true;
      }
    });
    
    mobileManifesto.addEventListener('click', () => {
      mobileManifesto.classList.remove('active');
      window.isPaused = false;
    });
  }
}
