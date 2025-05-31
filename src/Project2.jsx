import React, { useState, useEffect, createContext, useContext, useRef, useReducer, useCallback } from 'react';

// 0. Tailwind CSS is assumed to be available (e.g., via CDN in index.html)

// 1. Theme Context: Used for sharing theme (light/dark) across components without prop drilling.
const ThemeContext = createContext('light');

// 2. Helper function to generate unique IDs for list items.
const generateId = () => Math.random().toString(36).substr(2, 9);

// Helper function to convert a string title into a URL-friendly slug (ID)
const slugify = (text) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/[^-\w]+/g, '') // Remove all non-word chars except dashes
    .replace(/--+/g, '-'); // Replace multiple - with single -
};

// --- Code Strings for Blog Section (These are for display purposes in the showcase) ---

// NEW SECTIONS - Components: UI building blocks
const componentsIntroCode = `
/*
Components are the fundamental building blocks of React applications.
They are independent, reusable pieces of UI. Think of them like
JavaScript functions that return React elements (markup).

- Encapsulation: Each component manages its own state and logic.
- Reusability: Components can be used multiple times in different parts of your application.
- Composition: Complex UIs are built by composing smaller, simpler components together.
*/

// Example: A simple functional component
function WelcomeMessage({ name }) {
  return (
    <div className="p-4 bg-blue-100 rounded-lg shadow-md">
      <p className="text-blue-800 text-lg">Hello, {name}!</p>
      <p className="text-blue-600 text-sm">Welcome to the React demo.</p>
    </div>
  );
}

// Usage in App:
// <WelcomeMessage name="Alice" />
`;

// Props: Passing data to components
const propsCode = `
/*
Props (short for properties) are how you pass data from a parent
component to a child component. They are read-only, meaning a child
component should not modify the props it receives.

- Unidirectional Data Flow: Data flows down the component tree.
- Customization: Props allow components to be dynamic and reusable
  by accepting different data for different instances.
*/

// Example: A Button component that accepts 'label' and 'onClick' props
function CustomButton({ label, onClick, type = 'button' }) {
  return (
    <button
      type={type}
      onClick={onClick}
      className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors duration-200"
    >
      {label}
    </button>
  );
}

// Usage in App:
// <CustomButton label="Click Me" onClick={() => alert('Button Clicked!')} />
`;

// State: Managing component-specific data
const stateCode = `
/*
State is data that changes over time within a component. When state
changes, React re-renders the component and its children. The 'useState'
hook is used in functional components to add state.

- Dynamic UI: State enables interactive and dynamic user interfaces.
- Local to Component: State is typically managed within the component
  where it's declared.
*/

// Example: A Counter component using useState
function Counter() {
  const [count, setCount] = useState(0); // Initialize count to 0

  const increment = () => setCount(prevCount => prevCount + 1);
  const decrement = () => setCount(prevCount => prevCount - 1);

  return (
    <div className="p-4 bg-purple-100 rounded-lg shadow-md flex items-center justify-center space-x-4">
      <button
        onClick={decrement}
        className="px-3 py-1 bg-purple-500 text-white rounded-md hover:bg-purple-600 transition-colors"
      >
        -
      </button>
      <span className="text-purple-800 text-2xl font-bold">{count}</span>
      <button
        onClick={increment}
        className="px-3 py-1 bg-purple-500 text-white rounded-md hover:bg-purple-600 transition-colors"
      >
        +
      </button>
    </div>
  );
}

// Usage in App:
// <Counter />
`;

// Event Handling: Responding to user interactions
const eventHandlingCode = `
/*
Event handling in React is similar to HTML, but with camelCase event
names (e.g., 'onClick' instead of 'onclick'). You pass a function
as the event handler.

- Synthetic Events: React uses a 'SyntheticEvent' system for cross-browser
  consistency.
- Common Events: click, change, submit, mouseover, etc.
*/

// Example: An input field with an onChange handler
function InputLogger() {
  const [inputValue, setInputValue] = useState('');

  const handleChange = (event) => {
    setInputValue(event.target.value);
    console.log('Input changed:', event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault(); // Prevent default form submission behavior
    alert('Submitted value: ' + inputValue);
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-yellow-100 rounded-lg shadow-md flex flex-col space-y-3">
      <label htmlFor="logInput" className="text-yellow-800 font-medium">Type something:</label>
      <input
        id="logInput"
        type="text"
        value={inputValue}
        onChange={handleChange}
        className="p-2 border border-yellow-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
        placeholder="Start typing..."
      />
      <p className="text-sm text-yellow-700">Current Value: <span className="font-semibold">{inputValue}</span></p>
      <button
        type="submit"
        className="px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition-colors duration-200"
      >
        Submit
      </button>
    </form>
  );
}

// Usage in App:
// <InputLogger />
`;

// Conditional Rendering: Displaying elements based on conditions
const conditionalRenderingCode = `
/*
Conditional rendering allows you to render different elements or components
based on certain conditions. Common methods include:

- 'if' statements
- Ternary operator (condition ? true_render : false_render)
- Logical && operator (condition && render_if_true)
*/

// Example: Showing a message based on a boolean prop
function Greeting({ isLoggedIn }) {
  return (
    <div className="p-4 bg-red-100 rounded-lg shadow-md text-center">
      {isLoggedIn ? (
        <p className="text-red-800 text-lg font-semibold">Welcome back!</p>
      ) : (
        <p className="text-red-600 text-lg">Please log in.</p>
      )}
    </div>
  );
}

// Usage in App:
// <Greeting isLoggedIn={true} />
// <Greeting isLoggedIn={false} />
`;

// List Rendering: Displaying collections of data
const listRenderingCode = `
/*
To render lists of items in React, you typically use the 'map()' array method.
Each item in the list should have a unique 'key' prop. The key helps React
efficiently update and reorder list items.

- 'key' prop: Essential for performance and correct behavior when lists change.
- Unique values: Keys should be unique among siblings.
*/

// Example: Rendering a list of fruits
function FruitList({ fruits }) {
  return (
    <ul className="list-disc list-inside p-4 bg-indigo-100 rounded-lg shadow-md">
      <h3 className="text-indigo-800 text-xl font-semibold mb-2">My Fruits:</h3>
      {fruits.map(fruit => (
        <li key={fruit.id} className="text-indigo-700 text-base">
          {fruit.name}
        </li>
      ))}
    </ul>
  );
}

// Usage in App:
// const myFruits = [{ id: 'a1', name: 'Apple' }, { id: 'b2', name: 'Banana' }];
// <FruitList fruits={myFruits} />
`;

// useState Hook: Adding state to functional components
const useStateHookCode = `
/*
'useState' is a React Hook that lets you add state to functional components.
It returns a pair: the current state value and a function that lets you
update it.

Syntax: const [stateValue, setStateValue] = useState(initialValue);
*/

// Example: A simple toggle switch
function ToggleSwitch() {
  const [isOn, setIsOn] = useState(false); // Initial state is 'false'

  const handleToggle = () => {
    setIsOn(prevIsOn => !prevIsOn); // Toggle the state
  };

  return (
    <div className="p-4 bg-teal-100 rounded-lg shadow-md flex items-center justify-between">
      <span className="text-teal-800 text-lg">Status: {isOn ? 'ON' : 'OFF'}</span>
      <button
        onClick={handleToggle}
        className={\`px-4 py-2 rounded-full transition-all duration-300 \${
          isOn ? 'bg-teal-500 text-white' : 'bg-gray-300 text-gray-700'
        }\`}
      >
        {isOn ? 'Turn Off' : 'Turn On'}
      </button>
    </div>
  );
}

// Usage in App:
// <ToggleSwitch />
`;

// useEffect Hook: Performing side effects
const useEffectHookCode = `
/*
'useEffect' is a React Hook that lets you perform side effects in
functional components. Side effects include data fetching, subscriptions,
or manually changing the DOM.

Syntax: useEffect(() => { /* side effect code *\/ }, [dependencies]);

- Runs after every render by default.
- Can be configured to run only when certain dependencies change (dependency array).
- Returns a cleanup function for effects like subscriptions.
*/

// Example: Fetching data on component mount
function DataFetcher({ userId }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // This effect runs when userId changes or on initial mount
    setLoading(true);
    setError(null);
    setData(null); // Clear previous data

    const fetchData = async () => {
      try {
        // Simulate API call
        const response = await new Promise(resolve => setTimeout(() => {
          if (userId === 1) {
            resolve({ id: 1, name: 'John Doe', email: 'john@example.com' });
          } else if (userId === 2) {
            resolve({ id: 2, name: 'Jane Smith', email: 'jane@example.com' });
          } else {
            throw new Error('User not found');
          }
        }, 1000));
        setData(response);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    // Cleanup function (optional)
    return () => {
      // Any cleanup for subscriptions, timers, etc.
      console.log('Cleanup for DataFetcher for userId:', userId);
    };
  }, [userId]); // Dependency array: effect re-runs if userId changes

  if (loading) return <div className="p-4 bg-blue-50 rounded-lg shadow-md text-blue-700">Loading user data...</div>;
  if (error) return <div className="p-4 bg-red-50 rounded-lg shadow-md text-red-700">Error: {error}</div>;

  return (
    <div className="p-4 bg-blue-100 rounded-lg shadow-md">
      <h3 className="text-blue-800 text-xl font-semibold mb-2">User Details (ID: {userId})</h3>
      <p className="text-blue-700">Name: {data.name}</p>
      <p className="text-blue-700">Email: {data.email}</p>
    </div>
  );
  }

// Usage in App:
// <DataFetcher userId={1} />
// <DataFetcher userId={2} />
`;

// useContext Hook: Consuming context
const useContextHookCode = `
/*
'useContext' is a React Hook that lets you read and subscribe to context
from your component. It simplifies passing data through the component tree
without prop drilling.

Syntax: const value = useContext(MyContext);
*/

// Example: Consuming the ThemeContext
function ThemedComponent() {
  const theme = useContext(ThemeContext); // Access the current theme value

  return (
    <div className={\`p-4 rounded-lg shadow-md \${
      theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
    }\`}>
      <p className="text-lg font-semibold">This component respects the theme!</p>
      <p>Current theme: <span className="font-bold capitalize">{theme}</span></p>
    </div>
  );
}

// Usage in App (requires ThemeContext.Provider higher up):
// <ThemeContext.Provider value="dark">
//   <ThemedComponent />
// </ThemeContext.Provider>
`;

// useRef Hook: Accessing DOM elements or mutable values
const useRefHookCode = `
/*
'useRef' is a React Hook that lets you reference a value that's not needed
for rendering. It's commonly used for:

- Accessing DOM elements directly.
- Storing a mutable value that doesn't trigger re-renders when changed.

Syntax: const refContainer = useRef(initialValue);
  - refContainer.current holds the mutable value/DOM element.
*/

// Example: Focusing an input field on button click
function FocusInput() {
  const inputRef = useRef(null); // Create a ref object

  const handleFocus = () => {
    if (inputRef.current) {
      inputRef.current.focus(); // Access the DOM element and call focus()
    }
  };

  return (
    <div className="p-4 bg-orange-100 rounded-lg shadow-md flex flex-col space-y-3">
      <input
        ref={inputRef} // Attach the ref to the input element
        type="text"
        className="p-2 border border-orange-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400"
        placeholder="Click button to focus me..."
      />
      <button
        onClick={handleFocus}
        className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors duration-200"
      >
        Focus Input
      </button>
    </div>
  );
}

// Usage in App:
// <FocusInput />
`;

// useReducer Hook: Complex state logic
const useReducerHookCode = `
/*
'useReducer' is a React Hook for state management, often preferred over
'useState' for more complex state logic that involves multiple sub-values
or when the next state depends on the previous one.

It's an alternative to useState.
Syntax: const [state, dispatch] = useReducer(reducer, initialState);
  - 'reducer': A pure function that takes the current state and an action,
    and returns the new state.
  - 'dispatch': A function used to dispatch actions to the reducer.
*/

// Example: A more complex counter with actions
const counterReducer = (state, action) => {
  switch (action.type) {
    case 'INCREMENT':
      return { count: state.count + 1 };
    case 'DECREMENT':
      return { count: state.count - 1 };
    case 'RESET':
      return { count: 0 };
    case 'SET_VALUE':
      return { count: action.payload };
    default:
      return state;
  }
};

function ComplexCounter() {
  const [state, dispatch] = useReducer(counterReducer, { count: 0 });

  return (
    <div className="p-4 bg-lime-100 rounded-lg shadow-md flex flex-col space-y-3">
      <p className="text-lime-800 text-2xl font-bold text-center">Count: {state.count}</p>
      <div className="flex justify-center space-x-2">
        <button
          onClick={() => dispatch({ type: 'INCREMENT' })}
          className="px-3 py-1 bg-lime-500 text-white rounded-md hover:bg-lime-600 transition-colors"
        >
          Increment
        </button>
        <button
          onClick={() => dispatch({ type: 'DECREMENT' })}
          className="px-3 py-1 bg-lime-500 text-white rounded-md hover:bg-lime-600 transition-colors"
        >
          Decrement
        </button>
        <button
          onClick={() => dispatch({ type: 'RESET' })}
          className="px-3 py-1 bg-lime-500 text-white rounded-md hover:bg-lime-600 transition-colors"
        >
          Reset
        </button>
      </div>
      <div className="flex justify-center space-x-2">
        <input
          type="number"
          className="p-2 border border-lime-300 rounded-md w-24"
          placeholder="Set value"
          onChange={(e) => dispatch({ type: 'SET_VALUE', payload: parseInt(e.target.value) || 0 })}
        />
      </div>
    </div>
  );
}

// Usage in App:
// <ComplexCounter />
`;

// useCallback Hook: Memoizing functions
const useCallbackHookCode = `
/*
'useCallback' is a React Hook that returns a memoized callback function.
It's useful for optimizing performance by preventing unnecessary re-renders
of child components that rely on callback props.

Syntax: const memoizedCallback = useCallback(() => { /* function body *\/ }, [dependencies]);
  - The function is only re-created if its dependencies change.
*/

// Example: Preventing re-render of a child component
// (Simulated child component that logs when it renders)
const MemoizedButton = React.memo(({ onClick, label }) => {
  console.log('MemoizedButton rendered:', label);
  return (
    <button
      onClick={onClick}
      className="px-4 py-2 bg-pink-500 text-white rounded-md hover:bg-pink-600 transition-colors duration-200"
    >
      {label}
    </button>
  );
});

function ParentComponentWithCallback() {
  const [count, setCount] = useState(0);
  const [text, setText] = useState('');

  // This function will be re-created on every render if not memoized
  // const handleClick = () => {
  //   setCount(prevCount => prevCount + 1);
  //   alert('Count updated!');
  // };

  // Memoized version: handleClick will only change if 'count' changes
  const handleClick = useCallback(() => {
    setCount(prevCount => prevCount + 1);
    // In a real app, you might avoid alerts in callbacks for better UX
    // alert('Count updated!');
    console.log('Count updated via memoized callback!');
  }, []); // Empty dependency array means it's created once

  return (
    <div className="p-4 bg-pink-100 rounded-lg shadow-md flex flex-col space-y-3">
      <p className="text-pink-800 text-lg">Parent Count: {count}</p>
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="p-2 border border-pink-300 rounded-md"
        placeholder="Type here to trigger parent re-render"
      />
      {/* MemoizedButton will not re-render when 'text' changes, only when 'handleClick' changes */}
      <MemoizedButton onClick={handleClick} label="Increment Count (Memoized)" />
      <p className="text-sm text-pink-700">
        Try typing in the input. Notice 'MemoizedButton rendered' only logs on initial render or if handleClick's dependencies change.
      </p>
    </div>
  );
}

// Usage in App:
// <ParentComponentWithCallback />
`;

// 3. CodeBlock Component: Displays code and its live output.
// This component is designed to be reusable for showcasing different React concepts.
const CodeBlock = ({ id, title, codeString, ComponentToRender, sampleProps = {} }) => {
  const theme = useContext(ThemeContext); // Access the current theme

  return (
    <div id={id} className={`mb-10 p-6 rounded-xl shadow-lg transition-all duration-300
      ${theme === 'dark' ? 'bg-gray-800 text-gray-100' : 'bg-white text-gray-900'}
      border ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}
      max-w-full overflow-hidden
    `}>
      <h3 className={`text-xl sm:text-2xl font-semibold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
        {title}
      </h3>

      {/* Code Display Area */}
      <div className={`bg-gray-100 dark:bg-gray-900 p-4 rounded-lg mb-6 overflow-x-auto text-sm sm:text-base font-mono
        border border-gray-200 dark:border-gray-700`}>
        <pre><code className="whitespace-pre-wrap">{codeString}</code></pre>
      </div>

      {/* Live Output Area */}
      {ComponentToRender && (
        <div className={`p-4 rounded-lg border-2 border-dashed
          ${theme === 'dark' ? 'border-blue-600 bg-gray-900' : 'border-blue-300 bg-blue-50'}
          flex justify-center items-center min-h-[100px]
        `}>
          <div className="w-full"> {/* Ensure the rendered component takes full width */}
            <ComponentToRender {...sampleProps} />
          </div>
        </div>
      )}
    </div>
  );
};

// 4. Main App Component
const App = () => {
  const [theme, setTheme] = useState('light'); // State for theme management

  // Toggle theme function
  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  // Effect to apply theme to body class
  useEffect(() => {
    document.body.className = theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50';
  }, [theme]);

  // Define the structured topics and their snippets
  const reactConceptsTopics = [
    {
      title: "Core React Building Blocks",
      description: "Understanding the fundamental elements that make up a React application.",
      snippets: [
        {
          title: "Components: The UI Units",
          code: componentsIntroCode,
          ComponentToRender: ({ name }) => {
            // Example: A simple functional component
            return (
              <div className="p-4 bg-blue-100 rounded-lg shadow-md">
                <p className="text-blue-800 text-lg">Hello, {name}!</p>
                <p className="text-blue-600 text-sm">Welcome to the React demo.</p>
              </div>
            );
          },
          sampleProps: { name: "React Enthusiast" }
        },
        {
          title: "Props: Passing Data Down",
          code: propsCode,
          ComponentToRender: ({ label, onClick, type = 'button' }) => {
            // Example: A Button component that accepts 'label' and 'onClick' props
            return (
              <button
                type={type}
                onClick={onClick}
                className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors duration-200"
              >
                {label}
              </button>
            );
          },
          sampleProps: { label: "Click Me", onClick: () => alert('Button Clicked!') }
        },
        {
          title: "State: Managing Dynamic Data",
          code: stateCode,
          ComponentToRender: () => {
            // Example: A Counter component using useState
            const [count, setCount] = useState(0); // Initialize count to 0

            const increment = () => setCount(prevCount => prevCount + 1);
            const decrement = () => setCount(prevCount => prevCount - 1);

            return (
              <div className="p-4 bg-purple-100 rounded-lg shadow-md flex items-center justify-center space-x-4">
                <button
                  onClick={decrement}
                  className="px-3 py-1 bg-purple-500 text-white rounded-md hover:bg-purple-600 transition-colors"
                >
                  -
                </button>
                <span className="text-purple-800 text-2xl font-bold">{count}</span>
                <button
                  onClick={increment}
                  className="px-3 py-1 bg-purple-500 text-white rounded-md hover:bg-purple-600 transition-colors"
                >
                  +
                </button>
              </div>
            );
          }
        },
        {
          title: "Event Handling: User Interactions",
          code: eventHandlingCode,
          ComponentToRender: () => {
            // Example: An input field with an onChange handler
            const [inputValue, setInputValue] = useState('');

            const handleChange = (event) => {
              setInputValue(event.target.value);
              // In a real app, use a custom modal or console.log for debugging
              // console.log('Input changed:', event.target.value);
            };

            const handleSubmit = (event) => {
              event.preventDefault(); // Prevent default form submission behavior
              // In a real app, use a custom modal instead of alert
              alert('Submitted value: ' + inputValue);
            };

            return (
              <form onSubmit={handleSubmit} className="p-4 bg-yellow-100 rounded-lg shadow-md flex flex-col space-y-3">
                <label htmlFor="logInput" className="text-yellow-800 font-medium">Type something:</label>
                <input
                  id="logInput"
                  type="text"
                  value={inputValue}
                  onChange={handleChange}
                  className="p-2 border border-yellow-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  placeholder="Start typing..."
                />
                <p className="text-sm text-yellow-700">Current Value: <span className="font-semibold">{inputValue}</span></p>
                <button
                  type="submit"
                  className="px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition-colors duration-200"
                >
                  Submit
                </button>
              </form>
            );
          }
        },
        {
          title: "Conditional Rendering: Show/Hide UI",
          code: conditionalRenderingCode,
          ComponentToRender: ({ isLoggedIn }) => {
            // Example: Showing a message based on a boolean prop
            return (
              <div className="p-4 bg-red-100 rounded-lg shadow-md text-center">
                {isLoggedIn ? (
                  <p className="text-red-800 text-lg font-semibold">Welcome back!</p>
                ) : (
                  <p className="text-red-600 text-lg">Please log in.</p>
                )}
              </div>
            );
          },
          sampleProps: { isLoggedIn: true }
        },
        {
          title: "List Rendering: Displaying Collections",
          code: listRenderingCode,
          ComponentToRender: ({ fruits }) => {
            // Example: Rendering a list of fruits
            return (
              <ul className="list-disc list-inside p-4 bg-indigo-100 rounded-lg shadow-md">
                <h3 className="text-indigo-800 text-xl font-semibold mb-2">My Fruits:</h3>
                {fruits.map(fruit => (
                  <li key={fruit.id} className="text-indigo-700 text-base">
                    {fruit.name}
                  </li>
                ))}
              </ul>
            );
          },
          sampleProps: { fruits: [{ id: generateId(), name: 'Apple' }, { id: generateId(), name: 'Banana' }, { id: generateId(), name: 'Cherry' }] }
        },
      ]
    },
    {
      title: "React Hooks: Advanced Features",
      description: "Functions that let you use React features like state and lifecycle methods in functional components.",
      snippets: [
        {
          title: "useState: Basic State Management",
          code: useStateHookCode,
          ComponentToRender: () => {
            // Example: A simple toggle switch
            const [isOn, setIsOn] = useState(false); // Initial state is 'false'

            const handleToggle = () => {
              setIsOn(prevIsOn => !prevIsOn); // Toggle the state
            };

            return (
              <div className="p-4 bg-teal-100 rounded-lg shadow-md flex items-center justify-between">
                <span className="text-teal-800 text-lg">Status: {isOn ? 'ON' : 'OFF'}</span>
                <button
                  onClick={handleToggle}
                  className={`px-4 py-2 rounded-full transition-all duration-300 ${
                    isOn ? 'bg-teal-500 text-white' : 'bg-gray-300 text-gray-700'
                  }`}
                >
                  {isOn ? 'Turn Off' : 'Turn On'}
                </button>
              </div>
            );
          }
        },
        {
          title: "useEffect: Side Effects in Components",
          code: useEffectHookCode,
          ComponentToRender: ({ userId }) => {
            const [data, setData] = useState(null);
            const [loading, setLoading] = useState(true);
            const [error, setError] = useState(null);

            useEffect(() => {
              setLoading(true);
              setError(null);
              setData(null);

              const fetchData = async () => {
                try {
                  const response = await new Promise(resolve => setTimeout(() => {
                    if (userId === 1) {
                      resolve({ id: 1, name: 'John Doe', email: 'john@example.com' });
                    } else if (userId === 2) {
                      resolve({ id: 2, name: 'Jane Smith', email: 'jane@example.com' });
                    } else {
                      throw new Error('User not found');
                    }
                  }, 1000));
                  setData(response);
                } catch (err) {
                  setError(err.message);
                } finally {
                  setLoading(false);
                }
              };

              fetchData();

              return () => {
                console.log('Cleanup for DataFetcher for userId:', userId);
              };
            }, [userId]);

            if (loading) return <div className="p-4 bg-blue-50 rounded-lg shadow-md text-blue-700">Loading user data...</div>;
            if (error) return <div className="p-4 bg-red-50 rounded-lg shadow-md text-red-700">Error: {error}</div>;

            return (
              <div className="p-4 bg-blue-100 rounded-lg shadow-md">
                <h3 className="text-blue-800 text-xl font-semibold mb-2">User Details (ID: {userId})</h3>
                <p className="text-blue-700">Name: {data.name}</p>
                <p className="text-blue-700">Email: {data.email}</p>
              </div>
            );
          },
          sampleProps: { userId: 1 }
        },
        {
          title: "useContext: Global State Access",
          code: useContextHookCode,
          ComponentToRender: () => {
            const theme = useContext(ThemeContext);

            return (
              <div className={`p-4 rounded-lg shadow-md ${
                theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
              }`}>
                <p className="text-lg font-semibold">This component respects the theme!</p>
                <p>Current theme: <span className="font-bold capitalize">{theme}</span></p>
              </div>
            );
          }
        },
        {
          title: "useRef: Direct DOM Access & Mutable Values",
          code: useRefHookCode,
          ComponentToRender: () => {
            const inputRef = useRef(null);

            const handleFocus = () => {
              if (inputRef.current) {
                inputRef.current.focus();
              }
            };

            return (
              <div className="p-4 bg-orange-100 rounded-lg shadow-md flex flex-col space-y-3">
                <input
                  ref={inputRef}
                  type="text"
                  className="p-2 border border-orange-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400"
                  placeholder="Click button to focus me..."
                />
                <button
                  onClick={handleFocus}
                  className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors duration-200"
                >
                  Focus Input
                </button>
              </div>
            );
          }
        },
        {
          title: "useReducer: Complex State Logic",
          code: useReducerHookCode,
          ComponentToRender: () => {
            const counterReducer = (state, action) => {
              switch (action.type) {
                case 'INCREMENT':
                  return { count: state.count + 1 };
                case 'DECREMENT':
                  return { count: state.count - 1 };
                case 'RESET':
                  return { count: 0 };
                case 'SET_VALUE':
                  return { count: action.payload };
                default:
                  return state;
              }
            };
            const [state, dispatch] = useReducer(counterReducer, { count: 0 });

            return (
              <div className="p-4 bg-lime-100 rounded-lg shadow-md flex flex-col space-y-3">
                <p className="text-lime-800 text-2xl font-bold text-center">Count: {state.count}</p>
                <div className="flex justify-center space-x-2">
                  <button
                    onClick={() => dispatch({ type: 'INCREMENT' })}
                    className="px-3 py-1 bg-lime-500 text-white rounded-md hover:bg-lime-600 transition-colors"
                  >
                    Increment
                  </button>
                  <button
                    onClick={() => dispatch({ type: 'DECREMENT' })}
                    className="px-3 py-1 bg-lime-500 text-white rounded-md hover:bg-lime-600 transition-colors"
                  >
                    Decrement
                  </button>
                  <button
                    onClick={() => dispatch({ type: 'RESET' })}
                    className="px-3 py-1 bg-lime-500 text-white rounded-md hover:bg-lime-600 transition-colors"
                  >
                    Reset
                  </button>
                </div>
                <div className="flex justify-center space-x-2">
                  <input
                    type="number"
                    className="p-2 border border-lime-300 rounded-md w-24"
                    placeholder="Set value"
                    onChange={(e) => dispatch({ type: 'SET_VALUE', payload: parseInt(e.target.value) || 0 })}
                  />
                </div>
              </div>
            );
          }
        },
        {
          title: "useCallback: Memoizing Functions for Performance",
          code: useCallbackHookCode,
          ComponentToRender: () => {
            const MemoizedButton = React.memo(({ onClick, label }) => {
              console.log('MemoizedButton rendered:', label);
              return (
                <button
                  onClick={onClick}
                  className="px-4 py-2 bg-pink-500 text-white rounded-md hover:bg-pink-600 transition-colors duration-200"
                >
                  {label}
                </button>
              );
            });

            const [count, setCount] = useState(0);
            const [text, setText] = useState('');

            const handleClick = useCallback(() => {
              setCount(prevCount => prevCount + 1);
              console.log('Count updated via memoized callback!');
            }, []);

            return (
              <div className="p-4 bg-pink-100 rounded-lg shadow-md flex flex-col space-y-3">
                <p className="text-pink-800 text-lg">Parent Count: {count}</p>
                <input
                  type="text"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  className="p-2 border border-pink-300 rounded-md"
                  placeholder="Type here to trigger parent re-render"
                />
                <MemoizedButton onClick={handleClick} label="Increment Count (Memoized)" />
                <p className="text-sm text-pink-700">
                  Try typing in the input. Notice 'MemoizedButton rendered' only logs on initial render or if handleClick's dependencies change.
                </p>
              </div>
            );
          }
        },
      ]
    }
    // Add more topics and their snippets here as needed
  ];


  return (
    // ThemeContext.Provider makes the theme available to all child components
    <ThemeContext.Provider value={theme}>
      <div className={`min-h-screen font-sans antialiased transition-colors duration-300 ${theme === 'dark' ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-900'}`}>
        <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8 max-w-screen-xl"> {/* Constrain width */}
          {/* Header Section */}
          <header className={`flex flex-col sm:flex-row justify-between items-center mb-10 pb-6 border-b
            ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}
          `}>
            <h1 className={`text-3xl sm:text-4xl font-extrabold text-center sm:text-left mb-4 sm:mb-0
              ${theme === 'dark' ? 'text-white' : 'text-gray-900'}
            `}>
              React Concepts Showcase
            </h1>
            <button
              onClick={toggleTheme}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300
                ${theme === 'dark' ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-md' : 'bg-blue-500 hover:bg-blue-600 text-white shadow-md'}
                focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75
              `}
            >
              Toggle Theme: {theme === 'light' ? 'Dark' : 'Light'}
            </button>
          </header>

          {/* Main Content Area */}
          <main>
            {/* Introduction Section */}
            <section className={`mb-10 p-6 rounded-xl shadow-lg
              ${theme === 'dark' ? 'bg-gray-800 text-gray-100' : 'bg-white text-gray-900'}
              border ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}
            `}>
              <h2 className={`text-2xl sm:text-3xl font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
                Explore Core React Features
              </h2>
              <p className="mb-4 text-base sm:text-lg leading-relaxed">
                This interactive demo showcases fundamental React concepts, from basic components and state management
                to advanced hooks. Each section provides a code example and a live, runnable output to help you
                understand how these concepts work in practice.
              </p>
              <p className="text-base sm:text-lg leading-relaxed">
                Use the table of contents to quickly navigate to specific topics, or scroll down to explore everything.
              </p>
            </section>

            {/* Table of Contents / Navigation */}
            <section className={`mb-10 p-6 rounded-xl shadow-lg
              ${theme === 'dark' ? 'bg-gray-800 text-gray-100' : 'bg-white text-gray-900'}
              border ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}
            `}>
              <h2 className={`text-2xl sm:text-3xl font-bold mb-6 text-center
                ${theme === 'dark' ? 'text-white' : 'text-gray-800'}
              `}>
                Table of Contents
              </h2>
              <nav>
                <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {reactConceptsTopics.map(topic => (
                    <li key={slugify(topic.title)}>
                      <h3 className={`text-xl font-semibold mb-2 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-700'}`}>
                        {topic.title}
                      </h3>
                      <ul className="list-disc list-inside ml-4">
                        {topic.snippets.map(snippet => (
                          <li key={slugify(snippet.title)} className="mb-1">
                            <a
                              href={`#${slugify(snippet.title)}`}
                              className={`text-blue-500 hover:text-blue-700 dark:text-blue-300 dark:hover:text-blue-500
                                transition-colors duration-200 text-base sm:text-lg
                              `}
                            >
                              {snippet.title}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </li>
                  ))}
                </ul>
              </nav>
            </section>

            {/* Component Code and Output */}
            <section className="mt-10 pt-6 border-t border-gray-300 dark:border-gray-700">
              <h2 className={`text-2xl sm:text-3xl font-bold mb-6 text-center ${theme === 'dark' ? 'text-white' : 'text-black'}`}>
                Component Code & Output Showcase
              </h2>
              {/* Map through the topics array to display each topic and its components */}
              {reactConceptsTopics.map(topic => (
                <div key={slugify(topic.title)} className="mb-12">
                  <h3 className={`text-2xl sm:text-3xl font-bold mb-6 text-center
                    ${theme === 'dark' ? 'text-blue-300' : 'text-blue-800'}
                    border-b pb-3 mb-6 ${theme === 'dark' ? 'border-blue-700' : 'border-blue-200'}
                  `}>
                    {topic.title}
                  </h3>
                  <p className={`text-center mb-8 text-lg ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                    {topic.description}
                  </p>
                  {topic.snippets.map(snippet => (
                    <CodeBlock
                      key={slugify(snippet.title)} // Use slugified title as key
                      id={slugify(snippet.title)} // Pass slugified title as ID for scrolling
                      title={snippet.title}
                      codeString={snippet.code}
                      ComponentToRender={snippet.ComponentToRender}
                      sampleProps={snippet.sampleProps}
                    />
                  ))}
                </div>
              ))}
            </section>

            {/* Footer section */}
            <footer className={`mt-8 pt-6 border-t text-center text-xs sm:text-sm ${theme === 'dark' ? 'border-gray-700 text-gray-500' : 'border-gray-300 text-gray-600'}`}>
              <p>&copy; {new Date().getFullYear()} React Concepts Demo. All rights reserved.</p>
              <p>Illustrating core React features with code examples and live outputs.</p>
            </footer>
          </main>
        </div>
      </div>
    </ThemeContext.Provider>
  );
};

export default App;
