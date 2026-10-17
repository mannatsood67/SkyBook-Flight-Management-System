
const flights = [
    {
        from: "Delhi",
        to: "Mumbai",
        airline: "IndiGo",
        time: "10:15 AM - 12:30 PM",
        price: 5499
    },
    {
        from: "Bengaluru",
        to: "Delhi",
        airline: "Air India",
        time: "06:45 AM - 09:10 AM",
        price: 6999
    },
    {
        from: "Chennai",
        to: "Hyderabad",
        airline: "SpiceJet",
        time: "07:20 PM - 08:50 PM",
        price: 3999
    },
    {
        from: "Delhi",
        to: "Bengaluru",
        airline: "Air India",
        time: "02:00 PM - 04:45 PM",
        price: 5999
    },
    {
        from: "Mumbai",
        to: "Delhi",
        airline: "IndiGo",
        time: "08:00 AM - 10:15 AM",
        price: 4999
    }
];

const searchButton = document.getElementById("searchButton");
const fromInput = document.getElementById("from");
const toInput = document.getElementById("to");
const dateInput = document.getElementById("date");
const flightList = document.getElementById("flightList");
const resultsTitle = document.getElementById("resultsTitle");

searchButton.addEventListener("click", function () {
    const from = fromInput.value.trim().toLowerCase();
    const to = toInput.value.trim().toLowerCase();
    const date = dateInput.value;

    if (from === "" || to === "" || date === "") {
        alert("Please enter your departure city, destination and travel date.");
        return;
    }

    if (from === to) {
        alert("Departure and destination cities must be different.");
        return;
    }

    const results = flights.filter(function (flight) {
        return flight.from.toLowerCase() === from &&
               flight.to.toLowerCase() === to;
    });

    resultsTitle.textContent =
        "Search Results: " + fromInput.value + " → " + toInput.value;

    flightList.innerHTML = "";

    if (results.length === 0) {
        flightList.innerHTML =
            "<p>No sample flights found for this route. Try Delhi to Mumbai, Bengaluru to Delhi, Chennai to Hyderabad, Delhi to Bengaluru, or Mumbai to Delhi.</p>";
        return;
    }

    results.forEach(function (flight) {
        const card = document.createElement("article");
        card.className = "flight-card";

        const heading = document.createElement("h3");
        heading.textContent = flight.from + " → " + flight.to;

        const airline = document.createElement("p");
        airline.textContent = flight.airline + " · Non-stop";

        const time = document.createElement("p");
        time.textContent = flight.time;

        const price = document.createElement("div");
        price.className = "price";
        price.textContent = "₹" + flight.price.toLocaleString("en-IN");

        const lineBreak = document.createElement("br");
        const bookButton = document.createElement("button");
        bookButton.textContent = "Book Now";
        bookButton.type = "button";

        bookButton.addEventListener("click", function () {
            alert("You selected " + flight.from + " to " +
                  flight.to + ". Seat booking is our next feature!");
        });

        card.append(heading, airline, time, price, lineBreak, bookButton);
        flightList.appendChild(card);
    });

    resultsTitle.scrollIntoView({ behavior: "smooth" });
});

// ===== SEAT SELECTION FEATURE =====

const seatPage = document.getElementById("seatPage");
const backButton = document.getElementById("backButton");
const selectedFlightText = document.getElementById("selectedFlight");
const seatGrid = document.getElementById("seatGrid");
const seatNumber = document.getElementById("seatNumber");
const seatPrice = document.getElementById("seatPrice");
const continueButton = document.getElementById("continueButton");

let chosenFlight = null;
let chosenSeat = null;

// Demo occupied seats
const occupiedSeats = ["1C", "2A", "3B", "4C", "5A", "6B"];

function openSeatPage(flight) {
    chosenFlight = flight;
    chosenSeat = null;

    selectedFlightText.textContent =
        flight.from + " → " + flight.to +
        " | " + flight.airline + " | ₹" +
        flight.price.toLocaleString("en-IN");

    seatNumber.textContent = "None";
    seatPrice.textContent = "₹0";
    continueButton.disabled = true;

    flightList.hidden = true;
    resultsTitle.hidden = true;
    document.querySelector(".search-box").hidden = true;
    document.querySelector(".hero").hidden = true;
    document.querySelector(".navbar").hidden = true;

    seatPage.hidden = false;
    seatGrid.innerHTML = "";

    // Seven columns: A, B, C, aisle, D, E, F
    for (let row = 1; row <= 8; row++) {
        for (let col = 0; col < 7; col++) {
            if (col === 3) {
                const aisle = document.createElement("div");
                aisle.className = "seat-aisle";
                seatGrid.appendChild(aisle);
                continue;
            }

            const letters = ["A", "B", "C", "D", "E", "F"];
            const seatId = row + letters[col > 3 ? col - 1 : col];

            const seat = document.createElement("button");
            seat.type = "button";
            seat.className = "seat";
            seat.textContent = seatId;
            seat.setAttribute("aria-label", "Seat " + seatId);

            if (occupiedSeats.includes(seatId)) {
                seat.classList.add("occupied");
                seat.disabled = true;
                seat.title = "Unavailable in this demo";
            } else {
                seat.addEventListener("click", function () {
                    document.querySelectorAll(".seat.selected")
                        .forEach(function (item) {
                            item.classList.remove("selected");
                        });

                    seat.classList.add("selected");
                    chosenSeat = seatId;

                    seatNumber.textContent = chosenSeat;
                    seatPrice.textContent =
                        "₹" + (chosenFlight.price + 500)
                            .toLocaleString("en-IN");

                    continueButton.disabled = false;
                });
            }

            seatGrid.appendChild(seat);
        }
    }

    seatPage.scrollIntoView({ behavior: "smooth" });
}

// Attach booking actions to the displayed flight cards
document.querySelectorAll(".flight-card button").forEach(
    function (button) {
        button.addEventListener("click", function () {
            const card = button.closest(".flight-card");
            const heading = card.querySelector("h3").textContent;
            const parts = heading.split(" → ");
            const airline = card.querySelector("p").textContent
                .split(" · ")[0];
            const priceText = card.querySelector(".price")
                .textContent.replace(/[₹,]/g, "");

            openSeatPage({
                from: parts[0].trim(),
                to: parts[1].trim(),
                airline: airline,
                price: Number(priceText)
            });
        });
    }
);

backButton.addEventListener("click", function () {
    seatPage.hidden = true;
    flightList.hidden = false;
    resultsTitle.hidden = false;
    document.querySelector(".search-box").hidden = false;
    document.querySelector(".hero").hidden = false;
    document.querySelector(".navbar").hidden = false;

    chosenSeat = null;
    chosenFlight = null;
});

continueButton.addEventListener("click", function () {
    if (!chosenFlight || !chosenSeat) {
        alert("Please select a seat first.");
        return;
    }

    alert(
        "Seat selected successfully!\n" +
        "Flight: " + chosenFlight.from + " → " +
        chosenFlight.to + "\n" +
        "Seat: " + chosenSeat + "\n\n" +
        "Next, we will build the passenger details form."
    );
});

/* ===== PASSENGER DETAILS AND CONFIRMATION ===== */

const passengerPage = document.getElementById("passengerPage");
const confirmationPage = document.getElementById("confirmationPage");
const passengerForm = document.getElementById("passengerForm");

const backToSeats = document.getElementById("backToSeats");
const passengerFlight = document.getElementById("passengerFlight");
const passengerSeat = document.getElementById("passengerSeat");
const passengerTotal = document.getElementById("passengerTotal");

const confirmationDetails =
    document.getElementById("confirmationDetails");
const bookingReference =
    document.getElementById("bookingReference");

const newBooking = document.getElementById("newBooking");

function showOnlyPassengerPage() {
    seatPage.hidden = true;
    passengerPage.hidden = false;
    confirmationPage.hidden = true;
    passengerPage.scrollIntoView({ behavior: "smooth" });

    passengerFlight.textContent =
        "Flight: " + chosenFlight.from + " → " +
        chosenFlight.to + " (" + chosenFlight.airline + ")";

    passengerSeat.textContent = "Seat: " + chosenSeat;

    passengerTotal.textContent =
        "Total: ₹" +
        (chosenFlight.price + 500).toLocaleString("en-IN");
}

// Replace the existing Continue button's click handler
continueButton.onclick = function () {
    if (!chosenFlight || !chosenSeat) {
        alert("Please select a seat first.");
        return;
    }

    showOnlyPassengerPage();
};

backToSeats.addEventListener("click", function () {
    passengerPage.hidden = true;
    seatPage.hidden = false;
    seatPage.scrollIntoView({ behavior: "smooth" });
});

passengerForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const name = document.getElementById("passengerName").value.trim();
    const email = document.getElementById("passengerEmail").value.trim();
    const phone = document.getElementById("passengerPhone").value.trim();

    if (!name || !email || !/^[0-9]{10}$/.test(phone)) {
        alert("Please enter valid passenger details.");
        return;
    }

    const booking = {
        reference: "SB" + Date.now().toString().slice(-8),
        passenger: name,
        email: email,
        phone: phone,
        from: chosenFlight.from,
        to: chosenFlight.to,
        airline: chosenFlight.airline,
        seat: chosenSeat,
        total: chosenFlight.price + 500,
        createdAt: new Date().toLocaleString()
    };

    // Save demo booking in this browser
    const bookings = JSON.parse(
        localStorage.getItem("skybookBookings") || "[]"
    );

    bookings.push(booking);

    localStorage.setItem("skybookBookings", JSON.stringify(bookings));

    passengerPage.hidden = true;
    confirmationPage.hidden = false;

    bookingReference.textContent = booking.reference;

    confirmationDetails.replaceChildren();

    const details = [
        ["Passenger", booking.passenger],
        ["Flight", booking.from + " → " + booking.to],
        ["Airline", booking.airline],
        ["Seat", booking.seat],
        ["Total", "₹" + booking.total.toLocaleString("en-IN")],
        ["Created", booking.createdAt]
    ];

    details.forEach(function (item) {
        const row = document.createElement("p");
        const label = document.createElement("strong");

        label.textContent = item[0] + ": ";
        row.append(label, document.createTextNode(item[1]));

        confirmationDetails.appendChild(row);
    });

    confirmationPage.scrollIntoView({ behavior: "smooth" });
});

newBooking.addEventListener("click", function () {
    confirmationPage.hidden = true;
    passengerPage.hidden = true;
    seatPage.hidden = true;

    flightList.hidden = false;
    resultsTitle.hidden = false;
    document.querySelector(".search-box").hidden = false;
    document.querySelector(".hero").hidden = false;
    document.querySelector(".navbar").hidden = false;

    passengerForm.reset();

    chosenFlight = null;
    chosenSeat = null;

    window.scrollTo({ top: 0, behavior: "smooth" });
});

/* ===== MY BOOKINGS AND CANCELLATION ===== */

const myBookingsPage = document.getElementById("myBookingsPage");
const myBookingsLink = document.getElementById("myBookingsLink");
const backFromBookings = document.getElementById("backFromBookings");
const bookingsList = document.getElementById("bookingsList");
const noBookingsMessage = document.getElementById("noBookingsMessage");

function getSavedBookings() {
    return JSON.parse(localStorage.getItem("skybookBookings") || "[]");
}

function saveBookings(bookings) {
    localStorage.setItem("skybookBookings", JSON.stringify(bookings));
}

function showMainPage() {
    myBookingsPage.hidden = true;
    seatPage.hidden = true;
    passengerPage.hidden = true;
    confirmationPage.hidden = true;

    document.querySelector(".navbar").hidden = false;
    document.querySelector(".hero").hidden = false;
    document.querySelector(".search-box").hidden = false;
    flightList.hidden = false;
    resultsTitle.hidden = false;

    window.scrollTo({ top: 0, behavior: "smooth" });
}

function renderBookings() {
    const bookings = getSavedBookings();

    bookingsList.replaceChildren();
    noBookingsMessage.hidden = bookings.length > 0;

    bookings.forEach(function (booking) {
        const card = document.createElement("article");
        card.className = "booking-card";

        const heading = document.createElement("h3");
        heading.textContent = booking.from + " → " + booking.to;

        const reference = document.createElement("p");
        reference.textContent = "Reference: " + booking.reference;

        const passenger = document.createElement("p");
        passenger.textContent = "Passenger: " + booking.passenger;

        const seat = document.createElement("p");
        seat.textContent = "Seat: " + booking.seat;

        const total = document.createElement("p");
        total.textContent =
            "Total: ₹" + booking.total.toLocaleString("en-IN");

        const status = document.createElement("span");
        status.className = "booking-status";

        if (booking.status === "Cancelled") {
            status.classList.add("cancelled");
        }

        status.textContent = booking.status || "Confirmed";

        card.append(heading, reference, passenger, seat, total, status);

        if (booking.status !== "Cancelled") {
            const cancelButton = document.createElement("button");
            cancelButton.type = "button";
            cancelButton.className = "cancel-button";
            cancelButton.textContent = "Cancel Booking";

            cancelButton.addEventListener("click", function () {
                const confirmed = window.confirm(
                    "Are you sure you want to cancel booking " +
                    booking.reference + "?"
                );

                if (!confirmed) return;

                const updatedBookings = getSavedBookings().map(
                    function (item) {
                        if (item.reference === booking.reference) {
                            return { ...item, status: "Cancelled" };
                        }

                        return item;
                    }
                );

                saveBookings(updatedBookings);
                renderBookings();
            });

            card.appendChild(cancelButton);
        }

        bookingsList.appendChild(card);
    });
}

myBookingsLink.addEventListener("click", function (event) {
    event.preventDefault();

    document.querySelector(".navbar").hidden = true;
    document.querySelector(".hero").hidden = true;
    document.querySelector(".search-box").hidden = true;
    flightList.hidden = true;
    resultsTitle.hidden = true;

    seatPage.hidden = true;
    passengerPage.hidden = true;
    confirmationPage.hidden = true;
    myBookingsPage.hidden = false;

    renderBookings();
    myBookingsPage.scrollIntoView({ behavior: "smooth" });
});

backFromBookings.addEventListener("click", showMainPage);

