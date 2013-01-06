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
 * @implements {tt.view.ITemplateViewHelper}
 * @param {!Node} itemRenderer Прототип элементов списка.
 * @param {!Array.<!tt.rule.TemplateRule>} itemRules Шаблон элементов списка.
 * @param {string=} opt_keyPath Путь к ключу элемента.
 */
tt.view.ListViewHelper = function(itemRenderer, itemRules, opt_keyPath) {

  /**
   * @type {!Node}
   */
  this.__itemRenderer = itemRenderer;

  /**
   * @type {!Array.<!tt.rule.TemplateRule>}
   */
  this.__itemRules = itemRules;

  /**
   * @type {tt.data.PathEvaluator}
   */
  this.__keyPathEvaluator = opt_keyPath === undefined ?
      null : new tt.data.PathEvaluator(opt_keyPath);
};


/**
 * @param {!tt.data.DataNode} dataNode Узел данных.
 * @return {*} Ключ.
 */
tt.view.ListViewHelper.prototype.evaluateKey = function(dataNode) {
  if (this.__keyPathEvaluator !== null) {
    return this.__keyPathEvaluator.evaluate(dataNode).getValue();
  }

  return dataNode.getKey().getValue();
};


/**
 * @param {!Node} parent Список.
 * @return {tt.tmpl.Root} Созданный элемент списка.
 */
tt.view.ListViewHelper.prototype.createItem = function(parent) {
  var target = this.__itemRenderer.cloneNode(true);
  if (target !== null) {
    parent.appendChild(target);

    return tt.rule.createTemplateRoot(target, this.__itemRules);
  }

  return null;
};


/**
 * @param {!Node} parent Список.
 * @param {!tt.tmpl.Root} item Элемент списка.
 */
tt.view.ListViewHelper.prototype.removeItem = function(parent, item) {
  parent.removeChild(item.getTarget());
};
