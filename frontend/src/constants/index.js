// Application Constants

export const APP_NAME = 'MUJ Volleyball Management';
export const APP_VERSION = '1.0.0';

// API Configuration
export const API_TIMEOUT = 30000; // 30 seconds
export const RETRY_ATTEMPTS = 3;
export const RETRY_DELAY = 1000; // 1 second

// Pagination
export const DEFAULT_PAGE_SIZE = 20;
export const PLAYERS_PER_PAGE = 20;
export const ANNOUNCEMENTS_PER_PAGE = 10;

// Player Status
export const PLAYER_STATUS = {
  PENDING: 'PENDING',
  SHORTLISTED: 'SHORTLISTED',
  SELECTED: 'SELECTED',
  REJECTED: 'REJECTED'
};

// Player Positions
export const PLAYER_POSITIONS = {
  SETTER: 'SETTER',
  OUTSIDE_HITTER: 'OUTSIDE_HITTER',
  OPPOSITE: 'OPPOSITE',
  MIDDLE_BLOCKER: 'MIDDLE_BLOCKER',
  LIBERO: 'LIBERO'
};

// User Roles
export const USER_ROLES = {
  ADMIN: 'ADMIN',
  PLAYER: 'PLAYER'
};

// Evaluation Criteria
export const EVALUATION_SKILLS = [
  { key: 'serving', label: 'Serving', max: 10 },
  { key: 'reception', label: 'Setting', max: 10 },
  { key: 'attack', label: 'Attack', max: 10 },
  { key: 'blocking', label: 'Blocking', max: 10 },
  { key: 'defence', label: 'Defence', max: 10 },
  { key: 'gameSense', label: 'Game Sense', max: 10 }
];

export const MAX_EVALUATION_SCORE = 60;

// Validation Rules
export const VALIDATION = {
  PASSWORD_MIN_LENGTH: 8,
  PHONE_LENGTH: 10,
  HEIGHT_MIN: 100,
  HEIGHT_MAX: 250,
  YEAR_MIN: 1,
  YEAR_MAX: 4,
  TITLE_MAX_LENGTH: 200,
  MESSAGE_MAX_LENGTH: 2000
};

// Local Storage Keys
export const STORAGE_KEYS = {
  TOKEN: 'token',
  USER: 'user',
  THEME: 'theme'
};

// Toast Configuration
export const TOAST_CONFIG = {
  position: 'top-right',
  autoClose: 3000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true
};

// Date Formats
export const DATE_FORMATS = {
  DISPLAY: 'MMM DD, YYYY',
  DISPLAY_WITH_TIME: 'MMM DD, YYYY HH:mm',
  API: 'YYYY-MM-DD'
};

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK: 'Network error. Please check your connection.',
  UNAUTHORIZED: 'Session expired. Please login again.',
  FORBIDDEN: 'You do not have permission to perform this action.',
  NOT_FOUND: 'Resource not found.',
  SERVER_ERROR: 'Server error. Please try again later.',
  VALIDATION: 'Please check your input and try again.',
  UNKNOWN: 'An unexpected error occurred.'
};

// Success Messages
export const SUCCESS_MESSAGES = {
  LOGIN: 'Login successful',
  LOGOUT: 'Logged out successfully',
  REGISTER: 'Registration successful',
  UPDATE: 'Updated successfully',
  CREATE: 'Created successfully',
  DELETE: 'Deleted successfully',
  SAVE: 'Saved successfully'
};

// Route Paths
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  
  // Player Routes
  PLAYER_DASHBOARD: '/player',
  PLAYER_PROFILE: '/player/profile',
  PLAYER_EVALUATION: '/player/evaluation',
  PLAYER_TRIAL_STATUS: '/player/trial-status',
  PLAYER_ANNOUNCEMENTS: '/player/announcements',
  
  // Admin Routes
  ADMIN_DASHBOARD: '/admin',
  ADMIN_PLAYERS: '/admin/players',
  ADMIN_PLAYER_REVIEW: '/admin/players/:id',
  ADMIN_ANNOUNCEMENTS: '/admin/announcements'
};

// Status Colors (for charts/visualization)
export const STATUS_COLORS = {
  PENDING: '#9ca3af',
  SHORTLISTED: '#f59e0b',
  SELECTED: '#10b981',
  REJECTED: '#ef4444'
};

// Breakpoints (for responsive design)
export const BREAKPOINTS = {
  MOBILE: 600,
  TABLET: 850,
  LAPTOP: 1100,
  DESKTOP: 1500
};

// Feature Flags (for enabling/disabling features)
export const FEATURES = {
  EMAIL_NOTIFICATIONS: false,
  FILE_UPLOAD: false,
  ADVANCED_ANALYTICS: false,
  EXPORT_PDF: false,
  CHAT_SUPPORT: false
};

// MUJ Theme Colors
export const THEME_COLORS = {
  PRIMARY_ORANGE: '#FF6B35',
  PRIMARY_BLUE: '#004E89',
  SECONDARY_ORANGE: '#FF8C61',
  SECONDARY_BLUE: '#1A659E',
  ACCENT_ORANGE: '#FFB88C',
  ACCENT_BLUE: '#A8DADC',
  SUCCESS: '#10b981',
  WARNING: '#f59e0b',
  ERROR: '#ef4444',
  INFO: '#3b82f6'
};