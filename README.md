# @frostime/solidjs-signal-ref

这是一个用于简化在 solidjs 中 signal 使用的小工具。

## 安装

```bash
npm install @frostime/solidjs-signal-ref
```

## 使用方法

从包中导入 `useSignalRef` 函数：

```javascript
import { useSignalRef } from '@frostime/solidjs-signal-ref';
```

1. 创建一个 signal

```javascript
const count = useSignalRef<number>(0);
```

2. 访问 signal 的值：两种方式

```jsx
<div>
    <p>使用 () 直接访问: {count()}</p>
    <p>使用 .value 访问: {count.value}</p>
</div>
```

3. 修改 signal 的值

```jsx
// 使用 ref(newvalue) 的方式
<div>
    <button on:click={() => count(count() + 1)}>Increment</button>
</div>

// 使用 .value = newvalue 的方式
<div>
    <button on:click={() => count.value = count.value + 1}>Increment</button>
</div>
// 使用 update 方法
<div>
    <button on:click={() => count.update((v) => v + 1)}>Increment</button>
</div>
```



