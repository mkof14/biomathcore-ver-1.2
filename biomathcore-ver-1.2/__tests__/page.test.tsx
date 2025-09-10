import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import Page from "@/app/page";
import { DarkModeProvider } from "@/context/DarkModeContext";

describe("Page", () => {
  it("renders a heading", () => {
    render(
      <DarkModeProvider>
        <Page />
      </DarkModeProvider>,
    );

    const heading = screen.getByRole("heading", {
      name: /Welcome to BioMath Core/i,
    });

    expect(heading).toBeInTheDocument();
  });
});
