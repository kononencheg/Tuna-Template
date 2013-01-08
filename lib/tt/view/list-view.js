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
 * @constructor
 * @implements {tt.view.ITemplateView}
 * @param {!Node} target Элемент отображения.
 * @param {!tt.view.helpers.ListViewHelper} helper Объект поддержки
 *    дополнительных настроек.
 */
tt.view.ListView = function(target, helper) {

  /**
   * @type {!Node}
   */
  this.__target = target;

  /**
   * @type {!tt.view.helpers.ListViewHelper}
   */
  this.__helper = helper;

  /**
   * @type {!Object.<*, !tt.Template>}
   */
  this.__items = {};
};


/**
 * @inheritDoc
 */
tt.view.ListView.prototype.applyTransformation = function(dataNode) {
  var oldItems = this.__items;
  var newItems = {};

  var dataNodes = dataNode.growChildren();

  var i = 0,
      l = dataNodes.length;

  while (i < l) {
    var itemDataNode = dataNodes[i];
    var itemTemplate = null;

    var key = this.__helper.evaluateKey(itemDataNode);

    if (oldItems[key] === undefined) {
      itemTemplate = this.__helper.createItem(this.__target);
    } else {
      itemTemplate = oldItems[key];
      delete oldItems[key];
    }

    if (itemTemplate !== null) {
      itemTemplate.applyData(itemDataNode);

      newItems[key] = itemTemplate;
    }

    i += 1;
  }

  for (key in oldItems) {
    this.__helper.removeItem(this.__target, oldItems[key]);
  }

  this.__items = newItems;
};
