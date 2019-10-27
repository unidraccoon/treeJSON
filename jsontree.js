'use strict';

//for run with node.js
const fetch = require("node-fetch");
const _ = require('lodash');

async function getJSON(node) {
    let url = 'https://jsonplaceholder.typicode.com/posts/' + node.data;
    let obj = await (await fetch(url)).json();
    node.data = obj.title;
}

function TreeNode(data) {
	this.data = data;
	this.children = [];
	this.level = 0;
};

function Tree(data) {
	let node = new TreeNode(data);
	this._root = node;
};

function Queue() {
    this._oldestIndex = 1;
    this._newestIndex = 1;
    this._storage = {};
}

Queue.prototype.size = function() {
    return this._newestIndex - this._oldestIndex;
};

Queue.prototype.enqueue = function(data) {
    this._storage[this._newestIndex] = data;
    this._newestIndex++;
};

Queue.prototype.dequeue = function() {
    var oldestIndex = this._oldestIndex,
        deletedData = this._storage[oldestIndex];
 
    delete this._storage[oldestIndex];
    this._oldestIndex++;
 
    return deletedData;
};

Tree.prototype.traverseBF = function(callback) {
    let queue = new Queue();
     
    queue.enqueue(this._root);
 
    let currentTree = queue.dequeue();

    currentTree.level = 0;
 
    while(currentTree){
        for (let i = 0, length = currentTree.children.length; i < length; i++) {
        	currentTree.children[i].level = currentTree.level + 1;
            queue.enqueue(currentTree.children[i]);
        }

        callback(currentTree);
        currentTree = queue.dequeue();
    }
};

Tree.prototype.printCommentTree = function() {
	let obj = _.cloneDeep(this);

	obj.traverseBF(async function(node) {
	await getJSON(node);
	console.log(' '.repeat(node.level * 4) + "*" + node.data);
	});

	return obj;
}

let tree = new Tree(1);
 
tree._root.children.push(new TreeNode(2));
tree._root.children.push(new TreeNode(3));
tree._root.children.push(new TreeNode(4));
tree._root.children[0].children.push(new TreeNode(5));
tree._root.children[0].children.push(new TreeNode(6));
tree._root.children[2].children.push(new TreeNode(7));

let obj = tree.printCommentTree();


