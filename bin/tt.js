/**
 * TUNA FRAMEWORK
 *
 * Copyright (c) 2012, Sergey Kononenko
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 * * Redistributions of source code must retain the above copyright
 * notice, this list of conditions and the following disclaimer.
 * * Redistributions in binary form must reproduce the above copyright
 * notice, this list of conditions and the following disclaimer in the
 * documentation and/or other materials provided with the distribution.
 * * Names of contributors may be used to endorse or promote products
 * derived from this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
 * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
 * ARE DISCLAIMED. IN NO EVENT SHALL SERGEY KONONENKO BE LIABLE FOR ANY
 * DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 * SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */



if (typeof console !== 'object') {
  console = {};
}

if (typeof console.log !== 'function') {
  console.log = function(var_args) {
    alert(Array.prototype.slice.call(arguments).join(', '));
  };
}

if (typeof console.info !== 'function') {
  console.info = function(var_args) {
    console.log.apply(null, arguments);
  };
}

if (typeof console.warn !== 'function') {
  console.warn = function(var_args) {
    console.log.apply(null, arguments);
  };
}

if (typeof console.error !== 'function') {
  console.error = function(var_args) {
    console.log.apply(null, arguments);
  };
}

if (typeof JSON !== 'object') {
  throw Error('"JSON" object must exists.');
}

if (typeof JSON.stringify !== 'function') {
  throw Error('"JSON.stringify()" method must exists.');
}

if (typeof JSON.parse !== 'function') {
  throw Error('"JSON.parse()" method must exists.');
}

if (typeof util === 'undefined' ||
    typeof util.dom === 'undefined' ||
    typeof util.VERSION === 'undefined') {
  throw Error('Tuna "util" library must exists.');
}
'use strict';var tt = {};
tt.VERSION = "0.1.0";
tt.rule = {};
tt.tmpl = {};
tt.data = {};
tt.view = {};
tt.rule.TemplateRule = function(type, className, dataPath) {
  this.__type = type;
  this.__className = className;
  this.__pathEvaluator = new tt.data.PathEvaluator(dataPath)
};
tt.rule.TemplateRule.prototype.evaluateData = function(dataNode) {
  return this.__pathEvaluator.evaluate(dataNode)
};
tt.rule.TemplateRule.prototype.createTemplateItems = function(element) {
  return[]
};
tt.rule.TemplateRule.prototype._findTemplateElements = function(parent) {
  return util.dom.getElementsByClassName(this.__className, parent)
};
tt.rule.TemplateRule.prototype._createTemplateView = function() {
  return new tt.view.TextView
};
tt.rule.NodeRule = function(type, className, dataPath) {
  tt.rule.TemplateRule.call(this, type, className, dataPath)
};
util.inherits(tt.rule.NodeRule, tt.rule.TemplateRule);
tt.rule.NodeRule.prototype.createTemplateItems = function(element) {
  var elements = this._findTemplateElements(element);
  var i = 0, l = elements.length;
  var items = new Array(l);
  while(i < l) {
    items[i] = new tt.tmpl.Node(elements[i], this._createTemplateView(), this);
    i += 1
  }
  return items
};
tt.rule.LeafRule = function(type, className, dataPath) {
  tt.rule.TemplateRule.call(this, type, className, dataPath)
};
util.inherits(tt.rule.LeafRule, tt.rule.TemplateRule);
tt.rule.LeafRule.prototype.createTemplateItems = function(element) {
  return[new tt.tmpl.Leaf(this._findTemplateElements(element), this._createTemplateView(), this)]
};
tt.rule.createTemplateRoot = function(element, rules) {
  var items = [];
  var i = 0, l = rules.length;
  while(i < l) {
    items = items.concat(rules[i].createTemplateItems(element));
    i += 1
  }
  return new tt.tmpl.Root(items)
};
tt.data.PathEvaluator = function(path) {
  this.__path = path.split("/")
};
tt.data.PathEvaluator.prototype.evaluate = function(node) {
  return this.__applyToken(node, 0)
};
tt.data.PathEvaluator.prototype.__applyToken = function(node, index) {
  var token = this.__path[index];
  if(token !== undefined && node.getValue() !== null) {
    return this.__applyToken(this.__fetchNode(token, node), index + 1)
  }
  return node
};
tt.data.PathEvaluator.prototype.__fetchNode = function(token, node) {
  if(token === "") {
    return node.getRoot()
  }
  if(token === "$") {
    return node.getKey()
  }
  if(token === ".") {
    return node
  }
  if(token === "..") {
    return node.getParent()
  }
  return node.growChild(token)
};
tt.data.DataNode = function(value, opt_parent, opt_key) {
  this.__value = value;
  this.__parent = opt_parent || tt.data.NULL_NODE;
  this.__key = opt_key || null;
  this.__keyNode = null;
  this.__children = {}
};
tt.data.DataNode.prototype.getParent = function() {
  return this.__parent
};
tt.data.DataNode.prototype.getKey = function() {
  if(this.__keyNode === null) {
    this.__keyNode = new tt.data.DataNode(this.__key)
  }
  return this.__keyNode
};
tt.data.DataNode.prototype.getRoot = function() {
  return this.__parent !== tt.data.NULL_NODE ? this.__parent.getRoot() : this
};
tt.data.DataNode.prototype.getValue = function() {
  return this.__value
};
tt.data.DataNode.prototype.getStringValue = function() {
  return String(this.__value)
};
tt.data.DataNode.prototype.growChild = function(key) {
  if(this.__children[key] === undefined) {
    if(this.__value !== null && this.__value[key] !== undefined) {
      var node = new tt.data.DataNode(this.__value[key], this, key);
      this.__children[key] = node;
      return node
    }
    return tt.data.NULL_NODE
  }
  return this.__children[key]
};
tt.data.DataNode.prototype.growChildren = function() {
  if(this.__value instanceof Array) {
    var i = 0, l = this.__value.length;
    var items = new Array(l);
    while(i < l) {
      if(this.__children[i] === undefined) {
        this.__children[i] = new tt.data.DataNode(this.__value[i], this, i)
      }
      items[i] = this.__children[i];
      i += 1
    }
    return items
  }else {
    var nodes = [];
    for(var k in this.__value) {
      if(this.__children[k] === undefined) {
        this.__children[k] = new tt.data.DataNode(this.__value[k], this, k)
      }
      nodes.push(this.__children[k])
    }
    return nodes
  }
};
tt.data.NULL_NODE = new tt.data.DataNode(null);
tt.tmpl.ITemplateItem = function() {
};
tt.tmpl.ITemplateItem.prototype.applyData = function(data) {
};
tt.tmpl.TemplateItem = function(view, rule) {
  this._view = view;
  this._rule = rule
};
tt.tmpl.TemplateItem.prototype.applyData = function(data) {
};
tt.tmpl.Root = function(templateNodes) {
  this.__children = templateNodes
};
tt.tmpl.Root.prototype.applyData = function(dataNode) {
  var i = 0, l = this.__children.length;
  while(i < l) {
    this.__children[i].applyData(dataNode);
    i += 1
  }
};
tt.tmpl.Node = function(target, view, rule) {
  tt.tmpl.TemplateItem.call(this, view, rule);
  this._target = target
};
util.inherits(tt.tmpl.Node, tt.tmpl.TemplateItem);
tt.tmpl.Node.prototype.applyData = function(dataNode) {
  this._view.applyTransformation(this._target, this._rule.evaluateData(dataNode))
};
tt.tmpl.Leaf = function(targets, view, rule) {
  tt.tmpl.TemplateItem.call(this, view, rule);
  this._targets = targets
};
util.inherits(tt.tmpl.Leaf, tt.tmpl.TemplateItem);
tt.tmpl.Leaf.prototype.applyData = function(dataNode) {
  var data = this._rule.evaluateData(dataNode);
  var i = 0, l = this._targets.length;
  while(i < l) {
    this._view.applyTransformation(this._targets[i], data);
    i += 1
  }
};
tt.view.ITemplateView = function() {
};
tt.view.ITemplateView.prototype.applyTransformation = function(element, dataNode) {
};
tt.view.TextView = function() {
};
tt.view.TextView.prototype.applyTransformation = function(element, dataNode) {
  var value = dataNode.getStringValue();
  if(element.innerHTML !== value) {
    element.innerHTML = value
  }
};

