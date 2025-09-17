# **Frontend Overall Architecture**

- **`components/`** → Reusable building blocks (buttons, modals, cards).
- **`features/`** → Each feature has its own **UI + logic** substructure (keeps things modular).
- **`hooks/`** → Cross-cutting stateful utilities (e.g. `useLocalStorage`, `useAuth`).
- **`utils/`** → Generic helpers, shared utilities like API clients, constants, formatting helpers.
- **`pages/`** → Screens that bring together components/features into a full page.
- **`assets/`** → Static images, fonts, etc.
```
rcpt/
│
├── public/                      # Static files
│
├── src/
│   ├── assets/              # Images, fonts, static files imported in code
│   │
│   ├── components/              # Reusable UI
│   │   ├── Card.tsx
│   │   ├── InputField.tsx
│   │   └── ...
│   │
│   ├── features/                # Feature-specific UI + logic
│   │   ├── Staff/
│   │   │   ├── StaffTab.tsx
│   │   │   └── staffLogic.ts
│   │   ├── Equipment/
│   │   │   ├── EquipmentTab.tsx
│   │   │   └── equipmentLogic.ts
│   │   └── Summary/
│   │       ├── SummaryTab.tsx
│   │       └── summaryLogic.ts
|   |
│   ├── context/                 # Global state/context
│   │   └── ProjectContext.tsx
│   │
│   ├── services/                # Shared helpers / Shared utilities (API clients, config, helpers)
│   │   ├── pdfService.ts
│   │   ├── api.ts
│   │   └── storageService.ts
│   │
│   ├── utils/                   # Generic helpers
│   │   ├── calculations.ts
│   │   └── validations.ts
│   │   ├── constants.ts
│   │   └── ...
│   │
│   ├── styles/                   # Styles (tailwind)
│   │   ├── global.css
│   │
│   ├── App.tsx                  # Root App
│   └── main.tsx                 # Entry point
│
├── tailwind.config.js
├── tsconfig.json
├── package.json

```

---

# Global CSS Utilities

This section explains how to **add new utility classes** to the global CSS and how to use the existing variables, using the `Card` component as an example.

---

## 1. Adding New Utility Classes

All global CSS variables are defined under `:root` in your `globals.css`. These can be mapped to **namespaced utility classes** to avoid collisions with Tailwind or other libraries.

**Steps:**

1. **Define a variable (if needed):**a

```css
:root {
  --highlight: #fffae6;
}

```

2. **Use it in a React component:**

```tsx
<div className={cn("bg-highlight p-4 rounded-lg")}>
  Highlighted section
</div>

```
    - `bg-highlight` will use --highlight variable 
**Tip:** Always prefix custom utilities (e.g., `card-`, `popover-`, `sidebar-`) to prevent conflicts.

---

## 2. Example: Card Component

Your `Card` uses these utilities:

```tsx
<Card className={cn("bg-card text-card-foreground rounded-xl border shadow-sm")}>
  <CardHeader>
    <CardTitle>Title</CardTitle>
  </CardHeader>
  <CardContent>
    Card content goes here.
  </CardContent>
</Card>

```

- `bg-card`: background color from `-card`
- `text-card`: text color from `-card-foreground`
- `rounded-xl-card`: border-radius from `-radius`
- `border-card`: border color from `-border`

---

## 3. Global CSS Variables and Utilities

Current: 

| Variable / Utility | CSS Variable | Description / Usage | Example Class |
| --- | --- | --- | --- |
| Background | `--background` | Base body background | `bg-background` |
| Foreground / Text | `--foreground` | Base text colour | `text-foreground` |
| Card Background | `--card` | Card component background | `card-bg` |
| Card Foreground / Text | `--card-foreground` | Card text colour | `card-text` |
| Muted Text | `--muted-foreground` | Subtle text, e.g., descriptions | `card-text-muted` |
| Border | `--border` | Default border colour | `card-border` |
| Input Background | `--input-background` | Forms, input fields | `input-bg` (custom) |
| Focus / Ring | `--ring` | Outline on focus | `focus-outline` (custom) |
| Radius | `--radius` | Default border-radius for rounded elements | `card-rounded-xl` |
| Font Weights | `--font-weight-normal` / `--font-weight-medium` | Default weights for body and headings | `font-normal` / `font-medium` |
| Popover Colors | `--popover`, `--popover-foreground` | Popover backgrounds and text | `popover-bg`, `popover-text` |
| Primary / Secondary Colors | `--primary`, `--primary-foreground`, `--secondary`, `--secondary-foreground` | Theme colours | `text-primary`, `bg-secondary` |
| Accent / Destructive | `--accent`, `--accent-foreground`, `--destructive`, `--destructive-foreground` | Highlights, errors, delete actions | `text-accent`, `bg-destructive` |
| Sidebar Colors | `--sidebar`, `--sidebar-foreground`, etc. | Sidebar background / text / borders | `sidebar-bg`, `sidebar-text` |

> Note: You can add any new variable and map it to a namespaced class to keep codebase consistent and prevent conflicts with Tailwind.
> 

---

## 4. Best Practices

- **Always use namespaced utility classes** for custom variables (e.g., `card-`, `popover-`, `sidebar-`)
- **Combine with `cn` helper** in utils for dynamic class merging:
- **Prefer global variables for colours, spacing, and typography**, rather than hardcoding in components.
- **Use the table above as a reference** when adding new components or styles.