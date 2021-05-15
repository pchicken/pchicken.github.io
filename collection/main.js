"use strict";

const selector = $("selector");
selector.populate = async function () {
	removeChildrenOf(this);

	const resp = await fetch(
		"https://api.github.com/repos/pchicken/sbs-customizations/contents/haloopdy"
	);
	console.log(resp);
	if (!resp.ok) {
		alert("could not load pchicken/sbs-customizations/haloopdy");
		return;
	}

	const dirContents = await resp.json();
	const files = dirContents.filter((f) => f.type == "file");

	const template = $("selectable-template");
	files.forEach((f) => {
		const option = template.content.firstElementChild.cloneNode(true);
		option.lastElementChild.textContent = f.name;
		this.append(option);
	});
};
selector.populate();

function toggleOf(these) {
	let truePresent = false;
	for (let i of these) {
		if (i.firstElementChild.checked) {
			truePresent = true;
			break;
		}
	}
	for (let i of these) {
		i.firstElementChild.checked = !truePresent;
	}
}

function toggleAll() {
	toggleOf(selector.children);
}

function toggleWith(suffix) {
	let filtered = Array.from(selector.children).filter((x) =>
		x.textContent.endsWith(suffix)
	);
	toggleOf(filtered);
}

const collected = $("collected");
async function collect() {
	collected.disabled = true;
	collected.value = "";
	for (let i of selector.children) {
		if (i.firstElementChild.checked) {
			const url =
				"https://raw.githubusercontent.com/pchicken/sbs-customizations/main/haloopdy/" +
				i.textContent;
			const resp = await fetch(url);
			if (!resp.ok) {
				alert("could not fetch " + url);
				continue;
			}
			collected.value += await resp.text();
			collected.value += "\n";
		}
	}
	collected.disabled = false;
}

const formatted = $("formatted");
function format() {
	collected.disabled = true;
	formatted.disabled = true;
	formatted.value = collected.value
		.replace(/(\n|\t)/g, "")
		.replace(/\/\*.*?\*\//g, "");
	collected.disabled = false;
	formatted.disabled = false;
}

function copyAll() {
	formatted.select();
	document.execCommand("copy");
}

function $(id) {
	return document.getElementById(id);
}
function removeChildrenOf(el) {
	while (el.lastChild) el.removeChild(el.lastChild);
}
