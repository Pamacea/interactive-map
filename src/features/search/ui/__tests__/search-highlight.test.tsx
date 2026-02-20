import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { SearchHighlight } from "../search-highlight";

describe("SearchHighlight", () => {
  it("should render plain text when no query is provided", () => {
    render(<SearchHighlight text="Hello world" query="" />);
    const _result = screen.getByText("Hello world");
    expect(result).toBeInTheDocument();
  });

  it("should render plain text when query does not match", () => {
    render(<SearchHighlight text="Hello world" query="foo" />);
    const _result = screen.getByText("Hello world");
    expect(result).toBeInTheDocument();
  });

  it("should highlight matching text", () => {
    render(<SearchHighlight text="Hello world" query="world" />);
    const highlighted = screen.getByText("world");
    expect(highlighted).toBeInTheDocument();
    expect(highlighted.tagName).toBe("MARK");
  });

  it("should be case-insensitive", () => {
    render(<SearchHighlight text="Hello World" query="world" />);
    const highlighted = screen.getByText("World");
    expect(highlighted).toBeInTheDocument();
    expect(highlighted.tagName).toBe("MARK");
  });

  it("should highlight first occurrence in long text", () => {
    const text = "This is a very long text with multiple occurrences of the word search within it. Search again here.";
    render(<SearchHighlight text={text} query="search" />);

    const highlighted = screen.getAllByText("search");
    expect(highlighted.length).toBeGreaterThan(0);
    expect(highlighted[0].tagName).toBe("MARK");
  });

  it("should handle special regex characters in query", () => {
    render(<SearchHighlight text="Price: $100" query="$100" />);
    const highlighted = screen.getByText("$100");
    expect(highlighted).toBeInTheDocument();
    expect(highlighted.tagName).toBe("MARK");
  });

  it("should truncate long text and show ellipsis", () => {
    const longText = "a".repeat(300);
    render(<SearchHighlight text={longText} query="match" />);
    const _result = screen.queryByText(/.*\.\.\..*/);
    expect(result).toBeInTheDocument();
  });

  it("should apply custom className", () => {
    const { container } = render(
      <SearchHighlight text="Hello world" query="world" className="custom-class" />
    );
    const span = container.querySelector(".custom-class");
    expect(span).toBeInTheDocument();
  });

  it("should highlight text at the start", () => {
    render(<SearchHighlight text="Hello world" query="Hello" />);
    const highlighted = screen.getByText("Hello");
    expect(highlighted).toBeInTheDocument();
    expect(highlighted.tagName).toBe("MARK");
  });

  it("should highlight text at the end", () => {
    render(<SearchHighlight text="Hello world" query="world" />);
    const highlighted = screen.getByText("world");
    expect(highlighted).toBeInTheDocument();
    expect(highlighted.tagName).toBe("MARK");
  });
});
