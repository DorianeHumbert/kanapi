window.onload = init;

let panier = {};
const produitsParId = new Map();

async function init() {
	const jsonPanier = window.sessionStorage.getItem("panierKanap");
	panier = jsonPanier ? JSON.parse(jsonPanier) : {};

	await majAffichagePanier();
	await majAffichagePrix();

	document.querySelector("#order").addEventListener("click", validerCommande);
}

async function majAffichagePanier() {
	const promisesProduits = [];
	for (let idProduit in panier) {
		const couleurs = panier[idProduit];
		for (let couleur in couleurs) {
			const quantite = couleurs[couleur];
			promisesProduits.push(genererArticleProduit(idProduit, couleur, quantite));
		}
	}
	const articles = await Promise.all(promisesProduits);
	const sectionItems = document.querySelector("#cart__items");
	if (!sectionItems) {
		throw new Error("sectionItems introuvable");
	}
	articles.forEach(article=>{
		sectionItems.append(article);
	});

}

async function genererArticleProduit(idProduit, couleur, quantite) {
	let produit;
	if (produitsParId.has(idProduit)) {
		produit = produitsParId.get(idProduit);
	} else {
		const jsonProduit = await fetch(`http://localhost:3000/api/products/${idProduit}`);
		produit = await jsonProduit.json();
		produitsParId.set(produit._id, produit);
	}

	const article = document.createElement("article");
	article.classList.add("cart__item");
	article.setAttribute("data-id", idProduit);
	article.setAttribute("data-color", couleur);
	article.innerHTML = `
		<div class="cart__item__img">
		  <img src="${produit.imageUrl}" alt="${produit.altTxt}">
		</div>
		<div class="cart__item__content">
		  <div class="cart__item__content__description">
		    <h2>${produit.name}</h2>
		    <p>${couleur}</p>
		    <p>${produit.price} €</p>
		  </div>
		  <div class="cart__item__content__settings">
		    <div class="cart__item__content__settings__quantity">
		      <p>Qté : </p>
		      <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${quantite}">
		    </div>
		    <div class="cart__item__content__settings__delete">
		      <p class="deleteItem">Supprimer</p>
		    </div>
		  </div>
		</div>
	`;

	const inputQuantite = article.querySelector(".itemQuantity");
	inputQuantite.addEventListener("change", ()=>{
		const nouvelleQuantite = Number(inputQuantite.value);
		if (isNaN(nouvelleQuantite) || nouvelleQuantite <= 0) {
			supprimerProduit(produit, couleur);
			article.remove();
		} else {
			changerQuantiteProduit(produit, couleur, nouvelleQuantite);
		}
	});

	const boutonSupprimer = article.querySelector(".deleteItem");
	boutonSupprimer.addEventListener("click", ()=>{
		supprimerProduit(produit, couleur);
		article.remove();
	});

	return article;
}

function changerQuantiteProduit(produit, couleur, nouvelleQuantite) {
	panier[produit._id][couleur] = nouvelleQuantite;
	majAffichagePrix();
	sauvegarderPanier();
}

function supprimerProduit(produit, couleur) {
	delete panier[produit._id][couleur];
	majAffichagePrix();
	sauvegarderPanier();
}

function sauvegarderPanier() {
	sessionStorage.setItem("panierKanap", JSON.stringify(panier));
}

function majAffichagePrix() {
	let quantiteTotale = 0;
	let prixTotal = 0;
	for (let idProduit in panier) {
		const produit = produitsParId.get(idProduit);
		if (!produit) {
			continue;
		}

		for (let couleur in panier[idProduit]) {
			const quantite = panier[idProduit][couleur];
			quantiteTotale += quantite;
			prixTotal += quantite * produit.price;
		}
	}

	document.querySelector("#totalQuantity").innerText = quantiteTotale;
	document.querySelector("#totalPrice").innerText = prixTotal;
}

async function validerCommande(e) {
	e.preventDefault();

	const divErreurPrenom = document.querySelector("#firstNameErrorMsg");
	divErreurPrenom.innerText = "";
	const divErreurNom = document.querySelector("#lastNameErrorMsg");
	divErreurNom.innerText = "";
	const divErreurAdresse = document.querySelector("#addressErrorMsg");
	divErreurAdresse.innerText = "";
	const divErreurVille = document.querySelector("#cityErrorMsg");
	divErreurVille.innerText = "";
	const divErreurMail = document.querySelector("#emailErrorMsg");
	divErreurMail.innerText = "";


	const formData = new FormData(document.querySelector("form"));

	let presenceErreur = false;

	const prenom = formData.get("firstName");
	if (!prenom || prenom.length === 0 || /0-9/.test(prenom)) {
		divErreurPrenom.innerText = "Le format du prénom est incorrect";
		presenceErreur = true;
	}

	const nom = formData.get("lastName");
	if (!nom || nom.length === 0 || /0-9/.test(nom)) {
		divErreurNom.innerText = "Le format du nom est incorrect";
		presenceErreur = true;
	}

	const adresse = formData.get("address");
	if (!adresse || adresse.length === 0) {
		divErreurAdresse.innerText = "Le format de l'adresse est incorrect";
		presenceErreur = true;
	}

	const ville = formData.get("city");
	if (!ville || ville.length === 0 || /0-9/.test(ville)) {
		divErreurVille.innerText = "Le format de la ville est incorrect";
		presenceErreur = true;
	}

	const mail = formData.get("email");
	const regexEMail = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;
	if (!mail || mail.length === 0 || !regexEMail.test(mail)) {
		divErreurMail.innerText = "Le format du mail est incorrect";
		presenceErreur = true;
	}

	if (presenceErreur) {
		return;
	}

	const contact = {
		firstName: prenom,
		lastName: nom,
		address: adresse,
		city: ville,
		email: mail,
	};

	const products = Object.keys(panier);

	const fetchRetourOrder = await fetch("http://localhost:3000/api/products/order", {
		method: 'POST',
		body: JSON.stringify({
			contact,
			products
		}),
		headers: {
			'Accept': "application/json",
			"Content-type": "application/json",
		},
	});
	const retourOrder = await fetchRetourOrder.json();
	const numeroCommande = retourOrder?.orderId;
	if (numeroCommande) {
		window.location = `./confirmation.html?orderId=${numeroCommande}`;
	} else {
		throw new Error("Une erreur est survenue pendant la validation de la commande");
	}
}