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
 * @param {!Array.<string>} names Имя аттрибута.
 */
tt.view.AttributeViewHelper = function(names) {

  /**
   * @type {!Array.<string>}
   */
  this.__attributeNames = names;
};


/**
 * @param {!Node} element Элемент.
 * @param {*} value Значение.
 */
tt.view.AttributeViewHelper.prototype.setAttribute = function(element, value) {
  var i = 0,
      l = this.__attributeNames.length;

  while (i < l) {
    var name = this.__attributeNames[i];

    if (element[name] === undefined || name === 'style') {
      element.setAttribute(name, value);
    } else {
      element[name] = value;
    }

    i += 1;
  }
};


/**
 * @param {!Node} element Элемент.
 */
tt.view.AttributeViewHelper.prototype.removeAttribute = function(element) {
  var i = 0,
      l = this.__attributeNames.length;

  while (i < l) {
    var name = this.__attributeNames[i];

    if (element[name] === undefined) {
      element.removeAttribute(name);
    } else {
      element[name] = '';
    }

    i += 1;
  }
};


/**
 * @param {!Object} options Настрокий.
 * @return {tt.view.ITemplateViewHelper} Объект помощи отрисовке.
 */
tt.view.AttributeViewHelper.create = function(options) {
  if (typeof options['name'] === 'string') {
    return new tt.view.AttributeViewHelper([options['name']]);
  } else if (options['name'] instanceof Array) {
    return new tt.view.AttributeViewHelper(util.toStringArray(options['name']));
  }

  return null;
};
