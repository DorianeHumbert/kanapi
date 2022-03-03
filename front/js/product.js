window.onload = init;

const elementsHTML = {
	divImg: null,
	hTitle: null,
	spanPrix: null,
	pDescription: null,
	selectCouleurs: null,
	inputQuantite: null,
}

async function init() {
	const produit = await recupererProduit();
	recupererElements();
	peuplerHTMLAvecProduit(produit);

	document.querySelector("#addToCart")?.addEventListener("click", ()=>{
		ajouterAuPanier(produit);
	});
}

async function recupererProduit() {
	const matchIdProduit = window.location.search.match(/\?id=(.+)/);
	const idProduit = matchIdProduit ? matchIdProduit[1] : null;
	if (!idProduit) {
		throw new Error("Id produit non trouvée");
	}
	const fetchProduit = await fetch (`http://localhost:3000/api/products/${idProduit}`);
	const produit = await fetchProduit.json();
	return produit;
}

function recupererElements() {
	const divImg = document.querySelector(".item__img");
	if (!divImg) {
		throw new Error("divImg introuvable");
	}
	elementsHTML.divImg = divImg;

	const hTitle = document.querySelector("#title");
	if (!hTitle) {
		throw new Error("hTitle introuvable");
	}
	elementsHTML.hTitle = hTitle;

	const spanPrix = document.querySelector("#price");
	if (!spanPrix) {
		throw new Error("spanPrix introuvable");
	}
	elementsHTML.spanPrix = spanPrix;

	const pDescription = document.querySelector("#description");
	if (!pDescription) {
		throw new Error("pDescription introuvable");
	}
	elementsHTML.pDescription = pDescription;

	const selectCouleurs = document.querySelector("#colors");
	if (!selectCouleurs) {
		throw new Error("selectCouleurs introuvable");
	}
	elementsHTML.selectCouleurs = selectCouleurs;

	const inputQuantite = document.querySelector("#quantity");
	if (!inputQuantite) {
		throw new Error("inputQuantite introuvable");
	}
	elementsHTML.inputQuantite = inputQuantite;
}

function peuplerHTMLAvecProduit(produit) {
	const img = document.createElement("img");
	img.src = produit.imageUrl;
	img.alt = produit.altTxt;
	elementsHTML.divImg.append(img);

	elementsHTML.hTitle.innerText = produit.name;

	elementsHTML.spanPrix.innerText = produit.price;

	elementsHTML.pDescription.innerText = produit.description;

	produit.colors.forEach(couleur=>{
		const option = document.createElement("option");
		option.value = couleur;
		option.innerText = couleur;
		elementsHTML.selectCouleurs.append(option);
	});
}

function ajouterAuPanier(produit) {
	const couleur = elementsHTML.selectCouleurs.value;
	const quantite = Number(elementsHTML.inputQuantite.value);

	if (!couleur || !quantite) {
		if (!couleur) {
			elementsHTML.selectCouleurs.reportValidity();
		}
		if (!quantite) {
			elementsHTML.inputQuantite.reportValidity();
		}
		return;
	}

	const jsonPanier = sessionStorage.getItem("panierKanap");
	let panier = jsonPanier ? JSON.parse(jsonPanier) : {};
	if (!panier[produit._id]) {
		panier[produit._id] = {};
	}
	if (panier[produit._id][couleur]) {
		panier[produit._id][couleur] += quantite;
	} else {
		panier[produit._id][couleur] = quantite;
	}
	sessionStorage.setItem("panierKanap", JSON.stringify(panier));
}