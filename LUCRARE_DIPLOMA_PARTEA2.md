## 3. DESIGNUL INTERFEȚEI RESPONSIVE

### 3.1. Principiile design-ului modern

Designul interfeței aplicației de e-commerce a fost conceput urmând principiile moderne de UI/UX design, cu accent pe simplicitate, funcționalitate și experiența utilizatorului.

**3.1.1. Material Design și principiile Google**

Aplicația implementează concepte din Material Design adaptate pentru web:

- **Hierarhia vizuală** prin utilizarea shadow-urilor și elevației
- **Tipografia** consistentă cu scale bine definite
- **Culorile** organizate într-o paletă coerentă
- **Spațierea** uniformă folosind un sistem de grid

**3.1.2. Principiile de design atomic**

Designul a fost structurat folosind metodologia Atomic Design:

1. **Atomi** - Elemente de bază (butoane, input-uri, iconuri)
2. **Molecule** - Combinații simple de atomi (search bar, card-uri produse)
3. **Organisme** - Componente complexe (header, footer, liste produse)
4. **Template-uri** - Structuri de pagină
5. **Pagini** - Instanțe specifice ale template-urilor

**3.1.3. Sistemul de culori**

Paleta de culori a fost aleasă pentru a transmite încredere și profesionalism:

```css
:root {
  --primary-blue: #2563eb; /* Albastru principal */
  --primary-blue-dark: #1d4ed8; /* Albastru închis pentru hover */
  --secondary-gray: #6b7280; /* Gri pentru text secundar */
  --success-green: #10b981; /* Verde pentru succes */
  --warning-yellow: #f59e0b; /* Galben pentru avertismente */
  --error-red: #ef4444; /* Roșu pentru erori */
  --background-gray: #f9fafb; /* Gri deschis pentru fundal */
}
```

**3.1.4. Tipografia**

Sistemul tipografic utilizează Inter, un font modern optimizat pentru interfețele digitale:

- **Heading 1**: 2.25rem (36px) - Titluri principale
- **Heading 2**: 1.875rem (30px) - Subtitluri
- **Heading 3**: 1.5rem (24px) - Titluri secțiuni
- **Body**: 1rem (16px) - Text principal
- **Small**: 0.875rem (14px) - Text secundar
- **Caption**: 0.75rem (12px) - Etichete și note

### 3.2. Implementarea responsive design

Responsive design-ul a fost implementat folosind o abordare mobile-first, asigurând o experiență optimă pe toate dispozitivele.

**3.2.1. Breakpoint-urile utilizate**

Sistemul de breakpoint-uri urmează standardele Tailwind CSS:

```css
/* Mobile First Approach */
/* xs: 0px - 640px (Mobile) */
.container {
  width: 100%;
  padding: 1rem;
}

/* sm: 640px+ (Large Mobile) */
@media (min-width: 640px) {
  .container {
    max-width: 640px;
    padding: 1.5rem;
  }
}

/* md: 768px+ (Tablet) */
@media (min-width: 768px) {
  .container {
    max-width: 768px;
  }
  .grid-responsive {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* lg: 1024px+ (Desktop) */
@media (min-width: 1024px) {
  .container {
    max-width: 1024px;
  }
  .grid-responsive {
    grid-template-columns: repeat(3, 1fr);
  }
}

/* xl: 1280px+ (Large Desktop) */
@media (min-width: 1280px) {
  .container {
    max-width: 1280px;
  }
  .grid-responsive {
    grid-template-columns: repeat(4, 1fr);
  }
}
```

**3.2.2. Layout-ul adaptiv**

Fiecare componentă a fost proiectată să se adapteze la diferite dimensiuni de ecran:

**Header/Navigation:**

- Mobile: Meniu hamburger cu drawer lateral
- Tablet: Meniu parțial vizibil cu iconuri
- Desktop: Meniu complet orizontal

**Grid-ul de produse:**

- Mobile: 1 coloană
- Tablet: 2 coloane
- Desktop: 3-4 coloane

**Formularele:**

- Mobile: Câmpuri stacked vertical
- Tablet/Desktop: Layout în două coloane

**3.2.3. Imagini responsive**

Implementarea imaginilor responsive folosește Next.js Image component:

```typescript
import Image from 'next/image';

const ProductImage = ({ src, alt, priority = false }) => (
  <Image
    src={src}
    alt={alt}
    width={300}
    height={300}
    priority={priority}
    className="w-full h-auto object-cover rounded-lg"
    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
  />
);
```

**3.2.4. Touch-friendly interfaces**

Pentru dispozitivele mobile, interfața a fost optimizată pentru interacțiunea touch:

- **Dimensiunea minimă** a elementelor interactive: 44px
- **Spațierea** adecvată între elemente clickable
- **Gesture support** pentru swipe și scroll
- **Feedback vizual** pentru tap-uri

### 3.3. Experiența utilizatorului (UX)

Designul UX s-a concentrat pe crearea unei experiențe fluide și intuitive pentru utilizatori.

**3.3.1. User Journey Mapping**

Au fost mapate următoarele journey-uri principale:

1. **Primul vizitator:**

   - Landing page → Explorare produse → Înregistrare → Prima comandă

2. **Utilizatorul returnat:**

   - Login → Căutare produs → Adăugare în coș → Checkout

3. **Administratorul:**
   - Login admin → Dashboard → Gestionare produse/comenzi

**3.3.2. Micro-interacțiuni**

Micro-interacțiunile îmbunătățesc feedback-ul utilizatorului:

```typescript
// Exemplu: Animație pentru adăugarea în coș
const AddToCartButton = () => {
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = async () => {
    setIsAdding(true);
    await addToCart(productId);

    // Animație de succes
    setTimeout(() => setIsAdding(false), 2000);
  };

  return (
    <button
      onClick={handleAddToCart}
      className={`transition-all duration-300 ${
        isAdding ? 'bg-green-500 scale-105' : 'bg-blue-500 hover:bg-blue-600'
      }`}
    >
      {isAdding ? '✓ Adăugat!' : '🛒 Adaugă în coș'}
    </button>
  );
};
```

**3.3.3. Loading states și feedback**

Toate acțiunile asincrone au loading states clare:

- **Skeleton loaders** pentru încărcarea conținutului
- **Progress indicators** pentru procese lungi
- **Toast notifications** pentru feedback instant
- **Error boundaries** pentru gestionarea erorilor

**3.3.4. Navigarea intuitivă**

Structura de navigare urmează convențiile web:

```
Header Navigation:
├── Logo (link către home)
├── Search Bar (căutare globală)
├── Navigation Links
│   ├── Produse
│   ├── Categorii
│   ├── Oferte
│   └── Contact
├── User Menu
│   ├── Profil
│   ├── Comenzi
│   ├── Favorite
│   └── Logout
└── Cart Icon (cu indicator număr produse)

Footer Navigation:
├── Link-uri rapide
├── Informații contact
├── Politici
└── Social media
```

### 3.4. Accesibilitatea aplicației

Accesibilitatea a fost o prioritate în dezvoltarea aplicației, urmând ghidurile WCAG 2.1.

**3.4.1. Semantic HTML**

Utilizarea corectă a elementelor HTML semantice:

```html
<main role="main">
  <section aria-labelledby="products-heading">
    <h2 id="products-heading">Produse Recomandate</h2>
    <article role="article" aria-label="Produs: Laptop Gaming">
      <header>
        <h3>Laptop Gaming XYZ</h3>
      </header>
      <img src="laptop.jpg" alt="Laptop Gaming XYZ cu ecran de 15 inch" />
      <footer>
        <button aria-label="Adaugă Laptop Gaming XYZ în coș">
          Adaugă în coș
        </button>
      </footer>
    </article>
  </section>
</main>
```

**3.4.2. ARIA Labels și Roles**

Implementarea ARIA pentru screen readers:

```typescript
const SearchComponent = () => (
  <div role="search" aria-label="Căutare produse">
    <label htmlFor="search-input" className="sr-only">
      Caută produse
    </label>
    <input
      id="search-input"
      type="search"
      placeholder="Caută produse..."
      aria-describedby="search-help"
    />
    <div id="search-help" className="sr-only">
      Introduceți numele produsului pentru căutare
    </div>
  </div>
);
```

**3.4.3. Keyboard Navigation**

Suportul complet pentru navigarea cu tastatura:

- **Tab order** logic și intuitiv
- **Focus indicators** vizibili
- **Skip links** pentru navigarea rapidă
- **Keyboard shortcuts** pentru acțiuni frecvente

**3.4.4. Contrast și vizibilitate**

Respectarea standardelor de contrast WCAG:

- **Contrast minim 4.5:1** pentru text normal
- **Contrast minim 3:1** pentru text mare
- **Focus indicators** cu contrast suficient
- **Suport pentru dark mode** (planificat pentru versiuni viitoare)

**3.4.5. Testarea accesibilității**

Testarea a fost realizată cu:

- **axe-core** pentru testarea automată
- **Screen readers** (NVDA, JAWS) pentru testarea manuală
- **Keyboard-only navigation** testing
- **Color blindness simulators**

Rezultatele testării au arătat o conformitate de 95% cu standardele WCAG 2.1 AA, cu planuri de îmbunătățire pentru conformitatea completă.

---

## 4. IMPLEMENTAREA ȘI SECURIZAREA APLICAȚIEI

### 4.1. Dezvoltarea frontend-ului

Dezvoltarea frontend-ului a urmărit principiile moderne de React development, cu accent pe performanță, reutilizabilitate și mentenabilitate.

**4.1.1. Arhitectura componentelor**

Componentele au fost organizate într-o ierarhie clară:

```typescript
// Componenta de bază pentru produse
interface Product {
  id: string;
  title: string;
  price: number;
  image: string;
  category: string;
  stock: number;
}

// Componenta ProductCard
const ProductCard: React.FC<{ product: Product }> = ({ product }) => {
  const { addToCart } = useCart();
  const [isLoading, setIsLoading] = useState(false);

  const handleAddToCart = async () => {
    setIsLoading(true);
    try {
      await addToCart(product.id);
      toast.success('Produs adăugat în coș!');
    } catch (error) {
      toast.error('Eroare la adăugarea în coș');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow">
      <div className="relative h-48">
        <Image
          src={product.image}
          alt={product.title}
          fill
          className="object-cover"
        />
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <span className="text-white font-semibold">Stoc epuizat</span>
          </div>
        )}
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-lg mb-2 line-clamp-2">
          {product.title}
        </h3>

        <div className="flex items-center justify-between mb-4">
          <span className="text-2xl font-bold text-blue-600">
            {product.price.toFixed(2)} RON
          </span>
          <span className="text-sm text-gray-500">Stoc: {product.stock}</span>
        </div>

        <button
          onClick={handleAddToCart}
          disabled={isLoading || product.stock === 0}
          className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? 'Se adaugă...' : 'Adaugă în coș'}
        </button>
      </div>
    </div>
  );
};
```

**4.1.2. State Management cu Context API**

Gestionarea stării globale folosește React Context:

```typescript
// Auth Context
interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
      fetchUser(storedToken);
    } else {
      setIsLoading(false);
    }
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error('Login failed');
      }

      const data = await response.json();
      setToken(data.token);
      setUser(data.user);
      localStorage.setItem('token', data.token);
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook pentru utilizarea context-ului
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
```

**4.1.3. Custom Hooks pentru logica reutilizabilă**

```typescript
// Hook pentru gestionarea coșului
export const useCart = () => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const addToCart = async (productId: string, quantity: number = 1) => {
    setIsLoading(true);
    try {
      const response = await cartAPI.addItem(productId, quantity);
      setItems(response.data.items);
      return response.data;
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const removeFromCart = async (itemId: string) => {
    setIsLoading(true);
    try {
      const response = await cartAPI.removeItem(itemId);
      setItems(response.data.items);
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const updateQuantity = async (itemId: string, quantity: number) => {
    setIsLoading(true);
    try {
      const response = await cartAPI.updateQuantity(itemId, quantity);
      setItems(response.data.items);
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const getTotalPrice = () => {
    return items.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const getTotalItems = () => {
    return items.reduce((total, item) => total + item.quantity, 0);
  };

  return {
    items,
    isLoading,
    addToCart,
    removeFromCart,
    updateQuantity,
    getTotalPrice,
    getTotalItems,
  };
};
```

_[Continuarea în următorul fișier...]_
