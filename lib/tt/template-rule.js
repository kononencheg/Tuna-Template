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
 * Базовый класс правил элемента шаблона.
 *
 * @constructor
 * @param {string} type Тип правила.
 * @param {string} className Имя CSS-класса целевых DOM-элементов.
 * @param {string} dataPath Путь к данным в для отображения.
 * @param {!tt.view.helpers.ITemplateViewHelper} viewHelper Правила отображения.
 */
tt.TemplateRule = function(type, className, dataPath, viewHelper) {

  /**
   * @type {string}
   */
  this.__type = type;

  /**
   * @type {string}
   */
  this.__className = className;

  /**
   * @type {!tt.data.PathEvaluator}
   */
  this.__pathEvaluator = new tt.data.PathEvaluator(dataPath);

  /**
   * @type {!tt.view.helpers.ITemplateViewHelper}
   */
  this.__viewHelper = viewHelper;
};


/**
 * @param {!Node} parent Родительский элемент отображения.
 * @return {!Array.<!tt.TemplateUnit>} Созданные элементы трансформации.
 */
tt.TemplateRule.prototype.createTemplateUnits = function(parent) {
  var elements = this.__findTemplateElements(parent);

  var i = 0,
      l = elements.length;

  var items = new Array(l);

  while (i < l) {
    items[i] = new tt.TemplateUnit(
        this.__viewHelper.createView(elements[i]), this.__pathEvaluator);

    i += 1;
  }

  return items;
};


/**
 * @param {!Node} parent DOM-элемент в котором необходимо провести поиск.
 * @return {!Array.<!Node>} Массив найденных элементов.
 */
tt.TemplateRule.prototype.__findTemplateElements = function(parent) {
  if (util.dom.hasClass(parent, this.__className)) {
    return [parent];
  }

  return util.dom.getElementsByClassName(this.__className, parent);
};

