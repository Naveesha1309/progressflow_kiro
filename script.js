// Data storage (in production, this would be a backend database)
let progressData = JSON.parse(localStorage.getItem('progressData')) || [];
let currentYear = new Date().getFullYear();
let userData = JSON.parse(localStorage.getItem('userData')) || {
    name: 'Naveesha',
    email: 'naveeshaneet@gmail.com',
    bio: 'Building better habits, one day at a time. Passionate about personal growth and continuous learning.',
    followers: 0,
    following: 0,
    links: [
        { name: 'LinkedIn', url: 'https://linkedin.com/in/yourprofile' }
    ]
};

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initHomePage();
    initProgressPage();
    initModal();
    initSummaryPage();
    initNetworkPage();
    initNotificationsPage();
    initProfilePage();
});

// Navigation
function initNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const page = link.dataset.page;
            showPage(page);
            
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
        });
    });
}

function showPage(pageName) {
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => page.classList.remove('active'));
    document.getElementById(`${pageName}-page`).classList.add('active');
    
    if (pageName === 'progress') {
        renderCalendar(currentYear);
    } else if (pageName === 'summary') {
        renderSummary();
    }
}

// Home Page
function initHomePage() {
    const today = new Date();
    const options = { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' };
    document.getElementById('currentDate').textContent = today.toLocaleDateString('en-US', options);
    document.getElementById('userName').textContent = userData.name;
    
    // Update streak stats
    const streak = calculateStreak();
    document.getElementById('currentStreakHome').textContent = streak;
    document.getElementById('bestStreakHome').textContent = streak;
    
    document.getElementById('logProgressBtn').addEventListener('click', () => {
        openModal(today);
    });
}

// Progress Page - Calendar
function initProgressPage() {
    renderCalendar(currentYear);
}

function renderCalendar(year) {
    const calendar = document.getElementById('calendar');
    calendar.innerHTML = '';
    
    const months = ['Jan 2026', 'Feb 2026', 'Mar 2026', 'Apr 2026', 'May 2026', 'Jun 2026', 
                    'Jul 2026', 'Aug 2026', 'Sep 2026', 'Oct 2026', 'Nov 2026', 'Dec 2026'];
    const dayLabels = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
    
    months.forEach((month, monthIndex) => {
        const monthCard = document.createElement('div');
        monthCard.className = 'month-card';
        
        const monthName = document.createElement('div');
        monthName.className = 'month-name';
        monthName.textContent = month;
        monthCard.appendChild(monthName);
        
        const daysContainer = document.createElement('div');
        daysContainer.className = 'calendar-days';
        
        // Add day labels
        dayLabels.forEach(label => {
            const dayLabel = document.createElement('div');
            dayLabel.className = 'day-label';
            dayLabel.textContent = label;
            daysContainer.appendChild(dayLabel);
        });
        
        // Get first day of month and number of days
        const firstDay = new Date(year, monthIndex, 1).getDay();
        const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
        
        // Add empty cells for days before month starts
        for (let i = 0; i < firstDay; i++) {
            const emptyCell = document.createElement('div');
            emptyCell.className = 'day-cell empty';
            daysContainer.appendChild(emptyCell);
        }
        
        // Add day cells
        for (let day = 1; day <= daysInMonth; day++) {
            const dayCell = document.createElement('div');
            dayCell.className = 'day-cell';
            dayCell.textContent = day;
            
            const dateStr = `${year}-${String(monthIndex + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const entry = progressData.find(entry => entry.date === dateStr);
            
            if (entry) {
                dayCell.classList.add('has-entry');
                if (entry.tag === 'personal') {
                    dayCell.classList.add('personal');
                }
            }
            
            // Check if today
            const today = new Date();
            if (year === today.getFullYear() && monthIndex === today.getMonth() && day === today.getDate()) {
                dayCell.classList.add('today');
            }
            
            dayCell.addEventListener('click', () => {
                const clickedDate = new Date(year, monthIndex, day);
                openModal(clickedDate);
            });
            
            daysContainer.appendChild(dayCell);
        }
        
        monthCard.appendChild(daysContainer);
        calendar.appendChild(monthCard);
    });
}

// Modal
function initModal() {
    const modal = document.getElementById('progressModal');
    const closeBtn = document.querySelector('.close-btn');
    const cancelBtn = document.getElementById('cancelBtn');
    const form = document.getElementById('progressForm');
    const categoryButtons = document.querySelectorAll('.category-btn');
    const textarea = document.getElementById('progressText');
    const charCount = document.getElementById('charCount');
    
    closeBtn.addEventListener('click', () => {
        modal.classList.remove('active');
    });
    
    cancelBtn.addEventListener('click', () => {
        modal.classList.remove('active');
    });
    
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('active');
        }
    });
    
    categoryButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            categoryButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            document.getElementById('selectedTag').value = btn.dataset.tag;
        });
    });
    
    textarea.addEventListener('input', () => {
        const words = textarea.value.trim().split(/\s+/).filter(w => w.length > 0).length;
        charCount.textContent = words;
    });
    
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        saveProgress();
    });
}

function openModal(date) {
    const modal = document.getElementById('progressModal');
    const dateInput = document.getElementById('progressDate');
    const dateStr = date.toISOString().split('T')[0];
    const options = { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' };
    
    dateInput.value = dateStr;
    document.getElementById('modalDate').textContent = date.toLocaleDateString('en-US', options);
    
    // Check if entry exists for this date
    const existingEntry = progressData.find(entry => entry.date === dateStr);
    if (existingEntry) {
        document.getElementById('progressText').value = existingEntry.text;
        const words = existingEntry.text.trim().split(/\s+/).filter(w => w.length > 0).length;
        document.getElementById('charCount').textContent = words;
        document.getElementById('isPublic').checked = !existingEntry.isPrivate;
        
        const categoryBtn = document.querySelector(`[data-tag="${existingEntry.tag}"]`);
        document.querySelectorAll('.category-btn').forEach(b => b.classList.remove('active'));
        categoryBtn.classList.add('active');
        document.getElementById('selectedTag').value = existingEntry.tag;
    } else {
        document.getElementById('progressForm').reset();
        document.getElementById('charCount').textContent = '0';
        document.querySelectorAll('.category-btn').forEach(b => b.classList.remove('active'));
        document.querySelector('[data-tag="personal"]').classList.add('active');
        document.getElementById('selectedTag').value = 'personal';
        document.getElementById('isPublic').checked = true;
    }
    
    modal.classList.add('active');
}

function saveProgress() {
    const date = document.getElementById('progressDate').value;
    const tag = document.getElementById('selectedTag').value;
    const text = document.getElementById('progressText').value;
    const isPrivate = !document.getElementById('isPublic').checked;
    
    if (!tag) {
        alert('Please select a category');
        return;
    }
    
    // Remove existing entry for this date if any
    progressData = progressData.filter(entry => entry.date !== date);
    
    // Add new entry
    progressData.push({ date, tag, text, isPrivate });
    
    // Save to localStorage
    localStorage.setItem('progressData', JSON.stringify(progressData));
    
    // Close modal and refresh calendar
    document.getElementById('progressModal').classList.remove('active');
    renderCalendar(currentYear);
    
    // Show success message
    alert('Progress saved successfully!');
}

// Summary Page
function initSummaryPage() {
    const monthSelect = document.getElementById('monthSelect');
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 
                    'July', 'August', 'September', 'October', 'November', 'December'];
    
    const currentMonth = new Date().getMonth();
    months.forEach((month, index) => {
        const option = document.createElement('option');
        option.value = index;
        option.textContent = `${month} ${currentYear}`;
        if (index === currentMonth) option.selected = true;
        monthSelect.appendChild(option);
    });
    
    monthSelect.addEventListener('change', renderSummary);
    renderSummary();
}

function renderSummary() {
    const selectedMonth = parseInt(document.getElementById('monthSelect').value);
    
    // Filter data for selected month
    const monthData = progressData.filter(entry => {
        const entryDate = new Date(entry.date);
        return entryDate.getMonth() === selectedMonth && entryDate.getFullYear() === currentYear;
    });
    
    // Calculate stats
    const workCount = monthData.filter(e => e.tag === 'work').length;
    const personalCount = monthData.filter(e => e.tag === 'personal').length;
    const totalEntries = monthData.length;
    
    document.getElementById('totalEntries').textContent = totalEntries;
    document.getElementById('workCount').textContent = workCount;
    document.getElementById('personalCount').textContent = personalCount;
    
    // Extract skills
    const skills = extractSkills(monthData);
    const skillsContainer = document.getElementById('skillsTags');
    skillsContainer.innerHTML = '';
    
    if (skills.length === 0) {
        skills.push('Machine Learning', 'AWS', 'Spark', 'Big Data');
    }
    
    skills.forEach(skill => {
        const tag = document.createElement('span');
        tag.className = 'skill-tag';
        tag.textContent = skill;
        skillsContainer.appendChild(tag);
    });
}

function calculateStreak() {
    if (progressData.length === 0) return 0;
    
    const sortedDates = progressData.map(e => new Date(e.date)).sort((a, b) => b - a);
    let streak = 1;
    let maxStreak = 1;
    
    for (let i = 0; i < sortedDates.length - 1; i++) {
        const diff = Math.floor((sortedDates[i] - sortedDates[i + 1]) / (1000 * 60 * 60 * 24));
        if (diff === 1) {
            streak++;
            maxStreak = Math.max(maxStreak, streak);
        } else if (diff > 1) {
            streak = 1;
        }
    }
    
    return maxStreak;
}

function extractSkills(data) {
    const skillKeywords = ['javascript', 'python', 'react', 'node', 'css', 'html', 'sql', 
                          'git', 'docker', 'aws', 'api', 'database', 'design', 'testing',
                          'typescript', 'vue', 'angular', 'mongodb', 'postgresql', 'figma',
                          'photoshop', 'illustrator', 'excel', 'powerpoint', 'jira', 'spark',
                          'machine learning', 'big data', 'cloud'];
    
    const foundSkills = new Set();
    data.forEach(entry => {
        const text = entry.text.toLowerCase();
        skillKeywords.forEach(skill => {
            if (text.includes(skill)) {
                foundSkills.add(skill.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '));
            }
        });
    });
    
    return Array.from(foundSkills);
}

function renderChart(monthData) {
    // Chart rendering removed for simplicity
    // In production, use a library like Chart.js
}

// Network Page
function initNetworkPage() {
    renderNetwork();
}

function renderNetwork() {
    // Demo data
    const followers = [
        { name: 'Sarah Chen', avatar: '' },
        { name: 'Michael Torres', avatar: '' },
        { name: 'Emma Wilson', avatar: '' }
    ];
    
    const following = [
        { name: 'David Kim', avatar: '' },
        { name: 'Lisa Anderson', avatar: '' }
    ];
    
    const requests = [
        { name: 'James Brown', avatar: '' }
    ];
    
    document.getElementById('followersCount').textContent = followers.length;
    document.getElementById('followingCount').textContent = following.length;
    document.getElementById('requestsCount').textContent = requests.length;
    
    renderUserList('followersList', followers, 'remove');
    renderUserList('followingList', following, 'unfollow');
    renderUserList('requestsList', requests, 'accept');
}

function renderUserList(containerId, users, actionType) {
    const container = document.getElementById(containerId);
    container.innerHTML = '';
    
    users.forEach(user => {
        const userItem = document.createElement('div');
        userItem.className = 'user-item';
        
        userItem.innerHTML = `
            <div class="user-info">
                <div class="user-avatar"></div>
                <span class="user-name">${user.name}</span>
            </div>
            <div class="user-actions">
                ${actionType === 'accept' ? 
                    '<button class="btn-small btn-accept">Accept</button>' : ''}
                <button class="btn-small btn-remove">${actionType === 'remove' ? 'Remove' : 'Unfollow'}</button>
            </div>
        `;
        
        container.appendChild(userItem);
    });
}

// Notifications Page
function initNotificationsPage() {
    renderNotifications();
}

function renderNotifications() {
    const notifications = [
        { text: 'Sarah Chen started following you', time: '2 hours ago', unread: true },
        { text: 'You reached a 7-day streak!', time: '1 day ago', unread: true },
        { text: 'Michael Torres accepted your follow request', time: '2 days ago', unread: false },
        { text: 'New feature: AI-powered insights now available', time: '3 days ago', unread: false }
    ];
    
    const container = document.getElementById('notificationsList');
    container.innerHTML = '';
    
    notifications.forEach(notif => {
        const item = document.createElement('div');
        item.className = `notification-item ${notif.unread ? 'unread' : ''}`;
        
        item.innerHTML = `
            <div class="notification-content">
                <div class="notification-text">${notif.text}</div>
                <div class="notification-time">${notif.time}</div>
            </div>
        `;
        
        container.appendChild(item);
    });
}

// Profile Page
function initProfilePage() {
    renderProfile();
    
    document.getElementById('editProfileBtn').addEventListener('click', () => {
        alert('Edit profile functionality would open a form here');
    });
    
    document.getElementById('addLinkBtn').addEventListener('click', () => {
        const linkName = prompt('Enter link name (e.g., LinkedIn, Twitter, GitHub):');
        if (!linkName) return;
        
        const linkUrl = prompt('Enter URL:');
        if (!linkUrl) return;
        
        userData.links.push({ name: linkName, url: linkUrl });
        localStorage.setItem('userData', JSON.stringify(userData));
        renderProfile();
    });
}

function renderProfile() {
    // Basic info
    document.getElementById('profileName').textContent = userData.name;
    document.getElementById('profileEmail').textContent = userData.email || 'naveeshaneet@gmail.com';
    document.getElementById('profileBio').textContent = userData.bio;
    
    // Generate initials
    const initials = userData.name.split(' ').map(n => n[0]).join('').toUpperCase();
    document.getElementById('profileInitials').textContent = initials;
    
    // Calculate stats
    const totalEntries = progressData.length;
    const workEntries = progressData.filter(e => e.tag === 'work').length;
    const personalEntries = progressData.filter(e => e.tag === 'personal').length;
    const publicEntries = progressData.filter(e => !e.isPrivate).length;
    const streak = calculateStreak();
    
    // Update stats
    document.getElementById('profileTotalEntries').textContent = totalEntries;
    document.getElementById('profileWorkEntries').textContent = workEntries;
    document.getElementById('profilePersonalEntries').textContent = personalEntries;
    document.getElementById('profilePublicEntries').textContent = publicEntries;
    
    // Network stats
    document.getElementById('profileFollowersCount').textContent = userData.followers;
    document.getElementById('profileFollowingCount').textContent = userData.following;
    
    // Achievements
    document.getElementById('profileCurrentStreak').textContent = streak;
    document.getElementById('profileBestStreak').textContent = streak;
    
    // Social links
    const linksContainer = document.getElementById('profileLinksList');
    linksContainer.innerHTML = '';
    
    userData.links.forEach((link, index) => {
        const linkItem = document.createElement('div');
        linkItem.className = 'social-link-item';
        
        // Determine icon based on link name
        let icon = 'fa-link';
        const linkNameLower = link.name.toLowerCase();
        if (linkNameLower.includes('linkedin')) icon = 'fa-linkedin';
        else if (linkNameLower.includes('twitter') || linkNameLower.includes('x')) icon = 'fa-twitter';
        else if (linkNameLower.includes('github')) icon = 'fa-github';
        else if (linkNameLower.includes('instagram')) icon = 'fa-instagram';
        else if (linkNameLower.includes('facebook')) icon = 'fa-facebook';
        else if (linkNameLower.includes('youtube')) icon = 'fa-youtube';
        
        linkItem.innerHTML = `
            <div class="social-link-info">
                <div class="social-link-icon">
                    <i class="fab ${icon}"></i>
                </div>
                <div class="social-link-details">
                    <div class="social-link-name">${link.name}</div>
                    <a href="${link.url}" target="_blank" class="social-link-url">${link.url}</a>
                </div>
            </div>
            <button class="btn-remove-link" data-index="${index}">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        linksContainer.appendChild(linkItem);
    });
    
    // Add event listeners for remove buttons
    document.querySelectorAll('.btn-remove-link').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const index = parseInt(e.currentTarget.dataset.index);
            if (confirm('Are you sure you want to remove this link?')) {
                userData.links.splice(index, 1);
                localStorage.setItem('userData', JSON.stringify(userData));
                renderProfile();
            }
        });
    });
}
