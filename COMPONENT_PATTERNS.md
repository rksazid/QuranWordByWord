# Quran App - Component Patterns & Coding Reference

## Pattern 1: Creating a New Modal Component

### HTML Structure
```html
<!-- Modal Overlay -->
<div id="myModal" class="modal-overlay" style="display: none;">
    <div class="modal">
        <!-- Modal Header -->
        <div class="modal-header">
            <h3>Modal Title</h3>
            <button class="close-btn" title="Close modal">
                <i class="fas fa-times"></i>
            </button>
        </div>
        
        <!-- Modal Content -->
        <div class="modal-content">
            <!-- Your content here -->
        </div>
    </div>
</div>
```

### CSS Template
```css
/* Modal base styles (already defined in styles.css) */
.modal-overlay {
    display: none;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: var(--bg-modal);
    z-index: 200;
    align-items: center;
    justify-content: center;
    animation: fadeIn 0.3s ease;
}

.modal {
    background: var(--bg-secondary);
    border-radius: var(--border-radius);
    box-shadow: var(--shadow-lg);
    max-width: 600px;
    width: 90%;
    max-height: 85vh;
    overflow-y: auto;
    animation: slideUp 0.3s ease;
}
```

### JavaScript Pattern
```javascript
// 1. Add DOM element reference
const elements = {
    myModal: document.getElementById('myModal'),
    closeMyModalBtn: document.getElementById('closeMyModalBtn')
};

// 2. Open function
function openMyModal() {
    try {
        // Validate data if needed
        if (!isDataReady()) {
            showError('Please wait...');
            return;
        }
        
        // Render content if dynamic
        renderMyModalContent();
        
        // Show modal
        elements.myModal.style.display = 'flex';
        console.log('Modal opened');
    } catch (error) {
        console.error('Error opening modal:', error);
        showError('Failed to open modal');
    }
}

// 3. Close function
function closeMyModal() {
    elements.myModal.style.display = 'none';
}

// 4. Add event listeners
setupEventListeners() {
    elements.closeMyModalBtn.addEventListener('click', closeMyModal);
}

// 5. Close on overlay click
elements.myModal.addEventListener('click', function(e) {
    if (e.target === this) {
        closeMyModal();
    }
});
```

---

## Pattern 2: Creating a New Card Component

### HTML Structure
```html
<div class="surah-card">
    <div class="card-header">
        <h3 class="card-title">Title</h3>
        <span class="card-badge">Badge</span>
    </div>
    
    <div class="card-content">
        <!-- Content here -->
    </div>
    
    <div class="card-footer">
        <button class="card-action-btn">Action</button>
    </div>
</div>
```

### CSS Template
```css
.surah-card {
    background: var(--bg-card);
    border: 1px solid var(--border-color);
    border-radius: var(--border-radius);
    padding: 1.5rem;
    box-shadow: var(--shadow-sm);
    transition: var(--transition);
    cursor: pointer;
}

.surah-card:hover {
    transform: translateY(-4px);
    box-shadow: var(--shadow-md);
    border-color: var(--primary-color);
}

.card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
}

.card-title {
    font-size: 1.3rem;
    font-weight: 600;
    color: var(--text-primary);
}

.card-badge {
    background: var(--primary-light);
    color: white;
    padding: 0.25rem 0.75rem;
    border-radius: 20px;
    font-size: 0.85rem;
}
```

### JavaScript Pattern
```javascript
function createCard(data) {
    const card = document.createElement('div');
    card.className = 'surah-card';
    
    card.innerHTML = `
        <div class="card-header">
            <h3 class="card-title">${data.title}</h3>
            <span class="card-badge">${data.badge}</span>
        </div>
        <div class="card-content">
            ${data.content}
        </div>
    `;
    
    // Add event listeners
    card.addEventListener('click', () => handleCardClick(data.id));
    
    return card;
}

function renderCards(items) {
    const container = document.getElementById('cardsContainer');
    container.innerHTML = '';
    
    items.forEach(item => {
        const card = createCard(item);
        container.appendChild(card);
    });
}
```

---

## Pattern 3: Creating a List/Grid View with Toggle

### HTML Structure
```html
<div class="view-controls">
    <span class="view-label">View:</span>
    <div class="toggle-buttons">
        <button class="toggle-btn active" data-view="card">
            <i class="fas fa-th-large"></i> Cards
        </button>
        <button class="toggle-btn" data-view="list">
            <i class="fas fa-list"></i> List
        </button>
    </div>
</div>

<!-- Content area that changes -->
<div id="itemsContainer" class="items-card-view">
    <!-- Items rendered here -->
</div>
```

### CSS Template
```css
.view-controls {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-bottom: 2rem;
    padding: 1rem;
    background: var(--bg-card);
    border-radius: var(--border-radius);
}

.toggle-buttons {
    display: flex;
    gap: 0.5rem;
}

.toggle-btn {
    padding: 0.5rem 1rem;
    border: 2px solid var(--border-color);
    background: transparent;
    border-radius: var(--border-radius-sm);
    cursor: pointer;
    transition: var(--transition);
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.toggle-btn.active {
    border-color: var(--primary-color);
    background: var(--primary-light);
    color: white;
}

/* Card view - grid layout */
.items-card-view {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 1.5rem;
}

/* List view - single column */
.items-list-view {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

@media (max-width: 768px) {
    .items-card-view {
        grid-template-columns: 1fr;
    }
}
```

### JavaScript Pattern
```javascript
function switchView(view) {
    appData.currentView = view;
    
    const container = document.getElementById('itemsContainer');
    container.className = `items-${view}-view`;
    
    // Update button states
    document.querySelectorAll('.toggle-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.view === view) {
            btn.classList.add('active');
        }
    });
    
    // Re-render content in new layout
    renderItems();
    
    // Save preference
    saveSettings();
}

// Setup toggle listeners
document.querySelectorAll('.toggle-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        switchView(btn.dataset.view);
    });
});
```

---

## Pattern 4: Creating Settings Control Group

### HTML Structure
```html
<div class="settings-group">
    <label class="settings-label">Setting Name</label>
    
    <!-- For toggle control -->
    <label class="control-label">
        <input type="checkbox" id="mySetting" checked>
        <span class="checkmark"></span>
        Setting Description
    </label>
    
    <!-- For select/dropdown -->
    <select id="mySelect" class="settings-select">
        <option value="option1">Option 1</option>
        <option value="option2">Option 2</option>
    </select>
    
    <!-- For range control -->
    <div class="range-control">
        <input type="range" id="myRange" min="0.5" max="3" step="0.1" value="1">
        <span id="rangeDisplay">1.0x</span>
    </div>
</div>
```

### CSS Template
```css
.settings-group {
    margin-bottom: 2rem;
    padding: 1.5rem;
    background: var(--bg-card);
    border-radius: var(--border-radius);
    border-left: 4px solid var(--primary-color);
}

.settings-label {
    display: block;
    font-weight: 600;
    color: var(--text-primary);
    margin-bottom: 1rem;
    font-size: 1.1rem;
}

.control-label {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    cursor: pointer;
    color: var(--text-secondary);
    transition: var(--transition);
}

.control-label:hover {
    color: var(--text-primary);
}

.checkmark {
    width: 20px;
    height: 20px;
    border: 2px solid var(--primary-color);
    border-radius: 4px;
    display: inline-block;
}

input[type="checkbox"]:checked + .checkmark {
    background: var(--primary-color);
    color: white;
}

.settings-select {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid var(--border-color);
    border-radius: var(--border-radius-sm);
    background: var(--bg-secondary);
    color: var(--text-primary);
    font-size: 1rem;
}

.range-control {
    display: flex;
    align-items: center;
    gap: 1rem;
}

input[type="range"] {
    flex: 1;
}
```

### JavaScript Pattern
```javascript
const settingsElements = {
    myToggle: document.getElementById('mySetting'),
    mySelect: document.getElementById('mySelect'),
    myRange: document.getElementById('myRange'),
    rangeDisplay: document.getElementById('rangeDisplay')
};

// Handle toggle change
settingsElements.myToggle.addEventListener('change', (e) => {
    appData.settings.myOption = e.target.checked;
    applySettingChange('myOption');
    saveSettings();
});

// Handle select change
settingsElements.mySelect.addEventListener('change', (e) => {
    appData.settings.mySelect = e.target.value;
    applySettingChange('mySelect');
    saveSettings();
});

// Handle range change
settingsElements.myRange.addEventListener('input', (e) => {
    const value = parseFloat(e.target.value);
    appData.settings.myRange = value;
    settingsElements.rangeDisplay.textContent = value.toFixed(1) + 'x';
    applySettingChange('myRange');
});

function applySettingChange(settingName) {
    // Apply the setting to the app
    console.log(`Setting changed: ${settingName} = ${appData.settings[settingName]}`);
}
```

---

## Pattern 5: Dynamic List Rendering with Empty State

### HTML Structure
```html
<div id="myList">
    <!-- Empty state -->
    <div class="empty-state" id="emptyState" style="display: none;">
        <div class="empty-icon">
            <i class="fas fa-inbox"></i>
        </div>
        <h3>No Items</h3>
        <p>No items found. Try adding one to get started.</p>
    </div>
    
    <!-- Items container -->
    <div id="itemsList" class="items-list">
        <!-- Items will be rendered here -->
    </div>
</div>
```

### CSS Template
```css
.empty-state {
    text-align: center;
    padding: 3rem 1.5rem;
    color: var(--text-secondary);
}

.empty-icon {
    font-size: 4rem;
    color: var(--text-light);
    margin-bottom: 1rem;
    opacity: 0.5;
}

.empty-state h3 {
    font-size: 1.5rem;
    margin-bottom: 0.5rem;
    color: var(--text-primary);
}

.items-list {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.list-item {
    padding: 1rem;
    background: var(--bg-card);
    border-radius: var(--border-radius-sm);
    border-left: 4px solid var(--primary-color);
    transition: var(--transition);
}

.list-item:hover {
    box-shadow: var(--shadow-md);
}
```

### JavaScript Pattern
```javascript
function renderList(items) {
    const container = document.getElementById('itemsList');
    const emptyState = document.getElementById('emptyState');
    
    // Clear container
    container.innerHTML = '';
    
    // Show/hide empty state
    if (!items || items.length === 0) {
        emptyState.style.display = 'block';
        container.style.display = 'none';
        return;
    }
    
    emptyState.style.display = 'none';
    container.style.display = 'flex';
    
    // Render items
    items.forEach((item, index) => {
        const itemEl = document.createElement('div');
        itemEl.className = 'list-item';
        itemEl.innerHTML = `
            <div class="item-title">${item.title}</div>
            <div class="item-description">${item.description}</div>
        `;
        
        itemEl.addEventListener('click', () => handleItemClick(item.id));
        container.appendChild(itemEl);
    });
}

// Usage
const myItems = [
    { id: 1, title: 'Item 1', description: 'Description' },
    // ...
];

renderList(myItems);
```

---

## Pattern 6: Loading & Error States

### HTML Structure
```html
<!-- Loading Spinner -->
<div id="loadingSpinner" class="loading-spinner" style="display: none;">
    <div class="spinner"></div>
    <p>Loading...</p>
</div>

<!-- Error Message -->
<div id="errorMessage" class="error-alert" style="display: none;">
    <i class="fas fa-exclamation-circle"></i>
    <span id="errorText"></span>
    <button class="close-btn" onclick="closeError()">
        <i class="fas fa-times"></i>
    </button>
</div>

<!-- Success Message -->
<div id="successMessage" class="success-alert" style="display: none;">
    <i class="fas fa-check-circle"></i>
    <span id="successText"></span>
</div>
```

### CSS Template
```css
.loading-spinner {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.7);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    z-index: 9999;
}

.spinner {
    border: 4px solid var(--bg-card);
    border-top: 4px solid var(--primary-color);
    border-radius: 50%;
    width: 50px;
    height: 50px;
    animation: spin 1s linear infinite;
}

@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}

.error-alert,
.success-alert {
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 1rem 1.5rem;
    border-radius: var(--border-radius);
    display: flex;
    align-items: center;
    gap: 1rem;
    box-shadow: var(--shadow-lg);
    z-index: 9998;
    animation: slideInRight 0.3s ease;
}

.error-alert {
    background: #f44336;
    color: white;
}

.success-alert {
    background: #4caf50;
    color: white;
}

@keyframes slideInRight {
    from {
        transform: translateX(400px);
    }
    to {
        transform: translateX(0);
    }
}
```

### JavaScript Pattern
```javascript
function showLoading() {
    document.getElementById('loadingSpinner').style.display = 'flex';
}

function hideLoading() {
    document.getElementById('loadingSpinner').style.display = 'none';
}

function showError(message) {
    const errorEl = document.getElementById('errorMessage');
    document.getElementById('errorText').textContent = message;
    errorEl.style.display = 'flex';
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
        errorEl.style.display = 'none';
    }, 5000);
}

function closeError() {
    document.getElementById('errorMessage').style.display = 'none';
}

function showSuccess(message) {
    const successEl = document.getElementById('successMessage');
    document.getElementById('successText').textContent = message;
    successEl.style.display = 'flex';
    
    setTimeout(() => {
        successEl.style.display = 'none';
    }, 3000);
}

// Usage example
async function loadData() {
    showLoading();
    try {
        const response = await fetch('/api/data');
        const data = await response.json();
        hideLoading();
        showSuccess('Data loaded successfully!');
    } catch (error) {
        hideLoading();
        showError('Failed to load data: ' + error.message);
    }
}
```

---

## Pattern 7: Event Listener Setup

### Standard Pattern
```javascript
function setupEventListeners() {
    // Button clicks
    elements.myBtn.addEventListener('click', handleClick);
    
    // Input changes
    elements.myInput.addEventListener('change', handleChange);
    elements.myInput.addEventListener('input', handleInput);
    
    // Form submission
    elements.myForm.addEventListener('submit', (e) => {
        e.preventDefault();
        handleSubmit();
    });
    
    // Keyboard events
    document.addEventListener('keydown', handleKeyboard);
    
    // Window events
    window.addEventListener('resize', handleResize);
    window.addEventListener('beforeunload', handleUnload);
}

function handleClick(e) {
    e.preventDefault();
    // Handle click
}

function handleKeyboard(e) {
    if (e.ctrlKey && e.key === 'f') {
        e.preventDefault();
        toggleSearch();
    }
    
    if (e.key === 'Escape') {
        closeAllModals();
    }
}

// Call setup when DOM is ready
document.addEventListener('DOMContentLoaded', setupEventListeners);
```

---

## Pattern 8: State Management & localStorage

### Standard Pattern
```javascript
// Application state
const appData = {
    // State properties
    settings: {
        theme: 'light',
        fontSize: 'medium'
    },
    user: {
        favorites: []
    }
};

// Load state from storage
function loadState() {
    const saved = localStorage.getItem('appState');
    if (saved) {
        const parsed = JSON.parse(saved);
        Object.assign(appData, parsed);
    }
}

// Save state to storage
function saveState() {
    localStorage.setItem('appState', JSON.stringify(appData));
}

// Update state and save
function updateState(path, value) {
    // Handle nested paths like 'settings.theme'
    const parts = path.split('.');
    let obj = appData;
    
    for (let i = 0; i < parts.length - 1; i++) {
        obj = obj[parts[i]];
    }
    
    obj[parts[parts.length - 1]] = value;
    saveState();
}

// Usage
updateState('settings.theme', 'dark');
```

---

## Pattern 9: Dua Collection with Counter (Tasbeeh Pattern)

### HTML Structure
```html
<!-- Dua Collection Card (in list) -->
<div class="dua-card" onclick="openDua('collection_id')">
    <div class="dua-card-icon">
        <i class="fas fa-shield-halved"></i>
    </div>
    <div class="dua-card-content">
        <div class="dua-card-title">Bengali Title</div>
        <div class="dua-card-title-en">English Title</div>
        <div class="dua-card-meta">6 items · 3/6 complete</div>
    </div>
    <div class="dua-card-progress">
        <svg class="dua-progress-ring" viewBox="0 0 36 36">
            <circle class="dua-progress-bg" cx="18" cy="18" r="15.9155"/>
            <circle class="dua-progress-fill" cx="18" cy="18" r="15.9155"
                    stroke-dasharray="50, 100"/>
            <text class="dua-progress-text" x="18" y="20.5">50%</text>
        </svg>
    </div>
</div>

<!-- Dua Item with Counter -->
<div class="dua-item" id="dua-item-item_id">
    <div class="dua-item-header">
        <div class="dua-item-number">1</div>
        <div class="dua-item-titles">
            <div class="dua-item-label">Bengali label</div>
            <div class="dua-item-label-en">English label</div>
        </div>
        <div class="dua-counter-section">
            <button class="dua-counter-btn" onclick="incrementDuaCount('item_id', 3)">
                <span class="counter-current">0</span>
                <span class="counter-separator">/</span>
                <span class="counter-target">3</span>
            </button>
            <button class="dua-reset-btn" onclick="resetDuaCount('item_id')">
                <i class="fas fa-redo-alt"></i>
            </button>
        </div>
    </div>
    <div class="dua-item-body">
        <div class="dua-arabic-text" dir="rtl">Arabic text here</div>
        <div class="dua-translation">Bengali translation</div>
        <div class="dua-translation-en">English translation</div>
        <div class="dua-instruction">Instructions</div>
        <div class="dua-source">Source citation</div>
    </div>
</div>
```

### CSS Template
```css
/* Counter button */
.dua-counter-btn {
    width: 64px;
    height: 64px;
    border-radius: 50%;
    border: 3px solid var(--primary-color);
    background: var(--bg-card);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.2s ease;
}

.dua-counter-btn.counter-complete {
    background: linear-gradient(135deg, var(--primary-color), var(--primary-light));
    color: white;
    border-color: var(--primary-color);
    box-shadow: 0 0 12px rgba(45, 125, 50, 0.3);
}

/* Sticky header */
.dua-item-header {
    position: sticky;
    top: 50px;
    z-index: 10;
    background: var(--bg-card);
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.75rem 1rem;
    margin: -1rem -1rem 0;
    border-radius: var(--border-radius-lg) var(--border-radius-lg) 0 0;
}

.dua-item-header.is-stuck {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    border-radius: 0;
}

/* Arabic text with accent border */
.dua-arabic-text {
    line-height: 2.4;
    padding: 1rem 1.25rem;
    background: linear-gradient(135deg, rgba(45,125,50,0.02), rgba(45,125,50,0.05));
    border-right: 3px solid var(--primary-color);
    border-radius: 0 var(--border-radius) var(--border-radius) 0;
    word-spacing: 0.15em;
}
```

### JavaScript Pattern
```javascript
// Increment counter (wraps to 0 at target)
function incrementDuaCount(itemId, targetCount) {
    var current = appData.duaCounts[itemId] || 0;
    current++;
    if (current > targetCount) current = 0;
    appData.duaCounts[itemId] = current;
    saveDuaCounts();
    updateDuaItemUI(itemId, current, targetCount);
    // Haptic feedback
    if (navigator.vibrate) navigator.vibrate(30);
}

// Sticky headers with IntersectionObserver
function initDuaStickyHeaders() {
    document.querySelectorAll('.dua-item-header').forEach(function(header) {
        var sentinel = document.createElement('div');
        sentinel.className = 'dua-sentinel';
        header.parentNode.insertBefore(sentinel, header);

        var observer = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                header.classList.toggle('is-stuck', !entry.isIntersecting);
            });
        }, { threshold: [0], rootMargin: '-50px 0px 0px 0px' });

        observer.observe(sentinel);
    });
}
```

---

## Pattern 10: Hash-Based Deep Linking

### JavaScript Pattern
```javascript
var _skipNextHashChange = false;

// Set hash (e.g., 'surah/67', 'dua/100_ayat_amal')
function setAppHash(path) {
    var newHash = path ? '#/' + path : '#/';
    if (location.hash === newHash) return;
    _skipNextHashChange = true;
    location.hash = newHash;
}

// Parse hash → { type: 'surah', id: '67' } or null
function parseAppHash() {
    var hash = location.hash;
    if (!hash || hash === '#' || hash === '#/') return null;
    var match = hash.match(/^#\/(\w+)\/(.+)$/);
    if (!match) return null;
    return { type: match[1], id: match[2] };
}

// Navigate to route
async function navigateToHash(route) {
    switch (route.type) {
        case 'surah':
            await openSurah(parseInt(route.id));
            return true;
        case 'hifz':
            await navigateToHifzPage(parseInt(route.id));
            return true;
        case 'dua':
            await openDua(route.id);
            return true;
    }
    return false;
}

// Listen for browser back/forward
window.addEventListener('hashchange', function() {
    if (_skipNextHashChange) { _skipNextHashChange = false; return; }
    var route = parseAppHash();
    if (route) navigateToHash(route);
    else { /* return to home */ }
});
```

---

## Pattern 11: IndexedDB Backup for Offline Data

### JavaScript Pattern
```javascript
var IDB = {
    _db: null,
    _name: 'quranAppDB',
    _store: 'appData',

    open: function() {
        return new Promise(function(resolve, reject) {
            var req = indexedDB.open(IDB._name, 1);
            req.onupgradeneeded = function(e) {
                e.target.result.createObjectStore(IDB._store);
            };
            req.onsuccess = function(e) {
                IDB._db = e.target.result;
                resolve(IDB._db);
            };
            req.onerror = function() { reject(req.error); };
        });
    },

    set: function(key, value) {
        if (!IDB._db) return IDB.open().then(function() { return IDB.set(key, value); });
        return new Promise(function(resolve, reject) {
            var tx = IDB._db.transaction(IDB._store, 'readwrite');
            tx.objectStore(IDB._store).put(value, key);
            tx.oncomplete = resolve;
            tx.onerror = function() { reject(tx.error); };
        });
    },

    get: function(key) {
        if (!IDB._db) return IDB.open().then(function() { return IDB.get(key); });
        return new Promise(function(resolve, reject) {
            var tx = IDB._db.transaction(IDB._store, 'readonly');
            var req = tx.objectStore(IDB._store).get(key);
            req.onsuccess = function() { resolve(req.result); };
            req.onerror = function() { reject(req.error); };
        });
    }
};

// Usage: Network fetch with IDB backup
async function loadDataWithBackup(url, idbKey) {
    try {
        const resp = await fetch(url);
        const data = await resp.json();
        IDB.set(idbKey, data);  // Backup on success
        return data;
    } catch (err) {
        const backup = await IDB.get(idbKey);
        if (backup) return backup;
        throw new Error('No data available');
    }
}
```

---

## Naming Conventions

### HTML IDs
- Modal: `#[featureName]Modal`
- Container: `#[featureName]Container`
- List: `#[featureName]List`
- Button: `#[featureName]Btn` or `#[action]Button`

### CSS Classes
- Component: `.component-name`
- State: `.is-[state]` or `.has-[state]`
- Layout: `.layout-[type]`
- Theme: `.theme-[name]`
- Size: `.size-[size]`

### JavaScript Functions
- Open/Show: `open[ComponentName]()`, `show[ComponentName]()`
- Close/Hide: `close[ComponentName]()`, `hide[ComponentName]()`
- Create: `create[ComponentName]()`
- Render: `render[ComponentName]()`
- Handle: `handle[Event]()`
- Toggle: `toggle[Feature]()`

---

## Best Practices

1. **Always check elements exist** before using them
2. **Use try-catch** for async operations
3. **Save user preferences** with saveSettings()
4. **Console.log** for debugging, use meaningful messages
5. **Close modals on escape** key and overlay click
6. **Update UI** when state changes
7. **Add loading states** for async operations
8. **Show success/error** messages to users
9. **Handle responsive design** in CSS and JS
10. **Maintain consistent** component structure
