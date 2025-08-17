import {afterEach, beforeEach, describe, expect, it} from 'vitest';
import {render, screen} from '../../../test/test-utils';
import {PageContainer} from '../PageContainer';
import {resetResponsiveMocks, setDeviceType, setViewport, viewports} from '../../../test/responsive-tests';
import {MemoryRouter} from 'react-router-dom';

describe('Responsive Layout Tests', () => {
  beforeEach(() => {
    // Reset mocks before each test
    resetResponsiveMocks();
  });

  afterEach(() => {
    // Reset mocks after each test
    resetResponsiveMocks();
  });

  it('renders layout properly on mobile devices', () => {
    // Set mobile viewport
    setDeviceType('mobile');
    
    // Render component
    const { container } = render(
      <MemoryRouter>
        <PageContainer
          title="Test Page"
          description="Test description"
          breadcrumbs={[
            { label: 'Home', to: '/' },
            { label: 'Test', to: '/test' }
          ]}
        >
          <div data-testid="content">Test Content</div>
        </PageContainer>
      </MemoryRouter>
    );
    
    // Check that the content is rendered
    expect(screen.getByTestId('content')).toBeInTheDocument();
    
    // Verify viewport-specific styles or behavior
    // In a mobile viewport, we'd expect certain elements to be styled differently
    // For example, we might check if the content area has the right padding/margin
    const contentWrapper = container.querySelector('.container');
    expect(contentWrapper).toHaveClass('px-4'); // Should have smaller padding on mobile
  });

  it('renders layout properly on tablet devices', () => {
    // Set tablet viewport
    setDeviceType('tablet');
    
    // Render component
    render(
      <MemoryRouter>
        <PageContainer
          title="Test Page"
          description="Test description"
          breadcrumbs={[
            { label: 'Home', to: '/' },
            { label: 'Test', to: '/test' }
          ]}
        >
          <div data-testid="content">Test Content</div>
        </PageContainer>
      </MemoryRouter>
    );
    
    // Check that the content is rendered
    expect(screen.getByTestId('content')).toBeInTheDocument();
    
    // Verify tablet-specific layout
    // For example, we might check if certain elements are visible or hidden
    // on tablet-sized screens
    expect(screen.getByText('Test Page')).toBeInTheDocument();
  });

  it('renders layout properly on desktop devices', () => {
    // Set desktop viewport
    setDeviceType('desktop');
    
    // Render component
    render(
      <MemoryRouter>
        <PageContainer
          title="Test Page"
          description="Test description"
          breadcrumbs={[
            { label: 'Home', to: '/' },
            { label: 'Test', to: '/test' }
          ]}
        >
          <div data-testid="content">Test Content</div>
        </PageContainer>
      </MemoryRouter>
    );
    
    // Check that the content is rendered
    expect(screen.getByTestId('content')).toBeInTheDocument();
    
    // Verify desktop-specific layout
    // For example, check if the breadcrumbs are visible and properly styled
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Test')).toBeInTheDocument();
  });

  it('tests layout at specific viewport sizes', () => {
    // Test at multiple viewport sizes
    const sizes = [
      viewports.mobileSm,
      viewports.mobileMd,
      viewports.tabletMd,
      viewports.desktopSm,
      viewports.desktopLg
    ];
    
    // Test layout at each viewport size
    sizes.forEach(size => {
      // Set viewport size
      setViewport(size.width, size.height);
      
      // Render component
      const { unmount } = render(
        <MemoryRouter>
          <PageContainer
            title="Test Page"
            description="Test description"
            breadcrumbs={[
              { label: 'Home', to: '/' },
              { label: 'Test', to: '/test' }
            ]}
          >
            <div data-testid="content">Test Content</div>
          </PageContainer>
        </MemoryRouter>
      );
      
      // Check that the content is rendered regardless of viewport size
      expect(screen.getByTestId('content')).toBeInTheDocument();
      
      // Cleanup before next size
      unmount();
    });
  });
});