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
 * Класс объекта взятия данных по выбранному пути.
 *
 * @constructor
 * @param {string} path Путь к данным.
 */
tt.data.PathEvaluator = function(path) {

  /**
   * @type {!Array.<string>}
   */
  this.__path = path.split('/');
};


/**
 * Выборка данных из узла по установленному пути.
 *
 * @param {!tt.data.DataNode} node Узел данных для выборки.
 * @return {!tt.data.DataNode} Узел-результат выборки.
 */
tt.data.PathEvaluator.prototype.evaluate = function(node) {
  return this.__applyToken(node, 0);
};


/**
 * Функция рекурсивной выборки данных.
 *
 * @param {!tt.data.DataNode} node Узел для выборки.
 * @param {number} index Индекс элемента пути.
 * @return {!tt.data.DataNode} Ррезультат выборки.
 */
tt.data.PathEvaluator.prototype.__applyToken = function(node, index) {
  var token = this.__path[index];
  if (token !== undefined && node.getValue() !== null) {
    return this.__applyToken(this.__fetchNode(token, node), index + 1);
  }

  return node;
};


/**
 * Применение элемента ключа пути к узлу данных.
 *
 * @param {string} token Ключ пути.
 * @param {!tt.data.DataNode} node Узел данных.
 * @return {!tt.data.DataNode} Результат применения.
 */
tt.data.PathEvaluator.prototype.__fetchNode = function(token, node) {
  if (token === '') { return node.getRoot(); }
  if (token === '$') { return node.getKey(); }
  if (token === '.') { return node; }
  if (token === '..') { return node.getParent(); }

  return node.growChild(token);
};
