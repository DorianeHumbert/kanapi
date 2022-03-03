window.onload = init;

async function init() {
	const fetchProduits = await fetch("http://localhost:3000/api/products");
	const produits = await fetchProduits.json();


	const sectionItems = document.querySelector("section#items");
	if (!sectionItems) {
		throw new Error("Section items non trouvée");
	}

	const docFragment = new DocumentFragment();
	produits.forEach(produit=>{
		docFragment.append(genererDivProduit(produit));
	});
	sectionItems.append(docFragment);
}

function genererDivProduit(produit) {
	const divProduit = document.createElement("a");
	divProduit.href = `./product.html?id=${produit._id}`;
	divProduit.innerHTML = `
		<article>
          <img src="${produit.imageUrl}" alt="${produit.altTxt}">
          <h3 class="productName">${produit.name}</h3>
          <p class="productDescription">${produit.description}</p>
        </article>
	`;
	return divProduit;
}