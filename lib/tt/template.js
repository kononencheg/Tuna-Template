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
 * Класс шаблона.
 *
 * @constructor
 * @param {!Node} target Целевой элемент шаблона.
 * @param {!Array.<!tt.TemplateUnit>} units Узлы шаблонизатора.
 */
tt.Template = function(target, units) {

  /**
   * @type {!Node}
   */
  this.__target = target;

  /**
   * @type {!Array.<!tt.TemplateUnit>}
   */
  this.__units = units;
};


/**
 * @return {!Node} Целевой элемент шаблона.
 */
tt.Template.prototype.getTarget = function() {
  return this.__target;
};


/**
 * @param {*} data Данные для отображения.
 */
tt.Template.prototype.processData = function(data) {
  this.applyData(new tt.data.DataNode(data));
};


/**
 * @param {!tt.data.DataNode} dataNode Узел данных.
 */
tt.Template.prototype.applyData = function(dataNode) {
  var i = 0,
      l = this.__units.length;

  while (i < l) {
    this.__units[i].applyData(dataNode);

    i += 1;
  }
};
