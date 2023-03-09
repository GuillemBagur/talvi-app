const renderTickets = (tickets) => {
  const ticketsWrapper = document.querySelector(
    `[data-role="tickets-wrapper"]`
  );
  ticketsWrapper.innerHTML = "";
  let toRender = "";
  for (let ticket of tickets) {
    const result = `
		<div class="ticket">
			<h3 class="ticket__shop">${ticket.shop.name}</h3>
			<h4 class="ticket__date">${formatDate(ticket.createdAt)}</h4>
			<ul class="ticket__products">
			${ticket.products
        .map((product) => `<li class="ticket__product">${product.name} (${product.price})</li>`)
        .join("")}
			</ul>

			<h3 class="ticket__total">Total: ${ticket.total || "No disponible"} €</h3>
		</div>
		`;
    toRender += result;
  }

  ticketsWrapper.innerHTML = toRender;
};

document.addEventListener("DOMContentLoaded", async () => {
  const tickets = await fetchStats("123");
  const allTickets = tickets.all;
  console.log(allTickets);
  renderTickets(allTickets);
});
