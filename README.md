# ProTime

A countdown timer React component.

### Props

- `startDate: string | Date`

  - This is the time the timer will start counting down from.

- `endDate: string | Date`

  - This is the time the timer will count down to.

- `className: string`
  - This is the className property of the container element.

## Install

npm

```sh npm
npm i @toluade/protime-react-component --save
```

yarn

```sh yarn
yarn add @toluade/protime-react-component
```

## Example Usage

```js
import ProTime from "@toluade/protime-react-component";

function App() {
  const startDate = "2024-04-19T09:00";
  const endDate = "2024-12-25T09:00";

  return (
    <div>
      <ProTime startDate={startDate} endDate={endDate} className="" />
    </div>
  );
}
```
