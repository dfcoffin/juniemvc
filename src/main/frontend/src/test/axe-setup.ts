import {configureAxe} from 'axe-core/axe';

// Configure axe for accessibility testing
export const axe = configureAxe({
  // Configuration options for axe-core
  rules: [
    // Add any custom rule configurations or overrides here
    {
      id: 'color-contrast',
      enabled: true
    }
  ],
  reporter: 'v2',
  // Increase timeout if needed for complex components
  runOnly: {
    type: 'tag',
    values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']
  }
});

// Helper function to run accessibility tests
export const runAccessibilityTests = async (container: Element): Promise<void> => {
  const results = await axe.run(container);
  
  // If there are violations, log them and fail the test
  if (results.violations.length > 0) {
    // Format the violations for better readability
    const formattedViolations = results.violations.map(violation => ({
      id: violation.id,
      impact: violation.impact,
      description: violation.description,
      help: violation.help,
      helpUrl: violation.helpUrl,
      nodes: violation.nodes.map(node => ({
        html: node.html,
        impact: node.impact,
        target: node.target
      }))
    }));
    
    console.error('Accessibility violations found:', JSON.stringify(formattedViolations, null, 2));
    throw new Error(`${results.violations.length} accessibility violations found. See console for details.`);
  }
};

// Export a test matcher for use in tests
export const toHaveNoAccessibilityViolations = {
  async toHaveNoAccessibilityViolations(received: Element) {
    if (!(received instanceof Element)) {
      return {
        pass: false,
        message: () => 'Expected a DOM element but received something else'
      };
    }
    
    try {
      await runAccessibilityTests(received);
      return {
        pass: true,
        message: () => 'Expected element to have accessibility violations, but none were found'
      };
    } catch (error) {
      return {
        pass: false,
        message: () => error instanceof Error 
          ? error.message 
          : 'Unknown accessibility testing error'
      };
    }
  }
};