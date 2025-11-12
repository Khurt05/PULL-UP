// Document ready: initialize search, "more" loader, nav dropdown, and rent handlers
document.addEventListener('DOMContentLoaded', function () {
    // --- Constants and DOM Elements ---
    const CAR_BRANDS = [
        'Toyota Hiace', 'Toyota Hilux', 'Toyota Vios', 'Nissan Navara',
        'Toyota Fortuner', 'Nissan Almera', 'Honda Civic', 'Honda CR-V',
        'Mitsubishi Montero', 'Ford Mustang', 'Mazda CX-5', 'Hyundai Tucson',
        'Kia Sportage', 'Suzuki Ertiga', 'Isuzu D-Max'
    ];

    const EXTRA_CARS = [
        { title: 'Honda Accord', img: 'image/honda-accord.jpg', alt: 'Honda Accord', price: '4,200' },
        { title: 'Toyota Camry', img: 'image/toyota-camry.jpg', alt: 'Toyota Camry', price: '4,800' },
        { title: 'Ford Mustang', img: 'image/ford-mustang.jpg', alt: 'Ford Mustang', price: '8,500' },
        { title: 'Nissan Sentra', img: 'image/sentra.jpg', alt: 'Nissan Sentra', price: '3,200' },
        { title: 'Mitsubishi Xpander', img: 'image/xpander.jpg', alt: 'Mitsubishi Xpander', price: '3,700' },
        { title: 'Kia Carnival', img: 'image/kiaCarnival.avif', alt: 'Kia Carnival', price: '6,000' }
    ];

    const elements = {
        input: document.querySelector('.search-bar input[name="q"]'),
        searchForm: document.querySelector('.search-bar'),
        carContainer: document.querySelector('.container'),
        moreLink: document.querySelector('.more-link'),
        paraMore: document.querySelector('.para-more-car'),
        rentButtons: document.querySelectorAll('.rent-button'),
        authLinks: document.querySelectorAll('nav a[href="sign-up.html"], nav a[href="log-in.html"]'),
        profileBtn: document.getElementById('profileBtn') // added
    };

    if (!elements.input) return; // Exit if search input not found

    // --- Search Functionality ---
    let dropdown = null;
    let moreIndex = 0;
    const BATCH_SIZE = 3;
    let isExpanded = false;

    // Remove dropdown from DOM and clear state
    function closeDropdown() {
        if (dropdown && dropdown.parentNode) {
            dropdown.parentNode.removeChild(dropdown);
            dropdown = null;
        }
    }

    // Create and position dropdown with provided items
    function createDropdown(items, queryIsEmpty) {
        closeDropdown();

        dropdown = document.createElement('div');
        dropdown.className = 'search-dropdown';
        const rect = elements.input.getBoundingClientRect();
        dropdown.style.position = 'absolute';
        dropdown.style.minWidth = rect.width + 'px';
        dropdown.style.left = rect.left + window.scrollX + 'px';
        dropdown.style.top = rect.bottom + window.scrollY + 'px';
        dropdown.style.background = '#fff';
        dropdown.style.border = '1px solid #ccc';
        dropdown.style.boxShadow = '0 2px 6px rgba(0,0,0,0.15)';
        dropdown.style.zIndex = 9999;
        dropdown.style.maxHeight = '220px';
        dropdown.style.overflowY = 'auto';
        dropdown.style.fontFamily = 'sans-serif';

        // Show "No results" when no items match
        if (items.length === 0) {
            const item = document.createElement('div');
            item.className = 'search-dropdown-item no-results';
            item.textContent = 'No results';
            item.style.padding = '8px 10px';
            item.style.color = '#666';
            dropdown.appendChild(item);
        } else {
            // Build list of suggestion elements
            items.forEach(itemText => {
                const item = document.createElement('div');
                item.className = 'search-dropdown-item';
                item.textContent = itemText;
                item.style.padding = '8px 10px';
                item.style.cursor = 'pointer';
                item.style.borderBottom = '1px solid #f1f1f1';

                // Hover styles
                item.addEventListener('mouseover', () => {
                    item.style.background = '#f6f6f6';
                });
                item.addEventListener('mouseout', () => {
                    item.style.background = '';
                });
                // Click a suggestion -> fill input, perform search, and close
                item.addEventListener('click', () => {
                    elements.input.value = itemText;
                    // perform the search to show only matching product(s)
                    showSearchResults(itemText);
                    closeDropdown();
                    elements.input.focus();
                });
                dropdown.appendChild(item);
            });
        }

        document.body.appendChild(dropdown);
    }

    // Filter car items by query and show only matches; empty query resets to show all.
    function showSearchResults(query) {
        if (!elements.carContainer) return;
        // normalize query
        const q = (typeof query === 'string' ? query : elements.input.value || '').trim().toLowerCase();

        // remove any previous "no results" message
        const prevNo = elements.carContainer.querySelector('.search-no-results');
        if (prevNo) prevNo.remove();

        // if query is empty -> show all items and return
        if (q.length === 0) {
            Array.from(elements.carContainer.children).forEach(child => {
                if (child.classList && child.classList.contains('car-item')) {
                    child.style.display = '';
                }
            });
            return;
        }

        // checking for the match (title or alt text)
        const items = Array.from(elements.carContainer.querySelectorAll('.car-item'));
        let matchCount = 0;
        items.forEach(item => {
            const titleEl = item.querySelector('p');
            const imgEl = item.querySelector('img');
            const titleText = titleEl ? titleEl.textContent.trim().toLowerCase() : '';
            const altText = imgEl ? (imgEl.alt || '').trim().toLowerCase() : '';
            // Show item even if alt or dli 
            const isMatch = titleText.includes(q) || altText.includes(q);
            item.style.display = isMatch ? '' : 'none';
            if (isMatch) matchCount++;
        });

        // if wlay match mag hatag og breif message sa user
        if (matchCount === 0) {
            const msg = document.createElement('div');
            msg.className = 'search-no-results';
            msg.style.padding = '18px';
            msg.style.gridColumn = '1 / -1';
            msg.style.textAlign = 'center';
            msg.style.color = '#666';
            msg.textContent = 'No cars found for "' + (elements.input.value || query) + '".';
            elements.carContainer.appendChild(msg);
        }
    }

    // Filter carBrands by input value and show suggestions (dropdown)
    function showFilteredSuggestions() {
        const q = elements.input.value.trim().toLowerCase();
        let matches;
        if (q.length === 0) {
            // Default short list when input empty
            matches = CAR_BRANDS.slice(0, 6);
        } else {
            // Case-insensitive contains match
            matches = CAR_BRANDS.filter(b => b.toLowerCase().includes(q));
        }
        createDropdown(matches.slice(0, 6), q.length === 0);
    }

    // Show suggestions on click/focus and update on typing
    function setupSearchListeners() {
        elements.input.addEventListener('click', e => {
            e.stopPropagation();
            showFilteredSuggestions();
        });

        elements.input.addEventListener('focus', () => {
            if (!dropdown) showFilteredSuggestions();
        });

        elements.input.addEventListener('input', showFilteredSuggestions);

        if (elements.searchForm) {
            elements.searchForm.addEventListener('submit', e => {
                e.preventDefault();
                closeDropdown();
                showSearchResults();
            });
        }

        // Keyboard navigation for suggestion list (arrow keys, Enter, Escape)
        elements.input.addEventListener('keydown', function (e) {
            if (!dropdown) return;
            const items = Array.from(dropdown.querySelectorAll('.search-dropdown-item'));
            if (items.length === 0) return;

            const activeIndex = items.findIndex(it => it.classList.contains('active'));

            if (e.key === 'ArrowDown') {
                e.preventDefault();
                const next = (activeIndex + 1) % items.length;
                items.forEach(i => { i.classList.remove('active'); i.style.background = ''; });
                items[next].classList.add('active');
                items[next].style.background = '#e9f5ff';
                items[next].scrollIntoView({ block: 'nearest' });
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                const prev = (activeIndex - 1 + items.length) % items.length;
                items.forEach(i => { i.classList.remove('active'); i.style.background = ''; });
                items[prev].classList.add('active');
                items[prev].style.background = '#e9f5ff';
                items[prev].scrollIntoView({ block: 'nearest' });
            } else if (e.key === 'Enter') {
                const sel = items[activeIndex] || items[0];
                if (sel && !sel.classList.contains('no-results')) {
                    e.preventDefault();
                    // emulate clicking the suggestion to fill input and search
                    sel.click();
                } else {
                    // Enter with no dropdown selection => perform general search
                    e.preventDefault();
                    closeDropdown();
                    showSearchResults();
                }
            } else if (e.key === 'Escape') {
                closeDropdown();
            }
        });

        // Close dropdown when clicking elsewhere on the page
        document.addEventListener('click', function (e) {
            if (!dropdown) return;
            if (e.target === elements.input) return;
            if (dropdown.contains(e.target)) return;
            closeDropdown();
        });

        // Recompute suggestions on resize/scroll to keep dropdown aligned
        window.addEventListener('resize', () => { if (dropdown) showFilteredSuggestions(); });
        window.addEventListener('scroll', () => { if (dropdown) showFilteredSuggestions(); }, true);
    }

    // --- Authentication ---
    function userIsLoggedIn() {
        return localStorage.getItem('loggedIn') === 'true' || 
               sessionStorage.getItem('loggedIn') === 'true';
    }

    function updateNav() {
        elements.authLinks.forEach(a => {
            a.style.display = userIsLoggedIn() ? 'none' : '';
        });
        // show profile button when logged in
        if (elements.profileBtn) {
            elements.profileBtn.style.display = userIsLoggedIn() ? '' : 'none';
        }
    }

    function setupAuthListeners() {
        elements.rentButtons.forEach(btn => {
            btn.addEventListener('click', e => {
                if (!userIsLoggedIn()) {
                    e.preventDefault();
                    window.location.href = 'log-in.html';
                }
            });
        });

        // handle profile click: if not logged in send to login and remember redirect
        if (elements.profileBtn) {
            elements.profileBtn.addEventListener('click', function (e) {
                // allow normal anchor when logged in
                if (userIsLoggedIn()) return;
                // otherwise force login first
                e.preventDefault();
                // save intended redirect
                sessionStorage.setItem('postLoginRedirect', 'dashboard.html');
                window.location.href = 'log-in.html';
            });
        }
    }

    // --- More Cars Functionality ---
    function setupMoreCarsFeature() {
        if (!elements.moreLink || !elements.carContainer || !elements.paraMore) return;

        // Append a batch of car DOM elements to the container
        function appendCars(batch) {
            batch.forEach(car => {
                const item = document.createElement('div');
                item.className = 'car-item';

                const img = document.createElement('img');
                img.src = car.img;
                img.alt = car.alt || car.title;
                img.loading = 'lazy';
                img.style.width = '100%';
                img.style.height = 'auto';
                item.appendChild(img);

                const priceEl = document.createElement('a');
                priceEl.className = 'price';
                priceEl.innerHTML = `&#8369; ${car.price}`;
                item.appendChild(priceEl);

                const p = document.createElement('p');
                p.textContent = car.title.toUpperCase();
                item.appendChild(p);

                const btn = document.createElement('button');
                btn.className = 'rent-button';
                btn.textContent = 'RENT';
                item.appendChild(btn);

                elements.carContainer.appendChild(item);
            });
        }

        // Remove appended extraCars from the end of the container
        function removeExtraCars() {
            const toRemove = moreIndex;
            for (let i = 0; i < toRemove; i++) {
                const last = elements.carContainer.lastElementChild;
                if (!last) break;
                elements.carContainer.removeChild(last);
            }
            moreIndex = 0;
        }

        // Update MORE link text and hint paragraph after changes
        function updateUIAfterAppend() {
            if (moreIndex >= EXTRA_CARS.length) {
                isExpanded = true;
                elements.moreLink.textContent = 'LESS';
                elements.paraMore.textContent = 'Click "LESS" to show less cars';
            } else {
                elements.moreLink.textContent = 'MORE';
                elements.paraMore.textContent = 'Click "More" to find your car of choice';
            }
        }

        // Handler for MORE/LESS toggle: load or collapse cars
        function loadMoreCars(e) {
            if (e) e.preventDefault();

            if (!isExpanded) {
                const batch = EXTRA_CARS.slice(moreIndex, moreIndex + BATCH_SIZE);
                if (batch.length === 0) {
                    // All appended, switch to LESS state
                    isExpanded = true;
                    elements.moreLink.textContent = 'LESS';
                    elements.paraMore.textContent = 'Click "LESS" to show less cars';
                    return;
                }
                appendCars(batch);
                moreIndex += batch.length;
                updateUIAfterAppend();

                const lastAdded = elements.carContainer.children[elements.carContainer.children.length - 1];
                if (lastAdded) lastAdded.scrollIntoView({ behavior: 'smooth', block: 'start' });
            } else {
                // Collapse appended items and restore UI
                removeExtraCars();
                isExpanded = false;
                elements.moreLink.textContent = 'MORE';
                elements.paraMore.textContent = 'Click "More" to find your car of choice';
                const first = elements.carContainer.firstElementChild;
                if (first) first.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }

        elements.moreLink.addEventListener('click', loadMoreCars);
    }

document.addEventListener("DOMContentLoaded", () => {
  const rentButtons = document.querySelectorAll(".rent-button");

  rentButtons.forEach(button => {
    button.addEventListener("click", (e) => {
      // Find the clicked car
      const carItem = e.target.closest(".car-item");
      const carName = carItem.querySelector("p").textContent.trim();
      const carPrice = carItem.querySelector(".price").textContent.trim();

      // Save selected car info to localStorage
      localStorage.setItem("selectedCar", JSON.stringify({
        name: carName,
        price: carPrice
      }));

      // Redirect to the booking form page
      window.location.href = "booking-form.html";
    });
  });
});

    // --- Navigation Dropdown ---
    function setupNavDropdown() {
        const btn = document.querySelector('.dropdown .drpbtn');
        const panel = document.querySelector('.dropdown .dropdown-content');
        if (!btn || !panel) return;

        // Initialize ARIA and hidden state
        panel.style.display = 'none';
        panel.setAttribute('aria-hidden', 'true');
        btn.setAttribute('aria-expanded', 'false');

        // Close panel and update ARIA
        function closePanel() {
            panel.style.display = 'none';
            panel.setAttribute('aria-hidden', 'true');
            btn.setAttribute('aria-expanded', 'false');
        }
        // Open panel and update ARIA
        function openPanel() {
            panel.style.display = 'block';
            panel.setAttribute('aria-hidden', 'false');
            btn.setAttribute('aria-expanded', 'true');
        }
        // Toggle on button click
        btn.addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();
            const isOpen = btn.getAttribute('aria-expanded') === 'true';
            if (isOpen) closePanel(); else openPanel();
        });

        // Close when clicking outside the panel/button
        document.addEventListener('click', function (e) {
            if (!panel.contains(e.target) && e.target !== btn) closePanel();
        });

        // Keyboard: Escape closes, ArrowDown focuses first menu item
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape') closePanel();
            if (e.key === 'ArrowDown' && btn.getAttribute('aria-expanded') === 'true') {
                const first = panel.querySelector('[role="menuitem"], a');
                if (first) first.focus();
                e.preventDefault();
            }
        });

        // Close menu after a menu item is clicked (mobile friendly)
        panel.addEventListener('click', function (e) {
            const target = e.target;
            if (target.matches('a, [role="menuitem"]')) closePanel();
        });
    }

    // --- Initialize Everything ---
    function init() {
        setupSearchListeners();
        setupAuthListeners();
        setupMoreCarsFeature();
        setupNavDropdown();
        updateNav();

        // Global auth helper
        window.appAuth = {
            login({ username, persist = true } = {}) {
                const storage = persist ? localStorage : sessionStorage;
                storage.setItem('loggedIn', 'true');
                if (username) storage.setItem('username', username);
                // Return to home page instead of dashboard
                window.location.href = 'structure.html';
            },
            logout() {
                localStorage.removeItem('loggedIn');
                sessionStorage.removeItem('loggedIn');
                localStorage.removeItem('username');
                sessionStorage.removeItem('username');
                window.location.href = 'structure.html';
            }
        };
    }

    init();

    // Check login status
    function checkLoginStatus() {
        const isLoggedIn = localStorage.getItem('loggedIn') === 'true';
        const authLinks = document.querySelectorAll('nav a[href="sign-up.html"], nav a[href="log-in.html"]');
        
        // Hide auth links if logged in
        authLinks.forEach(link => {
            link.style.display = isLoggedIn ? 'none' : '';
        });
    }





    // Check on page load
    checkLoginStatus();
});