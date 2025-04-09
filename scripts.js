function updateClock() {
    const clockElement = document.getElementById('live-clock');
    if (!clockElement) return; // Exit if element not found
    
    const now = new Date();
    let hours = now.getHours();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    const minutes = now.getMinutes().toString().padStart(2, '0');
    clockElement.textContent = `${hours}:${minutes} ${ampm}`;
  }
  
  // Initialize clock immediately and update every minute
  document.addEventListener('DOMContentLoaded', function() {
    updateClock();
    setInterval(updateClock, 60000);
  });