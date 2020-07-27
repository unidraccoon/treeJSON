'use strict';

//for run with node.js
const fetch = require("node-fetch");
// import { fetch } from "node-fetch";
const _ = require('lodash');
// import { cloneDeep } from 'lodash'

class TreeNode{
	constructor(data) { 
		this.data = data;
		this.children = [];
	}

	async getJSON() {
		let url = 'https://jsonplaceholder.typicode.com/posts/' + this.data;
		let obj = await (await fetch(url)).json();
		this.data = obj.title;
	}

	async change(){
		let p = this.getJSON();
		let promiseArr = [p];

		for (let i = 0, length = this.children.length; i < length; i++) {
			promiseArr.push(new Promise(async function(resolve,reject) {
				await this.children[i].change()
				resolve("done")
			}.bind(this)));
		}

		let promise = Promise.all(promiseArr);
		await promise;
	}

	out(level = 0){
		this.level = level + 1;
		console.log(' '.repeat(this.level * 3) + "*" + this.data);
		for (let i = 0, length = this.children.length; i < length; i++) {
				this.children[i].out(this.level);
			}
	}

	async printCommentTree(){
		const obj = _.cloneDeep(this);
		await obj.change();
		obj.out();
		return obj;
	}
}

const tree = new TreeNode(1);
tree.children.push(new TreeNode(2));
tree.children.push(new TreeNode(3));
tree.children.push(new TreeNode(4));
tree.children[0].children.push(new TreeNode(5));
tree.children[0].children.push(new TreeNode(6));
tree.children[2].children.push(new TreeNode(7));

let obj;
tree.printCommentTree().then(result => (obj = result));

