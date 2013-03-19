var tt = {};
tt.VERSION = "0.1.0";
tt.rules = {};
tt.data = {};
tt.view = {};
tt.view.helpers = {};
tt.createTemplate = function(target, sign) {
  return tt.createTemplateFromRules(target, tt.createRules(sign))
};
tt.createTemplateFromRules = function(target, rules) {
  var units = [];
  var i = 0, l = rules.length;
  while(i < l) {
    units = units.concat(rules[i].createTemplateUnits(target));
    i += 1
  }
  return new tt.Template(target, units)
};
tt.createRules = function(sign) {
  var rules = [];
  for(var key in sign) {
    var atIndex = key.indexOf("@");
    var colonIndex = key.indexOf(":");
    if(atIndex !== -1 && colonIndex !== -1 && colonIndex > atIndex) {
      var type = key.substring(0, atIndex);
      var viewHelper = tt.view.createViewHelper(type, sign[key]);
      if(viewHelper !== null) {
        rules.push(new tt.TemplateRule(type, key.substring(atIndex + 1, colonIndex), key.substring(colonIndex + 1), viewHelper))
      }
    }
  }
  return rules
};
tt.Template = function(target, units) {
  this.__target = target;
  this.__units = units
};
tt.Template.prototype.getTarget = function() {
  return this.__target
};
tt.Template.prototype.processData = function(data) {
  this.applyData(new tt.data.DataNode(data))
};
tt.Template.prototype.applyData = function(dataNode) {
  var i = 0, l = this.__units.length;
  while(i < l) {
    this.__units[i].applyData(dataNode);
    i += 1
  }
};
tt.TemplateUnit = function(view, pathEvaluator) {
  this.__view = view;
  this.__pathEvaluator = pathEvaluator
};
tt.TemplateUnit.prototype.applyData = function(dataNode) {
  this.__view.applyTransformation(this.__pathEvaluator.evaluate(dataNode))
};
tt.TemplateRule = function(type, className, dataPath, viewHelper) {
  this.__type = type;
  this.__className = className;
  this.__pathEvaluator = new tt.data.PathEvaluator(dataPath);
  this.__viewHelper = viewHelper
};
tt.TemplateRule.prototype.createTemplateUnits = function(parent) {
  var elements = this.__findTemplateElements(parent);
  var i = 0, l = elements.length;
  var items = new Array(l);
  while(i < l) {
    items[i] = new tt.TemplateUnit(this.__viewHelper.createView(elements[i]), this.__pathEvaluator);
    i += 1
  }
  return items
};
tt.TemplateRule.prototype.__findTemplateElements = function(parent) {
  if(util.dom.hasClass(parent, this.__className)) {
    return[parent]
  }
  return util.dom.getElementsByClassName(this.__className, parent)
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
  this.__parent = opt_parent || null;
  this.__key = opt_key === undefined ? "" : opt_key;
  this.__keyNode = null;
  this.__children = {}
};
tt.data.DataNode.__NULL_NODE = new tt.data.DataNode(null);
tt.data.DataNode.prototype.getParent = function() {
  return this.__parent || tt.data.DataNode.__NULL_NODE
};
tt.data.DataNode.prototype.getKey = function() {
  if(this.__keyNode === null) {
    this.__keyNode = new tt.data.DataNode(this.__key)
  }
  return this.__keyNode
};
tt.data.DataNode.prototype.getRoot = function() {
  return this.__parent !== null ? this.__parent.getRoot() : this
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
    return tt.data.DataNode.__NULL_NODE
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
tt.view.helpers.ITemplateViewHelper = function() {
};
tt.view.helpers.ITemplateViewHelper.prototype.createView = function(element) {
};
tt.view.helpers.SimpleViewHelper = function() {
};
tt.view.helpers.SimpleViewHelper.prototype.createView = function(element) {
  return new tt.view.SimpleView(element, this)
};
tt.view.helpers.SimpleViewHelper.prototype.process = function(element, value) {
};
tt.view.helpers.CaseViewHelper = function(cases, caseClasses, regExps, regExpsClasses) {
  this.__cases = cases;
  this.__caseClasses = caseClasses;
  this.__regExps = regExps;
  this.__regExpsClasses = regExpsClasses
};
util.inherits(tt.view.helpers.CaseViewHelper, tt.view.helpers.SimpleViewHelper);
tt.view.helpers.CaseViewHelper.prototype.process = function(element, value) {
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
tt.view.helpers.TextViewHelper = function(pattern) {
  this.__pattern = pattern
};
util.inherits(tt.view.helpers.TextViewHelper, tt.view.helpers.SimpleViewHelper);
tt.view.helpers.TextViewHelper.prototype.process = function(element, value) {
  if(this.__pattern.length === 0) {
    element.innerHTML = value
  }else {
    element.innerHTML = this.__pattern.join(value)
  }
};
tt.view.helpers.AttributeViewHelper = function(name, pattern) {
  this.__pattern = pattern;
  this.__attributeName = name
};
util.inherits(tt.view.helpers.AttributeViewHelper, tt.view.helpers.SimpleViewHelper);
tt.view.helpers.AttributeViewHelper.prototype.process = function(element, value) {
  var name = this.__attributeName;
  if(value !== null) {
    var attrValue = this.__pattern.length > 0 ? this.__pattern.join(value) : value;
    if(element[name] === undefined || name === "style") {
      element.setAttribute(name, attrValue)
    }else {
      element[name] = attrValue
    }
  }else {
    if(element[name] === undefined) {
      element.removeAttribute(name)
    }else {
      element[name] = ""
    }
  }
};
tt.view.helpers.ListViewHelper = function(itemRenderer, itemRules, opt_keyPath) {
  this.__itemRenderer = itemRenderer;
  this.__itemRules = itemRules;
  this.__keyPathEvaluator = opt_keyPath === undefined ? null : new tt.data.PathEvaluator(opt_keyPath)
};
tt.view.helpers.ListViewHelper.prototype.createView = function(element) {
  return new tt.view.ListView(element, this)
};
tt.view.helpers.ListViewHelper.prototype.evaluateKey = function(dataNode) {
  if(this.__keyPathEvaluator !== null) {
    return this.__keyPathEvaluator.evaluate(dataNode).getValue()
  }
  return dataNode.getKey().getValue()
};
tt.view.helpers.ListViewHelper.prototype.createItem = function(parent) {
  var target = this.__itemRenderer.cloneNode(true);
  if(target !== null) {
    parent.appendChild(target);
    return tt.createTemplateFromRules(target, this.__itemRules)
  }
  return null
};
tt.view.helpers.ListViewHelper.prototype.removeItem = function(parent, item) {
  parent.removeChild(item.getTarget())
};
tt.view.ITemplateView = function() {
};
tt.view.ITemplateView.prototype.applyTransformation = function(dataNode) {
};
tt.view.SimpleView = function(target, helper) {
  this.__target = target;
  this.__helper = helper;
  this.__lastValue = undefined
};
tt.view.SimpleView.prototype.applyTransformation = function(dataNode) {
  var value = dataNode.getValue();
  if(this.__lastValue !== value) {
    this.__helper.process(this.__target, value);
    this.__lastValue = value
  }
};
tt.view.ListView = function(target, helper) {
  this.__target = target;
  this.__helper = helper;
  this.__items = {}
};
tt.view.ListView.prototype.applyTransformation = function(dataNode) {
  var oldItems = this.__items;
  var newItems = {};
  var dataNodes = dataNode.growChildren();
  var i = 0, l = dataNodes.length;
  while(i < l) {
    var itemDataNode = dataNodes[i];
    var itemTemplate = null;
    var key = this.__helper.evaluateKey(itemDataNode);
    if(oldItems[key] === undefined) {
      itemTemplate = this.__helper.createItem(this.__target)
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
    this.__helper.removeItem(this.__target, oldItems[key])
  }
  this.__items = newItems
};
tt.view.TEXT = "text";
tt.view.ATTR = "attr";
tt.view.CASE = "case";
tt.view.LIST = "list";
tt.view.createViewHelper = function(type, options) {
  switch(type) {
    case tt.view.TEXT:
      return tt.view.__createTextViewHelper(options);
    case tt.view.ATTR:
      return tt.view.__createAttributeViewHelper(options);
    case tt.view.CASE:
      return tt.view.__createCaseViewHelper(options);
    case tt.view.LIST:
      return tt.view.__createListViewHelper(options)
  }
  return null
};
tt.view.__createListViewHelper = function(options) {
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
    itemRules = tt.createRules(options["item-template"])
  }
  if(itemRenderer !== null) {
    return new tt.view.helpers.ListViewHelper(itemRenderer, itemRules)
  }
  return null
};
tt.view.__createTextViewHelper = function(options) {
  var pattern = [];
  if(typeof options["pattern"] === "string") {
    pattern = options["pattern"].split("$$")
  }
  return new tt.view.helpers.TextViewHelper(pattern)
};
tt.view.__createAttributeViewHelper = function(options) {
  var pattern = [];
  if(typeof options["pattern"] === "string") {
    pattern = options["pattern"].split("$$")
  }
  if(typeof options["name"] === "string") {
    return new tt.view.helpers.AttributeViewHelper(options["name"], pattern)
  }
  return null
};
tt.view.__createCaseViewHelper = function(options) {
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
  return new tt.view.helpers.CaseViewHelper(cases, caseClasses, regExps, regExpClasses)
};

