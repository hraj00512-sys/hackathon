let gigs = [
    {
        id: 1,
        title: "I will design your website",
        category: "Design",
        rate: 800,
        description: "Modern and clean website UI design.",
        creator: "Alex"
    },
    {
        id: 2,
        title: "I will edit your short videos",
        category: "Video",
        rate: 500,
        description: "Professional editing for Reels and Shorts.",
        creator: "Riya"
    },
    {
        id: 3,
        title: "I will build a basic website",
        category: "Development",
        rate: 1200,
        description: "Responsive HTML, CSS and JavaScript website.",
        creator: "Rahul"
    }
];

let bookings = [];

const gigList = document.getElementById("gigList");
const searchInput = document.getElementById("searchInput");
const categoryFilter = document.getElementById("categoryFilter");


// DISPLAY GIGS
function displayGigs() {
    const search = searchInput.value.toLowerCase();
    const category = categoryFilter.value;

    const filteredGigs = gigs.filter(gig => {
        const matchesSearch =
            gig.title.toLowerCase().includes(search) ||
            gig.description.toLowerCase().includes(search);

        const matchesCategory =
            category === "all" || gig.category === category;

        return matchesSearch && matchesCategory;
    });

    gigList.innerHTML = "";

    if (filteredGigs.length === 0) {
        gigList.innerHTML = "<p>No gigs found.</p>";
        return;
    }

    filteredGigs.forEach(gig => {
        const card = document.createElement("div");
        card.className = "gig-card";

        card.innerHTML = `
            <span class="gig-category">${gig.category}</span>

            <h3>${gig.title}</h3>

            <p>${gig.description}</p>

            <small>Creator: ${gig.creator}</small>

            <div class="gig-bottom">
                <span class="price">₹${gig.rate}</span>

                <button class="btn primary"
                    onclick="bookGig(${gig.id})">
                    Book Now
                </button>
            </div>
        `;

        gigList.appendChild(card);
    });
}


// BOOK A GIG
function bookGig(gigId) {

    const existingBooking = bookings.find(
        booking =>
            booking.gigId === gigId &&
            booking.status === "Pending"
    );

    // DP2: Prevent double booking
    if (existingBooking) {
        alert("This gig already has a pending booking.");
        return;
    }

    const gig = gigs.find(g => g.id === gigId);

    if (!gig) return;

    const booking = {
        id: Date.now(),
        gigId: gig.id,
        title: gig.title,
        creator: gig.creator,
        rate: gig.rate,
        status: "Pending"
    };

    bookings.push(booking);

    alert("Booking request sent!");

    displayMyBookings();
    displayCreatorBookings();
}


// POST A NEW GIG
document.getElementById("gigForm").addEventListener("submit", function(event) {

    event.preventDefault();

    const title = document.getElementById("gigTitle").value;
    const category = document.getElementById("gigCategory").value;
    const rate = Number(document.getElementById("gigRate").value);
    const description = document.getElementById("gigDescription").value;

    const newGig = {
        id: Date.now(),
        title: title,
        category: category,
        rate: rate,
        description: description,
        creator: "You"
    };

    gigs.unshift(newGig);

    this.reset();

    displayGigs();

    alert("Gig published successfully!");
});


// MY BOOKINGS
function displayMyBookings() {

    const container = document.getElementById("myBookings");

    container.innerHTML = "";

    if (bookings.length === 0) {
        container.innerHTML = "<p>You don't have any bookings yet.</p>";
        return;
    }

    bookings.forEach(booking => {

        const card = document.createElement("div");

        card.className = "booking-card";

        card.innerHTML = `
            <h3>${booking.title}</h3>
            <p>Creator: ${booking.creator}</p>
            <p>Price: ₹${booking.rate}</p>
            <span class="status">${booking.status}</span>
        `;

        container.appendChild(card);
    });
}


// CREATOR DASHBOARD
function displayCreatorBookings() {

    const container = document.getElementById("creatorBookings");

    container.innerHTML = "";

    if (bookings.length === 0) {
        container.innerHTML = "<p>No incoming bookings.</p>";
        return;
    }

    bookings.forEach(booking => {

        const card = document.createElement("div");

        card.className = "booking-card";

        card.innerHTML = `
            <h3>${booking.title}</h3>

            <p>Client has requested this gig.</p>

            <span class="status">${booking.status}</span>

            ${
                booking.status === "Pending"
                ? `
                    <div style="margin-top:15px;">
                        <button
                            class="btn accept-btn"
                            onclick="acceptBooking(${booking.id})">
                            Accept
                        </button>

                        <button
                            class="btn decline-btn"
                            onclick="declineBooking(${booking.id})">
                            Decline
                        </button>
                    </div>
                `
                : ""
            }
        `;

        container.appendChild(card);
    });
}


// ACCEPT BOOKING
function acceptBooking(bookingId) {

    const booking = bookings.find(
        booking => booking.id === bookingId
    );

    if (!booking) return;

    booking.status = "Accepted";

    displayMyBookings();
    displayCreatorBookings();

    alert("Booking accepted!");
}


// DECLINE BOOKING
function declineBooking(bookingId) {

    const booking = bookings.find(
        booking => booking.id === bookingId
    );

    if (!booking) return;

    // DP1: Clear rejection status
    booking.status = "Declined";

    displayMyBookings();
    displayCreatorBookings();

    alert("Booking declined. The client can request again.");
}


// SEARCH + FILTER
searchInput.addEventListener("input", displayGigs);
categoryFilter.addEventListener("change", displayGigs);


// INITIAL DISPLAY
displayGigs();
displayMyBookings();
displayCreatorBookings();