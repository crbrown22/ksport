/**
 * KROME Sports Performance
 * Profile Navigation Controller (js/profile_nav.js)
 *
 * Automatically detects whether an athlete is logged in and ensures
 * a clear, prominent button/link exists across all pages to return
 * directly to their Athlete Profile page (athlete_profile.html).
 */

(function () {
    'use strict';

    // Prevent duplicate initializations
    if (window.__KROME_PROFILE_NAV_INITIALIZED__) return;
    window.__KROME_PROFILE_NAV_INITIALIZED__ = true;

    /**
     * Check if the user is currently authenticated as an athlete
     */
    function isAthleteLoggedIn() {
        try {
            const email = localStorage.getItem('krome_athlete_email');
            const token = localStorage.getItem('krome_auth_token');
            const portalUnlocked = localStorage.getItem('krome_portal_unlocked');
            const shredAuth = localStorage.getItem('krome_shred30_auth');
            const bundleUnlocked = localStorage.getItem('krome_bundle_unlocked');
            const shredUnlocked = localStorage.getItem('krome_shred_unlocked');
            const accessKey = localStorage.getItem('krome_access_key');

            if (email && email.trim().length > 3 && email.includes('@')) return true;
            if (token && token.trim().length > 0) return true;
            if (portalUnlocked === 'true' || shredAuth === 'true' || bundleUnlocked === 'true' || shredUnlocked === 'true') return true;
            if (accessKey && accessKey.trim().length > 0) return true;
            return false;
        } catch (_) {
            return false;
        }
    }

    /**
     * Get athlete display name (or first name)
     */
    function getAthleteDisplayName() {
        try {
            const name = localStorage.getItem('krome_athlete_name');
            if (name && name.trim() && name.toLowerCase() !== 'athlete' && name.toLowerCase() !== 'krome athlete') {
                return name.trim().split(' ')[0];
            }
            const email = localStorage.getItem('krome_athlete_email');
            if (email) {
                const userPart = email.split('@')[0];
                return userPart.charAt(0).toUpperCase() + userPart.slice(1);
            }
        } catch (_) {}
        return 'Profile';
    }

    /**
     * Inject stylesheet for floating pill and navbar enhancements
     */
    function injectProfileNavStyles() {
        if (document.getElementById('krome-profile-nav-styles')) return;

        const style = document.createElement('style');
        style.id = 'krome-profile-nav-styles';
        style.textContent = `
            /* Floating Return to Profile Pill */
            .krome-floating-profile-pill {
                position: fixed;
                bottom: 24px;
                left: 24px;
                z-index: 9998;
                background: #0f1115;
                color: #ffd447 !important;
                border: 1.5px solid #ffd447;
                border-radius: 50rem;
                padding: 0.55rem 1.15rem;
                font-family: system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
                font-size: 0.85rem;
                font-weight: 800;
                letter-spacing: 0.3px;
                text-decoration: none !important;
                display: inline-flex;
                align-items: center;
                gap: 0.55rem;
                box-shadow: 0 10px 25px rgba(0, 0, 0, 0.75), 0 0 16px rgba(255, 212, 71, 0.25);
                transition: all 0.25s cubic-bezier(0.165, 0.84, 0.44, 1);
                backdrop-filter: blur(8px);
                cursor: pointer;
            }

            .krome-floating-profile-pill:hover {
                transform: translateY(-3px) scale(1.02);
                background: #ffd447;
                color: #000000 !important;
                border-color: #ffd447;
                box-shadow: 0 14px 30px rgba(0, 0, 0, 0.85), 0 0 24px rgba(255, 212, 71, 0.55);
            }

            .krome-floating-profile-pill:hover .krome-pill-dot {
                background: #000000;
                box-shadow: 0 0 8px rgba(0, 0, 0, 0.4);
            }

            .krome-pill-dot {
                width: 8px;
                height: 8px;
                border-radius: 50%;
                background: #00ffd1;
                box-shadow: 0 0 8px #00ffd1;
                display: inline-block;
                flex-shrink: 0;
                animation: kromePillPulse 2s infinite ease-in-out;
            }

            @keyframes kromePillPulse {
                0% { opacity: 0.6; transform: scale(0.9); }
                50% { opacity: 1; transform: scale(1.15); }
                100% { opacity: 0.6; transform: scale(0.9); }
            }

            .krome-pill-arrow {
                font-size: 0.75rem;
                opacity: 0.8;
                transition: transform 0.2s ease;
            }

            .krome-floating-profile-pill:hover .krome-pill-arrow {
                transform: translateX(3px);
                opacity: 1;
            }

            /* Shift floating pill up on screens where a sticky bottom bar exists */
            @media (max-width: 991px) {
                body:has(.sticky-bottom-bar) .krome-floating-profile-pill {
                    bottom: 74px;
                }
            }

            @media (max-width: 576px) {
                .krome-floating-profile-pill {
                    bottom: 16px;
                    left: 16px;
                    padding: 0.45rem 0.95rem;
                    font-size: 0.78rem;
                    gap: 0.45rem;
                }
                body:has(.sticky-bottom-bar) .krome-floating-profile-pill {
                    bottom: 70px;
                }
            }

            @media print {
                .krome-floating-profile-pill,
                #manual-profile-btn {
                    display: none !important;
                }
            }

            /* Logged in navbar button pulse indicator */
            .btn-profile-active {
                background-color: var(--krome-gold, #ffd447) !important;
                color: #000000 !important;
                font-weight: 800 !important;
                border: 1px solid var(--krome-gold, #ffd447) !important;
                box-shadow: 0 0 12px rgba(255, 212, 71, 0.4) !important;
            }

            .btn-profile-active:hover {
                background-color: #ffffff !important;
                color: #000000 !important;
                border-color: #ffffff !important;
                box-shadow: 0 0 18px rgba(255, 255, 255, 0.5) !important;
            }
        `;
        document.head.appendChild(style);
    }

    /**
     * Primary Profile Navigation Runner
     */
    function updateProfileNavigation() {
        const currentPath = window.location.pathname.toLowerCase();
        const currentHref = window.location.href.toLowerCase();

        // Check if currently on athlete profile
        const isProfilePage = currentPath.endsWith('athlete_profile.html') ||
                              currentPath.endsWith('athlete_profile') ||
                              currentHref.includes('athlete_profile.html');

        if (isProfilePage) {
            // Remove floating pill if user navigated to athlete profile
            const pill = document.getElementById('krome-floating-profile-pill');
            if (pill) pill.remove();
            return;
        }

        const loggedIn = isAthleteLoggedIn();
        if (!loggedIn) {
            const pill = document.getElementById('krome-floating-profile-pill');
            if (pill) pill.remove();
            return;
        }

        const displayName = getAthleteDisplayName();
        injectProfileNavStyles();

        // 1. UPDATE NAVBAR BUTTONS ON STANDARD PAGES
        updateStandardNavbars(displayName);

        // 2. UPDATE MANUAL & BLUEPRINT HEADERS (.manual-nav)
        updateManualNavbars(displayName);

        // 3. INJECT PERSISTENT FLOATING PILL
        injectFloatingPill(displayName);
    }

    /**
     * Updates standard navigation bars (.navbar)
     */
    function updateStandardNavbars(displayName) {
        // Find existing Login / Athlete Portal links in the navbar
        const potentialLoginLinks = document.querySelectorAll(
            '.navbar a[href*="login.html"], .navbar a[href*="shred_login.html"], ' +
            '.navbar a#nav-login-btn, .navbar a.btn-login, .navbar a[id*="login"]'
        );

        let loginButtonUpdated = false;

        potentialLoginLinks.forEach(function (link) {
            // Ignore internal links or other links not intended for login
            const href = link.getAttribute('href') || '';
            if (href.includes('athlete_profile.html')) return;

            link.setAttribute('href', 'athlete_profile.html');
            link.innerHTML = `<i class="fas fa-user-circle me-1.5 text-warning"></i> My Profile`;
            link.setAttribute('title', `Logged in as ${displayName}. Return to Athlete Profile`);
            link.classList.add('btn-profile-active');
            link.classList.remove('btn-outline-warning');
            loginButtonUpdated = true;

            // If there's an adjacent Register button in the same container, hide it
            const parent = link.parentElement;
            if (parent) {
                const regBtn = parent.querySelector('a[href*="register.html"]');
                if (regBtn) {
                    regBtn.style.display = 'none';
                }
            }
        });

        // Also check for any standalone links that literally say "Athlete Portal" or "Login"
        if (!loginButtonUpdated) {
            const allNavLinks = document.querySelectorAll('.navbar .nav-link, .navbar .btn');
            allNavLinks.forEach(function (link) {
                const text = (link.textContent || '').trim().toLowerCase();
                const href = link.getAttribute('href') || '';
                if (href.includes('athlete_profile.html')) {
                    loginButtonUpdated = true;
                    return;
                }

                if ((text === 'login' || text.includes('athlete portal') || text.includes('athlete login')) &&
                    (href.includes('login') || href.includes('portal') || href === '#')) {
                    link.setAttribute('href', 'athlete_profile.html');
                    link.innerHTML = `<i class="fas fa-user-circle me-1.5 text-warning"></i> My Profile`;
                    link.classList.add('btn-profile-active');
                    loginButtonUpdated = true;
                }
            });
        }

        // If no login button existed in .navbar-nav (e.g. contact.html, program_online.html, program_detail.html)
        const navList = document.querySelector('.navbar .navbar-nav');
        if (navList && !document.getElementById('nav-profile-return-item')) {
            const hasProfileLink = navList.querySelector('a[href*="athlete_profile.html"]');
            if (!hasProfileLink) {
                const li = document.createElement('li');
                li.id = 'nav-profile-return-item';
                li.className = 'nav-item ms-lg-2 my-1 my-lg-0';
                li.innerHTML = `
                    <a href="athlete_profile.html" class="btn btn-sm btn-profile-active rounded-pill px-3 py-1.5 d-inline-flex align-items-center">
                        <i class="fas fa-user-circle me-1.5"></i> My Profile
                    </a>
                `;
                navList.appendChild(li);
            }
        }
    }

    /**
     * Updates manual headers (.manual-nav)
     */
    function updateManualNavbars(displayName) {
        const manualNavs = document.querySelectorAll('.manual-nav, header.manual-nav, nav.manual-nav');
        if (!manualNavs.length) return;

        manualNavs.forEach(function (nav) {
            // Check if profile return button already exists in this nav
            if (nav.querySelector('#manual-profile-btn, a[href*="athlete_profile.html"]')) {
                return;
            }

            // Look for action button containers
            const actionContainer = nav.querySelector('.d-flex.gap-2, .d-flex.align-items-center.gap-2, .d-flex.flex-wrap.align-items-center.gap-2') ||
                                    nav.querySelector('.container > div:last-child') ||
                                    nav.querySelector('.container');

            if (actionContainer) {
                const profileBtn = document.createElement('a');
                profileBtn.id = 'manual-profile-btn';
                profileBtn.href = 'athlete_profile.html';
                profileBtn.className = 'btn-action-gold';
                profileBtn.setAttribute('title', `Logged in as ${displayName}. Return to Athlete Profile`);
                profileBtn.innerHTML = `<i class="fas fa-user-circle me-1.5"></i> My Profile`;

                // If container already has action buttons, prepend or insert as first action
                if (actionContainer.firstChild) {
                    actionContainer.insertBefore(profileBtn, actionContainer.firstChild);
                } else {
                    actionContainer.appendChild(profileBtn);
                }
            }
        });
    }

    /**
     * Injects sleek floating pill at bottom-left corner
     */
    function injectFloatingPill(displayName) {
        if (document.getElementById('krome-floating-profile-pill')) return;

        const pill = document.createElement('a');
        pill.id = 'krome-floating-profile-pill';
        pill.href = 'athlete_profile.html';
        pill.className = 'krome-floating-profile-pill';
        pill.setAttribute('title', `Logged in as ${displayName}. Return to Athlete Profile`);
        pill.setAttribute('aria-label', 'Return to Athlete Profile');
        pill.innerHTML = `
            <span class="krome-pill-dot"></span>
            <i class="fas fa-user-circle" style="font-size: 0.95rem;"></i>
            <span>My Profile</span>
            <i class="fas fa-chevron-right krome-pill-arrow"></i>
        `;

        document.body.appendChild(pill);
    }

    // Run on state changes
    window.addEventListener('storage', function (e) {
        if (!e.key || e.key.startsWith('krome_')) {
            updateProfileNavigation();
        }
    });

    // Run immediately if DOM is ready, otherwise on DOMContentLoaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', updateProfileNavigation);
    } else {
        updateProfileNavigation();
    }

    // Safety fallback run after submodules finish
    window.addEventListener('load', updateProfileNavigation);

    // Export global helper
    window.updateProfileNavigation = updateProfileNavigation;
})();
