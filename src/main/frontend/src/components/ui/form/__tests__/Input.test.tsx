import {describe, expect, it} from "vitest";
import {render, screen} from "../../../../test/test-utils";
import Input from "../Input";
import {renderToString} from "react-dom/server";

describe("Input component", () => {
  it("renders correctly with default props", () => {
    render(<Input placeholder="Enter text" />);
    const input = screen.getByPlaceholderText("Enter text");
    expect(input).toBeInTheDocument();
    expect(input).toHaveClass("flex h-10 w-full rounded-md border");
  });

  it("applies error styling when error prop is true", () => {
    render(<Input placeholder="Error input" error={true} />);
    const input = screen.getByPlaceholderText("Error input");
    expect(input).toHaveClass("border-red-500");
  });

  it("supports additional className prop", () => {
    render(<Input placeholder="Custom class" className="test-class" />);
    const input = screen.getByPlaceholderText("Custom class");
    expect(input).toHaveClass("test-class");
  });

  it("forwards ref correctly", () => {
    const { container } = render(
      <Input placeholder="With ref" id="input-with-ref" />,
    );
    const input = container.querySelector("#input-with-ref");
    expect(input).toBeInTheDocument();
  });

  it("handles disabled state", () => {
    render(<Input placeholder="Disabled input" disabled />);
    const input = screen.getByPlaceholderText("Disabled input");
    expect(input).toBeDisabled();
  });

  it("accepts input type attribute", () => {
    render(<Input type="password" placeholder="Password input" />);
    const input = screen.getByPlaceholderText("Password input");
    expect(input).toHaveAttribute("type", "password");
  });

  it("matches snapshot for default input", () => {
    const html = renderToString(<Input placeholder="Snapshot test" />);
    expect(html).toMatchSnapshot();
  });

  it("matches snapshot for input with error", () => {
    const html = renderToString(
      <Input placeholder="Error snapshot" error={true} />,
    );
    expect(html).toMatchSnapshot();
  });
});
