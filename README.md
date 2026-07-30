# ProTime

[![NPM](https://img.shields.io/npm/v/@toluade/protime-react-component.svg)](https://www.npmjs.com/package/@toluade/protime-react-component)

> A simple timer component and hook for your React app.

## Requirements

- React 18 or 19, as a peer dependency, so the package uses the React your app
  already has
- Node 18 or newer

## Install

npm

```sh
npm i @toluade/protime-react-component --save
```

yarn

```sh
yarn add @toluade/protime-react-component
```

## ProTime component

A ready-made countdown display. Values are always zero-padded.

### Props

- `startDate: string | Date`

  - The countdown holds its value until this time is reached.

- `endDate: string | Date`

  - The time being counted down to.

- `className?: string`
  - Applied to the container element. Optional.

### Example

```tsx
import { ProTime } from '@toluade/protime-react-component'

function App() {
  return <ProTime startDate='2027-04-19T09:00' endDate='2027-12-25T09:00' />
}
```

### Rendered markup

Once a full day or more remains:

```html
<p>
  <span id="days">01 days</span>
  <span id="hour">02 hours</span>
  <span id="min">05 min</span>
  <span id="sec">09 sec</span>
</p>
```

Under a day, it switches to a clock:

```html
<p>
  <span id="hour">02</span>
  <span class="column timer__item">:</span>
  <span id="min">03</span>
  <span class="column timer__item">:</span>
  <span id="sec">04</span>
</p>
```

Note that these are ids, so rendering more than one `ProTime` on a page
produces duplicate ids. Style the container through `className` where you can.

## useProTime hook

For building your own display. Returns `{ days, hours, minutes, seconds }`.

### Arguments

- `startDate: string | Date`

  - The countdown holds its value until this time is reached.

- `endDate: string | Date`

  - The time being counted down to.

- `isFormatted?: boolean`
  - When `true`, every value is a string, zero-padded to at least two
    characters (`'09'`, `'59'`). When omitted or `false`, every value is a
    number. Defaults to `false`.

### Example

```tsx
import { useProTime } from '@toluade/protime-react-component'

function App() {
  const { days, hours, minutes, seconds } = useProTime(
    '2027-04-19T09:00',
    '2027-12-25T09:00',
    true
  )

  return (
    <p>
      <span>{days} days</span>
      <span>{hours} hours</span>
      <span>{minutes} minutes</span>
      <span>{seconds} seconds</span>
    </p>
  )
}
```

## Behaviour

- **Before `startDate`,** the remaining time is shown but does not tick. The
  countdown begins on its own once `startDate` arrives; the component does not
  need to be remounted.
- **The countdown never goes negative.** An `endDate` in the past reads as all
  zeroes from the first render.
- **It stops at zero,** releasing its interval rather than waking every second
  forever.
- **A changed `endDate` applies immediately,** without waiting for the next
  tick.
- **On unmount the interval is released,** so no timer outlives the component.
- Passing a fresh `Date` object describing the same instant does not restart
  the countdown.

## TypeScript

Declarations ship with the package. The value shapes and the component props
are exported if you need to name them:

```ts
import type {
  ProTimeProps,
  ProTimeValues,
  FormattedProTimeValues
} from '@toluade/protime-react-component'
```

Because `isFormatted` is overloaded, `useProTime(start, end, true)` is typed as
all strings and `useProTime(start, end)` as all numbers — no union to narrow.

## Upgrading from 1.x

- **React 16 and 17 are no longer supported.** The peer range is
  `^18.0.0 || ^19.0.0`.
- **Formatted values are now always strings.** Previously values under 10 came
  back as strings (`'09'`) while 10 and above came back as numbers (`59`),
  despite the declared type claiming otherwise. Rendering is unaffected;
  arithmetic on a formatted value is not.
- **The ESM entry point moved** from `dist/index.modern.js` to
  `dist/index.mjs`, and an `exports` map now prevents deep imports into
  `dist/`. Import from the package root.
- **Node 18 or newer** is required.
- Several counting bugs were fixed, most visibly that a timer mounted before
  `startDate` never started at all. See the 2.0.0 release notes.

## Development

```sh
yarn install
yarn test          # vitest
yarn typecheck     # library and test files
yarn lint
yarn build         # tsup, emits CJS, ESM and declarations
```

## License

MIT © [Toluade](https://github.com/Toluade)
