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
      codeRef.current.innerHTML = codeString
        .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
        .replace(/"(.*?)"/g, '<span class="text-green-400">"$&"</span>') // Strings
        .replace(/\b(function|const|let|var|return|export|import|if|else|switch|case|break|default|throw|new|this|true|false|null|undefined)\b/g, '<span class="text-blue-400">$&</span>') // Keywords
        .replace(/\b(useState|useEffect|useContext|useRef|useReducer|useCallback|forwardRef|useImperativeHandle)\b/g, '<span class="text-purple-400">$&</span>') // React Hooks
        .replace(/(\/\/.*|\/\*[\s\S]*?\*\/)/g, '<span class="text-gray-500">$&</span>'); // Comments
    }
  }, [codeString]);

  const handleCopy = () => {
    if (codeRef.current) {
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
    }
  };

  return (
    <section id={id} className={`mb-8 p-4 rounded-lg shadow-md ${theme === 'dark' ? 'bg-gray-800 text-gray-200' : 'bg-white text-gray-800'}`}>
      <h3 className={`text-xl font-semibold mb-3 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{title}</h3>

      {/* Code Display */}
      <div className={`relative bg-gray-900 rounded-md overflow-hidden mb-4 ${theme === 'dark' ? 'border border-gray-700' : ''}`}>
        <pre className="p-4 text-sm overflow-x-auto">
          <code ref={codeRef} className="language-javascript text-gray-50">
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
// 1. Single Responsibility Principle
// ============================================================================

// Simulating API call
const mockFetchData = () => new Promise(resolve => setTimeout(() => resolve({ message: 'Data fetched!' }), 1000));

// ✅ Single responsibility: managing data
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
  }, []);

  return { data, loading, error };
}

// Simulating react-query's useQuery
function useQueryMock({ queryKey, queryFn }) {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    queryFn()
      .then(res => res.json ? res.json() : res) // Handle mockFetchData returning object directly
      .then(d => {
        setData(d);
        setIsLoading(false);
      })
      .catch(() => {
        setIsError(true);
        setIsLoading(false);
      });
  }, [queryKey[0]]); // Simplified dependency

  return { data, isLoading, isError };
}

// Simulating analytics event sender
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

// ✅ Single responsibility: managing analytics
function usePageAnalytics(event) {
  useEffect(() => {
    sendAnalyticsEvent('page_view', event);
  }, [event]);
}

// ✅ Single responsibility: managing modals
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className={`p-6 rounded-lg shadow-lg relative ${theme === 'dark' ? 'bg-gray-700 text-gray-100' : 'bg-white text-gray-900'}`}>
            <button
              onClick={toggleModal}
              className={`absolute top-2 right-2 text-xl ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} hover:text-red-500`}
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

// ✅ Single responsibility: put everything together
function BigComponentSRP() {
  const { data, loading, error } = useFetchData(); // Using simulated hook
  const theme = useContext(ThemeContext);

  usePageAnalytics({ page: 'big_component_srp' });

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

// Mock filter function
const filterItems = (items, filters) => {
  if (!filters.searchTerm) return items;
  return items.filter(item =>
    item.name.toLowerCase().includes(filters.searchTerm.toLowerCase())
  );
};

function ItemCard({ item }) {
  const theme = useContext(ThemeContext);
  return (
    <div className={`p-3 border rounded-md mb-2 ${theme === 'dark' ? 'bg-gray-600 border-gray-500 text-gray-100' : 'bg-gray-50 border-gray-200 text-gray-700'}`}>
      <p className="font-semibold">{item.name}</p>
      <p className="text-sm">Category: {item.category}</p>
    </div>
  );
}

// Presentation component responsible for UI
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

// Container component responsible for logic
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

const ToggleContext = createContext(undefined);

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

// ============================================================================
// 4. Nested Prop Forwarding
// ============================================================================

function Text({ children, ...rest }) {
  const theme = useContext(ThemeContext);
  return (
    <span className={`font-medium ${theme === 'dark' ? 'text-blue-300' : 'text-blue-600'}`} {...rest}>
      {children}
    </span>
  );
}

function ButtonPropForwarding({ children, textProps, ...rest }) {
  const theme = useContext(ThemeContext);
  return (
    <button
      className={`py-2 px-4 rounded-lg font-semibold ${theme === 'dark' ? 'bg-red-600 hover:bg-red-500 text-white' : 'bg-red-500 hover:bg-red-600 text-white'}`}
      {...rest}
    >
      <Text {...textProps}>{children}</Text>
    </button>
  );
}

// ============================================================================
// 5. Children Components Pattern
// ============================================================================

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
      {children}
      <p className="text-sm italic mt-2">
        The "Expensive Component" below is passed as children and does not re-render when the parent's state changes.
      </p>
    </div>
  );
}

// ============================================================================
// 6. Custom Hooks
// ============================================================================

const mockFilterItems = (items, filters) => {
  if (!filters.searchTerm) return items;
  return items.filter(item =>
    item.name.toLowerCase().includes(filters.searchTerm.toLowerCase())
  );
};

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

// ✅ Higher order component to implement styles
function withStyles(Component) {
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

    return <Component style={themedStyle} {...props} />;
  };
}

// Inner components receive style through props
function StyledButton({ style, children, ...props }) {
  return <button style={style} {...props}>{children}</button>;
}
function StyledTextInput({ style, ...props }) {
  return <input type="text" style={style} {...props} />;
}

// ✅ Wrap exports with HOC
const EnhancedButton = withStyles(StyledButton);
const EnhancedTextInput = withStyles(StyledTextInput);

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

function ButtonVariant({ variant = 'primary', size = 'md', children, ...rest }) {
  const theme = useContext(ThemeContext);

  const baseStyle = "py-2 px-4 rounded-lg font-semibold transition-colors duration-200";

  const variantStyles = {
    primary: theme === 'dark' ? "bg-blue-600 hover:bg-blue-500 text-white" : "bg-blue-500 hover:bg-blue-600 text-white",
    secondary: theme === 'dark' ? "bg-gray-600 hover:bg-gray-500 text-gray-100" : "bg-gray-300 hover:bg-gray-400 text-gray-800",
  };

  const sizeStyles = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg py-3 px-6",
  };

  return (
    <button
      className={`${baseStyle} ${variantStyles[variant]} ${sizeStyles[size]}`}
      {...rest}
    >
      {children}
    </button>
  );
}

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

const ComponentWithImperativeHandle = forwardRef(({}, ref) => {
  const [count, setCount] = useState(0);
  const theme = useContext(ThemeContext);

  // ✅ Exposes custom reset function to parent through ref to change state
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

function ImperativeHandleDemo() {
  const componentRef = useRef(null);
  const theme = useContext(ThemeContext);

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
      <ComponentWithImperativeHandle ref={componentRef} />
      <div className="mt-4 space-x-2">
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

const UserContext = createContext(undefined);

// Mock fetch user data
const mockFetchUser = () => new Promise(resolve => setTimeout(() => resolve({ name: 'John Doe', email: 'john.doe@example.com' }), 1500));

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

// Custom hook to easily access context
function useUser() {
  const context = useContext(UserContext);

  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider.');
  }

  return context;
}

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
          ComponentToRender: () => <ButtonPropForwarding textProps={{ className: 'text-red-500' }}>Button with red text</ButtonPropForwarding>,
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
            <aside className={`w-full lg:w-1/4 p-6 rounded-lg shadow-xl ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} sticky top-4 h-fit`}>
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
                <section key={pattern.id} id={pattern.id} className={`mb-12 p-6 rounded-lg shadow-xl ${theme === 'dark' ? 'bg-gray-800 text-gray-200' : 'bg-white text-gray-800'}`}>
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
