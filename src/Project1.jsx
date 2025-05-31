import React, { useState, useEffect, useRef, createContext, useContext, useReducer, useCallback } from 'react';

// --- Live Example Components (These are actual React components used in the examples) ---

// Helper component for Greeting example (used in ReactFundamentals)
function Greeting() {
  return <p className="bg-blue-50 p-3 rounded-lg border border-blue-200 mt-4">Hello, React Student!</p>;
}

// Helper component for Welcome example (used in ReactFundamentals)
function Welcome(props) {
  return <p className="bg-blue-50 p-3 rounded-lg border border-blue-200 mt-4">Welcome, {props.name}!</p>;
}

// Helper component for Counter example (used in ReactStateAndEvents)
function CounterExample() {
  const [count, setCount] = useState(0);

  function increment() {
    setCount(count + 1);
  }

  return (
    <button
      onClick={increment}
      className="bg-indigo-500 text-white py-2 px-4 rounded-md hover:bg-indigo-600 transition duration-200"
    >
      Count: {count}
    </button>
  );
}

// Components for Sharing State example (used in ReactAdvancedState)
function ParentComponentForSharingState() {
  const [sharedValue, setSharedValue] = useState(0);

  return (
    <div className="border border-dashed border-gray-400 p-4 rounded-lg">
      <p className="font-semibold mb-2">Parent Component (Shared Value: {sharedValue})</p>
      <ChildComponentA value={sharedValue} />
      <ChildComponentB onIncrement={() => setSharedValue(prev => prev + 1)} />
    </div>
  );
}

function ChildComponentA({ value }) {
  return <p className="bg-gray-100 p-2 rounded-md mb-2">Child A displays: {value}</p>;
}

function ChildComponentB({ onIncrement }) {
  return (
    <button
      onClick={onIncrement}
      className="bg-orange-500 text-white py-1 px-3 rounded-md hover:bg-orange-600 transition duration-200"
    >
      Child B: Increment Shared Value
    </button>
  );
}

// Component for Preserving and Resetting State (used in ReactAdvancedState)
function CounterWithKey() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    console.log('CounterWithKey mounted or key changed. Count:', count);
    return () => {
      console.log('CounterWithKey unmounted or key changed. Final Count:', count);
    };
  }, [count]);

  return (
    <div className="bg-gray-100 p-4 rounded-lg text-center">
      <p className="text-xl font-bold mb-2">Counter: {count}</p>
      <button
        onClick={() => setCount(prevCount => prevCount + 1)}
        className="bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 transition duration-200"
      >
        Increment Counter
      </button>
    </div>
  );
}

// Contexts for Passing Data Deeply with Context (used in ReactAdvancedState)
const ThemeContext = createContext(null);
const TodoDispatchContext = createContext(null);

function ThemedComponent({ theme, toggleTheme }) { // Pass theme and toggleTheme as props
  return (
    <div className={`p-4 mt-4 rounded-lg ${theme === 'light' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-700 text-white'}`}>
      <p>This component's theme is: <strong>{theme}</strong></p>
      <DeeplyNestedComponent theme={theme} /> {/* Pass theme down */}
      <button
        onClick={toggleTheme}
        className="bg-indigo-500 text-white py-2 px-4 rounded-md hover:bg-indigo-600 transition duration-200 mt-2"
      >
        Toggle Theme
      </button>
    </div>
  );
}

function DeeplyNestedComponent({ theme }) { // Receive theme as prop
  return (
    <p className={`mt-2 text-sm ${theme === 'light' ? 'text-yellow-700' : 'text-gray-300'}`}>
      I'm a deeply nested component, and my theme is also: <strong>{theme}</strong>
    </p>
  );
}

// Components for Scaling Up with Reducer and Context (Todo List - used in ReactAdvancedState)
const TodoContext = createContext(null);

function TodoList() {
  const todos = useContext(TodoContext);
  return (
    <ul className="list-disc list-inside space-y-2">
      {todos.map(todo => (
        <TodoItem key={todo.id} todo={todo} />
      ))}
    </ul>
  );
}

function TodoItem({ todo }) {
  const dispatch = useContext(TodoDispatchContext);
  return (
    <li className="flex items-center justify-between bg-white p-2 rounded-md shadow-sm">
      <label className="flex items-center space-x-2 cursor-pointer">
        <input
          type="checkbox"
          checked={todo.done}
          onChange={() => dispatch({ type: 'toggle', id: todo.id })}
          className="form-checkbox h-5 w-5 text-blue-600 rounded"
        />
        <span className={`${todo.done ? 'line-through text-gray-500' : 'text-gray-800'}`}>
          {todo.text}
        </span>
      </label>
      <button
        onClick={() => dispatch({ type: 'remove', id: todo.id })}
        className="bg-red-400 text-white text-xs py-1 px-2 rounded-md hover:bg-red-500 transition duration-200"
      >
        Remove
      </button>
    </li>
  );
}

// Reducer for Todo List (moved outside component for clarity, used in ReactAdvancedState)
function todosReducer(todos, action) {
  switch (action.type) {
    case 'add':
      return [...todos, { id: Date.now(), text: action.text, done: false }];
    case 'toggle':
      return todos.map(todo =>
        todo.id === action.id ? { ...todo, done: !todo.done } : todo
      );
    case 'remove':
      return todos.filter(todo => todo.id !== action.id);
    default:
      throw new Error('Unknown action: ' + action.type);
  }
}

// Custom Hook Example (used in ReactAdvancedConcepts and ProjectExamples)
function useToggle(initialValue = false) {
  const [value, setValue] = useState(initialValue);
  const toggle = useCallback(() => setValue(prev => !prev), []);
  return [value, toggle];
}

// Project Examples specific components
const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-xl font-bold"
        >
          &times;
        </button>
        {children}
      </div>
    </div>
  );
};

const Star = ({ selected, onSelect, onHover, onLeave, starId }) => (
  <span
    className={`text-3xl cursor-pointer ${selected ? 'text-yellow-400' : 'text-gray-300'}`}
    onClick={() => onSelect(starId)}
    onMouseEnter={() => onHover(starId)}
    onMouseLeave={onLeave}
  >
    ★
  </span>
);

// --- Centralized Content Data Structure ---
const appContent = {
  fundamentals: {
    title: "React Fundamentals for Students",
    sections: [
      {
        title: "Your First Component",
        id: "fundamentals-first-component",
        content: [
          { type: 'paragraph', text: 'A React component is a small, reusable piece of code that returns React elements (which describe what should appear on the screen). Here\'s a simple functional component:' },
          { type: 'code', language: 'jsx', code: `function Greeting() {
  return <p>Hello, React Student!</p>;
}`},
          { type: 'example', component: 'Greeting' }
        ]
      },
      {
        title: "Importing and Exporting Components",
        id: "fundamentals-import-export",
        content: [
          { type: 'paragraph', text: 'To use components across different files, you need to `export` them from one file and `import` them into another.' },
          { type: 'paragraph', text: '<strong>Exporting:</strong>' },
          { type: 'code', language: 'jsx', code: `// In MyComponent.js
export default function MyComponent() {
  return <p>This is my component.</p>;
}`},
          { type: 'paragraph', text: '<strong>Importing:</strong>' },
          { type: 'code', language: 'jsx', code: `// In another file, e.g., App.js
import MyComponent from './MyComponent';

function App() {
  return <MyComponent />;
}`}
        ]
      },
      {
        title: "Writing Markup with JSX",
        id: "fundamentals-jsx",
        content: [
          { type: 'paragraph', text: 'JSX (JavaScript XML) is a syntax extension for JavaScript. It looks a lot like HTML, but it allows you to write React elements directly within your JavaScript code.' },
          { type: 'code', language: 'jsx', code: `const element = <h1>Hello, JSX!</h1>;`},
          { type: 'example', component: 'SimpleJSXDisplay' } // This will be handled by a wrapper component
        ]
      },
      {
        title: "JavaScript in JSX with Curly Braces",
        id: "fundamentals-js-in-jsx",
        content: [
          { type: 'paragraph', text: 'You can embed JavaScript expressions directly into your JSX markup using curly braces `{` `}`. This allows you to display dynamic content, perform calculations, or call functions.' },
          { type: 'code', language: 'jsx', code: `const name = "Student";
const number = 10;
const doubledNumber = number * 2;

return (
  <p>Hello, {name}! Ten doubled is {doubledNumber}.</p>
);`},
          { type: 'example', component: 'DynamicJSXDisplay' } // This will be handled by a wrapper component
        ]
      },
      {
        title: "Passing Props to a Component",
        id: "fundamentals-passing-props",
        content: [
          { type: 'paragraph', text: '<strong>Props</strong> (short for "properties") are how you pass data from a parent component to a child component. They are read-only.' },
          { type: 'code', language: 'jsx', code: `function Welcome(props) {
  return <p>Welcome, {props.name}!</p>;
}

// Usage: <Welcome name="Class" />`},
          { type: 'example', component: 'WelcomePropsExample' }
        ]
      },
      {
        title: "Conditional Rendering",
        id: "fundamentals-conditional-rendering",
        content: [
          { type: 'paragraph', text: 'You can render different elements or components based on certain conditions using JavaScript logic (e.g., `if` statements, ternary operators, logical `&&`).' },
          { type: 'code', language: 'jsx', code: `const isLoggedIn = true; // or false

{isLoggedIn ? (
  <p>Welcome back!</p>
) : (
  <p>Please log in.</p>
)}

{isLoggedIn && <button>Logout</button>}
`},
          { type: 'example', component: 'ConditionalRenderingExample' }
        ]
      },
      {
        title: "Rendering Lists",
        id: "fundamentals-rendering-lists",
        content: [
          { type: 'paragraph', text: 'To display a list of items, you typically use the JavaScript `map()` array method to transform an array of data into an array of React elements. Remember to provide a unique `key` prop for each list item.' },
          { type: 'code', language: 'jsx', code: `const students = [
  { id: 1, name: 'Alice', grade: 'A' },
  { id: 2, name: 'Bob', grade: 'B' },
];

return (
  <ul>
    {students.map((student, index) => (
      <li key={index}>
        {student.name} - Grade: {student.grade}
      </li>
    ))}
  </ul>
);`},
          { type: 'example', component: 'StudentListExample' }
        ]
      },
      {
        title: "Keeping Components Pure",
        id: "fundamentals-pure-components",
        content: [
          { type: 'paragraph', text: 'In React, it\'s a best practice to keep your components "pure". A pure function (or component) has two main characteristics:' },
          { type: 'list', items: [
            '<strong>It always returns the same output for the same inputs (props and state).</strong>',
            '<strong>It doesn\'t cause any side effects</strong> (like modifying variables outside its scope, making network requests, or changing the DOM directly) during rendering. Side effects should be handled in `useEffect`.'
          ]},
          { type: 'paragraph', text: 'This makes components predictable and easier to test and debug.' }
        ]
      },
      {
        title: "Your UI as a Tree",
        id: "fundamentals-ui-tree",
        content: [
          { type: 'paragraph', text: 'Think of your React application\'s user interface as a tree structure. Each component is a node in this tree.' },
          { type: 'code', language: 'text', code: `App
├── Header
│   ├── Logo
│   └── Navigation
│       ├── NavItem (Home)
│       └── NavItem (About)
├── MainContent
│   ├── ProductList
│   │   ├── ProductCard (Item 1)
│   │   └── ProductCard (Item 2)
│   └── Sidebar
└── Footer`},
          { type: 'paragraph', text: 'Data typically flows down the tree from parent components to child components via props. This hierarchical structure helps organize your UI and manage complexity.' }
        ]
      },
    ]
  },
  'state-events': {
    title: "React State & Events for Students",
    sections: [
      {
        title: "Responding to Events",
        id: "state-events-responding-to-events",
        content: [
          { type: 'paragraph', text: 'React components respond to events using event handlers, which are functions you write that get called when an event (like a click or a key press) happens. Event handlers are typically defined as functions within your component and passed as props to JSX elements.' },
          { type: 'code', language: 'jsx', code: `function MyButton() {
  function handleClick() {
    console.log('Button clicked!');
  }
  return (
    <button onClick={handleClick}>
      Click Me
    </button>
  );
}`},
          { type: 'example', component: 'EventHandlingExample' }
        ]
      },
      {
        title: "State: A Component’s Memory",
        id: "state-events-state-memory",
        content: [
          { type: 'paragraph', text: '<strong>State</strong> is a special type of data that a component can "remember" and manage over time. When state changes, React automatically re-renders the component to reflect the new data. You use the `useState` Hook to add state to your functional components.' },
          { type: 'code', language: 'jsx', code: `import React, { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0); // count is the state, setCount is the setter

  function increment() {
    setCount(count + 1);
  }

  return (
    <button onClick={increment}>
      Count: {count}
    </button>
  );
}`},
          { type: 'example', component: 'CounterExample' }
        ]
      },
      {
        title: "Render and Commit",
        id: "state-events-render-commit",
        content: [
          { type: 'paragraph', text: 'When a component\'s state or props change, React goes through two phases:' },
          { type: 'list', items: [
            '<strong>Render:</strong> React calls your component function. It calculates what changes need to be made to the DOM.',
            '<strong>Commit:</strong> React applies those changes to the actual DOM, updating the browser\'s display.'
          ]},
          { type: 'paragraph', text: 'This process ensures that your UI is always up-to-date with your component\'s state.' }
        ]
      },
      {
        title: "State as a Snapshot",
        id: "state-events-state-snapshot",
        content: [
          { type: 'paragraph', text: 'When you update state, the state variable inside your component\'s render function is a "snapshot" of the state at the time of that render. It doesn\'t change until the next render.' },
          { type: 'paragraph', text: 'This means if you schedule an update and then try to use the state variable immediately after, you\'ll still be using the *old* snapshot value.' },
          { type: 'code', language: 'jsx', code: `const [message, setMessage] = useState('Hello');

function handleClick() {
  setMessage('New Message');
  // At this point, 'message' is still 'Hello' in this render's scope
  setTimeout(() => {
    console.log(message); // Will log 'Hello' after 3 seconds
  }, 3000);
}`},
          { type: 'example', component: 'StateSnapshotExample' }
        ]
      },
      {
        title: "Queueing a Series of State Updates",
        id: "state-events-queueing-updates",
        content: [
          { type: 'paragraph', text: 'When you call a state setter multiple times within the same event handler, React batches these updates for performance. If you need to update state based on its previous value, use an "updater function" with the setter.' },
          { type: 'code', language: 'jsx', code: `const [count, setCount] = useState(0);

function handleClick() {
  setCount(count + 1); // Uses snapshot of count (e.g., 0)
  setCount(prevCount => prevCount + 1); // Uses previous state (e.g., 0 + 1 = 1)
  setCount(count + 1); // Uses snapshot of count again (e.g., 0)
  // Result: count becomes 1 (from 0 + 1)
}`},
          { type: 'example', component: 'QueueingUpdatesExample' }
        ]
      },
      {
        title: "Updating Objects in State",
        id: "state-events-updating-objects",
        content: [
          { type: 'paragraph', text: 'State variables are immutable. To update an object in state, you must create a *new* object with the desired changes, rather than directly modifying the existing one. The spread syntax (`...`) is commonly used for this.' },
          { type: 'code', language: 'jsx', code: `const [user, setUser] = useState({ name: 'Jane Doe', age: 30 });

function updateName() {
  setUser({
    ...user, // Copy existing properties
    name: 'John Doe' // Override name
  });
}`},
          { type: 'example', component: 'UpdatingObjectsExample' }
        ]
      },
      {
        title: "Updating Arrays in State",
        id: "state-events-updating-arrays",
        content: [
          { type: 'paragraph', text: 'Similar to objects, arrays in state should be treated as immutable. To update an array, you create a *new* array with the changes (e.g., using `map`, `filter`, `slice`, or the spread syntax `...`).' },
          { type: 'code', language: 'jsx', code: `const [items, setItems] = useState(['A', 'B']);

function addItem() {
  setItems([...items, 'C']); // Add new item
}

function removeItem() {
  setItems(items.filter(item => item !== 'A')); // Remove an item
}`},
          { type: 'example', component: 'UpdatingArraysExample' }
        ]
      },
    ]
  },
  'advanced-state': {
    title: "React Advanced State Management for Students",
    sections: [
      {
        title: "Reacting to Input with State",
        id: "advanced-state-reacting-to-input",
        content: [
          { type: 'paragraph', text: 'To make an input field interactive, you connect its `value` to a state variable and its `onChange` event to a state setter. This creates a "controlled component".' },
          { type: 'code', language: 'jsx', code: `const [inputValue, setInputValue] = useState('');

<input
  type="text"
  value={inputValue}
  onChange={e => setInputValue(e.target.value)}
/>
<p>You typed: {inputValue}</p>`},
          { type: 'example', component: 'ControlledInputExample' }
        ]
      },
      {
        title: "Choosing the State Structure",
        id: "advanced-state-choosing-state-structure",
        content: [
          { type: 'paragraph', text: 'How you structure your state can significantly impact your component\'s complexity and performance.' },
          { type: 'list', items: [
            '<strong>Group related state:</strong> If two state variables always change together, consider combining them into an object.',
            '<strong>Avoid deeply nested objects:</strong> Flat state structures are generally easier to update. If you have deeply nested objects, you\'ll need to copy all levels when updating.',
            '<strong>Avoid redundancy:</strong> Don\'t duplicate state if it can be derived from existing state or props.'
          ]},
          { type: 'code', language: 'jsx', code: `const [userProfile, setUserProfile] = useState({
  firstName: 'Alice',
  lastName: 'Smith',
  address: { street: '123 Main St', city: 'Anytown' }
});

// To update city:
setUserProfile(prevProfile => ({
  ...prevProfile,
  address: {
    ...prevProfile.address,
    city: 'New City'
  }
}));`},
          { type: 'example', component: 'StateStructureExample' }
        ]
      },
      {
        title: "Sharing State Between Components (Lifting State Up)",
        id: "advanced-state-sharing-state",
        content: [
          { type: 'paragraph', text: 'When two or more components need to share the same state, the state should be "lifted up" to their closest common ancestor. The parent component then manages the state and passes it down to the children via props.' },
          { type: 'code', language: 'jsx', code: `function Parent() {
  const [value, setValue] = useState(0);
  return (
    <div>
      <ChildA value={value} />
      <ChildB onIncrement={() => setValue(value + 1)} />
    </div>
  );
}`},
          { type: 'example', component: 'ParentComponentForSharingState' }
        ]
      },
      {
        title: "Preserving and Resetting State with the `key` Prop",
        id: "advanced-state-preserving-resetting-state",
        content: [
          { type: 'paragraph', text: 'By default, React preserves the state of a component when it\'s re-rendered at the same position in the component tree. However, you can force a component to reset its state by giving it a different `key` prop. This is useful when you want a component to completely remount and start fresh.' },
          { type: 'paragraph', text: 'Click "Toggle Counter" to hide/show the counter (preserving its state). Click "Reset Counter" to force it to remount with a new `key`, resetting its internal count to 0.' },
          { type: 'example', component: 'ResettingStateExample' }
        ]
      },
      {
        title: "Extracting State Logic into a Reducer (`useReducer`)",
        id: "advanced-state-use-reducer",
        content: [
          { type: 'paragraph', text: 'For more complex state logic, especially when state updates depend on the previous state or involve multiple related actions, `useReducer` can be a cleaner alternative to `useState`. It centralizes state update logic in a "reducer" function.' },
          { type: 'code', language: 'jsx', code: `function reducer(state, action) {
  switch (action.type) {
    case 'increment': return state + 1;
    case 'decrement': return state - 1;
    case 'reset': return 0;
    default: throw new Error();
  }
}

function MyComponent() {
  const [count, dispatch] = useReducer(reducer, 0);
  return (
    <>
      <button onClick={() => dispatch({ type: 'decrement' })}>-</button>
      <span>{count}</span>
      <button onClick={() => dispatch({ type: 'increment' })}>+</button>
      <button onClick={() => dispatch({ type: 'reset' })}>Reset</button>
    </>
  );
}`},
          { type: 'example', component: 'UseReducerExample' }
        ]
      },
      {
        title: "Passing Data Deeply with Context (`useContext`)",
        id: "advanced-state-use-context",
        content: [
          { type: 'paragraph', text: '<strong>Context</strong> provides a way to pass data through the component tree without having to pass props down manually at every level (known as "prop drilling"). It\'s ideal for "global" data like themes, user authentication status, or preferred language.' },
          { type: 'code', language: 'jsx', code: `const ThemeContext = createContext(null);

function App() {
  const [theme, setTheme] = useState('light');
  return (
    <ThemeContext.Provider value={theme}>
      <Toolbar />
    </ThemeContext.Provider>
  );
}

function Toolbar() {
  const theme = useContext(ThemeContext);
  return <div className={\`toolbar-\${theme}\`}>...</div>;
}`},
          { type: 'example', component: 'UseContextExample' }
        ]
      },
      {
        title: "Scaling Up with Reducer and Context",
        id: "advanced-state-scaling-up-reducer-context",
        content: [
          { type: 'paragraph', text: 'For large applications with complex global state, `useReducer` and `useContext` are often combined. The reducer manages the state logic, and context makes that state and its dispatch function available to any component in the tree without prop drilling. This is a common pattern for building custom state management solutions.' },
          { type: 'code', language: 'jsx', code: `// TodoContext.js
const TodoContext = createContext(null);
const TodoDispatchContext = createContext(null);

// In App.js
function App() {
  const [todos, dispatch] = useReducer(todosReducer, []);
  return (
    <TodoContext.Provider value={todos}>
      <TodoDispatchContext.Provider value={dispatch}>
        <TodoList />
        <AddTodo />
      </TodoDispatchContext.Provider>
    </TodoContext.Provider>
  );
}

// In TodoItem.js
function TodoItem({ todo }) {
  const dispatch = useContext(TodoDispatchContext);
  // ... use dispatch to toggle/remove todo
}`},
          { type: 'example', component: 'TodoAppExample' }
        ]
      },
    ]
  },
  effects: {
    title: "Understanding React `useEffect` for Students",
    sections: [
      {
        title: "Overview: What are Effects and how are they different from events?",
        id: "overview-effects-events",
        content: [
          { type: 'paragraph', text: 'In React, <strong>Effects</strong> are a way to synchronize your component with some system outside of React. This includes things like fetching data, subscribing to external events, manually changing the DOM, or setting up timers. They run <em>after</em> React has updated the DOM.' },
          { type: 'paragraph', text: '<strong>Events</strong>, on the other hand, are direct responses to user interactions, like clicking a button, typing into an input field, or hovering over an element. Event handlers run <em>during</em> the interaction.' },
          { type: 'paragraph', text: 'Click the button below and observe the console logs to see the difference between an event and an effect reacting to state changes.' },
          { type: 'example', component: 'EffectsVsEventsExample' }
        ]
      },
      {
        title: "You Might Not Need an Effect",
        id: "you-might-not-need-effect-effects",
        content: [
          { type: 'paragraph', text: 'Before reaching for `useEffect`, consider if your logic can be handled directly during rendering or by an event handler.' },
          { type: 'list', items: [
            '<strong>Transforming data for rendering:</strong> If you\'re just calculating values based on props or state to display them, do it directly in your JSX. <div class="ml-4 text-gray-600"><p><em>Example:</em> Instead of</p><pre class="bg-gray-100 p-1 rounded text-sm my-1 overflow-auto"><code>useEffect(() => { setDoubledCount(count * 2); }, [count]);</code></pre><p> , just use </p><pre class="bg-gray-100 p-1 rounded text-sm my-1 overflow-auto"><code>{count * 2}</code></pre><p> in your render.</p></div>',
            '<strong>Handling user input:</strong> Use event handlers (`onClick`, `onChange`, etc.) for direct responses to user actions.'
          ]}
        ]
      },
      {
        title: "How to Write an Effect",
        id: "how-to-write-effect",
        content: [
          { type: 'heading', level: 3, text: 'Step 1: Declare an Effect' },
          { type: 'paragraph', text: 'You declare an effect by calling the `useEffect` Hook at the top level of your component. It takes a function as its first argument, which contains the side-effect logic.' },
          { type: 'code', language: 'jsx', code: `useEffect(() => {
  console.log('Effect Declared: Count changed to', count);
  document.title = \`Count: \${count}\`;
}, [count]);`},
          { type: 'heading', level: 3, text: 'Step 2: Specify the Effect dependencies' },
          { type: 'paragraph', text: 'The second argument to `useEffect` is an array called the "dependency array".' },
          { type: 'list', items: [
            '<strong>Empty array (`[]`):</strong> The effect runs only once after the initial render and cleans up on unmount. Useful for one-time setups.',
            '<strong>No array:</strong> The effect runs after <em>every</em> render. Generally discouraged as it can lead to infinite loops or performance issues.',
            '<strong>Array with values (`[count, someOtherState]`):</strong> The effect runs after the initial render and whenever any of the values in the dependency array change.'
          ]},
          { type: 'paragraph', text: 'Observe the console logs for "Effect with empty dependency array" (runs once) and "Effect with dependencies" (runs with count changes).' },
          { type: 'heading', level: 3, text: 'Step 3: Add cleanup if needed' },
          { type: 'paragraph', text: 'Some effects need a "cleanup" step. For example, if an effect subscribes to an external data source, it needs to unsubscribe when the component unmounts or before the effect re-runs. You do this by returning a function from your effect.' },
          { type: 'code', language: 'jsx', code: `useEffect(() => {
  const timer = setTimeout(() => { /* ... */ }, 2000);
  return () => {
    clearTimeout(timer); // Cleanup function
    console.log('Cleanup: Timer cleared.');
  };
}, [count]);`},
          { type: 'paragraph', text: 'Watch the console for "Cleanup: Timer cleared." when the count changes or the component unmounts.' }
        ]
      },
      {
        title: "How to handle the Effect firing twice in development?",
        id: "effect-firing-twice",
        content: [
          { type: 'paragraph', text: 'In React\'s Strict Mode (which is active by default in development builds), effects are intentionally run twice on mount: once to simulate mounting, and then immediately run the cleanup and remount the effect.' },
          { type: 'paragraph', text: 'This helps you find common bugs by ensuring your effects\' cleanup logic is correct and that your effects are "idempotent" (meaning running them multiple times produces the same result as running them once). You\'ll see "Strict Mode Check" and "Strict Mode Cleanup" messages in the console.' }
        ]
      },
      {
        title: "Common Use Cases for `useEffect`",
        id: "common-use-cases-effects",
        content: [
          { type: 'heading', level: 3, text: 'Controlling non-React widgets' },
          { type: 'paragraph', text: 'Use `useEffect` to integrate with external libraries that directly manipulate the DOM (e.g., D3.js charts, map libraries, video players).<br /><span class="text-gray-600"><em>Check the console for "Non-React Widget" messages.</em></span>' },
          { type: 'heading', level: 3, text: 'Subscribing to events' },
          { type: 'paragraph', text: 'Effects are perfect for subscribing to global events (like window resize, keyboard events) and ensuring you unsubscribe on cleanup.<br /><span class="text-gray-600"><em>Resize your browser window and observe the console for "Window resized" messages.</em></span>' },
          { type: 'heading', level: 3, text: 'Triggering animations' },
          { type: 'paragraph', text: 'You can use effects to trigger or manage animations, especially those that are not purely CSS-based or need to react to state changes.' },
          { type: 'example', component: 'AnimationTriggerExample' },
          { type: 'heading', level: 3, text: 'Fetching data' },
          { type: 'paragraph', text: 'One of the most common use cases: fetching data from an API when a component mounts or when specific dependencies change.<br /><span class="text-gray-600"><em>Check the console for "Fetching Data" messages. Data will re-fetch when count changes.</em></span>' },
          { type: 'example', component: 'DataFetchingExample' },
          { type: 'heading', level: 3, text: 'Sending analytics' },
          { type: 'paragraph', text: 'Use `useEffect` to send analytics events (e.g., "page viewed" or "component mounted") when a component renders. Ensure it runs only once.<br /><span class="text-gray-600"><em>Check the console for "Sending Analytics" message (should appear only once on initial load).</em></span>' },
        ]
      },
    ]
  },
  'advanced-concepts': {
    title: "React Advanced Concepts for Students",
    sections: [
      {
        title: "Referencing Values with Refs (`useRef`)",
        id: "advanced-concepts-use-ref-values",
        content: [
          { type: 'paragraph', text: 'The `useRef` Hook allows you to keep a mutable value that persists across renders, but unlike state, changing it does *not* trigger a re-render. It\'s commonly used for storing DOM elements or any value that needs to be updated without causing the component to re-render.' },
          { type: 'code', language: 'jsx', code: `const latestCountRef = useRef(0);
const [currentCount, setCurrentCount] = useState(0);

useEffect(() => {
  latestCountRef.current = currentCount; // Update ref value
});

// Later, in an event handler or effect:
// console.log(latestCountRef.current); // Access the latest value`},
          { type: 'example', component: 'UseRefValueExample' }
        ]
      },
      {
        title: "Manipulating the DOM with Refs",
        id: "advanced-concepts-dom-with-refs",
        content: [
          { type: 'paragraph', text: 'While React encourages declarative rendering, sometimes you need to directly interact with the underlying DOM elements (e.g., focusing an input, playing media, measuring element size). `useRef` can be attached to a JSX element to get a direct reference to its DOM node.' },
          { type: 'code', language: 'jsx', code: `const inputRef = useRef(null);

<input ref={inputRef} type="text" />
<button onClick={() => inputRef.current.focus()}>Focus Input</button>`},
          { type: 'example', component: 'UseRefDOMExample' }
        ]
      },
      {
        title: "Synchronizing with Effects",
        id: "advanced-concepts-synchronizing-effects",
        content: [
          { type: 'paragraph', text: 'Effects are primarily for synchronizing your component with external systems or performing side effects that don\'t directly relate to rendering. A classic example is setting up a timer or subscription.' },
          { type: 'code', language: 'jsx', code: `const [seconds, setSeconds] = useState(0);
const intervalRef = useRef(null);

useEffect(() => {
  intervalRef.current = setInterval(() => {
    setSeconds(prevSeconds => prevSeconds + 1);
  }, 1000);

  return () => {
      clearInterval(intervalRef.current);
      console.log('Synchronizing Effect: Interval cleared on unmount/re-render.');
    };
}, []); // Runs once on mount, cleans up on unmount`},
          { type: 'example', component: 'SynchronizingEffectsExample' }
        ]
      },
      {
        title: "You Might Not Need An Effect (Revisited)",
        id: "advanced-concepts-you-might-not-need-effect-revisited",
        content: [
          { type: 'paragraph', text: 'It\'s crucial to understand when *not* to use `useEffect`. Avoid it for:' },
          { type: 'list', items: [
            '<strong>Transforming data for rendering:</strong> Compute values directly in your JSX. <div class="ml-4 text-gray-600"><p><em>Example:</em> Instead of <pre class="inline bg-gray-100 p-1 rounded text-sm mx-1"><code>useEffect(() => { setFullName(`${firstName} ${lastName}`); }, [firstName, lastName]);</code></pre>, directly use <pre class="inline bg-gray-100 p-1 rounded text-sm mx-1"><code>{fullName}</code></pre> in your render.</p></div>',
            '<strong>Handling user input:</strong> Use event handlers (`onClick`, `onChange`, etc.) for direct responses to user actions.'
          ]},
          { type: 'example', component: 'NoEffectExample' }
        ]
      },
      {
        title: "Lifecycle of Reactive Effects",
        id: "advanced-concepts-lifecycle-effects",
        content: [
          { type: 'paragraph', text: '`useEffect` runs after every render where its dependencies have changed. It has a clear lifecycle:' },
          { type: 'list', items: [
            '<strong>Mount:</strong> The effect function runs after the initial render.',
            '<strong>Update:</strong> If dependencies change, the cleanup function from the *previous* render runs, then the effect function runs again for the *current* render.',
            '<strong>Unmount:</strong> The cleanup function runs just before the component is removed from the DOM.'
          ]},
          { type: 'paragraph', text: 'Observe the console logs as you change the value below to see the effect lifecycle.' },
          { type: 'example', component: 'LifecycleEffectsExample' }
        ]
      },
      {
        title: "Separating Events from Effects",
        id: "advanced-concepts-separating-events-effects",
        content: [
          { type: 'paragraph', text: 'Logic that responds directly to user input should typically be in event handlers. Logic that synchronizes with external systems or performs side effects *after* render belongs in `useEffect`. Sometimes, you might use a ref to bridge the gap if an effect needs the *latest* value of something that an event handler updates.' },
          { type: 'code', language: 'jsx', code: `const [clicks, setClicks] = useState(0);
const clickCountRef = useRef(0);

const handleEventClick = () => {
  setClicks(prev => prev + 1);
  clickCountRef.current++; // Update ref immediately
};

useEffect(() => {
  // This effect reacts to 'clicks' state, but can use 'clickCountRef.current'
  // for the most up-to-date value if needed for a delayed action.
  console.log(\`Effect: Processed clicks: \${clicks}\`);
}, [clicks]);`},
          { type: 'example', component: 'SeparatingEventsEffectsExample' }
        ]
      },
      {
        title: "Removing Effect Dependencies",
        id: "advanced-concepts-removing-dependencies",
        content: [
          { type: 'paragraph', text: 'Sometimes, an effect might have too many dependencies, causing it to re-run more often than necessary. You can often "remove" dependencies by:' },
          { type: 'list', items: [
            '<strong>Moving logic inside the effect:</strong> If a function or variable is only used inside the effect, define it there.',
            '<strong>Using `useCallback` or `useMemo`:</strong> To stabilize function or object references that are dependencies.',
            '<strong>Using a ref:</strong> If you need the *latest* value of a variable in an effect without making the effect re-run when that variable changes.'
          ]},
          { type: 'example', component: 'RemovingDependenciesExample' }
        ]
      },
      {
        title: "Reusing Logic with Custom Hooks",
        id: "advanced-concepts-custom-hooks",
        content: [
          { type: 'paragraph', text: 'Custom Hooks are JavaScript functions whose names start with `use` and that can call other Hooks. They allow you to extract and reuse stateful logic (like managing state, effects, or refs) across different components without duplicating code.' },
          { type: 'code', language: 'jsx', code: `function useToggle(initialValue = false) {
  const [value, setValue] = useState(initialValue);
  const toggle = useCallback(() => setValue(prev => !prev), []);
  return [value, toggle];
}

// Usage in a component:
function MyComponent() {
  const [isActive, toggleActive] = useToggle(false);
  return (
    <div>
      <p>Feature is: {isActive ? 'Enabled' : 'Disabled'}</p>
      <button onClick={toggleActive}>Toggle Feature</button>
    </div>
  );
}`},
          { type: 'example', component: 'CustomHookExample' }
        ]
      },
    ]
  },
  'project-examples': {
    title: "Project Code Examples",
    sections: [
      {
        title: "Simple Controlled Form with Basic Validation",
        id: "project-example-controlled-form",
        content: [
          { type: 'paragraph', text: 'A controlled component in React is an input form element whose value is controlled by React state.' },
          { type: 'code', language: 'jsx', code: `function MyForm() {
  const [inputValue, setInputValue] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputValue.trim()) {
      setSubmitted(true);
      console.log('Form submitted:', inputValue);
    } else {
      // In a real app, use a custom modal or inline error message
      console.log('Validation: Please enter something!');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="text"
        value={inputValue}
        onChange={(e) => {
          setInputValue(e.target.value);
          setSubmitted(false); // Reset submitted state on change
        }}
        placeholder="Enter text..."
        className="border p-2 rounded-md w-full"
      />
      <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600">
        Submit
      </button>
      {submitted && <p className="text-green-600">Submitted: {inputValue}</p>}
    </form>
  );
}`},
          { type: 'example', component: 'ControlledFormExample' }
        ]
      },
      {
        title: "Reusable Modal Component",
        id: "project-example-modal",
        content: [
          { type: 'paragraph', text: 'A basic modal component that can be toggled open/closed. Useful for alerts, confirmations, or displaying detailed content.' },
          { type: 'code', language: 'jsx', code: `const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-xl font-bold"
        >
          &times;
        </button>
        {children}
      </div>
    </div>
  );
}`},
          { type: 'example', component: 'ModalExample' }
        ]
      },
      {
        title: "Simulated Data Fetching with Loading/Error States",
        id: "project-example-data-fetching",
        content: [
          { type: 'paragraph', text: 'A common pattern for fetching data, showing loading indicators, and handling errors.' },
          { type: 'code', language: 'jsx', code: `function DataFetcher() {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    setData(null);
    try {
      const response = await new Promise((resolve, reject) => {
        setTimeout(() => {
          if (Math.random() > 0.3) { // Simulate success 70% of the time
            resolve({ id: 1, name: 'Fetched Item', value: Math.random().toFixed(2) });
          } else {
            reject(new Error('Failed to fetch data.'));
          }
        }, 1500);
      });
      setData(response);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <button onClick={fetchData} disabled={isLoading} className="bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600">
        {isLoading ? 'Loading...' : 'Fetch Data'}
      </button>
      {error && <p className="text-red-500 mt-2">Error: {error}</p>}
      {data && (
        <div className="bg-blue-50 p-3 rounded-md mt-2">
          <p>ID: {data.id}</p>
          <p>Name: {data.name}</p>
          <p>Value: {data.value}</p>
        </div>
      )}
    </div>
  );
}`},
          { type: 'example', component: 'DataFetchingLiveExample' }
        ]
      },
      {
        title: "Simple Tabbed Interface",
        id: "project-example-tabs",
        content: [
          { type: 'paragraph', text: 'A common UI pattern to organize content into distinct sections.' },
          { type: 'code', language: 'jsx', code: `function Tabs() {
  const [activeTab, setActiveTab] = useState('tab1');

  return (
    <div>
      <div className="flex border-b">
        <button
          className={\`py-2 px-4 \${activeTab === 'tab1' ? 'border-b-2 border-blue-500' : ''}\`}
          onClick={() => setActiveTab('tab1')}
        >
          Tab 1
        </button>
        <button
          className={\`py-2 px-4 \${activeTab === 'tab2' ? 'border-b-2 border-blue-500' : ''}\`}
          onClick={() => setActiveTab('tab2')}
        >
          Tab 2
        </button>
      </div>
      <div className="p-4 border rounded-b-md">
        {activeTab === 'tab1' && <div>Content for Tab 1</div>}
        {activeTab === 'tab2' && <div>Content for Tab 2</div>}
      </div>
    </div>
  );
}`},
          { type: 'example', component: 'TabbedInterfaceExample' }
        ]
      },
      {
        title: "Counter with `useReducer`",
        id: "project-example-use-reducer",
        content: [
          { type: 'paragraph', text: 'Demonstrates using `useReducer` for more complex state logic than `useState`.' },
          { type: 'code', language: 'jsx', code: `const initialCounterState = { count: 0 };

function counterReducer(state, action) {
  switch (action.type) {
    case 'increment':
      return { count: state.count + 1 };
    case 'decrement':
      return { count: state.count - 1 };
    case 'reset':
      return { count: 0 };
    default:
      throw new Error();
    }
  }

function CounterWithReducer() {
  const [state, dispatch] = useReducer(counterReducer, initialCounterState);

  return (
    <div className="flex items-center space-x-2">
      <button onClick={() => dispatch({ type: 'decrement' })}>-</button>
      <span>Count: {state.count}</span>
      <button onClick={() => dispatch({ type: 'increment' })}>+</button>
      <button onClick={() => dispatch({ type: 'reset' })}>Reset</button>
    </div>
  );
}`},
          { type: 'example', component: 'CounterWithReducerExample' }
        ]
      },
      {
        title: "Custom Hook Example (`useToggle`)",
        id: "project-example-custom-hook",
        content: [
          { type: 'paragraph', text: 'Reusing stateful logic across components using a custom Hook. The `useToggle` hook is defined at the top of the file.' },
          { type: 'code', language: 'jsx', code: `// Defined at the top level of the file:
function useToggle(initialValue = false) {
  const [value, setValue] = useState(initialValue);
  const toggle = useCallback(() => setValue(prev => !prev), []);
  return [value, toggle];
}

// Usage in a component:
function MyComponent() {
  const [isActive, toggleActive] = useToggle(false);
  return (
    <div>
      <p>Feature is: {isActive ? 'Enabled' : 'Disabled'}</p>
      <button onClick={toggleActive}>Toggle Feature</button>
    </div>
  );
}`},
          { type: 'example', component: 'CustomHookUsageExample' }
        ]
      },
      {
        title: "Debounced Search Input",
        id: "project-example-debounced-input",
        content: [
          { type: 'paragraph', text: 'This example demonstrates how to implement a "debounce" effect for an input field. This is useful for search bars or any input that triggers an expensive operation (like an API call) to prevent it from firing too frequently as the user types.' },
          { type: 'code', language: 'jsx', code: `function DebouncedSearchInput() {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');

  // Effect to debounce the search term
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500); // 500ms debounce delay

    // Cleanup function: clear the timeout if searchTerm changes before the delay
    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm]); // Only re-run if searchTerm changes

  // Effect to simulate API call with the debounced search term
  useEffect(() => {
    if (debouncedSearchTerm) {
      console.log(\`Simulating API call for: "\${debouncedSearchTerm}"\`);
      // In a real application, you'd make a fetch call here
      // e.g., fetch(\`/api/search?q=\${debouncedSearchTerm}\`).then(...)
    }
  }, [debouncedSearchTerm]);

  return (
    <div>
      <input
        type="text"
        placeholder="Type to search..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="border p-2 rounded-md w-full"
      />
      <p className="mt-2 text-sm text-gray-600">
        Current Input: <strong>{searchTerm}</strong>
      </p>
      <p className="text-sm text-gray-600">
        Debounced Search Term (API call triggered for): <strong>{debouncedSearchTerm}</strong>
      </p>
    </div>
  );
}`},
          { type: 'example', component: 'DebouncedSearchInputExample' }
        ]
      },
      {
        title: "Dark Mode Toggle",
        id: "project-example-dark-mode",
        content: [
          { type: 'paragraph', text: 'A simple implementation of a dark mode toggle using React state and `useEffect` to manipulate the `documentElement` class, which can then be styled using Tailwind CSS\'s `dark:` prefix.' },
          { type: 'code', language: 'jsx', code: `function DarkModeToggle() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  return (
    <div className="flex items-center space-x-2">
      <label htmlFor="dark-mode-toggle" className="text-gray-800 dark:text-gray-200">
        Dark Mode:
      </label>
      <input
        type="checkbox"
        id="dark-mode-toggle"
        checked={isDarkMode}
        onChange={() => setIsDarkMode(!isDarkMode)}
        className="form-checkbox h-5 w-5 text-indigo-600 rounded"
      />
    </div>
  );
}`},
          { type: 'example', component: 'DarkModeToggleExample' }
        ]
      },
      {
        title: "Controlled Checkbox List",
        id: "project-example-checkbox-list",
        content: [
          { type: 'paragraph', text: 'Managing multiple checkbox selections and storing them in an array state.' },
          { type: 'code', language: 'jsx', code: `function CheckboxList() {
  const allItems = [
    { id: 'item1', label: 'Option A' },
    { id: 'item2', label: 'Option B' },
    { id: 'item3', label: 'Option C' },
  ];
  const [selectedItems, setSelectedItems] = useState([]);

  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setSelectedItems(prev => [...prev, value]);
    } else {
      setSelectedItems(prev => prev.filter(item => item !== value));
    }
  };

  return (
    <div>
      {allItems.map(item => (
        <label key={item.id} className="flex items-center space-x-2 mb-2">
          <input
            type="checkbox"
            value={item.id}
            checked={selectedItems.includes(item.id)}
            onChange={handleCheckboxChange}
            className="form-checkbox h-4 w-4 text-blue-600 rounded"
          />
          <span>{item.label}</span>
        </label>
      ))}
      <p className="mt-4">Selected: {selectedItems.join(', ') || 'None'}</p>
    </div>
  );
}`},
          { type: 'example', component: 'CheckboxListExample' }
        ]
      },
      {
        title: "Accordion/Collapsible Content",
        id: "project-example-accordion",
        content: [
          { type: 'paragraph', text: 'A common UI component to hide and show content, saving vertical space.' },
          { type: 'code', language: 'jsx', code: `function Accordion() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border border-gray-300 rounded-md">
      <button
        className="flex justify-between items-center w-full p-4 bg-gray-100 hover:bg-gray-200 font-semibold rounded-t-md focus:outline-none"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>Click to Toggle Content</span>
        <span>{isOpen ? '▲' : '▼'}</span>
      </button>
      {isOpen && (
        <div className="p-4 border-t border-gray-300 bg-white rounded-b-md">
          <p>This is the hidden content inside the accordion.</p>
          <p>It will expand and collapse smoothly.</p>
        </div>
      )}
    </div>
  );
}`},
          { type: 'example', component: 'AccordionExample' }
        ]
      },
      {
        title: "Star Rating Component",
        id: "project-example-star-rating",
        content: [
          { type: 'paragraph', text: 'An interactive star rating component allowing users to select a rating from 1 to 5 stars.' },
          { type: 'code', language: 'jsx', code: `function StarRating() {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);

  const Star = ({ selected, onSelect, onHover, onLeave, starId }) => (
    <span
      className={\`text-3xl cursor-pointer \${selected ? 'text-yellow-400' : 'text-gray-300'}\`}
      onClick={() => onSelect(starId)}
      onMouseEnter={() => onHover(starId)}
      onMouseLeave={onLeave}
    >
      ★
    </span>
  );

  return (
    <div className="flex">
      {[1, 2, 3, 4, 5].map((starId) => (
        <Star
          key={starId}
          starId={starId}
          selected={starId <= (hoverRating || rating)}
          onSelect={setRating}
          onHover={setHoverRating}
          onLeave={() => setHoverRating(0)}
        />
      ))}
      <p className="ml-4 text-lg">Rating: {rating} / 5</p>
    </div>
  );
}`},
          { type: 'example', component: 'StarRatingExample' }
        ]
      },
    ]
  },
  'node-js-concepts': {
    title: "Node.js Concepts",
    sections: [
      {
        title: "Coming Soon!",
        id: "node-js-coming-soon",
        content: [
          { type: 'paragraph', text: 'This section will cover various Node.js concepts, including:' },
          { type: 'list', items: [
            'Event Loop',
            'Modules (CommonJS, ES Modules)',
            'File System Operations',
            'Building REST APIs with Express.js',
            'Database Integration (e.g., MongoDB, PostgreSQL)',
            'Authentication and Authorization',
            'Error Handling',
            'Deployment Strategies'
          ]},
          { type: 'paragraph', text: 'Stay tuned for more updates!' }
        ]
      }
    ]
  },
  'about-me': {
    title: "About Me",
    sections: [
      {
        title: "My Background",
        id: "about-me-background",
        content: [
          { type: 'paragraph', text: 'Hello! I\'m a Computer Science graduate from <strong>North Western University of Business and Technology, Khulna (NUBTK)</strong>. 🚀' },
          { type: 'paragraph', text: 'I\'m currently focused on learning and mastering modern web technologies, specifically <strong>React</strong> and <strong>Next.js</strong>. My goal is to build robust, scalable, and user-friendly web applications.' },
          { type: 'paragraph', text: 'You can connect with me and see my work:' },
          { type: 'list', items: [
            'LinkedIn: <a href="https://www.linkedin.com/in/sabbiri8/" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:underline">sabbiri8</a>',
            'GitHub: <a href="https://github.com/sabbiri8" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:underline">sabbiri8</a>'
          ]}
        ]
      },

    ]
  }
};

// --- Helper Component to render content dynamically ---
// This component will parse the content array and render elements based on their type.
function ContentRenderer({ content, liveComponents, sectionSpecificProps }) {
  return (
    <>
      {content.map((block, index) => {
        switch (block.type) {
          case 'paragraph':
            return <p key={index} className="mb-4" dangerouslySetInnerHTML={{ __html: block.text }}></p>;
          case 'code':
            return (
              <pre key={index} className="bg-gray-100 p-3 rounded-lg text-sm mt-2 mb-4 overflow-auto">
                <code>{block.code}</code>
              </pre>
            );
          case 'list':
            return (
              <ul key={index} className="list-disc list-inside space-y-2 mb-4">
                {block.items.map((item, i) => (
                  <li key={i} dangerouslySetInnerHTML={{ __html: item }}></li>
                ))}
              </ul>
            );
          case 'heading': {
            const HeadingTag = `h${block.level}`;
            return <HeadingTag key={index} className={`text-${2 + (3 - block.level)}xl font-semibold text-purple-700 mb-3`}>{block.text}</HeadingTag>;
          }
          case 'example': {
            const LiveComponent = liveComponents[block.component];
            if (LiveComponent) {
              // Pass section-specific props to the example components if needed
              return (
                <div key={index} className="bg-blue-50 p-3 rounded-lg border border-blue-200 mt-4 mb-4">
                  <LiveComponent {...sectionSpecificProps} />
                </div>
              );
            }
            return null;
          }
          default:
            return null;
        }
      })}
    </>
  );
}

// Helper component for consistent section styling
function Section({ title, children, id }) {
  return (
    <section id={id} className="bg-gray-50 p-6 rounded-xl shadow-md mb-8 border border-gray-200">
      <h2 className="text-2xl font-bold text-indigo-600 mb-4 pb-2 border-b-2 border-indigo-200">
        {title}
      </h2>
      {children}
    </section>
  );
}

// --- Page Components (Now render content dynamically from props) ---

function ReactFundamentals({ pageData, liveComponents }) {
  // Example data for rendering lists (if needed by specific examples)
  const students = [
    { id: 1, name: 'Alice', grade: 'A' },
    { id: 2, name: 'Bob', grade: 'B' },
    { id: 3, name: 'Charlie', grade: 'A-' },
  ];
  const isLoggedIn = true; // Example for conditional rendering

  // Props specific to this page's examples
  const sectionSpecificProps = {
    students,
    isLoggedIn,
    Welcome, // Pass Welcome component itself for the example
    Greeting, // Pass Greeting component itself for the example
    SimpleJSXDisplay: () => <div className="bg-blue-50 p-3 rounded-lg border border-blue-200 mt-4"><h1>Hello, JSX!</h1></div>,
    DynamicJSXDisplay: () => {
      const name = "Student";
      const number = 10;
      const doubledNumber = number * 2;
      return (
        <p className="bg-blue-50 p-3 rounded-lg border border-blue-200 mt-4">
          Hello, {name}! Ten doubled is {doubledNumber}.
        </p>
      );
    },
    WelcomePropsExample: () => (
      <>
        <Welcome name="Class" />
        <Welcome name="Everyone" />
      </>
    ),
    ConditionalRenderingExample: () => (
      <div className="bg-blue-50 p-3 rounded-lg border border-blue-200 mt-4">
        {isLoggedIn ? (
          <p>Welcome back!</p>
        ) : (
          <p>Please log in.</p>
        )}
        {isLoggedIn && <button className="bg-red-500 text-white py-1 px-3 rounded-md mt-2">Logout</button>}
      </div>
    ),
    StudentListExample: () => (
      <div className="bg-blue-50 p-3 rounded-lg border border-blue-200 mt-4">
        <h4 className="font-semibold mb-2">Student List:</h4>
        <ul className="list-disc list-inside">
          {students.map(student => (
            <li key={student.id}>
              {student.name} - Grade: {student.grade}
            </li>
          ))}
        </ul>
      </div>
    )
  };

  return (
    <div className="p-4">
      <h1 className="text-4xl font-bold text-center text-purple-700 mb-10">
        {pageData.title}
      </h1>
      {pageData.sections.map((section, index) => (
        <Section key={index} title={section.title} id={section.id}>
          <ContentRenderer content={section.content} liveComponents={liveComponents} sectionSpecificProps={sectionSpecificProps} />
        </Section>
      ))}
    </div>
  );
}

function ReactStateAndEvents({ pageData, liveComponents }) {
  const [message, setMessage] = useState('Initial Message');
  const [queueCount, setQueueCount] = useState(0);
  const [user, setUser] = useState({ name: 'Jane Doe', age: 30 });
  const [items, setItems] = useState(['Apple', 'Banana', 'Cherry']);

  const handleAlertMessage = () => {
    setTimeout(() => {
      console.log('Alerting message snapshot:', message);
    }, 3000);
  };

  const handleQueueUpdate = () => {
    setQueueCount(queueCount + 1);
    setQueueCount(prevCount => prevCount + 1);
    setQueueCount(queueCount + 1);
  };

  const handleUpdateUserName = () => {
    setUser(prevUser => ({ ...prevUser, name: 'John Doe' }));
  };

  const handleAddItem = () => {
    const newItem = `Item ${items.length + 1}`;
    setItems(prevItems => [...prevItems, newItem]);
  };

  const handleRemoveLastItem = () => {
    setItems(prevItems => prevItems.slice(0, -1));
  };

  const sectionSpecificProps = {
    EventHandlingExample: () => (
      <div className="bg-blue-50 p-3 rounded-lg border border-blue-200 mt-4">
        <button
          onClick={() => console.log('This button was clicked!')}
          className="bg-purple-500 text-white py-2 px-4 rounded-md hover:bg-purple-600 transition duration-200"
        >
          Click Me (Event Example)
        </button>
        <p className="text-sm text-gray-600 mt-2">Check your console for the log message!</p>
      </div>
    ),
    CounterExample: () => <CounterExample />,
    StateSnapshotExample: () => (
      <div className="bg-blue-50 p-3 rounded-lg border border-blue-200 mt-4">
        <p className="mb-2">Current Message: <strong>{message}</strong></p>
        <button
          onClick={() => {
            setMessage('Updated Message');
            handleAlertMessage();
          }}
          className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-200 mr-2"
        >
          Update Message & Alert Snapshot
        </button>
        <p className="text-sm text-gray-600 mt-2">
          Click the button, then wait 3 seconds. The console will show the message value from when you clicked.
        </p>
      </div>
    ),
    QueueingUpdatesExample: () => (
      <div className="bg-blue-50 p-3 rounded-lg border border-blue-200 mt-4">
        <p className="mb-2">Queue Count: <strong>{queueCount}</strong></p>
        <button
          onClick={handleQueueUpdate}
          className="bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 transition duration-200"
        >
          Increment Queue Count (x3)
        </button>
        <p className="text-sm text-gray-600 mt-2">
          Click to see how multiple `setCount` calls in one event handler are processed.
        </p>
      </div>
    ),
    UpdatingObjectsExample: () => (
      <div className="bg-blue-50 p-3 rounded-lg border border-blue-200 mt-4">
        <p className="mb-2">User Name: <strong>{user.name}</strong>, Age: <strong>{user.age}</strong></p>
        <button
          onClick={handleUpdateUserName}
          className="bg-teal-500 text-white py-2 px-4 rounded-md hover:bg-teal-600 transition duration-200"
        >
          Change User Name to John Doe
        </button>
      </div>
    ),
    UpdatingArraysExample: () => (
      <div className="bg-blue-50 p-3 rounded-lg border border-blue-200 mt-4">
        <p className="mb-2">Items: <strong>{items.join(', ')}</strong></p>
        <button
          onClick={handleAddItem}
          className="bg-orange-500 text-white py-2 px-4 rounded-md hover:bg-orange-600 transition duration-200 mr-2"
        >
          Add Item
        </button>
        <button
          onClick={handleRemoveLastItem}
          className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 transition duration-200"
        >
          Remove Last Item
        </button>
      </div>
    ),
  };

  return (
    <div className="p-4">
      <h1 className="text-4xl font-bold text-center text-green-700 mb-10">
        {pageData.title}
      </h1>
      {pageData.sections.map((section, index) => (
        <Section key={index} title={section.title} id={section.id}>
          <ContentRenderer content={section.content} liveComponents={liveComponents} sectionSpecificProps={sectionSpecificProps} />
        </Section>
      ))}
    </div>
  );
}

function ReactAdvancedState({ pageData, liveComponents }) {
  const [inputValue, setInputValue] = useState('');
  const [userProfile, setUserProfile] = useState({
    firstName: 'Alice',
    lastName: 'Smith',
    email: 'alice@example.com',
    address: {
      street: '123 Main St',
      city: 'Anytown',
      zip: '12345'
    }
  });

  const [showCounter, setShowCounter] = useState(true);
  const [counterKey, setCounterKey] = useState(0);

  const [reducerCount, dispatch] = useReducer((state, action) => {
    switch (action.type) {
      case 'increment': return state + 1;
      case 'decrement': return state - 1;
      case 'reset': return 0;
      default: return state;
    }
  }, 0);

  const [theme, setTheme] = useState('light');
  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  const [todos, todosDispatch] = useReducer(todosReducer, []);
  const [newTodoText, setNewTodoText] = useState('');

  const handleAddTodo = (e) => {
    e.preventDefault();
    if (newTodoText.trim()) {
      todosDispatch({ type: 'add', text: newTodoText.trim() });
      setNewTodoText('');
    }
  };

  const sectionSpecificProps = {
    ControlledInputExample: () => (
      <div className="bg-blue-50 p-3 rounded-lg border border-blue-200 mt-4">
        <input
          type="text"
          value={inputValue}
          onChange={e => setInputValue(e.target.value)}
          className="border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Type something..."
        />
        <p className="mt-2">You typed: <strong>{inputValue}</strong></p>
      </div>
    ),
    StateStructureExample: () => (
      <div className="bg-blue-50 p-3 rounded-lg border border-blue-200 mt-4">
        <p>User: {userProfile.firstName} {userProfile.lastName}</p>
        <p>Address: {userProfile.address.street}, {userProfile.address.city}, {userProfile.address.zip}</p>
        <button
          onClick={() => setUserProfile(prevProfile => ({
            ...prevProfile,
            address: { ...prevProfile.address, city: 'Reactville' }
          }))}
          className="bg-purple-500 text-white py-2 px-4 rounded-md hover:bg-purple-600 transition duration-200 mt-2"
        >
          Change City
        </button>
      </div>
    ),
    ParentComponentForSharingState: () => <ParentComponentForSharingState />,
    ResettingStateExample: () => (
      <div className="bg-blue-50 p-3 rounded-lg border border-blue-200 mt-4">
        <div className="flex space-x-4 mb-4">
          <button
            onClick={() => setShowCounter(!showCounter)}
            className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-200"
          >
            Toggle Counter
          </button>
          <button
            onClick={() => setCounterKey(prevKey => prevKey + 1)}
            className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 transition duration-200"
          >
            Reset Counter
          </button>
        </div>
        {showCounter && <CounterWithKey key={counterKey} />}
      </div>
    ),
    UseReducerExample: () => (
      <div className="bg-blue-50 p-3 rounded-lg border border-blue-200 mt-4">
        <p className="mb-2">Reducer Count: <strong>{reducerCount}</strong></p>
        <div className="flex space-x-2">
          <button
            onClick={() => dispatch({ type: 'decrement' })}
            className="bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600 transition duration-200"
          >
            -
          </button>
          <button
            onClick={() => dispatch({ type: 'increment' })}
            className="bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600 transition duration-200"
          >
            +
          </button>
          <button
            onClick={() => dispatch({ type: 'reset' })}
            className="bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600 transition duration-200"
          >
            Reset
          </button>
        </div>
      </div>
    ),
    UseContextExample: () => (
      <div className="bg-blue-50 p-3 rounded-lg border border-blue-200 mt-4">
        <p className="mb-2">Current Theme: <strong>{theme}</strong></p>
        <ThemedComponent theme={theme} toggleTheme={toggleTheme} />
      </div>
    ),
    TodoAppExample: () => (
      <div className="bg-blue-50 p-3 rounded-lg border border-blue-200 mt-4">
        <h3 className="text-xl font-semibold text-gray-800 mb-3">Simple Todo List (Reducer + Context)</h3>
        <form onSubmit={handleAddTodo} className="flex mb-4">
          <input
            type="text"
            value={newTodoText}
            onChange={(e) => setNewTodoText(e.target.value)}
            placeholder="Add a new todo"
            className="flex-grow border border-gray-300 p-2 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button
            type="submit"
            className="bg-green-500 text-white py-2 px-4 rounded-r-md hover:bg-green-600 transition duration-200"
          >
            Add Todo
          </button>
        </form>
        <TodoContext.Provider value={todos}>
          <TodoDispatchContext.Provider value={todosDispatch}>
            <TodoList />
          </TodoDispatchContext.Provider>
        </TodoContext.Provider>
      </div>
    ),
  };

  return (
    <div className="p-4">
      <h1 className="text-4xl font-bold text-center text-blue-700 mb-10">
        {pageData.title}
      </h1>
      {pageData.sections.map((section, index) => (
        <Section key={index} title={section.title} id={section.id}>
          <ContentRenderer content={section.content} liveComponents={liveComponents} sectionSpecificProps={sectionSpecificProps} />
        </Section>
      ))}
    </div>
  );
}

function ReactAdvancedConcepts({ pageData, liveComponents }) {
  const latestCountRef = useRef(0);
  const [currentCount, setCurrentCount] = useState(0);

  useEffect(() => {
    latestCountRef.current = currentCount;
  }, [currentCount]);

  const inputRef = useRef(null);
  const handleFocusInput = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const [seconds, setSeconds] = useState(0);
  const intervalRef = useRef(null);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setSeconds(prevSeconds => prevSeconds + 1);
    }, 1000);

    return () => {
      clearInterval(intervalRef.current);
      console.log('Synchronizing Effect: Interval cleared on unmount/re-render.');
    };
  }, []);

  const [firstName, setFirstName] = useState('John');
  const [lastName, setLastName] = useState('Doe');
  const fullName = `${firstName} ${lastName}`;

  const [lifecycleValue, setLifecycleValue] = useState(0);
  useEffect(() => {
    console.log(`Lifecycle Effect: Mounted or lifecycleValue changed to ${lifecycleValue}`);
    return () => {
      console.log(`Lifecycle Effect: Cleanup for lifecycleValue ${lifecycleValue}`);
    };
  }, [lifecycleValue]);

  const [clicks, setClicks] = useState(0);
  const clickCountRef = useRef(0);

  const handleEventClick = () => {
    setClicks(prev => prev + 1);
    clickCountRef.current++;
  };

  useEffect(() => {
    console.log(`Effect: Total clicks (from ref) after render: ${clickCountRef.current}`);
  }, [clicks]);

  const [dependencyCount, setDependencyCount] = useState(0);

  const incrementDependencyCount = useCallback(() => {
    setDependencyCount(prev => prev + 1);
  }, []);

  useEffect(() => {
    console.log('Effect with stable dependency:', dependencyCount);
  }, [dependencyCount, incrementDependencyCount]);

  const [isToggled, toggle] = useToggle(false);

  const sectionSpecificProps = {
    UseRefValueExample: () => (
      <div className="bg-blue-50 p-3 rounded-lg border border-blue-200 mt-4">
        <p className="mb-2">Current Count (State): <strong>{currentCount}</strong></p>
        <button
          onClick={() => setCurrentCount(prev => prev + 1)}
          className="bg-indigo-500 text-white py-2 px-4 rounded-md hover:bg-indigo-600 transition duration-300 mr-2"
        >
          Increment Count
        </button>
        <button
          onClick={() => console.log('Latest Count (Ref):', latestCountRef.current)}
          className="bg-purple-500 text-white py-2 px-4 rounded-md hover:bg-purple-600 transition duration-300"
        >
          Log Latest Count from Ref
        </button>
        <p className="text-sm text-gray-600 mt-2">
          Notice how the ref value might lag behind the state in the console if you click rapidly, but it eventually catches up.
        </p>
      </div>
    ),
    UseRefDOMExample: () => (
      <div className="bg-blue-50 p-3 rounded-lg border border-blue-200 mt-4">
        <input
          ref={inputRef}
          type="text"
          className="border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 mr-2"
          placeholder="Focus me!"
        />
        <button
          onClick={handleFocusInput}
          className="bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 transition duration-200"
        >
          Focus Input
        </button>
      </div>
    ),
    SynchronizingEffectsExample: () => (
      <div className="bg-blue-50 p-3 rounded-lg border border-blue-200 mt-4">
        <p className="mb-2">Timer: <strong>{seconds}</strong> seconds</p>
        <p className="text-sm text-gray-600">
          This timer is managed by an Effect that sets up and cleans up an interval.
        </p>
      </div>
    ),
    NoEffectExample: () => (
      <div className="bg-blue-50 p-3 rounded-lg border border-blue-200 mt-4">
        <p>First Name: <input type="text" value={firstName} onChange={e => setFirstName(e.target.value)} className="border rounded p-1" /></p>
        <p>Last Name: <input type="text" value={lastName} onChange={e => setLastName(e.target.value)} className="border rounded p-1 mt-2" /></p>
        <p className="mt-2">Full Name (Derived): <strong>{fullName}</strong></p>
        <p className="text-sm text-gray-600">
          The full name is calculated directly, no effect needed!
        </p>
      </div>
    ),
    LifecycleEffectsExample: () => (
      <div className="bg-blue-50 p-3 rounded-lg border border-blue-200 mt-4">
        <p className="mb-2">Lifecycle Value: <strong>{lifecycleValue}</strong></p>
        <button
          onClick={() => setLifecycleValue(prev => prev + 1)}
          className="bg-orange-500 text-white py-2 px-4 rounded-md hover:bg-orange-600 transition duration-200"
        >
          Change Lifecycle Value
        </button>
      </div>
    ),
    SeparatingEventsEffectsExample: () => (
      <div className="bg-blue-50 p-3 rounded-lg border border-blue-200 mt-4">
        <p className="mb-2">Clicks (State): <strong>{clicks}</strong></p>
        <button
          onClick={handleEventClick}
          className="bg-teal-500 text-white py-2 px-4 rounded-md hover:bg-teal-600 transition duration-200"
        >
          Click Me (Event & Effect)
        </button>
        <p className="text-sm text-gray-600 mt-2">
          Each click updates state and a ref. Observe console logs for event vs. effect timing.
        </p>
      </div>
    ),
    RemovingDependenciesExample: () => (
      <div className="bg-blue-50 p-3 rounded-lg border border-blue-200 mt-4">
        <p className="mb-2">Dependency Count: <strong>{dependencyCount}</strong></p>
        <button
          onClick={incrementDependencyCount}
          className="bg-yellow-500 text-white py-2 px-4 rounded-md hover:bg-yellow-600 transition duration-200"
        >
          Increment Dependency Count
        </button>
        <p className="text-sm text-gray-600 mt-2">
          The `incrementDependencyCount` function is stable thanks to `useCallback`, preventing unnecessary effect re-runs if it were a dependency.
        </p>
      </div>
    ),
    CustomHookExample: () => (
      <div className="bg-blue-50 p-3 rounded-lg border border-blue-200 mt-4">
        <p className="mb-2">Toggle State: <strong>{isToggled ? 'ON' : 'OFF'}</strong></p>
        <button
          onClick={toggle}
          className="bg-pink-500 text-white py-2 px-4 rounded-md hover:bg-pink-600 transition duration-200"
        >
          Toggle Feature
        </button>
      </div>
    ),
  };

  return (
    <div className="p-4">
      <h1 className="text-4xl font-bold text-center text-blue-700 mb-10">
        {pageData.title}
      </h1>
      {pageData.sections.map((section, index) => (
        <Section key={index} title={section.title} id={section.id}>
          <ContentRenderer content={section.content} liveComponents={liveComponents} sectionSpecificProps={sectionSpecificProps} />
        </Section>
      ))}
    </div>
  );
}

function ReactEffectsTutorial({ pageData, liveComponents }) {
  const [count, setCount] = useState(0);
  const [data, setData] = useState(null);
  const [animationActive, setAnimationActive] = useState(false);
  const analyticsSent = useRef(false); // To ensure analytics are sent only once

  // Section 1: Overview and Difference between Effects and Events
  const handleButtonClick = () => {
    setCount(prevCount => prevCount + 1);
    console.log('Event: Button clicked, count updated.');
  };

  // Section 3: How to Write an Effect
  useEffect(() => {
    console.log('Effect Declared: Count changed to', count);
    document.title = `Count: ${count}`;
  }, [count]);

  useEffect(() => {
    console.log('Effect with empty dependency array: Runs once on mount.');
  }, []);

  useEffect(() => {
    console.log('Effect with dependencies: Count is', count, ' (re-runs when count changes)');
  }, [count]);

  useEffect(() => {
    const timer = setTimeout(() => {
      console.log('Cleanup Effect: This message appears after 2 seconds if count stops changing.');
    }, 2000);
    return () => {
      clearTimeout(timer);
      console.log('Cleanup: Timer cleared.');
    };
  }, [count]);

  // Section 4: How to handle the Effect firing twice in development?
  useEffect(() => {
    console.log('Strict Mode Check: This effect runs twice in development (mount, unmount, remount).');
    return () => {
      console.log('Strict Mode Cleanup: This cleanup runs after the first mount in dev.');
    };
  }, []);

  // Section 5: Controlling Non-React Widgets (Simulated)
  useEffect(() => {
    console.log('Non-React Widget: Initializing a simulated external library.');
    const externalWidget = {
      init: () => console.log('External Widget initialized.'),
      update: (value) => console.log(`External Widget updated with value: ${value}`),
      destroy: () => console.log('External Widget destroyed.'),
    };
    externalWidget.init();
    externalWidget.update(count);
    return () => {
      externalWidget.destroy();
    };
  }, [count]);

  // Section 6: Subscribing to Events (e.g., window resize)
  useEffect(() => {
    const handleResize = () => {
      console.log('Subscribing to Events: Window resized to', window.innerWidth, 'x', window.innerHeight);
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      console.log('Cleanup: Removed window resize event listener.');
    };
  }, []);

  // Section 7: Triggering Animations
  useEffect(() => {
    if (animationActive) {
      console.log('Triggering Animations: Animation started!');
      const animationTimeout = setTimeout(() => {
        setAnimationActive(false);
        console.log('Triggering Animations: Animation ended!');
      }, 1000);
      return () => clearTimeout(animationTimeout);
    }
  }, [animationActive]);

  const toggleAnimation = () => {
    setAnimationActive(true);
  };

  // Section 8: Fetching Data
  useEffect(() => {
    const fetchData = async () => {
      console.log('Fetching Data: Initiating data fetch...');
      try {
        const response = await new Promise(resolve => setTimeout(() => {
          resolve({ message: `Data fetched for count: ${count}` });
        }, 1500));
        setData(response.message);
        console.log('Fetching Data: Data fetched successfully:', response.message);
      } catch (error) {
        console.error('Fetching Data: Error fetching data:', error);
      }
    };
    fetchData();
    return () => {
      console.log('Fetching Data: Cleanup for pending data fetch (if any).');
    };
  }, [count]);

  // Section 9: Sending Analytics
  useEffect(() => {
    if (!analyticsSent.current) {
      console.log('Sending Analytics: Page viewed analytics sent!');
      analyticsSent.current = true;
    }
  }, []);

  const sectionSpecificProps = {
    EffectsVsEventsExample: () => (
      <div className="flex justify-center mt-6">
        <button
          onClick={handleButtonClick}
          className="bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-3 px-6 rounded-xl shadow-lg transition duration-300 ease-in-out transform hover:scale-105"
        >
          Click Me! Count: {count}
        </button>
      </div>
    ),
    AnimationTriggerExample: () => (
      <div className="flex justify-center mt-6">
        <button
          onClick={toggleAnimation}
          className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-xl shadow-lg transition duration-300 ease-in-out transform hover:scale-105"
        >
          Toggle Animation
        </button>
        <div
          className={`ml-4 w-16 h-16 bg-blue-500 rounded-full ${animationActive ? 'animate-pulse-custom' : ''}`}
        ></div>
      </div>
    ),
    DataFetchingExample: () => (
      <>
        {data && (
          <p className="bg-blue-50 p-3 rounded-lg text-blue-800 border border-blue-200 mt-4">
            <strong>Fetched Data:</strong> {data}
          </p>
        )}
      </>
    ),
  };

  return (
    <div className="p-4">
      <h1 className="text-4xl font-bold text-center text-indigo-700 mb-10">
        {pageData.title}
      </h1>
      {pageData.sections.map((section, index) => (
        <Section key={index} title={section.title} id={section.id}>
          <ContentRenderer content={section.content} liveComponents={liveComponents} sectionSpecificProps={sectionSpecificProps} />
        </Section>
      ))}
    </div>
  );
}

function ProjectExamples({ pageData, liveComponents }) {
  // Example 1: Simple Controlled Form
  const [formInput, setFormInput] = useState('');
  const [formSubmitted, setFormSubmitted] = useState(false);

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (formInput.trim()) {
      setFormSubmitted(true);
      console.log('Form submitted with:', formInput);
    } else {
      console.log('Validation: Please enter something!');
    }
  };

  // Example 2: Basic Modal Component
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Example 3: Simulated Data Fetching with Loading and Error States
  const [fetchData, setFetchData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [fetchError, setFetchError] = useState(null);

  const simulateFetch = async () => {
    setIsLoading(true);
    setFetchError(null);
    setFetchData(null);
    try {
      const response = await new Promise((resolve, reject) => {
        setTimeout(() => {
          if (Math.random() > 0.3) { // Simulate success 70% of the time
            resolve({ id: 1, name: 'Sample Item', value: Math.random().toFixed(2) });
          } else {
            reject(new Error('Failed to fetch data.'));
          }
        }, 1500);
      });
      setFetchData(response);
    } catch (error) {
      setFetchError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Example 4: Simple Tabbed Interface
  const [activeTab, setActiveTab] = useState('tab1');

  // Example 5: Counter with useReducer
  const initialCounterState = { count: 0 };

  function counterReducer(state, action) {
    switch (action.type) {
      case 'increment':
        return { count: state.count + 1 };
      case 'decrement':
        return { count: state.count - 1 };
      case 'reset':
        return { count: 0 };
      default:
        throw new Error();
    }
  }
  const [counterState, counterDispatch] = useReducer(counterReducer, initialCounterState);

  // Example 6: Custom Hook Usage (from useToggle defined above)
  const [isFeatureEnabled, toggleFeature] = useToggle(false);

  // Example 7: Debounced Search Input
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');

  // Debounce logic using useEffect
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500); // 500ms debounce delay

    // Cleanup function: clear the timeout if searchTerm changes before the delay
    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm]); // Only re-run if searchTerm changes

  // Simulate API call with debouncedSearchTerm
  useEffect(() => {
    if (debouncedSearchTerm) {
      console.log(`Simulating API call for: "${debouncedSearchTerm}"`);
    }
  }, [debouncedSearchTerm]);

  // Example 8: Dark Mode Toggle
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Example 9: Controlled Checkbox List
  const allItems = [
    { id: 'item1', label: 'Option A' },
    { id: 'item2', label: 'Option B' },
    { id: 'item3', label: 'Option C' },
  ];
  const [selectedItems, setSelectedItems] = useState([]);

  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setSelectedItems(prev => [...prev, value]);
    } else {
      setSelectedItems(prev => prev.filter(item => item !== value));
    }
  };

  // Example 10: Accordion/Collapsible Content
  const [isAccordionOpen, setIsAccordionOpen] = useState(false);

  // Example 11: Star Rating Component
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);

  const sectionSpecificProps = {
    ControlledFormExample: () => (
      <div className="bg-white p-4 rounded-lg shadow-inner mt-4">
        <form onSubmit={handleFormSubmit} className="space-y-4">
          <input
            type="text"
            value={formInput}
            onChange={(e) => {
              setFormInput(e.target.value);
              setFormSubmitted(false);
            }}
            placeholder="Enter text..."
            className="border p-2 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-200">
            Submit
          </button>
          {formSubmitted && <p className="text-green-600 mt-2">Submitted: <strong>{formInput}</strong></p>}
        </form>
      </div>
    ),
    ModalExample: () => (
      <div className="bg-white p-4 rounded-lg shadow-inner mt-4 text-center">
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-purple-500 text-white py-2 px-4 rounded-md hover:bg-purple-600 transition duration-200"
        >
          Open Modal
        </button>
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
          <h2 className="text-xl font-bold mb-4">Hello from Modal!</h2>
          <p>This is some content inside the modal. You can put any JSX here.</p>
          <button
            onClick={() => setIsModalOpen(false)}
            className="mt-4 bg-red-500 text-white py-1 px-3 rounded-md hover:bg-red-600 transition duration-200"
          >
            Close Modal
          </button>
        </Modal>
      </div>
    ),
    DataFetchingLiveExample: () => (
      <div className="bg-white p-4 rounded-lg shadow-inner mt-4">
        <button
          onClick={simulateFetch}
          disabled={isLoading}
          className="bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 transition duration-200"
        >
          {isLoading ? 'Loading...' : 'Simulate Fetch Data'}
        </button>
        {fetchError && <p className="text-red-500 mt-2">Error: <strong>{fetchError}</strong></p>}
        {fetchData && (
          <div className="bg-blue-50 p-3 rounded-md mt-2 border border-blue-200">
            <p>ID: <strong>{fetchData.id}</strong></p>
            <p>Name: <strong>{fetchData.name}</strong></p>
            <p>Value: <strong>{fetchData.value}</strong></p>
          </div>
        )}
      </div>
    ),
    TabbedInterfaceExample: () => (
      <div className="bg-white p-4 rounded-lg shadow-inner mt-4">
        <div className="flex border-b border-gray-200">
          <button
            className={`py-2 px-4 font-semibold transition duration-200 ${
              activeTab === 'tab1' ? 'border-b-2 border-blue-500 text-blue-700' : 'text-gray-600 hover:text-blue-500'
            }`}
            onClick={() => setActiveTab('tab1')}
          >
            Tab 1
          </button>
          <button
            className={`py-2 px-4 font-semibold transition duration-200 ${
              activeTab === 'tab2' ? 'border-b-2 border-blue-500 text-blue-700' : 'text-gray-600 hover:text-blue-500'
            }`}
            onClick={() => setActiveTab('tab2')}
          >
            Tab 2
          </button>
          <button
            className={`py-2 px-4 font-semibold transition duration-200 ${
              activeTab === 'tab3' ? 'border-b-2 border-blue-500 text-blue-700' : 'text-gray-600 hover:text-blue-500'
            }`}
            onClick={() => setActiveTab('tab3')}
          >
            Tab 3
          </button>
        </div>
        <div className="p-4 border border-t-0 rounded-b-md bg-gray-50">
          {activeTab === 'tab1' && <p>This is the content for <strong>Tab 1</strong>. You can place any component or information here.</p>}
          {activeTab === 'tab2' && <p>This is the content for <strong>Tab 2</strong>. It changes based on the active tab.</p>}
          {activeTab === 'tab3' && <p>This is the content for <strong>Tab 3</strong>. Another distinct section.</p>}
        </div>
      </div>
    ),
    CounterWithReducerExample: () => (
      <div className="bg-white p-4 rounded-lg shadow-inner mt-4">
        <div className="flex items-center space-x-3">
          <button
            onClick={() => counterDispatch({ type: 'decrement' })}
            className="bg-gray-400 text-white py-1 px-3 rounded-md hover:bg-gray-500 transition duration-200"
          >
            -
          </button>
          <span className="text-xl font-bold">Count: {counterState.count}</span>
          <button
            onClick={() => counterDispatch({ type: 'increment' })}
            className="bg-gray-400 text-white py-1 px-3 rounded-md hover:bg-gray-500 transition duration-200"
          >
            +
          </button>
          <button
            onClick={() => counterDispatch({ type: 'reset' })}
            className="bg-gray-400 text-white py-1 px-3 rounded-md hover:bg-gray-500 transition duration-200"
          >
            Reset
          </button>
        </div>
      </div>
    ),
    CustomHookUsageExample: () => (
      <div className="bg-white p-4 rounded-lg shadow-inner mt-4">
        <p className="mb-2">Feature Status: <strong>{isFeatureEnabled ? 'Enabled' : 'Disabled'}</strong></p>
        <button
          onClick={toggleFeature}
          className="bg-indigo-500 text-white py-2 px-4 rounded-md hover:bg-indigo-600 transition duration-200"
        >
          Toggle Feature
        </button>
      </div>
    ),
    DebouncedSearchInputExample: () => (
      <div className="bg-white p-4 rounded-lg shadow-inner mt-4">
        <input
          type="text"
          placeholder="Type to search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border p-2 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <p className="mt-2 text-sm text-gray-600">
          Current Input: <strong>{searchTerm}</strong>
        </p>
        <p className="text-sm text-gray-600">
          Debounced Search Term (API call triggered for): <strong>{debouncedSearchTerm}</strong>
        </p>
        <p className="text-xs text-gray-500 mt-1">
          (Check console for simulated API calls after you stop typing for 0.5 seconds)
        </p>
      </div>
    ),
    DarkModeToggleExample: () => (
      <div className="bg-white p-4 rounded-lg shadow-inner mt-4 dark:bg-gray-800 transition-colors duration-300">
        <div className="flex items-center space-x-2">
          <label htmlFor="dark-mode-toggle-live" className="text-gray-800 dark:text-gray-200">
            Dark Mode:
          </label>
          <input
            type="checkbox"
            id="dark-mode-toggle-live"
            checked={isDarkMode}
            onChange={() => setIsDarkMode(!isDarkMode)}
            className="form-checkbox h-5 w-5 text-indigo-600 rounded cursor-pointer"
          />
        </div>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          Toggle this to see the background of this section change (requires Tailwind CSS `dark:` variant setup).
        </p>
      </div>
    ),
    CheckboxListExample: () => (
      <div className="bg-white p-4 rounded-lg shadow-inner mt-4">
        {allItems.map(item => (
          <label key={item.id} className="flex items-center space-x-2 mb-2 cursor-pointer">
            <input
              type="checkbox"
              value={item.id}
              checked={selectedItems.includes(item.id)}
              onChange={handleCheckboxChange}
              className="form-checkbox h-4 w-4 text-blue-600 rounded"
            />
            <span className="text-gray-800">{item.label}</span>
          </label>
        ))}
        <p className="mt-4 text-gray-700">
          Selected Items: <strong>{selectedItems.join(', ') || 'None'}</strong>
        </p>
      </div>
    ),
    AccordionExample: () => (
      <div className="bg-white p-4 rounded-lg shadow-inner mt-4">
        <div className="border border-gray-300 rounded-md">
          <button
            className="flex justify-between items-center w-full p-4 bg-gray-100 hover:bg-gray-200 font-semibold rounded-t-md focus:outline-none transition duration-200"
            onClick={() => setIsAccordionOpen(!isAccordionOpen)}
          >
            <span>Click to Toggle Content</span>
            <span>{isAccordionOpen ? '▲' : '▼'}</span>
          </button>
          {isAccordionOpen && (
            <div className="p-4 border-t border-gray-300 bg-white rounded-b-md animate-fade-in">
              <p>This is the hidden content inside the accordion.</p>
              <p>It will expand and collapse smoothly.</p>
            </div>
          )}
        </div>
      </div>
    ),
    StarRatingExample: () => (
      <div className="bg-white p-4 rounded-lg shadow-inner mt-4">
        <div className="flex">
          {[1, 2, 3, 4, 5].map((starId) => (
            <Star
              key={starId}
              starId={starId}
              selected={starId <= (hoverRating || rating)}
              onSelect={setRating}
              onHover={setHoverRating}
              onLeave={() => setHoverRating(0)}
            />
          ))}
          <p className="ml-4 text-lg text-gray-700">Rating: <strong>{rating}</strong> / 5</p>
        </div>
      </div>
    ),
  };

  return (
    <div className="p-4">
      <h1 className="text-4xl font-bold text-center text-purple-700 mb-10">
        {pageData.title}
      </h1>
      {pageData.sections.map((section, index) => (
        <Section key={index} title={section.title} id={section.id}>
          <ContentRenderer content={section.content} liveComponents={liveComponents} sectionSpecificProps={sectionSpecificProps} />
        </Section>
      ))}
    </div>
  );
}

function NodeJsConcepts({ pageData, liveComponents }) {
  return (
    <div className="p-4">
      <h1 className="text-4xl font-bold text-center text-gray-700 mb-10">
        {pageData.title}
      </h1>
      {pageData.sections.map((section, index) => (
        <Section key={index} title={section.title} id={section.id}>
          <ContentRenderer content={section.content} liveComponents={liveComponents} />
        </Section>
      ))}
    </div>
  );
}

function AboutMe({ pageData, liveComponents }) {
  return (
    <div className="p-4">
      <h1 className="text-4xl font-bold text-center text-green-700 mb-10">
        {pageData.title}
      </h1>
      {pageData.sections.map((section, index) => (
        <Section key={index} title={section.title} id={section.id}>
          <ContentRenderer content={section.content} liveComponents={liveComponents} />
        </Section>
      ))}
    </div>
  );
}

// --- Main App Component ---
export default function Project1() {
  const [navigationTarget, setNavigationTarget] = useState({ page: 'about-me', sectionId: null });
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isReactConceptsExpanded, setIsReactConceptsExpanded] = useState(true);

  // Map of component names to actual component functions for dynamic rendering
  const liveComponents = {
    Greeting,
    Welcome,
    CounterExample,
    ParentComponentForSharingState,
    CounterWithKey,
    ThemedComponent,
    DeeplyNestedComponent,
    TodoList,
    TodoItem,
    Modal,
    Star,
    // Live examples for React Fundamentals
    SimpleJSXDisplay: () => <div className="bg-blue-50 p-3 rounded-lg border border-blue-200 mt-4"><h1>Hello, JSX!</h1></div>,
    DynamicJSXDisplay: () => {
      const name = "Student";
      const number = 10;
      const doubledNumber = number * 2;
      return (
        <p className="bg-blue-50 p-3 rounded-lg border border-blue-200 mt-4">
          Hello, {name}! Ten doubled is {doubledNumber}.
        </p>
      );
    },
    WelcomePropsExample: () => (
      <>
        <Welcome name="Class" />
        <Welcome name="Everyone" />
      </>
    ),
    ConditionalRenderingExample: () => {
      const isLoggedIn = true;
      return (
        <div className="bg-blue-50 p-3 rounded-lg border border-blue-200 mt-4">
          {isLoggedIn ? (
            <p>Welcome back!</p>
          ) : (
            <p>Please log in.</p>
          )}
          {isLoggedIn && <button className="bg-red-500 text-white py-1 px-3 rounded-md mt-2">Logout</button>}
        </div>
      );
    },
    StudentListExample: () => {
      const students = [
        { id: 1, name: 'Alice', grade: 'A' },
        { id: 2, name: 'Bob', grade: 'B' },
        { id: 3, name: 'Charlie', grade: 'A-' },
      ];
      return (
        <div className="bg-blue-50 p-3 rounded-lg border border-blue-200 mt-4">
          <h4 className="font-semibold mb-2">Student List:</h4>
          <ul className="list-disc list-inside">
            {students.map(student => (
              <li key={student.id}>
                {student.name} - Grade: {student.grade}
              </li>
            ))}
          </ul>
        </div>
      );
    },
    // Live examples for React State & Events
    EventHandlingExample: () => (
      <div className="bg-blue-50 p-3 rounded-lg border border-blue-200 mt-4">
        <button
          onClick={() => console.log('This button was clicked!')}
          className="bg-purple-500 text-white py-2 px-4 rounded-md hover:bg-purple-600 transition duration-200"
        >
          Click Me (Event Example)
        </button>
        <p className="text-sm text-gray-600 mt-2">Check your console for the log message!</p>
      </div>
    ),
    StateSnapshotExample: () => {
      const [message, setMessage] = useState('Initial Message');
      const handleAlertMessage = () => {
        setTimeout(() => {
          console.log('Alerting message snapshot:', message);
        }, 3000);
      };
      return (
        <div className="bg-blue-50 p-3 rounded-lg border border-blue-200 mt-4">
          <p className="mb-2">Current Message: <strong>{message}</strong></p>
          <button
            onClick={() => {
              setMessage('Updated Message');
              handleAlertMessage();
            }}
            className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-200 mr-2"
          >
            Update Message & Alert Snapshot
          </button>
          <p className="text-sm text-gray-600 mt-2">
            Click the button, then wait 3 seconds. The console will show the message value from when you clicked.
          </p>
        </div>
      );
    },
    QueueingUpdatesExample: () => {
      const [queueCount, setQueueCount] = useState(0);
      const handleQueueUpdate = () => {
        setQueueCount(queueCount + 1);
        setQueueCount(prevCount => prevCount + 1);
        setQueueCount(queueCount + 1);
      };
      return (
        <div className="bg-blue-50 p-3 rounded-lg border border-blue-200 mt-4">
          <p className="mb-2">Queue Count: <strong>{queueCount}</strong></p>
          <button
            onClick={handleQueueUpdate}
            className="bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 transition duration-200"
          >
            Increment Queue Count (x3)
          </button>
          <p className="text-sm text-gray-600 mt-2">
            Click to see how multiple `setCount` calls in one event handler are processed.
          </p>
        </div>
      );
    },
    UpdatingObjectsExample: () => {
      const [user, setUser] = useState({ name: 'Jane Doe', age: 30 });
      const handleUpdateUserName = () => {
        setUser(prevUser => ({ ...prevUser, name: 'John Doe' }));
      };
      return (
        <div className="bg-blue-50 p-3 rounded-lg border border-blue-200 mt-4">
          <p className="mb-2">User Name: <strong>{user.name}</strong>, Age: <strong>{user.age}</strong></p>
          <button
            onClick={handleUpdateUserName}
            className="bg-teal-500 text-white py-2 px-4 rounded-md hover:bg-teal-600 transition duration-200"
          >
            Change User Name to John Doe
          </button>
        </div>
      );
    },
    UpdatingArraysExample: () => {
      const [items, setItems] = useState(['Apple', 'Banana', 'Cherry']);
      const handleAddItem = () => {
        const newItem = `Item ${items.length + 1}`;
        setItems(prevItems => [...prevItems, newItem]);
      };
      const handleRemoveLastItem = () => {
        setItems(prevItems => prevItems.slice(0, -1));
      };
      return (
        <div className="bg-blue-50 p-3 rounded-lg border border-blue-200 mt-4">
          <p className="mb-2">Items: <strong>{items.join(', ')}</strong></p>
          <button
            onClick={handleAddItem}
            className="bg-orange-500 text-white py-2 px-4 rounded-md hover:bg-orange-600 transition duration-200 mr-2"
          >
            Add Item
          </button>
          <button
            onClick={handleRemoveLastItem}
            className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 transition duration-200"
          >
            Remove Last Item
          </button>
        </div>
      );
    },
    // Live examples for React Advanced State
    ControlledInputExample: () => {
      const [inputValue, setInputValue] = useState('');
      return (
        <div className="bg-blue-50 p-3 rounded-lg border border-blue-200 mt-4">
          <input
            type="text"
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
            className="border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Type something..."
          />
          <p className="mt-2">You typed: <strong>{inputValue}</strong></p>
        </div>
      );
    },
    StateStructureExample: () => {
      const [userProfile, setUserProfile] = useState({
        firstName: 'Alice',
        lastName: 'Smith',
        email: 'alice@example.com',
        address: {
          street: '123 Main St',
          city: 'Anytown',
          zip: '12345'
        }
      });
      return (
        <div className="bg-blue-50 p-3 rounded-lg border border-blue-200 mt-4">
          <p>User: {userProfile.firstName} {userProfile.lastName}</p>
          <p>Address: {userProfile.address.street}, {userProfile.address.city}, {userProfile.address.zip}</p>
          <button
            onClick={() => setUserProfile(prevProfile => ({
              ...prevProfile,
              address: { ...prevProfile.address, city: 'Reactville' }
            }))}
            className="bg-purple-500 text-white py-2 px-4 rounded-md hover:bg-purple-600 transition duration-200 mt-2"
          >
            Change City
          </button>
        </div>
      );
    },
    ResettingStateExample: () => {
      const [showCounter, setShowCounter] = useState(true);
      const [counterKey, setCounterKey] = useState(0);
      return (
        <div className="bg-blue-50 p-3 rounded-lg border border-blue-200 mt-4">
          <div className="flex space-x-4 mb-4">
            <button
              onClick={() => setShowCounter(!showCounter)}
              className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-200"
            >
              Toggle Counter
            </button>
            <button
              onClick={() => setCounterKey(prevKey => prevKey + 1)}
              className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 transition duration-200"
            >
              Reset Counter
            </button>
          </div>
          {showCounter && <CounterWithKey key={counterKey} />}
        </div>
      );
    },
    UseReducerExample: () => {
      const [reducerCount, dispatch] = useReducer((state, action) => {
        switch (action.type) {
          case 'increment': return state + 1;
          case 'decrement': return state - 1;
          case 'reset': return 0;
          default: return state;
        }
      }, 0);
      return (
        <div className="bg-blue-50 p-3 rounded-lg border border-blue-200 mt-4">
          <p className="mb-2">Reducer Count: <strong>{reducerCount}</strong></p>
          <div className="flex space-x-2">
            <button
              onClick={() => dispatch({ type: 'decrement' })}
              className="bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600 transition duration-200"
            >
              -
            </button>
            <button
              onClick={() => dispatch({ type: 'increment' })}
              className="bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600 transition duration-200"
            >
              +
            </button>
            <button
              onClick={() => dispatch({ type: 'reset' })}
              className="bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600 transition duration-200"
            >
              Reset
            </button>
          </div>
        </div>
      );
    },
    UseContextExample: () => {
      const [theme, setTheme] = useState('light');
      const toggleTheme = () => {
        setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
      };
      return (
        <div className="bg-blue-50 p-3 rounded-lg border border-blue-200 mt-4">
          <p className="mb-2">Current Theme: <strong>{theme}</strong></p>
          <ThemedComponent theme={theme} toggleTheme={toggleTheme} />
        </div>
      );
    },
    TodoAppExample: () => {
      const [todos, todosDispatch] = useReducer(todosReducer, []);
      const [newTodoText, setNewTodoText] = useState('');
      const handleAddTodo = (e) => {
        e.preventDefault();
        if (newTodoText.trim()) {
          todosDispatch({ type: 'add', text: newTodoText.trim() });
          setNewTodoText('');
        }
      };
      return (
        <div className="bg-blue-50 p-3 rounded-lg border border-blue-200 mt-4">
          <h3 className="text-xl font-semibold text-gray-800 mb-3">Simple Todo List (Reducer + Context)</h3>
          <form onSubmit={handleAddTodo} className="flex mb-4">
            <input
              type="text"
              value={newTodoText}
              onChange={(e) => setNewTodoText(e.target.value)}
              placeholder="Add a new todo"
              className="flex-grow border border-gray-300 p-2 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <button
              type="submit"
              className="bg-green-500 text-white py-2 px-4 rounded-r-md hover:bg-green-600 transition duration-200"
            >
              Add Todo
            </button>
          </form>
          <TodoContext.Provider value={todos}>
            <TodoDispatchContext.Provider value={todosDispatch}>
              <TodoList />
            </TodoDispatchContext.Provider>
          </TodoContext.Provider>
        </div>
      );
    },
    // Live examples for React Advanced Concepts
    UseRefValueExample: () => {
      const latestCountRef = useRef(0);
      const [currentCount, setCurrentCount] = useState(0);

      useEffect(() => {
        latestCountRef.current = currentCount;
      }, [currentCount]);
      return (
        <div className="bg-blue-50 p-3 rounded-lg border border-blue-200 mt-4">
          <p className="mb-2">Current Count (State): <strong>{currentCount}</strong></p>
          <button
            onClick={() => setCurrentCount(prev => prev + 1)}
            className="bg-indigo-500 text-white py-2 px-4 rounded-md hover:bg-indigo-600 transition duration-300 mr-2"
          >
            Increment Count
          </button>
          <button
            onClick={() => console.log('Latest Count (Ref):', latestCountRef.current)}
            className="bg-purple-500 text-white py-2 px-4 rounded-md hover:bg-purple-600 transition duration-300"
          >
            Log Latest Count from Ref
          </button>
          <p className="text-sm text-gray-600 mt-2">
            Notice how the ref value might lag behind the state in the console if you click rapidly, but it eventually catches up.
          </p>
        </div>
      );
    },
    UseRefDOMExample: () => {
      const inputRef = useRef(null);
      const handleFocusInput = () => {
        if (inputRef.current) {
          inputRef.current.focus();
        }
      };
      return (
        <div className="bg-blue-50 p-3 rounded-lg border border-blue-200 mt-4">
          <input
            ref={inputRef}
            type="text"
            className="border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 mr-2"
            placeholder="Focus me!"
          />
          <button
            onClick={handleFocusInput}
            className="bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 transition duration-200"
          >
            Focus Input
          </button>
        </div>
      );
    },
    SynchronizingEffectsExample: () => {
      const [seconds, setSeconds] = useState(0);
      const intervalRef = useRef(null);

      useEffect(() => {
        intervalRef.current = setInterval(() => {
          setSeconds(prevSeconds => prevSeconds + 1);
        }, 1000);

        return () => {
          clearInterval(intervalRef.current);
          console.log('Synchronizing Effect: Interval cleared on unmount/re-render.');
        };
      }, []);
      return (
        <div className="bg-blue-50 p-3 rounded-lg border border-blue-200 mt-4">
          <p className="mb-2">Timer: <strong>{seconds}</strong> seconds</p>
          <p className="text-sm text-gray-600">
            This timer is managed by an Effect that sets up and cleans up an interval.
          </p>
        </div>
      );
    },
    NoEffectExample: () => {
      const [firstName, setFirstName] = useState('John');
      const [lastName, setLastName] = useState('Doe');
      const fullName = `${firstName} ${lastName}`;
      return (
        <div className="bg-blue-50 p-3 rounded-lg border border-blue-200 mt-4">
          <p>First Name: <input type="text" value={firstName} onChange={e => setFirstName(e.target.value)} className="border rounded p-1" /></p>
          <p>Last Name: <input type="text" value={lastName} onChange={e => setLastName(e.target.value)} className="border rounded p-1 mt-2" /></p>
          <p className="mt-2">Full Name (Derived): <strong>{fullName}</strong></p>
          <p className="text-sm text-gray-600">
            The full name is calculated directly, no effect needed!
          </p>
        </div>
      );
    },
    LifecycleEffectsExample: () => {
      const [lifecycleValue, setLifecycleValue] = useState(0);
      useEffect(() => {
        console.log(`Lifecycle Effect: Mounted or lifecycleValue changed to ${lifecycleValue}`);
        return () => {
          console.log(`Lifecycle Effect: Cleanup for lifecycleValue ${lifecycleValue}`);
        };
      }, [lifecycleValue]);
      return (
        <div className="bg-blue-50 p-3 rounded-lg border border-blue-200 mt-4">
          <p className="mb-2">Lifecycle Value: <strong>{lifecycleValue}</strong></p>
          <button
            onClick={() => setLifecycleValue(prev => prev + 1)}
            className="bg-orange-500 text-white py-2 px-4 rounded-md hover:bg-orange-600 transition duration-200"
          >
            Change Lifecycle Value
          </button>
        </div>
      );
    },
    SeparatingEventsEffectsExample: () => {
      const [clicks, setClicks] = useState(0);
      const clickCountRef = useRef(0);

      const handleEventClick = () => {
        setClicks(prev => prev + 1);
        clickCountRef.current++;
      };

      useEffect(() => {
        console.log(`Effect: Total clicks (from ref) after render: ${clickCountRef.current}`);
      }, [clicks]);
      return (
        <div className="bg-blue-50 p-3 rounded-lg border border-blue-200 mt-4">
          <p className="mb-2">Clicks (State): <strong>{clicks}</strong></p>
          <button
            onClick={handleEventClick}
            className="bg-teal-500 text-white py-2 px-4 rounded-md hover:bg-teal-600 transition duration-200"
          >
            Click Me (Event & Effect)
          </button>
          <p className="text-sm text-gray-600 mt-2">
            Each click updates state and a ref. Observe console logs for event vs. effect timing.
          </p>
        </div>
      );
    },
    RemovingDependenciesExample: () => {
      const [dependencyCount, setDependencyCount] = useState(0);
      const incrementDependencyCount = useCallback(() => {
        setDependencyCount(prev => prev + 1);
      }, []);
      useEffect(() => {
        console.log('Effect with stable dependency:', dependencyCount);
      }, [dependencyCount, incrementDependencyCount]);
      return (
        <div className="bg-blue-50 p-3 rounded-lg border border-blue-200 mt-4">
          <p className="mb-2">Dependency Count: <strong>{dependencyCount}</strong></p>
          <button
            onClick={incrementDependencyCount}
            className="bg-yellow-500 text-white py-2 px-4 rounded-md hover:bg-yellow-600 transition duration-200"
          >
            Increment Dependency Count
          </button>
          <p className="text-sm text-gray-600 mt-2">
            The `incrementDependencyCount` function is stable thanks to `useCallback`, preventing unnecessary effect re-runs if it were a dependency.
          </p>
        </div>
      );
    },
    CustomHookExample: () => {
      const [isToggled, toggle] = useToggle(false);
      return (
        <div className="bg-blue-50 p-3 rounded-lg border border-blue-200 mt-4">
          <p className="mb-2">Toggle State: <strong>{isToggled ? 'ON' : 'OFF'}</strong></p>
          <button
            onClick={toggle}
            className="bg-pink-500 text-white py-2 px-4 rounded-md hover:bg-pink-600 transition duration-200"
          >
            Toggle Feature
          </button>
        </div>
      );
    },
    // Live examples for Project Examples
    ControlledFormExample: () => {
      const [formInput, setFormInput] = useState('');
      const [formSubmitted, setFormSubmitted] = useState(false);
      const handleFormSubmit = (e) => {
        e.preventDefault();
        if (formInput.trim()) {
          setFormSubmitted(true);
          console.log('Form submitted with:', formInput);
        } else {
          console.log('Validation: Please enter something!');
        }
      };
      return (
        <div className="bg-white p-4 rounded-lg shadow-inner mt-4">
          <form onSubmit={handleFormSubmit} className="space-y-4">
            <input
              type="text"
              value={formInput}
              onChange={(e) => {
                setFormInput(e.target.value);
                setFormSubmitted(false);
              }}
              placeholder="Enter text..."
              className="border p-2 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-200">
              Submit
            </button>
            {formSubmitted && <p className="text-green-600 mt-2">Submitted: <strong>{formInput}</strong></p>}
          </form>
        </div>
      );
    },
    ModalExample: () => {
      const [isModalOpen, setIsModalOpen] = useState(false);
      return (
        <div className="bg-white p-4 rounded-lg shadow-inner mt-4 text-center">
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-purple-500 text-white py-2 px-4 rounded-md hover:bg-purple-600 transition duration-200"
          >
            Open Modal
          </button>
          <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
            <h2 className="text-xl font-bold mb-4">Hello from Modal!</h2>
            <p>This is some content inside the modal. You can put any JSX here.</p>
            <button
              onClick={() => setIsModalOpen(false)}
              className="mt-4 bg-red-500 text-white py-1 px-3 rounded-md hover:bg-red-600 transition duration-200"
            >
              Close Modal
            </button>
          </Modal>
        </div>
      );
    },
    DataFetchingLiveExample: () => {
      const [fetchData, setFetchData] = useState(null);
      const [isLoading, setIsLoading] = useState(false);
      const [fetchError, setFetchError] = useState(null);

      const simulateFetch = async () => {
        setIsLoading(true);
        setFetchError(null);
        setFetchData(null);
        try {
          const response = await new Promise((resolve, reject) => {
            setTimeout(() => {
              if (Math.random() > 0.3) { // Simulate success 70% of the time
                resolve({ id: 1, name: 'Sample Item', value: Math.random().toFixed(2) });
              } else {
                reject(new Error('Failed to fetch data.'));
              }
            }, 1500);
          });
          setFetchData(response);
        } catch (error) {
          setFetchError(error.message);
        } finally {
          setIsLoading(false);
        }
      };
      return (
        <div className="bg-white p-4 rounded-lg shadow-inner mt-4">
          <button
            onClick={simulateFetch}
            disabled={isLoading}
            className="bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 transition duration-200"
          >
            {isLoading ? 'Loading...' : 'Simulate Fetch Data'}
          </button>
          {fetchError && <p className="text-red-500 mt-2">Error: <strong>{fetchError}</strong></p>}
          {fetchData && (
            <div className="bg-blue-50 p-3 rounded-md mt-2 border border-blue-200">
              <p>ID: <strong>{fetchData.id}</strong></p>
              <p>Name: <strong>{fetchData.name}</strong></p>
              <p>Value: <strong>{fetchData.value}</strong></p>
            </div>
          )}
        </div>
      );
    },
    TabbedInterfaceExample: () => {
      const [activeTab, setActiveTab] = useState('tab1');
      return (
        <div className="bg-white p-4 rounded-lg shadow-inner mt-4">
          <div className="flex border-b border-gray-200">
            <button
              className={`py-2 px-4 font-semibold transition duration-200 ${
                activeTab === 'tab1' ? 'border-b-2 border-blue-500 text-blue-700' : 'text-gray-600 hover:text-blue-500'
              }`}
              onClick={() => setActiveTab('tab1')}
            >
              Tab 1
            </button>
            <button
              className={`py-2 px-4 font-semibold transition duration-200 ${
                activeTab === 'tab2' ? 'border-b-2 border-blue-500 text-blue-700' : 'text-gray-600 hover:text-blue-500'
              }`}
              onClick={() => setActiveTab('tab2')}
            >
              Tab 2
            </button>
            <button
              className={`py-2 px-4 font-semibold transition duration-200 ${
                activeTab === 'tab3' ? 'border-b-2 border-blue-500 text-blue-700' : 'text-gray-600 hover:text-blue-500'
              }`}
              onClick={() => setActiveTab('tab3')}
            >
              Tab 3
            </button>
          </div>
          <div className="p-4 border border-t-0 rounded-b-md bg-gray-50">
            {activeTab === 'tab1' && <p>This is the content for <strong>Tab 1</strong>. You can place any component or information here.</p>}
            {activeTab === 'tab2' && <p>This is the content for <strong>Tab 2</strong>. It changes based on the active tab.</p>}
            {activeTab === 'tab3' && <p>This is the content for <strong>Tab 3</strong>. Another distinct section.</p>}
          </div>
        </div>
      );
    },
    CounterWithReducerExample: () => {
      const initialCounterState = { count: 0 };

      function counterReducer(state, action) {
        switch (action.type) {
          case 'increment':
            return { count: state.count + 1 };
          case 'decrement':
            return { count: state.count - 1 };
          case 'reset':
            return { count: 0 };
          default:
            throw new Error();
        }
      }
      const [counterState, counterDispatch] = useReducer(counterReducer, initialCounterState);
      return (
        <div className="bg-white p-4 rounded-lg shadow-inner mt-4">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => counterDispatch({ type: 'decrement' })}
              className="bg-gray-400 text-white py-1 px-3 rounded-md hover:bg-gray-500 transition duration-200"
            >
              -
            </button>
            <span className="text-xl font-bold">Count: {counterState.count}</span>
            <button
              onClick={() => counterDispatch({ type: 'increment' })}
              className="bg-gray-400 text-white py-1 px-3 rounded-md hover:bg-gray-500 transition duration-200"
            >
              +
            </button>
            <button
              onClick={() => counterDispatch({ type: 'reset' })}
              className="bg-gray-400 text-white py-1 px-3 rounded-md hover:bg-gray-500 transition duration-200"
            >
              Reset
            </button>
          </div>
        </div>
      );
    },
    CustomHookUsageExample: () => {
      const [isFeatureEnabled, toggleFeature] = useToggle(false);
      return (
        <div className="bg-white p-4 rounded-lg shadow-inner mt-4">
          <p className="mb-2">Feature Status: <strong>{isFeatureEnabled ? 'Enabled' : 'Disabled'}</strong></p>
          <button
            onClick={toggleFeature}
            className="bg-indigo-500 text-white py-2 px-4 rounded-md hover:bg-indigo-600 transition duration-200"
          >
            Toggle Feature
          </button>
        </div>
      );
    },
    DebouncedSearchInputExample: () => {
      const [searchTerm, setSearchTerm] = useState('');
      const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');

      useEffect(() => {
        const handler = setTimeout(() => {
          setDebouncedSearchTerm(searchTerm);
        }, 500);

        return () => {
          clearTimeout(handler);
        };
      }, [searchTerm]);

      useEffect(() => {
        if (debouncedSearchTerm) {
          console.log(`Simulating API call for: "${debouncedSearchTerm}"`);
        }
      }, [debouncedSearchTerm]);
      return (
        <div className="bg-white p-4 rounded-lg shadow-inner mt-4">
          <input
            type="text"
            placeholder="Type to search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border p-2 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <p className="mt-2 text-sm text-gray-600">
            Current Input: <strong>{searchTerm}</strong>
          </p>
          <p className="text-sm text-gray-600">
            Debounced Search Term (API call triggered for): <strong>{debouncedSearchTerm}</strong>
          </p>
          <p className="text-xs text-gray-500 mt-1">
            (Check console for simulated API calls after you stop typing for 0.5 seconds)
          </p>
        </div>
      );
    },
    DarkModeToggleExample: () => {
      const [isDarkMode, setIsDarkMode] = useState(false);
      useEffect(() => {
        if (isDarkMode) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      }, [isDarkMode]);
      return (
        <div className="bg-white p-4 rounded-lg shadow-inner mt-4 dark:bg-gray-800 transition-colors duration-300">
          <div className="flex items-center space-x-2">
            <label htmlFor="dark-mode-toggle-live" className="text-gray-800 dark:text-gray-200">
              Dark Mode:
            </label>
            <input
              type="checkbox"
              id="dark-mode-toggle-live"
              checked={isDarkMode}
              onChange={() => setIsDarkMode(!isDarkMode)}
              className="form-checkbox h-5 w-5 text-indigo-600 rounded cursor-pointer"
            />
          </div>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Toggle this to see the background of this section change (requires Tailwind CSS `dark:` variant setup).
          </p>
        </div>
      );
    },
    CheckboxListExample: () => {
      const allItems = [
        { id: 'item1', label: 'Option A' },
        { id: 'item2', label: 'Option B' },
        { id: 'item3', label: 'Option C' },
      ];
      const [selectedItems, setSelectedItems] = useState([]);
      const handleCheckboxChange = (e) => {
        const { value, checked } = e.target;
        if (checked) {
          setSelectedItems(prev => [...prev, value]);
        } else {
          setSelectedItems(prev => prev.filter(item => item !== value));
        }
      };
      return (
        <div className="bg-white p-4 rounded-lg shadow-inner mt-4">
          {allItems.map(item => (
            <label key={item.id} className="flex items-center space-x-2 mb-2 cursor-pointer">
              <input
                type="checkbox"
                value={item.id}
                checked={selectedItems.includes(item.id)}
                onChange={handleCheckboxChange}
                className="form-checkbox h-4 w-4 text-blue-600 rounded"
              />
              <span className="text-gray-800">{item.label}</span>
            </label>
          ))}
          <p className="mt-4 text-gray-700">
            Selected Items: <strong>{selectedItems.join(', ') || 'None'}</strong>
          </p>
        </div>
      );
    },
    AccordionExample: () => {
      const [isAccordionOpen, setIsAccordionOpen] = useState(false);
      return (
        <div className="bg-white p-4 rounded-lg shadow-inner mt-4">
          <div className="border border-gray-300 rounded-md">
            <button
              className="flex justify-between items-center w-full p-4 bg-gray-100 hover:bg-gray-200 font-semibold rounded-t-md focus:outline-none transition duration-200"
              onClick={() => setIsAccordionOpen(!isAccordionOpen)}
            >
              <span>Click to Toggle Content</span>
              <span>{isAccordionOpen ? '▲' : '▼'}</span>
            </button>
            {isAccordionOpen && (
              <div className="p-4 border-t border-gray-300 bg-white rounded-b-md animate-fade-in">
                <p>This is the hidden content inside the accordion.</p>
                <p>It will expand and collapse smoothly.</p>
              </div>
            )}
          </div>
        </div>
      );
    },
    StarRatingExample: () => {
      const [rating, setRating] = useState(0);
      const [hoverRating, setHoverRating] = useState(0);
      return (
        <div className="bg-white p-4 rounded-lg shadow-inner mt-4">
          <div className="flex">
            {[1, 2, 3, 4, 5].map((starId) => (
              <Star
                key={starId}
                starId={starId}
                selected={starId <= (hoverRating || rating)}
                onSelect={setRating}
                onHover={setHoverRating}
                onLeave={() => setHoverRating(0)}
              />
            ))}
            <p className="ml-4 text-lg text-gray-700">Rating: <strong>{rating}</strong> / 5</p>
          </div>
        </div>
      );
    },
  };

  // Effect to handle scrolling to a specific section when navigationTarget changes
  useEffect(() => {
    if (navigationTarget.sectionId) {
      const element = document.getElementById(navigationTarget.sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        setNavigationTarget(prev => ({ ...prev, sectionId: null })); // Reset sectionId
      }
    }
  }, [navigationTarget]);

  const CurrentPage = ({ page }) => {
    switch (page) {
      case 'fundamentals':
        return <ReactFundamentals pageData={appContent.fundamentals} liveComponents={liveComponents} />;
      case 'state-events':
        return <ReactStateAndEvents pageData={appContent['state-events']} liveComponents={liveComponents} />;
      case 'advanced-state':
        return <ReactAdvancedState pageData={appContent['advanced-state']} liveComponents={liveComponents} />;
      case 'advanced-concepts':
        return <ReactAdvancedConcepts pageData={appContent['advanced-concepts']} liveComponents={liveComponents} />;
      case 'effects':
        return <ReactEffectsTutorial pageData={appContent.effects} liveComponents={liveComponents} />;
      case 'project-examples':
        return <ProjectExamples pageData={appContent['project-examples']} liveComponents={liveComponents} />;
      case 'node-js-concepts':
        return <NodeJsConcepts pageData={appContent['node-js-concepts']} liveComponents={liveComponents} />;
      case 'about-me':
        return <AboutMe pageData={appContent['about-me']} liveComponents={liveComponents} />;
      default:
        return <AboutMe pageData={appContent['about-me']} liveComponents={liveComponents} />; // Default to About Me
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 p-8 font-inter text-gray-800 flex">
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700&display=swap');

          .animate-pulse-custom {
            animation: pulse-custom 1s infinite alternate;
          }

          @keyframes pulse-custom {
            from {
              transform: scale(1);
              opacity: 1;
            }
            to {
              transform: scale(1.05);
              opacity: 0.8;
            }
          }
        `}
      </style>

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 bg-gray-800 text-white w-64 p-6 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out z-40 md:relative md:translate-x-0`}>
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-white">React App</h2>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="text-white text-3xl md:hidden focus:outline-none"
          >
            &times;
          </button>
        </div>
        <nav className="space-y-4">
          {/* Grouped React Concepts */}
          <div>
            <button
              onClick={() => setIsReactConceptsExpanded(!isReactConceptsExpanded)}
              className={`flex items-center justify-between w-full text-left py-2 px-4 rounded-md font-semibold transition duration-300 ${isReactConceptsExpanded ? 'bg-gray-700 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}`}
            >
              <span>React Concepts</span>
              <span>{isReactConceptsExpanded ? '▲' : '▼'}</span>
            </button>
            {isReactConceptsExpanded && (
              <div className="ml-4 mt-2 space-y-2"> {/* Indent nested items */}
                <button
                  onClick={() => { setNavigationTarget({ page: 'fundamentals', sectionId: null }); setIsSidebarOpen(false); }}
                  className={`block w-full text-left py-2 px-4 rounded-md font-semibold transition duration-300 ${
                    navigationTarget.page === 'fundamentals' ? 'bg-indigo-600 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  React Fundamentals
                </button>
                <button
                  onClick={() => { setNavigationTarget({ page: 'state-events', sectionId: null }); setIsSidebarOpen(false); }}
                  className={`block w-full text-left py-2 px-4 rounded-md font-semibold transition duration-300 ${
                    navigationTarget.page === 'state-events' ? 'bg-indigo-600 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  React State & Events
                </button>
                <button
                  onClick={() => { setNavigationTarget({ page: 'advanced-state', sectionId: null }); setIsSidebarOpen(false); }}
                  className={`block w-full text-left py-2 px-4 rounded-md font-semibold transition duration-300 ${
                    navigationTarget.page === 'advanced-state' ? 'bg-indigo-600 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  React Advanced State
                </button>
                <button
                  onClick={() => { setNavigationTarget({ page: 'advanced-concepts', sectionId: null }); setIsSidebarOpen(false); }}
                  className={`block w-full text-left py-2 px-4 rounded-md font-semibold transition duration-300 ${
                    navigationTarget.page === 'advanced-concepts' ? 'bg-indigo-600 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  React Advanced Concepts
                </button>
                <button
                  onClick={() => { setNavigationTarget({ page: 'effects', sectionId: null }); setIsSidebarOpen(false); }}
                  className={`block w-full text-left py-2 px-4 rounded-md font-semibold transition duration-300 ${
                    navigationTarget.page === 'effects' ? 'bg-indigo-600 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  React Effects Tutorial
                </button>
              </div>
            )}
          </div>

          <button
            onClick={() => { setNavigationTarget({ page: 'project-examples', sectionId: null }); setIsSidebarOpen(false); }}
            className={`block w-full text-left py-2 px-4 rounded-md font-semibold transition duration-300 ${
              navigationTarget.page === 'project-examples' ? 'bg-indigo-600 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'
            }`}
          >
            Project Examples
          </button>
          <button
            onClick={() => { setNavigationTarget({ page: 'node-js-concepts', sectionId: null }); setIsSidebarOpen(false); }}
            className={`block w-full text-left py-2 px-4 rounded-md font-semibold transition duration-300 ${
              navigationTarget.page === 'node-js-concepts' ? 'bg-indigo-600 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'
            }`}
          >
            Node.js Concepts (Coming Soon!)
          </button>
          <button
            onClick={() => { setNavigationTarget({ page: 'about-me', sectionId: null }); setIsSidebarOpen(false); }}
            className={`block w-full text-left py-2 px-4 rounded-md font-semibold transition duration-300 ${
              navigationTarget.page === 'about-me' ? 'bg-indigo-600 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'
            }`}
          >
            About Me
          </button>
        </nav>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 p-4 md:ml-0"> {/* Adjusted margin for main content */}
        {/* Hamburger menu for mobile */}
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="md:hidden text-gray-800 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 mb-4"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
          </svg>
        </button>

        <div className="max-w-4xl mx-auto bg-white p-8 rounded-2xl shadow-xl">
          <CurrentPage page={navigationTarget.page} />
          <div className="text-center mt-10 text-gray-600 text-sm">
            <p>&copy; 2025 React Tutorials</p>
          </div>
        </div>
      </div>
    </div>
  );
}
