# `@mutualzz/ui-native`

React Native + Emotion component library for the Mutualzz **mobile** app.

Shares theme tokens and helpers with [`@mutualzz/ui-core`](../ui-core), mirroring patterns from [`@mutualzz/ui-web`](../ui-web) where it makes sense on native.

## Features

- Theme provider + `useTheme` aligned with Mutualzz desktop theming
- Native-friendly inputs, lists, progress, and surfaces
- Accessibility helpers (font scale, scaled layout utilities)
- Skia-backed bits where needed (e.g. gradients / paper)

## Package layout

| Package | Role |
|---|---|
| `@mutualzz/ui-core` | Shared theme tokens, color utils, types |
| `@mutualzz/ui-web` | Web / Electron React components |
| `@mutualzz/ui-native` | React Native components (this package) |

## Components (overview)

**Inputs** — Button, ButtonGroup, IconButton, Checkbox, CheckboxGroup, Radio, RadioGroup, Switch, Slider, Input (and Default / Password / Number / Color / Root variants)

**Data display** — Avatar, Divider, List / ListItem / ListItemButton, Typography

**Feedback** — CircularProgress, LinearProgress

**Surfaces & overlay** — Paper, Modal

**Layout** — Box, Stack

**Theming & a11y** — ThemeProvider, NativeBaseline, useTheme, useFontScale, accessibility / layout scale utils

## Development

From the monorepo root:

```bash
pnpm --filter @mutualzz/ui-native build
pnpm --filter @mutualzz/ui-native dev
pnpm --filter @mutualzz/ui-native typecheck
```

Peer dependencies include React, React Native, Emotion (`@emotion/react`, `@emotion/native`), Reanimated, Gesture Handler, Safe Area, SVG, and Skia — see `package.json`.

## Authors & credit

- [Azrael](https://github.com/mateie) — original author
- Community contributors are credited via git authorship, PR attribution, and changelogs (see [`CONTRIBUTING.md`](./CONTRIBUTING.md))

## License & contributions

Source is available for transparency and community contributions. Contributors get credit for merged work.

- [`LICENSE`](./LICENSE) — no unofficial redistribution / competing hosted services without permission
- [`CONTRIBUTING.md`](./CONTRIBUTING.md) — how to fork, open PRs, and how credit works
