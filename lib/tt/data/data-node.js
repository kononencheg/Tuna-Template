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



/**
 * Узел парсинга объекта данных передаваемого шаблону.
 *
 * @constructor
 * @param {*} value Данные узла.
 * @param {!tt.data.DataNode=} opt_parent Родительский узел данных.
 * @param {(number|string)=} opt_key Ключ узла данных в родительском.
 */
tt.data.DataNode = function(value, opt_parent, opt_key) {
  /**
     * @type {*}
     */
  this.__value = value;

  /**
     * @type {tt.data.DataNode}
     */
  this.__parent = opt_parent || null;

  /**
     * @type {number|string}
     */
  this.__key = opt_key === undefined ? '' : opt_key;

  /**
     * @type {tt.data.DataNode}
     */
  this.__keyNode = null;

  /**
     * @type {!Object.<(number|string), !tt.data.DataNode>}
     */
  this.__children = {};
};


/**
 * Нулевой узел данных.
 *
 * @type {!tt.data.DataNode}
 */
tt.data.DataNode.__NULL_NODE = new tt.data.DataNode(null);


/**
 * Родительский узел данных.
 *
 * @return {!tt.data.DataNode} Родительский узел данных.
 */
tt.data.DataNode.prototype.getParent = function() {
  return this.__parent || tt.data.DataNode.__NULL_NODE;
};


/**
 * Получение узла-ключа данных текущего узла.
 *
 * @return {!tt.data.DataNode} Узел-ключ данных текущего узла.
 */
tt.data.DataNode.prototype.getKey = function() {
  if (this.__keyNode === null) {
    this.__keyNode = new tt.data.DataNode(this.__key);
  }

  return this.__keyNode;
};


/**
 * @return {!tt.data.DataNode} Корневой узел данных.
 */
tt.data.DataNode.prototype.getRoot = function() {
  return this.__parent !== null ? this.__parent.getRoot() : this;
};


/**
 * Получение значений узла данных.
 *
 * @return {*} Значение узла данных.
 */
tt.data.DataNode.prototype.getValue = function() {
  return this.__value;
};


/**
 * Создание и возвращение дочернего узда данных по ключу.
 *
 * @param {(number|string)} key Ключ дочернего узла.
 * @return {!tt.data.DataNode} Новый узел данных.
 */
tt.data.DataNode.prototype.growChild = function(key) {
  if (this.__children[key] === undefined) {
    if (this.__value !== null && this.__value[key] !== undefined) {
      var node = new tt.data.DataNode(this.__value[key], this, key);

      this.__children[key] = node;

      return node;
    }

    return tt.data.DataNode.__NULL_NODE;
  }

  return this.__children[key];
};


/**
 * Создание и возвращение дочернего узда данных.
 *
 * @return {!Array.<!tt.data.DataNode>} Массив узлов данных.
 */
tt.data.DataNode.prototype.growChildren = function() {
  if (this.__value instanceof Array) {
    var i = 0,
        l = this.__value.length;

    var items = new Array(l);

    while (i < l) {
      if (this.__children[i] === undefined) {
        this.__children[i] = new tt.data.DataNode(this.__value[i], this, i);
      }

      items[i] = this.__children[i];

      i += 1;
    }

    return items;
  } else {
    var nodes = [];

    for (var k in this.__value) {
      if (this.__children[k] === undefined) {
        this.__children[k] = new tt.data.DataNode(this.__value[k], this, k);
      }

      nodes.push(this.__children[k]);
    }

    return nodes;
  }
};
