# ProTime

> A countdown timer React component.

[![NPM](https://img.shields.io/npm/v/@toluade/protime-react-component.svg)](https://www.npmjs.com/package/@toluade/protime-react-component) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Install

npm

```sh npm
npm i @toluade/protime-react-component --save
```

yarn

```sh yarn
yarn add @toluade/protime-react-component
```

### Props

- `startDate: string | Date`

  - The timer won't start until this time is reached.

- `endDate: string | Date`

  - This is the time the timer will count down to.

- `className: string`
  - This is the className property of the container element.

## Example Usage

```js
import ProTime from '@toluade/protime-react-component'

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

## License

MIT © [Toluade](https://github.com/Toluade)
