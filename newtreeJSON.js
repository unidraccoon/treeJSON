'use strict';

//for run with node.js
const fetch = require("node-fetch");
const _ = require('lodash');

async function getJSON(node) {
    let url = 'https://jsonplaceholder.typicode.com/posts/' + node.data;
    let obj = await (await fetch(url)).json();
    node.data = obj.title;
}

class Queue{
	constructor(){
		this._oldestIndex = 1;
		this._newestIndex = 1;
		this._storage = {};
	}

	size(){
		return this._newestIndex - this._oldestIndex;
	}

	enequeue(data){
		this._storage[this._newestIndex] = data;
		this._newestIndex++;
	}

	deque(){
		let oldestIndex = this._oldestIndex,
		deletedData = this._storage[oldestIndex];

		delete this._storage[oldestIndex];
		this._oldestIndex++;
	
		return deletedData;

	}
};

class TreeNode{
	constructor(data) { 
		this.data = data;
		this.children = [];
		this.level = 0;
	}

	async change(){
		let queue = new Queue();

		queue.enequeue(this);

		let currentTree = queue.deque();

		currentTree.level = 0;

		while(currentTree){
			for (let i = 0, length = currentTree.children.length; i < length; i++) {
				currentTree.children[i].level = currentTree.level + 1;
				queue.enequeue(currentTree.children[i]);
			}

			await getJSON(currentTree);
			console.log(' '.repeat(currentTree.level * 3) + "*" + currentTree.data);
			currentTree = queue.deque();
		}
	}

	// copy(){
	// 	const obj = _.cloneDeep(tree);
	// 	return obj
	// }

	printCommentTree(){
		const obj = _.cloneDeep(this);
		obj.change();
		return obj;
	}

};


const tree = new TreeNode(1);

tree.children.push(new TreeNode(2));
tree.children.push(new TreeNode(3));
tree.children.push(new TreeNode(4));
tree.children[0].children.push(new TreeNode(5));
tree.children[0].children.push(new TreeNode(6));
tree.children[2].children.push(new TreeNode(7));

const obj = tree.printCommentTree()
