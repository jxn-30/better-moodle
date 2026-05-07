// Prevent the page from jumping to the top, when triggering a usermenu carousel (such as when switching language)

// The selector is taken from core/usermenu, but hardcoded here as it is not exported by core/usermenu.
// Plus, we cannot do event delegation but have to attach the event listener to each of the elements as core/usermenu will stop event propagation if the target fits the selector.
document
    .querySelectorAll('.usermenu #usermenu-carousel .carousel-navigation-link')
    .forEach(el => el.addEventListener('click', e => e.preventDefault()));
