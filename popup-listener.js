import { initializeApp } from 'https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js';
import { getDatabase, ref, onValue } from 'https://www.gstatic.com/firebasejs/11.0.2/firebase-database.js';

const firebaseConfig = {
  apiKey: "AIzaSyB8oqnBNwo-LL3wJxU6x1pqIZwlCdF7JCU",
  authDomain: "void-ann.firebaseapp.com",
  databaseURL: "https://void-ann-default-rtdb.firebaseio.com",
  projectId: "void-ann",
  storageBucket: "void-ann.firebasestorage.app",
  messagingSenderId: "323948351263",
  appId: "1:323948351263:web:239c326fbe0e1c25f4aa2a"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

let lastTimestamp = localStorage.getItem('lastAnnouncementTimestamp') || 0;

function showBanner(message) {
  const existingBanner = document.getElementById('void-announcement-banner');
  if (existingBanner) {
    existingBanner.remove();
  }

  const style = document.createElement('style');
  style.id = 'void-announcement-styles';
  style.textContent = `
    @keyframes slideInRight {
      from {
        transform: translateX(450px);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }
    
    @keyframes slideOutRight {
      from {
        transform: translateX(0);
        opacity: 1;
      }
      to {
        transform: translateX(450px);
        opacity: 0;
      }
    }
    
    @keyframes holographicPulse {
      0%, 100% { 
        background-position: 0% 50%;
      }
      50% { 
        background-position: 100% 50%;
      }
    }
    
    @keyframes floatGlow {
      0%, 100% {
        box-shadow: 0 20px 60px rgba(0,0,0,0.35),
                    0 10px 30px rgba(255,255,255,0.08),
                    inset 0 1px 0 rgba(255,255,255,0.15),
                    0 0 40px rgba(255,255,255,0.06);
      }
      50% {
        box-shadow: 0 25px 70px rgba(0,0,0,0.4),
                    0 12px 35px rgba(255,255,255,0.12),
                    inset 0 1px 0 rgba(255,255,255,0.2),
                    0 0 50px rgba(255,255,255,0.08);
      }
    }
  `;
  
  if (!document.getElementById('void-announcement-styles')) {
    document.head.appendChild(style);
  }

  const banner = document.createElement('div');
  banner.id = 'void-announcement-banner';
  banner.style.cssText = `
    position: fixed;
    top: 25px;
    right: 25px;
    background: linear-gradient(135deg, 
      rgba(255, 255, 255, 0.12) 0%,
      rgba(255, 255, 255, 0.08) 25%,
      rgba(255, 255, 255, 0.06) 50%,
      rgba(255, 255, 255, 0.09) 75%,
      rgba(255, 255, 255, 0.07) 100%
    ),
    linear-gradient(90deg, 
      rgba(255, 255, 255, 0.02) 0%,
      transparent 50%,
      rgba(255, 255, 255, 0.02) 100%
    );
    border: 1.5px solid rgba(255, 255, 255, 0.18);
    border-radius: 20px;
    padding: 24px 30px;
    color: white;
    max-width: 420px;
    min-width: 320px;
    font-family: 'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    backdrop-filter: blur(50px) saturate(180%) brightness(110%);
    -webkit-backdrop-filter: blur(50px) saturate(180%) brightness(110%);
    box-shadow: 0 20px 60px rgba(0,0,0,0.35),
                0 10px 30px rgba(255,255,255,0.08),
                inset 0 1px 0 rgba(255,255,255,0.15),
                0 0 40px rgba(255,255,255,0.06);
    z-index: 2147483647;
    animation: slideInRight 0.8s cubic-bezier(0.23, 1, 0.32, 1) forwards, floatGlow 3s ease-in-out infinite;
    user-select: none;
    pointer-events: auto;
    filter: blur(0.3px);
  `;

  const header = document.createElement('div');
  header.style.cssText = `
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
    gap: 18px;
  `;

  const title = document.createElement('div');
  title.style.cssText = `
    font-weight: 800;
    font-size: 17px;
    letter-spacing: 1.2px;
    background: linear-gradient(
      45deg,
      #ffffff 0%,
      #f0f0f0 15%,
      #e8e8e8 30%,
      #f5f5f5 45%,
      #ffffff 60%,
      #f2f2f2 75%,
      #ffffff 100%
    );
    background-size: 400% 400%;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    animation: holographicPulse 4s ease-in-out infinite;
    text-shadow: 0 0 25px rgba(255, 255, 255, 0.25);
    filter: drop-shadow(0 0 18px rgba(255, 255, 255, 0.15)) blur(0.2px);
    flex: 1;
  `;
  title.textContent = '📢 ANNOUNCEMENT';

  const closeBtn = document.createElement('button');
  closeBtn.style.cssText = `
    background: transparent;
    border: none;
    color: rgba(255, 255, 255, 0.7);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.5s cubic-bezier(0.23, 1, 0.32, 1);
    flex-shrink: 0;
    padding: 0;
    filter: blur(0.2px);
  `;
  closeBtn.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" style="transition: all 0.4s cubic-bezier(0.23, 1, 0.32, 1); filter: drop-shadow(0 0 8px rgba(255,255,255,0.1));">
      <path d="M18 6 6 18"/>
      <path d="m6 6 12 12"/>
    </svg>
  `;
  closeBtn.onclick = () => {
    banner.style.animation = 'slideOutRight 0.6s cubic-bezier(0.55, 0.085, 0.68, 0.53) forwards';
    setTimeout(() => banner.remove(), 600);
  };
  closeBtn.onmouseenter = () => {
    closeBtn.style.color = 'rgba(255, 255, 255, 1)';
    closeBtn.style.transform = 'scale(1.15) rotate(90deg)';
    const svg = closeBtn.querySelector('svg');
    if (svg) {
      svg.style.filter = 'drop-shadow(0 0 15px rgba(255,255,255,0.3))';
    }
  };
  closeBtn.onmouseleave = () => {
    closeBtn.style.color = 'rgba(255, 255, 255, 0.7)';
    closeBtn.style.transform = 'scale(1) rotate(0deg)';
    const svg = closeBtn.querySelector('svg');
    if (svg) {
      svg.style.filter = 'drop-shadow(0 0 8px rgba(255,255,255,0.1))';
    }
  };

  header.appendChild(title);
  header.appendChild(closeBtn);

  const content = document.createElement('div');
  content.style.cssText = `
    font-size: 15px;
    line-height: 1.75;
    color: rgba(255, 255, 255, 0.92);
    font-weight: 400;
    letter-spacing: 0.4px;
    text-shadow: 0 1px 4px rgba(0,0,0,0.15);
    filter: blur(0.2px);
  `;
  content.textContent = message;

  banner.appendChild(header);
  banner.appendChild(content);
  document.body.appendChild(banner);
}

const announcementRef = ref(database, 'announcements/latest');
onValue(announcementRef, (snapshot) => {
  const data = snapshot.val();
  if (data && data.timestamp > lastTimestamp) {
    lastTimestamp = data.timestamp;
    localStorage.setItem('lastAnnouncementTimestamp', lastTimestamp);
    showBanner(data.message);
  }
});
