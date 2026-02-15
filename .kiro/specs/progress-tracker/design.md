# Design Document: ProgressFlow - Monthly Progress Tracker

## 1. System Architecture

### 1.1 Architecture Overview

ProgressFlow is a client-side single-page application (SPA) built with vanilla JavaScript, HTML5, and CSS3. The application follows a modular architecture with clear separation of concerns.

```
┌─────────────────────────────────────────┐
│         User Interface Layer            │
│  (HTML + CSS + Font Awesome Icons)      │
└─────────────────┬───────────────────────┘
                  │
┌─────────────────▼───────────────────────┐
│      Application Logic Layer            │
│  (JavaScript - Event Handlers & State)  │
└─────────────────┬───────────────────────┘
                  │
┌─────────────────▼───────────────────────┐
│       Data Persistence Layer            │
│      (Browser LocalStorage API)         │
└─────────────────────────────────────────┘
```

### 1.2 Technology Stack

- **Frontend Framework**: Vanilla JavaScript (ES6+)
- **Markup**: HTML5
- **Styling**: CSS3 (Custom Properties, Grid, Flexbox)
- **Icons**: Font Awesome 6.4.0
- **Fonts**: Google Fonts (Crimson Pro, Inter)
- **Storage**: Browser LocalStorage API
- **Build Tools**: None (pure HTML/CSS/JS)

## 2. Data Models

### 2.1 User Data Model

```javascript
{
  name: String,              // User's full name
  email: String,             // User's email address
  bio: String,               // User biography (multi-line)
  followers: Number,         // Count of followers
  following: Number,         // Count of users being followed
  links: [                   // Array of social links
    {
      name: String,          // Link name (e.g., "LinkedIn")
      url: String            // Full URL
    }
  ]
}
```

**Storage Key**: `userData`

### 2.2 Progress Entry Model

```javascript
{
  date: String,              // ISO date format "YYYY-MM-DD"
  tag: String,               // "work" or "personal"
  text: String,              // Entry text (max 100 words)
  isPrivate: Boolean         // Privacy flag (true = private)
}
```

**Storage Key**: `progressData` (Array of entries)

### 2.3 Data Validation Rules

- **date**: Must be valid ISO date string
- **tag**: Must be exactly "work" or "personal"
- **text**: Must be 1-100 words, trimmed
- **isPrivate**: Must be boolean
- **name**: 1-100 characters
- **email**: Valid email format
- **bio**: 0-500 characters
- **url**: Valid URL format starting with http:// or https://

## 3. Component Architecture

### 3.1 Page Components

#### 3.1.1 Navigation Component
- **Purpose**: Global navigation across all pages
- **Elements**: Logo, 6 navigation links (Home, Progress, Summary, Network, Notifications, Profile)
- **State**: Active page indicator
- **Interactions**: Click to navigate, updates active state

#### 3.1.2 Home Page Component
- **Purpose**: Welcome screen and quick progress logging
- **Elements**: 
  - Welcome message with user name
  - Current date display
  - Motivational tagline
  - "Log Today's Progress" button
  - Streak preview cards (Current, Best, This Month)
- **State**: Current date, user name, streak counts
- **Interactions**: Button opens progress modal

#### 3.1.3 Progress Calendar Component
- **Purpose**: Visual calendar showing all progress entries
- **Elements**:
  - Year display (2026)
  - 12 month cards in grid layout
  - Calendar legend (Work/Personal colors)
  - Day cells (clickable)
- **State**: Current year, progress data
- **Interactions**: 
  - Click day to open modal
  - Hover effects on days
  - Visual indicators for entries

#### 3.1.4 Summary Page Component
- **Purpose**: Analytics and insights dashboard
- **Elements**:
  - Month selector dropdown
  - Stats cards (Total, Work, Personal entries)
  - AI Insights section with skills, trends, recommendations
  - Regenerate button
- **State**: Selected month, calculated statistics, detected skills
- **Interactions**: Month selection updates all stats

#### 3.1.5 Network Page Component
- **Purpose**: Social connections management
- **Elements**:
  - Followers list with remove buttons
  - Following list with unfollow buttons
  - Pending requests with accept/reject buttons
  - Discover people search
- **State**: Followers array, following array, requests array
- **Interactions**: Accept, reject, remove, unfollow actions

#### 3.1.6 Notifications Component
- **Purpose**: Activity feed
- **Elements**:
  - Notification cards with icons, text, timestamp
  - Unread indicators
- **State**: Notifications array, read/unread status
- **Interactions**: Click to mark as read

#### 3.1.7 Profile Page Component
- **Purpose**: User profile management
- **Elements**:
  - Profile information card (avatar, name, email, bio)
  - Social links card with add/remove
  - Progress stats card
  - Network stats card
  - Achievements card (streaks)
  - Sign out button
- **State**: User data, calculated stats
- **Interactions**: Edit profile, add/remove links, sign out

### 3.2 Modal Components

#### 3.2.1 Progress Entry Modal
- **Purpose**: Create/edit progress entries
- **Elements**:
  - Modal header with date
  - Category selector (Work/Personal buttons)
  - Text area with word counter
  - Public/Private toggle switch
  - Cancel and Save buttons
- **State**: Selected date, category, text, privacy setting
- **Validation**: 
  - Category must be selected
  - Text must not exceed 100 words
- **Interactions**: 
  - Category button toggle
  - Text input with live word count
  - Toggle switch for privacy
  - Save creates/updates entry
  - Cancel closes modal

## 4. User Interface Design

### 4.1 Design System

#### 4.1.1 Color Palette

```css
Primary Colors:
- Primary Blue: #4F6FED (buttons, links, accents)
- Primary Dark: #3D5BD1 (hover states)
- Secondary Purple: #7C3AED (secondary accents)

Category Colors:
- Work Blue: #3B82F6
- Personal Purple: #8B5CF6

Neutral Colors:
- Background Main: #F8FAFC
- Background Card: #FFFFFF
- Text Primary: #1E293B
- Text Secondary: #64748B
- Text Muted: #94A3B8
- Border: #E2E8F0
- Border Light: #F1F5F9

Semantic Colors:
- Success Green: #10B981
- Error Red: #DC2626
```

#### 4.1.2 Typography

```css
Headings:
- Font Family: 'Crimson Pro', serif
- Weights: 400 (regular), 600 (semibold), 700 (bold)
- Sizes: 
  - H1: 2.5rem (40px)
  - H2: 2rem (32px)
  - H3: 1.5rem (24px)
  - H4: 1.25rem (20px)

Body Text:
- Font Family: 'Inter', sans-serif
- Weights: 300 (light), 400 (regular), 500 (medium), 600 (semibold)
- Sizes:
  - Large: 1.125rem (18px)
  - Base: 1rem (16px)
  - Small: 0.9375rem (15px)
  - XSmall: 0.875rem (14px)
```

#### 4.1.3 Spacing System

```css
Base unit: 0.25rem (4px)

Scale:
- xs: 0.5rem (8px)
- sm: 0.75rem (12px)
- md: 1rem (16px)
- lg: 1.5rem (24px)
- xl: 2rem (32px)
- 2xl: 3rem (48px)
```

#### 4.1.4 Border Radius

```css
- Small: 8px (buttons, inputs)
- Medium: 12px (cards, modals)
- Large: 16px (major cards)
- XLarge: 20px (hero sections)
- Circle: 50% (avatars)
```

#### 4.1.5 Shadows

```css
- Shadow SM: 0 1px 2px rgba(0,0,0,0.05)
- Shadow: 0 1px 3px rgba(0,0,0,0.1)
- Shadow MD: 0 4px 6px rgba(0,0,0,0.1)
- Shadow LG: 0 10px 15px rgba(0,0,0,0.1)
```

### 4.2 Layout Structure

#### 4.2.1 Grid System

- **Container Max Width**: 1400px
- **Container Padding**: 2rem (32px)
- **Calendar Grid**: Auto-fit columns, min 320px
- **Stats Grid**: Auto-fit columns, min 250px
- **Profile Layout**: 1.5fr (left) + 1fr (right)

#### 4.2.2 Responsive Breakpoints

```css
- Desktop: 1024px and above
- Tablet: 768px - 1023px
- Mobile: Below 768px
```

### 4.3 Component Specifications

#### 4.3.1 Calendar Day Cell

```
Size: Square (aspect-ratio: 1)
States:
- Default: Light background, gray text
- Hover: Light gray background
- Has Entry (Work): Blue background, white text
- Has Entry (Personal): Purple background, white text
- Today: Primary border (2px)
- Empty: Muted text color
```

#### 4.3.2 Button Styles

```
Primary Button:
- Background: Primary blue
- Color: White
- Padding: 1rem 2rem
- Border Radius: 12px
- Hover: Darker blue, lift effect

Secondary Button:
- Background: White
- Border: 2px solid primary
- Color: Primary
- Hover: Filled with primary

Icon Button:
- Background: White
- Border: 1px solid border color
- Padding: 0.5rem 1rem
```

#### 4.3.3 Card Styles

```
Standard Card:
- Background: White
- Border Radius: 16px
- Shadow: Medium shadow
- Padding: 1.5rem - 2rem
```

## 5. State Management

### 5.1 Application State

```javascript
// Global state variables
let progressData = [];      // Array of all progress entries
let currentYear = 2026;     // Currently displayed year
let userData = {};          // User profile information
```

### 5.2 State Persistence

- **On Load**: Read from localStorage
- **On Change**: Write to localStorage immediately
- **Storage Keys**: 
  - `progressData`: Progress entries array
  - `userData`: User profile object

### 5.3 State Updates

```javascript
// Progress entry operations
- Create: Add to array, save to storage, re-render calendar
- Update: Find by date, modify, save, re-render
- Delete: Remove from array, save, re-render

// User data operations
- Update profile: Modify userData, save to storage, re-render profile
- Add link: Push to links array, save, re-render
- Remove link: Splice from array, save, re-render
```

## 6. Algorithm Specifications

### 6.1 Streak Calculation Algorithm

```javascript
function calculateStreak() {
  // Sort entries by date (newest first)
  // Initialize streak counter
  // Iterate through sorted dates
  // For each consecutive day, increment streak
  // If gap > 1 day, reset streak
  // Return maximum streak found
}

Time Complexity: O(n log n) - due to sorting
Space Complexity: O(n) - for sorted array
```

### 6.2 Skills Detection Algorithm

```javascript
function extractSkills(entries) {
  // Define keyword dictionary (programming languages, tools)
  // Initialize empty Set for found skills
  // For each entry text:
  //   - Convert to lowercase
  //   - Check for each keyword
  //   - If found, add to Set (capitalized)
  // Return Array from Set
}

Time Complexity: O(n * m) - n entries, m keywords
Space Complexity: O(k) - k unique skills found
```

### 6.3 Calendar Rendering Algorithm

```javascript
function renderCalendar(year) {
  // For each month (0-11):
  //   - Get first day of month (0-6)
  //   - Get days in month (28-31)
  //   - Create month card
  //   - Add day labels (S M T W T F S)
  //   - Add empty cells for offset
  //   - For each day:
  //     - Create day cell
  //     - Check if entry exists for date
  //     - Apply appropriate styling
  //     - Add click handler
  //   - Append to calendar grid
}

Time Complexity: O(365) - constant for year
Space Complexity: O(365) - DOM elements created
```

## 7. Interaction Flows

### 7.1 Create Progress Entry Flow

```
1. User clicks "Log Today's Progress" or calendar day
2. Modal opens with date pre-filled
3. User selects category (Work/Personal)
4. User types progress text (max 100 words)
5. User toggles public/private (default: public)
6. User clicks "Save Entry"
7. Validation checks:
   - Category selected? ✓
   - Text within limit? ✓
8. Entry saved to progressData array
9. LocalStorage updated
10. Modal closes
11. Calendar re-renders with new entry
12. Success message shown
```

### 7.2 View Summary Flow

```
1. User navigates to Summary page
2. Current month selected by default
3. System calculates:
   - Total entries for month
   - Work entries count
   - Personal entries count
   - Public entries count
4. System extracts skills from entry text
5. AI insights generated (trends, recommendations)
6. All stats displayed in cards
7. User can change month selection
8. Stats recalculate for new month
```

### 7.3 Add Social Link Flow

```
1. User clicks "Add Link" button
2. Prompt asks for link name
3. User enters name (e.g., "LinkedIn")
4. Prompt asks for URL
5. User enters URL
6. Link added to userData.links array
7. LocalStorage updated
8. Profile re-renders with new link
9. Link appears with appropriate icon
```

## 8. Performance Considerations

### 8.1 Optimization Strategies

- **Lazy Rendering**: Only render visible month cards
- **Event Delegation**: Use single listener for calendar days
- **Debouncing**: Debounce text input for word counting
- **Memoization**: Cache calculated streaks and stats
- **CSS Animations**: Use GPU-accelerated transforms

### 8.2 LocalStorage Management

- **Size Monitoring**: Check storage size periodically
- **Data Cleanup**: Remove old entries if approaching limit
- **Compression**: Consider JSON minification
- **Backup**: Provide export functionality

## 9. Accessibility Features

### 9.1 Keyboard Navigation

- Tab order follows logical flow
- Enter key submits forms
- Escape key closes modals
- Arrow keys navigate calendar (future enhancement)

### 9.2 Screen Reader Support

- Semantic HTML elements (nav, main, section, article)
- ARIA labels on icon buttons
- Alt text on images
- Form labels properly associated

### 9.3 Visual Accessibility

- Color contrast ratios meet WCAG AA standards
- Focus indicators on all interactive elements
- Text remains readable at 200% zoom
- No information conveyed by color alone

## 10. Error Handling

### 10.1 Input Validation Errors

- **Empty category**: Alert "Please select a category"
- **Text too long**: Prevent input beyond 100 words
- **Invalid date**: Prevent selection of invalid dates
- **Invalid URL**: Alert "Please enter a valid URL"

### 10.2 Storage Errors

- **Quota exceeded**: Alert user, suggest data cleanup
- **Storage unavailable**: Fallback to session storage
- **Corrupted data**: Reset to default state

### 10.3 User Feedback

- Success messages for completed actions
- Loading states for async operations (future)
- Error messages with clear instructions
- Confirmation dialogs for destructive actions

## 11. Security Considerations

### 11.1 Data Privacy

- All data stored locally (no server transmission)
- No sensitive data in plain text
- Privacy settings respected for all entries
- User controls all data deletion

### 11.2 Input Sanitization

- HTML entities escaped in user input
- URL validation before link creation
- Text length limits enforced
- XSS prevention through textContent (not innerHTML)

## 12. Testing Strategy

### 12.1 Unit Testing (Future)

- Test streak calculation algorithm
- Test skills extraction algorithm
- Test date validation functions
- Test data persistence functions

### 12.2 Integration Testing (Future)

- Test modal open/close flows
- Test calendar rendering with data
- Test navigation between pages
- Test localStorage read/write

### 12.3 Manual Testing Checklist

- [ ] Create entry for today
- [ ] Edit existing entry
- [ ] View calendar with multiple entries
- [ ] Calculate streaks correctly
- [ ] Add/remove social links
- [ ] Navigate all pages
- [ ] Test on mobile devices
- [ ] Test in different browsers
- [ ] Test with empty data state
- [ ] Test with maximum data

## 13. Future Enhancements

### 13.1 Phase 2 Features

- Backend API integration
- User authentication (OAuth)
- Real-time notifications
- Advanced charts (Chart.js integration)
- Export to PDF/CSV
- Dark mode theme

### 13.2 Phase 3 Features

- Mobile native apps (React Native)
- Collaborative features
- Goal setting and tracking
- Integration with external tools
- Custom themes and branding
- Multi-language support

## 14. Deployment

### 14.1 Hosting Options

- GitHub Pages (recommended for v1)
- Netlify
- Vercel
- AWS S3 + CloudFront

### 14.2 Build Process

- No build step required (vanilla HTML/CSS/JS)
- Minification optional for production
- Asset optimization (images, fonts)
- CDN for Font Awesome and Google Fonts

### 14.3 Browser Caching

- Set appropriate cache headers
- Version assets for cache busting
- Service worker for offline support (future)

## 15. Maintenance Plan

### 15.1 Regular Updates

- Update Font Awesome version quarterly
- Review and update color palette annually
- Add new skill keywords monthly
- Fix reported bugs within 1 week

### 15.2 Monitoring

- Track localStorage usage
- Monitor browser console errors
- Collect user feedback
- Analyze feature usage patterns

---

**Document Version**: 1.0  
**Last Updated**: February 15, 2026  
**Author**: Development Team  
**Status**: Approved for Implementation
