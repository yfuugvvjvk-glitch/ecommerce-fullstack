# Design Document: Announcement Banner

## Overview

The announcement banner feature adds a customizable notification section above the carousel on the main dashboard page. The banner is fully configurable through the admin panel and only displays when it contains content. This design leverages the existing SiteConfig infrastructure for data persistence and follows the established patterns in the codebase.

## Architecture

### System Components

1. **Backend Layer**
   - SiteConfig Service (existing) - handles banner configuration storage
   - Admin Routes - new endpoints for banner management
   - Public Routes - endpoint for fetching active banner

2. **Frontend Layer**
   - AnnouncementBanner Component - displays banner on dashboard
   - AdminBannerEditor Component - admin interface for editing
   - Real-time updates via WebSocket (existing infrastructure)

3. **Data Layer**
   - SiteConfig table (existing) - stores banner configuration
   - JSON-based configuration for flexibility

### Technology Stack

- **Backend**: Fastify, Prisma, PostgreSQL
- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Real-time**: Socket.io (existing)
- **State Management**: React Context (existing patterns)

## Database Schema

### Using Existing SiteConfig Table

The banner configuration will be stored in the existing `SiteConfig` table with the following structure:

```typescript
// SiteConfig entry for announcement banner
{
  key: 'announcement_banner',
  value: JSON.stringify({
    isActive: boolean,
    title: string,
    description: string,
    titleStyle: {
      color: string,           // hex format: #RRGGBB
      backgroundColor: string, // hex format: #RRGGBB
      fontSize: number,        // 12-48
      fontFamily: string,      // 'Arial', 'Times New Roman', etc.
      fontWeight: string,      // 'normal', 'bold', 'light'
      textAlign: string        // 'left', 'center', 'right'
    },
    descriptionStyle: {
      color: string,
      backgroundColor: string,
      fontSize: number,        // 12-32
      fontFamily: string,
      fontWeight: string,
      textAlign: string
    }
  }),
  type: 'json',
  description: 'Announcement banner configuration',
  isPublic: true,
  updatedById: string,
  updatedAt: DateTime
}
```

### Data Model Interface

```typescript
interface AnnouncementBannerConfig {
  isActive: boolean;
  title: string;
  description: string;
  titleStyle: TextStyle;
  descriptionStyle: TextStyle;
}

interface TextStyle {
  color: string;
  backgroundColor: string;
  fontSize: number;
  fontFamily: string;
  fontWeight: 'normal' | 'bold' | 'light';
  textAlign: 'left' | 'center' | 'right';
}
```

## API Endpoints

### Admin Endpoints

#### GET /api/admin/announcement-banner

Retrieves the current banner configuration for editing.

**Authentication**: Required (Admin only)

**Response**:

```typescript
{
  success: true,
  data: AnnouncementBannerConfig
}
```

**Error Responses**:

- 401: Unauthorized
- 404: Banner configuration not found (returns default)

#### PUT /api/admin/announcement-banner

Updates the banner configuration.

**Authentication**: Required (Admin only)

**Request Body**:

```typescript
{
  isActive: boolean,
  title: string,
  description: string,
  titleStyle: TextStyle,
  descriptionStyle: TextStyle
}
```

**Validation Rules**:

- title: max 200 characters
- description: max 1000 characters
- colors: valid hex format (#RRGGBB or #RRGGBBAA)
- fontSize (title): 12-48
- fontSize (description): 12-32
- fontFamily: from predefined list
- fontWeight: 'normal' | 'bold' | 'light'
- textAlign: 'left' | 'center' | 'right'

**Response**:

```typescript
{
  success: true,
  data: AnnouncementBannerConfig
}
```

**Error Responses**:

- 400: Validation error
- 401: Unauthorized
- 500: Server error

### Public Endpoints

#### GET /api/announcement-banner

Retrieves the active banner for public display.

**Authentication**: Not required

**Response**:

```typescript
{
  success: true,
  data: AnnouncementBannerConfig | null
}
```

**Logic**:

- Returns null if `isActive` is false
- Returns null if both title and description are empty
- Returns full configuration otherwise

## Component Structure

### Frontend Components

#### 1. AnnouncementBanner Component

**Location**: `frontend/components/AnnouncementBanner.tsx`

**Purpose**: Displays the banner on the dashboard page

**Props**:

```typescript
interface AnnouncementBannerProps {
  config: AnnouncementBannerConfig;
  onClose?: () => void; // Optional close handler
}
```

**Features**:

- Responsive design (mobile, tablet, desktop)
- Optional close button
- Smooth animations (fade in/out)
- Accessibility compliant (ARIA labels, keyboard navigation)

**Styling Approach**:

- Tailwind CSS for base styles
- Inline styles for user-customizable properties (colors, fonts, sizes)
- CSS transitions for animations

#### 2. AdminBannerEditor Component

**Location**: `frontend/components/admin/AdminBannerEditor.tsx`

**Purpose**: Admin interface for editing banner configuration

**Features**:

- Form with controlled inputs
- Live preview panel
- Color pickers for text and background colors
- Font size sliders (12-48px for title, 12-32px for description)
- Font family dropdown
- Font weight selector
- Text alignment buttons
- Active/inactive toggle
- Save button with loading state
- Validation feedback

**State Management**:

```typescript
const [config, setConfig] = useState<AnnouncementBannerConfig>(initialConfig);
const [isSaving, setIsSaving] = useState(false);
const [errors, setErrors] = useState<Record<string, string>>({});
```

#### 3. BannerPreview Component

**Location**: `frontend/components/admin/BannerPreview.tsx`

**Purpose**: Real-time preview of banner appearance

**Props**:

```typescript
interface BannerPreviewProps {
  config: AnnouncementBannerConfig;
}
```

**Features**:

- Renders banner exactly as it will appear on dashboard
- Updates in real-time as user edits
- Shows placeholder text if title/description empty

### Component Hierarchy

```
DashboardPage
└── AnnouncementBanner (conditional render)

AdminDashboard
└── AdminBannerEditor
    ├── BannerConfigForm
    └── BannerPreview
```

## State Management

### Client-Side State

**Dashboard Page**:

```typescript
const [bannerConfig, setBannerConfig] =
  useState<AnnouncementBannerConfig | null>(null);
const [showBanner, setShowBanner] = useState(true);

useEffect(() => {
  fetchBannerConfig();
}, []);

const fetchBannerConfig = async () => {
  const response = await apiClient.get('/api/announcement-banner');
  if (response.data.data) {
    setBannerConfig(response.data.data);
  }
};
```

**Admin Editor**:

```typescript
const [config, setConfig] = useState<AnnouncementBannerConfig>(defaultConfig);
const [originalConfig, setOriginalConfig] =
  useState<AnnouncementBannerConfig>(defaultConfig);
const [hasChanges, setHasChanges] = useState(false);

useEffect(() => {
  fetchCurrentConfig();
}, []);

useEffect(() => {
  setHasChanges(JSON.stringify(config) !== JSON.stringify(originalConfig));
}, [config, originalConfig]);
```

### Real-time Updates

Leverage existing WebSocket infrastructure:

```typescript
// In dashboard page
useEffect(() => {
  const socket = io(API_URL);

  socket.on('config_updated', (data) => {
    if (data.key === 'announcement_banner') {
      setBannerConfig(data.value);
    }
  });

  return () => socket.disconnect();
}, []);
```

## Styling Approach

### Responsive Design

```typescript
// Mobile (< 640px)
- Stack title and description vertically
- Reduce font sizes by 20%
- Full width with padding

// Tablet (640px - 1024px)
- Maintain layout
- Standard font sizes
- Adequate padding

// Desktop (> 1024px)
- Full layout with all features
- Maximum width container
- Optimal spacing
```

### Tailwind CSS Classes

**Base Container**:

```css
className="w-full bg-white shadow-md rounded-lg overflow-hidden mb-6 transition-all duration-300"
```

**Responsive Padding**:

```css
className="p-4 sm:p-6 lg:p-8"
```

**Close Button**:

```css
className="absolute top-2 right-2 p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition"
```

### Dynamic Inline Styles

```typescript
const titleStyle = {
  color: config.titleStyle.color,
  backgroundColor: config.titleStyle.backgroundColor,
  fontSize: `${config.titleStyle.fontSize}px`,
  fontFamily: config.titleStyle.fontFamily,
  fontWeight: config.titleStyle.fontWeight,
  textAlign: config.titleStyle.textAlign,
};
```

## Integration Points

### 1. Dashboard Page Integration

**File**: `frontend/app/(dashboard)/dashboard/page.tsx`

**Integration Point**: Above the carousel component

```typescript
// Add state for banner
const [bannerConfig, setBannerConfig] = useState<AnnouncementBannerConfig | null>(null);
const [showBanner, setShowBanner] = useState(true);

// Fetch banner in useEffect
useEffect(() => {
  fetchBannerConfig();
}, []);

// Render banner before carousel
return (
  <div className="flex gap-6">
    <Sidebar ... />

    <div className="flex-1 space-y-6">
      {/* Announcement Banner */}
      {bannerConfig && showBanner && (
        <AnnouncementBanner
          config={bannerConfig}
          onClose={() => setShowBanner(false)}
        />
      )}

      {/* Existing Carousel */}
      {!selectedCategory && carouselItems.length > 0 && <Carousel items={carouselItems} />}

      {/* Rest of the page */}
    </div>
  </div>
);
```

### 2. Admin Panel Integration

**File**: `frontend/app/(dashboard)/admin/banner/page.tsx` (new)

**Navigation**: Add to admin sidebar

```typescript
// In admin layout or sidebar
<Link href="/admin/banner">
  📢 Banner Anunțuri
</Link>
```

### 3. Backend Service Integration

**File**: `backend/src/services/site-config.service.ts` (existing)

No changes needed - use existing methods:

- `getConfig('announcement_banner')`
- `setConfig('announcement_banner', value, options)`

### 4. Backend Routes Integration

**File**: `backend/src/routes/admin.routes.ts`

Add new routes:

```typescript
// GET /api/admin/announcement-banner
fastify.get('/announcement-banner', {
  preHandler: [authenticate, requireAdmin],
  handler: async (request, reply) => {
    // Implementation
  },
});

// PUT /api/admin/announcement-banner
fastify.put('/announcement-banner', {
  preHandler: [authenticate, requireAdmin],
  handler: async (request, reply) => {
    // Implementation
  },
});
```

**File**: `backend/src/routes/public.routes.ts`

Add public route:

```typescript
// GET /api/announcement-banner
fastify.get('/announcement-banner', {
  handler: async (request, reply) => {
    // Implementation
  },
});
```

## Correctness Properties

_A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees._

### Property 1: Empty Banner Visibility

_For any_ banner configuration where both title and description are empty strings, the banner component should not be rendered on the dashboard.
**Validates: Requirements 2.1.2**

### Property 2: Close Button Functionality

_For any_ banner configuration that is displayed, when the close button is clicked, the banner should be hidden from view.
**Validates: Requirements 2.1.4**

### Property 3: Content Update Persistence

_For any_ valid title or description string, when an admin updates the banner content and saves, retrieving the configuration should return the updated content.
**Validates: Requirements 2.2.2, 2.2.3**

### Property 4: Active Toggle Preserves Content

_For any_ banner configuration with non-empty content, toggling the isActive status should preserve the title, description, and all style properties unchanged.
**Validates: Requirements 2.2.4**

### Property 5: Style Configuration Persistence

_For any_ valid style property value (color, backgroundColor, fontSize, fontFamily, fontWeight, textAlign) for either title or description, when an admin updates that property and saves, retrieving the configuration should return the updated style value.
**Validates: Requirements 2.3.1, 2.3.2, 2.3.3, 2.3.4, 2.3.5, 2.3.6, 2.4.1, 2.4.2, 2.4.3, 2.4.4, 2.4.5, 2.4.6**

### Property 6: Configuration Round-Trip

_For any_ valid banner configuration, saving it to the database and then retrieving it should return an equivalent configuration with all properties preserved.
**Validates: Requirements 2.5.1**

### Property 7: Real-time Update Broadcast

_For any_ banner configuration update, when saved successfully, a WebSocket event should be emitted to notify connected clients of the change.
**Validates: Requirements 2.5.3**

### Property 8: Preview Reflects Form State

_For any_ change to the banner configuration in the admin form, the preview component should render the banner with the updated configuration.
**Validates: Requirements 2.6.1, 2.6.2**

## Error Handling

### Validation Errors

**Client-Side Validation**:

```typescript
const validateBannerConfig = (
  config: AnnouncementBannerConfig
): Record<string, string> => {
  const errors: Record<string, string> = {};

  // Title length
  if (config.title.length > 200) {
    errors.title = 'Titlul nu poate depăși 200 de caractere';
  }

  // Description length
  if (config.description.length > 1000) {
    errors.description = 'Descrierea nu poate depăși 1000 de caractere';
  }

  // Color format validation
  const hexColorRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{8})$/;
  if (!hexColorRegex.test(config.titleStyle.color)) {
    errors.titleColor = 'Culoarea trebuie să fie în format hex (#RRGGBB)';
  }
  if (!hexColorRegex.test(config.titleStyle.backgroundColor)) {
    errors.titleBgColor =
      'Culoarea de fundal trebuie să fie în format hex (#RRGGBB)';
  }
  if (!hexColorRegex.test(config.descriptionStyle.color)) {
    errors.descColor = 'Culoarea trebuie să fie în format hex (#RRGGBB)';
  }
  if (!hexColorRegex.test(config.descriptionStyle.backgroundColor)) {
    errors.descBgColor =
      'Culoarea de fundal trebuie să fie în format hex (#RRGGBB)';
  }

  // Font size ranges
  if (config.titleStyle.fontSize < 12 || config.titleStyle.fontSize > 48) {
    errors.titleFontSize = 'Mărimea fontului trebuie să fie între 12 și 48 px';
  }
  if (
    config.descriptionStyle.fontSize < 12 ||
    config.descriptionStyle.fontSize > 32
  ) {
    errors.descFontSize = 'Mărimea fontului trebuie să fie între 12 și 32 px';
  }

  return errors;
};
```

**Server-Side Validation**:

```typescript
// In backend route handler
const validateBannerConfig = (config: any) => {
  const errors: string[] = [];

  if (typeof config.title !== 'string' || config.title.length > 200) {
    errors.push('Invalid title');
  }

  if (
    typeof config.description !== 'string' ||
    config.description.length > 1000
  ) {
    errors.push('Invalid description');
  }

  // Validate colors
  const hexColorRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{8})$/;
  if (!hexColorRegex.test(config.titleStyle?.color)) {
    errors.push('Invalid title color format');
  }

  // Validate font sizes
  if (config.titleStyle?.fontSize < 12 || config.titleStyle?.fontSize > 48) {
    errors.push('Title font size out of range');
  }

  if (
    config.descriptionStyle?.fontSize < 12 ||
    config.descriptionStyle?.fontSize > 32
  ) {
    errors.push('Description font size out of range');
  }

  // Validate enums
  const validFontWeights = ['normal', 'bold', 'light'];
  if (!validFontWeights.includes(config.titleStyle?.fontWeight)) {
    errors.push('Invalid title font weight');
  }

  const validTextAligns = ['left', 'center', 'right'];
  if (!validTextAligns.includes(config.titleStyle?.textAlign)) {
    errors.push('Invalid title text alignment');
  }

  return errors;
};
```

### API Error Responses

**Standard Error Format**:

```typescript
{
  success: false,
  error: {
    code: string,
    message: string,
    details?: any
  }
}
```

**Error Codes**:

- `VALIDATION_ERROR`: Invalid input data
- `UNAUTHORIZED`: User not authenticated
- `FORBIDDEN`: User not authorized (not admin)
- `NOT_FOUND`: Banner configuration not found
- `SERVER_ERROR`: Internal server error

### Error Handling in Components

**Admin Editor**:

```typescript
const handleSave = async () => {
  try {
    setIsSaving(true);
    setErrors({});

    // Client-side validation
    const validationErrors = validateBannerConfig(config);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    // API call
    await apiClient.put('/api/admin/announcement-banner', config);

    // Success feedback
    toast.success('Banner salvat cu succes!');
    setOriginalConfig(config);
  } catch (error: any) {
    // Handle API errors
    if (error.response?.data?.error) {
      toast.error(error.response.data.error.message);
    } else {
      toast.error('Eroare la salvarea banner-ului');
    }
  } finally {
    setIsSaving(false);
  }
};
```

**Dashboard Banner**:

```typescript
useEffect(() => {
  const fetchBanner = async () => {
    try {
      const response = await apiClient.get('/api/announcement-banner');
      setBannerConfig(response.data.data);
    } catch (error) {
      console.error('Failed to fetch banner:', error);
      // Fail silently - banner is optional
      setBannerConfig(null);
    }
  };

  fetchBanner();
}, []);
```

## Testing Strategy

### Dual Testing Approach

This feature requires both unit tests and property-based tests for comprehensive coverage.

**Unit Tests** focus on:

- Specific examples of banner configurations
- Edge cases (empty strings, boundary values)
- Error conditions (invalid colors, out-of-range font sizes)
- Component rendering with specific props
- API endpoint responses

**Property Tests** focus on:

- Universal properties across all valid configurations
- Round-trip persistence (save and retrieve)
- Style property updates
- Content preservation during toggle operations
- Real-time update broadcasts

### Property-Based Testing Configuration

**Framework**: fast-check (for TypeScript/JavaScript)

**Configuration**:

- Minimum 100 iterations per property test
- Each test references its design document property
- Tag format: **Feature: announcement-banner, Property {number}: {property_text}**

### Test Coverage Areas

#### Backend Tests

**Unit Tests**:

```typescript
describe('Announcement Banner API', () => {
  describe('GET /api/admin/announcement-banner', () => {
    it('should return banner config for admin user', async () => {
      // Test implementation
    });

    it('should return 401 for non-authenticated user', async () => {
      // Test implementation
    });

    it('should return default config if none exists', async () => {
      // Test implementation
    });
  });

  describe('PUT /api/admin/announcement-banner', () => {
    it('should update banner config with valid data', async () => {
      // Test implementation
    });

    it('should reject invalid color format', async () => {
      // Test implementation
    });

    it('should reject font size out of range', async () => {
      // Test implementation
    });
  });

  describe('GET /api/announcement-banner', () => {
    it('should return null when banner is inactive', async () => {
      // Test implementation
    });

    it('should return null when title and description are empty', async () => {
      // Test implementation
    });

    it('should return config when active and has content', async () => {
      // Test implementation
    });
  });
});
```

**Property Tests**:

```typescript
import fc from 'fast-check';

describe('Announcement Banner Properties', () => {
  // Feature: announcement-banner, Property 6: Configuration Round-Trip
  it('should preserve all properties in round-trip save/retrieve', async () => {
    await fc.assert(
      fc.asyncProperty(bannerConfigArbitrary(), async (config) => {
        // Save config
        await siteConfigService.setConfig('announcement_banner', config, {
          type: 'json',
          isPublic: true,
        });

        // Retrieve config
        const retrieved = await siteConfigService.getConfig(
          'announcement_banner'
        );

        // Assert equality
        expect(retrieved.value).toEqual(config);
      }),
      { numRuns: 100 }
    );
  });

  // Feature: announcement-banner, Property 4: Active Toggle Preserves Content
  it('should preserve content when toggling active status', async () => {
    await fc.assert(
      fc.asyncProperty(bannerConfigArbitrary(), async (config) => {
        // Save initial config
        await siteConfigService.setConfig('announcement_banner', config, {
          type: 'json',
          isPublic: true,
        });

        // Toggle active status
        const toggled = { ...config, isActive: !config.isActive };
        await siteConfigService.setConfig('announcement_banner', toggled, {
          type: 'json',
          isPublic: true,
        });

        // Retrieve and verify content unchanged
        const retrieved = await siteConfigService.getConfig(
          'announcement_banner'
        );
        expect(retrieved.value.title).toEqual(config.title);
        expect(retrieved.value.description).toEqual(config.description);
        expect(retrieved.value.titleStyle).toEqual(config.titleStyle);
        expect(retrieved.value.descriptionStyle).toEqual(
          config.descriptionStyle
        );
      }),
      { numRuns: 100 }
    );
  });
});

// Arbitrary generators for property tests
const hexColorArbitrary = () =>
  fc.hexaString({ minLength: 6, maxLength: 6 }).map((hex) => `#${hex}`);

const textStyleArbitrary = (minFontSize: number, maxFontSize: number) =>
  fc.record({
    color: hexColorArbitrary(),
    backgroundColor: hexColorArbitrary(),
    fontSize: fc.integer({ min: minFontSize, max: maxFontSize }),
    fontFamily: fc.constantFrom(
      'Arial',
      'Times New Roman',
      'Courier',
      'Georgia',
      'Verdana'
    ),
    fontWeight: fc.constantFrom('normal', 'bold', 'light'),
    textAlign: fc.constantFrom('left', 'center', 'right'),
  });

const bannerConfigArbitrary = () =>
  fc.record({
    isActive: fc.boolean(),
    title: fc.string({ maxLength: 200 }),
    description: fc.string({ maxLength: 1000 }),
    titleStyle: textStyleArbitrary(12, 48),
    descriptionStyle: textStyleArbitrary(12, 32),
  });
```

#### Frontend Tests

**Unit Tests**:

```typescript
describe('AnnouncementBanner Component', () => {
  it('should render with provided config', () => {
    const config = createMockConfig();
    render(<AnnouncementBanner config={config} />);
    expect(screen.getByText(config.title)).toBeInTheDocument();
  });

  it('should not render when title and description are empty', () => {
    const config = createMockConfig({ title: '', description: '' });
    const { container } = render(<AnnouncementBanner config={config} />);
    expect(container.firstChild).toBeNull();
  });

  it('should call onClose when close button is clicked', () => {
    const onClose = jest.fn();
    const config = createMockConfig();
    render(<AnnouncementBanner config={config} onClose={onClose} />);

    fireEvent.click(screen.getByRole('button', { name: /close/i }));
    expect(onClose).toHaveBeenCalled();
  });

  it('should apply custom styles from config', () => {
    const config = createMockConfig({
      titleStyle: {
        color: '#FF0000',
        fontSize: 24,
        fontWeight: 'bold'
      }
    });
    render(<AnnouncementBanner config={config} />);

    const title = screen.getByText(config.title);
    expect(title).toHaveStyle({
      color: '#FF0000',
      fontSize: '24px',
      fontWeight: 'bold'
    });
  });
});

describe('AdminBannerEditor Component', () => {
  it('should load current config on mount', async () => {
    const mockConfig = createMockConfig();
    apiClient.get.mockResolvedValue({ data: { data: mockConfig } });

    render(<AdminBannerEditor />);

    await waitFor(() => {
      expect(screen.getByDisplayValue(mockConfig.title)).toBeInTheDocument();
    });
  });

  it('should validate title length', async () => {
    render(<AdminBannerEditor />);

    const titleInput = screen.getByLabelText(/titlu/i);
    fireEvent.change(titleInput, { target: { value: 'a'.repeat(201) } });

    fireEvent.click(screen.getByText(/salvează/i));

    await waitFor(() => {
      expect(screen.getByText(/nu poate depăși 200/i)).toBeInTheDocument();
    });
  });

  it('should update preview in real-time', () => {
    render(<AdminBannerEditor />);

    const titleInput = screen.getByLabelText(/titlu/i);
    fireEvent.change(titleInput, { target: { value: 'New Title' } });

    // Preview should show new title
    expect(screen.getByText('New Title')).toBeInTheDocument();
  });
});
```

**Property Tests**:

```typescript
describe('Banner Component Properties', () => {
  // Feature: announcement-banner, Property 1: Empty Banner Visibility
  it('should not render when both title and description are empty', () => {
    fc.assert(
      fc.property(
        fc.record({
          title: fc.constant(''),
          description: fc.constant(''),
          isActive: fc.boolean(),
          titleStyle: textStyleArbitrary(12, 48),
          descriptionStyle: textStyleArbitrary(12, 32)
        }),
        (config) => {
          const { container } = render(<AnnouncementBanner config={config} />);
          expect(container.firstChild).toBeNull();
        }
      ),
      { numRuns: 100 }
    );
  });

  // Feature: announcement-banner, Property 8: Preview Reflects Form State
  it('should update preview when form state changes', () => {
    fc.assert(
      fc.property(
        fc.string({ maxLength: 200 }),
        (newTitle) => {
          const { rerender } = render(<BannerPreview config={createMockConfig()} />);

          const updatedConfig = createMockConfig({ title: newTitle });
          rerender(<BannerPreview config={updatedConfig} />);

          if (newTitle) {
            expect(screen.getByText(newTitle)).toBeInTheDocument();
          }
        }
      ),
      { numRuns: 100 }
    );
  });
});
```

### Integration Tests

**End-to-End Flow**:

```typescript
describe('Banner E2E Flow', () => {
  it('should complete full admin workflow', async () => {
    // 1. Admin logs in
    await loginAsAdmin();

    // 2. Navigate to banner editor
    await page.goto('/admin/banner');

    // 3. Edit banner config
    await page.fill('[name="title"]', 'Test Banner');
    await page.fill('[name="description"]', 'Test Description');
    await page.click('[data-testid="color-picker-title"]');
    await page.fill('[name="titleColor"]', '#FF0000');

    // 4. Verify preview updates
    const preview = await page.locator('[data-testid="banner-preview"]');
    await expect(preview).toContainText('Test Banner');

    // 5. Save changes
    await page.click('button:has-text("Salvează")');
    await expect(page.locator('.toast-success')).toBeVisible();

    // 6. Navigate to dashboard
    await page.goto('/dashboard');

    // 7. Verify banner appears
    await expect(
      page.locator('[data-testid="announcement-banner"]')
    ).toBeVisible();
    await expect(
      page.locator('[data-testid="announcement-banner"]')
    ).toContainText('Test Banner');
  });
});
```

## Performance Considerations

### Backend Optimization

**Caching Strategy**:

```typescript
// Cache banner config for public endpoint
const bannerCache = new Map<string, { data: any; timestamp: number }>();
const CACHE_TTL = 60000; // 1 minute

const getCachedBanner = async () => {
  const cached = bannerCache.get('announcement_banner');
  const now = Date.now();

  if (cached && now - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }

  const config = await siteConfigService.getConfig('announcement_banner');
  bannerCache.set('announcement_banner', { data: config, timestamp: now });

  return config;
};

// Invalidate cache on update
const updateBanner = async (config: any) => {
  await siteConfigService.setConfig('announcement_banner', config, options);
  bannerCache.delete('announcement_banner');
};
```

### Frontend Optimization

**Lazy Loading**:

```typescript
// Lazy load admin editor (not needed on dashboard)
const AdminBannerEditor = dynamic(() => import('@/components/admin/AdminBannerEditor'), {
  loading: () => <LoadingSpinner />,
  ssr: false
});
```

**Memoization**:

```typescript
// Memoize banner component to prevent unnecessary re-renders
const AnnouncementBanner = React.memo(
  ({ config, onClose }: Props) => {
    // Component implementation
  },
  (prevProps, nextProps) => {
    return (
      JSON.stringify(prevProps.config) === JSON.stringify(nextProps.config)
    );
  }
);
```

**Debounced Preview Updates**:

```typescript
// Debounce preview updates in admin editor
const debouncedUpdatePreview = useMemo(
  () =>
    debounce((config: AnnouncementBannerConfig) => {
      setPreviewConfig(config);
    }, 300),
  []
);

useEffect(() => {
  debouncedUpdatePreview(config);
}, [config, debouncedUpdatePreview]);
```

## Security Considerations

### Authentication & Authorization

**Admin Endpoints**:

- Require authentication (JWT token)
- Require admin role
- Validate user permissions on every request

**Public Endpoint**:

- No authentication required
- Only returns public data (isPublic: true)
- No sensitive information exposed

### Input Sanitization

**XSS Prevention**:

```typescript
// Sanitize HTML in title and description
import DOMPurify from 'dompurify';

const sanitizeConfig = (config: AnnouncementBannerConfig) => {
  return {
    ...config,
    title: DOMPurify.sanitize(config.title, { ALLOWED_TAGS: [] }),
    description: DOMPurify.sanitize(config.description, { ALLOWED_TAGS: [] }),
  };
};
```

**SQL Injection Prevention**:

- Use Prisma ORM (parameterized queries)
- No raw SQL queries
- Input validation before database operations

### Rate Limiting

**Admin Endpoints**:

```typescript
// Rate limit admin updates
fastify.register(require('@fastify/rate-limit'), {
  max: 10,
  timeWindow: '1 minute',
  cache: 10000,
  allowList: [],
  redis: redisClient,
});
```

## Accessibility

### ARIA Labels

```typescript
<div
  role="banner"
  aria-label="Announcement banner"
  className="announcement-banner"
>
  <h2 id="banner-title">{config.title}</h2>
  <p id="banner-description">{config.description}</p>
  <button
    aria-label="Close announcement banner"
    onClick={onClose}
  >
    <X aria-hidden="true" />
  </button>
</div>
```

### Keyboard Navigation

```typescript
// Close button keyboard support
<button
  onClick={onClose}
  onKeyDown={(e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClose();
    }
  }}
  aria-label="Close banner"
>
  <X />
</button>
```

### Color Contrast

**Validation**:

```typescript
// Warn admin if color contrast is insufficient
const checkContrast = (textColor: string, bgColor: string): boolean => {
  const ratio = calculateContrastRatio(textColor, bgColor);
  return ratio >= 4.5; // WCAG AA standard
};

// Show warning in admin editor
{!checkContrast(config.titleStyle.color, config.titleStyle.backgroundColor) && (
  <div className="text-yellow-600 text-sm mt-2">
    ⚠️ Contrastul culorilor poate fi insuficient pentru lizibilitate
  </div>
)}
```

### Screen Reader Support

```typescript
// Announce banner updates to screen readers
<div aria-live="polite" aria-atomic="true">
  {bannerConfig && (
    <AnnouncementBanner config={bannerConfig} onClose={handleClose} />
  )}
</div>
```

## Deployment Considerations

### Database Migration

**Initial Setup**:

```typescript
// Run initialization script
const initializeBanner = async () => {
  const existing = await siteConfigService.getConfig('announcement_banner');

  if (!existing) {
    await siteConfigService.setConfig(
      'announcement_banner',
      {
        isActive: false,
        title: '',
        description: '',
        titleStyle: {
          color: '#000000',
          backgroundColor: '#FFFFFF',
          fontSize: 24,
          fontFamily: 'Arial',
          fontWeight: 'bold',
          textAlign: 'center',
        },
        descriptionStyle: {
          color: '#333333',
          backgroundColor: '#F9FAFB',
          fontSize: 16,
          fontFamily: 'Arial',
          fontWeight: 'normal',
          textAlign: 'left',
        },
      },
      {
        type: 'json',
        description: 'Announcement banner configuration',
        isPublic: true,
      }
    );
  }
};
```

### Environment Variables

No new environment variables required - uses existing database connection.

### Rollback Plan

**If issues occur**:

1. Set `isActive: false` in database
2. Banner will not display
3. No data loss - configuration preserved
4. Can be re-enabled after fix

### Monitoring

**Metrics to Track**:

- Banner update frequency
- API response times
- WebSocket connection stability
- Error rates on banner endpoints

**Logging**:

```typescript
// Log banner updates
logger.info('Banner updated', {
  userId: request.user.id,
  changes: {
    isActive: config.isActive,
    hasTitle: !!config.title,
    hasDescription: !!config.description,
  },
  timestamp: new Date(),
});
```

## Future Enhancements

### Phase 2 Features (Nice to Have)

1. **Multiple Banners with Rotation**
   - Support multiple banner configurations
   - Rotate between banners on timer
   - Priority/weight system

2. **Scheduled Display**
   - Start date/time
   - End date/time
   - Timezone support

3. **User Dismissal Persistence**
   - Remember when user closes banner
   - Don't show again for X days
   - Per-banner dismissal tracking

4. **Rich Text Editor**
   - Support for bold, italic, links
   - Emoji support
   - Markdown rendering

5. **A/B Testing**
   - Multiple banner variants
   - Track click-through rates
   - Analytics integration

6. **Targeting Rules**
   - Show to specific user roles
   - Show based on user location
   - Show based on user behavior

7. **Animation Options**
   - Slide in/out animations
   - Fade effects
   - Bounce effects

8. **Call-to-Action Button**
   - Optional CTA button
   - Configurable text and link
   - Track button clicks

## Summary

This design provides a comprehensive solution for the announcement banner feature that:

- Leverages existing infrastructure (SiteConfig, WebSocket)
- Follows established patterns in the codebase
- Provides full customization through admin panel
- Ensures real-time updates across clients
- Maintains high performance with caching
- Includes comprehensive testing strategy
- Considers security and accessibility
- Plans for future enhancements

The implementation is minimal yet complete, focusing on the core requirements while maintaining flexibility for future expansion.
