import React, { useState, useEffect, createContext, useContext, useRef, useReducer, useCallback, forwardRef, useImperativeHandle } from 'react';

// 0. Tailwind CSS is assumed to be available (e.g., via CDN in index.html)

// Helper function to generate unique IDs for list items.
const generateId = () => Math.random().toString(36).substr(2, 9);

// Helper function to convert a string title into a URL-friendly slug (ID)
const slugify = (text) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/[^\\w-]+/g, '') // Remove all non-word chars
    .replace(/--+/g, '-'); // Replace multiple - with single -
};

// Theme Context (reused from previous example)
const ThemeContext = createContext('light');

// CodeBlock Component (reused and adapted from previous example)
function CodeBlock({ id, title, codeString, ComponentToRender, sampleProps = {} }) {
  const theme = useContext(ThemeContext);
  const codeRef = useRef(null);

  useEffect(() => {
    if (codeRef.current) {
      // Basic syntax highlighting
      // The actual code string is now directly rendered, so manual HTML replacement is not needed here for content.
      // Highlighting can be done via CSS or a library if this was a real app.
      // For this project, we'll rely on the browser's default <pre><code> rendering with whitespace-pre-wrap.
    }
  }, [codeString]);

  const handleCopy = () => {
    // Copying the raw codeString is correct.
    const el = document.createElement('textarea');
    el.value = codeString;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
    const messageBox = document.getElementById('messageBox');
    const messageText = document.getElementById('messageText');
    if (messageBox && messageText) {
      messageText.textContent = 'Code copied to clipboard!';
      messageBox.classList.remove('hidden');
      setTimeout(() => messageBox.classList.add('hidden'), 1500);
    }
  };

  return (
    <section id={id} className={`mb-8 p-4 rounded-lg shadow-md ${theme === 'dark' ? 'bg-gray-800 text-gray-200' : 'bg-white text-gray-800'}`}>
      <h3 className={`text-xl font-semibold mb-3 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{title}</h3>

      {/* Code Display */}
      <div className={`relative bg-gray-900 rounded-md overflow-hidden mb-4 ${theme === 'dark' ? 'border border-gray-700' : ''}`}>
        <pre className="p-4 text-sm overflow-x-auto"> {/* overflow-x-auto is good if lines are very long and whitespace-pre-wrap is not used or for unbreakable strings */}
          <code ref={codeRef} className="language-javascript text-gray-50 whitespace-pre-wrap">
            {codeString}
          </code>
        </pre>
        <button
          onClick={handleCopy}
          className="absolute top-2 right-2 p-2 rounded-md bg-gray-700 text-gray-200 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="Copy code to clipboard"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
            <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2H6zM5 9a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z" />
          </svg>
        </button>
      </div>

      {/* Live Output */}
      {ComponentToRender && (
        <div className={`p-4 border-t-2 ${theme === 'dark' ? 'border-gray-700 bg-gray-900' : 'border-gray-200 bg-gray-50'} rounded-b-lg`}>
          <h4 className={`text-lg font-semibold mb-3 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Live Output:</h4>
          <div className="flex justify-center items-center p-4 min-h-[100px]">
            <ComponentToRender {...sampleProps} />
          </div>
        </div>
      )}
    </section>
  );
}

// ============================================================================
// 1. Single Responsibility Principle (SRP)
// ============================================================================
// This section demonstrates how to apply the Single Responsibility Principle
// by breaking down components and hooks into smaller, focused units.

// Step 1: Simulate an API call
// This function simulates fetching data from a backend.
const mockFetchData = () => new Promise(resolve => setTimeout(() => resolve({ message: 'Data fetched!' }), 1000));

// Step 2: Create a custom hook for data fetching (useFetchData.js)
// This hook is solely responsible for managing data fetching state (data, loading, error).
function useFetchData() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    mockFetchData()
      .then(response => {
        setData(response);
        setLoading(false);
      })
      .catch(err => {
        setError(err);
        setLoading(false);
      });
  }, []); // Empty dependency array means this effect runs once on mount

  return { data, loading, error };
}

// Step 3: Create a custom hook for analytics (usePageAnalytics.js)
// This hook is responsible for sending analytics events.
const sendAnalyticsEvent = (eventName, eventData) => {
  console.log(`Analytics Event: ${eventName}`, eventData);
  const messageBox = document.getElementById('messageBox');
  const messageText = document.getElementById('messageText');
  if (messageBox && messageText) {
    messageText.textContent = `Analytics: ${eventName} sent! Check console.`;
    messageBox.classList.remove('hidden');
    setTimeout(() => messageBox.classList.add('hidden'), 2000);
  }
};

function usePageAnalytics(event) {
  useEffect(() => {
    sendAnalyticsEvent('page_view', event);
  }, [event]); // Re-run if the event object changes
}

// Step 4: Create a dedicated Modal component (Modal.js)
// This component is responsible for managing its own open/close state and rendering its children as modal content.
function Modal({ children }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const theme = useContext(ThemeContext);

  function toggleModal() {
    setIsModalOpen(prev => !prev);
  }

  return (
    <>
      <button
        onClick={toggleModal}
        className={`py-2 px-4 rounded-lg font-semibold ${theme === 'dark' ? 'bg-blue-600 hover:bg-blue-500 text-white' : 'bg-blue-500 hover:bg-blue-600 text-white'}`}
      >
        {isModalOpen ? 'Close Modal' : 'Open Modal'}
      </button>
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"> {/* Added p-4 for modal container on small screens */}
          <div className={`p-4 sm:p-6 rounded-lg shadow-lg relative ${theme === 'dark' ? 'bg-gray-700 text-gray-100' : 'bg-white text-gray-900'}`}>
            {/* Added p-1 for easier touch target */}
            <button
              onClick={toggleModal}
              className={`absolute top-2 right-2 text-xl p-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} hover:text-red-500`}
            >
              &times;
            </button>
            {children}
          </div>
        </div>
      )}
    </>
  );
}

// Step 5: Create a "BigComponent" that orchestrates these smaller units
// This component's responsibility is to assemble and coordinate the other single-responsibility units.
function BigComponentSRP() {
  const { data, loading, error } = useFetchData(); // Using simulated hook
  const theme = useContext(ThemeContext);

  usePageAnalytics({ page: 'big_component_srp' }); // Using analytics hook

  return (
    <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-indigo-700 text-indigo-100' : 'bg-indigo-100 text-indigo-800'}`}>
      <h4 className="font-semibold mb-2">SRP Demo:</h4>
      {loading && <p>Loading data...</p>}
      {error && <p className="text-red-500">Error: {error.message}</p>}
      {data && <p>Data: {data.message}</p>}
      <Modal>
        <h5 className="text-lg font-bold mb-2">Modal Content</h5>
        <p>This modal is managed by its own component.</p>
      </Modal>
      <p className="text-sm italic mt-2">
        This component orchestrates smaller, single-responsibility units.
      </p>
    </div>
  );
}

// ============================================================================
// 2. Container and Presentation Components
// ============================================================================
// This pattern separates concerns into components that handle logic (container)
// and components that handle rendering UI (presentation).

// Step 1: Create a mock filter function (e.g., in a utils file)
const filterItems = (items, filters) => {
  if (!filters.searchTerm) return items;
  return items.filter(item =>
    item.name.toLowerCase().includes(filters.searchTerm.toLowerCase())
  );
};

// Step 2: Create a Presentation Component (ItemCard.js)
// Responsible for rendering a single item's UI.
function ItemCard({ item }) {
  const theme = useContext(ThemeContext);
  return (
    <div className={`p-3 border rounded-md mb-2 ${theme === 'dark' ? 'bg-gray-600 border-gray-500 text-gray-100' : 'bg-gray-50 border-gray-200 text-gray-700'}`}>
      <p className="font-semibold">{item.name}</p>
      <p className="text-sm">Category: {item.category}</p>
    </div>
  );
}

// Step 3: Create another Presentation Component (PresentationComponent.js)
// Responsible for rendering the list of items and the search input. It receives
// data and event handlers via props.
function PresentationComponent({ items, onSearchChange }) {
  const theme = useContext(ThemeContext);
  return (
    <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-purple-700 text-purple-100' : 'bg-purple-100 text-purple-800'}`}>
      <h4 className="font-semibold mb-2">Items List (UI)</h4>
      <input
        type="text"
        placeholder="Search items..."
        onChange={(e) => onSearchChange(e.target.value)}
        className={`p-2 border rounded w-full mb-4 ${theme === 'dark' ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 placeholder-gray-500'}`}
      />
      {items.length === 0 && <p className="italic">No items found.</p>}
      {items.map(item => (
        <ItemCard key={item.id} item={item} />
      ))}
    </div>
  );
}

// Step 4: Create a Container Component (ContainerComponent.js)
// Responsible for managing state, fetching data (if applicable), and passing
// filtered data and event handlers to the PresentationComponent.
function ContainerComponent() {
  const [allItems] = useState([
    { id: 1, name: 'Apple', category: 'Fruit' },
    { id: 2, name: 'Banana', category: 'Fruit' },
    { id: 3, name: 'Carrot', category: 'Vegetable' },
    { id: 4, name: 'Broccoli', category: 'Vegetable' },
  ]);
  const [filters, setFilters] = useState({ searchTerm: '' });
  const [filteredItems, setFilteredItems] = useState([]);

  useEffect(() => {
    setFilteredItems(filterItems(allItems, filters));
  }, [allItems, filters]);

  function handleSearchChange(searchTerm) {
    setFilters(prev => ({ ...prev, searchTerm }));
  }

  return <PresentationComponent items={filteredItems} onSearchChange={handleSearchChange} />;
}

// ============================================================================
// 3. Compound Components Pattern
// ============================================================================
// This pattern allows multiple components to work together with shared state
// and implicit communication, often using React Context.

// Step 1: Create a Context for the compound component's shared state
const ToggleContext = createContext(undefined);

// Step 2: Create the main "parent" component (Toggle.js)
// This component manages the shared state and provides it via context.
function Toggle({ children }) {
  const [on, setOn] = useState(false);
  const theme = useContext(ThemeContext);

  function toggle() {
    setOn(!on);
  }

  return (
    <ToggleContext.Provider value={{ on, toggle }}>
      <div className={`p-4 rounded-lg flex flex-col items-center justify-center space-y-3 ${theme === 'dark' ? 'bg-green-700 text-green-100' : 'bg-green-100 text-green-800'}`}>
        {children}
      </div>
    </ToggleContext.Provider>
  );
}

// Step 3: Create "child" components as properties of the parent (Toggle.On, Toggle.Off, Toggle.Button)
// These components consume the context to access the shared state and functions.
Toggle.On = function ToggleOn({ children }) {
  const { on } = useContext(ToggleContext);
  return on ? children : null;
};

Toggle.Off = function ToggleOff({ children }) {
  const { on } = useContext(ToggleContext);
  return on ? null : children;
};

Toggle.Button = function ToggleButton(props) {
  const { on, toggle } = useContext(ToggleContext);
  const theme = useContext(ThemeContext);
  return (
    <button
      onClick={toggle}
      className={`py-2 px-4 rounded-lg font-semibold ${theme === 'dark' ? 'bg-green-600 hover:bg-green-500 text-white' : 'bg-green-500 hover:bg-green-600 text-white'}`}
      {...props}
    >
      {on ? 'Turn Off' : 'Turn On'}
    </button>
  );
};

// Step 4: Demonstrate usage of Compound Components
function CompoundComponentDemo() {
  return (
    <Toggle>
      <Toggle.On>The button is currently ON!</Toggle.On>
      <Toggle.Off>The button is currently OFF.</Toggle.Off>
      <Toggle.Button />
    </Toggle>
  );
}

// ============================================================================
// 4. Nested Prop Forwarding
// ============================================================================
// This pattern allows props to be passed down through multiple layers of
// components, giving flexibility to customize deeply nested elements.

// Step 1: Create a base Text component
function Text({ children, ...rest }) {
  const theme = useContext(ThemeContext);
  return (
    <span className={`font-medium ${theme === 'dark' ? 'text-blue-300' : 'text-blue-600'}`} {...rest}>
      {children}
    </span>
  );
}

// Step 2: Create a Button component that accepts props for a nested Text component
function ButtonPropForwarding({ children, textProps, ...rest }) {
  const theme = useContext(ThemeContext);
  return (
    <button
      className={`py-2 px-4 rounded-lg font-semibold ${theme === 'dark' ? 'bg-red-600 hover:bg-red-500 text-white' : 'bg-red-500 hover:bg-red-600 text-white'}`}
      {...rest}
    >
      {/* Forward textProps to the Text component */}
      <Text {...textProps}>{children}</Text>
    </button>
  );
}

// Step 3: Demonstrate usage of Nested Prop Forwarding
function NestedPropForwardingDemo() {
  const theme = useContext(ThemeContext);
  return (
    <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-red-800 text-red-100' : 'bg-red-100 text-red-800'}`}>
      <h4 className="font-semibold mb-2">Nested Prop Forwarding Demo:</h4>
      <ButtonPropForwarding textProps={{ className: 'text-yellow-300' }}>
        Button with yellow text
      </ButtonPropForwarding>
      <p className="text-sm italic mt-2">
        The `textProps` are forwarded to the inner `Text` component.
      </p>
    </div>
  );
}

// ============================================================================
// 5. Children Components Pattern
// ============================================================================
// This pattern leverages React's `children` prop to pass components directly
// as children, which can help optimize re-renders and improve component composition.

// Step 1: Create an "Expensive" component that logs its renders
function ExpensiveComponent() {
  const theme = useContext(ThemeContext);
  const renderCount = useRef(0);
  renderCount.current++;
  console.log('ExpensiveComponent rendered:', renderCount.current);

  return (
    <div className={`p-3 border rounded-lg mt-4 ${theme === 'dark' ? 'bg-yellow-600 border-yellow-500 text-yellow-100' : 'bg-yellow-50 border-yellow-300'}`}>
      <p>Expensive Component (Rendered: {renderCount.current} times)</p>
      <p className="text-sm italic">Check console for render count.</p>
    </div>
  );
}

// Step 2: Create a parent component that accepts `children`
function ComponentChildrenPattern({ children }) {
  const [count, setCount] = useState(0);
  const theme = useContext(ThemeContext);

  return (
    <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-orange-700 text-orange-100' : 'bg-orange-100 text-orange-800'}`}>
      <p>Parent Counter: {count}</p>
      <button
        onClick={() => setCount(count + 1)}
        className={`py-1 px-3 rounded-lg font-semibold mt-2 ${theme === 'dark' ? 'bg-orange-600 hover:bg-orange-500 text-white' : 'bg-orange-300 hover:bg-orange-400 text-orange-900'}`}
      >
        Increment Parent
      </button>
      {/* Render children here */}
      {children}
      <p className="text-sm italic mt-2">
        The "Expensive Component" below is passed as children and does not re-render when the parent's state changes.
      </p>
    </div>
  );
}

// Step 3: Demonstrate usage by passing ExpensiveComponent as a child
function ChildrenComponentsPatternDemo() {
  return (
    <ComponentChildrenPattern>
      <ExpensiveComponent />
    </ComponentChildrenPattern>
  );
}

// ============================================================================
// 6. Custom Hooks
// ============================================================================
// Custom hooks allow you to extract reusable stateful logic from components,
// making your components cleaner and logic more shareable.

// Step 1: Create a mock filter function for items
const mockFilterItems = (items, filters) => {
  if (!filters.searchTerm) return items;
  return items.filter(item =>
    item.name.toLowerCase().includes(filters.searchTerm.toLowerCase())
  );
};

// Step 2: Create a custom hook `useFilteredItems`
// This hook encapsulates the filtering logic and state management for a list of items.
function useFilteredItems(initialItems) {
  const [items, setItems] = useState(initialItems);
  const [filters, setFilters] = useState({ searchTerm: '' });
  const [filteredItems, setFilteredItems] = useState([]);

  useEffect(() => {
    setFilteredItems(mockFilterItems(items, filters));
  }, [items, filters]);

  function handleSearchTermChange(searchTerm) {
    setFilters(prev => ({ ...prev, searchTerm }));
  }

  return {
    filteredItems,
    filters,
    handleSearchTermChange,
    setItems, // Expose setItems if needed by the component using this hook
  };
}

// Step 3: Create a component that uses the custom hook
function ComponentCustomHook() {
  const initialData = [
    { id: 1, name: 'Laptop' },
    { id: 2, name: 'Mouse' },
    { id: 3, name: 'Keyboard' },
    { id: 4, name: 'Monitor' },
  ];
  const { filteredItems, handleSearchTermChange } = useFilteredItems(initialData);
  const theme = useContext(ThemeContext);

  return (
    <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-teal-700 text-teal-100' : 'bg-teal-100 text-teal-800'}`}>
      <h4 className="font-semibold mb-2">Custom Hook Demo:</h4>
      <input
        type="text"
        placeholder="Filter items..."
        onChange={(e) => handleSearchTermChange(e.target.value)}
        className={`p-2 border rounded w-full mb-4 ${theme === 'dark' ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 placeholder-gray-500'}`}
      />
      <ul className="list-disc list-inside">
        {filteredItems.map(item => (
          <li key={item.id}>{item.name}</li>
        ))}
      </ul>
      <p className="text-sm italic mt-2">
        The filtering logic is encapsulated in `useFilteredItems` custom hook.
      </p>
    </div>
  );
}

// ============================================================================
// 7. Higher Order Components (HOC)
// ============================================================================
// HOCs are functions that take a component and return a new component with
// enhanced functionality or props.

// Step 1: Create a Higher Order Component (withStyles.js)
// This HOC adds common styling to any wrapped component.
function withStyles(Component) {
  // The returned component is the HOC itself
  return function HOC(props) {
    const style = { padding: '8px', margin: '12px', borderRadius: '4px' };
    const theme = useContext(ThemeContext);

    // Merge component props with custom style object
    // Also apply theme-based background for visual distinction
    const themedStyle = {
      ...style,
      backgroundColor: theme === 'dark' ? '#4B5563' : '#D1D5DB', // bg-gray-600 / bg-gray-300
      color: theme === 'dark' ? '#F9FAFB' : '#1F2937', // text-gray-50 / text-gray-900
    };

    // Render the original component, passing the enhanced style and other props
    return <Component style={themedStyle} {...props} />;
  };
}

// Step 2: Create simple components that will receive styles via props
function StyledButton({ style, children, ...props }) {
  return <button style={style} {...props}>{children}</button>;
}
function StyledTextInput({ style, ...props }) {
  return <input type="text" style={style} {...props} />;
}

// Step 3: Wrap the components with the HOC to enhance them
const EnhancedButton = withStyles(StyledButton);
const EnhancedTextInput = withStyles(StyledTextInput);

// Step 4: Demonstrate usage of the enhanced components
function HOCDemo() {
  const theme = useContext(ThemeContext);
  return (
    <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-blue-700 text-blue-100' : 'bg-blue-100 text-blue-800'}`}>
      <h4 className="font-semibold mb-2">HOC Demo:</h4>
      <EnhancedButton>Click Me (HOC)</EnhancedButton>
      <EnhancedTextInput placeholder="Type here (HOC)" />
      <p className="text-sm italic mt-2">
        `withStyles` HOC adds common styling to components.
      </p>
    </div>
  );
}

// ============================================================================
// 8. Variant Props
// ============================================================================
// This pattern uses props to define different visual "variants" of a component,
// centralizing styling logic and making components more flexible.

// Step 1: Create a component that accepts `variant` and `size` props
function ButtonVariant({ variant = 'primary', size = 'md', children, ...rest }) {
  const theme = useContext(ThemeContext);

  // Base styles applied to all buttons
  const baseStyle = "py-2 px-4 rounded-lg font-semibold transition-colors duration-200";

  // Define styles for different variants
  const variantStyles = {
    primary: theme === 'dark' ? "bg-blue-600 hover:bg-blue-500 text-white" : "bg-blue-500 hover:bg-blue-600 text-white",
    secondary: theme === 'dark' ? "bg-gray-600 hover:bg-gray-500 text-gray-100" : "bg-gray-300 hover:bg-gray-400 text-gray-800",
  };

  // Define styles for different sizes
  const sizeStyles = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg py-3 px-6",
  };

  return (
    <button
      // Combine base, variant, and size styles using template literals
      className={`${baseStyle} ${variantStyles[variant]} ${sizeStyles[size]}`}
      {...rest}
    >
      {children}
    </button>
  );
}

// Step 2: Demonstrate usage of the ButtonVariant with different props
function VariantPropsDemo() {
  const theme = useContext(ThemeContext);
  return (
    <div className={`p-4 rounded-lg space-y-3 ${theme === 'dark' ? 'bg-purple-700 text-purple-100' : 'bg-purple-100 text-purple-800'}`}>
      <h4 className="font-semibold mb-2">Variant Props Demo:</h4>
      <ButtonVariant>Primary Button (md)</ButtonVariant>
      <ButtonVariant variant="secondary" size="sm">Secondary Button (sm)</ButtonVariant>
      <ButtonVariant variant="primary" size="lg">Large Primary Button</ButtonVariant>
      <p className="text-sm italic mt-2">
        `variant` and `size` props control button appearance with preset styles.
      </p>
    </div>
  );
}

// ============================================================================
// 9. Expose functionality through ref (useImperativeHandle)
// ============================================================================
// `useImperativeHandle` allows you to customize the instance value that is
// exposed to parent components when using `ref`. This is useful for exposing
// specific methods or properties of a child component without exposing its internal state.

// Step 1: Create a child component and wrap it with `forwardRef`
const ComponentWithImperativeHandle = forwardRef(({}, ref) => {
  const [count, setCount] = useState(0);
  const theme = useContext(ThemeContext);

  // Step 2: Use `useImperativeHandle` to expose specific functions via the ref
  useImperativeHandle(ref, () => ({
    reset: () => {
      setCount(0);
    },
    // You can expose other functions too
    increment: () => {
      setCount(prev => prev + 1);
    }
  }));

  return (
    <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-lime-700 text-lime-100' : 'bg-lime-100 text-lime-800'}`}>
      <p>Count: {count}</p>
      <button
        onClick={() => setCount(count + 1)}
        className={`py-1 px-3 rounded-lg font-semibold mt-2 ${theme === 'dark' ? 'bg-lime-600 hover:bg-lime-500 text-white' : 'bg-lime-300 hover:bg-lime-400 text-lime-900'}`}
      >
        Increment Internally
      </button>
      <p className="text-sm italic mt-2">
        The parent can trigger `reset()` on this component via a ref.
      </p>
    </div>
  );
});

// Step 3: Create a parent component that uses the child component and its ref
function ImperativeHandleDemo() {
  const componentRef = useRef(null); // Create a ref
  const theme = useContext(ThemeContext);

  // Function to call the exposed `reset` method on the child component
  const handleReset = () => {
    if (componentRef.current) {
      componentRef.current.reset();
      const messageBox = document.getElementById('messageBox');
      const messageText = document.getElementById('messageText');
      if (messageBox && messageText) {
        messageText.textContent = 'Component reset via ref!';
        messageBox.classList.remove('hidden');
        setTimeout(() => messageBox.classList.add('hidden'), 2000);
      }
    }
  };

  // Function to call the exposed `increment` method on the child component
  const handleIncrementFromParent = () => {
    if (componentRef.current) {
      componentRef.current.increment();
      const messageBox = document.getElementById('messageBox');
      const messageText = document.getElementById('messageText');
      if (messageBox && messageText) {
        messageText.textContent = 'Component incremented via ref!';
        messageBox.classList.remove('hidden');
        setTimeout(() => messageBox.classList.add('hidden'), 2000);
      }
    }
  };

  return (
    <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-lime-800 text-lime-100' : 'bg-lime-200 text-lime-900'}`}>
      <h4 className="font-semibold mb-2">useImperativeHandle Demo:</h4>
      {/* Attach the ref to the child component */}
      <ComponentWithImperativeHandle ref={componentRef} />
      <div className="mt-4 flex flex-wrap gap-2"> {/* Changed to flex flex-wrap gap-2 */}
        <button
          onClick={handleReset}
          className={`py-2 px-4 rounded-lg font-semibold ${theme === 'dark' ? 'bg-red-600 hover:bg-red-500 text-white' : 'bg-red-500 hover:bg-red-600 text-white'}`}
        >
          Reset from Parent
        </button>
        <button
          onClick={handleIncrementFromParent}
          className={`py-2 px-4 rounded-lg font-semibold ${theme === 'dark' ? 'bg-blue-600 hover:bg-blue-500 text-white' : 'bg-blue-500 hover:bg-blue-600 text-white'}`}
        >
          Increment from Parent
        </button>
      </div>
    </div>
  );
}

// ============================================================================
// 10. Use providers for frequently used data (Context API)
// ============================================================================
// The Context API provides a way to pass data through the component tree
// without having to pass props down manually at every level. This is ideal
// for "global" data like user information or themes.

// Step 1: Create a Context for user data
const UserContext = createContext(undefined);

// Step 2: Create a mock function to fetch user data
const mockFetchUser = () => new Promise(resolve => setTimeout(() => resolve({ name: 'John Doe', email: 'john.doe@example.com' }), 1500));

// Step 3: Create a custom hook to fetch user data
function useFetchUser() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    mockFetchUser().then(data => {
      setUser(data);
      setLoading(false);
    });
  }, []);
  return { data: user, loading };
}

// Step 4: Create a UserProvider component
// This component fetches the user data and makes it available to its children
// via the UserContext.Provider.
function UserProvider({ children }) {
  const { data: user, loading } = useFetchUser();
  const theme = useContext(ThemeContext);

  if (loading) {
    return (
      <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-700 text-gray-100' : 'bg-gray-100 text-gray-800'}`}>
        <p>Loading user data...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-red-700 text-red-100' : 'bg-red-100 text-red-800'}`}>
        <p>Error: User data not available.</p>
      </div>
    );
  }

  return (
    <UserContext.Provider value={{ user }}>{children}</UserContext.Provider>
  );
}

// Step 5: Create a custom hook to easily consume the UserContext
function useUser() {
  const context = useContext(UserContext);

  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider.');
  }

  return context;
}

// Step 6: Create components that consume the user data from context
function Component1Context() {
  const { user } = useUser();
  const theme = useContext(ThemeContext);
  return (
    <div className={`p-3 border rounded-md mb-2 ${theme === 'dark' ? 'bg-blue-600 border-blue-500 text-blue-100' : 'bg-blue-50 border-blue-300 text-blue-800'}`}>
      <p className="font-semibold">Component 1:</p>
      <p>Welcome, {user.name}!</p>
      <p className="text-sm">Email: {user.email}</p>
    </div>
  );
}

function Component2Context() {
  const { user } = useUser();
  const theme = useContext(ThemeContext);
  return (
    <div className={`p-3 border rounded-md ${theme === 'dark' ? 'bg-green-600 border-green-500 text-green-100' : 'bg-green-50 border-green-300 text-green-800'}`}>
      <p className="font-semibold">Component 2:</p>
      <p>User ID: {user.email.split('@')[0]}</p>
    </div>
  );
}

// Step 7: Demonstrate usage by wrapping components with the UserProvider
function ProviderDemo() {
  const theme = useContext(ThemeContext);
  return (
    <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-800 text-gray-100' : 'bg-gray-100 text-gray-800'}`}>
      <h4 className="font-semibold mb-2">Context Provider Demo:</h4>
      <UserProvider>
        <Component1Context />
        <Component2Context />
      </UserProvider>
      <p className="text-sm italic mt-2">
        User data is fetched once by `UserProvider` and shared via Context.
      </p>
    </div>
  );
}


// ============================================================================
// Main App Component for Design Patterns Demo
// ============================================================================

export default function App() {
  const [theme, setTheme] = useState('light');

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  useEffect(() => {
    document.body.className = theme === 'dark' ? 'bg-gray-900' : 'bg-gray-100';
  }, [theme]);

  const designPatterns = [
    {
      title: "1. Single Responsibility Principle",
      id: "srp",
      content: `
        <p>Your components should have only one responsibility. They should only do "one thing" and delegate everything else to other components. Here's an example of a component that has too many responsibilities:</p>
        <p>Instead, create multiple components/hooks each with a single responsibility.</p>
        <p>First, create <code>useFetchData.ts</code>. This hook will hold the <code>data</code> state and manage fetching and updating it.</p>
        <p>Or even better, use <a href="https://tanstack.com/query/latest" target="_blank" rel="noopener noreferrer"><code>react-query</code></a>.</p>
        <p>Then create <code>usePageAnalytics.ts</code>. This hook will receive an <code>event</code> through props and send it.</p>
        <p>Finally create <code>Modal.tsx</code>. This component will receive <code>children</code> as props, and manage its own <code>isModalOpen</code> state.</p>
        <p>With this, <code>BigComponent</code> just needs to import and put everything together. It is now small, easy to manage, and highly scalable.</p>
      `,
      codeSnippets: [
        {
          title: "useFetchData Hook",
          code: useFetchData.toString(),
          ComponentToRender: null, // This is a hook, not a component to render directly
        },
        {
          title: "usePageAnalytics Hook",
          code: usePageAnalytics.toString(),
          ComponentToRender: null, // This is a hook
        },
        {
          title: "Modal Component",
          code: Modal.toString(),
          ComponentToRender: null, // Rendered within BigComponentSRP
        },
        {
          title: "BigComponent (Orchestrator)",
          code: BigComponentSRP.toString(),
          ComponentToRender: BigComponentSRP,
        },
      ],
    },
    {
      title: "2. Container and Presentation Components",
      id: "container-presentation",
      content: `
        <p>To keep code organized, you can split your components into a container and a presentation component. The container component holds all the logic, and the presentation component renders the UI.</p>
      `,
      codeSnippets: [
        {
          title: "ItemCard Component",
          code: ItemCard.toString(),
          ComponentToRender: null, // Used by PresentationComponent
        },
        {
          title: "PresentationComponent (UI)",
          code: PresentationComponent.toString(),
          ComponentToRender: null, // Used by ContainerComponent
        },
        {
          title: "ContainerComponent (Logic)",
          code: ContainerComponent.toString(),
          ComponentToRender: ContainerComponent,
        },
      ],
    },
    {
      title: "3. Compound Components Pattern",
      id: "compound-components",
      content: `
        <p>Group components meant to be used together into a compound component with the React Context API.</p>
        <p>This component can now be used anywhere with great flexibility. Place sub-components in any order, or only use a subset of them:</p>
      `,
      codeSnippets: [
        {
          title: "Toggle (Main Component)",
          code: Toggle.toString(),
          ComponentToRender: null, // Parent component
        },
        {
          title: "Toggle.On (Compound Component)",
          code: Toggle.On.toString(),
          ComponentToRender: null,
        },
        {
          title: "Toggle.Off (Compound Component)",
          code: Toggle.Off.toString(),
          ComponentToRender: null,
        },
        {
          title: "Toggle.Button (Compound Component)",
          code: Toggle.Button.toString(),
          ComponentToRender: null,
        },
        {
          title: "Compound Components Demo Usage",
          code: `
function CompoundComponentDemo() {
  return (
    <Toggle>
      <Toggle.On>The button is currently ON!</Toggle.On>
      <Toggle.Off>The button is currently OFF.</Toggle.Off>
      <Toggle.Button />
    </Toggle>
  );
}
          `,
          ComponentToRender: () => <Toggle><Toggle.On>The button is currently ON!</Toggle.On><Toggle.Off>The button is currently OFF.</Toggle.Off><Toggle.Button /></Toggle>,
        },
      ],
    },
    {
      title: "4. Nested Prop Forwarding",
      id: "nested-prop-forwarding",
      content: `
        <p>When a flexible component uses another, allow props to be forwarded to the nested component.</p>
        <p>Example usage:</p>
      `,
      codeSnippets: [
        {
          title: "Text Component",
          code: Text.toString(),
          ComponentToRender: null,
        },
        {
          title: "ButtonPropForwarding Component",
          code: ButtonPropForwarding.toString(),
          ComponentToRender: null,
        },
        {
          title: "Nested Prop Forwarding Demo Usage",
          code: `
function NestedPropForwardingDemo() {
  return (
    <ButtonPropForwarding textProps={{ className: 'text-red-500' }}>
      Button with red text
    </ButtonPropForwarding>
  );
}
          `,
          ComponentToRender: () => <NestedPropForwardingDemo />,
        },
      ],
    },
    {
      title: "5. Children Components Pattern",
      id: "children-components",
      content: `
        <p>To improve performance and prevent unnecessary re-renders, lift up components and pass them as children instead.</p>
        <p>Moving <code>ExpensiveComponent</code> up and passing it as children will prevent it re-rendering</p>
      `,
      codeSnippets: [
        {
          title: "ExpensiveComponent",
          code: ExpensiveComponent.toString(),
          ComponentToRender: null,
        },
        {
          title: "ComponentChildrenPattern",
          code: ComponentChildrenPattern.toString(),
          ComponentToRender: null,
        },
        {
          title: "Children Components Pattern Demo Usage",
          code: `
function ChildrenComponentsPatternDemo() {
  return (
    <ComponentChildrenPattern>
      <ExpensiveComponent />
    </ComponentChildrenPattern>
  );
}
          `,
          ComponentToRender: () => (
            <ComponentChildrenPattern>
              <ExpensiveComponent />
            </ComponentChildrenPattern>
          ),
        },
      ],
    },
    {
      title: "6. Custom Hooks",
      id: "custom-hooks",
      content: `
        <p>To keep code clean and re-usable, extract related functionality into a custom hook that can be shared.</p>
        <p>You can create <code>useFilteredItems.ts</code> and put all of the functionality there.</p>
        <p>Then in <code>Component</code> you can use the hook instead.</p>
      `,
      codeSnippets: [
        {
          title: "useFilteredItems Hook",
          code: useFilteredItems.toString(),
          ComponentToRender: null,
        },
        {
          title: "ComponentCustomHook",
          code: ComponentCustomHook.toString(),
          ComponentToRender: ComponentCustomHook,
        },
      ],
    },
    {
      title: "7. Higher Order Components (HOC)",
      id: "hoc",
      content: `
        <p>Sometimes, it's better to create a higher order component (HOC) to share re-usable functionality.</p>
        <p>With HOCs, you can create a wrapper component that takes a component with its props, and enhances it.</p>
      `,
      codeSnippets: [
        {
          title: "withStyles HOC",
          code: withStyles.toString(),
          ComponentToRender: null,
        },
        {
          title: "StyledButton Component",
          code: StyledButton.toString(),
          ComponentToRender: null,
        },
        {
          title: "StyledTextInput Component",
          code: StyledTextInput.toString(),
          ComponentToRender: null,
        },
        {
          title: "HOC Demo Usage",
          code: HOCDemo.toString(),
          ComponentToRender: HOCDemo,
        },
      ],
    },
    {
      title: "8. Variant Props",
      id: "variant-props",
      content: `
        <p>If you have components that are shared across the app, create variant props to easily customize them using preset values.</p>
        <p>Example usage:</p>
      `,
      codeSnippets: [
        {
          title: "ButtonVariant Component",
          code: ButtonVariant.toString(),
          ComponentToRender: null,
        },
        {
          title: "VariantPropsDemo Usage",
          code: VariantPropsDemo.toString(),
          ComponentToRender: VariantPropsDemo,
        },
      ],
    },
    {
      title: "9. Expose functionality through ref",
      id: "expose-functionality-ref",
      content: `
        <p>Sometimes it can be useful to export functionality from one child component to a parent through a ref. This can be done using the <code>useImperativeHandle</code> hook.</p>
        <p>And to use it, simply create a ref in the same component where it is rendered.</p>
      `,
      codeSnippets: [
        {
          title: "ComponentWithImperativeHandle",
          code: ComponentWithImperativeHandle.toString(),
          ComponentToRender: null,
        },
        {
          title: "ImperativeHandleDemo Usage",
          code: ImperativeHandleDemo.toString(),
          ComponentToRender: ImperativeHandleDemo,
        },
      ],
    },
    {
      title: "10. Use providers for frequently used data",
      id: "use-providers",
      content: `
        <p>If you have data that is shared across multiple components, consider putting it in a provider using the Context API.</p>
        <p>With a Provider, we can have all of that functionality inside a single component.</p>
        <p>After wrapping the entire app with it, you can use the shared functionality everywhere.</p>
      `,
      codeSnippets: [
        {
          title: "useFetchUser Hook",
          code: useFetchUser.toString(),
          ComponentToRender: null,
        },
        {
          title: "UserProvider Component",
          code: UserProvider.toString(),
          ComponentToRender: null,
        },
        {
          title: "useUser Hook",
          code: useUser.toString(),
          ComponentToRender: null,
        },
        {
          title: "Component1Context",
          code: Component1Context.toString(),
          ComponentToRender: null,
        },
        {
          title: "Component2Context",
          code: Component2Context.toString(),
          ComponentToRender: null,
        },
        {
          title: "ProviderDemo Usage",
          code: ProviderDemo.toString(),
          ComponentToRender: ProviderDemo,
        },
      ],
    },
  ];

  return (
    <ThemeContext.Provider value={theme}>
      <div className={`min-h-screen font-sans antialiased transition-colors duration-300 ${theme === 'dark' ? 'bg-gray-900 text-gray-100' : 'bg-gray-100 text-gray-900'}`}>
        <div className="container mx-auto p-4 sm:p-8">
          {/* Header */}
          <header className={`py-6 px-4 sm:px-6 rounded-lg shadow-md mb-8 flex flex-col sm:flex-row justify-between items-center ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
            <h1 className={`text-3xl sm:text-4xl font-extrabold ${theme === 'dark' ? 'text-white' : 'text-gray-900'} mb-4 sm:mb-0`}>
              React Design Patterns
            </h1>
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-full shadow-lg transition-all duration-300 ${theme === 'dark' ? 'bg-yellow-400 text-gray-900 hover:bg-yellow-300' : 'bg-gray-800 text-white hover:bg-gray-700'}`}
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1m-16 0H3m15.325-7.275l-.707-.707M6.343 17.657l-.707.707M17.657 6.343l.707-.707M6.343 6.343l-.707-.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9 9 0 008.354-5.646z" />
                </svg>
              )}
            </button>
          </header>

          {/* Main content area */}
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Table of Contents */}
            <aside className={`w-full lg:w-1/4 p-4 sm:p-6 rounded-lg shadow-xl ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} sticky top-4 h-fit`}>
              <h2 className={`text-2xl font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Table of Contents</h2>
              <nav>
                <ul className="space-y-2">
                  {designPatterns.map(section => (
                    <li key={section.id}>
                      <a
                        href={`#${section.id}`}
                        className={`block py-1 px-3 rounded-md transition-colors duration-200 ${theme === 'dark' ? 'text-blue-300 hover:bg-gray-700 hover:text-blue-200' : 'text-blue-600 hover:bg-blue-50 hover:text-blue-700'}`}
                      >
                        {section.title}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            </aside>

            {/* Design Patterns Content */}
            <main className="w-full lg:w-3/4">
              {designPatterns.map(pattern => (
                <section key={pattern.id} id={pattern.id} className={`mb-12 p-4 sm:p-6 rounded-lg shadow-xl ${theme === 'dark' ? 'bg-gray-800 text-gray-200' : 'bg-white text-gray-800'}`}>
                  <h2 className={`text-2xl sm:text-3xl font-bold mb-6 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    {pattern.title}
                  </h2>
                  <div
                    className={`prose max-w-none ${theme === 'dark' ? 'prose-invert prose-p:text-gray-300 prose-strong:text-white prose-li:text-gray-300 prose-code:text-gray-100 prose-pre:bg-gray-900 prose-a:text-blue-400' : 'prose-p:text-gray-700 prose-strong:text-gray-900 prose-li:text-gray-700 prose-code:text-gray-800 prose-pre:bg-gray-100 prose-a:text-blue-600'}`}
                    dangerouslySetInnerHTML={{ __html: pattern.content }}
                  ></div>

                  {pattern.codeSnippets.map(snippet => (
                    <CodeBlock
                      key={snippet.title}
                      id={slugify(snippet.title)}
                      title={snippet.title}
                      codeString={snippet.code}
                      ComponentToRender={snippet.ComponentToRender}
                      sampleProps={snippet.sampleProps}
                    />
                  ))}
                </section>
              ))}

              {/* Footer section */}
              <footer className={`mt-8 pt-6 border-t text-center text-xs sm:text-sm ${theme === 'dark' ? 'border-gray-700 text-gray-500' : 'border-gray-300 text-gray-600'}`}>
                <p>&copy; {new Date().getFullYear()} React Design Patterns. All rights reserved.</p>
                <p>Demonstrating key React design principles with live examples.</p>
              </footer>
            </main>
          </div>
        </div>
      </div>
      {/* Message Box for Copy to Clipboard */}
      <div id="messageBox" className="hidden fixed bottom-4 right-4 bg-green-500 text-white p-3 rounded-md shadow-lg z-50">
        <p id="messageText"></p>
      </div>
    </ThemeContext.Provider>
  );
}
