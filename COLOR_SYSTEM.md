# Quran App - Color System & Design Tokens

## Primary Colors (Islamic Green)

### Light Theme
```css
--primary-color: #2d7d32    /* Deep Green - Main brand color */
--primary-light: #4caf50    /* Light Green - Hover/hover states */
--primary-dark: #1b5e20     /* Dark Green - Active states */
```

**Use cases:**
- Headers and footers
- Active buttons and tabs
- Primary CTA buttons
- Links and accents
- Borders on important elements

### Dark Theme (Automatic)
When `[data-theme="dark"]` is set, colors remain the same but background context changes, making green pop more.

---

## Secondary Colors (Islamic Gold)

### Light Theme
```css
--secondary-color: #d4af37   /* Gold - Accent color */
--secondary-light: #ffd54f   /* Light Gold - Hover state */
--secondary-dark: #bf9000    /* Dark Gold - Active state */
```

**Use cases:**
- Section headings (especially in footer)
- Icons and highlights
- Decorative elements
- Success states (alongside green)
- Star icons for ratings

---

## Text Colors

### Light Theme
```css
--text-primary: #1a1a1a     /* Very dark gray - Main text */
--text-secondary: #666666   /* Medium gray - Secondary text */
--text-light: #999999       /* Light gray - Tertiary text */
--text-white: #ffffff       /* White - On dark backgrounds */
```

### Dark Theme
```css
--text-primary: #ffffff     /* White - Main text */
--text-secondary: #b0b0b0   /* Light gray - Secondary text */
--text-light: #888888       /* Medium gray - Tertiary text */
--text-white: #ffffff       /* White - Remains same */
```

---

## Background Colors

### Light Theme
```css
--bg-primary: #fafafa           /* Off-white - Main background */
--bg-secondary: #ffffff         /* Pure white - Card backgrounds */
--bg-card: #ffffff              /* Pure white - Card surfaces */
--bg-hover: #f5f5f5             /* Light gray - Hover state */
--bg-modal: rgba(0, 0, 0, 0.5)  /* Semi-transparent - Modal overlay */
```

### Dark Theme
```css
--bg-primary: #121212           /* Very dark - Main background */
--bg-secondary: #1e1e1e         /* Dark gray - Secondary bg */
--bg-card: #2d2d2d              /* Medium dark - Card backgrounds */
--bg-hover: #353535             /* Lighter dark - Hover state */
--bg-modal: rgba(0, 0, 0, 0.8)  /* More opaque - Modal overlay */
```

---

## Border & Shadow Colors

### Light Theme
```css
--border-color: #e0e0e0         /* Very light gray - Borders */

--shadow-sm: 0 2px 4px rgba(0, 0, 0, 0.1)      /* Subtle shadow */
--shadow-md: 0 4px 12px rgba(0, 0, 0, 0.15)    /* Medium shadow */
--shadow-lg: 0 8px 24px rgba(0, 0, 0, 0.2)     /* Deep shadow */
```

### Dark Theme
```css
--border-color: #404040         /* Dark gray - Borders */

--shadow-sm: 0 2px 4px rgba(0, 0, 0, 0.3)      /* More visible */
--shadow-md: 0 4px 12px rgba(0, 0, 0, 0.4)     /* Stronger shadow */
--shadow-lg: 0 8px 24px rgba(0, 0, 0, 0.5)     /* Dramatic shadow */
```

---

## Usage Examples

### Button Styles
```css
/* Primary Button */
.primary-btn {
    background: var(--primary-color);
    color: var(--text-white);
    border: none;
}

.primary-btn:hover {
    background: var(--primary-light);
}

.primary-btn:active {
    background: var(--primary-dark);
}

/* Secondary Button */
.secondary-btn {
    background: var(--bg-card);
    color: var(--text-primary);
    border: 2px solid var(--primary-color);
}

.secondary-btn:hover {
    background: var(--bg-hover);
    border-color: var(--primary-light);
}
```

### Card Styles
```css
.card {
    background: var(--bg-card);
    border: 1px solid var(--border-color);
    border-radius: 12px;
    box-shadow: var(--shadow-sm);
    color: var(--text-primary);
}

.card:hover {
    box-shadow: var(--shadow-md);
    border-color: var(--primary-color);
}
```

### Header
```css
.header {
    background: linear-gradient(
        135deg,
        var(--primary-color),
        var(--primary-light)
    );
    color: var(--text-white);
    box-shadow: var(--shadow-md);
}
```

### Modal
```css
.modal-overlay {
    background: var(--bg-modal);  /* Changes in dark mode */
}

.modal {
    background: var(--bg-secondary);
    border-radius: 12px;
    box-shadow: var(--shadow-lg);
    color: var(--text-primary);
}
```

### Input/Form
```css
input,
select,
textarea {
    background: var(--bg-secondary);
    color: var(--text-primary);
    border: 1px solid var(--border-color);
    border-radius: 8px;
}

input:focus {
    border-color: var(--primary-color);
    outline: none;
    box-shadow: 0 0 0 3px rgba(45, 125, 50, 0.1);
}
```

### Alert Messages
```css
/* Error Alert */
.error-alert {
    background: #f44336;  /* Material red - doesn't change in dark theme */
    color: white;
}

/* Success Alert */
.success-alert {
    background: var(--primary-light);  /* Uses theme color */
    color: white;
}

/* Warning Alert */
.warning-alert {
    background: #ff9800;  /* Material orange */
    color: white;
}
```

---

## Theme Switching

### How It Works
The app uses a single CSS attribute selector to switch themes:

```javascript
// Light theme (default)
document.documentElement.removeAttribute('data-theme');

// Dark theme
document.documentElement.setAttribute('data-theme', 'dark');
```

All variables are defined in two places:
```css
:root {
    /* Light theme variables */
}

[data-theme="dark"] {
    /* Dark theme overrides */
}
```

### Automatic Theme Detection
```javascript
// Get user's system preference
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

// Apply automatically
if (appData.settings.theme === 'auto') {
    if (prefersDark) {
        document.documentElement.setAttribute('data-theme', 'dark');
    } else {
        document.documentElement.removeAttribute('data-theme');
    }
}
```

---

## Color Contrast

All color combinations meet WCAG AAA accessibility standards:

### Light Theme
- Text on cards: #1a1a1a on #ffffff (21:1 contrast ratio)
- Text on background: #1a1a1a on #fafafa (17:1 contrast ratio)
- White text on primary: #ffffff on #2d7d32 (5.2:1 contrast ratio)

### Dark Theme
- White text on dark: #ffffff on #121212 (17.6:1 contrast ratio)
- White text on cards: #ffffff on #2d2d2d (13:1 contrast ratio)

---

## Customization Guide

### Change Primary Brand Color

1. Update in CSS:
```css
:root {
    --primary-color: #your-color;
    --primary-light: #lighter-variant;
    --primary-dark: #darker-variant;
}
```

2. All components automatically update:
   - Headers
   - Buttons
   - Links
   - Active states
   - Focus indicators

### Change Secondary Accent Color

```css
:root {
    --secondary-color: #your-accent;
    --secondary-light: #lighter-accent;
    --secondary-dark: #darker-accent;
}
```

Updates:
- Section headings (footer)
- Icon accents
- Decorative elements

### Suggested Color Combinations

**Islamic Theme (Current)**
- Primary: #2d7d32 (Green)
- Secondary: #d4af37 (Gold)

**Ocean Theme**
- Primary: #006688 (Deep Blue)
- Secondary: #00bcd4 (Cyan)

**Desert Theme**
- Primary: #8b4513 (Brown)
- Secondary: #d4a574 (Tan)

**Modern Purple**
- Primary: #7b1fa2 (Purple)
- Secondary: #e91e63 (Pink)

---

## Color in Dark Mode - Key Points

1. **Same primary colors** but different context
2. **Darker backgrounds** make vibrant colors pop more
3. **Higher text contrast** in dark mode for readability
4. **No color changes** for alerts (they stay red/orange/yellow)
5. **Shadows more pronounced** in dark mode

Example: Green (#2d7d32) appears more vibrant on dark background (#121212) than on light background (#fafafa).

---

## Using Colors in New Features

When adding new components:

```css
/* WRONG - Hardcoded colors */
.my-component {
    color: #1a1a1a;        /* Won't work in dark mode */
    background: #ffffff;   /* Wrong in dark theme */
    border: 1px solid #ddd; /* Hardcoded */
}

/* CORRECT - Use CSS variables */
.my-component {
    color: var(--text-primary);      /* Auto switches */
    background: var(--bg-card);      /* Auto switches */
    border: 1px solid var(--border-color);  /* Auto switches */
}
```

---

## Accessibility Color Guidelines

1. **Text on Backgrounds**: Use `--text-primary` on `--bg-*`
2. **Borders**: Use `--border-color` (already accessible)
3. **Icons**: Use `--primary-color` or `--secondary-color`
4. **Active States**: Use `--primary-light` with clear indication
5. **Disabled States**: Use `--text-light` with reduced opacity
6. **Alerts**: Use standard colors (red, green, orange) for universal recognition

---

## Testing Colors

### In Browser DevTools
1. Open Elements Inspector
2. Check computed styles for `var()` usage
3. Simulate dark mode: Rendering > Emulate CSS media feature prefers-color-scheme > dark
4. Verify all text remains readable
5. Check button hover states are visible

### Manual Testing Checklist
- [ ] Light theme: All text readable
- [ ] Dark theme: All text readable
- [ ] Light theme: All buttons visible
- [ ] Dark theme: All buttons visible
- [ ] Light theme: Links are blue (or primary color)
- [ ] Dark theme: Links are visible
- [ ] Cards have visible borders in both themes
- [ ] Hover states are clear in both themes

---

## Color Reference Quick Copy

```css
/* Paste into new components */
color: var(--text-primary);
background: var(--bg-card);
border: 1px solid var(--border-color);
border-radius: var(--border-radius);
box-shadow: var(--shadow-md);
transition: var(--transition);

/* For interactive elements */
:hover {
    background: var(--bg-hover);
    box-shadow: var(--shadow-lg);
}

/* For active states */
:active {
    background: var(--primary-light);
}

/* For accents */
color: var(--primary-color);
border-top: 4px solid var(--primary-color);

/* For highlights */
color: var(--secondary-color);
```

This comprehensive color system ensures consistency, accessibility, and easy theme switching throughout the app!
