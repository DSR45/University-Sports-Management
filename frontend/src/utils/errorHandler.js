import { toast } from 'react-toastify';

/**
 * Global error handler for API errors
 * @param {Error} error - The error object
 * @param {string} defaultMessage - Default message to show
 * @param {Object} options - Additional options
 */
export const handleApiError = (error, defaultMessage = 'An error occurred', options = {}) => {
  const { silent = false, showToast = true } = options;

  // Log error in development
  if (process.env.NODE_ENV === 'development') {
    console.error('API Error:', error);
  }

  // Handle network errors
  if (!error.response) {
    if (showToast && !silent) {
      toast.error('Network error. Please check your connection.');
    }
    return {
      message: 'Network error',
      status: 0,
      errors: {}
    };
  }

  const { status, data } = error.response;

  // Handle different status codes
  switch (status) {
    case 400:
      // Bad Request - Validation errors
      if (data.errors && typeof data.errors === 'object') {
        // Return validation errors for form handling
        return {
          message: data.message || 'Validation failed',
          status: 400,
          errors: data.errors
        };
      }
      if (showToast && !silent) {
        toast.error(data.message || 'Invalid request');
      }
      break;

    case 401:
      // Unauthorized - for login attempts show a proper message, otherwise let interceptor redirect
      const isLoginRequest = error.config?.url?.includes('/auth/login');
      const loginMessage = data.message || 'Invalid email or password. Please try again.';

      if (isLoginRequest) {
        if (showToast && !silent) {
          toast.error(loginMessage, {
            toastId: 'login-invalid-credentials'
          });
        }
        return {
          message: loginMessage,
          status: 401,
          errors: {}
        };
      }

      return {
        message: 'Unauthorized',
        status: 401,
        errors: {}
      };

    case 403:
      // Forbidden - Insufficient permissions
      if (showToast && !silent) {
        toast.error('You do not have permission to perform this action.');
      }
      break;

    case 404:
      // Not Found
      // Usually expected for missing evaluations, don't show toast
      return {
        message: data.message || 'Resource not found',
        status: 404,
        errors: {}
      };

    case 409:
      // Conflict - e.g., duplicate email
      if (showToast && !silent) {
        toast.error(data.message || 'Conflict with existing data');
      }
      break;

    case 422:
      // Unprocessable Entity
      if (showToast && !silent) {
        toast.error(data.message || 'Unable to process your request');
      }
      break;

    case 500:
    case 502:
    case 503:
      // Server errors
      if (showToast && !silent) {
        toast.error('Server error. Please try again later.');
      }
      break;

    default:
      if (showToast && !silent) {
        toast.error(data.message || defaultMessage);
      }
  }

  return {
    message: data.message || defaultMessage,
    status,
    errors: data.errors || {}
  };
};

/**
 * Extract field errors from validation response
 * @param {Object} errors - Errors object from API
 * @returns {Object} - Formatted errors for form fields
 */
export const formatValidationErrors = (errors) => {
  if (!errors || typeof errors !== 'object') {
    return {};
  }

  const formattedErrors = {};
  Object.keys(errors).forEach(key => {
    formattedErrors[key] = Array.isArray(errors[key]) 
      ? errors[key][0] 
      : errors[key];
  });

  return formattedErrors;
};

/**
 * Check if error is a network error
 */
export const isNetworkError = (error) => {
  return !error.response && error.message === 'Network Error';
};

/**
 * Check if error is authentication error
 */
export const isAuthError = (error) => {
  return error.response && error.response.status === 401;
};

/**
 * Log error to external service (Sentry, LogRocket, etc.)
 */
export const logErrorToService = (error, context = {}) => {
  // Only log in production
  if (process.env.NODE_ENV === 'production') {
    // Example: Sentry.captureException(error, { extra: context });
    console.error('Production Error:', error, context);
  }
};

/**
 * Retry failed request
 */
export const retryRequest = async (requestFn, maxRetries = 3, delay = 1000) => {
  let lastError;
  
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await requestFn();
    } catch (error) {
      lastError = error;
      
      // Don't retry on client errors (4xx)
      if (error.response && error.response.status < 500) {
        throw error;
      }
      
      // Wait before retrying
      if (i < maxRetries - 1) {
        await new Promise(resolve => setTimeout(resolve, delay * (i + 1)));
      }
    }
  }
  
  throw lastError;
};