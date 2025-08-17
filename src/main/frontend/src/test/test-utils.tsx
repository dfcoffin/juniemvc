import React, {ReactElement} from 'react';
import {render, RenderOptions} from '@testing-library/react';
import {BrowserRouter} from 'react-router-dom';
import {ToastProvider} from '../components/ui/dialog';
import userEvent from '@testing-library/user-event';

// Define wrapper providers for testing
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <BrowserRouter>
      <ToastProvider>
        {children}
      </ToastProvider>
    </BrowserRouter>
  );
};

// Custom render function with providers
const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>,
) => {
  return {
    user: userEvent.setup(),
    ...render(ui, { wrapper: AllTheProviders, ...options }),
  };
};

// Mock API response generator
const mockApiResponse = <T,>(data: T, status = 200) => {
  return Promise.resolve({
    data,
    status,
    statusText: status === 200 ? 'OK' : 'Error',
  });
};

// Mock error response
const mockApiError = (status = 400, message = 'Bad Request') => {
  return Promise.reject({
    response: {
      status,
      data: { message },
    },
    message: JSON.stringify({ message }),
  });
};

// Helper to wait for element to be removed
const waitForElementToBeRemoved = async (element: Element | null) => {
  if (!element) return;
  
  return new Promise<void>((resolve) => {
    const observer = new MutationObserver(() => {
      if (!document.body.contains(element)) {
        observer.disconnect();
        resolve();
      }
    });
    
    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
    
    // Check immediately in case element is already removed
    if (!document.body.contains(element)) {
      observer.disconnect();
      resolve();
    }
  });
};

// Export custom utilities
export * from '@testing-library/react';
export { customRender as render, mockApiResponse, mockApiError, waitForElementToBeRemoved };