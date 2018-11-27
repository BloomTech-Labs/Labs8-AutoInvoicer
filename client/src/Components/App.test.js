import React from "react";
import { BrowserRouter as Router, Route, MemoryRouter } from "react-router-dom";
import { render, cleanup } from "react-testing-library";

// Import pages
import LandingPage from "./Landing/Landing";
import Settings from "./Settings/Settings";
import Invoices from "./Invoices/Invoices";
import Billing from "./Billing/Billing";

test("<LandingPage/>", () => {
  render(
    <MemoryRouter>
      <Route>
        <LandingPage />
      </Route>
    </MemoryRouter>
  );
  expect(<LandingPage />);
});

test("<Settings/>", () => {
  render(
    <MemoryRouter>
      <Settings />
    </MemoryRouter>
  );
  expect(<Settings />);
});

test("<Invoices/>", () => {
  render(
    <MemoryRouter>
      <Invoices />
    </MemoryRouter>
  );
  expect(<Invoices />);
});

test("<Billing/>", () => {
  render(
    <MemoryRouter>
      <Billing />
    </MemoryRouter>
  );
  expect(<Billing />);
});
