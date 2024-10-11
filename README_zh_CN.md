# @frostime/solid-signal-ref

[English Document](./README.md)

这是一个用于简化在 solidjs 中 signal 使用的小工具。能以更加简单的方式访问和修改 signal。

## 安装

```bash
npm install @frostime/solid-signal-ref
```

## 使用方法

从包中导入 `useSignalRef` 函数：

```javascript
import { useSignalRef } from '@frostime/solid-signal-ref';
```

1. 创建一个 signal

```javascript
const count = useSignalRef<number>(0);
```

2. 访问 signal 的值：两种方式

```ts
count(); // Accessor 风格访问
count.value; // Vue 风格访问
count.signal(); // 使用 count.signal 直接访问 signal 对象本身
```

3. 修改 signal 的值

```jsx
count(1); // 传入新的 value
count.value = 2;  // Vue 风格修改
count.update(3);  // 使用 count.update 等价与直接访问 setSignal 函数
count.update(v => v * 2);
```

4. derived signal

```jsx
//等价于 const doubled = () => count() * 2;
const doubled = count.derived(c => c * 2);

<p>Doubled count: {doubled()}</p>
```

## 使用示例

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
