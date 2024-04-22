# ProTime

[![NPM](https://img.shields.io/npm/v/@toluade/protime-react-component.svg)](https://www.npmjs.com/package/@toluade/protime-react-component) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

> A simple timer component and hook for your react app.

## Install

npm

```sh npm
npm i @toluade/protime-react-component --save
```

yarn

```sh yarn
yarn add @toluade/protime-react-component
```

## ProTime Component

- Returns a react component that displays a countdown timer.

### Props

- `startDate: string | Date`

  - The timer won't start until this time is reached.

- `endDate: string | Date`

  - This is the time the timer will count down to.

- `className: string`
  - This is the className property of the container element.

### Example Usage

```js
import { ProTime } from '@toluade/protime-react-component'

function App() {
  const startDate = '2024-04-19T09:00'
  const endDate = '2024-12-25T09:00'

  return (
    <div>
      <ProTime startDate={startDate} endDate={endDate} className='' />
    </div>
  )
}
```

## useProTime Hook

- Returns an object with the values `{ days, hours, minutes, seconds,}`.

### Props

- `startDate: string | Date`

  - The timer won't start until this time is reached.

- `endDate: string | Date`

  - This is the time the timer will count down to.

- `isFormatted?: boolean`
  - If you want the values returned formatted with a "0" in front when the value is less than 10, set to `true`. The default value is `false`.

### Example Usage

```js
import { useProTime } from '@toluade/protime-react-component'

function App() {
  const startDate = '2024-04-19T09:00'
  const endDate = '2024-12-25T09:00'

  const { days, hours, minutes, seconds } = useProTime(startDate, endDate, true)

  return (
    <div>
      <p>
        <span>{days}days</span>
        <span>{hours}hours</span>
        <span>{minutes}minutes</span>
        <span>{seconds}seconds</span>
      </p>
    </div>
  )
}
```

## License

MIT © [Toluade](https://github.com/Toluade)
