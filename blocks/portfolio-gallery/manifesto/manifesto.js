export default function decorate(block) {
  // Create the manifesto HTML structure
  block.innerHTML = `
    <!-- Mobile Menu Button -->
    <button class="mobile-menu-btn" id="mobile-menu-btn">K_A</button>
    
    <!-- Mobile Manifesto Overlay -->
    <div class="mobile-manifesto" id="mobile-manifesto">
      <div class="text-content">
        <p>I BELIEVE IT'S ABOUT MASTERING OUR CRAFT, BUILDING SOMETHING REAL, WITH THE PEOPLE WHO MEAN IT. I TRUST ONLY THE VISION OF THOSE WHO EXPRESS THEIR STYLE WITH TRUTH. TO GIVE BACK TO WHAT HAS INSPIRED AND MADE US.</p>
        
        <p>SHOWING THE WORLD THERE IS MORE. THE PASSION THAT DRIVES IT, THE ENERGY AT THE CORE OF EVERYTHING REAL.</p>
        
        <p>FOR ALL OF US WHO STILL CARE ABOUT MAKING THINGS THAT MATTER,</p>
        
        <p>THOSE ARE THE STORIES I WANT TO TELL.</p>
      </div>
      
      <div class="footer-content">
        <div>K_A / KILIAN AMENDOLA / DESIGN AT ADOBE + ART DIRECTION + ARCHITECTURE + DESIGN + DIGITAL</div>
        <div class="social-links">
          <a href="https://are.na/" target="_blank">ARE.NA</a> / 
          <a href="https://spotify.com/" target="_blank">SPOTIFY</a>
        </div>
      </div>
    </div>
    
    <!-- Desktop Manifesto -->
    <div class="text-content content-hidden">
      <p>I BELIEVE IT'S ABOUT MASTERING OUR CRAFT, BUILDING SOMETHING REAL, WITH THE PEOPLE WHO MEAN IT. I TRUST ONLY THE VISION OF THOSE WHO EXPRESS THEIR STYLE WITH TRUTH. TO GIVE BACK TO WHAT HAS INSPIRED AND MADE US.</p>
      
      <p>SHOWING THE WORLD THERE IS MORE. THE PASSION THAT DRIVES IT, THE ENERGY AT THE CORE OF EVERYTHING REAL.</p>
      
      <p>FOR ALL OF US WHO STILL CARE ABOUT MAKING THINGS THAT MATTER,</p>
      
      <p>THOSE ARE THE STORIES I WANT TO TELL.</p>
    </div>
    
    <!-- Footer -->
    <footer class="sticky-footer content-hidden">
      <div class="footer-content">
        <div>K_A / KILIAN AMENDOLA / DESIGN AT ADOBE + ART DIRECTION + ARCHITECTURE + DESIGN + DIGITAL</div>
        <div class="social-links">
          <a href="https://are.na/" target="_blank">ARE.NA</a> / 
          <a href="https://spotify.com/" target="_blank">SPOTIFY</a>
        </div>
      </div>
    </footer>
    
    <!-- Tooltip -->
    <div class="tooltip" id="tooltip"></div>
  `;
  
  // Setup mobile menu functionality
  setupMobileMenu();
}

function setupMobileMenu() {
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileManifesto = document.getElementById('mobile-manifesto');
  
  if (mobileMenuBtn && mobileManifesto) {
    mobileMenuBtn.addEventListener('click', () => {
      const isActive = mobileManifesto.classList.contains('active');
      
      if (isActive) {
        mobileManifesto.classList.remove('active');
        // Resume auto-scroll (this will be handled by the gallery block)
        document.dispatchEvent(new CustomEvent('resumeScroll'));
      } else {
        mobileManifesto.classList.add('active');
        // Pause auto-scroll (this will be handled by the gallery block)
        document.dispatchEvent(new CustomEvent('pauseScroll'));
      }
    });
    
    mobileManifesto.addEventListener('click', () => {
      mobileManifesto.classList.remove('active');
      document.dispatchEvent(new CustomEvent('resumeScroll'));
    });
  }
}
