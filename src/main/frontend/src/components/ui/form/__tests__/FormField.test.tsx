import {describe, expect, it} from "vitest";
import {render, screen} from "../../../../test/test-utils";
import FormField from "../FormField";

describe("FormField component", () => {
  it("renders with label and children", () => {
    render(
      <FormField id="test-field" label="Test Label">
        <input id="test-field" data-testid="test-input" />
      </FormField>,
    );

    expect(screen.getByText("Test Label")).toBeInTheDocument();
    expect(screen.getByTestId("test-input")).toBeInTheDocument();
  });

  it("displays error message when provided", () => {
    const errorMessage = "This field is required";
    render(
      <FormField id="test-field" label="Test Label" error={errorMessage}>
        <input id="test-field" data-testid="test-input" />
      </FormField>,
    );

    expect(screen.getByText(errorMessage)).toBeInTheDocument();
    expect(screen.getByText(errorMessage)).toHaveClass("text-red-500");
  });

  it("shows required indicator when required prop is true", () => {
    render(
      <FormField id="test-field" label="Test Label" required>
        <input id="test-field" data-testid="test-input" />
      </FormField>,
    );

    const label = screen.getByText("Test Label").closest("label");
    expect(label).toHaveTextContent("*");
    const requiredIndicator = label?.querySelector(".text-red-500");
    expect(requiredIndicator).toBeInTheDocument();
    expect(requiredIndicator).toHaveTextContent("*");
  });

  it("displays description text when provided", () => {
    const description = "This is a helpful description";
    render(
      <FormField id="test-field" label="Test Label" description={description}>
        <input id="test-field" data-testid="test-input" />
      </FormField>,
    );

    expect(screen.getByText(description)).toBeInTheDocument();
    expect(screen.getByText(description)).toHaveClass("text-sm");
  });

  it("associates label with input using id", () => {
    render(
      <FormField id="test-field" label="Test Label">
        <input id="test-field" data-testid="test-input" />
      </FormField>,
    );

    const label = screen.getByText("Test Label").closest("label");
    expect(label).toHaveAttribute("for", "test-field");
  });
});
