# Master Prompt for 'Electricity Library' Frontend

## Purpose

This document contains the foundational **Master Prompt** used for generating all React components for the 'Electricity Library' web application. Its purpose is to establish a strict and consistent **Design System** that the AI must follow. All generated content, including placeholder text, must be in **English**. Its purpose is to ensure all newly created components are visually and structurally indistinguishable from the pre-existing codebase.

## The Guiding Principle: Seamless Integration

The primary goal is to **extend an existing, beautifully designed application**. The current homepage design serves as the **absolute visual source of truth**. All newly generated components must integrate seamlessly, appearing as if they were created by the original developer. When in doubt about a style (e.g., shadow depth, corner radius, font weight), the AI must replicate the implementation seen on the homepage.

## How to Use This Master Prompt

To generate a new component or page, follow these steps:

1.  **Copy** the entire content under "The Master Prompt" section below.
2.  **Paste** it into your AI chat interface (e.g., ChatGPT, Claude).
3.  Below the pasted content, add a separator (`---`).
4.  **Write your specific prompt** for the component you need, including details about UI, data mapping (ERD), user actions, and file location.

By providing this Master Prompt as context first, you ensure that every generated component will share the same visual style, structure, and coding conventions.

---

## The Master Prompt

Act as an expert UI/UX designer and senior React developer. You are tasked with building components for the **'Electricity Library'** web application. Your goal is to generate code that is visually identical to the provided design mockups and follows a consistent system. Use **React**, **React-Bootstrap components**, and custom **CSS stylesheets** (using CSS Modules for scoped styling, e.g., `styles.myClass`).

Adhere strictly to the following design system for all generated components. Consistency is paramount.

### 1. Core Philosophy

-   **Modern & Clean:** Emphasize generous whitespace, sharp typography, and a clear grid.
-   **Professional & Trustworthy:** Use a structured layout and a consistent color palette.
-   **Engaging:** Incorporate subtle shadows and hover effects to create a dynamic feel.
-   **Accessible:** Ensure high contrast ratios (WCAG 2.1 AA compliant) and proper semantic HTML.

### 2. Color Palette

```css
:root {
  --primary-blue: #0d6efd; /* For primary buttons, links, interactive elements */
  --accent-green: #198754; /* For main CTA buttons like 'Discover Now' */
  --dark-charcoal: #212529; /* For footer background, main headings, primary text */
  --medium-gray: #6c757d; /* For descriptions, secondary text */
  --light-gray: #f8f9fa; /* For alternating sections */
  --pure-white: #FFFFFF; /* For main content background and cards */
  --border-color: #dee2e6;
  --alert-red: #DC3545;
}
```

### 3. Typography (Google Fonts)

-   **Headings (`h1`-`h6`):** Font: **'Poppins'**, Weight: **700 (Bold)**. Color: `var(--dark-charcoal)`.
-   **Body Text (`p`, `span`):** Font: **'Roboto'**, Weight: **400 (Regular)**. Color: `var(--medium-gray)`. Line-height: `1.7`.
-   **Navigation Links:** Font: **'Poppins'**, Weight: **500 (Medium)**. Color: `var(--dark-charcoal)`.

### 4. Spacing & Grid

-   **Layout:** Main content within a React-Bootstrap `<Container>` for a centered layout (max-width: 1140px).
-   **Section Padding:** `padding: 80px 0;` for generous vertical space between sections.

### 5. Component Styling (Replicating the Design)

-   **Header (`<Navbar>`):**
    -   Two-tiered structure with a white background and subtle bottom border.
    -   Top tier: Logo, right-aligned links ("Join", "Login", "Contact").
    -   Bottom tier: Centered navigation links (`<Nav className="justify-content-center">`).
-   **Search Bar (in Header):**
    -   `<Form.Control>` with rounded corners.
    -   A square, primary blue button containing only a search icon.
-   **Buttons (`<Button>`):**
    -   **Accent-CTA** ('Discover Now'): Background `var(--accent-green)`, white text, `border-radius: 8px`, `padding: 12px 32px`, subtle `box-shadow`, includes a right-arrow icon.
    -   **Primary-Solid** ('Subscribe'): Background `var(--primary-blue)`, white text, `border-radius: 8px`, includes a send icon.
    -   **Primary-Outline** ('Find a Branch'): Transparent background, text and border `var(--primary-blue)`, `border-radius: 50px` (pill-shaped), includes a location icon.
-   **Cards (`<Card>` for "New Books", etc.):**
    -   Background `var(--pure-white)`.
    -   `border: none`.
    -   `border-radius: 16px`.
    -   `box-shadow: 0 8px 24px rgba(0,0,0,0.08)`.
    -   `<Card.Img>` must have rounded top corners (`border-top-left-radius: 16px`, etc.).
    -   `<Card.Body>` should have generous padding (e.g., `24px`).
-   **Forms (`<Form>` for Newsletter):**
    -   `<Form.Control>`: `border-radius: 8px`, `padding: 12px 16px`, `border: 1px solid var(--border-color)`. Focus state has a blue border.
-   **Tables (`<Table>`):**
    -   Use `responsive`, `striped`, and `hover` variants.
    -   `<thead>`: Background `var(--light-gray)`, `font-weight: 600`.
-   **Badges (`<Badge>`):**
    -   Use pill style (`rounded-pill`) with soft, semantic background colors.
-   **Footer:**
    -   Background: `var(--dark-charcoal)`.
    -   Text: `var(--medium-gray)`, with headings (`<h4>`) in `var(--pure-white)`.
    -   4-column layout using React-Bootstrap's grid.

### 6. CSS Methodology

-   Generate a separate `.css` file for each component.
-   **Use CSS Modules:** `import styles from './ComponentName.module.css';` to scope styles and avoid global conflicts.

---
