# @frostime/solid-signal-ref

[中文文档](./README_zh_CN.md)

This is a small utility to simplify the use of signals in solidjs. It allows for easier access and modification of signals.

## Installation

```bash
npm install @frostime/solid-signal-ref
```

## Usage

Import the `useSignalRef` function from the package:

```javascript
import { useSignalRef } from '@frostime/solid-signal-ref';
```

1. Create a signal

```javascript
const count = useSignalRef<number>(0);
```

2. Access the signal's value: two ways

```ts
count(); // Accessor style access
count.value; // Vue style access
count.signal(); // Use count.signal to directly access the signal object itself
```

3. Modify the signal's value

```jsx
count(1); // Pass in a new value
count.value = 2;  // Vue style modification
count.update(3);  // Use count.update equivalent to directly accessing the setSignal function
count.update(v => v * 2);
```

4. Derived signal

```jsx
// Equivalent to const doubled = () => count() * 2;
const doubled = count.derived(c => c * 2);

<p>Doubled count: {doubled()}</p>
```

## Usage Example

```tsx
function App() {
  const count = useSignalRef(0);

  const odd = () => (count() % 2 === 1) ? 'Yes' : 'No';
  const wordCount = count.derived(c => `Word count: ${c.toString().length}`)
  const numberStr = createMemo(() => {
    const abs = Math.abs(count());
    if (abs < 1000) {
      return abs.toString();
    } else if (abs < 1000000) {
      return (abs / 1000).toFixed(1) + 'k';
    } else {
      return (abs / 1000000).toFixed(1) + 'M';
    }
  });

  return (
    <>
      <div class="card">
        <button onClick={() => count((count() + 1))}>
          {count()} + 1
        </button>
        <button onClick={() => { count.value -= 1 }}>
          {count.value} - 1
        </button>
        <button onClick={() => { count.update((c: number) => 10 * c) }}>
          {count.value} * 10
        </button>
        <button onClick={() => { count.value /= 10 }}>
          {count.value} / 10
        </button>
        <p>
          Is count odd? {odd()}; {wordCount()}; {numberStr()}
        </p>
      </div>
    </>
  )
}
```