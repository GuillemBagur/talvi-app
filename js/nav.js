

const drawNav = () => {
    const navLinks = [
        {name: "Home", icon: `<i class="nav__icon ri-home-2-line"></i>`, url: "/home"},
        {name: "Seschy", icon: `<i class="nav__icon ri-mastodon-line"></i>`, url: "/seschy"},
        {name: "Tickets", icon: `<i class="nav__icon ri-camera-line"></i><input type="file" class="take-picture-input" name="image" accept="image/*" capture="environment">`, url: "/home", className: "nav__link--middle"},
        {name: "Tickets", icon: `<i class="nav__icon ri-ticket-line"></i>`, url: "/home"},
        {name: "Profile", icon: `<i class="nav__icon ri-user-line"></i>`, url: "/home"},
    ];


    const nav = `
        <ul class="nav__nav-links">
            ${navLinks.map(link => `<li><a class="nav__link ${link.className ?? ""}" href="${link.url}">${link.icon}</a></li>`).join("")}
        </ul>
        </a>
    `;

    navEl.innerHTML = "";
    navEl.innerHTML = nav;
}

drawNav();