window.onload = init;

async function init() {
	const matchNumeroCommande = window.location.search.match(/\?orderId=(.+)/);
	const numeroCommandeATraiter = matchNumeroCommande ? matchNumeroCommande[1] : null;
	const numeroCommande = /=$/.test(numeroCommandeATraiter)?atob(numeroCommandeATraiter):numeroCommandeATraiter;
	if (!numeroCommande) {
		throw new Error("Aucun numéro de commande trouvé");
	}
	document.querySelector("#orderId").innerText = numeroCommande;
}