/**
 * KROME Sports Performance
 * Navigation Bar Auto-Retract Controller
 *
 * Automatically retracts/collapses the mobile navigation menu whenever
 * a user taps/clicks a navigation link, dropdown item, or action button.
 */

(function () {
    'use strict';

    // Inject scroll-padding-top style to ensure sticky navbar doesn't cover anchor targets
    if (!document.getElementById('krome-navbar-scroll-style')) {
        const style = document.createElement('style');
        style.id = 'krome-navbar-scroll-style';
        style.textContent = `
            html {
                scroll-padding-top: 85px;
            }
        `;
        document.head.appendChild(style);
    }

    function initNavbarAutoRetract() {
        const navCollapse = document.getElementById('navbarContent');
        const navToggler = document.querySelector('.navbar-toggler');

        if (!navCollapse) return;

        /**
         * Retract the mobile navbar
         */
        function retractNavbar() {
            if (!navCollapse.classList.contains('show') && !navCollapse.classList.contains('collapsing')) {
                return;
            }

            // Bootstrap 5 Collapse API
            if (window.bootstrap && window.bootstrap.Collapse) {
                try {
                    const bsCollapse = window.bootstrap.Collapse.getOrCreateInstance(navCollapse, { toggle: false });
                    if (bsCollapse) {
                        bsCollapse.hide();
                    }
                } catch (err) {
                    fallbackHide();
                }
            } else {
                fallbackHide();
            }

            // Reset any open dropdowns inside the navbar
            const openDropdowns = navCollapse.querySelectorAll('.dropdown-menu.show');
            openDropdowns.forEach(function (dm) {
                dm.classList.remove('show');
            });
            const openDropdownToggles = navCollapse.querySelectorAll('.dropdown-toggle[aria-expanded="true"]');
            openDropdownToggles.forEach(function (toggle) {
                toggle.setAttribute('aria-expanded', 'false');
            });
        }

        function fallbackHide() {
            navCollapse.classList.remove('show');
            if (navToggler) {
                navToggler.setAttribute('aria-expanded', 'false');
                navToggler.classList.add('collapsed');
            }
        }

        /**
         * Handle link clicks inside the navbar
         */
        navCollapse.addEventListener('click', function (event) {
            const target = event.target.closest('a, button');
            if (!target) return;

            // Do not retract if clicking the dropdown toggler to open/view the submenu
            if (
                target.classList.contains('dropdown-toggle') ||
                target.getAttribute('data-bs-toggle') === 'dropdown'
            ) {
                return;
            }

            // Close navbar for any link, dropdown-item, or CTA button
            const isClickable =
                target.classList.contains('nav-link') ||
                target.classList.contains('dropdown-item') ||
                target.classList.contains('btn') ||
                target.tagName === 'A' ||
                target.tagName === 'BUTTON';

            if (isClickable) {
                const href = target.getAttribute('href');

                // Determine if this is an on-page hash link
                let hashTarget = null;
                if (href) {
                    if (href.startsWith('#') && href.length > 1) {
                        hashTarget = href;
                    } else if (href.includes('#')) {
                        const [path, hash] = href.split('#');
                        const currentFilename = window.location.pathname.split('/').pop() || 'index.html';
                        if (
                            hash &&
                            (path === currentFilename ||
                                (path === 'index.html' && (currentFilename === '' || currentFilename === 'index.html')) ||
                                (path === 'ksp_home.html' && currentFilename === 'ksp_home.html'))
                        ) {
                            hashTarget = '#' + hash;
                        }
                    }
                }

                if (hashTarget) {
                    const targetEl = document.querySelector(hashTarget);
                    if (targetEl) {
                        event.preventDefault();
                        retractNavbar();

                        const navHeader = document.querySelector('.navbar.sticky-top');
                        const headerOffset = navHeader ? navHeader.offsetHeight : 75;
                        const elementPosition = targetEl.getBoundingClientRect().top;
                        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                        window.scrollTo({
                            top: offsetPosition,
                            behavior: 'smooth'
                        });

                        if (history.pushState) {
                            history.pushState(null, '', hashTarget);
                        } else {
                            location.hash = hashTarget;
                        }

                        // Trigger visual reveal if applicable
                        targetEl.querySelectorAll('.reveal-on-scroll').forEach(function (el) {
                            el.classList.add('is-visible');
                        });
                        return;
                    }
                }

                // If not an on-page anchor, trigger retraction before navigation/action
                retractNavbar();
            }
        });

        /**
         * Retract when clicking outside the navbar while open
         */
        document.addEventListener('click', function (event) {
            if (!navCollapse.classList.contains('show')) return;
            const isInsideNav = navCollapse.contains(event.target) || (navToggler && navToggler.contains(event.target));
            if (!isInsideNav) {
                retractNavbar();
            }
        });

        /**
         * Retract on Escape key press
         */
        document.addEventListener('keydown', function (event) {
            if (event.key === 'Escape' && navCollapse.classList.contains('show')) {
                retractNavbar();
            }
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initNavbarAutoRetract);
    } else {
        initNavbarAutoRetract();
    }
})();
