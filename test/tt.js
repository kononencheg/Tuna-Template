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
tt.rules = {};
tt.tree = {};
tt.data = {};
tt.view = {};
tt.createTemplate = function(target, sign) {
  return new tt.Template(tt.tree.createTemplateRoot(target, tt.rules.createRules(sign)))
};
tt.Template = function(root) {
  this.__root = root
};
tt.Template.prototype.getTarget = function() {
  return this.__root.getTarget()
};
tt.Template.prototype.processData = function(data) {
  this.__root.applyData(new tt.data.DataNode(data))
};
tt.rules.Rule = function(type, className, dataPath, options) {
  this.__type = type;
  this.__className = className;
  this.__pathEvaluator = new tt.data.PathEvaluator(dataPath);
  this.__helper = tt.view.createViewHelper(type, options)
};
tt.rules.Rule.prototype.evaluateData = function(dataNode) {
  return this.__pathEvaluator.evaluate(dataNode)
};
tt.rules.Rule.prototype.createTemplateNodes = function(parent) {
  var items = [];
  var elements = this.__findTemplateElements(parent);
  var i = 0, l = elements.length;
  while(i < l) {
    var view = tt.view.createView(this.__type, this.__helper);
    if(view !== null) {
      items.push(new tt.tree.TemplateNode(elements[i], view, this))
    }
    i += 1
  }
  return items
};
tt.rules.Rule.prototype.__findTemplateElements = function(parent) {
  if(util.dom.hasClass(parent, this.__className)) {
    return[parent]
  }
  return util.dom.getElementsByClassName(this.__className, parent)
};
tt.rules.createRules = function(sign) {
  var rules = [];
  for(var key in sign) {
    var atIndex = key.indexOf("@");
    var colonIndex = key.indexOf(":");
    if(atIndex !== -1 && colonIndex !== -1 && colonIndex > atIndex) {
      rules.push(new tt.rules.Rule(key.substring(0, atIndex), key.substring(atIndex + 1, colonIndex), key.substring(colonIndex + 1), sign[key]))
    }
  }
  return rules
};
tt.data.PathEvaluator = function(path) {
  this.__path = path.split("/")
};
tt.data.PathEvaluator.prototype.evaluate = function(node) {
  return this.__applyToken(node, 0)
};
tt.data.PathEvaluator.prototype.__applyToken = function(node, index) {
  if(this.__path.length > index && node.getValue() !== null) {
    return this.__applyToken(this.__fetchNode(this.__path[index], node), index + 1)
  }
  return node
};
tt.data.PathEvaluator.prototype.__fetchNode = function(token, node) {
  if(token.length > 2) {
    return node.growChild(token)
  }
  if(token.length === 0) {
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
  this.__key = opt_key || "";
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
tt.tree.ITemplateNode = function() {
};
tt.tree.ITemplateNode.prototype.applyData = function(data) {
};
tt.tree.TemplateRoot = function(target, templateNodes) {
  this.__target = target;
  this.__children = templateNodes
};
tt.tree.TemplateRoot.prototype.applyData = function(dataNode) {
  var i = 0, l = this.__children.length;
  while(i < l) {
    this.__children[i].applyData(dataNode);
    i += 1
  }
};
tt.tree.TemplateRoot.prototype.getTarget = function() {
  return this.__target
};
tt.tree.TemplateNode = function(target, view, rule) {
  this.__view = view;
  this.__rule = rule;
  this.__target = target
};
tt.tree.TemplateNode.prototype.applyData = function(dataNode) {
  this.__view.applyTransformation(this.__target, this.__rule.evaluateData(dataNode))
};
tt.tree.createTemplateRoot = function(element, rules) {
  var items = [];
  var i = 0, l = rules.length;
  while(i < l) {
    items = items.concat(rules[i].createTemplateNodes(element));
    i += 1
  }
  return new tt.tree.TemplateRoot(element, items)
};
tt.view.ITemplateView = function() {
};
tt.view.ITemplateView.prototype.applyTransformation = function(element, dataNode) {
};
tt.view.ITemplateViewHelper = function() {
};
tt.view.ListViewHelper = function(itemRenderer, itemRules, opt_keyPath) {
  this.__itemRenderer = itemRenderer;
  this.__itemRules = itemRules;
  this.__keyPathEvaluator = opt_keyPath === undefined ? null : new tt.data.PathEvaluator(opt_keyPath)
};
tt.view.ListViewHelper.prototype.evaluateKey = function(dataNode) {
  if(this.__keyPathEvaluator !== null) {
    return this.__keyPathEvaluator.evaluate(dataNode).getValue()
  }
  return dataNode.getKey().getValue()
};
tt.view.ListViewHelper.prototype.createItem = function(parent) {
  var target = this.__itemRenderer.cloneNode(true);
  if(target !== null) {
    parent.appendChild(target);
    return tt.tree.createTemplateRoot(target, this.__itemRules)
  }
  return null
};
tt.view.ListViewHelper.prototype.removeItem = function(parent, item) {
  parent.removeChild(item.getTarget())
};
tt.view.ListViewHelper.create = function(options) {
  var itemRules = [];
  var itemRenderer = null;
  if(typeof options["item-renderer-id"] === "string") {
    var itemRendererPrototype = document.getElementById(options["item-renderer-id"]);
    if(itemRendererPrototype !== null) {
      itemRenderer = itemRendererPrototype.cloneNode(true);
      if(itemRenderer !== null) {
        itemRenderer.removeAttribute("id")
      }
    }
  }
  if(options["item-template"] instanceof Object) {
    itemRules = tt.rules.createRules(options["item-template"])
  }
  if(itemRenderer !== null) {
    return new tt.view.ListViewHelper(itemRenderer, itemRules)
  }
  return null
};
tt.view.ListView = function(helper) {
  this.__helper = helper;
  this.__items = {}
};
tt.view.ListView.NAME = "list";
tt.view.ListView.prototype.applyTransformation = function(element, dataNode) {
  var oldItems = this.__items;
  var newItems = {};
  var dataNodes = dataNode.growChildren();
  var i = 0, l = dataNodes.length;
  while(i < l) {
    var itemDataNode = dataNodes[i];
    var itemTemplate = null;
    var key = this.__helper.evaluateKey(itemDataNode);
    if(oldItems[key] === undefined) {
      itemTemplate = this.__helper.createItem(element)
    }else {
      itemTemplate = oldItems[key];
      delete oldItems[key]
    }
    if(itemTemplate !== null) {
      itemTemplate.applyData(itemDataNode);
      newItems[key] = itemTemplate
    }
    i += 1
  }
  for(key in oldItems) {
    this.__helper.removeItem(element, oldItems[key])
  }
  this.__items = newItems
};
tt.view.AttributeViewHelper = function(names) {
  this.__attributeNames = names
};
tt.view.AttributeViewHelper.prototype.setAttribute = function(element, value) {
  var i = 0, l = this.__attributeNames.length;
  while(i < l) {
    var name = this.__attributeNames[i];
    if(element[name] === undefined || name === "style") {
      element.setAttribute(name, value)
    }else {
      element[name] = value
    }
    i += 1
  }
};
tt.view.AttributeViewHelper.prototype.removeAttribute = function(element) {
  var i = 0, l = this.__attributeNames.length;
  while(i < l) {
    var name = this.__attributeNames[i];
    if(element[name] === undefined) {
      element.removeAttribute(name)
    }else {
      element[name] = ""
    }
    i += 1
  }
};
tt.view.AttributeViewHelper.create = function(options) {
  if(typeof options["name"] === "string") {
    return new tt.view.AttributeViewHelper([options["name"]])
  }else {
    if(options["name"] instanceof Array) {
      return new tt.view.AttributeViewHelper(util.toStringArray(options["name"]))
    }
  }
  return null
};
tt.view.AttributeView = function(helper) {
  this.__lastValue = null;
  this.__helper = helper
};
tt.view.AttributeView.NAME = "attr";
tt.view.AttributeView.prototype.applyTransformation = function(element, dataNode) {
  var value = dataNode.getValue();
  if(value !== this.__lastValue) {
    if(value !== null) {
      this.__helper.setAttribute(element, value)
    }else {
      this.__helper.removeAttribute(element)
    }
    this.__lastValue = value
  }
};
tt.view.CaseViewHelper = function(cases, caseClasses, regExps, regExpsClasses) {
  this.__cases = cases;
  this.__caseClasses = caseClasses;
  this.__regExps = regExps;
  this.__regExpsClasses = regExpsClasses
};
tt.view.CaseViewHelper.prototype.apply = function(element, value) {
  var str = value === null ? "" : value.toString();
  var i = 0, l = this.__cases.length;
  while(i < l) {
    if(this.__caseClasses[i] !== undefined) {
      util.dom.setClassExist(element, this.__caseClasses[i], this.__cases[i] === str)
    }
    i += 1
  }
  i = 0;
  l = this.__regExps.length;
  while(i < l) {
    if(this.__regExpsClasses[i] !== undefined) {
      util.dom.setClassExist(element, this.__regExpsClasses[i], this.__regExps[i].test(str))
    }
    i += 1
  }
};
tt.view.CaseViewHelper.create = function(options) {
  var isRegExp = Boolean(options["is-reg-exp"]);
  var cases = [];
  var caseClasses = [];
  var regExps = [];
  var regExpClasses = [];
  for(var key in options["cases"]) {
    if(isRegExp) {
      try {
        regExps.push(new RegExp(key));
        regExpClasses.push(options["cases"][key])
      }catch(error) {
      }
    }else {
      cases.push(key);
      caseClasses.push(options["cases"][key])
    }
  }
  return new tt.view.CaseViewHelper(cases, caseClasses, regExps, regExpClasses)
};
tt.view.CaseView = function(helper) {
  this.__helper = helper;
  this.__lastValue = undefined
};
tt.view.CaseView.NAME = "case";
tt.view.CaseView.prototype.applyTransformation = function(element, dataNode) {
  var value = dataNode.getValue();
  if(this.__lastValue !== value) {
    this.__helper.apply(element, value);
    this.__lastValue = value
  }
};
tt.view.TextView = function() {
  this.__lastValue = undefined
};
tt.view.TextView.NAME = "text";
tt.view.TextView.prototype.applyTransformation = function(element, dataNode) {
  var value = dataNode.getValue();
  if(this.__lastValue !== value) {
    element.innerHTML = this.__lastValue = value
  }
};
tt.view.createView = function(type, helper) {
  if(type === tt.view.TextView.NAME) {
    return new tt.view.TextView
  }
  if(type === tt.view.AttributeView.NAME && helper instanceof tt.view.AttributeViewHelper) {
    return new tt.view.AttributeView(helper)
  }
  if(type === tt.view.ListView.NAME && helper instanceof tt.view.ListViewHelper) {
    return new tt.view.ListView(helper)
  }
  if(type === tt.view.CaseView.NAME && helper instanceof tt.view.CaseViewHelper) {
    return new tt.view.CaseView(helper)
  }
  return null
};
tt.view.createViewHelper = function(type, data) {
  if(type === tt.view.ListView.NAME) {
    return tt.view.ListViewHelper.create(data)
  }
  if(type === tt.view.AttributeView.NAME) {
    return tt.view.AttributeViewHelper.create(data)
  }
  if(type === tt.view.CaseView.NAME) {
    return tt.view.CaseViewHelper.create(data)
  }
  return null
};

